import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, FileText, Share2, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-logo">
                        <Heart size={24} />
                    </div>
                    <span className="navbar-title">
                        Health<span className="navbar-title-accent">Wallet</span>
                    </span>
                </Link>

                <div className="navbar-links">
                    <Link to="/" className="navbar-link">
                        <Heart size={16} />
                        <span>Vitals</span>
                    </Link>
                    <Link to="/reports" className="navbar-link">
                        <FileText size={16} />
                        <span>Reports</span>
                    </Link>
                    <Link to="/shared" className="navbar-link">
                        <Share2 size={16} />
                        <span>Shared</span>
                    </Link>
                </div>

                <div className="navbar-actions">
                    <button onClick={handleLogout} className="logout-btn" title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
