import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Filter,
  Users,
  Shield,
  Building,
  Activity,
  FileText,
  Mail,
  Globe
} from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  totalVaccinations: number;
  totalFacilities: number;
  coverageRate: number;
  monthlyGrowth: number;
  regionData: Array<{
    region: string;
    vaccinations: number;
    coverage: number;
  }>;
  vaccineTypes: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    vaccinations: number;
    newUsers: number;
  }>;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'vaccination' | 'user' | 'facility' | 'financial';
  format: 'pdf' | 'csv' | 'excel';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  lastGenerated: string;
  status: 'active' | 'inactive';
}

const AnalyticsReports = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'exports'>('dashboard');
  const [dateRange, setDateRange] = useState('30');
  const [regionFilter, setRegionFilter] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const [analytics] = useState<AnalyticsData>({
    totalUsers: 2847,
    totalVaccinations: 5234,
    totalFacilities: 12,
    coverageRate: 94.2,
    monthlyGrowth: 15.3,
    regionData: [
      { region: 'Manhattan', vaccinations: 1847, coverage: 96.2 },
      { region: 'Brooklyn', vaccinations: 1523, coverage: 93.8 },
      { region: 'Queens', vaccinations: 1234, coverage: 91.5 },
      { region: 'Bronx', vaccinations: 630, coverage: 89.3 }
    ],
    vaccineTypes: [
      { name: 'DTaP', count: 1567, percentage: 29.9 },
      { name: 'MMR', count: 1234, percentage: 23.6 },
      { name: 'Hepatitis B', count: 987, percentage: 18.9 },
      { name: 'Polio', count: 876, percentage: 16.7 },
      { name: 'Other', count: 570, percentage: 10.9 }
    ],
    monthlyTrends: [
      { month: 'Jan', vaccinations: 423, newUsers: 67 },
      { month: 'Feb', vaccinations: 456, newUsers: 78 },
      { month: 'Mar', vaccinations: 534, newUsers: 89 },
      { month: 'Apr', vaccinations: 623, newUsers: 102 },
      { month: 'May', vaccinations: 687, newUsers: 118 },
      { month: 'Jun', vaccinations: 734, newUsers: 125 }
    ]
  });

  const [reportTemplates] = useState<ReportTemplate[]>([
    {
      id: 'rpt_001',
      name: 'Monthly Vaccination Report',
      description: 'Comprehensive monthly vaccination statistics and coverage analysis',
      type: 'vaccination',
      format: 'pdf',
      frequency: 'monthly',
      recipients: ['admin@medfi.net', 'health@ministry.gov'],
      lastGenerated: '2024-01-15',
      status: 'active'
    },
    {
      id: 'rpt_002',
      name: 'User Registration Analytics',
      description: 'User growth and engagement metrics across all platforms',
      type: 'user',
      format: 'excel',
      frequency: 'weekly',
      recipients: ['analytics@medfi.net'],
      lastGenerated: '2024-01-20',
      status: 'active'
    },
    {
      id: 'rpt_003',
      name: 'Facility Performance Dashboard',
      description: 'Operational metrics and performance indicators for all facilities',
      type: 'facility',
      format: 'csv',
      frequency: 'daily',
      recipients: ['operations@medfi.net', 'managers@medfi.net'],
      lastGenerated: '2024-01-21',
      status: 'active'
    }
  ]);

  const handleGenerateReport = async (templateId: string) => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    console.log('Generated report for template:', templateId);
  };

  const handleExportData = async (format: string) => {
    setIsGenerating(true);
    // Simulate data export
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGenerating(false);
    console.log('Exported data in format:', format);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Users</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {analytics.totalUsers.toLocaleString()}
              </p>
            </div>
            <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600 dark:text-success-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            +{analytics.monthlyGrowth}% this month
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Vaccinations</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {analytics.totalVaccinations.toLocaleString()}
              </p>
            </div>
            <div className="bg-secondary-100 dark:bg-secondary-900/20 p-3 rounded-full">
              <Shield className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600 dark:text-success-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            +18% this month
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Coverage Rate</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {analytics.coverageRate}%
              </p>
            </div>
            <div className="bg-accent-100 dark:bg-accent-900/20 p-3 rounded-full">
              <Activity className="h-6 w-6 text-accent-600 dark:text-accent-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600 dark:text-success-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            +2.3% this month
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Active Facilities</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {analytics.totalFacilities}
              </p>
            </div>
            <div className="bg-success-100 dark:bg-success-900/20 p-3 rounded-full">
              <Building className="h-6 w-6 text-success-600 dark:text-success-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-neutral-600 dark:text-neutral-400">
            <Building className="h-4 w-4 mr-1" />
            All operational
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Monthly Trends
          </h3>
          <div className="h-64 bg-neutral-50 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-neutral-400 mx-auto mb-2" />
              <p className="text-neutral-500 dark:text-neutral-400">Chart visualization would go here</p>
            </div>
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Regional Coverage
          </h3>
          <div className="space-y-4">
            {analytics.regionData.map((region) => (
              <div key={region.region} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {region.region}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {region.vaccinations} vaccines
                  </span>
                  <span className="text-sm font-medium text-success-600 dark:text-success-400">
                    {region.coverage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vaccine Distribution */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Vaccine Type Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {analytics.vaccineTypes.map((vaccine) => (
            <div key={vaccine.name} className="text-center p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{vaccine.count}</p>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{vaccine.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{vaccine.percentage}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Report Templates */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Report Templates
            </h3>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
              <FileText className="h-4 w-4 mr-2" />
              New Template
            </button>
          </div>
        </div>

        <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {reportTemplates.map((template) => (
            <div key={template.id} className="p-6 hover:bg-neutral-50 dark:hover:bg-neutral-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="text-lg font-medium text-neutral-900 dark:text-white mr-3">
                      {template.name}
                    </h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      template.status === 'active' 
                        ? 'text-success-600 bg-success-50 border border-success-200' 
                        : 'text-neutral-600 bg-neutral-50 border border-neutral-200'
                    }`}>
                      {template.status}
                    </span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-3">
                    {template.description}
                  </p>
                  <div className="flex items-center space-x-6 text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {template.format.toUpperCase()}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {template.frequency}
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {template.recipients.length} recipients
                    </div>
                    <div>
                      Last: {new Date(template.lastGenerated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleGenerateReport(template.id)}
                    disabled={isGenerating}
                    className="bg-secondary-600 hover:bg-secondary-700 disabled:bg-secondary-400 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
                  >
                    {isGenerating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Generate
                  </button>
                  <button className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-300 p-2">
                    <FileText className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderExports = () => (
    <div className="space-y-6">
      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-primary-100 dark:bg-primary-900/20 p-2 rounded-lg mr-3">
              <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              User Data Export
            </h3>
          </div>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            Export comprehensive user registration and activity data
          </p>
          <div className="space-y-2">
            <button
              onClick={() => handleExportData('csv')}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Export as CSV
            </button>
            <button
              onClick={() => handleExportData('excel')}
              className="w-full bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Export as Excel
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-secondary-100 dark:bg-secondary-900/20 p-2 rounded-lg mr-3">
              <Shield className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Vaccination Records
            </h3>
          </div>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            Export vaccination records and immunization data
          </p>
          <div className="space-y-2">
            <button
              onClick={() => handleExportData('pdf')}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Export as PDF
            </button>
            <button
              onClick={() => handleExportData('csv')}
              className="w-full bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Export as CSV
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-accent-100 dark:bg-accent-900/20 p-2 rounded-lg mr-3">
              <Building className="h-5 w-5 text-accent-600 dark:text-accent-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Facility Analytics
            </h3>
          </div>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            Export facility performance and operational metrics
          </p>
          <div className="space-y-2">
            <button
              onClick={() => handleExportData('excel')}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Export as Excel
            </button>
            <button
              onClick={() => handleExportData('json')}
              className="w-full bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Export as JSON
            </button>
          </div>
        </div>
      </div>

      {/* Custom Export */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Custom Data Export
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Data Type
            </label>
            <select className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white">
              <option value="all">All Data</option>
              <option value="users">Users Only</option>
              <option value="vaccinations">Vaccinations Only</option>
              <option value="facilities">Facilities Only</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Format
            </label>
            <select className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white">
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="json">JSON</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={() => handleExportData('custom')}
          disabled={isGenerating}
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-6 py-2 rounded-md font-medium flex items-center transition-colors"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Generate Custom Export
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Analytics & Reports
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Comprehensive analytics dashboard and automated reporting system
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'dashboard', label: 'Analytics Dashboard', icon: BarChart3 },
            { id: 'reports', label: 'Automated Reports', icon: FileText },
            { id: 'exports', label: 'Data Exports', icon: Download }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'reports' && renderReports()}
      {activeTab === 'exports' && renderExports()}
    </div>
  );
};

export default AnalyticsReports;