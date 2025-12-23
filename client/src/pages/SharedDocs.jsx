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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <h1 className="text-3xl font-bold text-slate-800">Shared With Me</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                    <div key={report.id} className="card hover:shadow-xl transition-all">
                        <div className="flex items-center space-x-2 mb-4 text-xs text-slate-500 uppercase tracking-wide font-bold">
                            <User className="h-4 w-4 text-slate-400" />
                            <span>{report.User?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                <FileText className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                                {report.type}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{report.title}</h3>
                        <p className="text-sm text-slate-500 mb-4">{new Date(report.date).toLocaleDateString()}</p>

                        <button onClick={() => handleDownload(report.id)} className="w-full btn-secondary text-sm flex justify-center items-center space-x-2">
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                        </button>
                    </div>
                ))}
                {reports.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-400">
                        No reports shared with you yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SharedDocs;
