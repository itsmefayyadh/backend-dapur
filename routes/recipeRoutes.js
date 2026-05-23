import express from 'express';
import {
  getRecipes,
  getRecipeById,
  commentOnRecipe,
  toggleBookmark
} from '../controllers/recipeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for citizens (warga)
router.get('/', getRecipes);
router.get('/:id', getRecipeById);

// Protected routes (requires login)
router.post('/:id/comment', protect, commentOnRecipe);
router.post('/:id/bookmark', protect, toggleBookmark);

export default router;
