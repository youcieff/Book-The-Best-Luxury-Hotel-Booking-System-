import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const BackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show back button on Home page
    if (location.pathname === '/') return null;

    return (
        <motion.button
            className="back-button glass"
            onClick={() => navigate(-1)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <ArrowLeft size={18} />
            <span>Go Back</span>
        </motion.button>
    );
};

export default BackButton;
