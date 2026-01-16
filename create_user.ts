
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uykeiawyiqgtkkzgrnoh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5a2VpYXd5aXFndGtremdybm9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNTIyNjMsImV4cCI6MjA4MzkyODI2M30.2omWjINKo7P_s8k1_iPMltM0tFUDqX9i1vvmTVlroJY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAccount() {
    const email = 'lakshyapandagre@gmail.com';
    const password = 'Lakshya@123';

    console.log(`Creating account for: ${email}...`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Lakshya Pandagre',
                city: 'Indore',
            }
        }
    });

    if (error) {
        console.error("Signup Error:", error.message);
    } else {
        console.log("Signup Call Successful.");
        if (data.session) {
            console.log("SESSION CREATED! Auto-confirm is likely ON.");
        } else {
            console.log("NO SESSION CREATED. Email confirmation is likely REQUIRED.");
        }
    }

    // 2. Sign In to get session (needed for RLS insert)
    console.log("Attempting to Sign In...");
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (loginError) {
        console.error("Login Failed:", loginError.message);
        return;
    }

    if (!loginData.session) {
        console.error("No session created. Email confirmation might be required.");
        return;
    }

    const userId = loginData.user.id;
    console.log(`Logged in! User ID: ${userId}`);

    // 3. Force Create/Update Profile
    console.log("Upserting Profile...");
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            email: email,
            name: 'Lakshya Pandagre',
            role: 'citizen', // Default to citizen, can be changed to admin later
            city: 'Indore',
            status: 'active',
            points: 100
        });

    if (profileError) {
        console.error("Profile Upsert Failed:", profileError.message);
    } else {
        console.log("Profile Setup Complete! You can now log in.");
    }
}

createAccount();
