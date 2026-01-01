/* ============================================
   Cinema Muchatlu - Authentication Pages JavaScript
   ============================================ */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAuthPage();
});

function initAuthPage() {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'login.html') {
        initLoginPage();
    } else if (currentPage === 'signup.html') {
        initSignupPage();
    }

    // Initialize common features
    initPasswordToggles();
}

// ============================================
// Login Page
// ============================================

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validate
        if (!email || !password) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        // Show loading state
        setButtonLoading(loginBtn, true);

        try {
            // Call the signIn function from auth.js
            const success = await window.signIn(email, password);

            if (success) {
                // Show success toast
                showToast('Login Successful!', `Welcome back!`, 'success');

                // Store remember me preference
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }

                // Redirect to home page after short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showMessage('Invalid email or password', 'error');
                setButtonLoading(loginBtn, false);
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage(error.message || 'An error occurred during login', 'error');
            setButtonLoading(loginBtn, false);
        }
    });
}

// ============================================
// Signup Page
// ============================================

function initSignupPage() {
    const signupForm = document.getElementById('signupForm');
    const signupBtn = document.getElementById('signupBtn');
    const passwordInput = document.getElementById('signupPassword');
    const passwordConfirmInput = document.getElementById('signupPasswordConfirm');
    const usernameInput = document.getElementById('signupUsername');

    if (!signupForm) return;

    // Password strength indicator
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            updatePasswordStrength(passwordInput.value);
        });
    }

    // Username validation
    if (usernameInput) {
        usernameInput.addEventListener('input', () => {
            validateUsername(usernameInput.value);
        });
    }

    // Form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Validate
        if (!username || !email || !password || !passwordConfirm) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        if (!validateUsername(username)) {
            showMessage('Username must be 3-20 characters, letters and numbers only', 'error');
            return;
        }

        if (password !== passwordConfirm) {
            showMessage('Passwords do not match', 'error');
            return;
        }

        if (password.length < 8) {
            showMessage('Password must be at least 8 characters', 'error');
            return;
        }

        if (!agreeTerms) {
            showMessage('Please agree to the Terms of Service', 'error');
            return;
        }

        // Show loading state
        setButtonLoading(signupBtn, true);

        try {
            // Call the signUp function from auth.js
            const success = await window.signUp(username, email, password);

            if (success) {
                // Redirect to success page
                window.location.href = `signup-success.html?username=${encodeURIComponent(username)}`;
            } else {
                setButtonLoading(signupBtn, false);
            }
        } catch (error) {
            console.error('Signup error:', error);
            showMessage(error.message || 'An error occurred during signup', 'error');
            setButtonLoading(signupBtn, false);
        }
    });
}

// ============================================
// Password Strength Indicator
// ============================================

function updatePasswordStrength(password) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    if (!strengthFill || !strengthText) return;

    if (!password) {
        strengthFill.className = 'strength-fill';
        strengthText.textContent = 'Enter a password';
        strengthText.className = 'strength-text';
        return;
    }

    let strength = 0;

    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Character variety checks
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    // Determine strength level
    let level = 'weak';
    let text = 'Weak password';

    if (strength >= 4) {
        level = 'medium';
        text = 'Medium password';
    }
    if (strength >= 6) {
        level = 'strong';
        text = 'Strong password';
    }

    strengthFill.className = `strength-fill ${level}`;
    strengthText.textContent = text;
    strengthText.className = `strength-text ${level}`;
}

// ============================================
// Username Validation
// ============================================

function validateUsername(username) {
    const regex = /^[a-zA-Z0-9]{3,20}$/;
    return regex.test(username);
}

// ============================================
// Password Toggle
// ============================================

function initPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.password-toggle');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling.previousElementSibling;
            const icon = button.querySelector('.toggle-icon');

            if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = '🙈';
            } else {
                input.type = 'password';
                icon.textContent = '👁️';
            }
        });
    });
}

// ============================================
// UI Helper Functions
// ============================================

function showMessage(message, type = 'error') {
    const banner = document.getElementById('messageBanner');
    if (!banner) return;

    banner.textContent = message;
    banner.className = `message-banner ${type}`;
    banner.classList.remove('hidden');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        banner.classList.add('hidden');
    }, 5000);
}

function setButtonLoading(button, isLoading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');

    if (isLoading) {
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
        btnLoader.classList.add('active');
        button.disabled = true;
    } else {
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        btnLoader.classList.remove('active');
        button.disabled = false;
    }
}

function showToast(title, message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? '✓' : '✕';

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">✕</button>
    `;

    container.appendChild(toast);

    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.remove();
    });

    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add slideOutRight animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Export functions for use by auth.js
// ============================================

window.authPageHelpers = {
    showMessage,
    showToast,
    setButtonLoading
};
