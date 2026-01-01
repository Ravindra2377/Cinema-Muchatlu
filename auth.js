// ===== PRODUCTION AUTHENTICATION WITH SUPABASE =====
// This file handles all authentication logic using Supabase Auth

// Authentication state
let currentUser = null;

// Initialize Supabase Auth listener
function initAuth() {
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized');
        return;
    }

    // Listen for auth state changes
    window.supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event);

        if (session?.user) {
            // User is logged in
            await loadUserProfile(session.user.id);
            updateUIForLoggedInUser();
        } else {
            // User is logged out
            currentUser = null;
            updateUIForLoggedOutUser();
        }
    });

    // Check current session on page load
    checkCurrentSession();
}

// Check if user is already logged in
async function checkCurrentSession() {
    const { data: { session } } = await window.supabaseClient.auth.getSession();

    if (session?.user) {
        await loadUserProfile(session.user.id);
        updateUIForLoggedInUser();
    }
}

// Load user profile from database
async function loadUserProfile(userId) {
    const { data, error } = await window.supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error loading profile:', error);
        return;
    }

    currentUser = {
        id: data.id,
        username: data.username,
        email: (await window.supabaseClient.auth.getUser()).data.user.email,
        isAdmin: data.is_admin,
        reputation: data.reputation,
        avatar: data.avatar_url,
        bio: data.bio
    };
}

// Sign up new user
async function signUp(username, email, password) {
    try {
        // Validate username
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
            showError('Username must be 3-20 characters and contain only letters, numbers, and underscores');
            return false;
        }

        // Check if username is already taken
        const { data: existingUser, error: checkError } = await window.supabaseClient
            .from('profiles')
            .select('username')
            .eq('username', username)
            .single();

        // Ignore PGRST116 error (no rows found) - this is expected for new usernames
        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking username:', checkError);
            showError('Error checking username availability');
            return false;
        }

        if (existingUser) {
            showError('Username already taken');
            return false;
        }

        // Sign up with Supabase Auth
        const { data, error } = await window.supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username
                }
            }
        });

        if (error) {
            showError(error.message);
            return false;
        }

        // Show signup successful message
        showSuccess('✓ Signup Successful! Please login with your credentials.');

        // Switch to login tab after short delay
        setTimeout(() => {
            const loginTab = document.querySelector('[data-tab="login"]');
            const signupTab = document.querySelector('[data-tab="signup"]');
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');

            if (loginTab && signupTab && loginForm && signupForm) {
                // Switch tabs
                signupTab.classList.remove('active');
                loginTab.classList.add('active');
                signupForm.classList.remove('active');
                loginForm.classList.add('active');

                // Pre-fill email if available
                const emailInput = document.getElementById('loginEmail');
                if (emailInput && email) {
                    emailInput.value = email;
                }
            }
        }, 1500);

        return true;
    } catch (err) {
        console.error('Signup error:', err);
        showError('An error occurred during signup');
        return false;
    }
}

// Sign in existing user
async function signIn(email, password) {
    try {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            showError(error.message);
            return false;
        }

        // Show login successful message
        showSuccess('✓ Login Successful! Welcome back!');

        // Close modal after short delay
        setTimeout(() => {
            if (typeof closeAuthModal === 'function') {
                closeAuthModal();
            } else if (typeof window.closeAuthModal === 'function') {
                window.closeAuthModal();
            } else {
                // Fallback: close modal manually
                const modal = document.getElementById('authModal');
                if (modal) modal.classList.remove('active');
            }
        }, 1000);

        return true;
    } catch (err) {
        console.error('Login error:', err);
        showError('An error occurred during login');
        return false;
    }
}

// Sign out user
async function signOut() {
    try {
        const { error } = await window.supabaseClient.auth.signOut();

        if (error) {
            showError(error.message);
            return false;
        }

        showSuccess('Logged out successfully');
        return true;
    } catch (err) {
        console.error('Logout error:', err);
        showError('An error occurred during logout');
        return false;
    }
}

// Reset password
async function resetPassword(email) {
    try {
        const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin
        });

        if (error) {
            showError(error.message);
            return false;
        }

        showSuccess('Password reset email sent! Check your inbox.');
        return true;
    } catch (err) {
        console.error('Password reset error:', err);
        showError('An error occurred while sending reset email');
        return false;
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    if (!currentUser) return;

    // Hide login button, show user profile
    document.getElementById('loginBtn').classList.add('hidden');
    document.getElementById('userProfile').classList.remove('hidden');

    // Update user info
    document.getElementById('userName').textContent = currentUser.username;
    document.getElementById('userRole').textContent = currentUser.isAdmin ? 'Admin' : 'Member';
    document.getElementById('userInitial').textContent = currentUser.username.charAt(0).toUpperCase();
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    // Show login button, hide user profile
    document.getElementById('loginBtn').classList.remove('hidden');
    document.getElementById('userProfile').classList.add('hidden');
}

// Show error message
function showError(message) {
    // Check if we're on an auth page (login.html, signup.html)
    const messageBanner = document.getElementById('messageBanner');
    if (messageBanner) {
        // Use the message banner on auth pages
        messageBanner.textContent = message;
        messageBanner.className = 'message-banner error';
        messageBanner.classList.remove('hidden');

        setTimeout(() => {
            messageBanner.classList.add('hidden');
        }, 5000);
        return;
    }

    // Fallback for index.html
    let errorBanner = document.getElementById('errorBanner');
    if (!errorBanner) {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) {
            console.error('Error:', message);
            return;
        }

        errorBanner = document.createElement('div');
        errorBanner.id = 'errorBanner';
        errorBanner.className = 'error-message';
        errorBanner.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p id="errorText"></p>
        `;
        mainContent.prepend(errorBanner);
    }

    document.getElementById('errorText').textContent = message;
    errorBanner.style.display = 'flex';

    setTimeout(() => {
        errorBanner.style.display = 'none';
    }, 5000);
}

// Show success message
function showSuccess(message) {
    // Check if we're on an auth page (login.html, signup.html)
    const messageBanner = document.getElementById('messageBanner');
    if (messageBanner) {
        // Use the message banner on auth pages
        messageBanner.textContent = message;
        messageBanner.className = 'message-banner success';
        messageBanner.classList.remove('hidden');

        setTimeout(() => {
            messageBanner.classList.add('hidden');
        }, 5000);
        return;
    }

    // Fallback for index.html
    let successBanner = document.getElementById('successBanner');
    if (!successBanner) {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) {
            console.log('Success:', message);
            return;
        }

        successBanner = document.createElement('div');
        successBanner.id = 'successBanner';
        successBanner.className = 'success-message';
        successBanner.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p id="successText"></p>
        `;
        mainContent.prepend(successBanner);
    }

    document.getElementById('successText').textContent = message;
    successBanner.style.display = 'flex';

    setTimeout(() => {
        successBanner.style.display = 'none';
    }, 5000);
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = '';

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) {
        feedback = 'Weak password';
        return { strength: 'weak', feedback };
    } else if (strength <= 4) {
        feedback = 'Medium password';
        return { strength: 'medium', feedback };
    } else {
        feedback = 'Strong password';
        return { strength: 'strong', feedback };
    }
}

// Export functions for use in app.js
window.authFunctions = {
    initAuth,
    signUp,
    signIn,
    signOut,
    resetPassword,
    checkPasswordStrength,
    getCurrentUser: () => currentUser
};

// Also export signIn and signUp globally for auth-pages.js
window.signIn = signIn;
window.signUp = signUp;
window.signOut = signOut;
window.resetPassword = resetPassword;
