import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, User, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { VaccinationRecord } from '../../types/healthWorker';
import VaccinationRecordCard from '../../components/health-worker/VaccinationRecordCard';
import supabase from '../../utils/supabaseClient';
import { useHealthWorker } from '../../contexts/HealthWorkerContext';
import VaccinationRecordModal from '../../components/health-worker/VaccinationRecordModal';

const VaccinationHistory = () => {
  const navigate = useNavigate();
  const { healthWorker, isAuthenticated } = useHealthWorker();
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<VaccinationRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<VaccinationRecord | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  /**
   * Check authentication on mount
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoadingAuth(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setAuthError('No active session found');
          setTimeout(() => navigate('/health-worker/login', { replace: true }), 2000);
          return;
        }

        if (!healthWorker || !isAuthenticated) {
          setAuthError('Health worker profile not found. Please log in again.');
          setTimeout(() => navigate('/health-worker/login', { replace: true }), 2000);
          return;
        }

        setAuthError(null);
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthError('Authentication check failed');
        setTimeout(() => navigate('/health-worker/login', { replace: true }), 2000);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/health-worker/login', { replace: true });
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [healthWorker, isAuthenticated, navigate]);

  /**
   * Fetch vaccination records once authenticated
   */
  useEffect(() => {
    if (!healthWorker || isLoadingAuth || authError) return;

    const fetchVaccinationRecords = async () => {
      try {
        setIsLoadingRecords(true);
        const { data, error } = await supabase
          .from('vaccinations')
          .select('*')
          .eq('health_worker_id', healthWorker.id)
          .order('date_given', { ascending: false });

        if (error) {
          console.error('Error fetching vaccination records:', error.message);
          throw error;
        }

        const mappedData = (data || []).map((item) => ({
          id: item.id,
          childIdHash: item.child_id,
          parentWallet: item.parent_wallet,
          vaccineName: item.vaccine_id,
          batchNumber: item.batch_number,
          dateAdministered: item.date_given,
          doseNumber: item.dose_number,
          notes: item.notes || '',
          healthWorkerId: item.health_worker_id,
          blockchainTxId: item.blockchain_tx || '',
          assetId: item.asset_id || '',
          verified: item.verified || false,
          createdAt: item.created_at,
        }));

        setRecords(mappedData);
        setFilteredRecords(mappedData);
      } catch (error) {
        console.error('Failed to fetch vaccination records:', error);
      } finally {
        setIsLoadingRecords(false);
      }
    };

    fetchVaccinationRecords();
  }, [healthWorker, isLoadingAuth, authError]);

  /**
   * Apply filters to records
   */
  useEffect(() => {
    let filtered = records;

    if (searchTerm) {
      filtered = filtered.filter((record) =>
        record.vaccineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.childIdHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.parentWallet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(record =>
        record.dateAdministered >= dateFilter
      );
    }

    if (verificationFilter !== 'all') {
      filtered = filtered.filter(record =>
        verificationFilter === 'verified' ? record.verified : !record.verified
      );
    }

    setFilteredRecords(filtered);
  }, [records, searchTerm, dateFilter, verificationFilter]);

  const handleViewRecord = (record: VaccinationRecord) => setSelectedRecord(record);
  const handleCloseModal = () => setSelectedRecord(null);

  const handleClearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    setVerificationFilter('all');
  };

  // Show loading state
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary-600 dark:text-primary-400 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-300">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // Show auth error
  if (authError) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-error-600 dark:text-error-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            {authError}
          </p>
          <button
            onClick={() => navigate('/health-worker/login', { replace: true })}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Authenticated content
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Vaccination History
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          View and manage all vaccination records you've issued
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white appearance-none"
            >
              <option value="all">All Records</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600 dark:text-neutral-300">
              {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''} found
            </span>
            <button
              onClick={handleClearFilters}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Loading Records */}
      {isLoadingRecords ? (
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-12 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-spin mx-auto mb-3" />
            <p className="text-neutral-600 dark:text-neutral-300">Loading vaccination records...</p>
          </div>
        </div>
      ) : filteredRecords.length > 0 ? (
        /* Record Cards */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRecords.map((record) => (
            <VaccinationRecordCard 
              key={record.id} 
              record={record} 
              onView={handleViewRecord} 
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-12 text-center">
          <User className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
            No vaccination records found
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">
            {searchTerm || dateFilter || verificationFilter !== 'all'
              ? 'Try adjusting your search criteria'
              : 'Start by issuing your first vaccination record'}
          </p>
        </div>
      )}

      {/* Vaccination Record Modal */}
      {selectedRecord && (
        <VaccinationRecordModal 
          record={selectedRecord} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default VaccinationHistory;
