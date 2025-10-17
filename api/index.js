// Vercel serverless function entry point
console.log('🚀 Loading Vercel serverless function...');
try {
  // Import the compiled Express app
  const server = require('../dist/server.js');
  const app = server.default || server;
  
  // Ensure the app is properly initialized
  if (!app) {
    console.error('❌ Failed to load Express app - app is null or undefined');
    throw new Error('Express app not properly exported');
  }
  
  if (typeof app !== 'function') {
    console.error('❌ Express app is not a function, type:', typeof app);
    throw new Error('Express app is not a valid Express instance');
  }
  
  console.log('✅ Express app loaded successfully');
  
  // Allowed origins
  const allowedOrigins = [
    'https://www.beyoglu-karshi.com',
    'https://beyoglu-karshi.com',
    'https://admin.beyoglu-karshi.com',
    'https://restaurant-gcfar8tmg-temur01s-projects.vercel.app',
    'http://localhost:3001',
    'http://localhost:3000'
  ];
  
  const handler = (req, res) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else if (!origin) {
      // If no origin header (same-origin request or tools like Postman)
      res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    return app(req, res);
  };
  
  // Export the handler for Vercel serverless
  module.exports = handler;
  module.exports.default = handler;
  
} catch (error) {
  console.error('❌ Error loading serverless function:', error);
  
  // Fallback handler that returns the error
  module.exports = (req, res) => {
    res.status(500).json({
      error: 'Failed to load Express app',
      message: error.message,
      stack: error.stack
    });
  };
  module.exports.default = module.exports;
}
