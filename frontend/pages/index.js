import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MapPin, Star, Hotel, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';

const DEMO_HOTELS = [
    { _id: 'h1', name: 'The Royal Palace Hotel', location: 'Cairo, Egypt', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', rating: 4.9 },
    { _id: 'h2', name: 'Azure Beach Resort', location: 'Hurghada, Egypt', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800', rating: 4.8 },
    { _id: 'h3', name: 'Nile View Grand Hotel', location: 'Luxor, Egypt', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800', rating: 4.7 },
    { _id: 'h4', name: 'Pyramids Luxury Suites', location: 'Giza, Egypt', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800', rating: 4.9 },
    { _id: 'h5', name: 'Marina Bay Resort', location: 'Alexandria, Egypt', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800', rating: 4.6 },
    { _id: 'h6', name: 'Desert Oasis Hotel', location: 'Sharm El Sheikh, Egypt', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800', rating: 4.8 },
];

export default function Home() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [authOpen, setAuthOpen] = useState(false);
    const router = useRouter();
    const { isDemo } = useAuth();

    useEffect(() => {
        if (isDemo) {
            setTimeout(() => { setHotels(DEMO_HOTELS); setLoading(false); }, 800);
            return;
        }
        axios.get('http://localhost:5000/api/hotels')
            .then(({ data }) => setHotels(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [isDemo]);

    const filtered = hotels.filter(h =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="home-page user-bg">
            <Navbar onAuthClick={() => setAuthOpen(true)} onSearch={setSearchQuery} />
            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

            <section className="hotels-section container luxury-view">
                <motion.div className="section-title-alt" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1>Discover Exceptional Stays</h1>
                    <p>Experience the world&apos;s finest boutique hotels with Book The Best.</p>
                </motion.div>

                {loading ? (
                    <div className="loader"><Loader2 className="spin" size={40} /></div>
                ) : (
                    <div className="hotels-grid">
                        {filtered.map((hotel, index) => (
                            <motion.div
                                key={hotel._id}
                                className="hotel-card glass-premium"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                onClick={() => router.push(`/hotel/${hotel._id}`)}
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
                                    <div className="location"><MapPin size={14} /> {hotel.location}</div>
                                    <div className="hotel-footer">
                                        <button className="btn-view">View Stays <ArrowRight size={16} /></button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="empty-state">
                                <Hotel size={48} />
                                <h3>No hotels match your search</h3>
                                <p>Try searching for a different destination or property name.</p>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
