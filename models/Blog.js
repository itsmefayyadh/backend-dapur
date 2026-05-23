import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  judul: {
    type: String,
    required: [true, 'Judul artikel wajib diisi']
  },
  gambarBanner: {
    type: String,
    default: ''
  },
  isiArtikel: {
    type: String,
    required: [true, 'Isi artikel wajib diisi']
  },
  tanggalRilis: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author wajib ditentukan']
  }
}, {
  timestamps: true
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
