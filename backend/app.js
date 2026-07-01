const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Hotel Booking API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

module.exports = app;
