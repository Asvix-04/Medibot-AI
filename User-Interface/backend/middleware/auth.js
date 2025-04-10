// src/middleware/auth.js
const admin = require('firebase-admin');
const serviceAccount = require('../../firebaseServiceAccount.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      firebaseId: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified
    };
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

module.exports = { verifyToken };