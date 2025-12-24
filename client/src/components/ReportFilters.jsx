import React from 'react';
import { Search, X, Filter } from 'lucide-react';

const ReportFilters = ({ filters, setFilters, onClear }) => {
    const reportTypes = ['Blood Test', 'X-Ray', 'Prescription', 'MRI', 'Vaccination'];

    return (
        <div className="filters-container">
            <div className="filters-header">
                <div className="filters-title">
                    <Filter size={18} />
                    <span>Filter Reports</span>
                </div>
                {(filters.type || filters.startDate || filters.endDate || filters.search) && (
                    <button onClick={onClear} className="btn-text">
                        <X size={16} />
                        Clear All
                    </button>
                )}
            </div>

            <div className="filters-grid">
                <div className="filter-group">
                    <label className="filter-label">
                        <Search size={14} />
                        Search Title
                    </label>
                    <input
                        type="text"
                        className="filter-input"
                        placeholder="Search reports..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>

                <div className="filter-group">
                    <label className="filter-label">Report Type</label>
                    <select
                        className="filter-input"
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    >
                        <option value="">All Types</option>
                        {reportTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Start Date</label>
                    <input
                        type="date"
                        className="filter-input"
                        value={filters.startDate}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    />
                </div>

                <div className="filter-group">
                    <label className="filter-label">End Date</label>
                    <input
                        type="date"
                        className="filter-input"
                        value={filters.endDate}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReportFilters;
