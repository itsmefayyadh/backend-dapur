import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'UserID wajib ditentukan']
  },
  recipeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: false
  },
  blogID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: false
  },
  isiKomentar: {
    type: String,
    required: [true, 'Isi komentar wajib diisi']
  },
  tanggal: {
    type: Date,
    default: Date.now
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
