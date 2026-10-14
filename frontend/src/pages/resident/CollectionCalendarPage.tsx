import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Truck,
  MapPin,
  Bell,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';
import { api } from '../../api/client.js';

export const CollectionCalendarPage: React.FC = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reminderSet, setReminderSet] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await api.get('/schedules');
      if (res.data.success) {
        setSchedules(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStreamColor = (category: string) => {
    switch (category) {
      case 'ORGANIC':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200/50';
      case 'PLASTIC':
      case 'PAPER':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200/50';
      case 'GLASS':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200/50';
      default:
        return 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-200/50';
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 text-[#172B23] dark:text-[#F1F7F3] transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF5EE] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] text-[11px] font-bold text-[#138A5B] dark:text-[#43D99A] mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Colombo Municipal Council (CMC) Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B23] dark:text-[#F1F7F3] tracking-tight">
            Curbside Waste Collection Calendar
          </h1>
          <p className="text-[13px] text-[#46574F] dark:text-[#8FA196] mt-1">
            Weekly pickup schedules and permitted segregation streams across municipal residential zones.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setReminderSet(!reminderSet);
            if (!reminderSet) alert('Pickup reminder notifications activated for your ward!');
          }}
          className={`px-4 py-2.5 rounded-2xl font-bold text-[12px] flex items-center gap-2 transition-all ${
            reminderSet
              ? 'bg-[#138A5B] text-white shadow-md shadow-[#138A5B]/25'
              : 'bg-white dark:bg-[#141E19] text-[#138A5B] dark:text-[#43D99A] border border-[#DFE8E2] dark:border-[#293B31] hover:bg-[#EAF5EE]'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>{reminderSet ? 'Reminders Active ✓' : 'Set Pickup Reminder'}</span>
        </button>
      </div>

      {/* Schedule Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-[13px] text-[#8FA196]">
          Loading municipal schedules...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((sched) => (
            <div
              key={sched._id}
              className="p-6 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 flex flex-col justify-between hover:border-[#138A5B] transition-all group"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EAF5EE] dark:bg-[#1B2922] text-[#138A5B] dark:text-[#43D99A] border border-[#DFE8E2] dark:border-[#293B31]">
                    {sched.wasteCategories.join(' & ')}
                  </span>
                  <span className="text-[11px] text-[#8FA196] flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{sched.startTime} - {sched.endTime}</span>
                  </span>
                </div>

                <h3 className="text-[17px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
                  {sched.serviceZoneId?.name || 'Colombo Ward General Zone'}
                </h3>

                {/* Days of week */}
                <div>
                  <p className="text-[11px] font-bold text-[#8FA196] uppercase tracking-wider mb-2">
                    Collection Days:
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

                {/* Stream badges */}
                <div className="p-3.5 rounded-2xl bg-[#F8FAF8] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] space-y-1">
                  <p className="text-[11px] font-bold text-[#172B23] dark:text-[#F1F7F3]">Permitted Stream:</p>
                  <p className="text-[12px] text-[#46574F] dark:text-[#8FA196]">
                    Place segregated bins on sidewalk before 06:00 AM. Unsegregated refuse will not be lifted.
                  </p>
                </div>
              </div>

              {/* Truck Route */}
              <div className="mt-5 pt-4 border-t border-[#DFE8E2] dark:border-[#293B31] flex items-center justify-between text-[12px] text-[#8FA196]">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#138A5B] dark:text-[#43D99A]" />
                  <span>Compactor Fleet Curbside</span>
                </span>
                <span className="text-[11px] font-bold text-[#138A5B] dark:text-[#43D99A]">
                  Active Route
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ward Guide Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#EAF5EE] to-[#E4F4EA] dark:from-[#17251F] dark:to-[#13201A] border border-[#DFE8E2] dark:border-[#293B31] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#138A5B] text-white flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-[#172B23] dark:text-[#F1F7F3]">
              Curbside Segregation Compliance Rule
            </h4>
            <p className="text-[12px] text-[#46574F] dark:text-[#8FA196] mt-0.5">
              Under CMC Bylaw 2017/04, wet waste must not be mixed with plastic bottles. Violators face municipal citation.
            </p>
          </div>
        </div>

        <a
          href="/waste-segregation"
          className="px-5 py-2.5 rounded-xl bg-white dark:bg-[#141E19] text-[#138A5B] dark:text-[#43D99A] font-bold text-[12px] border border-[#DFE8E2] dark:border-[#293B31] shadow-xs shrink-0 hover:bg-[#EAF5EE]"
        >
          View Segregation Rules &rarr;
        </a>
      </div>
    </div>
  );
};
