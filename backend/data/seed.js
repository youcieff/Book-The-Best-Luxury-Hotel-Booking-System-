const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');

// Load env from root
dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Cleaning database...');
        await User.deleteMany();
        await Room.deleteMany();
        await Booking.deleteMany();
        await Hotel.deleteMany();

        console.log('Creating Admin & User...');
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@hotel.com',
            password: 'admin123',
            phone: '+201234567890',
            role: 'admin'
        });

        const user = await User.create({
            name: 'Regular User',
            email: 'user@hotel.com',
            password: 'user123',
            phone: '+201098765432',
            role: 'user'
        });

        console.log('Creating Hotels...');
        const hotel1 = await Hotel.create({
            name: 'The Grand Astoria',
            location: 'Downtown, Alexandria',
            description: 'Experience timeless luxury in our historic palace overlooking the Mediterranean.',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200'
        });

        const hotel2 = await Hotel.create({
            name: 'Azure Bay Resort',
            location: 'North Coast',
            description: 'Modern luxury meets pristine beaches at our exclusive summer sanctuary.',
            image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1200'
        });

        console.log('Creating Rooms...');
        await Room.insertMany([
            { roomNumber: '101', type: 'Single', price: 150, description: 'Elegant single room with city views.', hotel: hotel1._id },
            { roomNumber: '201', type: 'Double', price: 250, description: 'Luxury double room with balcony.', hotel: hotel1._id },
            { roomNumber: 'S-701', type: 'Suite', price: 600, description: 'Presidential suite with full sea view.', hotel: hotel2._id },
            { roomNumber: 'D-402', type: 'Double', price: 350, description: 'Premium beachside double room.', hotel: hotel2._id }
        ]);

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
