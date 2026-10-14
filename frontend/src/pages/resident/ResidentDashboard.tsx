import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  Gift,
  PlusCircle,
  ArrowRight,
  MapPin,
  Calendar,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
} from 'lucide-react';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.js';
import { WasteReport } from '../../types.js';

export const ResidentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSubmitted: 0,
    resolvedCount: 0,
    activeCount: 0,
    rewardPoints: 0,
  });
  const [recentReports, setRecentReports] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, reportsRes] = await Promise.all([
        api.get('/analytics/resident'),
        api.get('/reports?limit=5'),
      ]);

      if (analyticsRes.data.success) {
        setStats(analyticsRes.data.data);
      }
      if (reportsRes.data.success) {
        setRecentReports(reportsRes.data.data);
      }
    } catch (err) {
      console.error('Error loading resident dashboard:', err);
    } finally {
      setLoading(false);
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

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 text-[#172B23] dark:text-[#F1F7F3] transition-colors">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#138A5B] via-[#0E734A] to-[#0F766E] text-white shadow-xl shadow-[#138A5B]/15 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B8F34A]" />
            <span>Civic Waste Portal • Colombo Ward</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ayubowan, {user?.fullName.split(' ')[0]}! 🌿
          </h1>
          <p className="text-[13px] text-emerald-100/90 mt-1 max-w-xl leading-relaxed">
            Track community cleanup reports, monitor curbside pickup schedules, and earn verified circular rewards.
          </p>
        </div>

        <Link
          to="/resident/report-waste"
          className="relative px-5 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-[#138A5B] font-bold text-[13px] shadow-lg shadow-black/10 flex items-center gap-2 transition-all hover:scale-[1.02] shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#138A5B]" />
          <span>Report Waste (AI)</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#138A5B]" />
        </Link>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Logged */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 hover:border-[#138A5B] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#8FA196] uppercase tracking-wider">Total Reports</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#172B23] dark:text-[#F1F7F3] mt-3">{stats.totalSubmitted}</p>
          <p className="text-[11px] text-[#8FA196] mt-1">Lifetime complaints lodged</p>
        </div>

        {/* In Progress */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 hover:border-amber-500 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#8FA196] uppercase tracking-wider">In Triage</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#172B23] dark:text-[#F1F7F3] mt-3">{stats.activeCount}</p>
          <p className="text-[11px] text-[#8FA196] mt-1">Under municipal investigation</p>
        </div>

        {/* Resolved */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 hover:border-emerald-500 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#8FA196] uppercase tracking-wider">Resolved</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#138A5B] dark:text-[#43D99A] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#172B23] dark:text-[#F1F7F3] mt-3">{stats.resolvedCount}</p>
          <p className="text-[11px] text-[#8FA196] mt-1">Cleaned with photo proof</p>
        </div>

        {/* Green Points */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 hover:border-[#138A5B] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#8FA196] uppercase tracking-wider">Green Points</span>
            <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] dark:bg-[#1B2922] text-[#138A5B] dark:text-[#43D99A] flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#138A5B] dark:text-[#43D99A] mt-3">{stats.rewardPoints} <span className="text-sm font-semibold text-[#8FA196]">pts</span></p>
          <p className="text-[11px] text-[#8FA196] mt-1">Circular recycling balance</p>
        </div>
      </div>

      {/* Split Section: Recent Reports & Schedule Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Reports List */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[17px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
                Recent Reports History
              </h2>
              <p className="text-[12px] text-[#8FA196]">Real-time tracking of reported dumping locations</p>
            </div>
            <Link
              to="/resident/reports"
              className="text-[12px] font-bold text-[#138A5B] dark:text-[#43D99A] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recentReports.length === 0 ? (
            <div className="p-10 text-center border-2 border-dashed border-[#DFE8E2] dark:border-[#293B31] rounded-2xl">
              <p className="text-[13px] text-[#8FA196]">No waste complaints recorded yet.</p>
              <Link
                to="/resident/report-waste"
                className="mt-2 inline-block text-[13px] font-bold text-[#138A5B] dark:text-[#43D99A] hover:underline"
              >
                Submit your first report &rarr;
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report._id}
                  className="p-4 rounded-2xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#1B2922] flex items-center justify-between gap-4 hover:border-[#138A5B] transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {report.images && report.images[0] ? (
                      <img
                        src={report.images[0]}
                        alt="Evidence"
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#DFE8E2] dark:border-[#293B31]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#138A5B] to-[#0F766E] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                        ET
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
                          {report.referenceNumber}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#EAF5EE] dark:bg-[#17251F] text-[#138A5B] dark:text-[#43D99A] font-bold">
                          {report.category}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#46574F] dark:text-[#8FA196] truncate max-w-sm mt-0.5">
                        {report.address}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(report.status)}`}>
                      {report.status.replace('_', ' ')}
                    </span>
                    <p className="text-[10px] text-[#8FA196] mt-1">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Curbside Schedule & Rewards Highlights */}
        <div className="lg:col-span-4 space-y-6">
          {/* Curbside Schedule Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 space-y-4">
            <h3 className="text-[15px] font-extrabold text-[#172B23] dark:text-[#F1F7F3] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#138A5B] dark:text-[#43D99A]" />
              <span>Upcoming Curbside Pickup</span>
            </h3>

            <div className="space-y-3 text-[12px]">
              <div className="p-3.5 rounded-2xl bg-[#F0F8F3] dark:bg-[#18281F] border border-emerald-200/50 dark:border-emerald-900/40">
                <p className="font-bold text-[#138A5B] dark:text-[#43D99A]">Organic & Kitchen Refuse</p>
                <p className="text-[11px] text-[#46574F] dark:text-[#8FA196] mt-0.5">
                  Monday, Wednesday, Friday • 06:30 - 10:30 AM
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EFF6FF] dark:bg-[#18253A] border border-blue-200/50 dark:border-blue-900/40">
                <p className="font-bold text-blue-700 dark:text-blue-400">Dry Recyclables (Plastic, Paper)</p>
                <p className="text-[11px] text-[#46574F] dark:text-[#8FA196] mt-0.5">
                  Tuesday, Thursday, Saturday • 08:00 - 12:00 PM
                </p>
              </div>
            </div>

            <Link
              to="/resident/calendar"
              className="block text-center py-2 text-[12px] font-bold text-[#138A5B] dark:text-[#43D99A] hover:underline"
            >
              View Full Ward Schedule &rarr;
            </Link>
          </div>

          {/* Gamified Rewards Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#138A5B] to-[#0F766E] text-white shadow-xl shadow-[#138A5B]/15 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#B8F34A]" />
                Eco-Citizen Tier 2
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                Active
              </span>
            </div>
            <h4 className="text-[16px] font-extrabold text-white mt-1">
              Recycle & Redeem Vouchers
            </h4>
            <p className="text-[12px] text-emerald-100/90 mt-1 leading-relaxed">
              Earn Green Points when you take verified plastic bottles to accredited partner centers.
            </p>
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
              <Link
                to="/resident/rewards"
                className="text-[12px] font-bold text-[#B8F34A] hover:underline"
              >
                View Rewards Ledger &rarr;
              </Link>
              <Link
                to="/recycling-locator"
                className="px-3 py-1.5 rounded-xl bg-white text-[#138A5B] font-bold text-[11px] shadow-sm"
              >
                Find Depot
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
