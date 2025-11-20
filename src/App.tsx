// export default App;
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import HealthWorkerLayout from './layouts/HealthWorkerLayout';
import AdminLayout from './layouts/AdminLayout';
import LandingPage from './pages/landing/LandingPage';
import FeaturesPage from './pages/landing/FeaturesPage';
import HowItWorksPage from './pages/landing/HowItWorksPage';
import TestimonialsPage from './pages/landing/TestimonialsPage';
import ApiPage from './pages/landing/ApiPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import ChildProfiles from './pages/immunization/ChildProfiles';
import VaccinationHistory from './pages/immunization/VaccinationHistory';
import VaccinationQRCode from './pages/immunization/VaccinationQRCode';
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
import HospitalRegistration from './pages/hospital/HospitalRegistration';
import HealthWorkerDashboard from './pages/health-worker/HealthWorkerDashboard';
import IssueVaccine from './pages/health-worker/IssueVaccine';
import LinkParent from './pages/health-worker/LinkParent';
import VaccinationHistoryHW from './pages/health-worker/VaccinationHistory';
import FacilityProfile from './pages/health-worker/FacilityProfile';
import OfflineAccess from './pages/health-worker/OfflineAccess';

// Admin Pages
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import UserManagement from './admin/pages/UserManagement';
import VaccinationOversight from './admin/pages/VaccinationOversight';
import VaccineManagement from './admin/pages/VaccineManagement';
import AnalyticsReports from './admin/pages/AnalyticsReports';
import APIManagement from './admin/pages/APIManagement';

// New Feature Pages
import AIHealthAssistant from './pages/ai/AIHealthAssistant';
import HealthAnalytics from './pages/analytics/HealthAnalytics';
import AppointmentScheduling from './pages/appointments/AppointmentScheduling';
import TelemedicineConsultation from './pages/telemedicine/TelemedicineConsultation';
import InsuranceManagement from './pages/insurance/InsuranceManagement';
import PaymentPage from './pages/finance/PaymentPage';

// API Integration Pages
import ApiIntegrationDashboard from './pages/api-integration/ApiIntegrationDashboard';
import StripeIntegration from './pages/api-integration/StripeIntegration';
import TwilioIntegration from './pages/api-integration/TwilioIntegration';

// Design Pages
import CanvaDesignStudio from './pages/design/CanvaDesignStudio';
import VaccinationCertificateDesigner from './pages/design/VaccinationCertificateDesigner';
import EducationalMaterialsDesigner from './pages/design/EducationalMaterialsDesigner';

// API Documentation Page
import ApiDocumentationPage from './pages/api-documentation/ApiDocumentationPage';
import ApiViewer from './pages/api/ApiViewer';

// API Examples
import ApiExamplesIndex from './pages/api-examples/index';
import FhirApiExample from './pages/api-examples/FhirApiExample';
import CdcApiExample from './pages/api-examples/CdcApiExample';
import OpenAiApiExample from './pages/api-examples/OpenAiApiExample';
import HealthMapApiExample from './pages/api-examples/HealthMapApiExample';
import VaccinationApiExample from './pages/api-examples/VaccinationApiExample';
import BlockchainVerificationExample from './pages/api-examples/BlockchainVerificationExample';

// HealthFinance Pages
import HealthFinancePage from './pages/healthfinance/HealthFinancePage';
import ClinicDashboard from './pages/healthfinance/ClinicDashboard';

// Infographic Pages
import MedFiNetFlowchart from './pages/infographic/MedFiNetFlowchart';

function App() {
  return (
    <ThemeProvider>
      <HealthWorkerProvider>
        <UserProvider>
          <Routes>
            {/* Landing Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/api" element={<ApiPage />} />

            {/* Infographic */}
            <Route path="/medfi-flowchart" element={<MedFiNetFlowchart />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* HealthFinance Routes */}
            <Route path="/healthfinance" element={<HealthFinancePage />} />

            {/* Health Worker Auth Routes */}
            <Route path="/health-worker/login" element={<HealthWorkerLogin />} />
            <Route path="/health-worker/register" element={<HealthWorkerRegistration />} />

            {/* Hospital Registration Route */}
            <Route path="/hospital/register" element={<HospitalRegistration />} />

            {/* Health Worker Protected Routes */}
            <Route path="/health-worker/*" element={<HealthWorkerLayout />}>
              <Route path="dashboard" element={<HealthWorkerDashboard />} />
              <Route path="issue-vaccine" element={<IssueVaccine />} />
              <Route path="link-parent" element={<LinkParent />} />
              <Route path="vaccination-history" element={<VaccinationHistoryHW />} />
              <Route path="facility-profile" element={<FacilityProfile />} />
              <Route path="appointments" element={<AppointmentScheduling />} />
              <Route path="telemedicine" element={<TelemedicineConsultation />} />
              <Route path="analytics" element={<HealthAnalytics />} />
              <Route path="offline-access" element={<OfflineAccess />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/*" >
              <Route index element={<Navigate to="login" replace />} />
              <Route path="login" element={<AdminLogin />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="vaccinations" element={<VaccinationOversight />} />
              <Route path="vaccines" element={<VaccineManagement />} />
              <Route path="analytics" element={<AnalyticsReports />} />
              <Route path="api" element={<APIManagement />} />
              <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold text-neutral-900 dark:text-white">System Settings</h1><p className="text-neutral-600 dark:text-neutral-300">Settings panel coming soon...</p></div>} />
            </Route>

            {/* Protected Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              
              {/* Immunization Routes */}
              <Route path="/profiles" element={<ChildProfiles />} />
              <Route path="/vaccination-history/:id" element={<VaccinationHistory />} />
              <Route path="/vaccination-qrcode/:id" element={<VaccinationQRCode />} />
              <Route path="/health-centers" element={<HealthCenters />} />
              <Route path="/education" element={<EducationResources />} />
              
              {/* Finance Routes */}
              <Route path="/invoice/upload" element={<InvoiceUpload />} />
              <Route path="/invoice/marketplace" element={<InvoiceMarketplace />} />
              <Route path="/invoice/:id" element={<InvoiceDetails />} />
              <Route path="/funding/success" element={<FundingSuccess />} />
              <Route path="/finance/payment" element={<PaymentPage />} />
              
              {/* Common Routes */}
              <Route path="/notifications" element={<NotificationsPage />} />
              
              {/* New Feature Routes */}
              <Route path="/ai-assistant" element={<AIHealthAssistant />} />
              <Route path="/analytics" element={<HealthAnalytics />} />
              <Route path="/appointments" element={<AppointmentScheduling />} />
              <Route path="/telemedicine" element={<TelemedicineConsultation />} />
              <Route path="/insurance" element={<InsuranceManagement />} />
              
              {/* API Integration Routes */}
              <Route path="/api-integration" element={<ApiIntegrationDashboard />} />
              <Route path="/api-integration/stripe" element={<StripeIntegration />} />
              <Route path="/api-integration/twilio" element={<TwilioIntegration />} />
              
              {/* Design Routes */}
              <Route path="/design/studio" element={<CanvaDesignStudio />} />
              <Route path="/design/certificate/:childId/:vaccinationId" element={<VaccinationCertificateDesigner />} />
              <Route path="/design/educational-materials" element={<EducationalMaterialsDesigner />} />
              
              {/* API Documentation */}
              <Route path="/api-documentation" element={<ApiDocumentationPage />} />
              
              {/* API Viewer */}
              <Route path="/api-viewer" element={<ApiViewer />} />
              
              {/* API Examples */}
              <Route path="/api-examples" element={<ApiExamplesIndex />} />
              <Route path="/api-examples/fhir" element={<FhirApiExample />} />
              <Route path="/api-examples/cdc" element={<CdcApiExample />} />
              <Route path="/api-examples/openai" element={<OpenAiApiExample />} />
              <Route path="/api-examples/mapbox" element={<HealthMapApiExample />} />
              <Route path="/api-examples/vaccine" element={<VaccinationApiExample />} />
              <Route path="/api-examples/blockchain" element={<BlockchainVerificationExample />} />
            </Route>
          </Routes>
        </UserProvider>
      </HealthWorkerProvider>
    </ThemeProvider>
  );
}

export default App;