# Hotel Booking System API

نظام متكامل لإدارة حجز الفنادق مبني باستخدام Node.js و MongoDB.

## Features
- **Authentication**: JWT-based login and registration.
- **Role Mastery**: Admin and User roles.
- **Room Management**: Admin can create, update, and delete rooms with image uploads.
- **Booking System**: Users can book rooms, view their bookings, and cancel them.
- **Error Handling**: Centralized error management.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: JWT, BcryptJS
- **File Upload**: Multer

## Getting Started

### Prerequisites
- Node.js installed.
- MongoDB running (locally or on Atlas).

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (copied from the setup) and add your `MONGODB_URI` and `JWT_SECRET`.

### Running the server
```bash
# Development mode
node server.js
```

## API Documentation

### Auth
- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Login and get token.
- `GET /api/auth/profile` - Get user profile (Protected).

### Rooms
- `GET /api/rooms` - Get all rooms.
- `GET /api/rooms/:id` - Get room by ID.
- `POST /api/rooms` - Create a room (Admin only, accepts file).
- `PUT /api/rooms/:id` - Update a room (Admin only, accepts file).
- `DELETE /api/rooms/:id` - Delete a room (Admin only).

### Bookings
- `POST /api/bookings` - Create a new booking (Protected).
- `GET /api/bookings/mybookings` - Get current user bookings (Protected).
- `GET /api/bookings/:id` - Get booking details (Protected).
- `GET /api/bookings` - Get all bookings (Admin only).
- `PUT /api/bookings/:id/confirm` - Confirm a booking (Admin only).
- `PUT /api/bookings/:id/cancel` - Cancel a booking (Protected).

## Folder Structure
- `routes/`: API route definitions.
- `controllers/`: Request handling logic.
- `models/`: Mongoose schemas.
- `middleware/`: Custom middleware (Auth, Error, Upload).
- `config/`: Database connection.
- `uploads/`: Uploaded room images.
- `utils/`: Utility functions (Token generation).
