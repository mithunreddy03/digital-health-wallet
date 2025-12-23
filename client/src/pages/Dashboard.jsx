import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus } from 'lucide-react';

const Dashboard = () => {
    const [vitals, setVitals] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newVital, setNewVital] = useState({ type: 'HeartRate', value: '', unit: 'bpm', date: new Date().toISOString().split('T')[0] });

    useEffect(() => {
        fetchVitals();
    }, []);

    const fetchVitals = async () => {
        try {
            const res = await api.get('/vitals');
            setVitals(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/vitals', newVital);
            setIsModalOpen(false);
            setNewVital({ ...newVital, value: '' });
            fetchVitals();
        } catch (err) {
            alert('Failed to add vital');
        }
    };

    const chartData = vitals
        .filter(v => v.type === 'HeartRate')
        .map(v => ({
            date: new Date(v.date).toLocaleDateString(),
            value: parseInt(v.value)
        }));

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="dashboard-title-section">
                    <h1>My Health</h1>
                    <p>Monitor your vital signs and health trends</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                    <Plus size={20} />
                    <span>Add Vitals</span>
                </button>
            </div>

            <div className="dashboard-grid">
                <div className="card chart-card">
                    <div className="card-header">
                        <h3 className="card-title">
                            <div className="title-indicator"></div>
                            Heart Rate Trends
                        </h3>
                        <div className="card-badge">Last 30 Days</div>
                    </div>
                    <div style={{ height: '320px', width: '100%' }}>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)',
                                            padding: '12px'
                                        }}
                                        itemStyle={{ color: '#10b981', fontWeight: 600 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#059669' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <Plus size={32} color="#cbd5e1" />
                                </div>
                                <span>No data available yet</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-title">
                        <div className="title-indicator title-indicator-secondary"></div>
                        Recent Readings
                    </h3>
                    <div style={{ marginTop: '1.5rem' }}>
                        {vitals.length === 0 ? (
                            <p className="no-records">No records yet.</p>
                        ) : (
                            vitals.slice(-5).reverse().map((vital) => (
                                <div key={vital.id} className="vital-item">
                                    <div className="vital-info">
                                        <span className="vital-type">{vital.type}</span>
                                        <span className="vital-date">{new Date(vital.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="vital-value-container">
                                        <span className="vital-value">{vital.value}</span>
                                        <span className="vital-unit">{vital.unit}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Add New Vitals</h2>
                            <p>Record your latest health measurements</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Vital Type</label>
                                <select
                                    className="input-field"
                                    value={newVital.type}
                                    onChange={e => setNewVital({ ...newVital, type: e.target.value })}
                                >
                                    <option value="HeartRate">Heart Rate</option>
                                    <option value="BP">Blood Pressure</option>
                                    <option value="Sugar">Blood Glucose</option>
                                    <option value="Weight">Weight</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Value</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        required
                                        value={newVital.value}
                                        onChange={e => setNewVital({ ...newVital, value: e.target.value })}
                                        placeholder="e.g. 72"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Unit</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        required
                                        value={newVital.unit}
                                        onChange={e => setNewVital({ ...newVital, unit: e.target.value })}
                                        placeholder="e.g. bpm"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    required
                                    value={newVital.date}
                                    onChange={e => setNewVital({ ...newVital, date: e.target.value })}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Save Vital
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
