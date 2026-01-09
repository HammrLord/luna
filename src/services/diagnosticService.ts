/**
 * Diagnostic Service
 * 
 * AI-powered PCOD/PCOS classification and phenotype analysis
 * Integrates with Azure Machine Learning
 * 
 * TODO: Implement:
 * - PCOD vs PCOS differentiation algorithm
 * - Risk phenotype classification:
 *   - Insulin Resistant
 *   - Inflammatory
 *   - Adrenal
 *   - Post-Pill PCOS
 * - Confidence scoring
 * - Personalized recommendations based on phenotype
 */

interface DiagnosticInput {
    // Tier 1 data
    age: number;
    bmi: number;
    cycleRegularity: string;
    hasAcne: boolean;
    hasHirsutism: boolean;
    hasAcanthosisNigricans: boolean;

    // Tier 2 data
    freeTestosterone?: number;
    lh?: number;
    fsh?: number;
    amh?: number;
    follicleCount?: number;

    // Tier 3 data
    avgHRV?: number;
    avgSleepHours?: number;
}

interface DiagnosticResult {
    condition: 'PCOD' | 'PCOS' | 'NORMAL';
    phenotype?: 'insulin_resistant' | 'inflammatory' | 'adrenal' | 'post_pill';
    confidenceScore: number;
    recommendations: string[];
    riskFactors: string[];
}

export class DiagnosticService {
    /**
     * Analyze user data and provide PCOD/PCOS diagnosis
     */
    static async analyzePCODPCOS(input: DiagnosticInput): Promise<DiagnosticResult> {
        // TODO: Call Azure ML endpoint
        console.log('Running diagnostic analysis...', input);

        // Placeholder logic
        const hasMultipleCysts = (input.follicleCount || 0) >= 12;
        const hasHormonalImbalance = (input.lh || 0) / (input.fsh || 1) > 2;
        const hasAndrogen = (input.freeTestosterone || 0) > 45;

        let condition: 'PCOD' | 'PCOS' | 'NORMAL' = 'NORMAL';
        let phenotype: DiagnosticResult['phenotype'] = undefined;

        // Simple classification logic (placeholder)
        if (hasMultipleCysts && (hasHormonalImbalance || hasAndrogen)) {
            condition = 'PCOS';

            // Determine phenotype
            if (input.bmi > 25 && (input.avgHRV || 0) < 50) {
                phenotype = 'insulin_resistant';
            } else if (input.hasAcne || input.hasHirsutism) {
                phenotype = 'inflammatory';
            }
        } else if (hasMultipleCysts) {
            condition = 'PCOD';
        }

        return {
            condition,
            phenotype,
            confidenceScore: 0.85,
            recommendations: this.generateRecommendations(condition, phenotype),
            riskFactors: this.identifyRiskFactors(input),
        };
    }

    private static generateRecommendations(
        condition: string,
        phenotype?: string
    ): string[] {
        const recommendations: string[] = [];

        if (condition === 'PCOS') {
            recommendations.push('Consult with an endocrinologist');
            recommendations.push('Consider low-glycemic index diet');
            recommendations.push('Regular exercise (150 min/week)');

            if (phenotype === 'insulin_resistant') {
                recommendations.push('Reduce refined carbohydrates');
                recommendations.push('Consider metformin (consult doctor)');
            }
        }

        return recommendations;
    }

    private static identifyRiskFactors(input: DiagnosticInput): string[] {
        const risks: string[] = [];

        if (input.bmi > 30) risks.push('Obesity');
        if (input.cycleRegularity === 'very_irregular') risks.push('Irregular menstruation');
        if ((input.lh || 0) > 15) risks.push('Elevated LH levels');

        return risks;
    }
}

export default DiagnosticService;
