import { supabase } from './supabase';

export interface Profile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    city: string;
    points: number;
    reports_count: number;
    resolved_count: number;
    created_at: string;
}

export const db = {
    // Profiles
    async getOrCreateProfile(user: any) {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        if (profile) return profile;

        const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
                {
                    id: user.id,
                    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Citizen',
                    email: user.email,
                    role: 'citizen',
                    city: 'Indore'
                }
            ])
            .select()
            .single();

        if (createError) throw createError;
        return newProfile;
    },

    async getProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) throw error;
        return data as Profile;
    },

    // Complaints
    async createComplaint(complaint: {
        title: string;
        category: string;
        description: string;
        location: string;
        user_id: string;
    }) {
        const { data, error } = await supabase
            .from('complaints')
            .insert([complaint])
            .select()
            .single();

        if (error) throw error;

        // Increment reports count
        await supabase.rpc('increment_reports_count', { user_id: complaint.user_id });

        return data;
    },

    // Squad Requests
    async createSquadRequest(request: {
        user_id: string;
        experience: string;
        motivation: string;
        skills: string;
    }) {
        const { data, error } = await supabase
            .from('squad_requests')
            .insert([request])
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
