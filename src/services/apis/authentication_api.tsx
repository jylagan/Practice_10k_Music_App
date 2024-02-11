import { createClient, AuthError, User } from '@supabase/supabase-js';
import { DataManagementAPI } from './data_management_api';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

export const AuthenticationAPI = {
    async register(profilePicture: string, name: string, dateOfBirth: string, instruments: string[], level: string, email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) throw error;

        // After signing up, add user profile data to your database
        await DataManagementAPI.addUserProfile({ email, profilePicture, name, dateOfBirth, instruments, level });

        return data;
    },

    async logIn(email: string, password: string) {
        const { data , error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return {data} ;
    },

    async resetPassword(email: string) {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
    },

    async logOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async changePassword(email: string, oldPassword: string, newPassword: string) {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) throw error;
    },

    async updateProfile(name: string, email: string, dateOfBirth: string, instruments: string[], level: string, oldPassword: string, newPassword: string) {
        await DataManagementAPI.updateUserProfile({ email, name, dateOfBirth, instruments, level });
        await this.changePassword(email, oldPassword, newPassword);
    },

    async deleteAccount(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;

        await DataManagementAPI.deleteUserData();
        await supabase.auth.signOut();
    }
};