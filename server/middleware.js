// ============================================
// Cinema Muchatlu - JWT Auth Middleware
// ============================================

const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, username, isAdmin }
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// Optional auth - doesn't fail if no token, just sets req.user if present
function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (err) {
            // Token invalid, continue without user
        }
    }

    next();
}

module.exports = { authMiddleware, optionalAuth };
