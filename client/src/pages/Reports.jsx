import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Upload, FileText, Download, Share } from 'lucide-react';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [shareEmail, setShareEmail] = useState('');

    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({ title: '', type: 'Blood Test', date: new Date().toISOString().split('T')[0] });

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await api.get('/reports');
            setReports(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('file', file);
        data.append('title', formData.title);
        data.append('type', formData.type);
        data.append('date', formData.date);

        try {
            await api.post('/reports', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsUploadOpen(false);
            setFile(null);
            setFormData({ title: '', type: 'Blood Test', date: new Date().toISOString().split('T')[0] });
            fetchReports();
        } catch (err) {
            alert('Upload failed');
        }
    };

    const handleView = async (id) => {
        try {
            const response = await api.get(`/reports/${id}/file`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report-${id}.pdf`); // Default to pdf or check mime
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            alert('Could not download file');
        }
    };

    const handleShare = async (e) => {
        e.preventDefault();
        try {
            await api.post('/share/grant', { email: shareEmail });
            alert('Access granted successfully');
            setIsShareOpen(false);
            setShareEmail('');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to share');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Medical Reports</h1>
                <div className="flex space-x-3">
                    <button onClick={() => setIsShareOpen(true)} className="btn-secondary flex items-center space-x-2">
                        <Share className="h-4 w-4" />
                        <span>Share Access</span>
                    </button>
                    <button onClick={() => setIsUploadOpen(true)} className="btn-primary flex items-center space-x-2">
                        <Upload className="h-5 w-5" />
                        <span>Upload Report</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                    <div key={report.id} className="card hover:shadow-xl transition-all cursor-pointer group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-sky-50 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                <FileText className="h-6 w-6 text-primary group-hover:text-white" />
                            </div>
                            <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                                {report.type}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{report.title}</h3>
                        <p className="text-sm text-slate-500 mb-4">{new Date(report.date).toLocaleDateString()}</p>

                        <button onClick={() => handleView(report.id)} className="w-full btn-secondary text-sm flex justify-center items-center space-x-2">
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                        </button>
                    </div>
                ))}
                {reports.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-400">
                        No reports uploaded yet.
                    </div>
                )}
            </div>

            {isUploadOpen && (
                <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4 text-slate-800">Upload Report</h2>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">File</label>
                                <input type="file" className="input-field mt-1" required onChange={e => setFile(e.target.files[0])} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Title</label>
                                <input type="text" className="input-field mt-1" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Annual Checkup" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Type</label>
                                <select className="input-field mt-1" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    <option>Blood Test</option>
                                    <option>X-Ray</option>
                                    <option>Prescription</option>
                                    <option>MRI</option>
                                    <option>Vaccination</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Date</label>
                                <input type="date" className="input-field mt-1" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setIsUploadOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Upload</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isShareOpen && (
                <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4 text-slate-800">Share Access</h2>
                        <p className="text-sm text-slate-500 mb-4">Grant read-only access to your reports to a family member or doctor.</p>
                        <form onSubmit={handleShare} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">User Email</label>
                                <input type="email" className="input-field mt-1" required value={shareEmail} onChange={e => setShareEmail(e.target.value)} placeholder="doctor@example.com" />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setIsShareOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Share</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
