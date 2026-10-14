import React, { useState, useEffect } from 'react';
import {
  Truck,
  CheckCircle2,
  AlertTriangle,
  Camera,
  MapPin,
  Wifi,
  WifiOff,
  RefreshCw,
  UploadCloud,
  Navigation,
  X,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../../api/client.js';
import { CollectionTask } from '../../types.js';

export const WorkerDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<CollectionTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);

  // Evidence Modal State
  const [evidenceModalTask, setEvidenceModalTask] = useState<CollectionTask | null>(null);
  const [evidenceUrl, setEvidenceUrl] = useState('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800');
  const [failureModalTask, setFailureModalTask] = useState<CollectionTask | null>(null);
  const [failureReason, setFailureReason] = useState('ROAD_BLOCKED');

  useEffect(() => {
    fetchTasks();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/collection-tasks/my-tasks');
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (taskId: string, status: string) => {
    try {
      const res = await api.patch(`/collection-tasks/${taskId}`, { status });
      if (res.data.success) fetchTasks();
    } catch (err) {
      alert('Status update failed.');
    }
  };

  const handleCompleteWithEvidence = async () => {
    if (!evidenceModalTask) return;
    try {
      const res = await api.post(`/collection-tasks/${evidenceModalTask._id}/evidence`, {
        images: [evidenceUrl],
      });
      if (res.data.success) {
        alert('Evidence recorded! Grievance successfully marked resolved.');
        setEvidenceModalTask(null);
        fetchTasks();
      }
    } catch (err) {
      alert('Failed to record evidence.');
    }
  };

  const handleFailTask = async () => {
    if (!failureModalTask) return;
    try {
      const res = await api.patch(`/collection-tasks/${failureModalTask._id}`, {
        status: 'FAILED',
        failureReason,
      });
      if (res.data.success) {
        setFailureModalTask(null);
        fetchTasks();
      }
    } catch (err) {
      alert('Failed to update task.');
    }
  };

  const handleSyncOffline = async () => {
    setSyncing(true);
    try {
      const res = await api.post('/collection-tasks/sync', {
        updates: tasks.map((t) => ({
          taskId: t._id,
          status: t.status,
          evidence: t.completionEvidence,
          failureReason: t.failureReason,
          idempotencyKey: `sync-${t._id}-${Date.now()}`,
        })),
      });

      if (res.data.success) {
        alert('All local tasks synchronized with central municipal server!');
        fetchTasks();
      }
    } catch (err) {
      alert('Sync failed.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 text-[#172B23] dark:text-[#F1F7F3] transition-colors">
      
      {/* Header & Connectivity Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#172B23] dark:text-[#F1F7F3] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#138A5B] dark:text-[#43D99A]" />
            <span>Field Collection Manifest</span>
          </h1>
          <p className="text-[12px] text-[#46574F] dark:text-[#8FA196] mt-0.5">
            Vehicle WP-DA-4892 • Colombo MC Compactor Fleet Unit
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 ${
            isOnline
              ? 'bg-[#EAF5EE] dark:bg-[#18281F] text-[#138A5B] dark:text-[#43D99A] border-[#DFE8E2] dark:border-[#293B31]'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200'
          }`}>
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'Online (Connected)' : 'Offline Cached'}</span>
          </div>

          <button
            onClick={handleSyncOffline}
            disabled={syncing}
            className="px-3.5 py-1.5 rounded-xl bg-[#138A5B] hover:bg-[#0E734A] text-white font-bold text-[12px] shadow-sm flex items-center gap-1.5 shrink-0 transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{syncing ? 'Syncing...' : 'Sync Tasks'}</span>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-10 text-center text-[13px] text-[#8FA196]">
            Loading assigned route waypoints...
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-10 text-center rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-md">
            <Truck className="w-10 h-10 text-[#8FA196] mx-auto mb-2" />
            <p className="text-[14px] font-bold text-[#172B23] dark:text-[#F1F7F3]">All Tasks Cleared</p>
            <p className="text-[12px] text-[#8FA196] mt-1">No pending collection waypoints currently assigned to your crew.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 space-y-4 hover:border-[#138A5B] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-mono font-black text-[#172B23] dark:text-[#F1F7F3]">
                    {task.reportId?.referenceNumber || 'Scheduled Route Task'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    task.priority === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300' :
                    task.priority === 'HIGH' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {task.priority} Priority
                  </span>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  task.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                  task.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                  task.status === 'FAILED' ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                }`}>
                  {task.status}
                </span>
              </div>

              {/* Task Info */}
              <div className="space-y-1.5 text-[12px] text-[#46574F] dark:text-[#C1CEC5]">
                <p className="flex items-center gap-1.5 font-bold text-[#172B23] dark:text-[#F1F7F3]">
                  <MapPin className="w-3.5 h-3.5 text-[#138A5B] dark:text-[#43D99A] shrink-0" />
                  <span>{task.reportId?.address || 'Municipal Ward Collection Stop'}</span>
                </p>
                <p className="text-[11px] text-[#8FA196] pl-5">
                  Category: {task.reportId?.category || 'General Refuse'}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#DFE8E2] dark:border-[#293B31] flex flex-wrap items-center justify-between gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${task.reportId?.location?.coordinates?.[1] || 6.9271},${task.reportId?.location?.coordinates?.[0] || 79.8612}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[12px] font-bold text-[#138A5B] dark:text-[#43D99A] hover:underline"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>GPS Directions</span>
                </a>

                <div className="flex items-center gap-2">
                  {task.status !== 'IN_PROGRESS' && task.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleUpdateStatus(task._id, 'IN_PROGRESS')}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 text-[11px] font-bold"
                    >
                      Start Route Stop
                    </button>
                  )}

                  {task.status !== 'COMPLETED' && (
                    <>
                      <button
                        onClick={() => setFailureModalTask(task)}
                        className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40 text-[11px] font-bold"
                      >
                        Report Obstacle
                      </button>

                      <button
                        onClick={() => setEvidenceModalTask(task)}
                        className="px-3 py-1.5 rounded-xl bg-[#138A5B] text-white text-[11px] font-bold shadow-sm flex items-center gap-1.5"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Upload Photo Proof</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Evidence Modal */}
      {evidenceModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-2xl p-6 space-y-4">
            <h3 className="text-[16px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
              Submit Resolution Proof Photo
            </h3>
            <p className="text-[12px] text-[#46574F] dark:text-[#8FA196]">
              Take or select clean site photo to verify that waste was cleared into compactor vehicle.
            </p>
            <img
              src={evidenceUrl}
              alt="Resolution Preview"
              className="w-full h-40 rounded-2xl object-cover border border-[#DFE8E2] dark:border-[#293B31]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEvidenceModalTask(null)}
                className="px-4 py-2 rounded-xl text-[12px] font-semibold text-[#8FA196]"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteWithEvidence}
                className="px-5 py-2 rounded-xl bg-[#138A5B] text-white text-[12px] font-bold shadow-md"
              >
                Confirm & Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Failure Modal */}
      {failureModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-2xl p-6 space-y-4">
            <h3 className="text-[16px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
              Report Route Stop Obstacle
            </h3>
            <p className="text-[12px] text-[#46574F] dark:text-[#8FA196]">
              Select reason why the waste container or dump site could not be accessed:
            </p>
            <select
              value={failureReason}
              onChange={(e) => setFailureReason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#1B2922] text-[12px] font-semibold"
            >
              <option value="ROAD_BLOCKED">Access Road Blocked / Narrow Lane</option>
              <option value="HAZARDOUS_MATERIALS">Hazardous Chemicals Present (Specialist Needed)</option>
              <option value="VEHICLE_OVERLOAD">Compactor Capacity Exceeded</option>
              <option value="UNAUTHORIZED_LOCKED">Private Locked Gate / No Access</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setFailureModalTask(null)}
                className="px-4 py-2 rounded-xl text-[12px] font-semibold text-[#8FA196]"
              >
                Cancel
              </button>
              <button
                onClick={handleFailTask}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-[12px] font-bold shadow-md"
              >
                Log Obstacle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
