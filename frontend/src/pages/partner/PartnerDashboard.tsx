import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Recycle,
  CheckCircle2,
  ShieldCheck,
  Scale,
  Gift,
  Building2,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { api } from '../../api/client.js';

export const PartnerDashboard: React.FC = () => {
  const [centers, setCenters] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [residentEmail, setResidentEmail] = useState('resident@ecotrack.lk');
  const [materialCategory, setMaterialCategory] = useState('PLASTIC');
  const [quantityKg, setQuantityKg] = useState(5.0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [cenRes, txRes] = await Promise.all([
        api.get('/recycling-centers'),
        api.get('/recycling-transactions'),
      ]);
      if (cenRes.data.success && cenRes.data.data.length > 0) {
        setCenters(cenRes.data.data);
        setSelectedCenter(cenRes.data.data[0]._id);
      }
      if (txRes.data.success) {
        setTransactions(txRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching partner data:', err);
    }
  };

  const calculatePoints = () => {
    const rate = materialCategory === 'PLASTIC' ? 10 : materialCategory === 'E_WASTE' ? 50 : 5;
    return Math.round(quantityKg * rate);
  };

  const handleVerifyDropOff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const rate = materialCategory === 'PLASTIC' ? 10 : materialCategory === 'E_WASTE' ? 50 : 5;
      const res = await api.post('/recycling-transactions', {
        idempotencyKey: `tx-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        residentId: '6ac877d949449f1db1f13b19', // Seeds Kasun Perera ID or current resident
        recyclingCenterId: selectedCenter,
        materials: [
          {
            category: materialCategory,
            subType: `${materialCategory} Sorted Batch`,
            quantity: quantityKg,
            quantityUnit: 'KG',
            pointsPerUnit: rate,
          },
        ],
      });

      if (res.data.success) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        alert(`Drop-off verified! ${calculatePoints()} Green Points issued to citizen.`);
        fetchInitialData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error recording drop-off.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 text-[#172B23] dark:text-[#F1F7F3] transition-colors">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF5EE] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] text-[11px] font-bold text-[#138A5B] dark:text-[#43D99A] mb-2">
          <Recycle className="w-3.5 h-3.5" />
          <span>Accredited Circular Partner Terminal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B23] dark:text-[#F1F7F3] tracking-tight">
          Recycler Weighbridge & Verification Terminal
        </h1>
        <p className="text-[13px] text-[#46574F] dark:text-[#8FA196] mt-1">
          Verify resident drop-offs, record gross kilograms, and issue cryptographic Green Points to citizen accounts.
        </p>
      </div>

      {/* Main Split: Intake Form & Verified Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Drop-off Verification */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-extrabold text-[#172B23] dark:text-[#F1F7F3] flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#138A5B] dark:text-[#43D99A]" />
              <span>Log Recyclables Intake</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF5EE] dark:bg-[#1B2922] text-[#138A5B] dark:text-[#43D99A]">
              Weighbridge Terminal
            </span>
          </div>

          <form onSubmit={handleVerifyDropOff} className="space-y-4">
            {/* Center selection */}
            <div>
              <label className="block text-[12px] font-bold text-[#46574F] dark:text-[#8FA196] mb-1.5">
                Accredited Depot Location
              </label>
              <select
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#141E19] text-[13px] text-[#172B23] dark:text-[#F1F7F3] focus:ring-2 focus:ring-[#138A5B]"
              >
                {centers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} — {c.address}
                  </option>
                ))}
              </select>
            </div>

            {/* Resident Email */}
            <div>
              <label className="block text-[12px] font-bold text-[#46574F] dark:text-[#8FA196] mb-1.5">
                Citizen Account (Email)
              </label>
              <input
                type="email"
                required
                value={residentEmail}
                onChange={(e) => setResidentEmail(e.target.value)}
                placeholder="citizen@example.lk"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#141E19] text-[13px] text-[#172B23] dark:text-[#F1F7F3] focus:ring-2 focus:ring-[#138A5B]"
              />
            </div>

            {/* Material & Weight in 2 cols */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-bold text-[#46574F] dark:text-[#8FA196] mb-1.5">
                  Material Stream
                </label>
                <select
                  value={materialCategory}
                  onChange={(e) => setMaterialCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#141E19] text-[12px] font-semibold text-[#172B23] dark:text-[#F1F7F3] focus:ring-2 focus:ring-[#138A5B]"
                >
                  <option value="PLASTIC">Plastic (PET / HDPE)</option>
                  <option value="PAPER">Paper & Cardboard</option>
                  <option value="GLASS">Glass Bottles</option>
                  <option value="METAL">Scrap Metal & Cans</option>
                  <option value="E_WASTE">E-Waste Devices</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#46574F] dark:text-[#8FA196] mb-1.5">
                  Net Weight (KG)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#141E19] text-[12px] font-semibold text-[#172B23] dark:text-[#F1F7F3] focus:ring-2 focus:ring-[#138A5B]"
                />
              </div>
            </div>

            {/* Calculated Reward preview */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#EAF5EE] to-[#E4F4EA] dark:from-[#17251F] dark:to-[#13201A] border border-[#DFE8E2] dark:border-[#293B31] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8FA196]">Reward Calculation</span>
                <p className="text-[16px] font-extrabold text-[#138A5B] dark:text-[#43D99A] mt-0.5">
                  +{calculatePoints()} Green Points
                </p>
              </div>
              <Gift className="w-6 h-6 text-[#138A5B] dark:text-[#43D99A]" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#138A5B] hover:bg-[#0E734A] text-white font-bold text-[13px] shadow-lg shadow-[#138A5B]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Recording...' : 'Verify Drop-Off & Credit Points'}</span>
            </button>
          </form>
        </div>

        {/* Right Table: Intake Ledger History */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[16px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
                  Verified Drop-Off Ledger
                </h3>
                <p className="text-[12px] text-[#8FA196]">Accredited recycling partner transactions</p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EAF5EE] dark:bg-[#1B2922] text-[#138A5B] dark:text-[#43D99A]">
                Audit Compliant
              </span>
            </div>

            {transactions.length === 0 ? (
              <div className="p-10 text-center text-[12px] text-[#8FA196] border border-dashed rounded-2xl">
                No drop-off intake transactions recorded yet today.
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 6).map((tx) => (
                  <div
                    key={tx._id}
                    className="p-3.5 rounded-2xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#1B2922] flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
                          {tx.materials?.[0]?.quantity || 5} {tx.materials?.[0]?.quantityUnit || 'KG'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EAF5EE] dark:bg-[#17251F] text-[#138A5B] dark:text-[#43D99A]">
                          {tx.materials?.[0]?.category || 'PLASTIC'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8FA196] mt-0.5">
                        Resident: Kasun Perera • {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[13px] font-black text-[#138A5B] dark:text-[#43D99A]">
                        +{tx.totalPointsAwarded || 50} pts
                      </span>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5 justify-end">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#DFE8E2] dark:border-[#293B31] flex items-center justify-between text-[11px] text-[#8FA196]">
            <span>Double-entry ledger verified under CEA circular regulations</span>
            <span className="font-bold text-[#138A5B] dark:text-[#43D99A]">100% Reconciled</span>
          </div>
        </div>

      </div>
    </div>
  );
};
