import Recipe from '../models/Recipe.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

// @desc    Get all recipes with search (by title) and filter (by category)
// @route   GET /api/recipes
// @access  Public
export const getRecipes = async (req, res) => {
  try {
    const { search, category } = req.query;
    const queryObject = {};

    // Search query by title (case-insensitive regex)
    if (search) {
      queryObject.judul = { $regex: search, $options: 'i' };
    }

    // Filter by category
    if (category) {
      queryObject.kategori = category;
    }

    const recipes = await Recipe.find(queryObject)
      .populate('author', 'namaLengkap status')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Data resep berhasil diambil.',
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error('Get Recipes Error:', error.message);
    return res.status(500).json({
      success: false,
      message: `Terjadi kesalahan server: ${error.message}`
    });
  }
};

// @desc    Get single recipe details with its approved comments
// @route   GET /api/recipes/:id
// @access  Public
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'namaLengkap status');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Resep tidak ditemukan.'
      });
    }

    // Fetch only approved comments for this recipe, populated with user info
    const comments = await Comment.find({
      recipeID: recipe._id,
      isApproved: true
    })
      .populate('userID', 'namaLengkap status')
      .sort({ tanggal: -1 });

    return res.status(200).json({
      success: true,
      message: 'Detail resep berhasil diambil.',
      data: {
        recipe,
        comments
      }
    });
  } catch (error) {
    console.error('Get Recipe Details Error:', error.message);
    // Handle invalid ObjectId cast error
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

// @desc    Add comment to a recipe
// @route   POST /api/recipes/:id/comment
// @access  Private (Warga & Admin can comment)
export const commentOnRecipe = async (req, res) => {
  try {
    const { isiKomentar } = req.body;

    if (!isiKomentar || isiKomentar.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Komentar gagal: Isi komentar tidak boleh kosong.'
      });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Komentar gagal: Resep tidak ditemukan.'
      });
    }

    // Create a new comment linked to the recipe (default isApproved = false)
    const comment = await Comment.create({
      userID: req.user._id,
      recipeID: recipe._id,
      isiKomentar,
      isApproved: false
    });

    return res.status(201).json({
      success: true,
      message: 'Komentar berhasil ditambahkan dan sedang menunggu moderasi dari admin.',
      data: comment
    });
  } catch (error) {
    console.error('Add Comment Error:', error.message);
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

// @desc    Toggle recipe bookmark for logged in user
// @route   POST /api/recipes/:id/bookmark
// @access  Private
export const toggleBookmark = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark gagal: Resep tidak ditemukan.'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark gagal: Pengguna tidak ditemukan.'
      });
    }

    const isBookmarked = user.bookmarks.includes(recipeId);

    if (isBookmarked) {
      // Remove recipe ID from user's bookmarks array
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== recipeId.toString()
      );
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Resep berhasil dihapus dari bookmark.',
        isBookmarked: false
      });
    } else {
      // Add recipe ID to user's bookmarks array
      user.bookmarks.push(recipeId);
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Resep berhasil ditambahkan ke dalam bookmark.',
        isBookmarked: true
      });
    }
  } catch (error) {
    console.error('Toggle Bookmark Error:', error.message);
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
