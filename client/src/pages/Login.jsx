import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-visual">
                <div className="auth-gradient"></div>
                <div className="auth-visual-content">
                    <h1>Your Health, Reimagined</h1>
                    <p>Manage all your health records, vitals, and reports in one secure, digital wallet.</p>
                </div>
            </div>

            <div className="auth-form-container">
                <div className="auth-blob auth-blob-top"></div>

                <div className="auth-form-wrapper">
                    <div>
                        <h2>Welcome back</h2>
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register">Create a new account</Link>
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
                                    Sign in
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
