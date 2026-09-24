// ===== PRODUCTION AUTHENTICATION WITH MONGODB =====
// This file handles all authentication logic using the Express API + JWT

// Authentication state
let currentUser = null;

// Initialize Auth - check for existing session
function initAuth() {
    checkCurrentSession();
}

// Check if user is already logged in (has valid token)
async function checkCurrentSession() {
    const token = getToken();
    if (!token) {
        updateUIForLoggedOutUser();
        return;
    }

    try {
        const userData = await apiFetch('/auth/me');
        currentUser = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            isAdmin: userData.isAdmin,
            reputation: userData.reputation,
            avatar: userData.avatar,
            bio: userData.bio
        };
        updateUIForLoggedInUser();
    } catch (err) {
        console.log('Session expired or invalid');
        removeToken();
        currentUser = null;
        updateUIForLoggedOutUser();
    }
}

// Sign up new user
async function signUp(username, email, password) {
    try {
        // Validate username
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
            showError('Username must be 3-20 characters and contain only letters, numbers, and underscores');
            return false;
        }

        await apiFetch('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });

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
        showError(err.message || 'An error occurred during signup');
        return false;
    }
}

// Sign in existing user
async function signIn(email, password) {
    try {
        const data = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        // Save token
        setToken(data.token);

        // Set current user
        currentUser = {
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            isAdmin: data.user.isAdmin,
            reputation: data.user.reputation,
            avatar: data.user.avatar,
            bio: data.user.bio
        };

        updateUIForLoggedInUser();

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
        showError(err.message || 'An error occurred during login');
        return false;
    }
}

// Sign out user
async function signOut() {
    try {
        removeToken();
        currentUser = null;
        updateUIForLoggedOutUser();
        showSuccess('Logged out successfully');
        return true;
    } catch (err) {
        console.error('Logout error:', err);
        showError('An error occurred during logout');
        return false;
    }
}

// Reset password (placeholder - needs email service)
async function resetPassword(email) {
    showError('Password reset is not yet configured. Please contact the admin.');
    return false;
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
