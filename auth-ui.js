// ===== AUTHENTICATION UI INTEGRATION =====
// This file connects the auth.js functions to the UI event listeners

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize Supabase Auth
    if (window.authFunctions) {
        window.authFunctions.initAuth();
    }

    // Login form submission
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Show loading state
            const submitBtn = document.getElementById('loginSubmitBtn');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            await window.authFunctions.signIn(email, password);

            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
    }

    // Signup form submission
    const signupForm = document.getElementById('signupFormElement');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('signupUsername').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupPasswordConfirm').value;

            // Validate passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            // Show loading state
            const submitBtn = document.getElementById('signupSubmitBtn');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            await window.authFunctions.signUp(username, email, password);

            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
    }

    // Password strength indicator
    const signupPassword = document.getElementById('signupPassword');
    if (signupPassword) {
        signupPassword.addEventListener('input', (e) => {
            const password = e.target.value;
            const result = window.authFunctions.checkPasswordStrength(password);

            const strengthFill = document.getElementById('strengthFill');
            const strengthText = document.getElementById('strengthText');

            // Remove all strength classes
            strengthFill.classList.remove('weak', 'medium', 'strong');
            strengthText.classList.remove('weak', 'medium', 'strong');

            // Add appropriate class
            if (password.length > 0) {
                strengthFill.classList.add(result.strength);
                strengthText.classList.add(result.strength);
                strengthText.textContent = result.feedback;
            } else {
                strengthText.textContent = 'Enter a password';
            }
        });
    }

    // Password toggle buttons
    const loginPasswordToggle = document.getElementById('loginPasswordToggle');
    if (loginPasswordToggle) {
        loginPasswordToggle.addEventListener('click', () => {
            const passwordInput = document.getElementById('loginPassword');
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
        });
    }

    const signupPasswordToggle = document.getElementById('signupPasswordToggle');
    if (signupPasswordToggle) {
        signupPasswordToggle.addEventListener('click', () => {
            const passwordInput = document.getElementById('signupPassword');
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
        });
    }

    // Forgot password link
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            openResetPasswordModal();
        });
    }

    // Password reset form
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('resetEmail').value;

            // Show loading state
            const submitBtn = document.getElementById('resetPasswordBtn');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            const success = await window.authFunctions.resetPassword(email);

            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            if (success) {
                closeResetPasswordModal();
            }
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await window.authFunctions.signOut();
        });
    }
});

// Open reset password modal
function openResetPasswordModal() {
    const modal = document.getElementById('resetPasswordModal');
    if (modal) {
        modal.classList.add('active');
        closeAuthModal(); // Close the login modal
    }
}

// Close reset password modal
function closeResetPasswordModal() {
    const modal = document.getElementById('resetPasswordModal');
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('resetEmail').value = '';
    }
}

// Reset password modal close button
document.addEventListener('DOMContentLoaded', function () {
    const resetPasswordClose = document.getElementById('resetPasswordClose');
    if (resetPasswordClose) {
        resetPasswordClose.addEventListener('click', closeResetPasswordModal);
    }

    const resetPasswordOverlay = document.getElementById('resetPasswordOverlay');
    if (resetPasswordOverlay) {
        resetPasswordOverlay.addEventListener('click', closeResetPasswordModal);
    }
});
