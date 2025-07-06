# OX Group Test - NestJS Backend

NestJS backend test loyihasi - autentifikatsiya, company management va OX API integratsiya bilan.

## 🚀 Texnologiyalar

- **NestJS** - Asosiy framework
- **TypeORM** - Ma'lumotlar bazasi ORM
- **PostgreSQL** - Ma'lumotlar bazasi
- **JWT** - Autentifikatsiya
- **Swagger** - API hujjatlashtirish
- **TypeScript** - Dasturlash tili

## 📋 Xususiyatlar

### Autentifikatsiya
- Email + OTP orqali login
- JWT token bilan himoyalangan route'lar
- Custom decorator'lar: `@AdminOnly()`, `@ManagerOnly()`

### Company Management
- OX API orqali company validation
- Company qo'shish va o'chirish
- Role-based access control

### OX API Integratsiya
- Token validation
- Products/variations olish
- Error handling

## 🛠️ O'rnatish

### 1. Repository'ni clone qiling
```bash
git clone <repo-url>
cd ox-group-test
```

### 2. Dependencies o'rnating
```bash
npm install
```

### 3. Environment variables sozlang
`.env` fayl yarating va quyidagi o'zgaruvchilarni to'ldiring:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=ox_group_test
DB_SCHEMA=public

# JWT
JWT_SECRET=your-super-secret-jwt-key

# SMTP (Email uchun)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Server
PORT=3000
```

### 4. Ma'lumotlar bazasini tayyorlang
PostgreSQL server ishga tushiring va database yarating:
```sql
CREATE DATABASE ox_group_test;
```

### 5. Loyihani ishga tushiring
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 📚 API Endpoints

### Autentifikatsiya
- `POST /api/auth/login` - Email orqali login (OTP olish)
- `POST /api/auth/verify` - OTP tasdiqlash va token olish
- `POST /api/auth/register` - Ro'yxatdan o'tish

### Company Management
- `POST /api/auth/register-company` - Company qo'shish (🔒 Auth required)
- `DELETE /api/auth/company/:id` - Company o'chirish (🔒 Admin only)

### Products
- `GET /api/products?page=1&size=10` - Products ro'yxati (🔒 Manager+)

## 🔧 API Usage

### 1. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### 2. Verify OTP
```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "otp": "123456"}'
```

### 3. Register Company
```bash
curl -X POST http://localhost:3000/api/auth/register-company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"subdomain": "demo", "token": "Bearer ox-api-token"}'
```

### 4. Get Products
```bash
curl -X GET "http://localhost:3000/api/products?page=1&size=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📖 API Documentation

Loyiha ishga tushgandan so'ng Swagger UI'ga quyidagi URL orqali kiring:
```
http://localhost:3000/api/swagger
```

## 🔒 Role System

- **Manager** - Default role, products ko'ra oladi
- **Admin** - Company yaratgan user, company o'chira oladi

## 🌐 OX API Integration

Loyiha OX tizimi bilan integratsiya qilangan:
- **Base URL**: `https://{subdomain}.ox-sys.com`
- **Endpoints**:
  - `/profile` - Token validation
  - `/variations` - Products ro'yxati

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests  
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Scripts

```bash
npm run start        # Production mode
npm run start:dev    # Development mode (watch)
npm run start:debug  # Debug mode
npm run build        # Build project
npm run lint         # ESLint
npm run format       # Prettier
```

## 🚨 Environment Variables Validation

Loyiha ishga tushishdan oldin muhim environment variable'lar tekshiriladi:
- `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `DB_SCHEMA`
- `JWT_SECRET`

Agar biror variable mavjud bo'lmasa, xato chiqadi.

## 📁 Project Structure

```
src/
├── constants/           # Konstantalar
├── database/           # Database konfiguratsiya
├── entity/             # TypeORM entities
├── modules/            # Feature modules
│   ├── auth/           # Autentifikatsiya
│   ├── users/          # Foydalanuvchilar
│   ├── company/        # Kompaniyalar
│   └── products/       # Mahsulotlar
└── utils/              # Utility classes
```

## 🤝 Contributing

1. Fork qiling
2. Feature branch yarating (`git checkout -b feature/AmazingFeature`)
3. Commit qiling (`git commit -m 'Add some AmazingFeature'`)
4. Push qiling (`git push origin feature/AmazingFeature`)
5. Pull Request yarating

## 📄 License

Bu loyiha MIT litsenziyasi ostida.
