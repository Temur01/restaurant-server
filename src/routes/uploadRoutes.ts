import express from 'express';
import {
  uploadFile,
  getAllUploads,
  getUploadById,
  deleteUpload
} from '../controllers/uploadController';
import { authMiddleware } from '../middleware/auth';
import upload from '../middleware/upload';

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: File upload management endpoints (requires authentication)
 */

const router = express.Router();

// Apply authentication middleware to ALL routes in this router
router.use(authMiddleware);

/**
 * @swagger
 * /api/uploads:
 *   post:
 *     summary: Upload a file
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (max 5MB)
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 upload:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Upload ID to use in meals
 *                     filename:
 *                       type: string
 *                     original_name:
 *                       type: string
 *                     mimetype:
 *                       type: string
 *                     size:
 *                       type: integer
 *                     url:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: No file provided
 *       401:
 *         description: Unauthorized
 */
router.post('/', upload.single('file'), uploadFile);

/**
 * @swagger
 * /api/uploads:
 *   get:
 *     summary: Get all uploaded files
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all uploads
 *       401:
 *         description: Unauthorized
 */
router.get('/', getAllUploads);

/**
 * @swagger
 * /api/uploads/{id}:
 *   get:
 *     summary: Get upload by ID
 *     tags: [Uploads]
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
 *         description: Upload details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Upload not found
 */
router.get('/:id', getUploadById);

/**
 * @swagger
 * /api/uploads/{id}:
 *   delete:
 *     summary: Delete an upload
 *     tags: [Uploads]
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
 *         description: Upload deleted successfully
 *       400:
 *         description: File is being used by a meal
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Upload not found
 */
router.delete('/:id', deleteUpload);

export default router;

