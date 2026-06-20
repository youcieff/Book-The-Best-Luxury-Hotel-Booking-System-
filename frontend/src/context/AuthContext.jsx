import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [loading, setLoading] = useState(false);

    const API_URL = 'http://localhost:5000/api/auth';

    const login = async (email, password) => {
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
        setUser(null);
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
