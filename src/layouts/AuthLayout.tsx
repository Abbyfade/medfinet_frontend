import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 dark:from-neutral-800 dark:to-neutral-900 flex flex-col">
      <header className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center text-white hover:text-primary-100 dark:hover:text-neutral-200 transition-colors">
            <ShieldCheck className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold">MedFiNet</h1>
          </Link>
          <ThemeToggle className="text-white hover:bg-white hover:bg-opacity-20" />
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl overflow-hidden animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto py-4 px-4 text-center text-white/80 dark:text-neutral-300 text-sm">
        <p>© 2025 MedFiNet - Secure Healthcare Finance & Immunization Platform</p>
      </footer>
    </div>
  );
};

export default AuthLayout;