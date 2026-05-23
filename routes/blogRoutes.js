import express from 'express';
import { getBlogs, getBlogById } from '../controllers/blogController.js';

const router = express.Router();

// Public routes for citizens (warga)
router.get('/', getBlogs);
router.get('/:id', getBlogById);

export default router;
