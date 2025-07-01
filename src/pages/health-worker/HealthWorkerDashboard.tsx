import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Shield, 
  TrendingUp, 
  Calendar,
  Activity,
  Award,
  Clock,
  MapPin
} from 'lucide-react';
import { useHealthWorker } from '../../contexts/HealthWorkerContext';
import { VaccinationRecord } from '../../types/healthWorker';
import VaccinationRecordCard from '../../components/health-worker/VaccinationRecordCard';
import supabase from '../../utils/supabaseClient';


const HealthWorkerDashboard = () => {
  const { healthWorker } = useHealthWorker();
  const [recentVaccinations, setRecentVaccinations] = useState<VaccinationRecord[]>([]);
  const [stats, setStats] = useState({
    totalVaccinesIssued: 0,
    childrenServed: 0,
    thisWeekVaccines: 0,
    verificationRate: 0,
  });

  useEffect(() => {
    if (!healthWorker) return;
    const fetchDashboardData = async () => {
      const { data: recent, error: recErr } = await supabase
        .from('vaccinations')
        .select('*')
        .eq('health_worker_id', healthWorker?.id)
        .order('date_given', { ascending: false })
        .limit(5);
      if (recErr) console.error('Recent fetch error:', recErr);
      // else setRecentVaccinations(recent as VaccinationRecord[]);
      else {
        const mappedData = (recent || []).map((item) => ({
          id: item.id,
          childIdHash: item.child_id,
          parentWallet: item.parent_wallet,
          vaccineName: item.vaccine_id,
          batchNumber: item.batch_number,
          dateAdministered: item.date_given,
          doseNumber: item.dose_number,
          notes: item.notes || '',
          healthWorkerId: item.health_worker_id,
          blockchainTxId: item.blockchain_tx_id || '',
          ipfsHash: item.ipfs_hash || '',
          verified: item.verified || false,
          createdAt: item.created_at,
        }));

        setRecentVaccinations(mappedData);
      }

      const { count: totalCount, error: totErr } = await supabase
        .from('vaccinations')
        .select('id', { count: 'exact', head: true })
        .eq('health_worker_id', healthWorker.id);
      if (totErr) console.error('Total fetch error:', totErr);

      const { data: childrenData, error: childErr } = await supabase
        .from('vaccinations')
        .select('child_id')
        .eq('health_worker_id', healthWorker.id);
      if (childErr) console.error('Children fetch error:', childErr);

      // Deduplicate child_id values
      const uniqueChildren = Array.from(
        new Set((childrenData || []).map((item) => item.child_id))
      );

      setStats(prev => ({
        ...prev,
        totalVaccinesIssued: totalCount ?? prev.totalVaccinesIssued,
        childrenServed: uniqueChildren.length ?? prev.childrenServed,
      }));
    };

    fetchDashboardData();
  }, [healthWorker]);


  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Welcome back, {healthWorker?.name}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Here's your vaccination management overview for today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Vaccines Issued</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.totalVaccinesIssued}
              </p>
            </div>
            <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-full">
              <Shield className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600 dark:text-success-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12% from last month
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Children Served</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.childrenServed}
              </p>
            </div>
            <div className="bg-secondary-100 dark:bg-secondary-900/20 p-3 rounded-full">
              <Users className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600 dark:text-success-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            +8% from last month
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">This Week</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.thisWeekVaccines}
              </p>
            </div>
            <div className="bg-accent-100 dark:bg-accent-900/20 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-accent-600 dark:text-accent-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-neutral-600 dark:text-neutral-400">
            <Clock className="h-4 w-4 mr-1" />
            5 scheduled today
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Verification Rate</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.verificationRate}%
              </p>
            </div>
            <div className="bg-success-100 dark:bg-success-900/20 p-3 rounded-full">
              <Award className="h-6 w-6 text-success-600 dark:text-success-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600 dark:text-success-400">
            <Activity className="h-4 w-4 mr-1" />
            Excellent performance
          </div>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Your Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Name</label>
                <p className="text-neutral-900 dark:text-white">{healthWorker?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Clinic</label>
                <p className="text-neutral-900 dark:text-white">{healthWorker?.clinic}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">License</label>
                <p className="text-neutral-900 dark:text-white">{healthWorker?.licenseNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Wallet Address</label>
                <p className="text-neutral-900 dark:text-white truncate font-mono text-sm">
                  {healthWorker?.walletAddress}
                </p>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-success-600 dark:text-success-400 mr-2" />
                <span className="text-sm text-success-600 dark:text-success-400 font-medium">
                  Verified Health Worker
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                to="/health-worker/issue-vaccine"
                className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-left group"
              >
                <Shield className="h-6 w-6 text-primary-600 dark:text-primary-400 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-neutral-900 dark:text-white">Issue New Vaccine</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Create a new vaccination record</p>
              </Link>
              
              <Link 
                to="/health-worker/link-parent"
                className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-left group"
              >
                <Users className="h-6 w-6 text-secondary-600 dark:text-secondary-400 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-neutral-900 dark:text-white">Link to Parent</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Connect records to parent accounts</p>
              </Link>
              
              <Link 
                to="/health-worker/vaccination-history"
                className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-left group"
              >
                <Activity className="h-6 w-6 text-accent-600 dark:text-accent-400 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-neutral-900 dark:text-white">View History</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Browse vaccination records</p>
              </Link>
              
              <Link 
                to="/health-worker/facility-profile"
                className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-left group"
              >
                <MapPin className="h-6 w-6 text-success-600 dark:text-success-400 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-neutral-900 dark:text-white">Facility Profile</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage facility information</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Vaccinations */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Recent Vaccinations
          </h2>
          <Link 
            to="/health-worker/vaccination-history"
            className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        
        {recentVaccinations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recentVaccinations.map((record) => (
              <VaccinationRecordCard key={record.id} record={record} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
              No recent vaccinations
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400">
              Start by issuing your first vaccination record
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthWorkerDashboard;