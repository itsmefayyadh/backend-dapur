import Comment from '../../models/Comment.js';

// @desc    Get all incoming comments waiting for moderation (isApproved = false)
// @route   GET /api/admin/comments
// @access  Private/Admin
export const getPendingComments = async (req, res) => {
  try {
    const pendingComments = await Comment.find({ isApproved: false })
      .populate('userID', 'namaLengkap status nomorWhatsApp')
      .populate('recipeID', 'judul')
      .populate('blogID', 'judul')
      .sort({ tanggal: -1 });

    return res.status(200).json({
      success: true,
      message: 'Komentar pending untuk moderasi berhasil diambil.',
      count: pendingComments.length,
      data: pendingComments
    });
  } catch (error) {
    console.error('Get Pending Comments Error:', error.message);
    return res.status(500).json({
      success: false,
      message: `Terjadi kesalahan server: ${error.message}`
    });
  }
};

// @desc    Approve an incoming comment
// @route   PUT /api/admin/comments/:id/approve
// @access  Private/Admin
export const approveComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Persetujuan komentar gagal: Komentar tidak ditemukan.'
      });
    }

    comment.isApproved = true;
    await comment.save();

    return res.status(200).json({
      success: true,
      message: 'Komentar berhasil disetujui dan kini tampil di aplikasi warga.',
      data: comment
    });
  } catch (error) {
    console.error('Approve Comment Error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Format ID komentar tidak valid.'
      });
    }
    return res.status(500).json({
      success: false,
      message: `Terjadi kesalahan server: ${error.message}`
    });
  }
};

// @desc    Delete a comment (spam/vulgar check)
// @route   DELETE /api/admin/comments/:id
// @access  Private/Admin
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Penghapusan komentar gagal: Komentar tidak ditemukan.'
      });
    }

    await Comment.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Komentar berhasil dihapus.'
    });
  } catch (error) {
    console.error('Delete Comment Error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Format ID komentar tidak valid.'
      });
    }
    return res.status(500).json({
      success: false,
      message: `Terjadi kesalahan server: ${error.message}`
    });
  }
};
