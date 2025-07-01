import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import HealthWorkerLayout from './layouts/HealthWorkerLayout';
import LandingPage from './pages/landing/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import ChildProfiles from './pages/immunization/ChildProfiles';
import VaccinationHistory from './pages/immunization/VaccinationHistory';
import HealthCenters from './pages/immunization/HealthCenters';
import EducationResources from './pages/immunization/EducationResources';
import InvoiceUpload from './pages/finance/InvoiceUpload';
import InvoiceMarketplace from './pages/finance/InvoiceMarketplace';
import InvoiceDetails from './pages/finance/InvoiceDetails';
import FundingSuccess from './pages/finance/FundingSuccess';
import NotificationsPage from './pages/common/NotificationsPage';
import UserProfile from './pages/common/UserProfile';
import { UserProvider } from './contexts/UserContext';
import { HealthWorkerProvider } from './contexts/HealthWorkerContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Health Worker Pages
import HealthWorkerLogin from './pages/health-worker/HealthWorkerLogin';
import HealthWorkerRegistration from './pages/health-worker/HealthWorkerRegistration';
import HealthWorkerDashboard from './pages/health-worker/HealthWorkerDashboard';
import IssueVaccine from './pages/health-worker/IssueVaccine';
import LinkParent from './pages/health-worker/LinkParent';
import VaccinationHistoryHW from './pages/health-worker/VaccinationHistory';
import FacilityProfile from './pages/health-worker/FacilityProfile';

function App() {
  return (
    <ThemeProvider>
      <HealthWorkerProvider>
        <UserProvider>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Health Worker Auth Routes */}
            <Route path="/health-worker/login" element={<HealthWorkerLogin />} />
            <Route path="/health-worker/register" element={<HealthWorkerRegistration />} />

            {/* Health Worker Protected Routes */}
            <Route element={<HealthWorkerLayout />}>
              <Route path="/health-worker/dashboard" element={<HealthWorkerDashboard />} />
              <Route path="/health-worker/issue-vaccine" element={<IssueVaccine />} />
              <Route path="/health-worker/link-parent" element={<LinkParent />} />
              <Route path="/health-worker/vaccination-history" element={<VaccinationHistoryHW />} />
              <Route path="/health-worker/facility-profile" element={<FacilityProfile />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              
              {/* Immunization Routes */}
              <Route path="/profiles" element={<ChildProfiles />} />
              <Route path="/vaccination-history/:id" element={<VaccinationHistory />} />
              <Route path="/health-centers" element={<HealthCenters />} />
              <Route path="/education" element={<EducationResources />} />
              
              {/* Finance Routes */}
              <Route path="/invoice/upload" element={<InvoiceUpload />} />
              <Route path="/invoice/marketplace" element={<InvoiceMarketplace />} />
              <Route path="/invoice/:id" element={<InvoiceDetails />} />
              <Route path="/funding/success" element={<FundingSuccess />} />
              
              {/* Common Routes */}
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>
          </Routes>
        </UserProvider>
      </HealthWorkerProvider>
    </ThemeProvider>
  );
}

export default App;