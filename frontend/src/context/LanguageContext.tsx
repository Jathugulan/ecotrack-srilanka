import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'si' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    appName: 'EcoTrack Sri Lanka',
    tagline: 'AI-Powered Smart Waste Management Platform',
    heroTitle: 'A Cleaner Sri Lanka Starts With You',
    heroSubtitle: 'Empowering citizens with GPS waste reporting & verified recycling rewards, while optimizing municipal operations across Sri Lanka.',
    reportWaste: 'Report Waste',
    exploreRecycling: 'Recycling Centers',
    howItWorks: 'How It Works',
    wasteGuide: 'Segregation Guide',
    signIn: 'Sign In',
    register: 'Get Started',
    signOut: 'Sign Out',
    dashboard: 'Dashboard',
    myReports: 'My Complaints',
    schedules: 'Collection Calendar',
    rewards: 'Rewards & Points',
    operations: 'Operations Console',
    fieldTasks: 'Field Manifest',
    partnerTerminal: 'Partner Depot',
    systemAdmin: 'System Administration',
    language: 'Language',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    activeComplaints: 'Active Complaints',
    resolvedComplaints: 'Resolved Complaints',
    pointsEarned: 'Verified Green Points',
    quickReport: 'Report Illegal Dumping',
    status: 'Status',
    category: 'Category',
    severity: 'Severity',
    location: 'Location',
    actions: 'Actions',
  },
  si: {
    appName: 'ඊකෝට්‍රැක් ශ්‍රී ලංකා',
    tagline: 'ස්මාර්ට් අපද්‍රව්‍ය කළමනාකරණ පද්ධතිය',
    heroTitle: 'පිරිසිදු ශ්‍රී ලංකාවක් ඔබෙන් ඇරඹේ',
    heroSubtitle: 'ඡායාරූප සහ GPS මඟින් අපද්‍රව්‍ය ගැටලු වාර්තා කර තහවුරු කළ ප්‍රතිචක්‍රීකරණ ත්‍යාග ලකුණු දිනාගන්න.',
    reportWaste: 'කසළ වාර්තා කරන්න',
    exploreRecycling: 'ප්‍රතිචක්‍රීකරණ මධ්‍යස්ථාන',
    howItWorks: 'ක්‍රියාකාරීත්වය',
    wasteGuide: 'වෙන්කිරීමේ මාර්ගෝපදේශ',
    signIn: 'ඇතුල් වන්න',
    register: 'ලියාපදිංචි වන්න',
    signOut: 'පිටවන්න',
    dashboard: 'පාලක පුවරුව',
    myReports: 'මගේ පැමිණිලි',
    schedules: 'එකතු කිරීමේ දින දර්ශනය',
    rewards: 'ත්‍යාග ලකුණු',
    operations: 'මෙහෙයුම් කළමනාකරණය',
    fieldTasks: 'ක්ෂේත්‍ර කාර්යයන්',
    partnerTerminal: 'හවුල්කාර පර්යන්තය',
    systemAdmin: 'පද්ධති පරිපාලනය',
    language: 'භාෂාව',
    lightMode: 'ආලෝක ප්‍රකාරය',
    darkMode: 'අඳුරු ප්‍රකාරය',
    activeComplaints: 'ක්‍රියාකාරී පැමිණිලි',
    resolvedComplaints: 'විසඳූ පැමිණිලි',
    pointsEarned: 'හරිත ලකුණු',
    quickReport: 'අපද්‍රව්‍ය වාර්තා කරන්න',
    status: 'තත්ත්වය',
    category: 'කාණ්ඩය',
    severity: 'බරපතලකම',
    location: 'ස්ථානය',
    actions: 'ක්‍රියාමාර්ග',
  },
  ta: {
    appName: 'ஈகோட்ராக் இலங்கை',
    tagline: 'செயற்கை நுண்ணறிவு ஸ்மார்ட் கழிவு மேலாண்மை அமைப்பு',
    heroTitle: 'தூய்மையான இலங்கை உங்களிடமிருந்து தொடங்குகிறது',
    heroSubtitle: 'ஜிபிஎஸ் மற்றும் புகைப்படங்கள் மூலம் கழிவுகளை புகாரளித்து மறுசுழற்சி வெகுமதிகளைப் பெறுங்கள்.',
    reportWaste: 'கழிவை புகாரளிக்கவும்',
    exploreRecycling: 'மறுசுழற்சி மையங்கள்',
    howItWorks: 'செயல்படும் விதம்',
    wasteGuide: 'கழிவு பிரிப்பு வழிகாட்டி',
    signIn: 'உள்நுழைக',
    register: 'தொடங்கவும்',
    signOut: 'வெளியேறுக',
    dashboard: 'முகப்பு பலகை',
    myReports: 'எனது புகார்கள்',
    schedules: 'சேகரிப்பு நாட்காட்டி',
    rewards: 'வெகுமதி புள்ளிகள்',
    operations: 'நகர செயல்பாடுகள்',
    fieldTasks: 'கள பணிகள்',
    partnerTerminal: 'கூட்டாளி மையம்',
    systemAdmin: 'கணினி நிர்வாகம்',
    language: 'மொழி',
    lightMode: 'வெளிச்ச முறை',
    darkMode: 'இருண்ட முறை',
    activeComplaints: 'செயலில் உள்ள புகார்கள்',
    resolvedComplaints: 'தீர்க்கப்பட்ட புகார்கள்',
    pointsEarned: 'பசுமை புள்ளிகள்',
    quickReport: 'கழிவை புகாரளிக்கவும்',
    status: 'நிலை',
    category: 'வகை',
    severity: 'தீவிரம்',
    location: 'இடம்',
    actions: 'செயல்கள்',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('ecotrack_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ecotrack_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
