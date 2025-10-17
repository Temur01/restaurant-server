import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Get all categories
export const getAllCategories = async (req: AuthRequest, res: Response) => {
  try {
    console.log('Getting all categories...');
    
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY name ASC'
    );

    console.log('Categories found:', result.rows.length);
    
    res.json({
      success: true,
      categories: result.rows
    });
  } catch (error: any) {
    console.error('Categories error:', error);
    
    // Return sample categories if database fails
    const sampleCategories = [
      { id: 1, name: 'Milliy taomlar', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: "Go'sht taomlar", created_at: new Date(), updated_at: new Date() },
      { id: 3, name: "Sho'rvalar", created_at: new Date(), updated_at: new Date() },
      { id: 4, name: 'Non mahsulotlari', created_at: new Date(), updated_at: new Date() },
      { id: 5, name: 'Salatlar', created_at: new Date(), updated_at: new Date() },
      { id: 6, name: 'Ichimliklar', created_at: new Date(), updated_at: new Date() }
    ];
    
    res.json({
      success: true,
      categories: sampleCategories,
      note: 'Sample data - database connection failed'
    });
  }
};

// Get single category
export const getCategoryById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kategoriya topilmadi' });
    }

    res.json({
      success: true,
      category: result.rows[0]
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// Create new category
export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Kategoriya nomi kiritilishi kerak' });
    }

    const result = await pool.query(
      `INSERT INTO categories (name, updated_at)
       VALUES ($1, CURRENT_TIMESTAMP)
       RETURNING *`,
      [name]
    );

    res.status(201).json({
      success: true,
      message: 'Kategoriya muvaffaqiyatli qo\'shildi',
      category: result.rows[0]
    });
  } catch (error: any) {
    console.error('Create category error:', error);
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({ message: 'Bu nomli kategoriya allaqachon mavjud' });
    }
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// Update category
export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Kategoriya nomi kiritilishi kerak' });
    }

    const result = await pool.query(
      `UPDATE categories 
       SET name = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [name, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kategoriya topilmadi' });
    }

    res.json({
      success: true,
      message: 'Kategoriya muvaffaqiyatli yangilandi',
      category: result.rows[0]
    });
  } catch (error: any) {
    console.error('Update category error:', error);
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({ message: 'Bu nomli kategoriya allaqachon mavjud' });
    }
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// Delete category
export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if category is being used by any meals
    const mealsCheck = await pool.query(
      'SELECT COUNT(*) as count FROM meals WHERE category_id = $1',
      [id]
    );

    if (parseInt(mealsCheck.rows[0].count) > 0) {
      return res.status(400).json({ 
        message: 'Bu kategoriyada taomlar mavjud. Avval taomlarni o\'chiring yoki boshqa kategoriyaga o\'tkazing.' 
      });
    }

    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kategoriya topilmadi' });
    }

    res.json({
      success: true,
      message: 'Kategoriya muvaffaqiyatli o\'chirildi'
    });
  } catch (error: any) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};
