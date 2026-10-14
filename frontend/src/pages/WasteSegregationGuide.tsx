import React, { useState } from 'react';
import {
  Apple,
  FileText,
  Package,
  Wine,
  Disc,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Info,
  Download,
  Share2,
  HelpCircle,
} from 'lucide-react';

export const WasteSegregationGuide: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const categories = [
    {
      id: 'ORGANIC',
      title: 'Organic & Food Waste',
      color: 'bg-emerald-600',
      gradient: 'from-emerald-600 to-teal-700',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      icon: Apple,
      binColor: 'Green Bin',
      binSinhala: 'කොළ පැහැති බඳුන',
      binTamil: 'பச்சை நிற தொட்டி',
      accepted: [
        'Fruit & vegetable peelings',
        'Leftover cooked rice & curry',
        'Garden leaves & lawn clippings',
        'Eggshells & crushed tea leaves',
      ],
      notAccepted: [
        'Polythene grocery bags / lunch sheets',
        'Glass fragments or metal tin foil',
        'Sanitary napkins & diapers',
        'Chemical insecticides or paints',
      ],
      tips: 'Drain liquids thoroughly before disposal. Moist food scraps generate odor and slow down municipal biogas composting.',
    },
    {
      id: 'PAPER',
      title: 'Paper & Clean Cardboard',
      color: 'bg-blue-600',
      gradient: 'from-blue-600 to-indigo-700',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
      icon: FileText,
      binColor: 'Blue Bin',
      binSinhala: 'නිල් පැහැති බඳුන',
      binTamil: 'நீல நிற தொட்டி',
      accepted: [
        'Daily newspapers & magazines',
        'Clean, unsoiled cardboard cartons',
        'Office printer paper & notebooks',
        'Paper cartons (folded flat)',
      ],
      notAccepted: [
        'Oil-soaked takeaway pizza boxes',
        'Wax-laminated or thermal receipt paper',
        'Soiled facial napkins & tissues',
        'Foil-lined snack wrappers',
      ],
      tips: 'Keep paper dry at all times. Wet paper fibers decompose and degrade recyclability in municipal repulping mills.',
    },
    {
      id: 'PLASTIC',
      title: 'Recyclable Plastics',
      color: 'bg-orange-600',
      gradient: 'from-orange-600 to-amber-700',
      badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
      icon: Package,
      binColor: 'Orange Bin',
      binSinhala: 'තැඹිලි පැහැති බඳුන',
      binTamil: 'ஆரஞ்சு நிற தொட்டி',
      accepted: [
        'PET transparent drink bottles',
        'HDPE shampoo & detergent bottles',
        'Rigid plastic tubs, buckets & basins',
        'Clean LDPE protective wrapping film',
      ],
      notAccepted: [
        'Single-use polythene lunch sheets',
        'Styrofoam / Rigifoam meal containers',
        'Engine oil & toxic pesticide cans',
        'Medical syringes or surgical gloves',
      ],
      tips: 'Rinse bottles with water, flatten them to save bin volume, and re-attach the plastic screw caps.',
    },
    {
      id: 'GLASS',
      title: 'Glass Bottles & Food Jars',
      color: 'bg-rose-600',
      gradient: 'from-rose-600 to-red-700',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
      icon: Wine,
      binColor: 'Red Bin',
      binSinhala: 'රතු පැහැති බඳුන',
      binTamil: 'சிவப்பு நிற தொட்டி',
      accepted: [
        'Clear soda and mineral bottles',
        'Amber beer and tonic bottles',
        'Jam, sauce & pickle preserve jars',
        'Cullet container glass pieces',
      ],
      notAccepted: [
        'Shattered window panes & mirrors',
        'Ceramic mugs, plates & earthenware',
        'Fluorescent CFL / LED bulbs',
        'Automotive safety windshields',
      ],
      tips: 'Separate by color where possible. Do not mix ceramic coffee mugs with bottle glass—ceramics melt at different temperatures.',
    },
    {
      id: 'E_WASTE',
      title: 'Electronic Waste (E-Waste)',
      color: 'bg-purple-600',
      gradient: 'from-purple-600 to-violet-700',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
      icon: Disc,
      binColor: 'Purple Drop-Off Station',
      binSinhala: 'දම් පැහැති විශේෂ බඳුන',
      binTamil: 'ஊதா நிற சிறப்பு தொட்டி',
      accepted: [
        'Outdated mobile phones & laptops',
        'Cables, power adapters & keyboards',
        'Household blenders, radios & irons',
        'Rechargeable lithium battery packs',
      ],
      notAccepted: [
        'Everyday kitchen wet scraps',
        'Cracked automotive lead-acid batteries',
      ],
      tips: 'Never toss electronics in roadside rain canals. Deposit at accredited Central Environmental Authority (CEA) e-waste hubs.',
    },
    {
      id: 'HAZARDOUS',
      title: 'Hazardous & Clinical Refuse',
      color: 'bg-amber-600',
      gradient: 'from-amber-600 to-yellow-700',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      icon: AlertTriangle,
      binColor: 'Yellow Clinical Biohazard',
      binSinhala: 'කහ පැහැති අනතුරුදායක බඳුන',
      binTamil: 'மஞ்சள் நிற அபாயகர தொட்டி',
      accepted: [
        'Outdated pharmaceuticals & blister packs',
        'Chemical insecticides & paint containers',
        'Sharps stored in rigid sealed bottles',
      ],
      notAccepted: [
        'Ordinary household paper or plastic waste',
      ],
      tips: 'CRITICAL SAFETY: Always isolate toxic containers. Contact municipal hazardous sanitation teams for pickup.',
    },
  ];

  const filteredCategories = selectedFilter === 'ALL'
    ? categories
    : categories.filter((c) => c.id === selectedFilter);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#172B23] dark:text-[#F1F7F3] transition-colors">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF5EE] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] text-[11px] font-bold text-[#138A5B] dark:text-[#43D99A] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#138A5B] dark:text-[#43D99A]" />
          <span>Central Environmental Authority (CEA) Standard</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B23] dark:text-[#F1F7F3] tracking-tight">
          National Waste Segregation Guidelines
        </h1>
        <p className="mt-3 text-[14px] text-[#46574F] dark:text-[#8FA196] leading-relaxed">
          Accurate segregation at source keeps Sri Lanka clean, accelerates recycling yields, prevents urban flood canal blockages, and protects sanitation workers.
        </p>

        {/* Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {['ALL', 'ORGANIC', 'PAPER', 'PLASTIC', 'GLASS', 'E_WASTE', 'HAZARDOUS'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all ${
                selectedFilter === f
                  ? 'bg-[#138A5B] text-white shadow-md shadow-[#138A5B]/25'
                  : 'bg-white dark:bg-[#141E19] text-[#46574F] dark:text-[#C1CEC5] border border-[#DFE8E2] dark:border-[#293B31] hover:bg-[#EAF5EE]'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 flex flex-col justify-between hover:border-[#138A5B] dark:hover:border-[#43D99A] transition-all duration-200 group"
            >
              <div>
                {/* Header of Card */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200`}>
                    <Icon className="w-6 h-6" strokeWidth={2.2} />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${cat.badgeColor}`}>
                    {cat.binColor}
                  </span>
                </div>

                <h3 className="text-[17px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
                  {cat.title}
                </h3>
                
                {/* Multilingual Labels */}
                <div className="flex items-center gap-2 text-[11px] font-medium text-[#8FA196] dark:text-[#8FA196] mt-1 mb-4">
                  <span>{cat.binSinhala}</span>
                  <span>•</span>
                  <span>{cat.binTamil}</span>
                </div>

                {/* Accepted & Not Accepted */}
                <div className="space-y-4 text-[12px]">
                  <div className="p-3 rounded-2xl bg-[#F0F8F3] dark:bg-[#18281F] border border-emerald-200/50 dark:border-emerald-900/40">
                    <p className="font-bold text-[#138A5B] dark:text-[#43D99A] flex items-center gap-1.5 mb-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>What to Include:</span>
                    </p>
                    <ul className="space-y-1 text-[#2B3E35] dark:text-[#D1E0D7] pl-1">
                      {cat.accepted.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#138A5B] dark:text-[#43D99A] mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FFF5F5] dark:bg-[#251818] border border-red-200/50 dark:border-red-900/40">
                    <p className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5 mb-1.5">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Do NOT Include:</span>
                    </p>
                    <ul className="space-y-1 text-[#4A2E2E] dark:text-[#E2C8C8] pl-1">
                      {cat.notAccepted.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Pro Tip */}
              <div className="mt-5 pt-4 border-t border-[#DFE8E2] dark:border-[#293B31]">
                <p className="text-[11px] text-[#46574F] dark:text-[#8FA196] leading-relaxed">
                  💡 <strong className="text-[#172B23] dark:text-[#F1F7F3]">Pro Tip:</strong> {cat.tips}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Helpful Civic Footer Note */}
      <div className="mt-12 p-6 rounded-3xl bg-gradient-to-br from-[#EAF5EE] to-[#E4F4EA] dark:from-[#17251F] dark:to-[#13201A] border border-[#DFE8E2] dark:border-[#293B31] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#138A5B] text-white flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-[#172B23] dark:text-[#F1F7F3]">
              Need specialized bulk collection in your Municipal Ward?
            </h4>
            <p className="text-[12px] text-[#46574F] dark:text-[#8FA196] mt-0.5">
              Tree trimmings, construction debris, and large e-waste require a scheduled municipal truck dispatch.
            </p>
          </div>
        </div>

        <a
          href="/resident/report-waste"
          className="px-5 py-2.5 rounded-xl bg-[#138A5B] hover:bg-[#0E734A] text-white font-semibold text-[13px] shadow-md shadow-[#138A5B]/20 shrink-0 transition-colors"
        >
          Request Bulk Collection
        </a>
      </div>
    </div>
  );
};
