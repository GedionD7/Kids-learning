// supabaseClient.js

// IMPORTANT: These keys are derived from our previous discussion.
const SUPABASE_URL = 'https://fffmvhjitlnyzeirtguj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmZm12aGppdGxueXplaXJ0Z3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTUwNTUsImV4cCI6MjA3MjMzMTA1NX0.g_Mw3_Es6Kl4M64b9QOKT5_2EwNnn-0vJZSMf3QQeYo';

// Initialize the Supabase client FIRST!
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ----------------------------------------------------------------------
// 1. SESSION MANAGEMENT (Runs on every protected page load)
// ----------------------------------------------------------------------
async function checkUserSession() {
    // Check if the supabase object is ready
    if (typeof supabase === 'undefined') {
        // This should not happen with the corrected order, but is a safe guard.
        console.error("Supabase client not yet defined.");
        return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        console.log("User is logged in:", user.id);
        return user;
    } else {
        // User is NOT logged in. Redirect them to the login page.
        console.log("User not logged in. Redirecting to /index.html");
        // Redirect to the login page (index.html is the new entry point)
        if (!window.location.pathname.endsWith('/index.html')) {
            window.location.href = '/index.html';
        }
        return null;
    }
}

// ----------------------------------------------------------------------
// 2. LOGOUT FUNCTION (Called from home.html navigation)
// ----------------------------------------------------------------------
async function logout() {
    if (typeof supabase === 'undefined') {
        console.error('Logout failed: Supabase client not loaded.');
        return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Logout Error:', error.message);
    }
    // Always redirect after sign out attempt
    window.location.href = '/index.html';
}

// Start the session check process immediately when this script loads
// This will only run if it's NOT the index.html page.
if (!window.location.pathname.endsWith('/index.html')) {
    checkUserSession();
}
