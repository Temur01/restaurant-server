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
 *   name: Meals
 *   description: Meal management endpoints
 */

const router = express.Router();

/**
 * @swagger
 * /meals:
 *   get:
 *     summary: Get all meals
 *     tags: [Meals]
 *     responses:
 *       200:
 *         description: List of all meals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meals:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Meal'
 */
router.get('/', getAllMeals);

/**
 * @swagger
 * /meals/{id}:
 *   get:
 *     summary: Get meal by ID
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Meal details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meal'
 *       404:
 *         description: Meal not found
 */
router.get('/:id', getMealById);

/**
 * @swagger
 * /meals:
 *   post:
 *     summary: Create a new meal (Admin only)
 *     tags: [Meals]
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
 *                 description: Category ID from categories table
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
router.post('/', authMiddleware, conditionalUpload, createMeal);

/**
 * @swagger
 * /meals/{id}:
 *   put:
 *     summary: Update a meal (Admin only)
 *     tags: [Meals]
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
 *                 description: Category ID from categories table
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
router.put('/:id', authMiddleware, conditionalUpload, updateMeal);

/**
 * @swagger
 * /meals/{id}:
 *   delete:
 *     summary: Delete a meal (Admin only)
 *     tags: [Meals]
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
router.delete('/:id', authMiddleware, deleteMeal);

export default router;

