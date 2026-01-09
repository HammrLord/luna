/**
 * TypeScript Database Types
 * 
 * Auto-generated types from Supabase schema.
 * Run: npx supabase gen types typescript --project-id=<id> > src/types/database.types.ts
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            health_profiles: {
                Row: {
                    id: string
                    user_id: string
                    age: number
                    height: number
                    weight: number
                    bmi: number
                    cycle_regularity: string
                    cycle_duration: number
                    has_acne: boolean
                    has_hirsutism: boolean
                    has_acanthosis_nigricans: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['health_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['health_profiles']['Insert']>
            }
            lab_results: {
                Row: {
                    id: string
                    user_id: string
                    test_type: 'blood' | 'ultrasound'
                    free_testosterone?: number
                    lh?: number
                    fsh?: number
                    amh?: number
                    follicle_count?: number
                    endometrium_thickness?: number
                    document_url: string
                    ocr_confidence: number
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['lab_results']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['lab_results']['Insert']>
            }
            diagnostic_results: {
                Row: {
                    id: string
                    user_id: string
                    condition: 'PCOD' | 'PCOS' | 'NORMAL'
                    phenotype: 'insulin_resistant' | 'inflammatory' | 'adrenal' | 'post_pill' | null
                    confidence_score: number
                    recommendations: Json
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['diagnostic_results']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['diagnostic_results']['Insert']>
            }
            // Add more table types as needed
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
