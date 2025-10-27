import express from 'express';
import {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal
} from '../controllers/mealsController';
import { authMiddleware } from '../middleware/auth';

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
 *             required: [name, price, category_id]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Meal name (required)
 *               price:
 *                 type: integer
 *                 description: Meal price (required)
 *               category_id:
 *                 type: integer
 *                 description: Category ID (required)
 *               image:
 *                 type: string
 *                 description: Image URL (optional, use either this or image_id)
 *               image_id:
 *                 type: integer
 *                 description: Upload ID from /api/uploads endpoint (optional, use either this or image)
 *               description:
 *                 type: string
 *                 description: Meal description (optional)
 *               ordernumber:
 *                 type: integer
 *                 description: Order number for sorting within category (optional, default: 0)
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of ingredients (optional)
 *     responses:
 *       201:
 *         description: Meal created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', createMeal);

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
 *             required: [name, price, category_id]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Meal name (required)
 *               price:
 *                 type: integer
 *                 description: Meal price (required)
 *               category_id:
 *                 type: integer
 *                 description: Category ID (required)
 *               image:
 *                 type: string
 *                 description: Image URL (optional, use either this or image_id)
 *               image_id:
 *                 type: integer
 *                 description: Upload ID from /api/uploads endpoint (optional, use either this or image)
 *               description:
 *                 type: string
 *                 description: Meal description (optional)
 *               ordernumber:
 *                 type: integer
 *                 description: Order number for sorting within category (optional, default: 0)
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of ingredients (optional)
 *     responses:
 *       200:
 *         description: Meal updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Meal not found
 */
router.put('/:id', updateMeal);

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

