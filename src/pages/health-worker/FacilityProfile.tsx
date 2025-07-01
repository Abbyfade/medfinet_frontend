import { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  Shield, 
  MapPin, 
  Phone, 
  Mail,
  TrendingUp,
  Calendar,
  Award,
  Activity
} from 'lucide-react';
import { Facility } from '../../types/healthWorker';
import { useHealthWorker } from '../../contexts/HealthWorkerContext';

// Mock facility data
const mockFacility: Facility = {
  id: 'fac_001',
  name: 'City Pediatrics Medical Center',
  address: '123 Healthcare Drive, Medical District, NY 10001',
  type: 'clinic',
  healthWorkers: ['hw_001', 'hw_002', 'hw_003', 'hw_004'],
  totalVaccinesIssued: 1247,
  childrenServed: 856,
};

const mockHealthWorkers = [
  { id: 'hw_001', name: 'Dr. Sarah Johnson', role: 'doctor', vaccinesIssued: 247 },
  { id: 'hw_002', name: 'Nurse Maria Rodriguez', role: 'nurse', vaccinesIssued: 189 },
  { id: 'hw_003', name: 'Dr. Michael Chen', role: 'doctor', vaccinesIssued: 156 },
  { id: 'hw_004', name: 'Nurse Jennifer Wilson', role: 'nurse', vaccinesIssued: 134 },
];

const mockMonthlyStats = [
  { month: 'Jan', vaccines: 98, children: 67 },
  { month: 'Feb', vaccines: 112, children: 78 },
  { month: 'Mar', vaccines: 134, children: 89 },
  { month: 'Apr', vaccines: 156, children: 102 },
  { month: 'May', vaccines: 178, children: 118 },
  { month: 'Jun', vaccines: 189, children: 125 },
];

const FacilityProfile = () => {
  const { healthWorker } = useHealthWorker();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [monthlyStats, setMonthlyStats] = useState(mockMonthlyStats);

  useEffect(() => {
    // In a real app, this would fetch facility data based on the health worker's facility ID
    setFacility(mockFacility);
  }, []);

  if (!facility) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Facility Profile
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Overview of your healthcare facility and team performance
        </p>
      </div>

      {/* Facility Information */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-full mr-4">
              <Building className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{facility.name}</h2>
              <p className="text-neutral-600 dark:text-neutral-300 capitalize">
                {facility.type.replace('_', ' ')} Facility
              </p>
            </div>
          </div>
          <div className="flex items-center text-success-600 dark:text-success-400">
            <Award className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Verified Facility</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-neutral-500 mr-3" />
            <span className="text-neutral-700 dark:text-neutral-300">{facility.address}</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-neutral-500 mr-3" />
            <span className="text-neutral-700 dark:text-neutral-300">(555) 123-4567</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-neutral-500 mr-3" />
            <span className="text-neutral-700 dark:text-neutral-300">info@citypediatrics.com</span>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-neutral-500 mr-3" />
            <span className="text-neutral-700 dark:text-neutral-300">
              {facility.healthWorkers.length} Health Workers
            </span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Vaccines</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {facility.totalVaccinesIssued.toLocaleString()}
              </p>
            </div>
            <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-full">
              <Shield className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600 dark:text-success-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            +15% this month
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Children Served</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {facility.childrenServed.toLocaleString()}
              </p>
            </div>
            <div className="bg-secondary-100 dark:bg-secondary-900/20 p-3 rounded-full">
              <Users className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600 dark:text-success-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12% this month
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Health Workers</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {facility.healthWorkers.length}
              </p>
            </div>
            <div className="bg-accent-100 dark:bg-accent-900/20 p-3 rounded-full">
              <Activity className="h-6 w-6 text-accent-600 dark:text-accent-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-neutral-600 dark:text-neutral-400">
            <Calendar className="h-4 w-4 mr-1" />
            All active
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Avg per Worker</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {Math.round(facility.totalVaccinesIssued / facility.healthWorkers.length)}
              </p>
            </div>
            <div className="bg-success-100 dark:bg-success-900/20 p-3 rounded-full">
              <Award className="h-6 w-6 text-success-600 dark:text-success-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600 dark:text-success-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            Above average
          </div>
        </div>
      </div>

      {/* Health Workers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Health Workers Performance
          </h3>
          <div className="space-y-4">
            {mockHealthWorkers.map((worker) => (
              <div key={worker.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    worker.id === healthWorker?.id 
                      ? 'bg-primary-100 dark:bg-primary-900/20' 
                      : 'bg-neutral-200 dark:bg-neutral-600'
                  }`}>
                    <Users className={`h-5 w-5 ${
                      worker.id === healthWorker?.id 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-neutral-500'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900 dark:text-white">
                      {worker.name}
                      {worker.id === healthWorker?.id && (
                        <span className="ml-2 text-xs text-primary-600 dark:text-primary-400">(You)</span>
                      )}
                    </h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 capitalize">{worker.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neutral-900 dark:text-white">{worker.vaccinesIssued}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">vaccines</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Monthly Trends
          </h3>
          <div className="space-y-4">
            {monthlyStats.map((stat, index) => (
              <div key={stat.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{stat.month}</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">{stat.vaccines} vaccines</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></div>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">{stat.children} children</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Recent Facility Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-success-50 dark:bg-success-900/20 rounded-lg">
            <Shield className="h-5 w-5 text-success-600 dark:text-success-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-success-800 dark:text-success-300">
                New vaccination record verified
              </p>
              <p className="text-xs text-success-600 dark:text-success-400">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <Users className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-primary-800 dark:text-primary-300">
                New health worker added to facility
              </p>
              <p className="text-xs text-primary-600 dark:text-primary-400">1 day ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
            <Award className="h-5 w-5 text-secondary-600 dark:text-secondary-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-secondary-800 dark:text-secondary-300">
                Facility achieved 1000+ vaccinations milestone
              </p>
              <p className="text-xs text-secondary-600 dark:text-secondary-400">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityProfile;