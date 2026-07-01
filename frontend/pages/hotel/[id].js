import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader2, MapPin } from 'lucide-react';
import RoomCard from '../../components/RoomCard';
import BookingModal from '../../components/BookingModal';
import BackButton from '../../components/BackButton';
import Navbar from '../../components/Navbar';
import AuthModal from '../../components/AuthModal';

const DEMO_HOTEL_DATA = {
    h1: {
        name: 'The Royal Palace Hotel', location: 'Cairo, Egypt',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000',
        description: 'Experience timeless luxury in the heart of Cairo. An iconic palace hotel with world-class amenities and impeccable service.',
        rooms: [
            { _id: 'r1', roomNumber: '101', type: 'Single', price: 150, description: 'Elegant single room with stunning city views. Includes breakfast and Wi-Fi.', isAvailable: true, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800' },
            { _id: 'r2', roomNumber: '201', type: 'Double', price: 250, description: 'Spacious double room with a private balcony overlooking the Nile.', isAvailable: true, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800' },
            { _id: 'r3', roomNumber: 'S-701', type: 'Suite', price: 600, description: 'Presidential suite with dedicated butler, jacuzzi, and full panoramic views.', isAvailable: false, image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800' },
        ]
    },
    h2: {
        name: 'Azure Beach Resort', location: 'Hurghada, Egypt',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=2000',
        description: 'Modern luxury meets pristine beaches. Our exclusive summer sanctuary offers a perfect retreat from the daily hustle.',
        rooms: [
            { _id: 'r4', roomNumber: 'B-101', type: 'Single', price: 200, description: 'Beachfront single room with direct sea access and morning snorkeling packages.', isAvailable: true, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800' },
            { _id: 'r5', roomNumber: 'B-202', type: 'Double', price: 380, description: 'Premium beachside double room with private terrace and infinity pool access.', isAvailable: true, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800' },
        ]
    },
    h3: {
        name: 'Nile View Grand Hotel', location: 'Luxor, Egypt',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=2000',
        description: 'Set along the historic Nile, wake up to views of ancient temples and golden sunsets every morning.',
        rooms: [
            { _id: 'r6', roomNumber: 'N-302', type: 'Double', price: 220, description: 'Nile-facing double room with historical decor and premium Egyptian cotton sheets.', isAvailable: true, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800' },
            { _id: 'r7', roomNumber: 'S-901', type: 'Suite', price: 750, description: 'Grand suite with a private rooftop terrace, direct Nile view, and personal concierge.', isAvailable: true, image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800' },
        ]
    },
    h4: {
        name: 'Pyramids Luxury Suites', location: 'Giza, Egypt',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=2000',
        description: 'The only hotel where you wake up to a direct view of the Great Pyramids. History and luxury in perfect harmony.',
        rooms: [
            { _id: 'r8', roomNumber: 'P-101', type: 'Single', price: 280, description: 'Standard suite with pyramid-facing window and guided tour packages included.', isAvailable: true, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800' },
            { _id: 'r9', roomNumber: 'P-301', type: 'Suite', price: 900, description: 'The Pharaoh Suite — unobstructed 270° view of all three Pyramids of Giza.', isAvailable: false, image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800' },
        ]
    },
    h5: {
        name: 'Marina Bay Resort', location: 'Alexandria, Egypt',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=2000',
        description: "Overlooking the magnificent Mediterranean, Alexandria's finest resort blending ancient culture with modern elegance.",
        rooms: [
            { _id: 'r10', roomNumber: 'M-201', type: 'Double', price: 190, description: 'Mediterranean-view double room with a private balcony and daily spa credit.', isAvailable: true, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800' },
        ]
    },
    h6: {
        name: 'Desert Oasis Hotel', location: 'Sharm El Sheikh, Egypt',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000',
        description: 'A hidden gem nestled between the Red Sea and Sinai mountains. Dive, relax, and reconnect with nature in total luxury.',
        rooms: [
            { _id: 'r11', roomNumber: 'D-101', type: 'Single', price: 170, description: 'Garden view single room with complimentary diving lesson and breakfast buffet.', isAvailable: true, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800' },
            { _id: 'r12', roomNumber: 'D-205', type: 'Suite', price: 550, description: 'Reef Suite with glass-bottom floor section for underwater viewing and private butler.', isAvailable: true, image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800' },
        ]
    },
};

const FALLBACK = { name: 'Luxury Hotel', location: 'Egypt', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000', description: 'A world-class luxury property offering exceptional hospitality.', rooms: [] };

export default function HotelRooms() {
    const router = useRouter();
    const { id } = router.query;
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [authOpen, setAuthOpen] = useState(false);

    const isDemo = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');

    useEffect(() => {
        if (!id) return;
        if (isDemo) {
            const demoHotel = DEMO_HOTEL_DATA[id] || FALLBACK;
            setTimeout(() => { setHotel(demoHotel); setRooms(demoHotel.rooms); setLoading(false); }, 600);
            return;
        }
        Promise.all([
            axios.get(`http://localhost:5000/api/hotels/${id}`),
            axios.get(`http://localhost:5000/api/hotels/${id}/rooms`)
        ]).then(([hotelRes, roomsRes]) => {
            setHotel(hotelRes.data);
            setRooms(roomsRes.data);
        }).catch(console.error)
        .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="loader container"><Loader2 className="spin" size={40} /></div>;
    if (!hotel) return null;

    return (
        <div className="hotel-rooms-page container user-bg">
            <Navbar onAuthClick={() => setAuthOpen(true)} />
            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
            <BackButton />

            <section className="hotel-header">
                <motion.div
                    className="hotel-hero-img"
                    style={{ backgroundImage: `url(${hotel.image && hotel.image !== '/uploads/no-photo.jpg' ? (hotel.image.startsWith('http') ? hotel.image : `http://localhost:5000${hotel.image}`) : 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000'})`, backgroundColor: '#0b0d17' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="overlay"></div>
                    <div className="hero-text">
                        <h1>{hotel.name}</h1>
                        <p><MapPin size={18} /> {hotel.location}</p>
                    </div>
                </motion.div>

                <div className="hotel-desc glass">
                    <h3>About the Property</h3>
                    <p>{hotel.description}</p>
                </div>
            </section>

            <section className="rooms-grid-container">
                <div className="section-title">
                    <h2>Available Suites & Rooms</h2>
                    <p>Select your preferred luxury accommodation</p>
                </div>
                <div className="rooms-grid">
                    {rooms.map(room => (
                        <RoomCard key={room._id} room={room} onBook={(r) => setSelectedRoom(r)} />
                    ))}
                </div>
                {rooms.length === 0 && <p className="empty">No rooms available at this property currently.</p>}
            </section>

            {selectedRoom && (
                <BookingModal isOpen={!!selectedRoom} onClose={() => setSelectedRoom(null)} room={selectedRoom} />
            )}
        </div>
    );
}
