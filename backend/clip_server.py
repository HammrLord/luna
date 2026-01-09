"""
CLIP Local Server
Runs CLIP model locally for fast image classification and embeddings
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import clip
import torch
from PIL import Image
import io
import base64
import numpy as np
import ssl
import traceback

# Bypass SSL verification for model download (common issue on macOS)
ssl._create_default_https_context = ssl._create_unverified_context

app = Flask(__name__)
CORS(app)

# Increase max content length to 50MB for large base64 images
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50 MB

# Load CLIP model
device = "mps" if torch.backends.mps.is_available() else "cpu"  # Use Apple Silicon GPU
model, preprocess = clip.load("ViT-B/32", device=device)

print(f"✅ CLIP loaded on device: {device}")


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "device": device, "model": "ViT-B/32"})


@app.route('/classify', methods=['POST'])
def classify_image():
    """
    Classify image with custom labels
    
    POST /classify
    Form data:
        - image: image file or base64
        - labels: comma-separated list of labels
    """
    try:
        # Get image
        if 'image' in request.files:
            image_file = request.files['image']
            image = Image.open(image_file.stream).convert('RGB')
        elif 'image_base64' in request.form:
            image_data = base64.b64decode(request.form['image_base64'])
            image = Image.open(io.BytesIO(image_data)).convert('RGB')
        else:
            return jsonify({"error": "No image provided"}), 400

        # Get labels
        labels_str = request.form.get('labels', '')
        labels = [label.strip() for label in labels_str.split(',')]
        
        if not labels:
            return jsonify({"error": "No labels provided"}), 400

        # Preprocess
        image_input = preprocess(image).unsqueeze(0).to(device)
        text_inputs = clip.tokenize(labels).to(device)

        # Calculate features
        with torch.no_grad():
            image_features = model.encode_image(image_input)
            text_features = model.encode_text(text_inputs)
            
            # Normalize
            image_features /= image_features.norm(dim=-1, keepdim=True)
            text_features /= text_features.norm(dim=-1, keepdim=True)
            
            # Calculate similarity
            similarity = (100.0 * image_features @ text_features.T).softmax(dim=-1)
            values, indices = similarity[0].topk(len(labels))

        # Format results
        results = []
        for value, index in zip(values, indices):
            results.append({
                "label": labels[index],
                "probability": float(value),
                "confidence": float(value * 100)
            })

        return jsonify({
            "success": True,
            "predictions": results,
            "top_prediction": results[0]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/embed', methods=['POST'])
def get_embedding():
    """
    Get image embedding vector
    
    POST /embed
    Form data:
        - image: image file or base64
    """
    try:
        # Get image
        if 'image' in request.files:
            image_file = request.files['image']
            image = Image.open(image_file.stream).convert('RGB')
        elif 'image_base64' in request.form:
            image_data = base64.b64decode(request.form['image_base64'])
            image = Image.open(io.BytesIO(image_data)).convert('RGB')
        else:
            return jsonify({"error": "No image provided"}), 400

        # Preprocess
        image_input = preprocess(image).unsqueeze(0).to(device)

        # Get embedding
        with torch.no_grad():
            image_features = model.encode_image(image_input)
            image_features /= image_features.norm(dim=-1, keepdim=True)

        embedding = image_features.cpu().numpy()[0].tolist()

        return jsonify({
            "success": True,
            "embedding": embedding,
            "dimension": len(embedding)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/facial-features', methods=['POST'])
def detect_facial_features():
    """
    Detect facial features for PCOS assessment
    
    Classifies: hirsutism severity, acne severity, skin condition
    """
    try:
        # Get image
        if 'image' in request.files:
            image_file = request.files['image']
            image = Image.open(image_file.stream).convert('RGB')
        elif 'image_base64' in request.form:
            image_data = base64.b64decode(request.form['image_base64'])
            image = Image.open(io.BytesIO(image_data)).convert('RGB')
        else:
            return jsonify({"error": "No image provided"}), 400

        # Facial hair labels
        hair_labels = [
            "no facial hair",
            "minimal facial hair",
            "moderate facial hair on upper lip",
            "moderate facial hair on chin",
            "heavy facial hair on face"
        ]

        # Acne labels
        acne_labels = [
            "clear skin",
            "mild acne with few pimples",
            "moderate acne with several pimples",
            "severe acne with many pimples and inflammation"
        ]

        # Preprocess
        image_input = preprocess(image).unsqueeze(0).to(device)

        # Analyze hair
        hair_tokens = clip.tokenize(hair_labels).to(device)
        with torch.no_grad():
            image_features = model.encode_image(image_input)
            hair_features = model.encode_text(hair_tokens)
            
            image_features_norm = image_features / image_features.norm(dim=-1, keepdim=True)
            hair_features_norm = hair_features / hair_features.norm(dim=-1, keepdim=True)
            
            hair_similarity = (100.0 * image_features_norm @ hair_features_norm.T).softmax(dim=-1)
            hair_values, hair_indices = hair_similarity[0].topk(len(hair_labels))

        # Analyze acne
        acne_tokens = clip.tokenize(acne_labels).to(device)
        with torch.no_grad():
            acne_features = model.encode_text(acne_tokens)
            acne_features_norm = acne_features / acne_features.norm(dim=-1, keepdim=True)
            
            acne_similarity = (100.0 * image_features_norm @ acne_features_norm.T).softmax(dim=-1)
            acne_values, acne_indices = acne_similarity[0].topk(len(acne_labels))

        return jsonify({
            "success": True,
            "hirsutism": {
                "top_match": hair_labels[hair_indices[0]],
                "confidence": float(hair_values[0] * 100),
                "severity_score": int(hair_indices[0])  # 0-4
            },
            "acne": {
                "top_match": acne_labels[acne_indices[0]],
                "confidence": float(acne_values[0] * 100),
                "severity_score": int(acne_indices[0])  # 0-3
            }
        })

    except Exception as e:
        print(f"❌ FACIAL FEATURES ERROR: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route('/food-analyze', methods=['POST'])
def analyze_food():
    """
    Analyze food image for PCOS compatibility
    
    Classifies: Food type, Glycemic Index level, Inflammation risk, PCOS suitability
    Returns structured analysis mimicking the FoodAnalysisResult interface
    """
    try:
        # Get image from JSON body (to bypass form data size limits)
        data = request.get_json() or {}
        
        if 'image' in request.files:
            image_file = request.files['image']
            image = Image.open(image_file.stream).convert('RGB')
        elif 'image_base64' in data:
            raw_b64 = data['image_base64']
            # Strip data URI prefix if present
            if raw_b64.startswith('data:'):
                raw_b64 = raw_b64.split(',', 1)[1] if ',' in raw_b64 else raw_b64
            print(f"📷 Received base64 of length: {len(raw_b64)}")
            image_data = base64.b64decode(raw_b64)
            image = Image.open(io.BytesIO(image_data)).convert('RGB')
            print(f"✅ Image decoded: {image.size}")
        elif 'image_base64' in request.form:
            # Fallback to form data for smaller images
            raw_b64 = request.form['image_base64']
            if raw_b64.startswith('data:'):
                raw_b64 = raw_b64.split(',', 1)[1] if ',' in raw_b64 else raw_b64
            print(f"📷 Received base64 (form) of length: {len(raw_b64)}")
            image_data = base64.b64decode(raw_b64)
            image = Image.open(io.BytesIO(image_data)).convert('RGB')
            print(f"✅ Image decoded: {image.size}")
        else:
            return jsonify({"error": "No image provided"}), 400

        # Preprocess image once
        image_input = preprocess(image).unsqueeze(0).to(device)
        
        with torch.no_grad():
            image_features = model.encode_image(image_input)
            image_features_norm = image_features / image_features.norm(dim=-1, keepdim=True)

        # 1. Food category labels
        food_labels = [
            "a plate of vegetables and salad",
            "a plate of rice or grains",
            "fried food or fast food",
            "a bowl of soup or stew",
            "bread or pastries",
            "fruits",
            "meat or protein dish",
            "sweets or desserts",
            "Indian curry dish",
            "healthy balanced meal"
        ]
        
        food_tokens = clip.tokenize(food_labels).to(device)
        with torch.no_grad():
            food_features = model.encode_text(food_tokens)
            food_features_norm = food_features / food_features.norm(dim=-1, keepdim=True)
            food_sim = (100.0 * image_features_norm @ food_features_norm.T).softmax(dim=-1)
            food_values, food_indices = food_sim[0].topk(3)
        
        main_food = food_labels[food_indices[0]]
        food_confidence = float(food_values[0])

        # 1.5 Specific food item identification
        specific_items = [
            # Vegetables
            "broccoli", "spinach", "carrots", "tomatoes", "cucumber", "lettuce",
            "onions", "bell peppers", "cauliflower", "cabbage", "peas", "beans",
            "mushrooms", "zucchini", "eggplant", "okra", "potato", "sweet potato",
            # Proteins
            "chicken", "fish", "eggs", "paneer", "tofu", "dal lentils", "chickpeas",
            "mutton", "prawns", "beef", "lamb", "cottage cheese",
            # Grains
            "rice", "roti chapati", "naan bread", "quinoa", "oats", "pasta",
            "white bread", "brown rice", "millet bajra", "wheat",
            # Fruits
            "apple", "banana", "mango", "grapes", "orange", "berries",
            "papaya", "watermelon", "guava", "pomegranate",
            # Dairy
            "milk", "yogurt curd", "cheese", "butter", "ghee",
            # Indian foods
            "biryani", "samosa", "dosa", "idli", "paratha", "pakora",
            "butter chicken", "palak paneer", "chole", "rajma",
            # Other
            "nuts almonds", "salad", "soup", "sandwich", "pizza", "burger",
            "french fries", "noodles", "momos dumplings"
        ]
        
        item_tokens = clip.tokenize(specific_items).to(device)
        with torch.no_grad():
            item_features = model.encode_text(item_tokens)
            item_features_norm = item_features / item_features.norm(dim=-1, keepdim=True)
            item_sim = (100.0 * image_features_norm @ item_features_norm.T).softmax(dim=-1)
            item_values, item_indices = item_sim[0].topk(5)
        
        # Get top 5 identified items with confidence
        identified_items = []
        for i in range(3):
            identified_items.append({
                "name": specific_items[int(item_indices[i])].title(),
                "confidence": round(float(item_values[i]) * 100, 1)
            })
        
        print(f"🍽️ Identified items: {[i['name'] for i in identified_items]}")

        # 2. Glycemic Index classification
        gi_labels = [
            "low glycemic index food like vegetables, legumes, nuts",
            "medium glycemic index food like whole grains, fruits",
            "high glycemic index food like white rice, potatoes, sugar, bread"
        ]
        
        gi_tokens = clip.tokenize(gi_labels).to(device)
        with torch.no_grad():
            gi_features = model.encode_text(gi_tokens)
            gi_features_norm = gi_features / gi_features.norm(dim=-1, keepdim=True)
            gi_sim = (100.0 * image_features_norm @ gi_features_norm.T).softmax(dim=-1)
            gi_values, gi_indices = gi_sim[0].topk(1)
        
        gi_levels = ["Low", "Medium", "High"]
        glycemic_index = gi_levels[int(gi_indices[0])]
        gi_confidence = float(gi_values[0])

        # 3. PCOS Compatibility
        pcos_labels = [
            "PCOS friendly anti-inflammatory healthy food",
            "moderately suitable food for hormonal health",
            "inflammatory processed food to avoid for PCOS"
        ]
        
        pcos_tokens = clip.tokenize(pcos_labels).to(device)
        with torch.no_grad():
            pcos_features = model.encode_text(pcos_tokens)
            pcos_features_norm = pcos_features / pcos_features.norm(dim=-1, keepdim=True)
            pcos_sim = (100.0 * image_features_norm @ pcos_features_norm.T).softmax(dim=-1)
            pcos_values, pcos_indices = pcos_sim[0].topk(1)
        
        pcos_statuses = ["Safe", "Caution", "Avoid"]
        pcos_status = pcos_statuses[int(pcos_indices[0])]
        pcos_score = int((1 - pcos_indices[0] / 2) * 100)  # Safe=100, Caution=50, Avoid=0
        pcos_confidence = float(pcos_values[0])

        # 4. Protein content estimation
        protein_labels = [
            "high protein food like meat, eggs, fish, paneer, tofu",
            "moderate protein food",
            "low protein carb heavy food"
        ]
        
        protein_tokens = clip.tokenize(protein_labels).to(device)
        with torch.no_grad():
            protein_features = model.encode_text(protein_tokens)
            protein_features_norm = protein_features / protein_features.norm(dim=-1, keepdim=True)
            protein_sim = (100.0 * image_features_norm @ protein_features_norm.T).softmax(dim=-1)
            protein_values, protein_indices = protein_sim[0].topk(1)

        protein_estimate = [30, 15, 5][int(protein_indices[0])]  # grams estimate

        # Convert tensor indices to native Python ints for JSON serialization
        pcos_idx = int(pcos_indices[0])
        gi_idx = int(gi_indices[0])

        # Build response matching FoodAnalysisResult interface
        return jsonify({
            "success": True,
            "identification": {
                "mainDish": main_food.replace("a plate of ", "").replace("a bowl of ", "").title(),
                "components": [item["name"] for item in identified_items],
                "detailedItems": identified_items,  # With confidence scores
                "approxCalories": int(300 + (pcos_idx * 150))  # Rough estimate
            },
            "metabolicStats": {
                "glycemicIndex": glycemic_index,
                "glycemicLoad": glycemic_index,  # Simplified
                "insulinSpikeRisk": glycemic_index,
                "totalProteing": protein_estimate,
                "totalCarbsg": int(30 + (gi_idx * 20)),
                "totalFiberg": int(15 - (gi_idx * 5)),
                "netCarbsg": int(25 + (gi_idx * 15))
            },
            "pcosCompatibility": {
                "score": int(pcos_score),
                "status": pcos_status,
                "issues": ["High GI detected"] if glycemic_index == "High" else [],
                "positives": ["Good protein content"] if protein_estimate >= 20 else []
            },
            "feedback": {
                "summary": f"Detected {main_food}. {pcos_status} for PCOS diet.",
                "improvementTip": "Add leafy greens for fiber." if glycemic_index == "High" else "Good choice!"
            },
            "confidence": {
                "food": float(food_confidence),
                "gi": float(gi_confidence),
                "pcos": float(pcos_confidence)
            }
        })

    except Exception as e:
        print(f"❌ FOOD ANALYZE ERROR: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("🚀 CLIP server starting on http://localhost:5001")
    print(f"   Device: {device}")
    print(f"   Model: ViT-B/32")
    print("   Endpoints: /health, /classify, /embed, /facial-features, /food-analyze")
    app.run(host='0.0.0.0', port=5001, debug=True)
