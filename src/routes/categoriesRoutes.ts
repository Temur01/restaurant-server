import express from 'express';
import {
  getAllCategories,
  getCategoryById
} from '../controllers/categoriesController';

/**
 * @swagger
 * tags:
 *   name: Categories (Public)
 *   description: Public category endpoints - NO authentication required (for HomePage)
 */

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories (Public - No Auth Required)
 *     tags: [Categories (Public)]
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
router.get('/', getAllCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID (Public - No Auth Required)
 *     tags: [Categories (Public)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
router.get('/:id', getCategoryById);

export default router;
