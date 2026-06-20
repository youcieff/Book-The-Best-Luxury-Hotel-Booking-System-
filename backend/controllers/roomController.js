const asyncHandler = require('express-async-handler');
const Room = require('../models/Room');

// @desc    Get all rooms (with pagination)
// @route   GET /api/rooms?page=1&limit=10
// @access  Public
const getRooms = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Room.countDocuments();
    const rooms = await Room.find({})
        .populate('hotel', 'name location')
        .skip(skip)
        .limit(limit)
        .lean();

    res.json({
        rooms,
        page,
        pages: Math.ceil(total / limit),
        total,
    });
});

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id);

    if (room) {
        res.json(room);
    } else {
        res.status(404);
        throw new Error('Room not found');
    }
});

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = asyncHandler(async (req, res) => {
    const { roomNumber, type, price, description, hotel } = req.body;

    const roomExists = await Room.findOne({ roomNumber });

    if (roomExists) {
        res.status(400);
        throw new Error('Room already exists');
    }

    const room = new Room({
        roomNumber,
        type,
        price,
        description,
        hotel,
        image: req.file ? `/uploads/${req.file.filename}` : '/uploads/no-photo.jpg',
    });

    const createdRoom = await room.save();
    res.status(201).json(createdRoom);
});

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = asyncHandler(async (req, res) => {
    const { roomNumber, type, price, isAvailable, description, hotel } = req.body;

    const room = await Room.findById(req.params.id);

    if (room) {
        room.roomNumber = roomNumber || room.roomNumber;
        room.type = type || room.type;
        room.price = price || room.price;
        room.isAvailable = isAvailable !== undefined ? isAvailable : room.isAvailable;
        room.description = description || room.description;
        room.hotel = hotel || room.hotel;
        
        if (req.file) {
            room.image = `/uploads/${req.file.filename}`;
        }

        const updatedRoom = await room.save();
        res.json(updatedRoom);
    } else {
        res.status(404);
        throw new Error('Room not found');
    }
});

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id);

    if (room) {
        await Room.deleteOne({ _id: room._id });
        res.json({ message: 'Room removed' });
    } else {
        res.status(404);
        throw new Error('Room not found');
    }
});

module.exports = {
    getRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
};
