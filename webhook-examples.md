# Product Management Webhook Examples

This document provides examples of how to use the webhook endpoints to manage products programmatically.

## Authentication

All webhook endpoints support optional authentication via the `X-Webhook-Secret` header. Set the `WEBHOOK_SECRET` environment variable to enable signature validation.

```bash
curl -H "X-Webhook-Secret: your-secret-key" ...
```

## Endpoints

### 1. Add Product

**POST** `/webhook/products`

```bash
curl -X POST http://localhost:5000/webhook/products \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-secret-key" \
  -d '{
    "name": "Luxury Watch",
    "brand": "Premium Brand",
    "category": "watches",
    "originalPrice": "$5,000",
    "discountedPrice": "$2,000",
    "discount": 60,
    "image": "https://example.com/watch.jpg",
    "stock": 10
  }'
```

### 2. Update Product

**PUT** `/webhook/products/:id`

```bash
curl -X PUT http://localhost:5000/webhook/products/1 \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-secret-key" \
  -d '{
    "name": "Updated Luxury Watch",
    "stock": 5
  }'
```

### 3. Delete Product

**DELETE** `/webhook/products/:id`

```bash
curl -X DELETE http://localhost:5000/webhook/products/1 \
  -H "X-Webhook-Secret: your-secret-key"
```

### 4. Get All Products

**GET** `/webhook/products`

```bash
curl -X GET http://localhost:5000/webhook/products \
  -H "X-Webhook-Secret: your-secret-key"
```

### 5. Bulk Operations

**POST** `/webhook/products/bulk`

#### Bulk Create
```bash
curl -X POST http://localhost:5000/webhook/products/bulk \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-secret-key" \
  -d '{
    "operation": "create",
    "products": [
      {
        "name": "Product 1",
        "brand": "Brand A",
        "category": "watches",
        "originalPrice": "$1,000",
        "discountedPrice": "$500",
        "discount": 50,
        "image": "https://example.com/product1.jpg",
        "stock": 5
      },
      {
        "name": "Product 2",
        "brand": "Brand B",
        "category": "jewelry",
        "originalPrice": "$2,000",
        "discountedPrice": "$800",
        "discount": 60,
        "image": "https://example.com/product2.jpg",
        "stock": 3
      }
    ]
  }'
```

#### Bulk Update
```bash
curl -X POST http://localhost:5000/webhook/products/bulk \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-secret-key" \
  -d '{
    "operation": "update",
    "products": [
      {
        "id": 1,
        "stock": 8
      },
      {
        "id": 2,
        "discountedPrice": "$700",
        "discount": 65
      }
    ]
  }'
```

#### Bulk Delete
```bash
curl -X POST http://localhost:5000/webhook/products/bulk \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-secret-key" \
  -d '{
    "operation": "delete",
    "products": [
      { "id": 1 },
      { "id": 2 }
    ]
  }'
```

## Response Format

All endpoints return JSON responses with the following structure:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "product": { ... },  // For single operations
  "products": [ ... ], // For get operations
  "results": { ... }   // For bulk operations
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]    // Validation errors if applicable
}
```

## Product Data Format

Products must include these required fields:

- `name`: String - Product name
- `brand`: String - Brand name  
- `category`: Enum - One of: "watches", "jewelry", "fashion", "accessories", "beauty"
- `originalPrice`: String - Original price (e.g., "$5,000")
- `discountedPrice`: String - Discounted price (e.g., "$2,000")
- `discount`: Number - Discount percentage (1-99)
- `image`: String - Valid image URL
- `stock`: Number - Stock quantity (0 or higher)

## Order Management Endpoints

### 1. Get All Orders

**GET** `/webhook/orders`

```bash
curl -X GET http://localhost:5000/webhook/orders \
  -H "X-Webhook-Secret: your-secret-key"
```

### 2. Get Specific Order

**GET** `/webhook/orders/:id`

```bash
curl -X GET http://localhost:5000/webhook/orders/1 \
  -H "X-Webhook-Secret: your-secret-key"
```

### 3. Update Order Status

**PUT** `/webhook/orders/:id/status`

```bash
curl -X PUT http://localhost:5000/webhook/orders/1/status \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-secret-key" \
  -d '{
    "status": "shipped"
  }'
```

**Valid Status Values:**
- `pending` - Order is pending
- `processing` - Order is being processed
- `shipped` - Order has been shipped
- `delivered` - Order has been delivered
- `cancelled` - Order has been cancelled

### 4. Bulk Order Status Update

**POST** `/webhook/orders/bulk-status`

```bash
curl -X POST http://localhost:5000/webhook/orders/bulk-status \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-secret-key" \
  -d '{
    "orders": [
      {
        "id": 1,
        "status": "shipped"
      },
      {
        "id": 2,
        "status": "delivered"
      }
    ]
  }'
```

## Error Handling

The API provides detailed error messages for:
- Invalid authentication
- Missing required fields
- Invalid data types
- Product/Order not found
- Invalid status values
- Server errors

Always check the response status code and message for proper error handling in your integration.