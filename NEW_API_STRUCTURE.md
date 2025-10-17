# 🎯 NEW API Structure - Public & Admin Endpoints

## Overview

Your API now has **TWO separate sets of endpoints**:

1. **🌍 PUBLIC Endpoints** - For HomePage (NO authentication required)
2. **🔒 ADMIN Endpoints** - For Admin Panel (Authentication REQUIRED)

---

## 🌍 PUBLIC ENDPOINTS (for HomePage)

### ✅ **NO Authentication Required** - These work immediately!

#### Categories
```bash
# Get all categories
GET https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/categories

# Get single category
GET https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/categories/:id
```

#### Meals
```bash
# Get all meals
GET https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/meals

# Get single meal
GET https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/meals/:id
```

### Frontend Example (HomePage)
```javascript
// ✅ NO AUTH NEEDED - Use these for HomePage
const HomePage = () => {
  const [meals, setMeals] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories - NO TOKEN NEEDED ✅
    fetch('https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories))
      .catch(err => console.error(err));

    // Fetch meals - NO TOKEN NEEDED ✅
    fetch('https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/meals')
      .then(res => res.json())
      .then(data => setMeals(data.meals))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Menu</h1>
      {meals.map(meal => (
        <div key={meal.id}>{meal.name} - {meal.price}</div>
      ))}
    </div>
  );
};
```

---

## 🔒 ADMIN ENDPOINTS (for Admin Panel)

### ⚠️ **Authentication Required** - Must login first!

#### Authentication
```bash
# Login (get JWT token)
POST https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your_password"
}

# Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### Admin Categories (ALL operations require auth)
```bash
# Get all categories (with auth)
GET https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/admin/categories
Authorization: Bearer <token>

# Get single category (with auth)
GET https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/admin/categories/:id
Authorization: Bearer <token>

# Create category (with auth)
POST https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/admin/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Category"
}

# Update category (with auth)
PUT https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/admin/categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Category"
}

# Delete category (with auth)
DELETE https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/admin/categories/:id
Authorization: Bearer <token>
```

#### Admin Meals (ALL operations require auth)
```bash
# Get all meals (with auth)
GET https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/admin/meals
Authorization: Bearer <token>

# Get single meal (with auth)
GET https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/admin/meals/:id
Authorization: Bearer <token>

# Create meal (with auth)
POST https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/admin/meals
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Meal",
  "image": "https://example.com/image.jpg",
  "description": "Delicious meal",
  "price": 50000,
  "category_id": 1,
  "ingredients": ["ingredient1", "ingredient2"]
}

# Update meal (with auth)
PUT https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/admin/meals/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Meal",
  "image": "https://example.com/image.jpg",
  "description": "Updated description",
  "price": 60000,
  "category_id": 1,
  "ingredients": ["ingredient1", "ingredient2"]
}

# Delete meal (with auth)
DELETE https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/admin/meals/:id
Authorization: Bearer <token>
```

### Frontend Example (Admin Panel)
```javascript
// 🔒 AUTH REQUIRED - Use these for Admin Panel
const AdminPanel = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [meals, setMeals] = useState([]);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch(
        'https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        }
      );
      
      const data = await response.json();
      
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Fetch meals for admin (with auth)
  const fetchMeals = async () => {
    try {
      const response = await fetch(
        'https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/admin/meals',
        {
          headers: {
            'Authorization': `Bearer ${token}` // ← Required!
          }
        }
      );
      
      const data = await response.json();
      setMeals(data.meals);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
    }
  };

  // Create new meal (with auth)
  const createMeal = async (mealData) => {
    try {
      const response = await fetch(
        'https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/admin/meals',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // ← Required!
          },
          body: JSON.stringify(mealData)
        }
      );
      
      const data = await response.json();
      console.log('Meal created:', data);
      fetchMeals(); // Refresh list
    } catch (error) {
      console.error('Failed to create meal:', error);
    }
  };

  // Update meal (with auth)
  const updateMeal = async (id, mealData) => {
    try {
      const response = await fetch(
        `https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/admin/meals/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // ← Required!
          },
          body: JSON.stringify(mealData)
        }
      );
      
      const data = await response.json();
      console.log('Meal updated:', data);
      fetchMeals(); // Refresh list
    } catch (error) {
      console.error('Failed to update meal:', error);
    }
  };

  // Delete meal (with auth)
  const deleteMeal = async (id) => {
    try {
      const response = await fetch(
        `https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/admin/meals/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}` // ← Required!
          }
        }
      );
      
      const data = await response.json();
      console.log('Meal deleted:', data);
      fetchMeals(); // Refresh list
    } catch (error) {
      console.error('Failed to delete meal:', error);
    }
  };

  return (
    <div>
      {!token ? (
        <LoginForm onLogin={login} />
      ) : (
        <div>
          <h1>Admin Panel</h1>
          <button onClick={fetchMeals}>Load Meals</button>
          <button onClick={() => createMeal({
            name: 'Test Meal',
            image: 'https://example.com/image.jpg',
            description: 'Test',
            price: 50000,
            category_id: 1,
            ingredients: ['test']
          })}>
            Create Meal
          </button>
          {/* Display meals list */}
        </div>
      )}
    </div>
  );
};
```

---

## 📊 Quick Reference Table

| Endpoint | Auth Required? | Used In | Methods |
|----------|---------------|---------|---------|
| `/api/categories` | ❌ NO | HomePage | GET only |
| `/api/meals` | ❌ NO | HomePage | GET only |
| `/api/admin/categories` | ✅ YES | Admin Panel | GET, POST, PUT, DELETE |
| `/api/admin/meals` | ✅ YES | Admin Panel | GET, POST, PUT, DELETE |
| `/api/auth/login` | ❌ NO | Admin Panel | POST |
| `/api/auth/register` | ❌ NO | Setup | POST |

---

## 🧪 Testing

### Test Public Endpoints (No Auth)
```bash
# Test categories - should work immediately ✅
curl https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/categories

# Test meals - should work immediately ✅
curl https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/meals
```

### Test Admin Endpoints (With Auth)
```bash
# Step 1: Login to get token
curl -X POST https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}'

# Response will include: { "token": "eyJhbGc..." }

# Step 2: Use token for admin endpoints
curl https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Step 3: Create new category
curl -X POST https://restaurant-server-107q2b1rl-temur01s-projects.vercel.app/api/admin/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"New Category"}'
```

---

## ✅ What Changed?

### Before (Old Structure)
```
GET  /api/categories     → No auth ✅
POST /api/categories     → Auth required 🔒
PUT  /api/categories/:id → Auth required 🔒
```

### After (New Structure)
```
PUBLIC (for HomePage):
GET /api/categories     → No auth ✅
GET /api/meals         → No auth ✅

ADMIN (for Admin Panel):
ALL /api/admin/categories → Auth required 🔒
ALL /api/admin/meals     → Auth required 🔒
```

---

## 🚀 Deployment

The changes are ready! Just deploy to Vercel:

```bash
# Deploy to Vercel
vercel --prod
```

Or push to GitHub and Vercel will auto-deploy.

---

## 💡 Summary

✅ **HomePage** uses:
- `GET /api/categories` (public, no auth)
- `GET /api/meals` (public, no auth)

✅ **Admin Panel** uses:
- `POST /api/auth/login` (to get token)
- `ALL /api/admin/categories` (with token)
- `ALL /api/admin/meals` (with token)

**No more 401 errors on HomePage!** 🎉

