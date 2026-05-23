import Blog from '../../models/Blog.js';
import Comment from '../../models/Comment.js';

// @desc    Create a blog article
// @route   POST /api/admin/blogs
// @access  Private/Admin
export const createBlog = async (req, res) => {
  try {
    const { judul, gambarBanner, isiArtikel } = req.body;

    if (!judul || !isiArtikel) {
      return res.status(400).json({
        success: false,
        message:
          'Pembuatan artikel gagal: Judul dan Isi Artikel wajib diisi.'
      });
    }

    const blog = await Blog.create({
      judul,
      gambarBanner: gambarBanner || '',
      isiArtikel,
      author: req.user._id // Logged in admin
    });

    return res.status(201).json({
      success: true,
      message: 'Artikel blog baru berhasil dibuat oleh Admin.',
      data: blog
    });
  } catch (error) {
    console.error('Create Blog Error:', error.message);
    return res.status(500).json({
      success: false,
      message: `Terjadi kesalahan server: ${error.message}`
    });
  }
};

// @desc    Update a blog article
// @route   PUT /api/admin/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Pembaruan artikel gagal: Blog tidak ditemukan.'
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Artikel blog berhasil diperbarui.',
      data: updatedBlog
    });
  } catch (error) {
    console.error('Update Blog Error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Format ID blog tidak valid.'
      });
    }
    return res.status(500).json({
      success: false,
      message: `Terjadi kesalahan server: ${error.message}`
    });
  }
};

// @desc    Delete a blog article (and clean up comments)
// @route   DELETE /api/admin/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Penghapusan artikel gagal: Blog tidak ditemukan.'
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    // Delete associated comments
    await Comment.deleteMany({ blogID: req.params.id });

    return res.status(200).json({
      success: true,
      message:
        'Artikel blog dan seluruh komentar terkait berhasil dihapus dari database.'
    });
  } catch (error) {
    console.error('Delete Blog Error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Format ID blog tidak valid.'
      });
    }
    return res.status(500).json({
      success: false,
      message: `Terjadi kesalahan server: ${error.message}`
    });
  }
};
