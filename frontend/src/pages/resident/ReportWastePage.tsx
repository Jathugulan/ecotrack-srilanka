import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Camera,
  Upload,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Navigation,
  Check,
  Flame,
  Info,
} from 'lucide-react';
import { api } from '../../api/client.js';
import { WasteCategory, ReportSeverity } from '../../types.js';

export const ReportWastePage: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800',
  ]);
  const [category, setCategory] = useState<WasteCategory>('PLASTIC');
  const [severity, setSeverity] = useState<ReportSeverity>('HIGH');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Opposite Viharamahadevi Park, Dharmapala Mawatha, Colombo 07');
  const [latitude, setLatitude] = useState(6.9075);
  const [longitude, setLongitude] = useState(79.8610);
  const [gpsAcquired, setGpsAcquired] = useState(false);

  // AI State
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiPrediction, setAiPrediction] = useState<{
    suggestedCategory: WasteCategory;
    confidence: number;
    requiresHumanReview: boolean;
    guidance: string;
    safetyNote: string;
  } | null>(null);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any>(null);

  const sampleImages = [
    { label: 'Plastic Dump', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800' },
    { label: 'Market Organic Refuse', url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800' },
    { label: 'Discarded Electronics', url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800' },
  ];

  const categoryOptions: { id: WasteCategory; label: string; desc: string }[] = [
    { id: 'PLASTIC', label: 'Plastics & Bottles', desc: 'PET, wrappers, rigid containers' },
    { id: 'ORGANIC', label: 'Organic & Food', desc: 'Market waste, garden debris' },
    { id: 'PAPER', label: 'Paper & Boxes', desc: 'Cardboard, newspapers' },
    { id: 'GLASS', label: 'Glass Containers', desc: 'Bottles, jars, broken cullet' },
    { id: 'METAL', label: 'Scrap Metals', desc: 'Cans, iron sheets, wires' },
    { id: 'E_WASTE', label: 'E-Waste', desc: 'Electronics, cables, batteries' },
    { id: 'HAZARDOUS', label: 'Hazardous', desc: 'Chemicals, medical, paints' },
    { id: 'MIXED', label: 'Mixed / Unsorted', desc: 'General illegal dump' },
  ];

  const severityOptions: { id: ReportSeverity; label: string; color: string }[] = [
    { id: 'LOW', label: 'Low', color: 'border-blue-300 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40' },
    { id: 'MEDIUM', label: 'Medium', color: 'border-emerald-300 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40' },
    { id: 'HIGH', label: 'High Priority', color: 'border-amber-300 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40' },
    { id: 'CRITICAL', label: 'Critical / Biohazard', color: 'border-red-300 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40' },
  ];

  const runAiClassification = async (imageUrl: string) => {
    setAiAnalyzing(true);
    try {
      const res = await api.post('/ai/classify-waste', { imageUrl, fileName: imageUrl });
      if (res.data.success) {
        setAiPrediction(res.data.data);
        setCategory(res.data.data.suggestedCategory);
      }
    } catch (err) {
      console.error('AI analysis error:', err);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleCaptureGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setGpsAcquired(true);
          setAddress(`GPS Location Pin: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E (Colombo Ward)`);
        },
        () => {
          alert('GPS permission not granted. Defaulting to Colombo 07 coordinates.');
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.post('/reports', {
        category,
        description: description || 'Citizen reported illegal waste accumulation requesting municipal clearance.',
        severity,
        address,
        latitude,
        longitude,
        images,
        aiSuggestedCategory: aiPrediction?.suggestedCategory,
        aiConfidence: aiPrediction?.confidence,
      });

      if (res.data.success) {
        setSubmittedReport(res.data.data);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating report. Please check input.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8 text-[#172B23] dark:text-[#F1F7F3] transition-colors">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF5EE] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] text-[11px] font-bold text-[#138A5B] dark:text-[#43D99A] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Vision Assistant Enabled</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B23] dark:text-[#F1F7F3] tracking-tight">
          Report Waste Problem
        </h1>
        <p className="text-[13px] text-[#46574F] dark:text-[#8FA196] mt-1">
          Provide photographic evidence and location. Our AI assistant will automatically detect waste materials and prioritize municipal cleanup dispatch.
        </p>
      </div>

      {submittedReport ? (
        /* Success State */
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#141E19] border border-emerald-300 dark:border-emerald-800 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#138A5B] to-[#0F766E] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#138A5B]/25">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-black text-[#172B23] dark:text-[#F1F7F3]">
            Complaint Registered Successfully!
          </h2>
          <p className="text-[14px] text-[#46574F] dark:text-[#8FA196] max-w-md mx-auto leading-relaxed">
            Your complaint has been queued for municipal sanitation triage. A collection crew will be assigned based on severity.
          </p>

          <div className="inline-block p-4 rounded-2xl bg-[#F0F5F2] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31]">
            <span className="text-[11px] text-[#8FA196] block font-bold uppercase tracking-wider">Complaint Reference Number</span>
            <span className="text-2xl font-black text-[#138A5B] dark:text-[#43D99A] tracking-wider font-mono">
              {submittedReport.referenceNumber}
            </span>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/resident/reports')}
              className="px-6 py-3 rounded-xl bg-[#138A5B] hover:bg-[#0E734A] text-white font-bold text-[13px] shadow-lg shadow-[#138A5B]/25 transition-all"
            >
              Track in My Complaints
            </button>
            <button
              onClick={() => {
                setSubmittedReport(null);
                setAiPrediction(null);
              }}
              className="px-6 py-3 rounded-xl bg-[#F8FAF8] dark:bg-[#1B2922] hover:bg-[#EAF5EE] text-[#172B23] dark:text-[#F1F7F3] text-[13px] font-bold border border-[#DFE8E2] dark:border-[#293B31] transition-all"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        /* Report Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Step 1: Photographic Evidence */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-extrabold text-[#172B23] dark:text-[#F1F7F3] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#138A5B] dark:text-[#43D99A]" />
                <span>Step 1: Photographic Evidence & AI Analysis</span>
              </h3>
              <span className="text-[11px] text-[#8FA196]">Required</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <img
                src={images[0]}
                alt="Selected Evidence"
                className="w-full sm:w-52 h-40 rounded-2xl object-cover border border-[#DFE8E2] dark:border-[#293B31] shadow-md shrink-0"
              />
              <div className="space-y-3 text-[12px] w-full">
                <p className="font-bold text-[#46574F] dark:text-[#C1CEC5]">Select or Demo Sample Waste Photos:</p>
                <div className="flex flex-wrap gap-2">
                  {sampleImages.map((sample, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setImages([sample.url]);
                        runAiClassification(sample.url);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#1B2922] hover:border-[#138A5B] text-left transition-all font-semibold"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => runAiClassification(images[0])}
                  disabled={aiAnalyzing}
                  className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#138A5B] to-[#0F766E] text-white font-bold flex items-center gap-2 shadow-md shadow-[#138A5B]/20 hover:opacity-95 transition-all disabled:opacity-60"
                >
                  {aiAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing Vision Tensor...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#B8F34A]" />
                      <span>Run AI Waste Classification</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Recommendation Banner */}
            {aiPrediction && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EAF5EE] to-[#E4F4EA] dark:from-[#17251F] dark:to-[#13201A] border border-[#DFE8E2] dark:border-[#293B31] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#138A5B] dark:text-[#43D99A]" />
                    <span className="text-[13px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
                      AI Inferred Category: {aiPrediction.suggestedCategory}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#138A5B] text-white">
                    {Math.round(aiPrediction.confidence * 100)}% Confidence
                  </span>
                </div>
                <p className="text-[12px] text-[#46574F] dark:text-[#C1CEC5]">
                  {aiPrediction.guidance}
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1.5 font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>{aiPrediction.safetyNote}</span>
                </p>
              </div>
            )}
          </div>

          {/* Step 2: Category & Severity */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 space-y-5">
            <h3 className="text-[15px] font-extrabold text-[#172B23] dark:text-[#F1F7F3] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0F766E]" />
              <span>Step 2: Category & Urgency</span>
            </h3>

            {/* Category Cards */}
            <div>
              <label className="block text-[12px] font-bold text-[#46574F] dark:text-[#8FA196] uppercase tracking-wider mb-2.5">
                Waste Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {categoryOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCategory(opt.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      category === opt.id
                        ? 'border-[#138A5B] bg-[#EAF5EE] dark:bg-[#1B382B] shadow-sm'
                        : 'border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#1B2922] hover:border-gray-300'
                    }`}
                  >
                    <p className={`text-[12px] font-bold ${category === opt.id ? 'text-[#138A5B] dark:text-[#43D99A]' : 'text-[#172B23] dark:text-[#F1F7F3]'}`}>
                      {opt.label}
                    </p>
                    <p className="text-[10px] text-[#8FA196] truncate mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Cards */}
            <div>
              <label className="block text-[12px] font-bold text-[#46574F] dark:text-[#8FA196] uppercase tracking-wider mb-2.5">
                Severity Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {severityOptions.map((sev) => (
                  <button
                    key={sev.id}
                    type="button"
                    onClick={() => setSeverity(sev.id)}
                    className={`p-3 rounded-2xl border text-center transition-all font-bold text-[12px] ${
                      severity === sev.id
                        ? `${sev.color} ring-2 ring-[#138A5B] shadow-sm`
                        : 'border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#1B2922] text-[#46574F] dark:text-[#C1CEC5]'
                    }`}
                  >
                    {sev.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Location & Description */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-lg shadow-black/5 space-y-5">
            <h3 className="text-[15px] font-extrabold text-[#172B23] dark:text-[#F1F7F3] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#138A5B] dark:text-[#43D99A]" />
              <span>Step 3: Location & Notes</span>
            </h3>

            {/* GPS Trigger */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#F0F5F2] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#141E19] text-[#138A5B] dark:text-[#43D99A] flex items-center justify-center shadow-xs">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#172B23] dark:text-[#F1F7F3]">
                    GPS Pin: {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
                  </p>
                  <p className="text-[11px] text-[#8FA196]">
                    {gpsAcquired ? 'Locked via device browser geolocation' : 'Colombo Municipal default coordinates'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCaptureGps}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#141E19] hover:bg-[#EAF5EE] text-[#138A5B] dark:text-[#43D99A] font-bold text-[12px] border border-[#DFE8E2] dark:border-[#293B31] shadow-xs"
              >
                Use My GPS Location
              </button>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="report-address" className="block text-[12px] font-bold text-[#46574F] dark:text-[#8FA196] mb-1.5">
                Street / Landmark Address
              </label>
              <input
                id="report-address"
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Opposite Viharamahadevi Park, Dharmapala Mawatha"
                className="w-full px-4 py-2.5 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#141E19] text-[13px] text-[#172B23] dark:text-[#F1F7F3] focus:outline-none focus:ring-2 focus:ring-[#138A5B] transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="report-desc" className="block text-[12px] font-bold text-[#46574F] dark:text-[#8FA196] mb-1.5">
                Additional Notes (Optional)
              </label>
              <textarea
                id="report-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention access obstacles, canal blockages, or odor issues..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#141E19] text-[13px] text-[#172B23] dark:text-[#F1F7F3] focus:outline-none focus:ring-2 focus:ring-[#138A5B] transition-all"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#138A5B] hover:bg-[#0E734A] text-white font-bold text-[14px] shadow-lg shadow-[#138A5B]/25 transition-all duration-200 hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Grievance...</span>
              </>
            ) : (
              <>
                <span>Submit Grievance to Municipal Council</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
