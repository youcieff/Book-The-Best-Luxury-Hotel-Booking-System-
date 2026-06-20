import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, Hotel, Bed, Trash2, Edit, X, Calendar, User as UserIcon, MapPin, ChevronRight, ChevronDown, Camera, LayoutDashboard, Upload, Loader2, Phone, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('hotels');
    const [hotels, setHotels] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showHotelForm, setShowHotelForm] = useState(false);
    const [showRoomForm, setShowRoomForm] = useState(null);
    const [expandedHotel, setExpandedHotel] = useState(null);
    const [newHotel, setNewHotel] = useState({ name: '', location: '', description: '', image: '' });
    const [newRoom, setNewRoom] = useState({ roomNumber: '', type: 'Single', price: '', description: '' });
    const [uploading, setUploading] = useState(false);

    const fetchHotels = async () => {
        try {
            const { data: hotelsData } = await axios.get('http://localhost:5000/api/hotels');
            const hotelsWithRooms = await Promise.all(hotelsData.map(async (h) => {
                const { data: rooms } = await axios.get(`http://localhost:5000/api/hotels/${h._id}/rooms`);
                return { ...h, rooms };
            }));
            setHotels(hotelsWithRooms);
        } catch (error) { toast.error('Failed to load hotels'); }
        finally { setLoading(false); }
    };

    const fetchAllBookings = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:5000/api/bookings', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setBookings(data);
        } catch (error) { toast.error('Failed to load bookings'); }
        finally { setLoading(false); }
    };

    const handleFileUpload = async (e, type = 'hotel') => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const { data } = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (type === 'hotel') {
                setNewHotel({ ...newHotel, image: data.filePath });
            } else {
                setNewRoom({ ...newRoom, image: data.filePath });
            }
            toast.success('Image uploaded successfully');
        } catch (error) {
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'hotels') fetchHotels();
        else fetchAllBookings();
    }, [activeTab]);

    const handleAddHotel = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/hotels', newHotel, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Hotel added successfully');
            setShowHotelForm(false);
            setNewHotel({ name: '', location: '', description: '', image: '' });
            fetchHotels();
        } catch (error) { toast.error('Failed to add hotel'); }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/rooms', { ...newRoom, hotel: showRoomForm }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Room added successfully');
            setShowRoomForm(null);
            fetchHotels();
        } catch (error) { toast.error('Failed to add room'); }
    };

    const handleDeleteHotel = async (id) => {
        if (!window.confirm('Are you sure? This will delete all rooms and bookings for this hotel too.')) return;
        try {
            await axios.delete(`http://localhost:5000/api/hotels/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Hotel deleted');
            fetchHotels();
        } catch (error) { toast.error('Failed to delete hotel'); }
    };

    const handleDeleteRoom = async (id) => {
        if (!window.confirm('Delete this room?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/rooms/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Room deleted');
            setNewRoom({ roomNumber: '', type: 'Single', price: '', description: '', image: '' });
            fetchHotels();
        } catch (error) { toast.error('Failed to add room'); }
    };

    const handleConfirmBooking = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/bookings/${id}/confirm`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Booking confirmed!');
            fetchAllBookings();
        } catch (error) { toast.error('Failed to confirm booking'); }
    };

    return (
        <div className="admin-page container full-width">
            <div className="admin-header-row">
                <div className="admin-brand">
                    <LayoutDashboard size={40} className="text-gold" />
                    <div>
                        <h1>Management Console</h1>
                        <p>Authenticated as Principal Admin</p>
                    </div>
                </div>
                <div className="admin-tabs-wrapper">
                    <div className="admin-tabs glass">
                        <button className={activeTab === 'hotels' ? 'active' : ''} onClick={() => setActiveTab('hotels')}>Inventory</button>
                        <button className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>Live Bookings</button>
                    </div>
                </div>
                {activeTab === 'hotels' && (
                    <button className="btn btn-primary" onClick={() => setShowHotelForm(true)}>
                        <Plus size={20} /> Add Property
                    </button>
                )}
            </div>

            {showHotelForm && (
                <motion.div className="form-card-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.div className="form-card glass-premium" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                        <div className="form-header">
                            <h3>Add New Luxury Hotel</h3>
                            <button className="close-btn" onClick={() => setShowHotelForm(false)}><X /></button>
                        </div>
                        <form onSubmit={handleAddHotel}>
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Hotel Name</label>
                                    <input type="text" placeholder="e.g. Grand Astoria" required onChange={e => setNewHotel({ ...newHotel, name: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Location</label>
                                    <input type="text" placeholder="e.g. North Coast, Egypt" required onChange={e => setNewHotel({ ...newHotel, location: e.target.value })} />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Property Image</label>
                                <div className="file-upload-wrapper glass">
                                    <input type="file" id="hotel-image" onChange={(e) => handleFileUpload(e, 'hotel')} accept="image/*" />
                                    <label htmlFor="hotel-image" className="file-label">
                                        {uploading ? <Loader2 className="spin" /> : <Upload size={20} />}
                                        {newHotel.image ? 'Image Uploaded: ' + newHotel.image.split('/').pop() : 'Direct Device Upload'}
                                    </label>
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Luxury Description</label>
                                <textarea placeholder="Describe the exceptional experience..." required onChange={e => setNewHotel({ ...newHotel, description: e.target.value })} />
                            </div>
                            <button type="submit" className="btn btn-primary full-width" disabled={uploading}>
                                {uploading ? 'Processing...' : 'Publish Property'}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}

            {showRoomForm && (
                <motion.div className="form-card-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.div className="form-card glass-premium" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                        <div className="form-header">
                            <h3>Add Suite Configuration</h3>
                            <button className="close-btn" onClick={() => setShowRoomForm(null)}><X /></button>
                        </div>
                        <form onSubmit={handleAddRoom}>
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Room Number</label>
                                    <input type="text" placeholder="e.g. 501" required onChange={e => setNewRoom({ ...newRoom, roomNumber: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Category</label>
                                    <select className="glass" onChange={e => setNewRoom({ ...newRoom, type: e.target.value })}>
                                        <option value="Single">Single Room</option>
                                        <option value="Double">Double Room</option>
                                        <option value="Suite">Presidential Suite</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Suite Image</label>
                                <div className="file-upload-wrapper glass">
                                    <input type="file" id="room-image" onChange={(e) => handleFileUpload(e, 'room')} accept="image/*" />
                                    <label htmlFor="room-image" className="file-label">
                                        {uploading ? <Loader2 className="spin" /> : <Upload size={20} />}
                                        {newRoom.image ? 'Image Uploaded: ' + newRoom.image.split('/').pop() : 'Direct Device Upload'}
                                    </label>
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Nightly Rate ($)</label>
                                <input type="number" placeholder="Price" required onChange={e => setNewRoom({ ...newRoom, price: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Specifications</label>
                                <textarea placeholder="Features, amenities, views..." required onChange={e => setNewRoom({ ...newRoom, description: e.target.value })} />
                            </div>
                            <button type="submit" className="btn btn-primary full-width" disabled={uploading}>
                                {uploading ? 'Processing...' : 'Initialize Suite'}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}

            {activeTab === 'hotels' ? (
                <div className="inventory-grid">
                    {hotels.map(h => (
                        <div key={h._id} className="inventory-item">
                            <div className="inventory-card glass-premium">
                                <div className="item-main" onClick={() => setExpandedHotel(expandedHotel === h._id ? null : h._id)}>
                                    <div className="item-img glass" style={{ backgroundImage: `url(http://localhost:5000${h.image})` }}></div>
                                    <div className="item-details">
                                        <h3>{h.name}</h3>
                                        <span className="location-tag"><MapPin size={14} /> {h.location}</span>
                                    </div>
                                    <div className="item-expand">
                                        {expandedHotel === h._id ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                                    </div>
                                </div>
                                <div className="item-actions">
                                    <div className="badge-group">
                                        <span className="count-badge">{h.rooms.length} Units</span>
                                    </div>
                                    <div className="btn-group">
                                        <button className="btn-icon-gold" onClick={(e) => { e.stopPropagation(); setShowRoomForm(h._id); }} title="Add Room"><Plus size={18} /></button>
                                        <button className="btn-icon-danger" onClick={(e) => { e.stopPropagation(); handleDeleteHotel(h._id); }} title="Delete Hotel">
                                            <Trash2 size={18} />
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, marginLeft: '8px' }}>REMOVE PROPERTY</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {expandedHotel === h._id && (
                                <motion.div className="sub-inventory" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                                    {h.rooms.map(r => (
                                        <div key={r._id} className="sub-item glass">
                                            <div className="sub-info">
                                                <div className={`status-node ${r.isAvailable ? 'online' : 'busy'}`}></div>
                                                <Bed size={16} className="text-muted" />
                                                <span className="sub-title">Unit {r.roomNumber} - {r.type}</span>
                                                <span className="sub-price">${r.price}</span>
                                            </div>
                                            <button className="btn-tiny-danger" onClick={() => handleDeleteRoom(r._id)}><X size={14} /></button>
                                        </div>
                                    ))}
                                    {h.rooms.length === 0 && <p className="empty-sub">No active units in this property.</p>}
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bookings-stream">
                    {bookings.length > 0 ? bookings.map((b, i) => (
                        <motion.div
                            key={b._id}
                            className="stream-card glass-premium"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="stream-user">
                                <div className="user-avatar glass"><UserIcon size={20} /></div>
                                <div><h4>{b.user?.name}</h4><p>{b.user?.email}</p></div>
                            </div>
                            <div className="stream-property">
                                <Hotel size={20} className="text-gold" />
                                <div><h4>{b.hotel?.name || 'Luxury Stay'}</h4><p>Unit {b.room?.roomNumber} ({b.room?.type})</p></div>
                            </div>
                            <div className="stream-dates">
                                <Calendar size={20} className="text-muted" />
                                <div><h4>{new Date(b.checkInDate).toLocaleDateString()}</h4><p>Duration Secured</p></div>
                            </div>
                            <div className="stream-status">
                                <span className={`status-pill ${b.status.toLowerCase()}`}>{b.status}</span>
                                <div className="stream-actions">
                                    {b.status === 'Pending' && (
                                        <button className="btn-accept" onClick={() => handleConfirmBooking(b._id)} title="Accept Booking">
                                            <CheckCircle size={16} /> Accept
                                        </button>
                                    )}
                                    {b.user?.phone && (
                                        <a href={`https://wa.me/${b.user.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-contact" title={`Call ${b.user.phone}`}>
                                            <Phone size={16} /> Contact
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )) : <div className="empty-stream glass"><h3>No active bookings detected</h3><p>Your property stream is currently empty.</p></div>}
                </div>
            )}

            <style jsx>{`
                .admin-brand { display: flex; align-items: center; gap: 20px; }
                .item-expand { padding: 10px; opacity: 0.5; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
