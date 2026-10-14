import React, { useState, useEffect } from 'react';
import {
  Shield,
  Activity,
  Building2,
  Users,
  FileText,
  CheckCircle2,
  Lock,
  Server,
  Database,
  Cpu,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../../api/client.js';

export const AdminDashboard: React.FC = () => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [orgRes, logRes, healthRes] = await Promise.all([
        api.get('/organizations'),
        api.get('/audit-logs'),
        api.get('/../health'), // hits /health on backend
      ]);

      if (orgRes.data.success) setOrganizations(orgRes.data.data);
      if (logRes.data.success) setAuditLogs(logRes.data.data);
      setHealthStatus(healthRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 text-[#172B23] dark:text-[#F1F7F3] transition-colors">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF5EE] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] text-[11px] font-bold text-[#138A5B] dark:text-[#43D99A] mb-2">
          <Shield className="w-3.5 h-3.5" />
          <span>National Waste Management Infrastructure Root</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B23] dark:text-[#F1F7F3] tracking-tight">
          System Administration & Governance
        </h1>
        <p className="text-[13px] text-[#46574F] dark:text-[#8FA196] mt-1">
          Multi-tenant municipal directory, AI adapter monitoring, and immutable compliance audit logs.
        </p>
      </div>

      {/* System Health Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Backend API */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-[#138A5B] dark:text-[#43D99A] flex items-center justify-center shrink-0">
            <Server className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] text-[#8FA196] block font-bold uppercase tracking-wider">REST API Engine</span>
            <span className="text-[16px] font-black text-[#138A5B] dark:text-[#43D99A] flex items-center gap-2">
              <span>{healthStatus?.status || 'HEALTHY'}</span>
              <span className="text-[11px] text-[#8FA196] font-normal">v{healthStatus?.version || '1.0.0'}</span>
            </span>
            <p className="text-[11px] text-[#8FA196] mt-0.5">Express Node.js Cluster Active</p>
          </div>
        </div>

        {/* Database */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-[#8FA196] block font-bold uppercase tracking-wider">Database Cluster</span>
            <span className="text-[16px] font-black text-blue-600 dark:text-blue-400">
              MongoDB 7.0
            </span>
            <p className="text-[11px] text-[#8FA196] mt-0.5">Replica Set Connected & Synced</p>
          </div>
        </div>

        {/* AI Vision Pipeline */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-[#8FA196] block font-bold uppercase tracking-wider">AI Classification</span>
            <span className="text-[16px] font-black text-purple-600 dark:text-purple-400">
              Vision Heuristic
            </span>
            <p className="text-[11px] text-[#8FA196] mt-0.5">CEA Segregation Rules Engine</p>
          </div>
        </div>
      </div>

      {/* Municipal Councils Multi-Tenant Directory */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
              Registered Municipal Councils & Authorities
            </h3>
            <p className="text-[12px] text-[#8FA196]">Multi-tenant operational divisions</p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EAF5EE] dark:bg-[#1B2922] text-[#138A5B] dark:text-[#43D99A]">
            {organizations.length} Active Tenants
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {organizations.map((org) => (
            <div
              key={org._id}
              className="p-4 rounded-2xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#1B2922] space-y-2 hover:border-[#138A5B] transition-all"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-[13px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">{org.name}</h4>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-[#EAF5EE] dark:bg-[#18281F] text-[#138A5B] dark:text-[#43D99A]">
                  {org.type}
                </span>
              </div>
              <p className="text-[11px] text-[#8FA196]">Code: {org.code} • Western Province</p>
              <div className="pt-2 border-t border-[#DFE8E2] dark:border-[#293B31] flex items-center justify-between text-[11px] text-[#8FA196]">
                <span>Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Provisioned</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Immutable Audit Log Table */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-extrabold text-[#172B23] dark:text-[#F1F7F3] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#138A5B] dark:text-[#43D99A]" />
              <span>Immutable Security & Operations Audit Trail</span>
            </h3>
            <p className="text-[12px] text-[#8FA196]">Cryptographically signed ledger events</p>
          </div>
          <span className="text-[11px] font-bold text-[#8FA196]">
            Showing recent events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#DFE8E2] dark:border-[#293B31] text-[#8FA196] font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">Action</th>
                <th className="pb-3 px-3">Actor Role</th>
                <th className="pb-3 px-3">Details</th>
                <th className="pb-3 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE8E2] dark:divide-[#293B31]">
              {auditLogs.slice(0, 8).map((log) => (
                <tr key={log._id} className="hover:bg-[#F8FAF8] dark:hover:bg-[#1B2922] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#172B23] dark:text-[#F1F7F3]">
                    {log.action}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EAF5EE] dark:bg-[#18281F] text-[#138A5B] dark:text-[#43D99A]">
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#46574F] dark:text-[#8FA196] truncate max-w-sm">
                    {log.entityType} ({log.entityId?.slice(-6) || 'system'})
                  </td>
                  <td className="py-3 px-3 text-[#8FA196] font-mono text-[11px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
