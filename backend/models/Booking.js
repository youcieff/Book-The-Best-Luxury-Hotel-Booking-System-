const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Room',
        },
        checkInDate: {
            type: Date,
            required: [true, 'Please add a check-in date'],
        },
        checkOutDate: {
            type: Date,
            required: [true, 'Please add a check-out date'],
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Cancelled'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for query optimization
bookingSchema.index({ user: 1 });
bookingSchema.index({ room: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
