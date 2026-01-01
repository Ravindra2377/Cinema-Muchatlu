// Quick fix for app.js conflicts with auth.js
// Add this at the very end of app.js to override the conflicting functions

// Rename old auth functions to avoid conflicts
if (typeof initAuth !== 'undefined') {
    window.oldInitAuth = initAuth;
}
if (typeof signup !== 'undefined') {
    window.oldSignup = signup;
}
if (typeof login !== 'undefined') {
    window.oldLogin = login;
}
if (typeof logout !== 'undefined') {
    window.oldLogout = logout;
}
