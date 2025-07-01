import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Notification } from '../../types';
import NotificationItem from '../../components/common/NotificationItem';

// Mock data
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
  },
  {
    id: '3',
    userId: 'user1',
    title: 'New Health Center Nearby',
    message: 'A new vaccination center has opened in your area.',
    type: 'system',
    date: '2023-08-20T09:45:00Z',
    read: false,
    actionUrl: '/health-centers',
  },
  {
    id: '4',
    userId: 'user1',
    title: 'Profile Successfully Tokenized',
    message: 'Emma Davis\'s profile has been securely stored on the blockchain.',
    type: 'system',
    date: '2023-08-15T16:30:00Z',
    read: true,
  },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  
  useEffect(() => {
    // In a real app, this would be an API call
    setNotifications(mockNotifications);
  }, []);
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.read;
    return notification.type === activeFilter;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
          <p className="text-neutral-600">Stay updated on your healthcare and finance activities</p>
        </div>
        
        <button
          onClick={handleMarkAllAsRead}
          className="btn-outline mt-4 md:mt-0"
          disabled={!notifications.some(n => !n.read)}
        >
          Mark all as read
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-neutral-200">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeFilter === 'all' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              All Notifications
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeFilter === 'unread' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
              onClick={() => setActiveFilter('unread')}
            >
              Unread
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeFilter === 'vaccination' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
              onClick={() => setActiveFilter('vaccination')}
            >
              Vaccinations
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeFilter === 'invoice' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
              onClick={() => setActiveFilter('invoice')}
            >
              Invoices
            </button>
          </div>
        </div>
        
        <div>
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-neutral-200">
              {filteredNotifications.map((notification) => (
                <NotificationItem 
                  key={notification.id}
                  notification={notification}
                  onRead={handleMarkAsRead}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No notifications</h3>
              <p className="text-neutral-600">
                {activeFilter === 'all' 
                  ? 'You don\'t have any notifications yet' 
                  : `You don't have any ${activeFilter === 'unread' ? 'unread' : activeFilter} notifications`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;