import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Download, FileText, User } from 'lucide-react';

const SharedDocs = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        fetchSharedReports();
    }, []);

    const fetchSharedReports = async () => {
        try {
            const res = await api.get('/share/shared-with-me');
            setReports(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDownload = async (id) => {
        try {
            const response = await api.get(`/reports/${id}/file`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `shared-report-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            alert('Could not download file');
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Shared With Me</h1>

            <div className="reports-grid">
                {reports.map((report) => (
                    <div key={report.id} className="report-card">
                        <div className="report-owner">
                            <User size={16} />
                            <span>{report.User?.name || 'Unknown'}</span>
                        </div>
                        <div className="report-header">
                            <div className="shared-icon-container">
                                <FileText size={24} />
                            </div>
                            <span className="report-badge">{report.type}</span>
                        </div>
                        <h3 className="report-title">{report.title}</h3>
                        <p className="report-date">{new Date(report.date).toLocaleDateString()}</p>

                        <button onClick={() => handleDownload(report.id)} className="btn-secondary" style={{ width: '100%', fontSize: '0.875rem' }}>
                            <Download size={16} />
                            <span>Download</span>
                        </button>
                    </div>
                ))}
                {reports.length === 0 && (
                    <div className="col-span-full no-records">
                        No reports shared with you yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SharedDocs;
