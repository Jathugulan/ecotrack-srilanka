import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Heart, ArrowUpRight, CheckCircle2, Globe, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#0B110F] border-t border-[#DFE8E2] dark:border-[#293B31] py-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#138A5B] to-[#0F766E] flex items-center justify-center text-white shadow-lg shadow-[#138A5B]/20 group-hover:scale-105 transition-transform duration-200">
                <Leaf className="w-5 h-5 text-[#B8F34A]" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-[20px] font-extrabold tracking-tight text-[#172B23] dark:text-[#F1F7F3]">EcoTrack</span>
                <span className="text-[11px] block font-medium text-[#46574F] dark:text-[#8FA196]">Sri Lanka • Smart Waste Platform</span>
              </div>
            </Link>
            
            <p className="text-[13px] text-[#46574F] dark:text-[#8FA196] leading-relaxed max-w-sm">
              Empowering Sri Lankan communities with AI-assisted illegal dump reporting, automated municipal fleet dispatch, and verified circular economy rewards.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF5EE] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] text-[11px] font-semibold text-[#138A5B] dark:text-[#43D99A]">
              <span className="w-2 h-2 rounded-full bg-[#138A5B] dark:bg-[#43D99A] animate-pulse" />
              <span>All Systems Operational across Western Province</span>
            </div>
          </div>

          {/* Col 3: Citizen Services */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#172B23] dark:text-[#F1F7F3] mb-4">
              Citizen Services
            </h4>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <Link to="/resident/report-waste" className="text-[#46574F] dark:text-[#C1CEC5] hover:text-[#138A5B] dark:hover:text-[#43D99A] transition-colors flex items-center gap-1">
                  <span>Report Waste (AI)</span>
                </Link>
              </li>
              <li>
                <Link to="/waste-segregation" className="text-[#46574F] dark:text-[#C1CEC5] hover:text-[#138A5B] dark:hover:text-[#43D99A] transition-colors">
                  CEA Segregation Guide
                </Link>
              </li>
              <li>
                <Link to="/recycling-locator" className="text-[#46574F] dark:text-[#C1CEC5] hover:text-[#138A5B] dark:hover:text-[#43D99A] transition-colors">
                  Find Recycling Depots
                </Link>
              </li>
              <li>
                <Link to="/resident/rewards" className="text-[#46574F] dark:text-[#C1CEC5] hover:text-[#138A5B] dark:hover:text-[#43D99A] transition-colors">
                  Green Points & Rewards
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-[#46574F] dark:text-[#C1CEC5] hover:text-[#138A5B] dark:hover:text-[#43D99A] transition-colors">
                  How the Platform Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Municipal Partnerships */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#172B23] dark:text-[#F1F7F3] mb-4">
              Municipal Partners
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#46574F] dark:text-[#8FA196]">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#138A5B] dark:text-[#43D99A] shrink-0" />
                <span>Colombo MC (CMC)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#138A5B] dark:text-[#43D99A] shrink-0" />
                <span>Kandy MC (KMC)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#138A5B] dark:text-[#43D99A] shrink-0" />
                <span>Dehiwala-Mount Lavinia</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#138A5B] dark:text-[#43D99A] shrink-0" />
                <span>Sri Jayawardenepura Kotte</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#138A5B] dark:text-[#43D99A] shrink-0" />
                <span>Central Env. Authority</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Privacy */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#172B23] dark:text-[#F1F7F3] mb-4">
              Security & Privacy
            </h4>
            <p className="text-[12px] text-[#46574F] dark:text-[#8FA196] leading-relaxed mb-3">
              Certified compliant under Sri Lanka Data Protection Act (PDPA) No. 9 of 2022. Citizen GPS coordinates are anonymized.
            </p>
            <div className="p-3 rounded-xl bg-[#F0F5F2] dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31]">
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#138A5B] dark:text-[#43D99A]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>PDPA Protected</span>
              </div>
              <p className="text-[11px] text-[#8FA196] mt-0.5">End-to-end encrypted dispatch</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#DFE8E2] dark:border-[#293B31] flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#8FA196] dark:text-[#8FA196]">
          <p>© 2026 EcoTrack Sri Lanka. Built for a sustainable, litter-free island nation.</p>
          <p className="flex items-center gap-1.5 mt-3 sm:mt-0">
            <span>Powered by Smart Green Tech</span>
            <span className="w-1 h-1 rounded-full bg-[#138A5B]" />
            <span className="text-[#138A5B] dark:text-[#43D99A] font-semibold">Clean Colombo Initiative</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
