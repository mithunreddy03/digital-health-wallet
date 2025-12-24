import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Upload, FileText, Download, Share, Users } from 'lucide-react';
import ReportFilters from '../components/ReportFilters';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [shareEmail, setShareEmail] = useState('');
    const [selectedReports, setSelectedReports] = useState([]);
    const [filters, setFilters] = useState({ type: '', startDate: '', endDate: '', search: '' });

    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({ title: '', type: 'Blood Test', date: new Date().toISOString().split('T')[0] });

    useEffect(() => {
        fetchReports();
    }, [filters]);

    const fetchReports = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.type) params.append('type', filters.type);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.search) params.append('search', filters.search);

            const res = await api.get(`/reports?${params.toString()}`);
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
            link.setAttribute('download', `report-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            alert('Could not download file');
        }
    };

    const handleShare = async (e) => {
        e.preventDefault();
        if (selectedReports.length === 0) {
            alert('Please select at least one report to share');
            return;
        }
        try {
            await api.post('/share/grant', { email: shareEmail, reportIds: selectedReports });
            alert(`Successfully shared ${selectedReports.length} report(s)`);
            setIsShareOpen(false);
            setShareEmail('');
            setSelectedReports([]);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to share');
        }
    };

    const toggleReportSelection = (reportId) => {
        setSelectedReports(prev =>
            prev.includes(reportId)
                ? prev.filter(id => id !== reportId)
                : [...prev, reportId]
        );
    };

    const clearFilters = () => {
        setFilters({ type: '', startDate: '', endDate: '', search: '' });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Medical Reports</h1>
                <div className="header-actions">
                    <button onClick={() => setIsShareOpen(true)} className="btn-secondary">
                        <Share size={16} />
                        <span>Share Access</span>
                    </button>
                    <button onClick={() => setIsUploadOpen(true)} className="btn-primary">
                        <Upload size={20} />
                        <span>Upload Report</span>
                    </button>
                </div>
            </div>

            <ReportFilters filters={filters} setFilters={setFilters} onClear={clearFilters} />

            <div className="reports-grid">
                {reports.map((report) => (
                    <div key={report.id} className="report-card">
                        <div className="report-header">
                            <div className="report-icon-container">
                                <FileText size={24} />
                            </div>
                            <span className="report-badge">{report.type}</span>
                        </div>
                        <h3 className="report-title">{report.title}</h3>
                        <p className="report-date">{new Date(report.date).toLocaleDateString()}</p>

                        <button onClick={() => handleView(report.id)} className="btn-secondary" style={{ width: '100%', fontSize: '0.875rem' }}>
                            <Download size={16} />
                            <span>Download</span>
                        </button>
                    </div>
                ))}
                {reports.length === 0 && (
                    <div className="col-span-full no-records">
                        No reports found. {(filters.type || filters.startDate || filters.endDate || filters.search) && 'Try adjusting your filters.'}
                    </div>
                )}
            </div>

            {isUploadOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Upload Report</h2>
                            <p>Upload your medical test reports</p>
                        </div>
                        <form onSubmit={handleUpload}>
                            <div className="form-group">
                                <label className="form-label">File</label>
                                <input type="file" className="input-field" required onChange={e => setFile(e.target.files[0])} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input type="text" className="input-field" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Annual Checkup" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Type</label>
                                <select className="input-field" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    <option>Blood Test</option>
                                    <option>X-Ray</option>
                                    <option>Prescription</option>
                                    <option>MRI</option>
                                    <option>Vaccination</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input type="date" className="input-field" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsUploadOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Upload</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isShareOpen && (
                <div className="modal-overlay">
                    <div className="modal modal-large">
                        <div className="modal-header">
                            <h2>Share Reports</h2>
                            <p>Select specific reports to share with a family member or doctor</p>
                        </div>
                        <form onSubmit={handleShare}>
                            <div className="form-group">
                                <label className="form-label">User Email</label>
                                <input type="email" className="input-field" required value={shareEmail} onChange={e => setShareEmail(e.target.value)} placeholder="doctor@example.com" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <Users size={16} />
                                    Select Reports to Share ({selectedReports.length} selected)
                                </label>
                                <div className="report-selection-list">
                                    {reports.length === 0 ? (
                                        <p className="no-records">No reports available to share</p>
                                    ) : (
                                        reports.map(report => (
                                            <label key={report.id} className="report-checkbox-item">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedReports.includes(report.id)}
                                                    onChange={() => toggleReportSelection(report.id)}
                                                />
                                                <div className="report-checkbox-content">
                                                    <div className="report-checkbox-title">{report.title}</div>
                                                    <div className="report-checkbox-meta">
                                                        <span className="report-badge-small">{report.type}</span>
                                                        <span>{new Date(report.date).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => { setIsShareOpen(false); setSelectedReports([]); }} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary" disabled={selectedReports.length === 0}>
                                    Share {selectedReports.length > 0 && `(${selectedReports.length})`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
