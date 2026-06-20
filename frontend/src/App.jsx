import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyReservations from './pages/MyReservations';
import HotelRooms from './pages/HotelRooms';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AuthModal from './components/AuthModal';
import BackButton from './components/BackButton';

const AppContent = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    // Initial Auth Gate
    if (!user) {
        return (
            <div className="auth-gate">
                <AuthModal isOpen={true} onClose={() => { }} />
                <Toaster position="bottom-right" />
            </div>
        );
    }

    return (
        <div className="app-container">
            <Navbar onSearch={setSearchQuery} />
            {user.role !== 'admin' && <BackButton />}
            <Routes>
                {user.role === 'admin' ? (
                    <>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="*" element={<Navigate to="/admin" />} />
                    </>
                ) : (
                    <>
                        <Route path="/" element={<Home searchQuery={searchQuery} />} />
                        <Route path="/hotel/:id" element={<HotelRooms />} />
                        <Route path="/my-reservations" element={<MyReservations />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </>
                )}
            </Routes>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: '#161a29',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '15px',
                        padding: '16px'
                    }
                }}
            />
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;
