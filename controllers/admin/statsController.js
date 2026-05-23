import User from '../../models/User.js';
import Recipe from '../../models/Recipe.js';
import Blog from '../../models/Blog.js';

// @desc    Get dashboard metrics & aggregations
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalWarga = await User.countDocuments({ role: 'warga' });
    const totalRecipes = await Recipe.countDocuments();
    const totalBlogs = await Blog.countDocuments();

    // Stats based on citizen status
    const statusBelajar = await User.countDocuments({
      role: 'warga',
      status: 'Belajar Memasak'
    });
    const statusSiapJualan = await User.countDocuments({
      role: 'warga',
      status: 'Siap Jualan'
    });

    return res.status(200).json({
      success: true,
      message: 'Data statistik dashboard berhasil diambil.',
      data: {
        totalWarga,
        totalRecipes,
        totalBlogs,
        statusWarga: {
          belajarMemasak: statusBelajar,
          siapJualan: statusSiapJualan
        }
      }
    });
  } catch (error) {
    console.error('Get Stats Error:', error.message);
    return res.status(500).json({
      success: false,
      message: `Terjadi kesalahan server: ${error.message}`
    });
  }
};

// @desc    Get all registered citizens
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    // Return all users with 'warga' role, excluding password field
    const citizens = await User.find({ role: 'warga' })
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Daftar warga berhasil diambil.',
      count: citizens.length,
      data: citizens
    });
  } catch (error) {
    console.error('Get Citizens Error:', error.message);
    return res.status(500).json({
      success: false,
      message: `Terjadi kesalahan server: ${error.message}`
    });
  }
};

// @desc    Update a citizen's status (Belajar Memasak -> Siap Jualan)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate request status
    if (!status || !['Belajar Memasak', 'Siap Jualan'].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Pembaruan status gagal: Status warga harus bernilai 'Belajar Memasak' atau 'Siap Jualan'."
      });
    }

    const citizen = await User.findOne({ _id: req.params.id, role: 'warga' });
    if (!citizen) {
      return res.status(404).json({
        success: false,
        message: 'Pembaruan status gagal: Warga tidak ditemukan.'
      });
    }

    citizen.status = status;
    await citizen.save();

    return res.status(200).json({
      success: true,
      message: 'Status warga berhasil diperbarui.',
      data: {
        _id: citizen._id,
        namaLengkap: citizen.namaLengkap,
        email: citizen.email,
        nomorWhatsApp: citizen.nomorWhatsApp,
        status: citizen.status
      }
    });
  } catch (error) {
    console.error('Update Status Error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Format ID warga tidak valid.'
      });
    }
    return res.status(500).json({
      success: false,
      message: `Terjadi kesalahan server: ${error.message}`
    });
  }
};
