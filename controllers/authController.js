import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register new citizen (Warga) / Admin
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { namaLengkap, email, nomorWhatsApp, password, role, status } = req.body;

    // Validate fields
    if (!namaLengkap || !email || !nomorWhatsApp || !password) {
      return res.status(400).json({
        success: false,
        message: 'Registrasi gagal: Nama Lengkap, Email, Nomor WhatsApp, dan Password wajib diisi.'
      });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Registrasi gagal: Email sudah terdaftar.'
      });
    }

    // Check if WhatsApp already exists
    const userExists = await User.findOne({ nomorWhatsApp });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Registrasi gagal: Nomor WhatsApp sudah terdaftar.'
      });
    }

    // Create user (password will be hashed by Mongoose pre-save hook)
    const user = await User.create({
      namaLengkap,
      email: email.toLowerCase(),
      nomorWhatsApp,
      password,
      role: role || 'warga',
      status: status || 'Belajar Memasak'
    });

    if (user) {
      return res.status(201).json({
        success: true,
        message: 'Registrasi warga baru berhasil dilakukan.',
        data: {
          _id: user._id,
          namaLengkap: user.namaLengkap,
          email: user.email,
          nomorWhatsApp: user.nomorWhatsApp,
          role: user.role,
          status: user.status,
          token: generateToken(user._id)
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Registrasi gagal: Data yang dikirimkan tidak valid.'
      });
    }
  } catch (error) {
    console.error('Register Error:', error.message);
    return res.status(500).json({
      success: false,
      message: `Terjadi kesalahan server: ${error.message}`
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Login gagal: Email dan Password wajib diisi.'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    // Validate credentials using schema's matchPassword method
    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        success: true,
        message: 'Login berhasil.',
        data: {
          _id: user._id,
          namaLengkap: user.namaLengkap,
          email: user.email,
          nomorWhatsApp: user.nomorWhatsApp,
          role: user.role,
          status: user.status,
          token: generateToken(user._id)
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Login gagal: Email atau Password salah.'
      });
    }
  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({
      success: false,
      message: `Terjadi kesalahan server: ${error.message}`
    });
  }
};

// @desc    Get current user profile with bookmarks populated
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    // req.user was populated in protect middleware (excluding password)
    const user = await User.findById(req.user._id).populate({
      path: 'bookmarks',
      select: 'judul kategori tingkatKesulitan tingkatKesulitan estimasiWaktu porsi fotoURL estimasiModal author',
      populate: {
        path: 'author',
        select: 'namaLengkap email nomorWhatsApp'
      }
    });

    if (user) {
      return res.status(200).json({
        success: true,
        message: 'Data profil berhasil diambil.',
        data: {
          _id: user._id,
          namaLengkap: user.namaLengkap,
          email: user.email,
          nomorWhatsApp: user.nomorWhatsApp,
          role: user.role,
          status: user.status,
          bookmarks: user.bookmarks
        }
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Profil tidak ditemukan: Pengguna tidak ada di database.'
      });
    }
  } catch (error) {
    console.error('Profile Error:', error.message);
    return res.status(500).json({
      success: false,
      message: `Terjadi kesalahan server: ${error.message}`
    });
  }
};
