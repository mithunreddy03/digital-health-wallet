import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-primary/30 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="relative z-20 p-12 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Join HealthWallet</h1>
                    <p className="text-lg text-slate-300 max-w-md mx-auto">Start your journey to better health management today. Safe, secure, and simple.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative">
                <div className="absolute bottom-0 left-0 p-8">
                    <div className="h-32 w-32 bg-secondary/10 rounded-full blur-3xl absolute -ml-16 -mb-16 pointer-events-none"></div>
                </div>

                <div className="mx-auto w-full max-w-sm lg:w-96 relative z-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create account</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-secondary hover:text-teal-600 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        <div className="mt-6">
                            {error && (
                                <div className="mb-4 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div>
                                    {error}
                                </div>
                            )}
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input-field"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-field"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-field"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div>
                                    <button type="submit" className="w-full btn-primary flex justify-center py-3 bg-gradient-to-r from-secondary to-teal-600 hover:shadow-teal-500/30">
                                        Sign up
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Register;
