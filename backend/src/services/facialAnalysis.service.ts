/**
 * Facial Analysis Service
 * 
 * Uses Azure OpenAI GPT-4 Vision to detect hirsutism and acne
 * Simulates computer vision models with specialized prompts
 */

// Local CLIP Server integration
// Uses http://localhost:5001/facial-features


export interface HirsutismScore {
    upperLip: {
        score: number;
        description: string;
        confidence: number;
    };
    chin: {
        score: number;
        description: string;
        confidence: number;
    };
    sideburns: {
        score: number;
        description: string;
        confidence: number;
    };
    totalScore: number;
    classification: 'none' | 'mild' | 'moderate' | 'severe';
    overallConfidence: number;
}

export interface AcneAssessment {
    comedones: number;
    papules: number;
    pustules: number;
    nodules: number;
    totalLesions: number;
    severity: 'none' | 'mild' | 'moderate' | 'severe';
    distribution: string;
    gagsScore: number;
    confidence: number;
}

export interface FacialAnalysisResult {
    hirsutism: HirsutismScore;
    acne: AcneAssessment;
    hyperandrogenismIndicator: {
        probability: number;
        confidence: number;
        reasoning: string;
        keyFindings: string[];
    };
    imageQuality: {
        adequate: boolean;
        issues: string[];
        recommendations: string;
    };
}

export class FacialAnalysisService {

    /**
     * Analyze facial image for hirsutism and acne
     */
    async analyzeFacialFeatures(imageBase64: string): Promise<FacialAnalysisResult> {
        try {
            console.log('🔄 Calling Local CLIP Server for fast analysis...');

            // Prepare form data for CLIP server
            // Since we're in node, we'll send as JSON base64 which the python server accepts
            const formData = new FormData();
            formData.append('image_base64', imageBase64);

            const response = await fetch('http://localhost:5001/facial-features', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `image_base64=${encodeURIComponent(imageBase64)}`
            });

            if (!response.ok) {
                throw new Error(`CLIP Server error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            // Map CLIP response to FacialAnalysisResult interface
            const hirsutismSeverity = data.hirsutism.severity_score;
            const acneSeverity = data.acne.severity_score;

            // Map 0-4 score to classification
            const mapHirsutismClass = (score: number) => {
                if (score === 0) return 'none';
                if (score === 1) return 'mild';
                if (score === 2) return 'moderate';
                return 'severe';
            };

            const mapAcneClass = (score: number) => {
                if (score === 0) return 'none';
                if (score === 1) return 'mild';
                if (score === 2) return 'moderate';
                return 'severe';
            };

            return {
                hirsutism: {
                    upperLip: { score: hirsutismSeverity >= 2 ? hirsutismSeverity : 0, description: "CLIP Detection", confidence: data.hirsutism.confidence },
                    chin: { score: hirsutismSeverity >= 3 ? hirsutismSeverity : 0, description: "CLIP Detection", confidence: data.hirsutism.confidence },
                    sideburns: { score: hirsutismSeverity >= 4 ? hirsutismSeverity : 0, description: "CLIP Detection", confidence: data.hirsutism.confidence },
                    totalScore: hirsutismSeverity,
                    classification: mapHirsutismClass(hirsutismSeverity),
                    overallConfidence: data.hirsutism.confidence
                },
                acne: {
                    comedones: 0, // CLIP cannot count
                    papules: 0,
                    pustules: 0,
                    nodules: 0,
                    totalLesions: 0,
                    severity: mapAcneClass(acneSeverity),
                    distribution: "Generalized (AI Estimate)",
                    gagsScore: acneSeverity * 5, // Rough estimate
                    confidence: data.acne.confidence
                },
                hyperandrogenismIndicator: {
                    probability: (hirsutismSeverity / 4) * 100,
                    confidence: (data.hirsutism.confidence + data.acne.confidence) / 2,
                    reasoning: `Rapid AI Analysis detected ${data.hirsutism.top_match} and ${data.acne.top_match}.`,
                    keyFindings: [data.hirsutism.top_match, data.acne.top_match]
                },
                imageQuality: {
                    adequate: true,
                    issues: [],
                    recommendations: "Ensure good lighting for better accuracy."
                }
            };

        } catch (error: any) {
            console.error('Facial analysis error:', error);
            throw new Error(`Failed to analyze facial features: ${error.message}`);
        }
    }

    /**
     * Calculate overall PCOS facial indicator score
     */
    calculatePCOSFacialScore(analysis: FacialAnalysisResult): {
        score: number;
        level: 'low' | 'moderate' | 'high';
        contributors: string[];
    } {
        const { hirsutism, acne, hyperandrogenismIndicator } = analysis;

        let score = 0;
        const contributors: string[] = [];

        // Hirsutism contribution (0-40 points)
        const hirsutismPoints = (hirsutism.totalScore / 12) * 40;
        score += hirsutismPoints;
        if (hirsutism.totalScore >= 3) {
            contributors.push(`Hirsutism detected (${hirsutism.classification})`);
        }

        // Acne contribution (0-30 points)
        const acneSeverityMap = { none: 0, mild: 10, moderate: 20, severe: 30 };
        const acnePoints = acneSeverityMap[acne.severity] || 0;
        score += acnePoints;
        if (acne.severity !== 'none') {
            contributors.push(`${acne.severity} acne with ${acne.totalLesions} lesions`);
        }

        // Hyperandrogenism probability (0-30 points)
        const hyperPoints = (hyperandrogenismIndicator.probability / 100) * 30;
        score += hyperPoints;

        // Normalize to 0-100
        const finalScore = Math.min(100, Math.round(score));

        // Determine level
        let level: 'low' | 'moderate' | 'high';
        if (finalScore < 30) level = 'low';
        else if (finalScore < 60) level = 'moderate';
        else level = 'high';

        return { score: finalScore, level, contributors };
    }
}

export const facialAnalysisService = new FacialAnalysisService();
