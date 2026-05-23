import express from 'express';
import {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  createBlog,
  updateBlog,
  deleteBlog,
  getPendingComments,
  approveComment,
  deleteComment
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply role-based authentication to all admin routes
router.use(protect);
router.use(authorize('admin'));

// Stats & Users routes
router.get('/dashboard-stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);

// Recipes CRUD routes
router.post('/recipes', createRecipe);
router.put('/recipes/:id', updateRecipe);
router.delete('/recipes/:id', deleteRecipe);

// Blogs CRUD routes (POST to /blogs, PUT/DELETE with /blogs/:id)
router.post('/blogs', createBlog);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);

// Comments moderation routes
router.get('/comments', getPendingComments);
router.put('/comments/:id/approve', approveComment);
router.delete('/comments/:id', deleteComment);

export default router;
