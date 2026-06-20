const express = require('express');
const router = express.Router();
const {
    addBookingItems,
    getMyBookings,
    getBookingById,
    getBookings,
    updateBookingToConfirmed,
    cancelBooking,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');
const { validate, createBookingSchema } = require('../middleware/validate');

router.post('/', protect, validate(createBookingSchema), addBookingItems);
router.get('/', protect, admin, getBookings);
router.get('/mybookings', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/confirm', protect, admin, updateBookingToConfirmed);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;

