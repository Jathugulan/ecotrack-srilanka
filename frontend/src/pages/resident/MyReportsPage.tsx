import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  AlertCircle,
  RefreshCw,
  Eye,
  X,
  Clock,
  CheckCircle2,
  MapPin,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { api } from '../../api/client.js';
import { WasteReport } from '../../types.js';

export const MyReportsPage: React.FC = () => {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Review Request state
  const [reviewModalReport, setReviewModalReport] = useState<WasteReport | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Details Modal
  const [activeReport, setActiveReport] = useState<WasteReport | null>(null);

  useEffect(() => {
    fetchReports();
  }, [statusFilter, categoryFilter, searchTerm]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await api.get('/reports', { params });
      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewRequest = async () => {
    if (!reviewModalReport) return;
    setSubmittingReview(true);
    try {
      const res = await api.post(`/reports/${reviewModalReport._id}/review-request`, {
        notes: reviewNotes,
      });
      if (res.data.success) {
        alert('Review requested. Municipal inspection team notified.');
        setReviewModalReport(null);
        setReviewNotes('');
        fetchReports();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting review request.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/50';
      case 'UNDER_REVIEW':
      case 'ASSIGNED':
      case 'IN_PROGRESS':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/50';
      case 'RESOLVED':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/50';
      case 'REVIEW_REQUESTED':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/50';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200/50';
    }
  };

  const statusTabs = [
    { id: '', label: 'All Reports' },
    { id: 'SUBMITTED', label: 'Submitted' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'RESOLVED', label: 'Resolved' },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-[#172B23] dark:text-[#F1F7F3] transition-colors">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B23] dark:text-[#F1F7F3] tracking-tight">
          My Civic Complaints
        </h1>
        <p className="text-[13px] text-[#46574F] dark:text-[#8FA196] mt-1">
          Monitor cleanup progress, review municipal inspection feedback, and verify photo proof.
        </p>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F0F5F2] dark:bg-[#1B2922] rounded-2xl border border-[#DFE8E2] dark:border-[#293B31] overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-white dark:bg-[#141E19] text-[#138A5B] dark:text-[#43D99A] shadow-xs'
                  : 'text-[#46574F] dark:text-[#C1CEC5] hover:text-[#172B23]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px] max-w-sm">
          <Search className="w-4 h-4 text-[#8FA196] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by reference, street..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-white dark:bg-[#141E19] text-[12px] text-[#172B23] dark:text-[#F1F7F3] placeholder:text-[#8FA196] focus:outline-none focus:ring-2 focus:ring-[#138A5B]"
          />
        </div>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="p-12 text-center text-[13px] text-[#8FA196]">
          Loading civic reports...
        </div>
      ) : reports.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5">
          <FileText className="w-12 h-12 text-[#8FA196] mx-auto mb-3" />
          <h3 className="text-[16px] font-bold text-[#172B23] dark:text-[#F1F7F3]">No complaints found</h3>
          <p className="text-[12px] text-[#46574F] dark:text-[#8FA196] mt-1">Try switching filters or submit a new report.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((report) => (
            <div
              key={report._id}
              className="p-5 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-md hover:border-[#138A5B] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header with image */}
                <div className="relative h-40 rounded-2xl overflow-hidden mb-4 bg-gray-100 dark:bg-[#1B2922]">
                  {report.images && report.images[0] ? (
                    <img
                      src={report.images[0]}
                      alt="Report Evidence"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">
                      No Photo Evidence
                    </div>
                  )}
                  <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold border backdrop-blur-md shadow-xs ${getStatusBadge(report.status)}`}>
                    {report.status.replace('_', ' ')}
                  </span>
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-black/60 text-white backdrop-blur-md font-mono">
                    {report.referenceNumber}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#EAF5EE] dark:bg-[#1B382B] text-[#138A5B] dark:text-[#43D99A]">
                      {report.category}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      {report.severity} Urgency
                    </span>
                  </div>

                  <p className="text-[13px] font-extrabold text-[#172B23] dark:text-[#F1F7F3] line-clamp-1 mt-1">
                    {report.address}
                  </p>

                  <p className="text-[12px] text-[#46574F] dark:text-[#8FA196] line-clamp-2">
                    {report.description}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3.5 border-t border-[#DFE8E2] dark:border-[#293B31] flex items-center justify-between">
                <span className="text-[11px] text-[#8FA196] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                </span>

                <div className="flex items-center gap-2">
                  {report.status === 'RESOLVED' && (
                    <button
                      type="button"
                      onClick={() => setReviewModalReport(report)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                    >
                      Re-Inspect
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveReport(report)}
                    className="p-1.5 rounded-lg hover:bg-[#EAF5EE] text-[#138A5B] dark:text-[#43D99A]"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#8FA196] uppercase tracking-wider">Report Details</span>
                <h3 className="text-[17px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
                  {activeReport.referenceNumber}
                </h3>
              </div>
              <button
                onClick={() => setActiveReport(null)}
                className="p-1 rounded-lg text-[#8FA196] hover:text-[#172B23]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeReport.images && activeReport.images[0] && (
              <img
                src={activeReport.images[0]}
                alt="Evidence"
                className="w-full h-48 rounded-2xl object-cover border border-[#DFE8E2] dark:border-[#293B31]"
              />
            )}

            <div className="space-y-2 text-[12px]">
              <p>
                <strong className="text-[#172B23] dark:text-[#F1F7F3]">Category:</strong> {activeReport.category}
              </p>
              <p>
                <strong className="text-[#172B23] dark:text-[#F1F7F3]">Status:</strong> {activeReport.status}
              </p>
              <p>
                <strong className="text-[#172B23] dark:text-[#F1F7F3]">Location:</strong> {activeReport.address}
              </p>
              <p>
                <strong className="text-[#172B23] dark:text-[#F1F7F3]">Description:</strong> {activeReport.description}
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setActiveReport(null)}
                className="px-5 py-2 rounded-xl bg-[#138A5B] text-white text-[12px] font-bold shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Re-Inspection Modal */}
      {reviewModalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-2xl p-6 space-y-4">
            <h3 className="text-[16px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
              Request Municipal Re-Inspection
            </h3>
            <p className="text-[12px] text-[#46574F] dark:text-[#8FA196]">
              If the reported dump was not fully cleared or litter has recurred, describe the issue for sanitation supervisors.
            </p>
            <textarea
              rows={3}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="e.g. Leftover glass shards still in drainage ditch..."
              className="w-full p-3 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#1B2922] text-[12px] text-[#172B23] dark:text-[#F1F7F3] focus:ring-2 focus:ring-[#138A5B]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReviewModalReport(null)}
                className="px-4 py-2 rounded-xl text-[12px] font-semibold text-[#8FA196]"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewRequest}
                disabled={submittingReview}
                className="px-5 py-2 rounded-xl bg-[#138A5B] text-white text-[12px] font-bold shadow-md"
              >
                {submittingReview ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
