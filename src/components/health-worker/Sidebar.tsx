import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Plus, 
  Link as LinkIcon, 
  History, 
  Building, 
  LogOut,
  Shield,
  Moon,
  Sun
} from 'lucide-react';
import { useHealthWorker } from '../../contexts/HealthWorkerContext';
import { useTheme } from '../../contexts/ThemeContext';


const Sidebar = () => {
  const location = useLocation();
  const { healthWorker, logout } = useHealthWorker();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/health-worker/dashboard', icon: Home },
    { name: 'Issue Vaccine', path: '/health-worker/issue-vaccine', icon: Plus },
    { name: 'Link to Parent', path: '/health-worker/link-parent', icon: LinkIcon },
    { name: 'Vaccination History', path: '/health-worker/vaccination-history', icon: History },
    { name: 'Facility Profile', path: '/health-worker/facility-profile', icon: Building },
  ];

  return (
    <div className="w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" />
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-white">MedFiNet</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Health Worker Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile & Actions */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        {healthWorker && (
          <div className="mb-4 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <h3 className="font-medium text-neutral-900 dark:text-white text-sm">
              {healthWorker.name}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              {healthWorker.clinic}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400  truncate font-mono">
              {healthWorker.walletAddress}
            </p>
          </div>
        )}
       
        <div className="space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            {theme === 'light' ? (
              <>
                <Moon className="h-4 w-4 mr-3" />
                Dark Mode
              </>
            ) : (
              <>
                <Sun className="h-4 w-4 mr-3" />
                Light Mode
              </>
            )}
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;