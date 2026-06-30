import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, CreditCard } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ isOpen, onClose, room }) => {
    const { user } = useAuth();
    const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (dates.checkIn && dates.checkOut && room) {
            const start = new Date(dates.checkIn);
            const end = new Date(dates.checkOut);
            if (end > start) {
                const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                setTotalPrice(days * room.price);
            }
        }
    }, [dates, room]);

    const handleBooking = async (e) => {
        e.preventDefault();
        if (totalPrice <= 0) return toast.error('Invalid dates');

        try {
            const { data } = await axios.post(
                'http://localhost:5000/api/bookings',
                {
                    room: room._id,
                    checkInDate: dates.checkIn,
                    checkOutDate: dates.checkOut,
                    totalPrice
                },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            toast.success('Room booked successfully!');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed');
        }
    };

    if (!room) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay">
                    <motion.div
                        className="modal-container glass"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                    >
                        <button className="close-btn" onClick={onClose}><X /></button>
                        <div className="room-preview">
                            <h2>Book {room.type}</h2>
                            <p className="price-tag">${room.price} per night</p>
                        </div>

                        <form onSubmit={handleBooking}>
                            <div className="input-row">
                                <div className="input-group">
                                    <label><Calendar size={14} /> Check In</label>
                                    <input
                                        type="date"
                                        required
                                        onChange={e => setDates({ ...dates, checkIn: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label><Calendar size={14} /> Check Out</label>
                                    <input
                                        type="date"
                                        required
                                        onChange={e => setDates({ ...dates, checkOut: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="summary-card glass">
                                <div className="summary-row">
                                    <span>Room Charge</span>
                                    <span>${totalPrice}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Taxes (Included)</span>
                                    <span>$0</span>
                                </div>
                                <div className="total-row">
                                    <span>Total Due</span>
                                    <span>${totalPrice}</span>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary full-width">
                                Confirm & Pay <CreditCard size={18} />
                            </button>
                        </form>
                    </motion.div>


                </div>
            )}
        </AnimatePresence>
    );
};

export default BookingModal;
