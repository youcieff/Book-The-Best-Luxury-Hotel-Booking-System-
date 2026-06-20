const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide hotel name'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please provide hotel location']
  },
  description: {
    type: String,
    required: [true, 'Please provide hotel description']
  },
  image: {
    type: String,
    default: '/uploads/default-hotel.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hotel', hotelSchema);
