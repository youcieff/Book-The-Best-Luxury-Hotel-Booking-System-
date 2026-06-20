import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Hotel, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = ({ searchQuery }) => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotels = async () => {
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
                            onClick={() => navigate(`/hotel/${hotel._id}`)}
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
                                    <div className="rating"><Star size={14} fill="var(--primary)" /> 4.9</div>
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
