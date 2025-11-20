import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, 
  QrCode, 
  Calendar, 
  FileText, 
  User, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { VaccineType } from '../../types/healthWorker';
import { useHealthWorker } from '../../contexts/HealthWorkerContext';
import NotificationToast from '../../components/health-worker/NotificationToast';
import supabase from '../../utils/supabaseClient';

import peraWallet, { algodClient, connectWallet } from '../../algorand/algorandWallet';

import { issueTxn, submitSignedTxn } from '../../utils/algorandAPI';

import algosdk from 'algosdk';

// Mock vaccine types
const vaccineTypes: VaccineType[] = [
  { id: 'dtap', name: 'DTaP', manufacturer: 'Sanofi Pasteur', description: 'Diphtheria, Tetanus, Pertussis', ageGroup: '2 months - 6 years', dosesRequired: 5 },
  { id: 'mmr', name: 'MMR', manufacturer: 'Merck', description: 'Measles, Mumps, Rubella', ageGroup: '12 months+', dosesRequired: 2 },
  { id: 'polio', name: 'IPV', manufacturer: 'Sanofi Pasteur', description: 'Inactivated Poliovirus', ageGroup: '2 months+', dosesRequired: 4 },
  { id: 'hepb', name: 'Hepatitis B', manufacturer: 'GlaxoSmithKline', description: 'Hepatitis B', ageGroup: 'Birth+', dosesRequired: 3 },
];

const IssueVaccine = () => {
  const { healthWorker, isAuthenticated } = useHealthWorker();
  const navigate = useNavigate();
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');

  const [formData, setFormData] = useState({
    childIdHash: '',
    parentWallet: '',
    vaccineId: '',
    batchNumber: '',
    dateAdministered: new Date().toISOString().split('T')[0],
    doseNumber: 1,
    notes: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    isVisible: boolean;
  }>({
    type: 'success',
    message: '',
    isVisible: false,
  });

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

        // Set wallet address from healthWorker
        if (healthWorker.walletAddress) {
          setWalletAddress(healthWorker.walletAddress);
        } else {
          setAuthError('Wallet address not found in profile.');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScanQR = () => {
    // Simulate QR code scanning
    const mockChildId = 'ch_' + Math.random().toString(36).substr(2, 12);
    setFormData(prev => ({
      ...prev,
      childIdHash: mockChildId,
    }));
    
    setNotification({
      type: 'success',
      message: 'Child ID scanned successfully',
      isVisible: true,
    });
  };

  // Reconnect Pera Wallet session
  peraWallet.reconnectSession();

  /**
   * Sign and submit transaction to blockchain
   */
  const signAndSubmit = async (unsignedTxnBase64: string) => {
    try {
      // Prepare transaction for Pera Wallet
      const txn_64 = algosdk.decodeUnsignedTransaction(
        Buffer.from(unsignedTxnBase64, 'base64')
      );

      // Sign with Pera Wallet
      const signedTxn = await peraWallet.signTransaction([[{ txn: txn_64 }]]);

      function uint8ArrayToBase64(u8arr: Uint8Array) {
        return btoa(String.fromCharCode(...u8arr));
      }

      // Assume signedTxn is an array of Uint8Array from Pera Wallet
      const signedTxnBase64Array = signedTxn.map(txn => uint8ArrayToBase64(txn));
      
      // Submit to backend
      const response = await fetch('https://medfinet-backend.onrender.com/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signedTxn: signedTxnBase64Array
        }),
      });

      const result = await response.json();
      return { txnId: result.txnId, assetID: result.assetID };
    } catch (error) {
      console.error('Signing error:', error);
      throw error;
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Double-check authentication before submitting
    if (!healthWorker || !isAuthenticated) {
      setNotification({
        type: 'error',
        message: 'You must be authenticated to issue a vaccination record.',
        isVisible: true,
      });
      navigate('/health-worker/login', { replace: true });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Fetch child data from Supabase
      const { data: childData, error: childError } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('id', formData.childIdHash)
        .single();

      if (childError || !childData) {
        console.error('Child fetch error:', childError?.message || 'Not found');
        setNotification({
          type: 'error',
          message: 'Child profile not found. Please check the child ID.',
          isVisible: true,
        });
        setIsSubmitting(false);
        return;
      }

      // 2. Create unsigned transaction
      const response = await fetch('https://medfinet-backend.onrender.com/api/vaccinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          healthWorkerWallet: walletAddress,
          provider: healthWorker.name,
          location: healthWorker.facility_name,
          childName: childData.name,
          childDOB: childData.birth_date,
        }),
      });

      const result = await response.json();
      
      // 3. Sign and submit to blockchain
      const { txnId, assetID } = await signAndSubmit(result.unsignedTxn);

      // 4. Save vaccination record to Supabase
      const { error: insertError } = await supabase.from('vaccinations').insert([{
        child_id: formData.childIdHash,
        parent_wallet: formData.parentWallet || 'pending',
        health_worker_id: healthWorker.id,
        vaccine_id: formData.vaccineId,
        batch_number: formData.batchNumber,
        date_given: formData.dateAdministered,
        dose_number: formData.doseNumber,
        notes: formData.notes,
        blockchain_tx_id: txnId,
        provider: healthWorker.name,
        location: healthWorker.facility_name,
        certificate: result.imageUrl,
        asset_id: assetID,
        verified: true,
      }]);

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      setNotification({
        type: 'success',
        message: `Vaccination NFT issued successfully! TX ID: ${txnId}`,
        isVisible: true
      });

      // Reset form
      setFormData({
        childIdHash: '',
        parentWallet: '',
        vaccineId: '',
        batchNumber: '',
        dateAdministered: new Date().toISOString().split('T')[0],
        doseNumber: 1,
        notes: '',
      });

      setTimeout(() => {
        navigate('/health-worker/vaccination-history');
      }, 1500);

    } catch (error: any) {
      console.error('Submission error:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Failed to issue vaccination record',
        isVisible: true
      });
    } finally {
      setIsSubmitting(false);
    }
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

  const selectedVaccine = vaccineTypes.find(v => v.id === formData.vaccineId);

  // Authenticated content
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Issue Vaccination Record
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Create a new blockchain-verified vaccination record
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Child ID Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label htmlFor="childIdHash" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Child ID Hash
              </label>
              <input
                type="text"
                id="childIdHash"
                name="childIdHash"
                value={formData.childIdHash}
                onChange={handleInputChange}
                placeholder="Enter child ID hash manually"
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleScanQR}
                className="w-full bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Scan QR Code
              </button>
            </div>
          </div>

          {/* Vaccine Selection */}
          <div>
            <label htmlFor="vaccineId" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Vaccine Type
            </label>
            <select
              id="vaccineId"
              name="vaccineId"
              value={formData.vaccineId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
              required
            >
              <option value="">Select a vaccine</option>
              {vaccineTypes.map((vaccine) => (
                <option key={vaccine.id} value={vaccine.id}>
                  {vaccine.name} - {vaccine.description}
                </option>
              ))}
            </select>
            
            {selectedVaccine && (
              <div className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-md">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">Manufacturer:</span>
                    <span className="ml-2 text-neutral-600 dark:text-neutral-400">{selectedVaccine.manufacturer}</span>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">Age Group:</span>
                    <span className="ml-2 text-neutral-600 dark:text-neutral-400">{selectedVaccine.ageGroup}</span>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">Total Doses:</span>
                    <span className="ml-2 text-neutral-600 dark:text-neutral-400">{selectedVaccine.dosesRequired}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Batch Number and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="batchNumber" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Batch Number
              </label>
              <input
                type="text"
                id="batchNumber"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleInputChange}
                placeholder="e.g., DTaP-2024-001"
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="dateAdministered" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Date Administered
              </label>
              <input
                type="date"
                id="dateAdministered"
                name="dateAdministered"
                value={formData.dateAdministered}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Dose Number */}
          <div>
            <label htmlFor="doseNumber" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Dose Number
            </label>
            <select
              id="doseNumber"
              name="doseNumber"
              value={formData.doseNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
              required
            >
              {[1, 2, 3, 4, 5].map((dose) => (
                <option key={dose} value={dose}>
                  Dose {dose}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any additional notes about the vaccination..."
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
            />
          </div>

          {/* Blockchain Info */}
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-primary-800 dark:text-primary-300 mb-1">
                  Blockchain Verification
                </h3>
                <p className="text-sm text-primary-700 dark:text-primary-400">
                  This vaccination record will be tokenized on the Algorand blockchain and stored on IPFS for permanent verification.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-3 px-6 rounded-md flex items-center transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Record...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Issue Vaccination Record
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <NotificationToast
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default IssueVaccine;