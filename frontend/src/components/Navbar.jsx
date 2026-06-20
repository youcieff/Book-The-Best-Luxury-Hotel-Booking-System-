import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User as UserIcon, Menu, X, Hotel, Calendar, LayoutDashboard, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onAuthClick, onSearch }) => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar glass-premium full-width">
            <div className="nav-container full-width">
                <Link to="/" className="logo">
                    <div className="logo-icon">
                        <Hotel size={24} />
                    </div>
                    <span>Book The Best</span>
                </Link>

                <div className="nav-center">
                    {location.pathname === '/' && onSearch && (
                        <div className="nav-search glass">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Find your next escape..."
                                onChange={(e) => onSearch(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* Desktop Nav */}
                <div className="nav-links desktop">
                    {user ? (
                        <>
                            {user.role === 'user' && (
                                <>
                                    <Link to="/">Home</Link>
                                    <Link to="/my-reservations" className="nav-item">
                                        <Calendar size={18} /> My Reservations
                                    </Link>
                                </>
                            )}

                            {user.role === 'admin' && (
                                <Link to="/admin" className="nav-item admin-link">
                                    <LayoutDashboard size={18} /> Admin Panel
                                </Link>
                            )}

                            <div className="user-menu glass">
                                <span className="user-name">
                                    <UserIcon size={16} /> {user.name}
                                </span>
                                <button onClick={handleLogout} className="btn-logout" title="Logout">
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <button onClick={onAuthClick} className="btn btn-primary">
                            Sign In
                        </button>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="mobile-menu glass"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {user ? (
                            <div className="mobile-links">
                                {user.role === 'user' && (
                                    <>
                                        <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                                        <Link to="/my-reservations" onClick={() => setIsMenuOpen(false)}>My Reservations</Link>
                                    </>
                                )}
                                {user.role === 'admin' && (
                                    <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
                                )}
                                <button onClick={handleLogout} className="btn btn-outline full-width">Logout</button>
                            </div>
                        ) : (
                            <button onClick={() => { onAuthClick(); setIsMenuOpen(false); }} className="btn btn-primary full-width">Sign In</button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>


        </nav>
    );
};

export default Navbar;
