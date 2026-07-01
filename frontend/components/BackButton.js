import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
    const router = useRouter();
    return (
        <button className="back-button glass" onClick={() => router.back()}>
            <ArrowLeft size={18} /> Back
        </button>
    );
};

export default BackButton;
