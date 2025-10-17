# API Endpoints Reference

## 🌍 PUBLIC Endpoints (No Authentication Required)
**Use these for HomePage - anyone can access**

### Categories
```bash
# Get all categories
GET /api/categories

# Get single category
GET /api/categories/:id

# Test endpoint
GET /api/categories/test
```

### Meals
```bash
# Get all meals
GET /api/meals

# Get single meal
GET /api/meals/:id
```

**Example for frontend (HomePage):**
```javascript
// No authentication needed
fetch('https://your-domain.vercel.app/api/categories')
  .then(res => res.json())
  .then(data => console.log(data));

fetch('https://your-domain.vercel.app/api/meals')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 🔒 PROTECTED Endpoints (Authentication Required)
**Use these for Dashboard - requires admin login**

### Authentication
```bash
# Login (get JWT token)
POST /api/auth/login
Body: {
  "email": "admin@example.com",
  "password": "your_password"
}

# Register new admin
POST /api/auth/register
Body: {
  "email": "admin@example.com",
  "password": "your_password",
  "name": "Admin Name"
}
```

### Categories (Admin Only)
```bash
# Create category
POST /api/categories
Headers: Authorization: Bearer <token>
Body: { "name": "Category Name" }

# Update category
PUT /api/categories/:id
Headers: Authorization: Bearer <token>
Body: { "name": "Updated Name" }

# Delete category
DELETE /api/categories/:id
Headers: Authorization: Bearer <token>
```

### Meals (Admin Only)
```bash
# Create meal
POST /api/meals
Headers: Authorization: Bearer <token>
Body: {
  "name": "Meal Name",
  "image": "https://image-url.com/image.jpg",
  "description": "Description",
  "price": 50000,
  "category_id": 1,
  "ingredients": ["ingredient1", "ingredient2"]
}

# Update meal
PUT /api/meals/:id
Headers: Authorization: Bearer <token>
Body: {
  "name": "Updated Name",
  "image": "https://image-url.com/image.jpg",
  "description": "Updated Description",
  "price": 60000,
  "category_id": 1,
  "ingredients": ["ingredient1", "ingredient2"]
}

# Delete meal
DELETE /api/meals/:id
Headers: Authorization: Bearer <token>
```

**Example for frontend (Dashboard):**
```javascript
// First, login to get token
const loginResponse = await fetch('https://your-domain.vercel.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'your_password'
  })
});
const { token } = await loginResponse.json();

// Then use token for protected endpoints
const response = await fetch('https://your-domain.vercel.app/api/meals', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'New Meal',
    image: 'https://example.com/image.jpg',
    description: 'Delicious meal',
    price: 50000,
    category_id: 1,
    ingredients: ['tomato', 'cheese']
  })
});
```

---

## Summary

✅ **HomePage (Public Access):**
- GET /api/categories → List all categories
- GET /api/meals → List all meals
- No authentication needed

✅ **Dashboard (Admin Access):**
- POST /api/auth/login → Login to get token
- POST/PUT/DELETE /api/categories → Manage categories (requires token)
- POST/PUT/DELETE /api/meals → Manage meals (requires token)
- Authentication required (use JWT token in Authorization header)

---

## Testing Locally

Start your server:
```bash
npm run dev
```

Test public endpoints (no auth):
```bash
curl http://localhost:3001/api/categories
curl http://localhost:3001/api/meals
```

Test protected endpoints (with auth):
```bash
# 1. Login first
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}'

# 2. Use the token from response
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"Test Category"}'
```

