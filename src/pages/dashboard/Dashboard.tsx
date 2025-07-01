import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, Shield, DollarSign, Clock, Zap } from 'lucide-react';
import { ChildProfile, VaccinationRecord, MedicalInvoice, Notification } from '../../types';
import supabase from '../../utils/supabaseClient';
import { useContext } from 'react';
import UserContext from '../../contexts/UserContext';



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
  }
];

const mockInvoices: MedicalInvoice[] = [
  {
    id: '1',
    providerId: 'p1',
    providerName: 'City Pediatrics',
    patientId: '1',
    patientName: 'Jacob Williams',
    service: 'Annual Check-up and Vaccinations',
    amount: 350,
    currency: 'USD',
    issueDate: '2023-08-20',
    dueDate: '2023-09-20',
    status: 'tokenized',
    tokenId: '0xabc...123',
    blockchainHash: '0x7a8b9c...1d2e3f',
  },
  {
    id: '2',
    providerId: 'p2',
    providerName: 'Metro Medical Center',
    service: 'Emergency Services',
    amount: 1200,
    currency: 'USD',
    issueDate: '2023-07-15',
    dueDate: '2023-08-15',
    status: 'funded',
    tokenId: '0xdef...456',
    blockchainHash: '0x4d5e6f...7a8b9c',
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Vaccination Due',
    message: 'Jacob Williams is due for the DTaP booster next week.',
    type: 'vaccination',
    date: '2023-09-01T10:30:00Z',
    read: false,
    actionUrl: '/vaccination-history/1',
  },
  {
    id: '2',
    userId: 'user1',
    title: 'Invoice Funded',
    message: 'Your medical invoice #1 has been successfully funded.',
    type: 'invoice',
    date: '2023-08-25T14:15:00Z',
    read: true,
    actionUrl: '/invoice/1',
  }
];

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [upcomingVaccinations, setUpcomingVaccinations] = useState<VaccinationRecord[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<MedicalInvoice[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      fetchChildProfiles();
      fetchMockData(); // you can replace this with Supabase if needed
    }
  }, [user]);

  const fetchChildProfiles = async () => {
    const { data, error } = await supabase
      .from('child_profiles')
      .select('*')
      .eq('parent_id', user.id);

    if (error) {
      console.error('Error fetching child profiles:', error.message);
      return;
    }

    setProfiles(data || []);
  };

  const fetchMockData = () => {
    setUpcomingVaccinations(mockVaccinations.filter(v => v.nextDoseDate));
    setRecentInvoices(mockInvoices);
    setNotifications(mockNotifications);
  };
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>
        <p className="text-neutral-600 dark:text-neutral-300">Welcome back to your healthcare management portal</p>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-5 border-l-4 border-primary-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Child Profiles</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{profiles.length}</p>
            </div>
            <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/profiles" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
              View all profiles
            </Link>
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-5 border-l-4 border-secondary-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Upcoming Vaccinations</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{upcomingVaccinations.length}</p>
            </div>
            <div className="bg-secondary-100 dark:bg-secondary-900/30 p-3 rounded-full">
              <Shield className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/vaccination-history/all" className="text-secondary-600 dark:text-secondary-400 text-sm font-medium hover:underline">
              View vaccination schedule
            </Link>
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-5 border-l-4 border-accent-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Tokenized Invoices</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                {recentInvoices.filter(i => i.status === 'tokenized' || i.status === 'funded').length}
              </p>
            </div>
            <div className="bg-accent-100 dark:bg-accent-900/30 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-accent-600 dark:text-accent-400" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/invoice/marketplace" className="text-accent-600 dark:text-accent-400 text-sm font-medium hover:underline">
              View marketplace
            </Link>
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-5 border-l-4 border-success-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Unread Notifications</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                {notifications.filter(n => !n.read).length}
              </p>
            </div>
            <div className="bg-success-100 dark:bg-success-900/30 p-3 rounded-full">
              <Zap className="h-6 w-6 text-success-600 dark:text-success-400" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/notifications" className="text-success-600 dark:text-success-400 text-sm font-medium hover:underline">
              View all notifications
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Child profiles section */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Child Profiles</h2>
            <Link to="/profiles" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              View all
            </Link>
          </div>
          
          <div className="p-6">
            {profiles.length > 0 ? (
              <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {profiles.map((profile) => (
                  <li key={profile.id} className="py-4 flex items-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                          {profile.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-neutral-900 dark:text-white">{profile.name}</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Born: {new Date(profile.birth_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Link 
                      to={`/vaccination-history/${profile.id}`}
                      className="px-3 py-1 text-xs border border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-colors"
                    >
                      View History
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">No profiles yet</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">Start by adding your child's profile</p>
                <Link to="/profiles" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                  Add Child Profile
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Upcoming vaccinations section */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Upcoming Vaccinations</h2>
            <Link to="/vaccination-history/all" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              View all
            </Link>
          </div>
          
          <div className="p-6">
            {upcomingVaccinations.length > 0 ? (
              <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {upcomingVaccinations.map((vaccination) => {
                  const child = profiles.find(p => p.id === vaccination.childId);
                  return (
                    <li key={vaccination.id} className="py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-secondary-100 dark:bg-secondary-900/30 p-2 rounded-full">
                          <Shield className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                              {vaccination.vaccineName} (Dose {vaccination.dose + 1})
                            </h3>
                            <p className="ml-2 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-full">
                              {child?.name}
                            </p>
                          </div>
                          <div className="mt-1 flex items-center">
                            <Clock className="h-4 w-4 text-neutral-400 mr-1" />
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              Due: {new Date(vaccination.nextDoseDate!).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">No upcoming vaccinations</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">All your vaccination schedules are up to date</p>
                <Link to="/health-centers" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                  Find Health Centers
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent invoices section */}
      <div className="mt-8 bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Recent Medical Invoices</h2>
          <Link to="/invoice/marketplace" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            View marketplace
          </Link>
        </div>
        
        <div className="p-6">
          {recentInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                <thead>
                  <tr>
                    <th className="px-3 py-3 bg-neutral-50 dark:bg-neutral-700 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-3 py-3 bg-neutral-50 dark:bg-neutral-700 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-3 py-3 bg-neutral-50 dark:bg-neutral-700 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 py-3 bg-neutral-50 dark:bg-neutral-700 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-3 py-3 bg-neutral-50 dark:bg-neutral-700 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-3 bg-neutral-50 dark:bg-neutral-700"></th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                  {recentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
                        {invoice.providerName}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-300">
                        {invoice.service}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-white">
                        ${invoice.amount.toLocaleString()}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-300">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${invoice.status === 'pending' ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300' : 
                            invoice.status === 'tokenized' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300' :
                            invoice.status === 'funded' ? 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300' :
                            'bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300'
                          }`}
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          to={`/invoice/${invoice.id}`}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">No invoices yet</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">Upload a medical invoice to get started</p>
              <Link to="/invoice/upload" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                Upload Invoice
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;