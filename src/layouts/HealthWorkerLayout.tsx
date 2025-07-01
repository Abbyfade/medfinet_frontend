import { Outlet } from 'react-router-dom';
import Sidebar from '../components/health-worker/Sidebar';

const HealthWorkerLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default HealthWorkerLayout;