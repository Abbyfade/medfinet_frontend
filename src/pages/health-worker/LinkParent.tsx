import { useState } from 'react';
import { Search, User, Users, Link as LinkIcon, CheckCircle } from 'lucide-react';
import { Parent, Child, VaccinationRecord } from '../../types/healthWorker';
import NotificationToast from '../../components/health-worker/NotificationToast';

// Mock data
const mockParents: Parent[] = [
  {
    id: 'p_001',
    name: 'John Williams',
    email: 'john.williams@email.com',
    walletAddress: 'ALGO7X8Y9Z...ABC123',
    children: [
      {
        id: 'c_001',
        name: 'Jacob Williams',
        idHash: 'ch_abc123def456',
        birthDate: '2020-05-15',
        parentId: 'p_001',
        vaccinationHistory: [],
      },
    ],
  },
  {
    id: 'p_002',
    name: 'Maria Davis',
    email: 'maria.davis@email.com',
    walletAddress: 'ALGO9A8B7C...DEF456',
    children: [
      {
        id: 'c_002',
        name: 'Emma Davis',
        idHash: 'ch_def456ghi789',
        birthDate: '2022-03-10',
        parentId: 'p_002',
        vaccinationHistory: [],
      },
      {
        id: 'c_003',
        name: 'Lucas Davis',
        idHash: 'ch_ghi789jkl012',
        birthDate: '2019-08-22',
        parentId: 'p_002',
        vaccinationHistory: [],
      },
    ],
  },
];

const mockUnlinkedRecords: VaccinationRecord[] = [
  {
    id: 'vr_unlinked_001',
    childIdHash: 'ch_abc123def456',
    parentWallet: '',
    vaccineName: 'DTaP',
    batchNumber: 'DTaP-2024-001',
    dateAdministered: '2024-01-15',
    doseNumber: 1,
    healthWorkerId: 'hw_001',
    facilityId: 'fac_001',
    verified: false,
    createdAt: '2024-01-15T10:30:00Z',
  },
];

const LinkParent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<VaccinationRecord | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    isVisible: boolean;
  }>({
    type: 'success',
    message: '',
    isVisible: false,
  });

  const filteredParents = mockParents.filter(parent =>
    parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLinkRecord = async () => {
    if (!selectedParent || !selectedChild || !selectedRecord) return;

    setIsLinking(true);

    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      setNotification({
        type: 'success',
        message: `Successfully linked vaccination record to ${selectedChild.name}`,
        isVisible: true,
      });

      // Reset selections
      setSelectedParent(null);
      setSelectedChild(null);
      setSelectedRecord(null);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to link vaccination record. Please try again.',
        isVisible: true,
      });
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Link to Parent
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Connect vaccination records to parent accounts and child profiles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parent Search */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Search Parent
          </h2>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, email, or wallet address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
            />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredParents.map((parent) => (
              <div
                key={parent.id}
                onClick={() => setSelectedParent(parent)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedParent?.id === parent.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                }`}
              >
                <div className="flex items-center mb-2">
                  <User className="h-5 w-5 text-neutral-500 mr-3" />
                  <div>
                    <h3 className="font-medium text-neutral-900 dark:text-white">{parent.name}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{parent.email}</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  {parent.walletAddress}
                </p>
                <div className="mt-2 flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                  <Users className="h-4 w-4 mr-1" />
                  {parent.children.length} child{parent.children.length !== 1 ? 'ren' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Child Profiles */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Child Profiles
          </h2>
          
          {selectedParent ? (
            <div className="space-y-3">
              {selectedParent.children.map((child) => (
                <div
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedChild?.id === child.id
                      ? 'border-secondary-500 bg-secondary-50 dark:bg-secondary-900/20'
                      : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-1">{child.name}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    Born: {new Date(child.birthDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                    ID: {child.idHash}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-500 dark:text-neutral-400">
                Select a parent to view their children
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Unlinked Records */}
      <div className="mt-6 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Unlinked Vaccination Records
        </h2>
        
        <div className="space-y-3">
          {mockUnlinkedRecords.map((record) => (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedRecord?.id === record.id
                  ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20'
                  : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-white">{record.vaccineName}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Dose {record.doseNumber} • {new Date(record.dateAdministered).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                    Child ID: {record.childIdHash}
                  </p>
                </div>
                <div className="text-warning-600 dark:text-warning-400 text-sm font-medium">
                  Unlinked
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Link Action */}
      {selectedParent && selectedChild && selectedRecord && (
        <div className="mt-6 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-success-800 dark:text-success-300 mb-2">
                Ready to Link
              </h3>
              <p className="text-success-700 dark:text-success-400">
                Link <strong>{selectedRecord.vaccineName}</strong> record to <strong>{selectedChild.name}</strong> 
                (Parent: {selectedParent.name})
              </p>
            </div>
            <button
              onClick={handleLinkRecord}
              disabled={isLinking}
              className="bg-success-600 hover:bg-success-700 disabled:bg-success-400 text-white font-medium py-2 px-4 rounded-md flex items-center transition-colors"
            >
              {isLinking ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Linking...
                </>
              ) : (
                <>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Sign & Send
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <NotificationToast
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default LinkParent;