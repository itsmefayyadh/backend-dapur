import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  namaLengkap: {
    type: String,
    required: [true, 'Nama Lengkap wajib diisi']
  },
  email: {
    type: String,
    required: [true, 'Email wajib diisi'],
    unique: true,
    lowercase: true,
    trim: true
  },
  nomorWhatsApp: {
    type: String,
    required: [true, 'Nomor WhatsApp wajib diisi'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password wajib diisi']
  },
  role: {
    type: String,
    enum: ['warga', 'admin'],
    default: 'warga'
  },
  status: {
    type: String,
    enum: ['Belajar Memasak', 'Siap Jualan'],
    default: 'Belajar Memasak'
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }]
}, {
  timestamps: true
});

// Pre-save hook to encrypt password
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to match entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
