import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Check,
  X,
  Truck,
  Eye,
  AlertCircle,
  Building2,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { api } from '../../api/client.js';
import { WasteReport } from '../../types.js';

export const ComplaintsManagementPage: React.FC = () => {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Dispatch Task Modal State
  const [dispatchModalReport, setDispatchModalReport] = useState<WasteReport | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [taskPriority, setTaskPriority] = useState('HIGH');
  const [dispatching, setDispatching] = useState(false);

  useEffect(() => {
    fetchReports();
    fetchVehicles();
  }, [statusFilter, searchTerm]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
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

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicles');
      if (res.data.success) {
        setVehicles(res.data.data);
        if (res.data.data.length > 0) setSelectedVehicle(res.data.data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    }
  };

  const handleUpdateStatus = async (reportId: string, newStatus: string, notes = '') => {
    try {
      const res = await api.patch(`/reports/${reportId}/status`, {
        status: newStatus,
        notes: notes || `Status updated to ${newStatus} by Municipal Officer`,
      });
      if (res.data.success) {
        fetchReports();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating status.');
    }
  };

  const handleDispatchTask = async () => {
    if (!dispatchModalReport || !selectedVehicle) return;
    setDispatching(true);

    try {
      const res = await api.post('/collection-tasks', {
        reportId: dispatchModalReport._id,
        vehicleId: selectedVehicle,
        priority: taskPriority,
        specialInstructions: `Curbside clear requested by CMC Officer for ${dispatchModalReport.category}`,
      });

      if (res.data.success) {
        alert('Compactor truck route task successfully dispatched!');
        setDispatchModalReport(null);
        fetchReports();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error dispatching collection vehicle.');
    } finally {
      setDispatching(false);
    }
  };

  const statusTabs = [
    { id: '', label: 'All Grievances' },
    { id: 'SUBMITTED', label: 'Pending Triage' },
    { id: 'UNDER_REVIEW', label: 'Under Review' },
    { id: 'ASSIGNED', label: 'Fleet Dispatched' },
    { id: 'RESOLVED', label: 'Resolved' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
      case 'UNDER_REVIEW':
      case 'IN_PROGRESS':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
      case 'ASSIGNED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300';
      case 'RESOLVED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-[#172B23] dark:text-[#F1F7F3] transition-colors">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF5EE] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] text-[11px] font-bold text-[#138A5B] dark:text-[#43D99A] mb-2">
          <Building2 className="w-3.5 h-3.5" />
          <span>Municipal Sanitation Division</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B23] dark:text-[#F1F7F3] tracking-tight">
          Citizen Complaint Triage & Dispatch
        </h1>
        <p className="text-[13px] text-[#46574F] dark:text-[#8FA196] mt-1">
          Review reported waste incidents, verify photographic evidence, and dispatch compactor route crews.
        </p>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-[#F0F5F2] dark:bg-[#1B2922] rounded-2xl border border-[#DFE8E2] dark:border-[#293B31] overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-white dark:bg-[#141E19] text-[#138A5B] dark:text-[#43D99A] shadow-xs'
                  : 'text-[#46574F] dark:text-[#C1CEC5] hover:text-[#172B23]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px] max-w-sm">
          <Search className="w-4 h-4 text-[#8FA196] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ref, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-white dark:bg-[#141E19] text-[12px] text-[#172B23] dark:text-[#F1F7F3] placeholder:text-[#8FA196] focus:ring-2 focus:ring-[#138A5B]"
          />
        </div>
      </div>

      {/* Triage Grid */}
      {loading ? (
        <div className="p-12 text-center text-[13px] text-[#8FA196]">
          Loading triage queue...
        </div>
      ) : reports.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31]">
          <ShieldCheck className="w-12 h-12 text-[#138A5B] mx-auto mb-2" />
          <h3 className="text-[16px] font-bold text-[#172B23] dark:text-[#F1F7F3]">All caught up!</h3>
          <p className="text-[12px] text-[#8FA196] mt-1">No pending citizen grievances match this status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((report) => (
            <div
              key={report._id}
              className="p-5 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-md hover:border-[#138A5B] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-mono font-bold text-[#172B23] dark:text-[#F1F7F3]">
                    {report.referenceNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(report.status)}`}>
                    {report.status.replace('_', ' ')}
                  </span>
                </div>

                {report.images && report.images[0] && (
                  <img
                    src={report.images[0]}
                    alt="Evidence"
                    className="w-full h-36 rounded-2xl object-cover border border-[#DFE8E2] dark:border-[#293B31]"
                  />
                )}

                <div className="space-y-1 text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EAF5EE] dark:bg-[#18281F] text-[#138A5B] dark:text-[#43D99A]">
                      {report.category}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      {report.severity} Priority
                    </span>
                  </div>

                  <p className="text-[13px] font-bold text-[#172B23] dark:text-[#F1F7F3] line-clamp-1">
                    {report.address}
                  </p>

                  <p className="text-[12px] text-[#46574F] dark:text-[#8FA196] line-clamp-2">
                    {report.description}
                  </p>
                </div>
              </div>

              {/* Triage Actions */}
              <div className="mt-4 pt-3 border-t border-[#DFE8E2] dark:border-[#293B31] flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#8FA196]">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1.5">
                  {report.status === 'SUBMITTED' && (
                    <button
                      onClick={() => handleUpdateStatus(report._id, 'UNDER_REVIEW')}
                      className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-bold hover:bg-amber-100"
                    >
                      Acknowledge
                    </button>
                  )}

                  {report.status !== 'ASSIGNED' && report.status !== 'RESOLVED' && (
                    <button
                      onClick={() => setDispatchModalReport(report)}
                      className="px-3 py-1 rounded-xl bg-[#138A5B] text-white text-[11px] font-bold shadow-xs hover:bg-[#0E734A] flex items-center gap-1"
                    >
                      <Truck className="w-3 h-3" />
                      <span>Dispatch</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dispatch Vehicle Modal */}
      {dispatchModalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-2xl p-6 space-y-4">
            <h3 className="text-[16px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
              Dispatch Municipal Compactor Vehicle
            </h3>
            <p className="text-[12px] text-[#46574F] dark:text-[#8FA196]">
              Assign waypoint for {dispatchModalReport.referenceNumber} ({dispatchModalReport.address})
            </p>

            <div>
              <label className="block text-[11px] font-bold text-[#8FA196] uppercase mb-1">Select Fleet Unit</label>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#1B2922] text-[12px] font-semibold"
              >
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.plateNumber} ({v.model} • {v.capacityTons}t)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#8FA196] uppercase mb-1">Route Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#1B2922] text-[12px] font-semibold"
              >
                <option value="CRITICAL">Critical Priority (Immediate)</option>
                <option value="HIGH">High Priority (Within 4 Hours)</option>
                <option value="MEDIUM">Medium Priority (Same Day)</option>
                <option value="LOW">Low Priority (Next Scheduled Route)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDispatchModalReport(null)}
                className="px-4 py-2 rounded-xl text-[12px] font-semibold text-[#8FA196]"
              >
                Cancel
              </button>
              <button
                onClick={handleDispatchTask}
                disabled={dispatching}
                className="px-5 py-2 rounded-xl bg-[#138A5B] text-white text-[12px] font-bold shadow-md"
              >
                {dispatching ? 'Assigning...' : 'Confirm Dispatch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
