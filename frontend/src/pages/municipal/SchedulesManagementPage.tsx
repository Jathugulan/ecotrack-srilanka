import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Building2,
  Trash2,
  CheckCircle2,
  X,
  Truck,
} from 'lucide-react';
import { api } from '../../api/client.js';

export const SchedulesManagementPage: React.FC = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Schedule form
  const [serviceZoneId, setServiceZoneId] = useState('');
  const [wasteCategory, setWasteCategory] = useState('ORGANIC');
  const [days, setDays] = useState<string[]>(['MONDAY', 'WEDNESDAY', 'FRIDAY']);
  const [startTime, setStartTime] = useState('06:30');
  const [endTime, setEndTime] = useState('10:30');

  useEffect(() => {
    fetchSchedules();
    fetchZones();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await api.get('/schedules');
      if (res.data.success) setSchedules(res.data.data);
    } catch (err) {
      console.error('Error fetching schedules:', err);
    }
  };

  const fetchZones = async () => {
    try {
      const res = await api.get('/service-zones');
      if (res.data.success) {
        setZones(res.data.data);
        if (res.data.data.length > 0) setServiceZoneId(res.data.data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching service zones:', err);
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/schedules', {
        serviceZoneId,
        wasteCategories: [wasteCategory],
        collectionDays: days,
        startTime,
        endTime,
      });

      if (res.data.success) {
        setIsModalOpen(false);
        fetchSchedules();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating schedule.');
    }
  };

  const toggleDay = (day: string) => {
    if (days.includes(day)) {
      setDays(days.filter((d) => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

  const allDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-[#172B23] dark:text-[#F1F7F3] transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF5EE] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] text-[11px] font-bold text-[#138A5B] dark:text-[#43D99A] mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>CMC Sanitation Fleet Scheduling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B23] dark:text-[#F1F7F3] tracking-tight">
            Curbside Schedules & Service Zones
          </h1>
          <p className="text-[13px] text-[#46574F] dark:text-[#8FA196] mt-1">
            Configure municipal collection routes, day assignments, and segregated stream intervals across wards.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#138A5B] hover:bg-[#0E734A] text-white font-bold text-[12px] shadow-lg shadow-[#138A5B]/25 flex items-center gap-2 transition-all hover:scale-[1.01] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Schedule</span>
        </button>
      </div>

      {/* Schedules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules.map((sched) => (
          <div
            key={sched._id}
            className="p-6 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 flex flex-col justify-between hover:border-[#138A5B] transition-all group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EAF5EE] dark:bg-[#1B2922] text-[#138A5B] dark:text-[#43D99A]">
                  {sched.wasteCategories.join(', ')}
                </span>
                <span className="text-[11px] text-[#8FA196] flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{sched.startTime} - {sched.endTime}</span>
                </span>
              </div>

              <h3 className="text-[17px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
                {sched.serviceZoneId?.name || 'Colombo Ward Zone'}
              </h3>

              <div>
                <p className="text-[11px] font-bold text-[#8FA196] uppercase tracking-wider mb-2">
                  Operating Pickup Days:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sched.collectionDays.map((d: string) => (
                    <span
                      key={d}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#EAF5EE] dark:bg-[#18281F] text-[#138A5B] dark:text-[#43D99A] border border-[#DFE8E2] dark:border-[#293B31]"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-[#DFE8E2] dark:border-[#293B31] flex items-center justify-between text-[11px] text-[#8FA196]">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#138A5B] dark:text-[#43D99A]" />
                <span>Compactor Route Assigned</span>
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                Active Routine
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[17px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
                Create Municipal Curbside Schedule
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8FA196] hover:text-[#172B23]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#8FA196] uppercase mb-1">Service Zone</label>
                <select
                  value={serviceZoneId}
                  onChange={(e) => setServiceZoneId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#1B2922] text-[12px] font-semibold"
                >
                  {zones.map((z) => (
                    <option key={z._id} value={z._id}>
                      {z.name} (Ward {z.wardNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8FA196] uppercase mb-1">Waste Stream</label>
                <select
                  value={wasteCategory}
                  onChange={(e) => setWasteCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#1B2922] text-[12px] font-semibold"
                >
                  <option value="ORGANIC">Organic & Food Waste (Green)</option>
                  <option value="PLASTIC">Plastic & Clean Cardboard (Orange/Blue)</option>
                  <option value="GLASS">Container Glass (Red)</option>
                  <option value="E_WASTE">Electronic Drop-Off (Purple)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8FA196] uppercase mb-1.5">Collection Days</label>
                <div className="flex flex-wrap gap-1.5">
                  {allDays.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                        days.includes(day)
                          ? 'bg-[#138A5B] text-white shadow-xs'
                          : 'bg-[#F8FAF8] dark:bg-[#1B2922] text-[#46574F] dark:text-[#8FA196] border border-[#DFE8E2] dark:border-[#293B31]'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#8FA196] uppercase mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#1B2922] text-[12px] font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#8FA196] uppercase mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#1B2922] text-[12px] font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DFE8E2] dark:border-[#293B31]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[12px] font-semibold text-[#8FA196]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#138A5B] text-white text-[12px] font-bold shadow-md"
                >
                  Publish Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
