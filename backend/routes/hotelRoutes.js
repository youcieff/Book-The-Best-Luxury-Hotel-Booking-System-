const express = require('express');
const router = express.Router();
const { 
  getHotels, 
  getHotel, 
  createHotel, 
  updateHotel, 
  deleteHotel,
  getHotelRooms
} = require('../controllers/hotelController');
const { protect, admin } = require('../middleware/auth');
const { validate, createHotelSchema, updateHotelSchema } = require('../middleware/validate');

router.route('/')
  .get(getHotels)
  .post(protect, admin, validate(createHotelSchema), createHotel);

router.route('/:id')
  .get(getHotel)
  .put(protect, admin, validate(updateHotelSchema), updateHotel)
  .delete(protect, admin, deleteHotel);

router.get('/:id/rooms', getHotelRooms);

module.exports = router;

