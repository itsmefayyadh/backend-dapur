import Recipe from '../../models/Recipe.js';
import Comment from '../../models/Comment.js';

// @desc    Create a recipe content
// @route   POST /api/admin/recipes
// @access  Private/Admin
export const createRecipe = async (req, res) => {
  try {
    const {
      judul,
      kategori,
      tingkatKesulitan,
      estimasiWaktu,
      porsi,
      bahan,
      langkah,
      estimasiModal,
      videoURL,
      fotoURL
    } = req.body;

    // Validate mandatory fields
    if (
      !judul ||
      !kategori ||
      !bahan ||
      bahan.length === 0 ||
      !langkah ||
      langkah.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Pembuatan resep gagal: Judul, Kategori, Bahan, dan Langkah wajib diisi.'
      });
    }

    const recipe = await Recipe.create({
      judul,
      kategori,
      tingkatKesulitan,
      estimasiWaktu,
      porsi,
      bahan,
      langkah,
      estimasiModal: estimasiModal || 0,
      videoURL: videoURL || '',
      fotoURL: fotoURL || '',
      author: req.user._id // Logged in admin
    });

    return res.status(201).json({
      success: true,
      message: 'Resep baru berhasil dibuat oleh Admin.',
      data: recipe
    });
  } catch (error) {
    console.error('Create Recipe Error:', error.message);
    return res.status(500).json({
      success: false,
      message: `Terjadi kesalahan server: ${error.message}`
    });
  }
};

// @desc    Update a recipe
// @route   PUT /api/admin/recipes/:id
// @access  Private/Admin
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Pembaruan resep gagal: Resep tidak ditemukan.'
      });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Resep berhasil diperbarui.',
      data: updatedRecipe
    });
  } catch (error) {
    console.error('Update Recipe Error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Format ID resep tidak valid.'
      });
    }
    return res.status(500).json({
      success: false,
      message: `Terjadi kesalahan server: ${error.message}`
    });
  }
};

// @desc    Delete a recipe (and clean up its comments)
// @route   DELETE /api/admin/recipes/:id
// @access  Private/Admin
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Penghapusan resep gagal: Resep tidak ditemukan.'
      });
    }

    // Delete the recipe
    await Recipe.findByIdAndDelete(req.params.id);

    // Delete associated comments
    await Comment.deleteMany({ recipeID: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Resep dan komentar terkait berhasil dihapus dari database.'
    });
  } catch (error) {
    console.error('Delete Recipe Error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Format ID resep tidak valid.'
      });
    }
    return res.status(500).json({
      success: false,
      message: `Terjadi kesalahan server: ${error.message}`
    });
  }
};
