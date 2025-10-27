import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

// Upload a file and return its ID
export const uploadFile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Fayl yuklanmadi' });
    }

    const { filename, originalname, mimetype, size } = req.file;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${filename}`;

    // Save file metadata to database
    const result = await pool.query(
      `INSERT INTO uploads (filename, original_name, mimetype, size, url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [filename, originalname, mimetype, size, fileUrl]
    );

    res.status(201).json({
      success: true,
      message: 'Fayl muvaffaqiyatli yuklandi',
      upload: result.rows[0]
    });
  } catch (error: any) {
    console.error('Upload file error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Server xatosi',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all uploads
export const getAllUploads = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM uploads ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      uploads: result.rows
    });
  } catch (error) {
    console.error('Get uploads error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// Get upload by ID
export const getUploadById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM uploads WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fayl topilmadi' });
    }

    res.json({
      success: true,
      upload: result.rows[0]
    });
  } catch (error) {
    console.error('Get upload error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// Delete upload
export const deleteUpload = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Get upload info
    const uploadResult = await pool.query(
      'SELECT * FROM uploads WHERE id = $1',
      [id]
    );

    if (uploadResult.rows.length === 0) {
      return res.status(404).json({ message: 'Fayl topilmadi' });
    }

    const upload = uploadResult.rows[0];

    // Check if file is being used by any meal
    const mealCheck = await pool.query(
      'SELECT id FROM meals WHERE image_id = $1 LIMIT 1',
      [id]
    );

    if (mealCheck.rows.length > 0) {
      return res.status(400).json({ 
        message: 'Bu fayl taomda ishlatilmoqda. Avval taomdan olib tashlang' 
      });
    }

    // Delete file from filesystem
    try {
      const filePath = path.join(__dirname, '../../uploads', upload.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fsError) {
      console.error('File deletion error:', fsError);
      // Continue with database deletion even if file doesn't exist
    }

    // Delete from database
    await pool.query('DELETE FROM uploads WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Fayl muvaffaqiyatli o\'chirildi'
    });
  } catch (error) {
    console.error('Delete upload error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

