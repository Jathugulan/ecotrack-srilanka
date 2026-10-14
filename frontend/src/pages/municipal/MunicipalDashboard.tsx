import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Truck,
  ArrowRight,
  TrendingUp,
  MapPin,
  Users,
  Sparkles,
  Building2,
  Shield,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.js';

export const MunicipalDashboard: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/municipal');
      if (res.data.success) {
        setAnalytics(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching municipal analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#138A5B', '#0F766E', '#2879C7', '#B7791F', '#D64545', '#8E44AD'];

  if (loading || !analytics) {
    return (
      <div className="p-12 text-center text-[13px] text-[#8FA196]">
        Loading Municipal Operations Console...
      </div>
    );
  }

  const { kpis, reportsByCategory, reportsByStatus, recentReports } = analytics;

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 text-[#172B23] dark:text-[#F1F7F3] transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF5EE] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] text-[11px] font-bold text-[#138A5B] dark:text-[#43D99A] mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Colombo Municipal Council (CMC) Operations Unit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B23] dark:text-[#F1F7F3] tracking-tight">
            Sanitation Operations Console
          </h1>
          <p className="text-[13px] text-[#46574F] dark:text-[#8FA196] mt-1">
            Real-time complaint triage, compactor vehicle dispatch, and citizen SLA compliance monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/municipal/map"
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#141E19] text-[#138A5B] dark:text-[#43D99A] font-bold text-[12px] border border-[#DFE8E2] dark:border-[#293B31] hover:bg-[#EAF5EE] shadow-xs flex items-center gap-2 transition-all"
          >
            <MapPin className="w-4 h-4" />
            <span>Spatial GIS Map</span>
          </Link>
          <Link
            to="/municipal/complaints"
            className="px-5 py-2.5 rounded-xl bg-[#138A5B] hover:bg-[#0E734A] text-white font-bold text-[12px] shadow-lg shadow-[#138A5B]/25 flex items-center gap-2 transition-all"
          >
            <span>Triage Queue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Grievances */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#8FA196] uppercase tracking-wider">Total Inflow</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#172B23] dark:text-[#F1F7F3] mt-3">{kpis.totalReports}</p>
          <p className="text-[11px] text-[#8FA196] mt-1">Grievances recorded across wards</p>
        </div>

        {/* Pending Review */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#8FA196] uppercase tracking-wider">Pending Triage</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-3">{kpis.submittedReports}</p>
          <p className="text-[11px] text-[#8FA196] mt-1">Requires supervisor review</p>
        </div>

        {/* Resolution Rate */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#8FA196] uppercase tracking-wider">SLA Redressal</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#138A5B] dark:text-[#43D99A] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#138A5B] dark:text-[#43D99A] mt-3">{kpis.resolutionRate}%</p>
          <p className="text-[11px] text-[#8FA196] mt-1">{kpis.resolvedReports} verified cleanups</p>
        </div>

        {/* Crew Fleet Completion */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#8FA196] uppercase tracking-wider">Fleet Efficiency</span>
            <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] dark:bg-[#1B2922] text-[#138A5B] dark:text-[#43D99A] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#138A5B] dark:text-[#43D99A] mt-3">{kpis.taskCompletionRate}%</p>
          <p className="text-[11px] text-[#8FA196] mt-1">Active compactor crews</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Breakdown */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
              Grievances by Waste Category
            </h3>
            <span className="text-[11px] text-[#8FA196]">Source Distribution</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportsByCategory}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#8FA196' }} />
                <YAxis tick={{ fontSize: 10, fill: '#8FA196' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141E19',
                    borderRadius: '12px',
                    border: '1px solid #293B31',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#138A5B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
              Workflow Pipeline Distribution
            </h3>
            <span className="text-[11px] text-[#8FA196]">Current Triage Status</span>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportsByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={50}
                  paddingAngle={3}
                  label={({ name, percent }: any) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {reportsByStatus.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141E19',
                    borderRadius: '12px',
                    border: '1px solid #293B31',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Incoming Queue */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
              Recent Grievances Inflow
            </h3>
            <p className="text-[12px] text-[#8FA196]">Incoming reports requiring route verification</p>
          </div>
          <Link to="/municipal/complaints" className="text-[12px] font-bold text-[#138A5B] dark:text-[#43D99A] hover:underline flex items-center gap-1">
            <span>Manage Full Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#DFE8E2] dark:border-[#293B31] text-[#8FA196] font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">Reference</th>
                <th className="pb-3 px-3">Reporter</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Address</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE8E2] dark:divide-[#293B31]">
              {recentReports.map((r: any) => (
                <tr key={r._id} className="hover:bg-[#F8FAF8] dark:hover:bg-[#1B2922] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#172B23] dark:text-[#F1F7F3]">{r.referenceNumber}</td>
                  <td className="py-3 px-3 text-[#46574F] dark:text-[#C1CEC5]">{r.residentId?.fullName || 'Resident Citizen'}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EAF5EE] dark:bg-[#1B382B] text-[#138A5B] dark:text-[#43D99A]">
                      {r.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#46574F] dark:text-[#8FA196] truncate max-w-xs">{r.address}</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#8FA196]">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
