import { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Activity, 
  Building, 
  BarChart3, 
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Stethoscope,
  Baby,
  UserPlus,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalHealthWorkers: number;
  activeHealthWorkers: number;
  totalChildren: number;
  totalParents: number;
  vaccinationsThisMonth: number;
  pendingActions: number;
  availableVaccines: number;
  overdueVaccinations: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalHealthWorkers: 247,
    activeHealthWorkers: 231,
    totalChildren: 1856,
    totalParents: 1234,
    vaccinationsThisMonth: 342,
    pendingActions: 8,
    availableVaccines: 24,
    overdueVaccinations: 23,
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: '1',
      type: 'vaccination',
      message: 'DTaP vaccination recorded for Emma Davis',
      timestamp: '2 minutes ago',
      user: 'Dr. Sarah Johnson',
      status: 'completed'
    },
    {
      id: '2',
      type: 'registration',
      message: 'New health worker registered: Dr. Michael Chen',
      timestamp: '15 minutes ago',
      user: 'Admin User',
      status: 'completed'
    },
    {
      id: '3',
      type: 'parent',
      message: 'New parent registration: Sarah Johnson',
      timestamp: '1 hour ago',
      user: 'System',
      status: 'pending'
    },
    {
      id: '4',
      type: 'vaccine',
      message: 'New vaccine batch added: MMR-2024-005',
      timestamp: '2 hours ago',
      user: 'Admin User',
      status: 'completed'
    }
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vaccination':
        return <Shield className="h-4 w-4 text-primary-600" />;
      case 'registration':
        return <UserPlus className="h-4 w-4 text-success-600" />;
      case 'parent':
        return <Users className="h-4 w-4 text-secondary-600" />;
      case 'vaccine':
        return <Activity className="h-4 w-4 text-accent-600" />;
      default:
        return <Activity className="h-4 w-4 text-neutral-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success-600 bg-success-50';
      case 'pending':
        return 'text-warning-600 bg-warning-50';
      default:
        return 'text-neutral-600 bg-neutral-50';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Comprehensive overview of MedFiNet platform operations
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Health Workers</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.activeHealthWorkers}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                of {stats.totalHealthWorkers} total
              </p>
            </div>
            <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-full">
              <Stethoscope className="h-6 w-6 text-primary-600 dark:text-primary-400" />
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
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Children</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.totalChildren.toLocaleString()}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {stats.totalParents} parents
              </p>
            </div>
            <div className="bg-secondary-100 dark:bg-secondary-900/20 p-3 rounded-full">
              <Baby className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600 dark:text-success-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            +8% this month
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Vaccinations (Month)</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.vaccinationsThisMonth}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {stats.availableVaccines} vaccine types
              </p>
            </div>
            <div className="bg-accent-100 dark:bg-accent-900/20 p-3 rounded-full">
              <Shield className="h-6 w-6 text-accent-600 dark:text-accent-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600 dark:text-success-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            +15% vs last month
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Overdue Vaccines</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.overdueVaccinations}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                require attention
              </p>
            </div>
            <div className="bg-warning-100 dark:bg-warning-900/20 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-warning-600 dark:text-warning-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-warning-600 dark:text-warning-400">
            <Clock className="h-4 w-4 mr-1" />
            Action needed
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link 
              to="/admin/users?tab=health-workers&action=add"
              className="w-full text-left p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors group block"
            >
              <div className="flex items-center">
                <UserPlus className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">Add Health Worker</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Create new account</p>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/admin/vaccines?action=add"
              className="w-full text-left p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors group block"
            >
              <div className="flex items-center">
                <Plus className="h-5 w-5 text-secondary-600 dark:text-secondary-400 mr-3 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">Add Vaccine</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Upload new vaccine</p>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/admin/analytics"
              className="w-full text-left p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors group block"
            >
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-accent-600 dark:text-accent-400 mr-3 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">Generate Reports</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Export analytics</p>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/admin/api"
              className="w-full text-left p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors group block"
            >
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-neutral-600 dark:text-neutral-400 mr-3 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">API Management</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Configure access</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Recent Activity
            </h3>
            <button className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {activity.message}
                  </p>
                  <div className="flex items-center mt-1 space-x-2">
                    <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                      <Users className="h-3 w-3 mr-1" />
                      {activity.user}
                    </div>
                    <span className="text-xs text-neutral-400">•</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            System Health
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Database</span>
              </div>
              <span className="text-sm text-success-600 dark:text-success-400 font-medium">Operational</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">API Services</span>
              </div>
              <span className="text-sm text-success-600 dark:text-success-400 font-medium">99.9% Uptime</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-warning-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Data Sync</span>
              </div>
              <span className="text-sm text-warning-600 dark:text-warning-400 font-medium">Syncing</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Authentication</span>
              </div>
              <span className="text-sm text-success-600 dark:text-success-400 font-medium">Active</span>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Critical Alerts
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning-800 dark:text-warning-300">
                  {stats.overdueVaccinations} children have overdue vaccinations
                </p>
                <p className="text-xs text-warning-600 dark:text-warning-400 mt-1">
                  Requires immediate follow-up
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
              <Activity className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary-800 dark:text-primary-300">
                  System running optimally
                </p>
                <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                  All services operational
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg">
              <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-success-800 dark:text-success-300">
                  All systems operational
                </p>
                <p className="text-xs text-success-600 dark:text-success-400 mt-1">
                  No critical issues detected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;