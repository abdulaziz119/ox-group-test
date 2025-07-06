# API Test Examples

Bu fayl loyihaning API endpoint'larini test qilish uchun misol so'rovlar to'plami.

## Base URL
```
http://localhost:3000/api
```

## 1. Login (OTP olish)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

**Response:**
```json
{
  "result": {
    "otp": "123456"
  }
}
```

## 2. OTP Verify (Token olish)

```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

**Response:**
```json
{
  "result": {
    "user": {
      "id": 1,
      "email": "test@example.com",
      "role": "manager",
      "created_at": "2025-07-06T14:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 3. Register Company

```bash
curl -X POST http://localhost:3000/api/auth/register-company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "subdomain": "demo",
    "token": "Bearer ox-api-token-here"
  }'
```

**Response:**
```json
{
  "result": {
    "company": {
      "id": 1,
      "subdomain": "demo",
      "name": "Demo Company",
      "created_at": "2025-07-06T14:00:00.000Z"
    }
  }
}
```

## 4. Get Products

```bash
curl -X GET "http://localhost:3000/api/products?page=1&size=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "result": {
    "data": [
      {
        "id": "1",
        "name": "Product 1",
        "price": 100.00
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 50,
      "last_page": 5
    }
  }
}
```

## 5. Delete Company (Admin only)

```bash
curl -X DELETE http://localhost:3000/api/auth/company/1 \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

**Response:**
```json
{
  "result": {
    "message": "Company deleted successfully"
  }
}
```

## 6. Register (To'liq ma'lumot bilan)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "12345678",
    "gender": "male",
    "birthday": "1990-01-01",
    "language": "en"
  }'
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Size cannot be greater than 20",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid or expired OTP",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Only admin can delete company",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Company not found",
  "error": "Not Found"
}
```

## Testing Flow

1. **Login** → Get OTP
2. **Verify OTP** → Get JWT token  
3. **Register Company** → Become admin of that company
4. **Get Products** → View company products
5. **Delete Company** → Clean up (admin only)

## Notes

- OTP kodlari test maqsadida response'da qaytariladi (production'da email yuboriladi)
- Default user role: `manager`
- Company yaratgan user `admin` bo'ladi
- Products faqat `manager` va `admin` role'ga ruxsat
- Company o'chirish faqat `admin` role'ga ruxsat
