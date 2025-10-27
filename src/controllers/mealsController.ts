import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Get all meals
export const getAllMeals = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT m.*, c.name as category_name, u.url as upload_url
       FROM meals m
       LEFT JOIN categories c ON m.category_id = c.id
       LEFT JOIN uploads u ON m.image_id = u.id
       ORDER BY m.created_at DESC`
    );

    // Transform the result to include category as an object
    const meals = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      image: row.upload_url || row.image, // Prefer upload_url if image_id is set
      image_id: row.image_id,
      description: row.description,
      price: row.price,
      ordernumber: row.ordernumber || 0,
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
      `SELECT m.*, c.name as category_name, u.url as upload_url
       FROM meals m
       LEFT JOIN categories c ON m.category_id = c.id
       LEFT JOIN uploads u ON m.image_id = u.id
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
      image: row.upload_url || row.image, // Prefer upload_url if image_id is set
      image_id: row.image_id,
      description: row.description,
      price: row.price,
      ordernumber: row.ordernumber || 0,
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
    const { name, description, price, category_id, ingredients, ordernumber, image_id } = req.body;
    
    // Handle file upload or URL or image_id
    let imageUrl = req.body.image || ''; // For URL input, default to empty string
    let imageIdInt = null;
    
    if (req.file) {
      // If file is uploaded, use the full URL
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    } else if (image_id) {
      // If image_id is provided, verify it exists and use it
      imageIdInt = parseInt(image_id);
      if (!isNaN(imageIdInt)) {
        const uploadCheck = await pool.query(
          'SELECT id, url FROM uploads WHERE id = $1',
          [imageIdInt]
        );
        
        if (uploadCheck.rows.length === 0) {
          return res.status(400).json({ message: 'Rasm ID topilmadi' });
        }
        // Don't set imageUrl, we'll use image_id
        imageUrl = ''; // Clear imageUrl when using image_id
      }
    }

    // Only name, price, and category_id are required
    if (!name || !price || !category_id) {
      return res.status(400).json({ message: 'Nom, narx va kategoriya kiritilishi kerak' });
    }

    // Convert price and category_id to integers (they come as strings from form-data)
    const priceInt = parseInt(price);
    const categoryIdInt = parseInt(category_id);
    const ordernumberInt = ordernumber !== undefined && ordernumber !== null && ordernumber !== '' ? parseInt(ordernumber) : 0;

    // Validate the conversions
    if (isNaN(priceInt) || priceInt <= 0) {
      return res.status(400).json({ message: 'Narx musbat son bo\'lishi kerak' });
    }

    if (isNaN(categoryIdInt) || categoryIdInt <= 0) {
      return res.status(400).json({ message: 'Kategoriya ID musbat son bo\'lishi kerak' });
    }

    // Parse ingredients if it's a string, otherwise default to empty array
    let parsedIngredients = [];
    if (ingredients !== undefined && ingredients !== null && ingredients !== '') {
      if (typeof ingredients === 'string') {
        try {
          parsedIngredients = JSON.parse(ingredients);
        } catch (e) {
          // If parsing fails, treat as comma-separated string
          parsedIngredients = ingredients.split(',').map((item: string) => item.trim()).filter((item: string) => item);
        }
      } else if (Array.isArray(ingredients)) {
        parsedIngredients = ingredients;
      }
    }

    // Verify category exists
    const categoryCheck = await pool.query(
      'SELECT id FROM categories WHERE id = $1',
      [categoryIdInt]
    );

    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Kategoriya topilmadi' });
    }

    const result = await pool.query(
      `INSERT INTO meals (name, image, image_id, description, price, category_id, "ordernumber", ingredients, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
       RETURNING *`,
      [name, imageUrl, imageIdInt, description || '', priceInt, categoryIdInt, ordernumberInt, parsedIngredients]
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
    const { name, description, price, category_id, ingredients, ordernumber, image_id } = req.body;
    
    // Handle file upload or URL or image_id - if not provided, keep existing
    let imageUrl = req.body.image;
    let imageIdInt = null;
    
    if (req.file) {
      // If file is uploaded, use the full URL and clear image_id
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
      imageIdInt = null; // Clear image_id when uploading new file
    } else if (image_id !== undefined) {
      // If image_id is provided (even if null/empty to clear it)
      if (image_id === null || image_id === '' || image_id === 'null') {
        imageIdInt = null;
      } else {
        imageIdInt = parseInt(image_id);
        if (!isNaN(imageIdInt)) {
          const uploadCheck = await pool.query(
            'SELECT id, url FROM uploads WHERE id = $1',
            [imageIdInt]
          );
          
          if (uploadCheck.rows.length === 0) {
            return res.status(400).json({ message: 'Rasm ID topilmadi' });
          }
          imageUrl = null; // Clear imageUrl when using image_id
        }
      }
    }

    // Only name, price, and category_id are required
    if (!name || !price || !category_id) {
      return res.status(400).json({ message: 'Nom, narx va kategoriya kiritilishi kerak' });
    }

    // Convert price and category_id to integers (they come as strings from form-data)
    const priceInt = parseInt(price);
    const categoryIdInt = parseInt(category_id);
    const ordernumberInt = ordernumber !== undefined && ordernumber !== null && ordernumber !== '' ? parseInt(ordernumber) : null;

    // Validate the conversions
    if (isNaN(priceInt) || priceInt <= 0) {
      return res.status(400).json({ message: 'Narx musbat son bo\'lishi kerak' });
    }

    if (isNaN(categoryIdInt) || categoryIdInt <= 0) {
      return res.status(400).json({ message: 'Kategoriya ID musbat son bo\'lishi kerak' });
    }

    // Parse ingredients if it's a string, otherwise default to empty array
    let parsedIngredients = [];
    if (ingredients !== undefined && ingredients !== null && ingredients !== '') {
      if (typeof ingredients === 'string') {
        try {
          parsedIngredients = JSON.parse(ingredients);
        } catch (e) {
          // If parsing fails, treat as comma-separated string
          parsedIngredients = ingredients.split(',').map((item: string) => item.trim()).filter((item: string) => item);
        }
      } else if (Array.isArray(ingredients)) {
        parsedIngredients = ingredients;
      }
    }

    // Verify category exists
    const categoryCheck = await pool.query(
      'SELECT id FROM categories WHERE id = $1',
      [categoryIdInt]
    );

    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Kategoriya topilmadi' });
    }

    // Update only provided fields
    const result = await pool.query(
      `UPDATE meals 
       SET name = $1, 
           image = COALESCE($2, image), 
           image_id = COALESCE($3, image_id),
           description = COALESCE($4, description), 
           price = $5, 
           category_id = $6, 
           "ordernumber" = COALESCE($7, "ordernumber"), 
           ingredients = $8, 
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [name, imageUrl, imageIdInt, description, priceInt, categoryIdInt, ordernumberInt, parsedIngredients, id]
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

