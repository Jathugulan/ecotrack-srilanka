import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AuthProvider, useAuth } from './context/AuthContext.js';
import { LanguageProvider } from './context/LanguageContext.js';

import { Navbar } from './components/Navbar.js';
import { Sidebar } from './components/Sidebar.js';
import { Footer } from './components/Footer.js';

import { LandingPage } from './pages/LandingPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { WasteSegregationGuide } from './pages/WasteSegregationGuide.js';
import { RecyclingLocatorPage } from './pages/RecyclingLocatorPage.js';

import { ResidentDashboard } from './pages/resident/ResidentDashboard.js';
import { ReportWastePage } from './pages/resident/ReportWastePage.js';
import { MyReportsPage } from './pages/resident/MyReportsPage.js';
import { CollectionCalendarPage } from './pages/resident/CollectionCalendarPage.js';
import { RewardsPage } from './pages/resident/RewardsPage.js';

import { MunicipalDashboard } from './pages/municipal/MunicipalDashboard.js';
import { ComplaintsManagementPage } from './pages/municipal/ComplaintsManagementPage.js';
import { InteractiveMapPage } from './pages/municipal/InteractiveMapPage.js';
import { SchedulesManagementPage } from './pages/municipal/SchedulesManagementPage.js';

import { WorkerDashboard } from './pages/worker/WorkerDashboard.js';
import { PartnerDashboard } from './pages/partner/PartnerDashboard.js';
import { AdminDashboard } from './pages/admin/AdminDashboard.js';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isPublicPage = ['/', '/login', '/register', '/how-it-works', '/waste-segregation', '/recycling-locator'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F5] dark:bg-darkSurface-canvas transition-colors">
      <Navbar />

      <div className="flex-1 flex">
        {user && !isPublicPage && <Sidebar />}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>

      {isPublicPage && <Footer />}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Toaster richColors position="top-right" />
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/how-it-works" element={<LandingPage />} />
              <Route path="/waste-segregation" element={<WasteSegregationGuide />} />
              <Route path="/recycling-locator" element={<RecyclingLocatorPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Resident Routes */}
              <Route path="/resident/dashboard" element={<ResidentDashboard />} />
              <Route path="/resident/report-waste" element={<ReportWastePage />} />
              <Route path="/resident/reports" element={<MyReportsPage />} />
              <Route path="/resident/calendar" element={<CollectionCalendarPage />} />
              <Route path="/resident/rewards" element={<RewardsPage />} />

              {/* Municipal Routes */}
              <Route path="/municipal/dashboard" element={<MunicipalDashboard />} />
              <Route path="/municipal/complaints" element={<ComplaintsManagementPage />} />
              <Route path="/municipal/map" element={<InteractiveMapPage />} />
              <Route path="/municipal/schedules" element={<SchedulesManagementPage />} />

              {/* Worker & Driver Routes */}
              <Route path="/worker/dashboard" element={<WorkerDashboard />} />

              {/* Recycling Partner Routes */}
              <Route path="/partner/dashboard" element={<PartnerDashboard />} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
