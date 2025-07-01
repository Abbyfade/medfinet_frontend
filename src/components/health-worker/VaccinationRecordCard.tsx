import { Calendar, User, Shield, ExternalLink, Eye } from 'lucide-react';
import { VaccinationRecord } from '../../types/healthWorker';

interface VaccinationRecordCardProps {
  record: VaccinationRecord;
  onView?: (record: VaccinationRecord) => void;
}

const VaccinationRecordCard = ({ record, onView }: VaccinationRecordCardProps) => {
  const handleViewOnExplorer = () => {
    if (record.blockchainTxId) {
      window.open(`https://algoexplorer.io/tx/${record.blockchainTxId}`, '_blank');
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
            {record.vaccineName}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Dose {record.doseNumber} • Batch: {record.batchNumber}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {record.verified && (
            <div className="flex items-center text-success-600 dark:text-success-400">
              <Shield className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Verified</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date(record.dateAdministered).toLocaleDateString()}
        </div>
        <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
          <User className="h-4 w-4 mr-2" />
          Child: {record.childIdHash.substring(0, 8)}...
        </div>
      </div>

      {record.notes && (
        <div className="mb-4 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-md">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">{record.notes}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          Parent: {record.parentWallet.substring(0, 8)}...{record.parentWallet.substring(-6)}
        </div>
        <div className="flex space-x-2">
          {onView && (
            <button
              onClick={() => onView(record)}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium flex items-center"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </button>
          )}
          {record.blockchainTxId && (
            <button
              onClick={handleViewOnExplorer}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Explorer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaccinationRecordCard;