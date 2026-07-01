import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const DEMO_USER = {
    _id: 'demo_user_001',
    name: 'Guest User',
    email: 'guest@bookthebest.com',
    role: 'user',
    phone: '+20 100 000 0000',
    token: 'demo_token_xyz'
};

export const AuthProvider = ({ children }) => {
    const isDemo = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isDemo) {
            setUser(DEMO_USER);
        } else {
            const stored = localStorage.getItem('user');
            if (stored) setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, [isDemo]);
    const API_URL = 'http://localhost:5000/api/auth';

    const login = async (email, password) => {
        if (isDemo) {
            setUser(DEMO_USER);
            toast.success(`Welcome back, ${DEMO_USER.name}!`);
            return true;
        }
        setLoading(true);
        try {
            const { data } = await axios.post(`${API_URL}/login`, { email, password });
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            toast.success(`Welcome back, ${data.name}!`);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        if (isDemo) {
            setUser(DEMO_USER);
            toast.success('Account created successfully!');
            return true;
        }
        setLoading(true);
        try {
            const { data } = await axios.post(`${API_URL}/register`, userData);
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            toast.success('Account created successfully!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        if (isDemo) {
            setUser(null);
            toast.success('Logged out successfully');
            setTimeout(() => setUser(DEMO_USER), 1500);
            return;
        }
        setUser(null);
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, isDemo }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
