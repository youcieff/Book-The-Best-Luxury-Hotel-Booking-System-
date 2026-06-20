const mongoose = require('mongoose');

const roomSchema = mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: [true, 'Please add a room number'],
            unique: true,
        },
        type: {
            type: String,
            required: [true, 'Please add a room type'],
            enum: ['Single', 'Double', 'Suite'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a price per night'],
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        image: {
            type: String,
            default: 'no-photo.jpg',
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hotel',
            required: [true, 'Please add a hotel'],
        },
    },
    {
        timestamps: true,
    }
);

// Index for query optimization
roomSchema.index({ hotel: 1 });
roomSchema.index({ type: 1, isAvailable: 1 });

module.exports = mongoose.model('Room', roomSchema);
