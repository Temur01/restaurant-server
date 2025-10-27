# Beyougli Karshi Backend API

Node.js va PostgreSQL yordamida yaratilgan REST API server.

## 🔥 Production Database Connection Fix

**Issue**: API returns sample data with message "database connection failed"  
**Solution**: Set `DATABASE_URL` environment variable in production

👉 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production setup guide**

## O'rnatish

1. PostgreSQL o'rnating va database yarating:
```bash
createdb beyougli_karshi
```

2. .env faylini yarating:
```bash
cd server
cp .env.example .env
```

3. .env faylini sozlang:
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/beyougli_karshi
JWT_SECRET=your-super-secret-jwt-key-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

4. Paketlarni o'rnating:
```bash
npm install
```

5. Databaseni migrate qiling:
```bash
npm run build
npm run db:migrate
```

6. Serverni ishga tushiring:
```bash
npm run dev
```

Server http://localhost:5000 da ishga tushadi.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin kirish
- `GET /api/auth/verify` - Token tekshirish

### File Uploads (NEW! 🎉)
- `POST /api/uploads` - Fayl yuklash va ID olish (auth required)
- `GET /api/uploads` - Barcha yuklangan fayllarni olish (auth required)
- `GET /api/uploads/:id` - Bitta faylni olish (auth required)
- `DELETE /api/uploads/:id` - Faylni o'chirish (auth required)

### Meals (Public)
- `GET /api/meals` - Barcha taomlarni olish (public)
- `GET /api/meals/:id` - Bitta taomni olish (public)

### Meals (Admin)
- `POST /api/admin/meals` - Yangi taom qo'shish (auth required)
- `PUT /api/admin/meals/:id` - Taomni yangilash (auth required)
- `DELETE /api/admin/meals/:id` - Taomni o'chirish (auth required)
- `GET /api/admin/meals` - Barcha taomlarni olish (auth required)
- `GET /api/admin/meals/:id` - Bitta taomni olish (auth required)

### Categories (Public)
- `GET /api/categories` - Barcha kategoriyalarni olish (public)

### Categories (Admin)
- `GET /api/admin/categories` - Barcha kategoriyalarni olish (auth required)
- `POST /api/admin/categories` - Yangi kategoriya qo'shish (auth required)
- `PUT /api/admin/categories/:id` - Kategoriyani yangilash (auth required)
- `DELETE /api/admin/categories/:id` - Kategoriyani o'chirish (auth required)

## 📤 File Upload API Usage

### Step 1: Upload a File
```bash
curl -X POST http://localhost:3001/api/uploads \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "Fayl muvaffaqiyatli yuklandi",
  "upload": {
    "id": 1,
    "filename": "file-1698765432123-987654321.jpg",
    "original_name": "image.jpg",
    "mimetype": "image/jpeg",
    "size": 204800,
    "url": "http://localhost:3001/uploads/file-1698765432123-987654321.jpg",
    "created_at": "2025-10-27T10:30:00.000Z"
  }
}
```

### Step 2: Create Meal with Upload ID
```bash
curl -X POST http://localhost:3001/api/admin/meals \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Osh",
    "price": 25000,
    "category_id": 1,
    "image_id": 1,
    "description": "Milliy taom",
    "ingredients": ["guruch", "sabzi", "go'\''sht"]
  }'
```

**Note:** You can use either `image_id` (recommended) or `image` (URL) when creating/updating meals.

## Default Admin

- **Username**: admin
- **Password**: admin123

⚠️ Production muhitida parolni o'zgartiring!

## Texnologiyalar

- Node.js
- Express.js
- PostgreSQL
- TypeScript
- JWT Authentication
- Bcrypt

