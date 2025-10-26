import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  QrCode, 
  Shield, 
  Download, 
  Share, 
  Printer, 
  ArrowLeft,
  Info,
  CheckCircle
} from 'lucide-react';
import { VaccinationRecord } from '../../types';
import QRCodeGenerator from '../../components/common/QRCodeGenerator';
import qrCodeApi from '../../services/qrCodeApi';

// Mock data
const mockVaccinations: VaccinationRecord[] = [
  {
    id: '1',
    childId: '1',
    vaccineId: 'v1',
    vaccineName: 'DTaP',
    date: '2023-06-15',
    location: 'City Pediatrics',
    provider: 'Dr. Smith',
    blockchainHash: '0x7f9e8d...6b2c1a',
    verified: true,
    dose: 1,
    nextDoseDate: '2023-09-15',
  },
  {
    id: '2',
    childId: '1',
    vaccineId: 'v2',
    vaccineName: 'MMR',
    date: '2023-08-20',
    location: 'City Pediatrics',
    provider: 'Dr. Smith',
    blockchainHash: '0x3a5b7c...9e8f2d',
    verified: true,
    dose: 1,
  },
  {
    id: '3',
    childId: '2',
    vaccineId: 'v1',
    vaccineName: 'DTaP',
    date: '2023-07-10',
    location: 'Metro Medical',
    provider: 'Dr. Johnson',
    verified: false,
    dose: 1,
    nextDoseDate: '2023-10-10',
  }
];

const VaccinationQRCode = () => {
  const { id } = useParams();
  const [vaccination, setVaccination] = useState<VaccinationRecord | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVaccination = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        const record = mockVaccinations.find(v => v.id === id);
        
        if (!record) {
          setError('Vaccination record not found');
          setIsLoading(false);
          return;
        }
        
        setVaccination(record);
        
        // Generate QR code data
        const qrData = await qrCodeApi.generateVaccinationQR({
          id: record.id,
          childId: record.childId,
          childIdHash: `ch_${record.childId}`, // In a real app, this would be a proper hash
          vaccineName: record.vaccineName,
          dateAdministered: record.date,
          doseNumber: record.dose,
          location: record.location,
          provider: record.provider,
          blockchainHash: record.blockchainHash,
          verified: record.verified
        });
        
        setQrCodeData(qrData);
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVaccination();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !vaccination) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <QrCode className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 mb-2">{error || 'Vaccination record not found'}</h3>
        <p className="text-neutral-600 mb-6">The requested vaccination record could not be found or accessed.</p>
        <Link to="/vaccination-history/all" className="btn-primary">
          Back to Vaccination History
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center">
        <Link to={`/vaccination-history/${vaccination.childId}`} className="text-neutral-600 hover:text-neutral-900 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Vaccination QR Code</h1>
          <p className="text-neutral-600">Shareable QR code for {vaccination.vaccineName} vaccination record</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* QR Code */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <QRCodeGenerator
            data={qrCodeData}
            title={`${vaccination.vaccineName} Vaccination Record`}
            description={`Dose ${vaccination.dose} administered on ${new Date(vaccination.date).toLocaleDateString()}`}
            size={250}
            logoUrl="/vaccine.jpg"
          />
        </div>
        
        {/* Vaccination Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Vaccination Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="text-neutral-600">Vaccine</span>
              <span className="font-medium text-neutral-900">{vaccination.vaccineName}</span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="text-neutral-600">Dose</span>
              <span className="font-medium text-neutral-900">{vaccination.dose}</span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="text-neutral-600">Date Administered</span>
              <span className="font-medium text-neutral-900">{new Date(vaccination.date).toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="text-neutral-600">Location</span>
              <span className="font-medium text-neutral-900">{vaccination.location}</span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="text-neutral-600">Provider</span>
              <span className="font-medium text-neutral-900">{vaccination.provider}</span>
            </div>
            
            {vaccination.blockchainHash && (
              <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                <span className="text-neutral-600">Blockchain Verification</span>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success-600 mr-1" />
                  <span className="font-medium text-success-600">Verified</span>
                </div>
              </div>
            )}
            
            {vaccination.nextDoseDate && (
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Next Dose Due</span>
                <span className="font-medium text-neutral-900">{new Date(vaccination.nextDoseDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          
          <div className="mt-6 bg-neutral-50 p-4 rounded-lg">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-neutral-500 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">About QR Codes</h3>
                <p className="text-sm text-neutral-600">
                  This QR code contains encrypted vaccination data that can be scanned by healthcare providers for verification. 
                  It can also be used for offline access in areas with limited connectivity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationQRCode;