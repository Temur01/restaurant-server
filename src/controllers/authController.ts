import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

export const login = async (req: Request, res: Response) => {
  try {
    
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username va parol talab qilinadi' });
    }

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server konfiguratsiyasi xatosi' });
    }

    
    // Find admin by username
    const result = await pool.query(
      'SELECT * FROM admins WHERE username = $1',
      [username]
    );
    

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Noto\'g\'ri username yoki parol' });
    }

    const admin = result.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Noto\'g\'ri username yoki parol' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: admin.id, username: admin.username },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Muvaffaqiyatli kirildi',
      token,
      user: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server xatosi',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
    });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token topilmadi' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; username: string };

    res.json({
      valid: true,
      user: {
        id: decoded.userId,
        username: decoded.username
      }
    });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Noto\'g\'ri token' });
  }
};

