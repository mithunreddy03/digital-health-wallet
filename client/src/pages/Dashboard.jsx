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

    // Filter mainly for Heart Rate for demo chart, or map complex data
    // Assuming 'HeartRate' for chart mainly
    const chartData = vitals
        .filter(v => v.type === 'HeartRate')
        .map(v => ({
            date: new Date(v.date).toLocaleDateString(),
            value: parseInt(v.value)
        }));

    return (

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 mt-16">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Health</h1>
                    <p className="text-slate-500 mt-1">Monitor your vital signs and health trends</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Add Vitlas</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section - Takes up 2 columns */}
                <div className="card lg:col-span-2 min-h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center">
                            <div className="w-2 h-6 bg-primary rounded-full mr-3"></div>
                            Heart Rate Trends
                        </h3>
                        <div className="text-sm text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-lg">Last 30 Days</div>
                    </div>
                    <div className="h-80 w-full">
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
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                                <div className="p-4 bg-slate-50 rounded-full">
                                    <Plus className="h-8 w-8 text-slate-300" />
                                </div>
                                <span>No data available yet</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Readings Section */}
                <div className="card h-full">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <div className="w-2 h-6 bg-secondary rounded-full mr-3"></div>
                        Recent Readings
                    </h3>
                    <div className="overflow-hidden">
                        <div className="space-y-4">
                            {vitals.length === 0 ? (
                                <p className="text-center text-slate-400 py-10">No records yet.</p>
                            ) : (
                                vitals.slice(-5).reverse().map((vital) => (
                                    <div key={vital.id} className="group flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm transition-all duration-200">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-700">{vital.type}</span>
                                            <span className="text-xs text-slate-400 font-medium">{new Date(vital.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-baseline space-x-1">
                                            <span className="text-lg font-bold text-primaryDark">{vital.value}</span>
                                            <span className="text-xs text-slate-500 font-medium">{vital.unit}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300 scale-100">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Add New Vitals</h2>
                            <p className="text-slate-500 text-sm mt-1">Record your latest health measurements</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Vital Type</label>
                                <div className="relative">
                                    <select
                                        className="input-field appearance-none"
                                        value={newVital.type}
                                        onChange={e => setNewVital({ ...newVital, type: e.target.value })}
                                    >
                                        <option value="HeartRate">Heart Rate</option>
                                        <option value="BP">Blood Pressure</option>
                                        <option value="Sugar">Blood Glucose</option>
                                        <option value="Weight">Weight</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Value</label>
                                    <input type="text" className="input-field" required value={newVital.value} onChange={e => setNewVital({ ...newVital, value: e.target.value })} placeholder="e.g. 72" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Unit</label>
                                    <input type="text" className="input-field" required value={newVital.unit} onChange={e => setNewVital({ ...newVital, unit: e.target.value })} placeholder="e.g. bpm" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date</label>
                                <input type="date" className="input-field" required value={newVital.date} onChange={e => setNewVital({ ...newVital, date: e.target.value })} />
                            </div>

                            <div className="flex space-x-3 mt-8 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary text-center justify-center">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary text-center justify-center shadow-lg shadow-emerald-500/20">Save Vital</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
