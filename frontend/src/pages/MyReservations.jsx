import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, Trash2, Loader2, CheckCircle, Clock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const MyReservations = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/bookings/mybookings', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setBookings(data);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchBookings();
    }, [user]);

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await axios.put(`http://localhost:5000/api/bookings/${id}/cancel`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Booking cancelled');
            fetchBookings();
        } catch (error) {
            toast.error('Failed to cancel booking');
        }
    };

    if (loading) return (
        <div className="loader container">
            <Loader2 className="spin" size={40} />
        </div>
    );

    return (
        <div className="reservations-page user-bg container">
            <motion.div
                className="header"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <h1>My Reservations</h1>
                <p>Manage your luxury stays and upcoming trips.</p>
            </motion.div>

            <div className="bookings-list">
                {bookings.length === 0 ? (
                    <div className="empty-state glass">
                        <Calendar size={48} />
                        <h3>No luxury stays found</h3>
                        <p>Your history of exceptional experiences will appear here.</p>
                    </div>
                ) : (
                    bookings.map((booking, index) => (
                        <motion.div
                            key={booking._id}
                            className="booking-card glass"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="booking-info">
                                <div className="room-meta">
                                    <div className="title-group">
                                        <h3>Room {booking.room?.roomNumber} - {booking.room?.type}</h3>
                                        <p className="hotel-name"><MapPin size={14} /> {booking.hotel?.name || 'Grand Astoria'}</p>
                                    </div>
                                    <div className={`status-badge ${booking.status.toLowerCase()}`}>
                                        {booking.status === 'Confirmed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                        {booking.status}
                                    </div>
                                </div>
                                <div className="details-grid">
                                    <div className="detail">
                                        <span className="label">Check In</span>
                                        <span className="value">{new Date(booking.checkInDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="detail">
                                        <span className="label">Check Out</span>
                                        <span className="value">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="detail">
                                        <span className="label">Total Paid</span>
                                        <span className="value price">${booking.totalPrice}</span>
                                    </div>
                                </div>
                            </div>

                            {booking.status === 'Pending' && (
                                <button
                                    className="btn-cancel"
                                    onClick={() => handleCancel(booking._id)}
                                    title="Cancel Reservation"
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
            <style jsx>{`
                .reservations-page { padding-top: 120px; padding-bottom: 80px; }
                .hotel-name { font-size: 0.85rem; color: var(--primary); display: flex; align-items: center; gap: 5px; margin-top: 5px; }
            `}</style>
        </div>
    );
};

export default MyReservations;
