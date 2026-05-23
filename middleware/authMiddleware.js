import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database, excluding password field
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Otorisasi gagal: Pengguna tidak ditemukan.'
        });
      }

      return next();
    } catch (error) {
      console.error('JWT Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Otorisasi gagal: Token tidak valid atau kedaluwarsa.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Otorisasi gagal: Token tidak ditemukan di header Authorization.'
    });
  }
};

// Authorize specific roles (RBAC)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak: Peran '${req.user ? req.user.role : 'guest'}' tidak memiliki hak akses ke endpoint ini.`
      });
    }
  };
};
