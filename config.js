// ============================================
// Cinema Muchatlu - API Client Configuration
// Connects frontend to the Express + MongoDB backend
// ============================================

const API_BASE = window.location.origin + '/api';

// Token management
function getToken() {
    return localStorage.getItem('cinema_muchatlu_token');
}

function setToken(token) {
    localStorage.setItem('cinema_muchatlu_token', token);
}

function removeToken() {
    localStorage.removeItem('cinema_muchatlu_token');
}

// API helper with auth headers
async function apiFetch(endpoint, options = {}) {
    const token = getToken();
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('sessionId', sessionId);
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'X-Session-Id': sessionId,
        ...(options.headers || {})
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'API request failed');
    }

    return data;
}

console.log('✅ API client initialized');
console.log('📡 Connected to:', API_BASE);
