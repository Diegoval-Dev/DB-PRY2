# GercoRaunte - Restaurant Order and Review Management System

![image](https://github.com/user-attachments/assets/4af0a23e-fa23-45d9-9ff4-0da4dd6adb44)

![image](https://github.com/user-attachments/assets/b26a937d-cd93-4321-8497-4ec28d35ef2f)


## Project Overview

GercoRaunte is a comprehensive restaurant management system that allows users to browse restaurants, place food orders, and leave reviews. The application features role-based access with separate interfaces for customers, delivery personnel, and administrators.

### Key Features

- Restaurant browsing with filtering and search capabilities
- Menu item management and ordering
- Order tracking and management
- Customer review system
- Admin dashboard with reporting and analytics
- Image management for restaurants and menu items
- Geospatial search for nearby restaurants

## System Architecture

### Tech Stack

- **Backend**: Node.js/Express with TypeScript
- **Database**: MongoDB Atlas (Cloud-hosted)
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **File Storage**: GridFS for restaurant and menu images

### Architecture Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│             │     │             │     │                 │
│  Frontend   │────▶│  REST API   │────▶│  MongoDB Atlas  │
│  (Next.js)  │     │  (Express)  │     │                 │
│             │     │             │     │                 │
└─────────────┘     └─────────────┘     └─────────────────┘
       ▲                   ▲
       │                   │
       └───────────────────┘
         Frontend calls API
```

## Database Schema

### Collections

1. **Users**
   - Basic user information
   - Role-based access (client, admin, delivery)

2. **Restaurants**
   - Restaurant details and location information
   - Specialties and image references
   - Geospatial indexing for location-based queries

3. **Menu Items**
   - Food items with pricing and category information
   - Associated with specific restaurants
   - Image references

4. **Orders**
   - Order tracking with status updates
   - References to users and restaurants
   - Line items with quantities

5. **Reviews**
   - User feedback and ratings
   - Text-indexed for search functionality

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas account
- npm or yarn

### Backend Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd DB-PRY2/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   PORT=5000
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Seed the database (optional):
   ```
   npm run seed
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd ../frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Access the application at http://localhost:3000

## API Endpoints

### User Management
- `POST /api/users` - Register a new user
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user account
- `GET /api/users` - List users (with pagination, filters)

### Restaurant Management
- `POST /api/restaurants` - Create a new restaurant
- `GET /api/restaurants/:id` - Get restaurant details
- `PUT /api/restaurants/:id` - Update restaurant info
- `DELETE /api/restaurants/:id` - Delete a restaurant
- `GET /api/restaurants` - List restaurants (with filtering, sorting)

### Menu Items Management
- `POST /api/menu-items` - Add a new menu item
- `GET /api/menu-items/:id` - Get menu item details
- `PUT /api/menu-items/:id` - Update menu item
- `DELETE /api/menu-items/:id` - Delete menu item
- `GET /api/menu-items` - List menu items (with filtering)

### Order Management
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Cancel an order
- `GET /api/orders` - List orders (with filtering)

### Review Management
- `POST /api/reviews` - Create a new review
- `GET /api/reviews/:id` - Get review details
- `PUT /api/reviews/:id` - Update a review
- `DELETE /api/reviews/:id` - Delete a review
- `GET /api/reviews` - List reviews (with filtering)
- `GET /api/reviews/restaurant/:restaurantId` - Get reviews for a restaurant

### File Management (GridFS)
- `POST /api/files/upload` - Upload a file (image)
- `GET /api/files/:id` - Retrieve a file
- `DELETE /api/files/:id` - Delete a file

### Reports
- `GET /api/reports/top-rated-restaurants` - Get top-rated restaurants
- `GET /api/reports/most-ordered-items` - Get most ordered menu items
- `GET /api/reports/restaurant-sales` - Get restaurant sales report
- `GET /api/reports/user-order-frequency` - Get user order frequency
- `GET /api/reports/avg-rating-by-specialty` - Get average ratings by specialty

## Frontend Structure

### User Interfaces

1. **Public Pages**
   - Home Page - Restaurant showcase
   - Restaurant Search - Search with filters
   - Restaurant Detail - Information, menu, and reviews
   - Login/Register - User authentication

2. **Customer Dashboard**
   - Profile Management
   - Order History
   - Active Order Tracking
   - Review Management

3. **Delivery Dashboard**
   - Order Assignment
   - Delivery Status Updates
   - Navigation Support

4. **Admin Dashboard**
   - Restaurant Management
   - Menu Management
   - Order Dashboard
   - Review Monitoring
   - User Management
   - Analytics and Reports

### Key Components

- Restaurant cards and details
- Menu item listings
- Order forms and carts
- Review submission and display
- Dashboard widgets
- Data visualization for reports
- Image displays

## Advanced Features

### MongoDB Features Utilized

- **GridFS** for image storage
- **Text indexes** for review searching
- **Geospatial indexes** for location-based queries
- **Multikey indexes** for array fields
- **Aggregation pipelines** for complex reporting

### Data Visualization

The admin dashboard includes MongoDB Charts integration for visualizing:
- Restaurant ratings
- Order volumes
- Popular menu items
- User activity metrics

## Project Structure

```
DB-PRY2/
├── backend/
│   ├── src/
│   │   ├── api/           # API routes
│   │   ├── controllers/   # Request handlers
│   │   ├── lib/           # Utilities
│   │   ├── models/        # Data models
│   │   ├── services/      # Business logic
│   │   └── types/         # TypeScript definitions
│   ├── scripts/           # Database scripts
│   └── data/              # Sample data
└── frontend/
    ├── src/
    │   ├── app/           # Next.js app router
    │   │   ├── admin/     # Admin pages
    │   │   ├── client/    # Customer pages
    │   │   └── repartidor/ # Delivery pages
    │   ├── components/    # React components
    │   ├── store/         # State management
    │   └── utils/         # Utility functions
    └── public/            # Static assets
```

## Acknowledgements

- MongoDB University for database design patterns
- Next.js team for the frontend framework
- Express.js community for the backend framework

---

Developed by @Gxrco & @DiegoVal-Dev for the DB2 project at UVG, 7th Semester, 2025.
