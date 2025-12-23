import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, FileText, Share2, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (

        <nav className="fixed top-0 w-full z-50 glass-panel border-b-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2.5 text-primary hover:text-primaryDark transition-all duration-300 group">
                            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-all duration-300">
                                <Heart className="h-6 w-6 fill-primary/20" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">Health<span className="text-primary">Wallet</span></span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Link to="/" className="flex items-center space-x-2 text-slate-600 hover:text-primary hover:bg-slate-50 px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm">
                            <Heart className="h-4 w-4" />
                            <span>Vitals</span>
                        </Link>
                        <Link to="/reports" className="flex items-center space-x-2 text-slate-600 hover:text-primary hover:bg-slate-50 px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm">
                            <FileText className="h-4 w-4" />
                            <span>Reports</span>
                        </Link>
                        <Link to="/shared" className="flex items-center space-x-2 text-slate-600 hover:text-primary hover:bg-slate-50 px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm">
                            <Share2 className="h-4 w-4" />
                            <span>Shared</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleLogout}
                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 p-2.5 rounded-xl"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
