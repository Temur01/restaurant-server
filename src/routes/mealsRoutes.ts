import express from 'express';
import {
  getAllMeals,
  getMealById
} from '../controllers/mealsController';

/**
 * @swagger
 * tags:
 *   name: Meals (Public)
 *   description: Public meal endpoints - NO authentication required (for HomePage)
 */

const router = express.Router();

/**
 * @swagger
 * /meals:
 *   get:
 *     summary: Get all meals (Public - No Auth Required)
 *     tags: [Meals (Public)]
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
 *     summary: Get meal by ID (Public - No Auth Required)
 *     tags: [Meals (Public)]
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

export default router;

