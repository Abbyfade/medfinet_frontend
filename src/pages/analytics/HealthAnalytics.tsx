import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Shield, 
  Calendar,
  MapPin,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Activity,
  Zap
} from 'lucide-react';

interface AnalyticsData {
  vaccinationCoverage: {
    overall: number;
    byAge: Array<{ ageGroup: string; coverage: number; target: number }>;
    byVaccine: Array<{ vaccine: string; coverage: number; administered: number; due: number }>;
    trend: Array<{ month: string; coverage: number }>;
  };
  demographics: {
    totalChildren: number;
    newRegistrations: number;
    ageDistribution: Array<{ ageGroup: string; count: number; percentage: number }>;
    genderDistribution: Array<{ gender: string; count: number; percentage: number }>;
  };
  geographicData: {
    regions: Array<{ 
      name: string; 
      coverage: number; 
      population: number; 
      clinics: number;
      riskLevel: 'low' | 'medium' | 'high';
    }>;
  };
  healthWorkerMetrics: {
    totalWorkers: number;
    activeWorkers: number;
    averageVaccinesPerWorker: number;
    topPerformers: Array<{ name: string; vaccinesIssued: number; rating: number }>;
  };
  predictiveInsights: {
    outbreakRisk: Array<{ disease: string; riskLevel: number; affectedAreas: string[] }>;
    demandForecast: Array<{ vaccine: string; predictedDemand: number; currentStock: number }>;
    seasonalTrends: Array<{ period: string; expectedIncrease: number; vaccines: string[] }>;
  };
}

const HealthAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedTimeRange, selectedRegion]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockData: AnalyticsData = {
      vaccinationCoverage: {
        overall: 94.2,
        byAge: [
          { ageGroup: '0-6 months', coverage: 98.5, target: 95 },
          { ageGroup: '6-12 months', coverage: 96.2, target: 95 },
          { ageGroup: '1-2 years', coverage: 94.8, target: 95 },
          { ageGroup: '2-5 years', coverage: 92.1, target: 90 },
          { ageGroup: '5+ years', coverage: 89.7, target: 85 }
        ],
        byVaccine: [
          { vaccine: 'DTaP', coverage: 96.5, administered: 1847, due: 67 },
          { vaccine: 'MMR', coverage: 94.2, administered: 1523, due: 94 },
          { vaccine: 'Polio', coverage: 97.1, administered: 1689, due: 51 },
          { vaccine: 'Hepatitis B', coverage: 93.8, administered: 1456, due: 96 },
          { vaccine: 'Influenza', coverage: 78.4, administered: 1234, due: 342 }
        ],
        trend: [
          { month: 'Jan', coverage: 91.2 },
          { month: 'Feb', coverage: 92.1 },
          { month: 'Mar', coverage: 93.4 },
          { month: 'Apr', coverage: 94.2 },
          { month: 'May', coverage: 94.8 },
          { month: 'Jun', coverage: 94.2 }
        ]
      },
      demographics: {
        totalChildren: 2847,
        newRegistrations: 156,
        ageDistribution: [
          { ageGroup: '0-6 months', count: 423, percentage: 14.9 },
          { ageGroup: '6-12 months', count: 567, percentage: 19.9 },
          { ageGroup: '1-2 years', count: 634, percentage: 22.3 },
          { ageGroup: '2-5 years', count: 789, percentage: 27.7 },
          { ageGroup: '5+ years', count: 434, percentage: 15.2 }
        ],
        genderDistribution: [
          { gender: 'Male', count: 1456, percentage: 51.1 },
          { gender: 'Female', count: 1391, percentage: 48.9 }
        ]
      },
      geographicData: {
        regions: [
          { name: 'Manhattan', coverage: 96.2, population: 1234, clinics: 8, riskLevel: 'low' },
          { name: 'Brooklyn', coverage: 93.8, population: 987, clinics: 6, riskLevel: 'medium' },
          { name: 'Queens', coverage: 91.5, population: 456, clinics: 4, riskLevel: 'medium' },
          { name: 'Bronx', coverage: 89.3, population: 234, clinics: 3, riskLevel: 'high' }
        ]
      },
      healthWorkerMetrics: {
        totalWorkers: 247,
        activeWorkers: 231,
        averageVaccinesPerWorker: 12.4,
        topPerformers: [
          { name: 'Dr. Sarah Johnson', vaccinesIssued: 89, rating: 4.9 },
          { name: 'Nurse Maria Rodriguez', vaccinesIssued: 76, rating: 4.8 },
          { name: 'Dr. Michael Chen', vaccinesIssued: 71, rating: 4.7 }
        ]
      },
      predictiveInsights: {
        outbreakRisk: [
          { disease: 'Influenza', riskLevel: 0.7, affectedAreas: ['Brooklyn', 'Queens'] },
          { disease: 'Measles', riskLevel: 0.3, affectedAreas: ['Bronx'] },
          { disease: 'Pertussis', riskLevel: 0.2, affectedAreas: ['Staten Island'] }
        ],
        demandForecast: [
          { vaccine: 'Influenza', predictedDemand: 1200, currentStock: 800 },
          { vaccine: 'DTaP', predictedDemand: 450, currentStock: 600 },
          { vaccine: 'MMR', predictedDemand: 320, currentStock: 400 }
        ],
        seasonalTrends: [
          { period: 'Fall 2024', expectedIncrease: 35, vaccines: ['Influenza', 'COVID-19'] },
          { period: 'Spring 2025', expectedIncrease: 20, vaccines: ['MMR', 'DTaP'] }
        ]
      }
    };

    setAnalyticsData(mockData);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const handleRefresh = () => {
    loadAnalyticsData();
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting analytics data...');
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-success-600 bg-success-50 border-success-200';
      case 'medium': return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'high': return 'text-error-600 bg-error-50 border-error-200';
      default: return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  if (isLoading || !analyticsData) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-300">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                Health Analytics Dashboard
              </h1>
              <p className="text-neutral-600 dark:text-neutral-300">
                Comprehensive insights into vaccination coverage and health trends
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                <Clock className="h-4 w-4 mr-1" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Filter className="h-4 w-4 text-neutral-500 mr-2" />
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Filters:</span>
              </div>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-1 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700 dark:text-white"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-1 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm dark:bg-neutral-700 dark:text-white"
              >
                <option value="all">All Regions</option>
                <option value="manhattan">Manhattan</option>
                <option value="brooklyn">Brooklyn</option>
                <option value="queens">Queens</option>
                <option value="bronx">Bronx</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Overall Coverage</p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                  {analyticsData.vaccinationCoverage.overall}%
                </p>
              </div>
              <div className="bg-success-100 dark:bg-success-900/20 p-3 rounded-full">
                <Target className="h-6 w-6 text-success-600 dark:text-success-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-success-600 dark:text-success-400">
              <TrendingUp className="h-4 w-4 mr-1" />
              +2.1% from last month
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Children</p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                  {analyticsData.demographics.totalChildren.toLocaleString()}
                </p>
              </div>
              <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-primary-600 dark:text-primary-400">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{analyticsData.demographics.newRegistrations} new this month
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Active Health Workers</p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                  {analyticsData.healthWorkerMetrics.activeWorkers}
                </p>
              </div>
              <div className="bg-secondary-100 dark:bg-secondary-900/20 p-3 rounded-full">
                <Activity className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-secondary-600 dark:text-secondary-400">
              <Zap className="h-4 w-4 mr-1" />
              {analyticsData.healthWorkerMetrics.averageVaccinesPerWorker} avg vaccines/worker
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">High Risk Areas</p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                  {analyticsData.geographicData.regions.filter(r => r.riskLevel === 'high').length}
                </p>
              </div>
              <div className="bg-warning-100 dark:bg-warning-900/20 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-warning-600 dark:text-warning-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-warning-600 dark:text-warning-400">
              <MapPin className="h-4 w-4 mr-1" />
              Requires attention
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Vaccination Coverage by Age */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Vaccination Coverage by Age Group
            </h3>
            <div className="space-y-4">
              {analyticsData.vaccinationCoverage.byAge.map((item) => (
                <div key={item.ageGroup} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {item.ageGroup}
                  </span>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.coverage >= item.target ? 'bg-success-500' : 'bg-warning-500'
                        }`}
                        style={{ width: `${Math.min(item.coverage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white w-12 text-right">
                      {item.coverage}%
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      (Target: {item.target}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Coverage */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Regional Coverage & Risk Assessment
            </h3>
            <div className="space-y-4">
              {analyticsData.geographicData.regions.map((region) => (
                <div key={region.name} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-neutral-500 mr-2" />
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">{region.name}</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {region.population} children • {region.clinics} clinics
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-neutral-900 dark:text-white">
                      {region.coverage}%
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(region.riskLevel)}`}>
                      {region.riskLevel} risk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vaccine-Specific Analytics */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Vaccine-Specific Coverage
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Vaccine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Coverage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Administered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Due
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                {analyticsData.vaccinationCoverage.byVaccine.map((vaccine) => (
                  <tr key={vaccine.vaccine} className="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-white">
                      {vaccine.vaccine}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mr-3">
                          <div
                            className={`h-2 rounded-full ${
                              vaccine.coverage >= 95 ? 'bg-success-500' : 
                              vaccine.coverage >= 85 ? 'bg-warning-500' : 'bg-error-500'
                            }`}
                            style={{ width: `${Math.min(vaccine.coverage, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {vaccine.coverage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
                      {vaccine.administered.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
                      {vaccine.due}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vaccine.coverage >= 95 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          On Target
                        </span>
                      ) : vaccine.coverage >= 85 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Needs Attention
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Critical
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Predictive Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Outbreak Risk Assessment */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Outbreak Risk Assessment
            </h3>
            <div className="space-y-4">
              {analyticsData.predictiveInsights.outbreakRisk.map((risk) => (
                <div key={risk.disease} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">{risk.disease}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Affected areas: {risk.affectedAreas.join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 bg-neutral-200 dark:bg-neutral-600 rounded-full h-2 mr-3">
                      <div
                        className={`h-2 rounded-full ${
                          risk.riskLevel >= 0.7 ? 'bg-error-500' : 
                          risk.riskLevel >= 0.4 ? 'bg-warning-500' : 'bg-success-500'
                        }`}
                        style={{ width: `${risk.riskLevel * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      {Math.round(risk.riskLevel * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demand Forecast */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Vaccine Demand Forecast
            </h3>
            <div className="space-y-4">
              {analyticsData.predictiveInsights.demandForecast.map((forecast) => (
                <div key={forecast.vaccine} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">{forecast.vaccine}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Current stock: {forecast.currentStock}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-neutral-900 dark:text-white">
                      {forecast.predictedDemand}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">predicted demand</p>
                    {forecast.predictedDemand > forecast.currentStock && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800 mt-1">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Low Stock
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAnalytics;