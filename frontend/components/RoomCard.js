import { motion } from 'framer-motion';
import { Bed, Users } from 'lucide-react';

const RoomCard = ({ room, onBook }) => {
    const imageUrl = room.image
        ? room.image.startsWith('http')
            ? room.image
            : `http://localhost:5000${room.image}`
        : 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800';

    const isBooked = !room.isAvailable;

    return (
        <motion.div
            className={`room-card glass ${isBooked ? 'booked' : ''}`}
            whileHover={{ y: isBooked ? 0 : -10 }}
            transition={{ duration: 0.3 }}
        >
            <div className="card-img-wrapper">
                <img src={imageUrl} alt={room.type} className="card-img" />
                <div className="card-badge">{room.type}</div>
                {isBooked && (
                    <div className="booked-overlay">
                        <span>UNAVAILABLE</span>
                    </div>
                )}
            </div>

            <div className="card-content">
                <div className="card-header">
                    <h3>Room {room.roomNumber}</h3>
                    <span className="price">${room.price}<span>/night</span></span>
                </div>

                <p className="description">{room.description}</p>

                <div className="features">
                    <span><Bed size={16} /> King Bed</span>
                    <span><Users size={16} /> 2 Adults</span>
                </div>

                <button
                    className={`btn btn-primary full-width ${isBooked ? 'disabled' : ''}`}
                    disabled={isBooked}
                    onClick={() => onBook(room)}
                >
                    {isBooked ? 'Currently Booked' : 'Book Premium'}
                </button>
            </div>
        </motion.div>
    );
};

export default RoomCard;
