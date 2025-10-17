import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Get all meals
export const getAllMeals = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT m.*, c.name as category_name
       FROM meals m
       LEFT JOIN categories c ON m.category_id = c.id
       ORDER BY m.created_at DESC`
    );

    // Transform the result to include category as an object
    const meals = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      image: row.image,
      description: row.description,
      price: row.price,
      category: row.category_name, // Keep for backward compatibility
      category_id: row.category_id,
      category_info: {
        id: row.category_id,
        name: row.category_name
      },
      ingredients: row.ingredients,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));

    res.json({
      success: true,
      meals: meals
    });
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// Get single meal
export const getMealById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT m.*, c.name as category_name
       FROM meals m
       LEFT JOIN categories c ON m.category_id = c.id
       WHERE m.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Taom topilmadi' });
    }

    const row = result.rows[0];
    const meal = {
      id: row.id,
      name: row.name,
      image: row.image,
      description: row.description,
      price: row.price,
      category: row.category_name, // Keep for backward compatibility
      category_id: row.category_id,
      category_info: {
        id: row.category_id,
        name: row.category_name
      },
      ingredients: row.ingredients,
      created_at: row.created_at,
      updated_at: row.updated_at
    };

    res.json({
      success: true,
      meal: meal
    });
  } catch (error) {
    console.error('Get meal error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// Create new meal
export const createMeal = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, category_id, ingredients } = req.body;
    
    // Handle file upload or URL
    let imageUrl = req.body.image; // For URL input
    if (req.file) {
      // If file is uploaded, use the full URL
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    if (!name || !imageUrl || !description || !price || !category_id || !ingredients) {
      return res.status(400).json({ message: 'Barcha maydonlar to\'ldirilishi kerak' });
    }

    // Parse ingredients if it's a string
    let parsedIngredients = ingredients;
    if (typeof ingredients === 'string') {
      try {
        parsedIngredients = JSON.parse(ingredients);
      } catch (e) {
        return res.status(400).json({ message: 'Tarkib noto\'g\'ri formatda' });
      }
    }

    // Verify category exists
    const categoryCheck = await pool.query(
      'SELECT id FROM categories WHERE id = $1',
      [category_id]
    );

    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Kategoriya topilmadi' });
    }

    const result = await pool.query(
      `INSERT INTO meals (name, image, description, price, category_id, ingredients, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       RETURNING *`,
      [name, imageUrl, description, price, category_id, parsedIngredients]
    );

    res.status(201).json({
      success: true,
      message: 'Taom muvaffaqiyatli qo\'shildi',
      meal: result.rows[0]
    });
  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// Update meal
export const updateMeal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, ingredients } = req.body;
    
    // Handle file upload or URL
    let imageUrl = req.body.image; // For URL input
    if (req.file) {
      // If file is uploaded, use the full URL
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    if (!name || !imageUrl || !description || !price || !category_id || !ingredients) {
      return res.status(400).json({ message: 'Barcha maydonlar to\'ldirilishi kerak' });
    }

    // Parse ingredients if it's a string
    let parsedIngredients = ingredients;
    if (typeof ingredients === 'string') {
      try {
        parsedIngredients = JSON.parse(ingredients);
      } catch (e) {
        return res.status(400).json({ message: 'Tarkib noto\'g\'ri formatda' });
      }
    }

    // Verify category exists
    const categoryCheck = await pool.query(
      'SELECT id FROM categories WHERE id = $1',
      [category_id]
    );

    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Kategoriya topilmadi' });
    }

    const result = await pool.query(
      `UPDATE meals 
       SET name = $1, image = $2, description = $3, price = $4, 
           category_id = $5, ingredients = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [name, imageUrl, description, price, category_id, parsedIngredients, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Taom topilmadi' });
    }

    res.json({
      success: true,
      message: 'Taom muvaffaqiyatli yangilandi',
      meal: result.rows[0]
    });
  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// Delete meal
export const deleteMeal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM meals WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Taom topilmadi' });
    }

    res.json({
      success: true,
      message: 'Taom muvaffaqiyatli o\'chirildi'
    });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

