import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, User, Calendar, Edit, Trash2 } from 'lucide-react';
import { ChildProfile } from '../../types';
import BlockchainHash from '../../components/common/BlockchainHash';
import UserContext from '../../contexts/UserContext';
import supabase from '../../utils/supabaseClient';


const ChildProfiles = () => {
  const { user } = useContext(UserContext);
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    birthDate: '',
    gender: 'male',
  });
  
  useEffect(() => {
    if (user) {
      loadProfiles();
    }
  }, [user]);

  const loadProfiles = async () => {
  if (!user) return;

  const { data, error } = await supabase
    .from('child_profiles')
    .select('*')
    .eq('parent_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error.message);
    return;
  }

  setProfiles(data || []);
};


  const handleAddProfile = async () => {
  if (!user) return;

  const { error } = await supabase
    .from('child_profiles')
    .insert({
      name: newProfile.name.trim(),
      birth_date: newProfile.birthDate,
      gender: newProfile.gender,
      parent_id: user.id,
    });

  if (error) {
    console.error('Error adding profile:', error.message);
    return;
  }

  loadProfiles();

  setNewProfile({
    name: '',
    birthDate: '',
    gender: 'male',
  });
  setIsAddModalOpen(false);
};


  const handleDeleteProfile = async (id: string) => {
  if (!confirm('Are you sure you want to delete this profile?')) return;

  const { error } = await supabase
    .from('child_profiles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting profile:', error.message);
    return;
  }

  loadProfiles();
};


  const handleTokenizeProfile = async (id: string) => {
  const fakeBlockchainId = `0x${Math.random().toString(16).substr(2, 16)}...${Math.random().toString(16).substr(2, 8)}`;

  const { error } = await supabase
    .from('child_profiles')
    .update({ blockchain_id: fakeBlockchainId })
    .eq('id', id);

  if (error) {
    console.error('Error tokenizing profile:', error.message);
    return;
  }

  loadProfiles();
};


  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Child Profiles</h1>
          <p className="text-neutral-600">Manage your children's healthcare profiles</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center mt-4 md:mt-0"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Child Profile
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <div key={profile.id} className="card hover:translate-y-[-5px]">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 text-2xl font-bold">
                      {profile.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-neutral-900">{profile.name}</h3>
                  <div className="flex items-center text-sm text-neutral-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(profile.birth_date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-neutral-500 truncate break-all mt-1">
                    <span className="font-medium">Child ID:</span> {profile.id}
                  </div>
                  <button 
                    className="text-xs text-primary-600 hover:underline mt-1"
                    onClick={() => navigator.clipboard.writeText(profile.id)}
                  >
                    Copy ID
                  </button>

                  {profile.blockchainId && (
                    <div className="mt-2">
                      <BlockchainHash hash={profile.blockchainId} label="Blockchain ID" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex mt-4 space-x-2">
                <Link 
                  to={`/vaccination-history/${profile.id}`}
                  className="btn-outline text-sm flex-1 flex justify-center"
                >
                  View Records
                </Link>
                {!profile.blockchainId && (
                  <button 
                    onClick={() => handleTokenizeProfile(profile.id)}
                    className="btn-secondary text-sm flex-1 flex justify-center"
                    title="Securely store this profile on the blockchain"
                  >
                    Tokenize
                  </button>
                )}
              </div>
            </div>
            <div className="border-t border-neutral-200 px-6 py-3 bg-neutral-50 flex justify-end space-x-2">
              <button 
                className="p-2 rounded-md text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
                title="Edit profile"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleDeleteProfile(profile.id)}
                className="p-2 rounded-md text-neutral-600 hover:text-error-600 hover:bg-error-50"
                title="Delete profile"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {profiles.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <User className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No child profiles found</h3>
          <p className="text-neutral-600 mb-6">Add your child's profile to track their immunization records</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
          >
            Add Child Profile
          </button>
        </div>
      )}
      
      {/* Add Profile Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md mx-auto z-10 animate-slide-up">
              <div className="px-6 py-4 border-b border-neutral-200">
                <h3 className="text-xl font-semibold text-neutral-900">Add Child Profile</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                      Child's Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="input"
                      value={newProfile.name}
                      onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                      placeholder="Enter child's full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-neutral-700 mb-1">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      id="birthDate"
                      className="input"
                      value={newProfile.birthDate}
                      onChange={(e) => setNewProfile({...newProfile, birthDate: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-neutral-700 mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      className="input"
                      value={newProfile.gender}
                      onChange={(e) => setNewProfile({...newProfile, gender: e.target.value})}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex justify-end space-x-3">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleAddProfile}
                  disabled={!newProfile.name.trim() || !newProfile.birthDate}
                >
                  Add Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildProfiles;