/**
 * Consultation Service
 * 
 * Service layer for doctor consultations and bookings
 * 
 * TODO: Implement:
 * - Payment integration (Stripe/Razorpay)
 * - Azure Communication Services for video calls
 * - Calendar integration
 * - Notification system
 */

import { supabase } from '../lib/supabaseClient';

interface Doctor {
    id: string;
    full_name: string;
    specialization: string;
    consultation_fee: number;
    average_rating: number;
}

interface Consultation {
    id: string;
    doctor_id: string;
    user_id: string;
    scheduled_at: string;
    duration_minutes: number;
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    meeting_url?: string;
}

export class ConsultationService {
    /**
     * Get available doctors
     */
    static async getDoctors(
        specialization?: string,
        availableOnly: boolean = false
    ): Promise<Doctor[]> {
        let query = supabase
            .from('doctors')
            .select('*')
            .eq('is_verified', true);

        if (specialization) {
            query = query.eq('specialization', specialization);
        }

        if (availableOnly) {
            query = query.eq('is_available', true);
        }

        const { data, error } = await query.order('average_rating', { ascending: false });
        if (error) throw error;

        return data;
    }

    /**
     * Get doctor availability slots
     */
    static async getDoctorAvailability(
        doctorId: string,
        date: Date
    ): Promise<string[]> {
        // TODO: Query doctor_availability table
        // Return available time slots for the date

        // Placeholder data
        return [
            '09:00 AM',
            '10:00 AM',
            '11:00 AM',
            '02:00 PM',
            '03:00 PM',
            '04:00 PM',
        ];
    }

    /**
     * Book a consultation
     */
    static async bookConsultation(
        doctorId: string,
        scheduledAt: Date,
        notes?: string
    ): Promise<Consultation> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // TODO: Create payment intent first
        // TODO: Generate video call URL (Azure Communication Services)

        const { data, error } = await supabase
            .from('consultations')
            .insert({
                user_id: user.id,
                doctor_id: doctorId,
                scheduled_at: scheduledAt.toISOString(),
                duration_minutes: 15,
                status: 'scheduled',
                notes,
                payment_status: 'pending',
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Get user's consultations
     */
    static async getUserConsultations(
        status?: 'scheduled' | 'completed'
    ): Promise<Consultation[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        let query = supabase
            .from('consultations')
            .select(`
        *,
        doctors (
          full_name,
          specialization,
          profile_photo_url
        )
      `)
            .eq('user_id', user.id)
            .order('scheduled_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;
        if (error) throw error;

        return data;
    }

    /**
     * Get video call token for consultation
     */
    static async getVideoCallToken(consultationId: string): Promise<string> {
        // TODO: Call backend API to generate Azure Communication Services token
        // POST /api/video/token/:consultationId

        return 'placeholder_token';
    }

    /**
     * Submit consultation review
     */
    static async submitReview(
        consultationId: string,
        doctorId: string,
        rating: number,
        reviewText?: string
    ): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('consultation_reviews')
            .insert({
                consultation_id: consultationId,
                user_id: user.id,
                doctor_id: doctorId,
                rating,
                review_text: reviewText,
            });

        if (error) throw error;
    }

    /**
     * Cancel a consultation
     */
    static async cancelConsultation(consultationId: string): Promise<void> {
        const { error } = await supabase
            .from('consultations')
            .update({ status: 'cancelled' })
            .eq('id', consultationId);

        if (error) throw error;

        // TODO: Trigger refund if applicable
    }
}

export default ConsultationService;
