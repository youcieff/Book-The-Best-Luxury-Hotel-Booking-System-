const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Room = require('../models/Room');

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

    roomExists.isAvailable = false;
    await roomExists.save();

    res.status(201).json(createdBooking);
});

const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate('room');
    res.json(bookings);
});

const getBookingById = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id)
        .populate('user', 'name email')
        .populate('room');

    if (booking) {
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

const getBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({}).populate('user', 'name email phone').populate('room');
    res.json(bookings);
});

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

const cancelBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to cancel this booking');
        }

        booking.status = 'Cancelled';
        await booking.save();

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
