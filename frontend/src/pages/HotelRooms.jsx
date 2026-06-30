import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader2, MapPin, Hotel as HotelIcon } from 'lucide-react';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';

const HotelRooms = () => {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hotelRes, roomsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/hotels/${id}`),
                    axios.get(`http://localhost:5000/api/hotels/${id}/rooms`)
                ]);
                setHotel(hotelRes.data);
                setRooms(roomsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="loader container"><Loader2 className="spin" size={40} /></div>;

    return (
        <div className="hotel-rooms-page container user-bg">
            <section className="hotel-header">
                <motion.div
                    className="hotel-hero-img"
                    style={{
                        backgroundImage: `url(${hotel.image.startsWith('http') ? hotel.image : 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000'})`,
                        backgroundColor: '#0b0d17'
                    }}
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
                    <p>Select your preferred luxury accomodation</p>
                </div>

                <div className="rooms-grid">
                    {rooms.map(room => (
                        <RoomCard key={room._id} room={room} onBook={(r) => setSelectedRoom(r)} />
                    ))}
                </div>
                {rooms.length === 0 && <p className="empty">No rooms available at this property currently.</p>}
            </section>

            {selectedRoom && (
                <BookingModal
                    isOpen={!!selectedRoom}
                    onClose={() => setSelectedRoom(null)}
                    room={selectedRoom}
                />
            )}


        </div>
    );
};

export default HotelRooms;
