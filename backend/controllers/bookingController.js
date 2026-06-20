const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Room = require('../models/Room');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const addBookingItems = asyncHandler(async (req, res) => {
    const { room, checkInDate, checkOutDate, totalPrice } = req.body;

    if (!room || !checkInDate || !checkOutDate || !totalPrice) {
        res.status(400);
        throw new Error('Please provide all booking details');
    }

    const roomExists = await Room.findById(room);
    if (!roomExists) {
        res.status(404);
        throw new Error('Room not found');
    }

    if (!roomExists.isAvailable) {
        res.status(400);
        throw new Error('Room is not available');
    }

    const booking = new Booking({
        user: req.user._id,
        room,
        checkInDate,
        checkOutDate,
        totalPrice,
    });

    const createdBooking = await booking.save();

    // Mark room as unavailable (simplified logic)
    // In a real app, this would be date-based availability
    roomExists.isAvailable = false;
    await roomExists.save();

    res.status(201).json(createdBooking);
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate('room');
    res.json(bookings);
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id)
        .populate('user', 'name email')
        .populate('room');

    if (booking) {
        // Check if the booking belongs to the user or if user is admin
        if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to view this booking');
        }
        res.json(booking);
    } else {
        res.status(404);
        throw new Error('Booking not found');
    }
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({}).populate('user', 'name email phone').populate('room');
    res.json(bookings);
});

// @desc    Update booking to confirmed
// @route   PUT /api/bookings/:id/confirm
// @access  Private/Admin
const updateBookingToConfirmed = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        booking.status = 'Confirmed';
        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } else {
        res.status(404);
        throw new Error('Booking not found');
    }
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to cancel this booking');
        }

        booking.status = 'Cancelled';
        await booking.save();

        // Mark room as available again
        const room = await Room.findById(booking.room);
        if (room) {
            room.isAvailable = true;
            await room.save();
        }

        res.json({ message: 'Booking cancelled' });
    } else {
        res.status(404);
        throw new Error('Booking not found');
    }
});

module.exports = {
    addBookingItems,
    getMyBookings,
    getBookingById,
    getBookings,
    updateBookingToConfirmed,
    cancelBooking,
};
