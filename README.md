# 🍽️ Beyougli Karshi Backend API

> **Modern REST API built with Node.js, Express.js, TypeScript, and PostgreSQL**

A comprehensive restaurant management system API with authentication, file uploads, and complete CRUD operations for meals and categories.

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Authentication](#-authentication)
- [File Upload System](#-file-upload-system)
- [Admin Meals CRUD](#-admin-meals-crud-operations)
- [Categories Management](#-categories-management)
- [Public Endpoints](#-public-endpoints)
- [Error Handling](#-error-handling)
- [Technologies](#-technologies)

---

## 🚀 Quick Start

### 🌐 Base URLs

- **Production:** `https://beyoglu-karshi.uz/api`
- **Development:** `http://localhost:5000`

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL database
- npm or yarn

### Installation

1. **Create PostgreSQL Database**
```bash
createdb beyougli_karshi
```

2. **Clone and Setup Environment**
```bash
cd server
cp .env.example .env
```

3. **Configure Environment Variables** (`.env`)
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/beyougli_karshi
JWT_SECRET=your-super-secret-jwt-key-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

4. **Install Dependencies**
```bash
npm install
```

5. **Run Database Migration**
```bash
npm run build
npm run db:migrate
```

6. **Start Development Server**
```bash
npm run dev
```

Server will run at **http://localhost:5000** 🎉

---

## 📝 API Endpoints Overview

> **📌 Note:** All examples below use the full URL. Replace the base URL according to your environment:
> - **Production:** `https://beyoglu-karshi.uz/api`
> - **Development:** `http://localhost:5000`

### Quick Reference

| Category | Method | Endpoint | Auth Required | Description |
|----------|--------|----------|---------------|-------------|
| **Auth** | POST | `/api/auth/login` | ❌ | Admin login |
| **Auth** | GET | `/api/auth/verify` | ✅ | Verify token |
| **Uploads** | POST | `/api/uploads` | ✅ | Upload file |
| **Uploads** | GET | `/api/uploads` | ✅ | Get all uploads |
| **Uploads** | GET | `/api/uploads/:id` | ✅ | Get upload by ID |
| **Uploads** | DELETE | `/api/uploads/:id` | ✅ | Delete upload |
| **Meals (Public)** | GET | `/api/meals` | ❌ | Get all meals |
| **Meals (Public)** | GET | `/api/meals/:id` | ❌ | Get meal by ID |
| **Meals (Admin)** | GET | `/api/admin/meals` | ✅ | Get all meals |
| **Meals (Admin)** | GET | `/api/admin/meals/:id` | ✅ | Get meal by ID |
| **Meals (Admin)** | POST | `/api/admin/meals` | ✅ | Create meal |
| **Meals (Admin)** | PUT | `/api/admin/meals/:id` | ✅ | Update meal |
| **Meals (Admin)** | DELETE | `/api/admin/meals/:id` | ✅ | Delete meal |
| **Categories (Public)** | GET | `/api/categories` | ❌ | Get all categories |
| **Categories (Admin)** | GET | `/api/admin/categories` | ✅ | Get all categories |
| **Categories (Admin)** | POST | `/api/admin/categories` | ✅ | Create category |
| **Categories (Admin)** | PUT | `/api/admin/categories/:id` | ✅ | Update category |
| **Categories (Admin)** | DELETE | `/api/admin/categories/:id` | ✅ | Delete category |

---

## 🔐 Authentication

All admin operations require JWT authentication.

### Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "username": "admin"
  }
}
```

### Using Authentication Token

Include the JWT token in the `Authorization` header for all protected endpoints:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

### Verify Token

**Endpoint:** `GET /api/auth/verify`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "admin": {
    "id": 1,
    "username": "admin"
  }
}
```

---

## 📤 File Upload System

The file upload system allows you to upload images and manage them separately from meals. This follows a **two-step workflow** for better organization and flexibility.

### ⚡ Upload Workflow

#### Step 1: Upload File

Upload an image file to get a unique `upload_id` that you can use when creating or updating meals.

**Endpoint:** `POST /api/uploads`

**Content-Type:** `multipart/form-data`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Form Data:**
- `file`: Image file (max 5MB)
  - Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

**cURL Example:**
```bash
# Development
curl -X POST http://localhost:5000/api/uploads \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/image.jpg"

# Production
curl -X POST https://beyoglu-karshi.uz/api/uploads \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/image.jpg"
```

**JavaScript Example (using FormData):**
```javascript
// Use production or development base URL
const BASE_URL = 'https://beyoglu-karshi.uz/api'; // or 'http://localhost:5000'

const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch(`${BASE_URL}/api/uploads`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const result = await response.json();
console.log('Upload ID:', result.upload.id);
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Fayl muvaffaqiyatli yuklandi",
  "upload": {
    "id": 1,
    "filename": "file-1698765432123-987654321.jpg",
    "original_name": "delicious-meal.jpg",
    "mimetype": "image/jpeg",
    "size": 204800,
    "url": "http://localhost:5000/uploads/file-1698765432123-987654321.jpg",
    "created_at": "2025-10-27T10:30:00.000Z"
  }
}
```

**💡 Pro Tip:** Save the returned `id` from the response! You'll use it when creating meals.

#### Step 2: Use Upload ID in Meal

After uploading, use the `image_id` when creating or updating meals (see [Admin Meals CRUD](#-admin-meals-crud-operations)).

---

### 📁 Manage Uploads

#### Get All Uploads

**Endpoint:** `GET /api/uploads`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "uploads": [
    {
      "id": 1,
      "filename": "file-1698765432123-987654321.jpg",
      "original_name": "delicious-meal.jpg",
      "mimetype": "image/jpeg",
      "size": 204800,
      "url": "http://localhost:5000/uploads/file-1698765432123-987654321.jpg",
      "created_at": "2025-10-27T10:30:00.000Z"
    },
    {
      "id": 2,
      "filename": "file-1698765432999-123456789.png",
      "original_name": "dessert.png",
      "mimetype": "image/png",
      "size": 156700,
      "url": "http://localhost:5000/uploads/file-1698765432999-123456789.png",
      "created_at": "2025-10-27T11:45:00.000Z"
    }
  ]
}
```

#### Get Single Upload

**Endpoint:** `GET /api/uploads/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/uploads/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "upload": {
    "id": 1,
    "filename": "file-1698765432123-987654321.jpg",
    "original_name": "delicious-meal.jpg",
    "mimetype": "image/jpeg",
    "size": 204800,
    "url": "http://localhost:5000/uploads/file-1698765432123-987654321.jpg",
    "created_at": "2025-10-27T10:30:00.000Z"
  }
}
```

#### Delete Upload

**Endpoint:** `DELETE /api/uploads/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/uploads/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Fayl muvaffaqiyatli o'chirildi"
}
```

**⚠️ Important:** You cannot delete an upload that is being used by a meal. First remove the `image_id` from the meal, then delete the upload.

**Error Response (400):**
```json
{
  "message": "Bu fayl taomda ishlatilmoqda. Avval taomdan olib tashlang"
}
```

---

## 🍕 Admin Meals CRUD Operations

Complete meal management with full CRUD (Create, Read, Update, Delete) capabilities.

### 📊 Data Model

A meal object has the following structure:

```typescript
{
  id: number;                    // Auto-generated
  name: string;                  // Required
  price: number;                 // Required (in currency units)
  category_id: number;           // Required
  image?: string;                // Optional (direct URL)
  image_id?: number;             // Optional (from uploads table)
  description?: string;          // Optional
  ordernumber?: number;          // Optional (default: 0)
  ingredients?: string[];        // Optional (array of strings)
  created_at: string;            // Auto-generated
  updated_at: string;            // Auto-updated
}
```

---

### ✨ Create New Meal

**Endpoint:** `POST /api/admin/meals`

**Content-Type:** `application/json`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Osh",
  "price": 25000,
  "category_id": 1,
  "image_id": 1,
  "description": "O'zbekistonning milliy taomi - mazali va to'yimli osh",
  "ordernumber": 1,
  "ingredients": ["guruch", "sabzi", "go'sht", "piyoz", "zaytun moyi"]
}
```

**Field Details:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ Yes | Name of the meal |
| `price` | number | ✅ Yes | Price (must be positive) |
| `category_id` | number | ✅ Yes | Valid category ID |
| `image_id` | number | ❌ No | Upload ID from `/api/uploads` |
| `image` | string | ❌ No | Direct image URL (use `image_id` instead if possible) |
| `description` | string | ❌ No | Meal description |
| `ordernumber` | number | ❌ No | Order for sorting (default: 0) |
| `ingredients` | string[] | ❌ No | Array of ingredient names |

**cURL Example:**
```bash
# Development
curl -X POST http://localhost:5000/api/admin/meals \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lag'\''mon",
    "price": 22000,
    "category_id": 1,
    "image_id": 2,
    "description": "Qo'\''l bilan cho'\''zilgan uzun ko'\''klamchi",
    "ingredients": ["xamir", "go'\''sht", "sabzavotlar", "ziravorlar"]
  }'

# Production
curl -X POST https://beyoglu-karshi.uz/api/admin/meals \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lag'\''mon",
    "price": 22000,
    "category_id": 1,
    "image_id": 2,
    "description": "Qo'\''l bilan cho'\''zilgan uzun ko'\''klamchi",
    "ingredients": ["xamir", "go'\''sht", "sabzavotlar", "ziravorlar"]
  }'
```

**JavaScript Example:**
```javascript
const BASE_URL = 'https://beyoglu-karshi.uz/api'; // Production
// const BASE_URL = 'http://localhost:5000'; // Development

const createMeal = async () => {
  const mealData = {
    name: "Shashlik",
    price: 30000,
    category_id: 2,
    image_id: 3,
    description: "Cho'g'da pishirilgan mazali shashlik",
    ordernumber: 2,
    ingredients: ["qo'y go'shti", "piyoz", "ziravorlar"]
  };

  const response = await fetch(`${BASE_URL}/api/admin/meals`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(mealData)
  });

  const result = await response.json();
  console.log('Created meal:', result.meal);
};
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Taom muvaffaqiyatli qo'shildi",
  "meal": {
    "id": 5,
    "name": "Osh",
    "price": 25000,
    "category_id": 1,
    "image": "",
    "image_id": 1,
    "description": "O'zbekistonning milliy taomi",
    "ordernumber": 1,
    "ingredients": ["guruch", "sabzi", "go'sht", "piyoz", "zaytun moyi"],
    "created_at": "2025-10-27T12:00:00.000Z",
    "updated_at": "2025-10-27T12:00:00.000Z"
  }
}
```

---

### 📖 Read Meals

#### Get All Meals (Admin)

**Endpoint:** `GET /api/admin/meals`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/admin/meals \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "meals": [
    {
      "id": 1,
      "name": "Osh",
      "image": "http://localhost:5000/uploads/file-123.jpg",
      "image_id": 1,
      "description": "Milliy taom",
      "price": 25000,
      "ordernumber": 1,
      "category": "Main Dishes",
      "category_id": 1,
      "category_info": {
        "id": 1,
        "name": "Main Dishes"
      },
      "ingredients": ["guruch", "sabzi", "go'sht"],
      "created_at": "2025-10-27T10:00:00.000Z",
      "updated_at": "2025-10-27T10:00:00.000Z"
    }
  ]
}
```

#### Get Single Meal (Admin)

**Endpoint:** `GET /api/admin/meals/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/admin/meals/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "meal": {
    "id": 1,
    "name": "Osh",
    "image": "http://localhost:5000/uploads/file-123.jpg",
    "image_id": 1,
    "description": "Milliy taom",
    "price": 25000,
    "ordernumber": 1,
    "category": "Main Dishes",
    "category_id": 1,
    "category_info": {
      "id": 1,
      "name": "Main Dishes"
    },
    "ingredients": ["guruch", "sabzi", "go'sht"],
    "created_at": "2025-10-27T10:00:00.000Z",
    "updated_at": "2025-10-27T10:00:00.000Z"
  }
}
```

---

### ✏️ Update Meal

**Endpoint:** `PUT /api/admin/meals/:id`

**Content-Type:** `application/json`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Osh (Updated)",
  "price": 28000,
  "category_id": 1,
  "image_id": 5,
  "description": "Yangilangan tavsif",
  "ordernumber": 2,
  "ingredients": ["guruch", "sabzi", "mol go'shti", "piyoz"]
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/admin/meals/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Osh",
    "price": 30000,
    "category_id": 1,
    "image_id": 10,
    "description": "Maxsus retsept bilan tayyorlangan",
    "ingredients": ["guruch", "sabzi", "qo'\''y go'\''shti"]
  }'
```

**JavaScript Example:**
```javascript
const BASE_URL = 'https://beyoglu-karshi.uz/api'; // Production

const updateMeal = async (mealId) => {
  const updates = {
    name: "Deluxe Osh",
    price: 35000,
    category_id: 1,
    image_id: 12,
    description: "Premium ingredients",
    ordernumber: 1
  };

  const response = await fetch(`${BASE_URL}/api/admin/meals/${mealId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  const result = await response.json();
  console.log('Updated meal:', result.meal);
};
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Taom muvaffaqiyatli yangilandi",
  "meal": {
    "id": 1,
    "name": "Osh (Updated)",
    "price": 28000,
    "category_id": 1,
    "image": "",
    "image_id": 5,
    "description": "Yangilangan tavsif",
    "ordernumber": 2,
    "ingredients": ["guruch", "sabzi", "mol go'shti", "piyoz"],
    "created_at": "2025-10-27T10:00:00.000Z",
    "updated_at": "2025-10-27T14:30:00.000Z"
  }
}
```

**💡 Update Tips:**
- All fields are required in the request body
- To keep existing values, include them in the request
- `updated_at` is automatically updated
- You can change the `image_id` to use a different uploaded image

---

### 🗑️ Delete Meal

**Endpoint:** `DELETE /api/admin/meals/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/admin/meals/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**JavaScript Example:**
```javascript
const BASE_URL = 'https://beyoglu-karshi.uz/api'; // Production

const deleteMeal = async (mealId) => {
  const response = await fetch(`${BASE_URL}/api/admin/meals/${mealId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await response.json();
  console.log(result.message);
};
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Taom muvaffaqiyatli o'chirildi"
}
```

**⚠️ Note:** Deleting a meal does NOT delete the associated uploaded image. The image remains in the uploads table and can be reused for other meals.

---

## 🏷️ Categories Management

### Admin Endpoints

- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create new category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

All admin category endpoints require authentication.

---

## 🌐 Public Endpoints

These endpoints are accessible without authentication:

### Get All Meals (Public)

**Endpoint:** `GET /api/meals`

**Response:**
```json
{
  "success": true,
  "meals": [...]
}
```

### Get Single Meal (Public)

**Endpoint:** `GET /api/meals/:id`

### Get All Categories (Public)

**Endpoint:** `GET /api/categories`

---

## ⚠️ Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "message": "Nom, narx va kategoriya kiritilishi kerak"
}
```

#### 401 Unauthorized
```json
{
  "message": "Token topilmadi"
}
```

#### 404 Not Found
```json
{
  "message": "Taom topilmadi"
}
```

#### 500 Server Error
```json
{
  "message": "Server xatosi"
}
```

### Validation Rules

**Meals:**
- `name`: Required, non-empty string
- `price`: Required, positive integer
- `category_id`: Required, must exist in categories table
- `image_id`: Optional, must exist in uploads table if provided
- `ordernumber`: Optional, defaults to 0
- `ingredients`: Optional, array of strings

**Uploads:**
- File size: Maximum 5MB
- Allowed formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- Field name must be `file`

---

## 🎯 Best Practices

### 1. **Use Image Upload System**
✅ **Recommended:**
```javascript
// Step 1: Upload image
const uploadResponse = await uploadImage(file);
const imageId = uploadResponse.upload.id;

// Step 2: Create meal with image_id
await createMeal({ 
  name: "Osh", 
  price: 25000, 
  category_id: 1,
  image_id: imageId 
});
```

❌ **Not Recommended:**
```javascript
// Don't use direct image URLs
await createMeal({ 
  name: "Osh",
  image: "http://example.com/image.jpg" 
});
```

### 2. **Error Handling**
Always handle errors gracefully:

```javascript
const BASE_URL = 'https://beyoglu-karshi.uz/api'; // Production

try {
  const response = await fetch(`${BASE_URL}/api/admin/meals`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(mealData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const result = await response.json();
  console.log('Success:', result);
} catch (error) {
  console.error('Failed to create meal:', error.message);
}
```

### 3. **Token Management**
- Store JWT token securely (e.g., httpOnly cookies or secure storage)
- Check token expiration before making requests
- Implement token refresh if needed

### 4. **File Upload**
- Validate file size on client-side before uploading
- Show upload progress to users
- Handle upload failures gracefully

---

## 🛠️ Technologies

- **Runtime:** Node.js (>= 18.0.0)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** Bcrypt
- **File Upload:** Multer
- **Documentation:** Swagger/OpenAPI

---

## 🔒 Security Notes

- ⚠️ **Change default admin password** in production!
- 🔐 Use strong `JWT_SECRET` in production
- 🌐 Configure CORS properly for production
- 📁 Limit file upload sizes (default: 5MB)
- 🔄 Implement rate limiting for production
- 🚫 Never commit `.env` file to version control

---

## 📞 Support & Resources

### Production API
- **Live API:** `https://beyoglu-karshi.uz/api`
- **API Documentation:** Available via Swagger UI (when deployed)

### Development
- **Local API:** `http://localhost:5000`
- **Deployment Guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

### Default Admin Credentials
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Important:** Change the admin password in production!

---

## 📚 Additional Resources

### Example Workflows

**Complete Meal Creation Workflow:**
```javascript
const BASE_URL = 'https://beyoglu-karshi.uz/api';
const token = 'YOUR_JWT_TOKEN';

// 1. Login to get token
const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});
const { token } = await loginResponse.json();

// 2. Upload image
const formData = new FormData();
formData.append('file', imageFile);

const uploadResponse = await fetch(`${BASE_URL}/api/uploads`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
const { upload } = await uploadResponse.json();

// 3. Create meal with uploaded image
const mealResponse = await fetch(`${BASE_URL}/api/admin/meals`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Delicious Plov',
    price: 25000,
    category_id: 1,
    image_id: upload.id,
    description: 'Traditional Uzbek rice dish',
    ingredients: ['rice', 'meat', 'carrots', 'onions']
  })
});
const { meal } = await mealResponse.json();
console.log('Meal created:', meal);
```

---

**Built with ❤️ for Beyougli Karshi Restaurant**

