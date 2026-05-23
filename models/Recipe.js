import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  judul: {
    type: String,
    required: [true, 'Judul resep wajib diisi']
  },
  kategori: {
    type: String,
    enum: {
      values: ['Rumahan', 'Camilan', 'Ide Jualan'],
      message: 'Kategori harus berupa: Rumahan, Camilan, atau Ide Jualan'
    },
    required: [true, 'Kategori resep wajib diisi']
  },
  tingkatKesulitan: {
    type: String,
    enum: {
      values: ['Mudah', 'Sedang', 'Mahir'],
      message: 'Tingkat kesulitan harus berupa: Mudah, Sedang, atau Mahir'
    }
  },
  estimasiWaktu: {
    type: Number, // dalam menit
    required: false
  },
  porsi: {
    type: Number,
    required: false
  },
  bahan: {
    type: [String],
    required: [true, 'Bahan-bahan wajib diisi']
  },
  langkah: {
    type: [String],
    required: [true, 'Langkah-langkah pembuatan wajib diisi']
  },
  estimasiModal: {
    type: Number,
    default: 0
  },
  videoURL: {
    type: String,
    default: ''
  },
  fotoURL: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author wajib ditentukan']
  }
}, {
  timestamps: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
