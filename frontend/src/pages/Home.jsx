import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Hotel, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Demo hotel data for Vercel deployment
const DEMO_HOTELS = [
    {
        _id: 'h1',
        name: 'The Royal Palace Hotel',
        location: 'Cairo, Egypt',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
        rating: 4.9
    },
    {
        _id: 'h2',
        name: 'Azure Beach Resort',
        location: 'Hurghada, Egypt',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
        rating: 4.8
    },
    {
        _id: 'h3',
        name: 'Nile View Grand Hotel',
        location: 'Luxor, Egypt',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800',
        rating: 4.7
    },
    {
        _id: 'h4',
        name: 'Pyramids Luxury Suites',
        location: 'Giza, Egypt',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
        rating: 4.9
    },
    {
        _id: 'h5',
        name: 'Marina Bay Resort',
        location: 'Alexandria, Egypt',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800',
        rating: 4.6
    },
    {
        _id: 'h6',
        name: 'Desert Oasis Hotel',
        location: 'Sharm El Sheikh, Egypt',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
        rating: 4.8
    }
];

const Home = ({ searchQuery }) => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { IS_DEMO } = useAuth();

    useEffect(() => {
        const fetchHotels = async () => {
            if (IS_DEMO) {
                // Use demo data on Vercel
                setTimeout(() => {
                    setHotels(DEMO_HOTELS);
                    setLoading(false);
                }, 800);
                return;
            }
            try {
                const { data } = await axios.get('http://localhost:5000/api/hotels');
                setHotels(data);
            } catch (error) {
                console.error('Error fetching hotels:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    const filteredHotels = hotels.filter(h =>
        h.name.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
        h.location.toLowerCase().includes((searchQuery || '').toLowerCase())
    );

    if (loading) return (
        <div className="loader container">
            <Loader2 className="spin" size={40} />
        </div>
    );

    return (
        <div className="home-page user-bg">
            {/* Hotels Grid */}
            <section className="hotels-section container luxury-view">
                <motion.div
                    className="section-title-alt"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1>Discover Exceptional Stays</h1>
                    <p>Experience the world's finest boutique hotels with Book The Best.</p>
                </motion.div>

                <div className="hotels-grid">
                    {filteredHotels.map((hotel, index) => (
                        <motion.div
                            key={hotel._id}
                            className="hotel-card glass-premium"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            onClick={() => !IS_DEMO && navigate(`/hotel/${hotel._id}`)}
                        >
                            <div className="hotel-img-wrapper">
                                <img
                                    src={hotel.image.startsWith('http') ? hotel.image : 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800'}
                                    alt={hotel.name}
                                    className="hotel-img"
                                />
                                <div className="hotel-badge">Luxury</div>
                            </div>
                            <div className="hotel-content">
                                <div className="hotel-title">
                                    <h3>{hotel.name}</h3>
                                    <div className="rating"><Star size={14} fill="var(--primary)" /> {hotel.rating || 4.9}</div>
                                </div>
                                <div className="location">
                                    <MapPin size={14} /> {hotel.location}
                                </div>
                                <div className="hotel-footer">
                                    <button className="btn-view">
                                        View Stays <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredHotels.length === 0 && (
                    <div className="empty-state">
                        <Hotel size={48} />
                        <h3>No hotels match your search</h3>
                        <p>Try searching for a different destination or property name.</p>
                    </div>
                )}
            </section>

            <style jsx>{`
        .home-page { padding-bottom: 80px; }
        .section-title-alt { margin: 60px 0 40px 0; }
        .section-title-alt h1 { font-size: 2.2rem; font-weight: 800; margin-bottom: 5px; }
        .section-title-alt p { color: var(--text-muted); }
      `}</style>
        </div>
    );
};

export default Home;
