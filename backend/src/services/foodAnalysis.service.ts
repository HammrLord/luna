/**
 * Food Analysis Service (Metabolic Vision)
 * 
 * Uses local CLIP Server to analyze meals for PCOS compatibility,
 * Glycemic Index (GI), and Glycemic Load (GL).
 */

export interface FoodAnalysisResult {
    identification: {
        mainDish: string;
        components: string[];
        approxCalories: number;
    };
    metabolicStats: {
        glycemicIndex: 'Low' | 'Medium' | 'High';
        glycemicLoad: 'Low' | 'Medium' | 'High';
        insulinSpikeRisk: 'Low' | 'Medium' | 'High';
        totalProteing: number;
        totalCarbsg: number;
        totalFiberg: number;
        netCarbsg: number;
    };
    pcosCompatibility: {
        score: number;
        status: 'Safe' | 'Caution' | 'Avoid';
        issues: string[];
        positives: string[];
    };
    feedback: {
        summary: string;
        improvementTip: string;
    };
}

export class FoodAnalysisService {

    /**
     * Analyze food image for metabolic impact using local CLIP server
     */
    async analyzeFood(imageBase64: string): Promise<FoodAnalysisResult> {
        try {
            console.log('🍽️ Calling Local CLIP Server for food analysis...');

            // Strip data URI prefix if present
            let cleanBase64 = imageBase64;
            if (cleanBase64.startsWith('data:')) {
                cleanBase64 = cleanBase64.split(',')[1] || cleanBase64;
            }
            console.log(`📷 Sending base64 of length: ${cleanBase64.length}`);

            // Call local CLIP server endpoint with JSON (bypasses form data size limit)
            const response = await fetch('http://localhost:5001/food-analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image_base64: cleanBase64 })
            });

            if (!response.ok) {
                throw new Error(`CLIP Server error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // The CLIP server already returns data in FoodAnalysisResult format
            const result: FoodAnalysisResult = {
                identification: data.identification,
                metabolicStats: data.metabolicStats,
                pcosCompatibility: data.pcosCompatibility,
                feedback: data.feedback
            };

            console.log('✅ Food analysis complete:', result.identification.mainDish);

            return result;

        } catch (error: any) {
            console.error('Food analysis error:', error);
            throw new Error(`Failed to analyze food: ${error.message}`);
        }
    }
}

export const foodAnalysisService = new FoodAnalysisService();
