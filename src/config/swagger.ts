import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Beyougli Karshi Restaurant API',
      version: '1.0.0',
      description: 'API for Beyougli Karshi Restaurant - Admin panel and meal management',
      contact: {
        name: 'Beyougli Karshi',
        url: 'https://beyoglu-karshi.com',
        email: 'info@beyoglu-karshi.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.beyoglu-karshi.com/api'
          : 'http://localhost:3001/api',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Admin: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              example: 'alibek'
            },
            password: {
              type: 'string',
              example: 'ali_2001'
            }
          }
        },
        Meal: {
          type: 'object',
          required: ['name', 'image', 'description', 'price', 'category', 'ingredients'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: "O'sh (Palov)"
            },
            image: {
              type: 'string',
              format: 'uri',
              example: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80'
            },
            description: {
              type: 'string',
              example: 'Milliy taomimiz, to\'ylar va bayramlarda tayyorlanadigan, guruch, go\'sht va sabzi asosida pishiriladigan mazali palov.'
            },
            price: {
              type: 'integer',
              example: 25000
            },
            category: {
              type: 'string',
              example: 'Milliy taomlar'
            },
            ingredients: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['Guruch', "Qo'y go'shti", 'Sabzi', 'Piyoz', 'Noxat', 'Zira', "Yog'"]
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            updated_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            message: {
              type: 'string',
              example: 'Login successful'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Error message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    // In production, use compiled JS files from dist
    // In development, use TypeScript source files
    process.env.NODE_ENV === 'production' 
      ? path.join(__dirname, '../routes/*.js')
      : path.join(__dirname, '../routes/*.ts'),
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '../controllers/*.js')
      : path.join(__dirname, '../controllers/*.ts')
  ]
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
