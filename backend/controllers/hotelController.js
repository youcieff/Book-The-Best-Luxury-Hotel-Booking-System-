const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
exports.getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
exports.getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create hotel
// @route   POST /api/hotels
// @access  Admin
exports.createHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json(hotel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Admin
exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(hotel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Admin
exports.deleteHotel = async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get rooms of a specific hotel
// @route   GET /api/hotels/:id/rooms
// @access  Public
exports.getHotelRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ hotel: req.params.id });
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
