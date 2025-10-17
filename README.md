# Beyougli Karshi Backend API

Node.js va PostgreSQL yordamida yaratilgan REST API server.

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

### Meals
- `GET /api/meals` - Barcha taomlarni olish (public)
- `GET /api/meals/:id` - Bitta taomni olish (public)
- `POST /api/meals` - Yangi taom qo'shish (auth required)
- `PUT /api/meals/:id` - Taomni yangilash (auth required)
- `DELETE /api/meals/:id` - Taomni o'chirish (auth required)

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

