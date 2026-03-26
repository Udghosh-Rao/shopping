# Admin Operational Features - API Reference

## Authentication
All endpoints require admin authentication via NextAuth. User must have `role: 'admin'`.

---

## 1. COUPON MANAGEMENT

### List Coupons (Paginated)
```
GET /api/admin/coupons
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10, max: 100)
  - search: string (filters by code)
  - status: "active" | "inactive" | "all" (default: all)

Response:
{
  "coupons": [
    {
      "_id": "...",
      "code": "SAVE20",
      "discountType": "percentage",
      "discountValue": 20,
      "maxUses": 100,
      "usedCount": 5,
      "minOrderAmount": 500,
      "expiresAt": "2024-12-31T23:59:59Z",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Create Coupon
```
POST /api/admin/coupons
Content-Type: application/json

Request Body:
{
  "code": "SAVE20",
  "discountType": "percentage" | "flat",
  "discountValue": 20,
  "maxUses": 100,
  "minOrderAmount": 500,
  "expiresAt": "2024-12-31"
}

Response (201):
{
  "coupon": { ... }
}
```

### Get Coupon
```
GET /api/admin/coupons/:id

Response (200):
{
  "coupon": { ... }
}
```

### Update Coupon
```
PUT /api/admin/coupons/:id
Content-Type: application/json

Request Body:
{
  "code": "SAVE25",
  "discountValue": 25,
  "maxUses": 50,
  "isActive": true
}

Response (200):
{
  "coupon": { ... }
}
```

### Delete Coupon (Soft Delete)
```
DELETE /api/admin/coupons/:id

Response (200):
{
  "message": "Coupon deleted successfully"
}
```

---

## 2. ANALYTICS

### Get Analytics Data
```
GET /api/admin/analytics

Response (200):
{
  "dailyRevenue": [
    {
      "date": "2024-02-25",
      "revenue": 15000,
      "orders": 5
    }
  ],
  "topProducts": [
    {
      "_id": "...",
      "name": "T-Shirt",
      "unitsSold": 50,
      "revenue": 15000
    }
  ],
  "stockAlerts": [
    {
      "productId": "...",
      "name": "Jeans",
      "stock": 2,
      "lowStockSizes": [
        { "size": "M", "stock": 1 },
        { "size": "L", "stock": 2 }
      ]
    }
  ],
  "conversionMetrics": {
    "visitors": 1000,
    "carts": 150,
    "checkouts": 75,
    "orders": 50,
    "conversionRate": "5.00"
  }
}
```

---

## 3. EXPORT ORDERS

### Export Orders to CSV
```
GET /api/admin/export-orders
Query Parameters (Optional):
  - startDate: "2024-01-01" (YYYY-MM-DD)
  - endDate: "2024-12-31" (YYYY-MM-DD)

Response: (200)
Attachment: orders_2024-01-01_2024-12-31.csv

CSV Columns:
Order ID, Date, Customer, Email, Items, Total, Status, Payment, COD?
ORD12345, 3/26/2024, John Doe, john@example.com, "T-Shirt(M)x2", 2000, Processing, paid, No
```

---

## 4. IMAGE UPLOAD

### Upload Image to Cloudinary
```
POST /api/admin/upload
Content-Type: multipart/form-data

Form Data:
  - file: <binary file>

Response (200):
{
  "url": "https://res.cloudinary.com/..../product_abc123.jpg",
  "publicId": "shopping-app/products/product_abc123"
}
```

---

## 5. INVOICE GENERATION

### Download Order Invoice (PDF)
```
GET /api/orders/:orderId/invoice

Response (200):
Attachment: invoice_<orderId>.pdf

PDF Contents:
- Invoice header with business GSTIN
- Customer shipping details
- Itemized products with sizes/quantities
- Tax breakdown (subtotal, delivery, discount, GST @ 18%)
- Grand total
- Business footer with contact info

Auth:
- User must own the order OR have admin role
- Returns 403 if unauthorized
```

---

## ERROR RESPONSES

### 400 Bad Request
```json
{
  "error": "Missing required fields: code, discountType, discountValue"
}
```

### 401 Unauthorized
```json
{
  "error": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Coupon not found"
}
```

### 409 Conflict
```json
{
  "error": "Coupon code already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## USAGE EXAMPLES

### JavaScript/Fetch

```typescript
// List coupons
const coupons = await fetch('/api/admin/coupons?page=1&status=active')
  .then(r => r.json());

// Create coupon
const newCoupon = await fetch('/api/admin/coupons', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: 'SAVE20',
    discountType: 'percentage',
    discountValue: 20,
    maxUses: 100
  })
}).then(r => r.json());

// Update coupon
const updated = await fetch(`/api/admin/coupons/${couponId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ discountValue: 25 })
}).then(r => r.json());

// Delete coupon
await fetch(`/api/admin/coupons/${couponId}`, { method: 'DELETE' });

// Export orders
const link = document.createElement('a');
link.href = '/api/admin/export-orders?startDate=2024-01-01&endDate=2024-12-31';
link.download = 'orders.csv';
link.click();

// Upload image
const formData = new FormData();
formData.append('file', fileInput.files[0]);
const { url, publicId } = await fetch('/api/admin/upload', {
  method: 'POST',
  body: formData
}).then(r => r.json());

// Download invoice
window.open(`/api/orders/${orderId}/invoice`, '_blank');
```

---

## RATE LIMITING

No specific rate limiting implemented. Consider adding for production deployments.

---

## CACHING

- Analytics data: No caching (real-time)
- Coupon list: Can be cached by client for 60 seconds
- Invoice generation: Not cached (generated on demand)

