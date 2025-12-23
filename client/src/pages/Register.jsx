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
        <div className="auth-container">
            <div className="auth-visual">
                <div className="auth-gradient"></div>
                <div className="auth-visual-content">
                    <h1>Join HealthWallet</h1>
                    <p>Start your journey to better health management today. Safe, secure, and simple.</p>
                </div>
            </div>

            <div className="auth-form-container">
                <div className="auth-blob auth-blob-bottom"></div>

                <div className="auth-form-wrapper">
                    <div>
                        <h2>Create account</h2>
                        <p>
                            Already have an account?{' '}
                            <Link to="/login">Sign in</Link>
                        </p>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        {error && (
                            <div className="error-message">
                                <div className="error-dot"></div>
                                {error}
                            </div>
                        )}
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
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
                                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                                    Sign up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
