// supabaseClient.js

// IMPORTANT: These keys are derived from our previous discussion.
const SUPABASE_URL = 'https://fffmvhjitlnyzeirtguj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmZm12aGppdGxueXplaXJ0Z3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTUwNTUsImV4cCI6MjA3MjMzMTA1NX0.g_Mw3_Es6Kl4M64b9QOKT5_2EwNnn-0vJZSMf3QQeYo';

// Initialize the Supabase client instance using the global 'supabase' object provided by the CDN.
// We use 'supabaseClient' to avoid conflicting with the global 'supabase'.
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ----------------------------------------------------------------------
// 1. SESSION MANAGEMENT (Runs on every protected page load)
// ----------------------------------------------------------------------
async function checkUserSession() {
    // We now reference the correctly named client instance
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (user) {
        console.log("User is logged in:", user.id);
        return user;
    } else {
        // User is NOT logged in. Redirect them to the login page.
        console.log("User not logged in. Redirecting to /login.html");
        // Redirect to the login page (login.html is the new entry point)
        if (!window.location.pathname.endsWith('/login.html')) {
            window.location.href = '/login.html';
        }
        return null;
    }
}

// ----------------------------------------------------------------------
// 2. LOGOUT FUNCTION (Called from index.html navigation)
// ----------------------------------------------------------------------
async function logout() {
    // We now reference the correctly named client instance
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error('Logout Error:', error.message);
    }
    // Always redirect after sign out attempt
    window.location.href = '/login.html';
}

// Start the session check process immediately when this script loads
// This will only run if it's NOT the login.html page.
if (!window.location.pathname.endsWith('/login.html')) {
    checkUserSession();
}
