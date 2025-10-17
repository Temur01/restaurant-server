import express from 'express';
import {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal
} from '../controllers/mealsController';
import { authMiddleware } from '../middleware/auth';
import upload from '../middleware/upload';

// Conditional upload middleware - only use file upload in development
const conditionalUpload = (req: any, res: any, next: any) => {
  // In production, skip file upload (use URLs instead)
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') {
    return next();
  }
  // In development, allow file uploads
  return upload.single('image')(req, res, next);
};

/**
 * @swagger
 * tags:
 *   name: Admin Meals
 *   description: Admin-only meal management endpoints (requires authentication)
 */

const router = express.Router();

// Apply authentication middleware to ALL routes in this router
router.use(authMiddleware);

/**
 * @swagger
 * /admin/meals:
 *   get:
 *     summary: Get all meals (Admin only)
 *     tags: [Admin Meals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all meals
 *       401:
 *         description: Unauthorized
 */
router.get('/', getAllMeals);

/**
 * @swagger
 * /admin/meals/{id}:
 *   get:
 *     summary: Get meal by ID (Admin only)
 *     tags: [Admin Meals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Meal details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Meal not found
 */
router.get('/:id', getMealById);

/**
 * @swagger
 * /admin/meals:
 *   post:
 *     summary: Create a new meal (Admin only)
 *     tags: [Admin Meals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, image, description, price, category_id, ingredients]
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Meal created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', conditionalUpload, createMeal);

/**
 * @swagger
 * /admin/meals/{id}:
 *   put:
 *     summary: Update a meal (Admin only)
 *     tags: [Admin Meals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Meal updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Meal not found
 */
router.put('/:id', conditionalUpload, updateMeal);

/**
 * @swagger
 * /admin/meals/{id}:
 *   delete:
 *     summary: Delete a meal (Admin only)
 *     tags: [Admin Meals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Meal deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Meal not found
 */
router.delete('/:id', deleteMeal);

export default router;

