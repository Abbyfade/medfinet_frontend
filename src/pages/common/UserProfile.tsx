import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Wallet, 
  Calendar, 
  Shield, 
  Edit, 
  Save, 
  X,
  Copy,
  ExternalLink,
  Settings,
  Bell,
  Lock,
  Trash2
} from 'lucide-react';
import UserContext from '../../contexts/UserContext';
import ThemeToggle from '../../components/common/ThemeToggle';

const UserProfile = () => {
  const { user, updateUser, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [activeTab, setActiveTab] = useState('profile');

  // Mock wallet data - in real app, this would come from connected wallet
  const walletData = {
    address: 'ALGO7X8Y9Z...ABC123',
    balance: '1,247.50',
    currency: 'ALGO',
    transactions: 23,
    lastActivity: '2024-01-15T10:30:00Z',
  };

  const handleSaveProfile = () => {
    if (user) {
      updateUser({
        name: editForm.name,
        email: editForm.email,
      });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      logout();
      navigate('/');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            No User Found
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 animate-fade-in">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-primary-600 text-2xl font-bold">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <p className="text-primary-100">{user.email}</p>
                  <div className="flex items-center mt-2">
                    <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <ThemeToggle className="text-white hover:bg-white hover:bg-opacity-20" />
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors"
                >
                  <Edit className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md mb-6">
          <div className="border-b border-neutral-200 dark:border-neutral-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'profile', label: 'Profile Information', icon: User },
                { id: 'wallet', label: 'Wallet Details', icon: Wallet },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
                Profile Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                    />
                  ) : (
                    <p className="text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-700 px-3 py-2 rounded-md">
                      {user.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                    />
                  ) : (
                    <p className="text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-700 px-3 py-2 rounded-md">
                      {user.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Role
                  </label>
                  <p className="text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-700 px-3 py-2 rounded-md capitalize">
                    {user.role}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Member Since
                  </label>
                  <p className="text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-700 px-3 py-2 rounded-md">
                    January 2024
                  </p>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Wallet Details Tab */}
          {activeTab === 'wallet' && (
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
                Wallet Details
              </h2>
              
              <div className="space-y-6">
                {/* Wallet Address */}
                <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-neutral-900 dark:text-white">Wallet Address</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(walletData.address)}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                        title="Copy address"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => window.open(`https://algoexplorer.io/address/${walletData.address}`, '_blank')}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                        title="View on explorer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="font-mono text-sm text-neutral-600 dark:text-neutral-300">
                    {walletData.address}
                  </p>
                </div>

                {/* Balance */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-success-50 dark:bg-success-900/20 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Wallet className="h-8 w-8 text-success-600 dark:text-success-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-success-800 dark:text-success-300">Balance</p>
                        <p className="text-lg font-bold text-success-900 dark:text-success-200">
                          {walletData.balance} {walletData.currency}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-primary-800 dark:text-primary-300">Transactions</p>
                        <p className="text-lg font-bold text-primary-900 dark:text-primary-200">
                          {walletData.transactions}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary-50 dark:bg-secondary-900/20 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-8 w-8 text-secondary-600 dark:text-secondary-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-secondary-800 dark:text-secondary-300">Last Activity</p>
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-200">
                          {new Date(walletData.lastActivity).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wallet Actions */}
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-4">Wallet Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect New Wallet
                    </button>
                    <button className="flex items-center justify-center px-4 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Transaction History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
                Account Settings
              </h2>
              
              <div className="space-y-6">
                {/* Theme Settings */}
                <div className="border-b border-neutral-200 dark:border-neutral-700 pb-6">
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-4">Appearance</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Theme</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Choose your preferred theme</p>
                    </div>
                    <ThemeToggle showLabel />
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="border-b border-neutral-200 dark:border-neutral-700 pb-6">
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Email Notifications</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Receive updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Push Notifications</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Receive browser notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="border-b border-neutral-200 dark:border-neutral-700 pb-6">
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-4">Security</h3>
                  <div className="space-y-3">
                    <button className="flex items-center w-full text-left px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                      <Lock className="h-4 w-4 mr-3 text-neutral-500" />
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Change Password</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Update your account password</p>
                      </div>
                    </button>
                    <button className="flex items-center w-full text-left px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                      <Shield className="h-4 w-4 mr-3 text-neutral-500" />
                      <div>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Two-Factor Authentication</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Add an extra layer of security</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div>
                  <h3 className="font-medium text-error-600 dark:text-error-400 mb-4">Danger Zone</h3>
                  <div className="border border-error-200 dark:border-error-800 rounded-lg p-4 bg-error-50 dark:bg-error-900/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-error-800 dark:text-error-300">Delete Account</p>
                        <p className="text-sm text-error-600 dark:text-error-400">Permanently delete your account and all data</p>
                      </div>
                      <button
                        onClick={handleDeleteAccount}
                        className="flex items-center px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;