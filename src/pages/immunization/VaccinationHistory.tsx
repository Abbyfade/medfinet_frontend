import { useState, useEffect, useContext } from 'react';
import { Plus, Shield, CheckCircle, AlertCircle, Download, Calendar, MapPin, User, Clock } from 'lucide-react';
import { useParams } from 'react-router-dom';
import supabase from '../../utils/supabaseClient';
import UserContext from '../../contexts/UserContext';
import { ChildProfile, VaccinationRecord } from '../../types';
import BlockchainHash from '../../components/common/BlockchainHash';

const VaccinationHistory = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(UserContext);
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 1️⃣ Load child profiles of the logged-in parent
  useEffect(() => {
    if (!user) return;
    supabase
      .from('child_profiles')
      .select('*')
      .eq('parent_id', user.id)
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setProfiles(data || []);
      });
  }, [user]);

  // 2️⃣ Load vaccinations for the relevant child or all
  useEffect(() => {
    if (!profiles.length) return;

    const childIds = id === 'all' 
      ? profiles.map(p => p.id)
      : [id!];

    supabase
  .from('vaccinations')
  .select('*, child_profiles(name, id)')
  .in('child_id', childIds)
  .order('date_given', { ascending: false })
  .then(({ data, error }) => {
    if (error) console.error(error);
    else {
      const mapped: VaccinationRecord[] = (data || []).map(item => ({
        id: item.id,
        childId: item.child_id,
        vaccineId: item.vaccine_id,
        vaccineName: item.vaccine_id,
        date: item.date_given,
        location: item.location ?? '',
        provider: item.provider ?? '',
        blockchainHash: item.blockchain_tx ?? '',
        verified: item.verified ?? false,
        dose: item.dose_number,
        nextDoseDate: item.next_dose_date ?? undefined,
        childName: item.child_profiles?.name ?? 'Unknown',
        certificate: item.certificate ?? '',
        assetId: item.asset_id
      }));
      setVaccinations(mapped);
    }
  });
  }, [profiles, id]);

  const handleDownloadCertificate = (v: VaccinationRecord) => {
    if (!v.certificate) {
      alert("No certificate available.");
      return;
    }

    // Trigger browser download
    const link = document.createElement("a");
    link.href = v.certificate;
    link.target = "_blank"
    link.download = `${v.vaccineName}-certificate.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const currentProfile = profiles.find(p => p.id === id);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {id === 'all' ? 'All Vaccination Records' : `${currentProfile?.name}'s Vaccination History`}
          </h1>
          <p className="text-neutral-600">
            {id === 'all' ? 'View all your children’s records' : `Track ${currentProfile?.name}'s vaccinations`}
          </p>
        </div>
        {/* {id !== 'all' && (
          <button onClick={() => setIsAddModalOpen(true)} className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" /> Add Vaccination
          </button>
        )} */}
      </div>

      {/* Profile info */}
      {currentProfile && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center">
          <img src={currentProfile.avatar!} alt="" className="h-16 w-16 rounded-full mr-4 object-cover bg-neutral-200" />
          <div>
            <h3 className="text-lg font-semibold">{currentProfile.name}</h3>
            <div className="flex items-center text-sm text-neutral-500">
              <Calendar className="h-4 w-4 mr-1" />
              Born: {new Date(currentProfile.birth_date).toLocaleDateString()}
            </div>
          </div>
          {currentProfile.blockchain_id && (
            <div className="ml-auto">
              <BlockchainHash hash={currentProfile.blockchain_id} label="Profile Blockchain ID" />
            </div>
          )}
        </div>
      )}

      {/* Vaccination list */}
      <div className="space-y-6">
        {vaccinations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Shield className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No records found</h3>
            <p className="text-neutral-600">{id === 'all' ? 'No vaccinations yet.' : 'Add a vaccination record to start.'}</p>
          </div>
        ) : (
          vaccinations.map(v => (
            <div key={v.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-secondary-600 mr-3" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold">{v.vaccineName} <span className="text-neutral-500">(Dose {v.dose})</span></h3>
                      {v.childName && (
                      <div className="flex items-center text-sm text-primary-600 bg-primary-50 px-3 py-1 rounded-full mt-1">
                        <User className="h-4 w-4 mr-1" />
                        {v.childName}
                      </div>
                    )}
                      {/* {v.verified ? (
                        <div className="flex items-center text-success-600">
                          <CheckCircle className="h-5 w-5 mr-1" /> Verified
                        </div>
                      ) : (
                        <div className="flex items-center text-warning-600">
                          <AlertCircle className="h-5 w-5 mr-1" /> Unverified
                        </div>
                      )} */}
                    </div>

                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-neutral-600">
                      <div><Calendar className="inline h-4 w-4 mr-1"/> {new Date(v.date).toLocaleDateString()}</div>
                      <div><MapPin className="inline h-4 w-4 mr-1"/> {v.location}</div>
                      <div><User className="inline h-4 w-4 mr-1"/> {v.provider}</div>
                      {v.nextDoseDate && <div><Clock className="inline h-4 w-4 mr-1"/> Next: {new Date(v.nextDoseDate).toLocaleDateString()}</div>}
                    </div>

                    {v.blockchainHash && (
                      <div className="mt-3 bg-neutral-50 p-2 rounded">
                        <BlockchainHash hash={v.blockchainHash} verified={v.verified} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 px-6 py-3 flex justify-between">
                {v.assetId ? (
                  <a
                    href={`https://testnet.explorer.perawallet.app/asset/${v.assetId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline text-sm"
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    View on AlgoExplorer
                  </a>
                ) : (
                  <div className="flex items-center text-neutral-400 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    No transaction
                  </div>
                )}

                {v.blockchainHash ? (
                  <button onClick={() => handleDownloadCertificate(v)} className="btn-outline text-xs flex items-center">
                    <Download className="h-3 w-3 mr-1" /> Certificate
                  </button>
                ) : (
                  <button className="btn-outline text-xs flex items-center">
                    <Shield className="h-3 w-3 mr-1" /> Tokenize
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default VaccinationHistory;
