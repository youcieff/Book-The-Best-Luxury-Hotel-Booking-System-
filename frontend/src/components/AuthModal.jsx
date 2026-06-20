import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, Phone, Hotel } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: 'user' });
    const { login, register, loading } = useAuth();

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (mode === 'register' && formData.name.length < 3) {
            toast.error('Name must be at least 3 characters long');
            return false;
        }
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        let success = false;
        if (mode === 'login') {
            success = await login(formData.email, formData.password);
        } else {
            success = await register(formData);
        }
        if (success) onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay">
                    <motion.div
                        className="modal-container glass"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    >
                        <div className="auth-branding">
                            <div className="logo-icon large">
                                <Hotel size={40} />
                            </div>
                            <h1>Book The Best</h1>
                        </div>

                        <h2>{mode === 'login' ? 'Welcome Back' : 'Join Us'}</h2>
                        <p className="subtitle">
                            {mode === 'login' ? 'Sign in to access your premium bookings' : 'Create an account to start booking the world\'s finest hotels'}
                        </p>

                        <form onSubmit={handleSubmit}>
                            {mode === 'register' && (
                                <>
                                    <div className="input-group">
                                        <UserIcon className="input-icon" size={18} />
                                        <input
                                            type="text"
                                            placeholder="User Name"
                                            required
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <Phone className="input-icon" size={18} />
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            required
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}
                            <div className="input-group">
                                <Mail className="input-icon" size={18} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                                {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Join Now')}
                            </button>
                        </form>

                        <div className="switcher">
                            {mode === 'login' ? (
                                <p>New here? <button onClick={() => setMode('register')}>Create account</button></p>
                            ) : (
                                <p>Already have an account? <button onClick={() => setMode('login')}>Sign in</button></p>
                            )}
                        </div>
                    </motion.div>


                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
