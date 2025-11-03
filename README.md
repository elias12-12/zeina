#  Roastery Management System API

##  Overview
The **Roastery Management System API** is a backend service built with **Node.js** and **Express** for managing users, products, sales, sale items, and inventory in a coffee roastery.  
It provides RESTful endpoints for CRUD operations and integrates with a **PostgreSQL** database for data storage.  

---

##  Project Setup Instructions

###  Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- Postman (for API testing)

###  Installation
1. Clone the repository or download the project folder.
2. Navigate to the project directory and install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of your project and configure it as follows:
   ```bash
   # Server Configuration
   PORT=4000
   NODE_ENV=development

   # Database Configuration
   PGHOST=localhost
   PGPORT=5432
   PGDATABASE=roasteryMS
   PGUSER=postgres
   PGPASSWORD=postgres
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   Or start in production mode:
   ```bash
   npm start
   ```
5. Your API will be available at:
   ```
   http://localhost:4000
   ```

---

##  API Endpoints

The API is organized by resource.  
Below is a summary of the main routes (for full details, check the Postman workspace links below ):

| Module | Endpoint | Method | Description |
|--------|-----------|--------|-------------|
| **Users** | `/api/users` | GET | Get all users |
|  | `/api/users/:id` | GET | Get user by ID |
|  | `/api/users/register` | POST | Register a new user |
|  | `/api/users/login` | POST | Authenticate a user |
| **Products** | `/api/products` | GET | List all products |
|  | `/api/products/:id` | GET | Get product details |
|  | `/api/products` | POST | Create a new product |
|  | `/api/products/:id` | PUT | Update a product |
|  | `/api/products/:id` | DELETE | Delete a product |
| **Sales** | `/api/sales` | GET | List all sales |
|  | `/api/sales/:id` | GET | Get sale details |
|  | `/api/sales` | POST | Create a new sale |
| **Sale Items** | `/api/sale-items` | GET | List all sale items |
|  | `/api/sale-items` | POST | Add sale item |
| **Inventory** | `/api/inventory` | GET | Get all inventory items |
|  | `/api/inventory/:id` | GET | Get specific inventory item |
|  | `/api/inventory` | POST | Add inventory item |
|  | `/api/inventory/:id` | PUT | Update inventory stock |

### Postman Collections
Access all API routes and example requests directly through Postman workspaces:

- [Users Routes](https://saabelias37-2588456.postman.co/workspace/Roastery-API~26847990-36db-43fd-8c9d-40283309b542/collection/47106836-8150b8ac-fbcb-4a9d-a859-c5304dfb5921)
- [Products Routes](https://saabelias37-2588456.postman.co/workspace/Roastery-API~26847990-36db-43fd-8c9d-40283309b542/collection/47106836-57a13400-ea41-427b-bdfa-18a5c620908f)
- [Sales Routes](https://saabelias37-2588456.postman.co/workspace/Roastery-API~26847990-36db-43fd-8c9d-40283309b542/collection/47106836-1a197e20-cb18-42d5-94ca-e597a524e0f0)
- [Sale Items Routes](https://saabelias37-2588456.postman.co/workspace/Roastery-API~26847990-36db-43fd-8c9d-40283309b542/collection/47106836-489a7b79-36d2-4cd0-8cc2-21ce845b82f1)
- [Inventory Routes](https://saabelias37-2588456.postman.co/workspace/Roastery-API~26847990-36db-43fd-8c9d-40283309b542/collection/47106836-460293e3-b38f-433a-9b6a-82f7f102d1ae)

---

## 🗄️ Database Schema

###  `users`
| Column | Type | Constraints |
|---------|------|-------------|
| user_id | SERIAL | PRIMARY KEY |
| first_name | TEXT | NOT NULL |
| last_name | TEXT | NOT NULL |
| email | TEXT |  |
| phone_number | TEXT |  |
| password | TEXT |  |
| role | TEXT | CHECK (role IN ('admin', 'customer', 'guest')) |

---

###  `products`
| Column | Type | Constraints |
|---------|------|-------------|
| product_id | SERIAL | PRIMARY KEY |
| product_name | VARCHAR(100) | NOT NULL |
| description | TEXT |  |
| unit_price | NUMERIC(10,2) | NOT NULL |
| product_type | VARCHAR(50) | NOT NULL |
| status | VARCHAR(20) | CHECK (status IN ('available','not available')) |

---

###  `sales`
| Column | Type | Constraints |
|---------|------|-------------|
| sale_id | SERIAL | PRIMARY KEY |
| user_id | INT | FK → users(user_id) |
| sale_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| total_amount | NUMERIC |  |

---

###  `sale_items`
| Column | Type | Constraints |
|---------|------|-------------|
| sale_item_id | SERIAL | PRIMARY KEY |
| sale_id | INT | FK → sales(sale_id) |
| product_id | INT | FK → products(product_id) |
| quantity | INT | CHECK (quantity > 0) |
| price_at_sale | DECIMAL(10,2) | CHECK (price_at_sale >= 0) |

---

###  `inventory`
| Column | Type | Constraints |
|---------|------|-------------|
| inventory_id | SERIAL | PRIMARY KEY |
| product_id | INT | FK → products(product_id), UNIQUE |
| quantity_in_stock | INT | DEFAULT 0, CHECK (quantity_in_stock >= 0) |
| last_updated | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

##  Third-party Libraries / Tools

| Library | Purpose |
|----------|----------|
| **express** | Core web framework for Node.js |
| **pg** | PostgreSQL client for Node.js |
| **cors** | Enables Cross-Origin Resource Sharing |
| **dotenv** | Loads environment variables |
| **express-validator** | Validates incoming API requests |
| **nodemon** | Auto-restarts server during development |

---

##  Running and Testing via Postman

1. Start your server:
   ```bash
   npm run dev
   ```
2. Open **Postman** and go to your workspace:  
    [Roastery API Workspace](https://saabelias37-2588456.postman.co/workspace/Roastery-API~26847990-36db-43fd-8c9d-40283309b542)
3. Import the environment (if needed).
4. Use the collections to send requests such as:
   - **POST** `/api/users/register`
   - **POST** `/api/users/login`
   - **GET** `/api/products`
5. Check the returned JSON responses and HTTP status codes for validation.

---

## Author
**Elias Saab**  
Roastery Management System — Backend API  
Developed using Node.js, Express, and PostgreSQL
