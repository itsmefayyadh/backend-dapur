import Blog from '../models/Blog.js';

// @desc    Get all blog articles
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'namaLengkap role')
      .sort({ tanggalRilis: -1 });

    return res.status(200).json({
      success: true,
      message: 'Semua artikel blog berhasil diambil.',
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error('Get Blogs Error:', error.message);
    return res.status(500).json({
      success: false,
      message: `Terjadi kesalahan server: ${error.message}`
    });
  }
};

// @desc    Get single blog article by ID
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      'author',
      'namaLengkap role'
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Artikel blog tidak ditemukan.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Artikel blog berhasil ditemukan.',
      data: blog
    });
  } catch (error) {
    console.error('Get Blog Details Error:', error.message);
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
