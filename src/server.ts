import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import mealsRoutes from './routes/mealsRoutes';
import categoriesRoutes from './routes/categoriesRoutes';
import adminMealsRoutes from './routes/adminMealsRoutes';
import adminCategoriesRoutes from './routes/adminCategoriesRoutes';
import { specs, swaggerUi } from './config/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - Allow all origins for public API
const allowedOrigins = [
  'https://beyoglu-karshi.com',
  'https://www.beyoglu-karshi.com',
  'https://admin.beyoglu-karshi.com',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:4173'
];

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps, curl, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, allow all Vercel preview deployments and localhost
    if (origin.includes('vercel.app') || 
        origin.includes('localhost') || 
        origin.includes('127.0.0.1') ||
        allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // For other origins, still allow but log it
      console.log('CORS: Allowing origin:', origin);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Additional CORS headers for all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Always set CORS headers to allow the requesting origin
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger Documentation - Serve raw JSON spec
app.get('/api-docs.json', (req, res) => {
  console.log('📄 Swagger JSON requested');
  const specsAny = specs as any;
  console.log('Specs paths:', specsAny.paths ? Object.keys(specsAny.paths).length : 0, 'endpoints');
  res.json(specs);
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Beyougli Karshi API Documentation',
  swaggerOptions: {
    url: '/api-docs.json'
  }
}));

// Debug: Log all requests
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path} ${req.url}`);
  next();
});

// Public Routes (NO AUTH REQUIRED - for HomePage)
app.use('/api/meals', mealsRoutes);
app.use('/api/categories', categoriesRoutes);

// Admin Routes (AUTH REQUIRED - for Admin Panel)
app.use('/api/admin/meals', adminMealsRoutes);
app.use('/api/admin/categories', adminCategoriesRoutes);

// Authentication Routes
app.use('/api/auth', authRoutes);

// Test endpoint to verify routing
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    publicEndpoints: {
      categories: '/api/categories',
      meals: '/api/meals'
    },
    adminEndpoints: {
      categories: '/api/admin/categories (requires auth)',
      meals: '/api/admin/meals (requires auth)'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server ishlayapti' });
});

// Version check
app.get('/api/version', (req, res) => {
  res.json({ 
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    message: 'Separate public and admin endpoints - HomePage no auth, Admin Panel requires auth',
    publicRoutes: {
      categories: 'GET /api/categories (no auth)',
      meals: 'GET /api/meals (no auth)'
    },
    adminRoutes: {
      categories: 'ALL /api/admin/categories (auth required)',
      meals: 'ALL /api/admin/meals (auth required)',
      auth: 'POST /api/auth/login, POST /api/auth/register'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Yo\'nalish topilmadi' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Server xatosi', error: err.message });
});

// Only start server if this file is run directly (not imported as a module)
// This prevents the server from starting when imported by Vercel serverless functions
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT}-portda ishga tushdi`);
    console.log(`📍 API: http://localhost:${PORT}/api`);
    console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
  });
}

export default app;

