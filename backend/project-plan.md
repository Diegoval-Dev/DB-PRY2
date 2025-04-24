# Project Plan: MongoDB Restaurant Management System (GercoRaunte)

## 1. Project Overview

This project involves developing a Restaurant Order and Review Management System using MongoDB as the database and implementing a fully functional REST API. The system will serve GercoRaunte, a multinational fast-food chain focused on digital experiences, allowing users to browse restaurants, place orders, and leave reviews.

**Key Features Required:**
- Document embedding and referencing
- Complete CRUD operations
- Sorting and projections
- File storage with GridFS
- Complex aggregations
- Array manipulation
- Multiple index types
- Preconfigured data imports

## 2. System Architecture

### Stack Overview
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

## 3. Database Schema & Collections

### Collections Structure

#### 1. `usuarios` (Users)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,         // Indexed (Simple)
  role: String,          // 'cliente', 'admin', 'repartidor'
  registrationDate: Date
}
```

#### 2. `restaurantes` (Restaurants)
```javascript
{
  _id: ObjectId,
  name: String,
  address: String,
  location: {            // Indexed (Geospatial)
    type: 'Point',
    coordinates: [Number, Number]  // [longitude, latitude]
  },
  specialties: [String], // Indexed (Multikey)
  imageIds: [String]     // GridFS references
}
```

#### 3. `menuItems` (Menu Items)
```javascript
{
  _id: ObjectId,
  restaurantId: ObjectId,  // Reference to restaurant
  name: String,
  description: String,
  price: Number,
  category: String,        // Indexed with restaurantId (Compound)
  imageId: String          // GridFS reference
}
```

#### 4. `ordenes` (Orders)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,        // Reference to user
  restaurantId: ObjectId,  // Reference to restaurant
  date: Date,
  status: String,          // 'pending', 'processing', 'delivered', etc.
  total: Number,
  items: [                 // Embedded documents, Indexed (Multikey)
    {
      menuItemId: ObjectId,
      quantity: Number
    }
  ]
}
```

#### 5. `resenas` (Reviews)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,        // Reference to user
  restaurantId: ObjectId,  // Reference to restaurant
  orderId: ObjectId,       // Reference to order
  rating: Number,          // 1-5
  comment: String,         // Indexed (Text)
  date: Date
}
```

### Required Indexes
- Simple: `usuarios.email`
- Compound: `menuItems.restaurantId` + `menuItems.category`
- Multikey: `ordenes.items.menuItemId`
- Geospatial: `restaurantes.location`
- Text: `resenas.comment`
- At least 2 indexes per collection

## 4. Backend Implementation Tasks

### Core Structure Setup
- [x] Initialize Express application with TypeScript
- [x] Set up MongoDB connection
- [ ] Configure environment variables
- [ ] Implement basic middleware (CORS, JSON parsing)
- [ ] Set up error handling middleware

### Models Implementation
- [x] Define User model
- [x] Define Restaurant model
- [x] Define MenuItem model
- [x] Define Order model
- [x] Define Review model
- [ ] Implement required indexes on all models

### API Endpoints

#### User Management
- [ ] `POST /api/users` - Register a new user
- [ ] `GET /api/users/:id` - Get user details
- [ ] `PUT /api/users/:id` - Update user profile
- [ ] `DELETE /api/users/:id` - Delete user account
- [ ] `GET /api/users` - List users (with pagination, filters)

#### Restaurant Management
- [ ] `POST /api/restaurants` - Create a new restaurant
- [ ] `GET /api/restaurants/:id` - Get restaurant details
- [ ] `PUT /api/restaurants/:id` - Update restaurant info
- [ ] `DELETE /api/restaurants/:id` - Delete a restaurant
- [ ] `GET /api/restaurants` - List restaurants (with filtering, sorting)
- [ ] `GET /api/restaurants/nearby` - Find restaurants by geolocation

#### Menu Items Management
- [ ] `POST /api/menu-items` - Add a new menu item
- [ ] `GET /api/menu-items/:id` - Get menu item details
- [ ] `PUT /api/menu-items/:id` - Update menu item
- [ ] `DELETE /api/menu-items/:id` - Delete menu item
- [ ] `GET /api/menu-items` - List menu items (with filtering by restaurant, category)
- [ ] `GET /api/restaurants/:id/menu` - Get all menu items for a restaurant

#### Order Management
- [ ] `POST /api/orders` - Create a new order
- [ ] `GET /api/orders/:id` - Get order details
- [ ] `PUT /api/orders/:id` - Update order status
- [ ] `DELETE /api/orders/:id` - Cancel an order
- [ ] `GET /api/orders` - List orders (with filtering by user, restaurant, status)
- [ ] `GET /api/users/:id/orders` - Get user's order history

#### Review Management
- [ ] `POST /api/reviews` - Create a new review
- [ ] `GET /api/reviews/:id` - Get review details
- [ ] `PUT /api/reviews/:id` - Update a review
- [ ] `DELETE /api/reviews/:id` - Delete a review
- [ ] `GET /api/reviews` - List reviews (with filtering by restaurant, rating)
- [ ] `GET /api/restaurants/:id/reviews` - Get all reviews for a restaurant
- [ ] `GET /api/users/:id/reviews` - Get all reviews by a user

#### File Management (GridFS)
- [ ] `POST /api/files/upload` - Upload a file (image)
- [ ] `GET /api/files/:id` - Retrieve a file
- [ ] `DELETE /api/files/:id` - Delete a file

### Aggregation Pipelines
- [ ] Top-rated restaurants report
- [ ] Most ordered menu items report
- [ ] Restaurant sales report
- [ ] User order frequency report
- [ ] Average ratings by restaurant category

### Data Imports
- [ ] Create seed data for all collections
- [ ] Implement mongoimport scripts for initial data load
- [ ] Create a collection with 50,000+ documents for GridFS demonstration

## 5. Frontend Implementation Tasks

### Core Setup
- [x] Initialize Next.js application
- [x] Set up Tailwind CSS
- [ ] Create layout components
- [ ] Implement authentication flow
- [ ] Set up API client for backend communication

### Pages/Screens

#### Public Pages
- [ ] Home Page - Restaurant showcase
- [ ] Restaurant Search - Search with filters and geolocation
- [ ] Restaurant Detail Page - Info, menu, and reviews
- [ ] Login/Register Page - User authentication
- [ ] About/Contact Page - Company information

#### User Dashboard
- [ ] User Profile - Personal information
- [ ] Order History - Past orders with status
- [ ] Active Orders - Currently active orders with tracking
- [ ] Review Management - User's reviews
- [ ] Favorites - Saved restaurants

#### Admin Dashboard
- [ ] Restaurant Management - Add/edit restaurants
- [ ] Menu Management - Add/edit menu items
- [ ] Order Dashboard - View and process orders
- [ ] Review Monitoring - View all reviews
- [ ] User Management - Manage user accounts
- [ ] Reports - View aggregated data reports

### Components
- [ ] Navigation/Header
- [ ] Footer
- [ ] Restaurant Card
- [ ] Menu Item Card
- [ ] Order Form
- [ ] Review Form
- [ ] Search Filters
- [ ] Map Component (for geolocation)
- [ ] Order Status Tracker
- [ ] Rating Stars Component
- [ ] Image Upload Component
- [ ] Pagination Component
- [ ] Charts/Graphs for Reports

## 6. Task Division

### Person 1 (Backend Specialist)

#### Core Backend Tasks
- Backend structure setup
- Database models implementation
- User and authentication endpoints
- Restaurant endpoints
- GridFS implementation
- Index configuration
- Data seed scripts
- Basic aggregation pipelines

#### Supporting Frontend Tasks
- API client implementation
- Data fetching components
- Form validation

### Person 2 (Frontend Specialist)

#### Core Frontend Tasks
- Frontend structure and layout
- User interface components
- Restaurant search and detail pages
- Order flow implementation
- Review system
- Admin dashboard views
- Reports visualization

#### Supporting Backend Tasks
- Order management endpoints
- Review endpoints
- Menu item endpoints
- Advanced aggregation pipelines

## 7. Implementation Timeline

### Week 1 (April 15-21)
- Set up development environment
- Implement data models and schemas
- Create basic API endpoints
- Set up frontend structure

### Week 2 (April 22-28)
- Implement core CRUD operations
- Create data seed scripts
- Implement GridFS for file storage
- Develop basic frontend pages

### Week 3 (April 29-May 5)
- Implement aggregation pipelines
- Develop advanced frontend features
- Integrate frontend with backend
- Testing and bug fixes

### Week 4 (May 6-8)
- Final integration testing
- Documentation
- Presentation preparation
- Project submission

## 8. Detailed Technical Requirements

### MongoDB Operations to Implement

#### Document Types
- **Embedded Documents**: Menu items in orders, location in restaurants
- **Referenced Documents**: Relations between users, restaurants, orders, and reviews

#### CRUD Operations
- **Create**: Single document creation, bulk insertions
- **Read**: Filtering, projection, sorting, limiting, skipping
- **Update**: Single document update, multiple document updates
- **Delete**: Single document deletion, multiple document deletions

#### Array Operations
- $push - Add items to arrays
- $pull - Remove items from arrays
- $addToSet - Add unique items to arrays

#### Aggregation Framework
- $match - Filter documents
- $group - Group documents by field
- $sort - Sort documents
- $project - Shape document fields
- $lookup - Join with other collections
- Pipeline stages for complex reporting

#### Bulk Operations
- bulkWrite for efficient batch processing

### Frontend-Specific Requirements

#### State Management
- Local state for forms
- Context API for global state
- API data caching

#### UI Components
- Responsive design with Tailwind
- Form validation and error handling
- Loading states and transitions

#### Map Integration
- Restaurant location display
- Nearby restaurant search

#### Image Handling
- Restaurant and food image display
- User profile image uploads

## 9. Extra Features for Bonus Points

### MongoDB Charts Integration
- Restaurant rating visualization
- Order volume trends
- Popular menu items chart
- User activity dashboard

### BI Connectors
- Power BI integration for advanced analytics
- Tableau dashboard for restaurant performance

### Frontend Enhancements
- Progressive Web App capabilities
- Advanced animations and transitions
- Mobile-responsive design
- Dark/light theme toggle

### Performance Optimizations
- Implement efficient indexes
- Optimize aggregation pipelines
- Implement server-side pagination
- Cache frequent queries

## 10. Testing & Quality Assurance

### Backend Testing
- Unit tests for models and controllers
- API endpoint testing
- Database operation validation

### Frontend Testing
- Component testing
- Page rendering tests
- User flow validation

### Performance Testing
- Database query performance
- API response times
- Frontend loading speeds

## 11. Documentation Requirements

- API documentation
- Database schema documentation
- Setup and installation instructions
- User guide
- 10-minute demo video