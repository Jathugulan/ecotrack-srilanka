import React, { useState, useEffect } from 'react';
import {
  Gift,
  Award,
  CheckCircle,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Ticket,
  ChevronRight,
  Recycle,
} from 'lucide-react';
import { api } from '../../api/client.js';

export const RewardsPage: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimedReward, setClaimedReward] = useState<string | null>(null);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const [balRes, histRes] = await Promise.all([
        api.get('/rewards/balance'),
        api.get('/rewards/transactions'),
      ]);

      if (balRes.data.success) {
        setBalance(balRes.data.data.balance);
      }
      if (histRes.data.success) {
        setHistory(histRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching rewards:', err);
    } finally {
      setLoading(false);
    }
  };

  const vouchers = [
    {
      id: 'keells',
      title: 'LKR 500 Grocery Voucher',
      partner: 'Keells Supermarkets',
      points: 250,
      desc: 'Valid on fresh fruits and vegetables at all branches.',
    },
    {
      id: 'spindles',
      title: 'Eco-Fabric Reusable Tote',
      partner: 'EcoSpindles Sri Lanka',
      points: 150,
      desc: 'Crafted from 10 recycled post-consumer PET bottles.',
    },
    {
      id: 'daraz',
      title: 'LKR 1,000 Green Discount',
      partner: 'Daraz Eco Mall',
      points: 500,
      desc: 'Applicable on certified eco-friendly home items.',
    },
  ];

  const handleRedeem = (voucher: any) => {
    if (balance < voucher.points) {
      alert(`Insufficient points. You need ${voucher.points} points to redeem this voucher.`);
      return;
    }
    setClaimedReward(voucher.title);
    setBalance((prev) => prev - voucher.points);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 text-[#172B23] dark:text-[#F1F7F3] transition-colors">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF5EE] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] text-[11px] font-bold text-[#138A5B] dark:text-[#43D99A] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Circular Economy Incentive Program</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B23] dark:text-[#F1F7F3] tracking-tight">
          Green Points & Recycling Rewards
        </h1>
        <p className="text-[13px] text-[#46574F] dark:text-[#8FA196] mt-1">
          Earn verified circular points by dropping off segregated recyclables at accredited recovery depots.
        </p>
      </div>

      {/* Portfolio Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#138A5B] via-[#0E734A] to-[#0F766E] p-8 text-white shadow-2xl shadow-[#138A5B]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative">
          <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#B8F34A]" />
            Verified Reward Ledger
          </span>
          <p className="text-4xl sm:text-5xl font-black mt-2 tracking-tight">
            {balance} <span className="text-2xl font-bold text-[#B8F34A]">Points</span>
          </p>
          <p className="text-[13px] text-emerald-100/90 mt-2 max-w-md leading-relaxed">
            Equivalent to ~{(balance / 10).toFixed(1)} kg of post-consumer plastic bottles diverted from Sri Lankan water canals.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
          <Award className="w-9 h-9 text-[#B8F34A] mx-auto mb-1" />
          <p className="text-[13px] font-bold text-white">Eco-Citizen Tier</p>
          <p className="text-[11px] text-emerald-100">Level 2 Green Contributor</p>
          <div className="mt-2 w-28 h-1.5 bg-white/20 rounded-full overflow-hidden mx-auto">
            <div className="w-3/4 h-full bg-[#B8F34A] rounded-full" />
          </div>
        </div>
      </div>

      {/* Claimed Notification */}
      {claimedReward && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-[13px] font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>Successfully redeemed "{claimedReward}". Code sent to your registered SMS!</span>
          </div>
          <button onClick={() => setClaimedReward(null)} className="text-xs underline font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Redeem Vouchers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
            Partner Rewards & Vouchers
          </h2>
          <span className="text-[12px] text-[#8FA196]">Redeem with 1-click</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {vouchers.map((v) => (
            <div
              key={v.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-md hover:border-[#138A5B] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#EAF5EE] dark:bg-[#1B2922] text-[#138A5B] dark:text-[#43D99A]">
                    {v.partner}
                  </span>
                  <span className="text-[13px] font-black text-[#138A5B] dark:text-[#43D99A]">
                    {v.points} pts
                  </span>
                </div>
                <h3 className="text-[15px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
                  {v.title}
                </h3>
                <p className="text-[12px] text-[#46574F] dark:text-[#8FA196] mt-1.5 leading-relaxed">
                  {v.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleRedeem(v)}
                className="mt-5 w-full py-2.5 px-4 rounded-xl bg-[#138A5B] hover:bg-[#0E734A] text-white font-bold text-[12px] shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Redeem Voucher</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 space-y-4">
        <h2 className="text-[16px] font-extrabold text-[#172B23] dark:text-[#F1F7F3] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#138A5B] dark:text-[#43D99A]" />
          <span>Verified Double-Entry Ledger History</span>
        </h2>

        {history.length === 0 ? (
          <div className="p-10 text-center text-[12px] text-[#8FA196] border border-dashed border-[#DFE8E2] dark:border-[#293B31] rounded-2xl">
            No drop-off transactions logged yet. Drop off clean recyclables at verified depots to earn points!
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((tx) => (
              <div
                key={tx._id}
                className="p-4 rounded-2xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#1B2922] flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-extrabold text-[#138A5B] dark:text-[#43D99A]">
                      +{tx.points} Green Points
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {tx.transactionType}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#46574F] dark:text-[#8FA196] mt-1">
                    {tx.description}
                  </p>
                  <p className="text-[10px] text-[#8FA196] mt-0.5">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-[#8FA196] block font-semibold">Balance After</span>
                  <span className="text-[14px] font-black text-[#138A5B] dark:text-[#43D99A]">
                    {tx.balanceAfter} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
