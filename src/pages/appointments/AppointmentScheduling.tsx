import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Search, 
  Filter,
  CheckCircle,
  AlertCircle,
  XCircle,
  Phone,
  Mail,
  Edit,
  Trash2,
  Video,
  MessageCircle
} from 'lucide-react';

interface Appointment {
  id: string;
  childName: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  appointmentType: 'vaccination' | 'checkup' | 'consultation' | 'follow-up';
  date: string;
  time: string;
  duration: number;
  clinic: string;
  healthWorker: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  vaccines?: string[];
  reminderSent: boolean;
  isVirtual: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
  healthWorker?: string;
}

const AppointmentScheduling = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClinic, setSelectedClinic] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    loadAppointments();
  }, [selectedDate, selectedClinic, selectedStatus]);

  const loadAppointments = () => {
    // Mock appointment data
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        childName: 'Emma Davis',
        parentName: 'Maria Davis',
        parentEmail: 'maria.davis@email.com',
        parentPhone: '(555) 123-4567',
        appointmentType: 'vaccination',
        date: selectedDate,
        time: '09:00',
        duration: 30,
        clinic: 'City Pediatrics',
        healthWorker: 'Dr. Sarah Johnson',
        status: 'confirmed',
        vaccines: ['DTaP', 'MMR'],
        reminderSent: true,
        isVirtual: false
      },
      {
        id: '2',
        childName: 'Jacob Williams',
        parentName: 'John Williams',
        parentEmail: 'john.williams@email.com',
        parentPhone: '(555) 987-6543',
        appointmentType: 'checkup',
        date: selectedDate,
        time: '10:30',
        duration: 45,
        clinic: 'Metro Medical Center',
        healthWorker: 'Dr. Michael Chen',
        status: 'scheduled',
        reminderSent: false,
        isVirtual: true
      },
      {
        id: '3',
        childName: 'Sophie Chen',
        parentName: 'Lisa Chen',
        parentEmail: 'lisa.chen@email.com',
        parentPhone: '(555) 456-7890',
        appointmentType: 'follow-up',
        date: selectedDate,
        time: '14:00',
        duration: 20,
        clinic: 'Community Health Center',
        healthWorker: 'Nurse Jennifer Wilson',
        status: 'completed',
        notes: 'Follow-up after recent vaccination',
        reminderSent: true,
        isVirtual: false
      }
    ];

    setAppointments(mockAppointments);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.healthWorker.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClinic = selectedClinic === 'all' || appointment.clinic === selectedClinic;
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
    
    return matchesSearch && matchesClinic && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-primary-600 bg-primary-50 border-primary-200';
      case 'confirmed': return 'text-success-600 bg-success-50 border-success-200';
      case 'completed': return 'text-neutral-600 bg-neutral-50 border-neutral-200';
      case 'cancelled': return 'text-error-600 bg-error-50 border-error-200';
      case 'no-show': return 'text-warning-600 bg-warning-50 border-warning-200';
      default: return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'no-show': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'vaccination': return 'text-primary-600 bg-primary-100';
      case 'checkup': return 'text-secondary-600 bg-secondary-100';
      case 'consultation': return 'text-accent-600 bg-accent-100';
      case 'follow-up': return 'text-warning-600 bg-warning-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: newStatus as any }
          : apt
      )
    );
  };

  const handleSendReminder = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, reminderSent: true }
          : apt
      )
    );
  };

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isBooked = appointments.some(apt => apt.time === time && apt.date === selectedDate);
        slots.push({
          time,
          available: !isBooked,
          healthWorker: isBooked ? appointments.find(apt => apt.time === time)?.healthWorker : undefined
        });
      }
    }
    return slots;
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                Appointment Scheduling
              </h1>
              <p className="text-neutral-600 dark:text-neutral-300">
                Manage vaccination appointments and health consultations
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600'
                  }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'calendar'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600'
                  }`}
                >
                  Calendar View
                </button>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
              />
            </div>
            
            <div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
              />
            </div>
            
            <div>
              <select
                value={selectedClinic}
                onChange={(e) => setSelectedClinic(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
              >
                <option value="all">All Clinics</option>
                <option value="City Pediatrics">City Pediatrics</option>
                <option value="Metro Medical Center">Metro Medical Center</option>
                <option value="Community Health Center">Community Health Center</option>
              </select>
            </div>
            
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-300">
                {filteredAppointments.length} appointments
              </span>
            </div>
          </div>
        </div>

        {viewMode === 'list' ? (
          /* List View */
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                <thead className="bg-neutral-50 dark:bg-neutral-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Patient & Parent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Appointment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {appointment.childName}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            Parent: {appointment.parentName}
                          </div>
                          <div className="flex items-center mt-1 space-x-2">
                            <Phone className="h-3 w-3 text-neutral-400" />
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              {appointment.parentPhone}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAppointmentTypeColor(appointment.appointmentType)}`}>
                              {appointment.appointmentType}
                            </span>
                            {appointment.isVirtual && (
                              <Video className="h-4 w-4 text-primary-600 dark:text-primary-400 ml-2" />
                            )}
                          </div>
                          <div className="text-sm text-neutral-900 dark:text-white mt-1">
                            {appointment.time} ({appointment.duration} min)
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {appointment.clinic}
                          </div>
                          {appointment.vaccines && (
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                              Vaccines: {appointment.vaccines.join(', ')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-neutral-500 mr-2" />
                          <span className="text-sm text-neutral-900 dark:text-white">
                            {appointment.healthWorker}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1 capitalize">{appointment.status}</span>
                          </span>
                          {!appointment.reminderSent && appointment.status === 'scheduled' && (
                            <span className="text-xs text-warning-600 dark:text-warning-400">
                              Reminder pending
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {appointment.status === 'scheduled' && (
                            <button
                              onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                              className="text-success-600 dark:text-success-400 hover:text-success-900 dark:hover:text-success-300"
                              title="Confirm appointment"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          
                          {!appointment.reminderSent && (
                            <button
                              onClick={() => handleSendReminder(appointment.id)}
                              className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                              title="Send reminder"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => setSelectedAppointment(appointment)}
                            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300"
                            title="Edit appointment"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          <button
                            className="text-error-600 dark:text-error-400 hover:text-error-900 dark:hover:text-error-300"
                            title="Cancel appointment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Calendar View */
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Daily Schedule - {new Date(selectedDate).toLocaleDateString()}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Time Slots */}
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-white mb-3">Available Time Slots</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {generateTimeSlots().map((slot) => (
                    <div
                      key={slot.time}
                      className={`p-3 rounded-lg border ${
                        slot.available
                          ? 'border-success-200 bg-success-50 dark:bg-success-900/20'
                          : 'border-neutral-200 bg-neutral-50 dark:bg-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-neutral-900 dark:text-white">
                          {slot.time}
                        </span>
                        {slot.available ? (
                          <span className="text-success-600 dark:text-success-400 text-sm">Available</span>
                        ) : (
                          <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                            Booked - {slot.healthWorker}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Appointments */}
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-white mb-3">Today's Appointments</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredAppointments
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Clock className="h-4 w-4 text-neutral-500 mr-2" />
                            <span className="font-medium text-neutral-900 dark:text-white">
                              {appointment.time}
                            </span>
                            <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAppointmentTypeColor(appointment.appointmentType)}`}>
                              {appointment.appointmentType}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">
                            {appointment.childName}
                          </p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            with {appointment.healthWorker}
                          </p>
                          {appointment.vaccines && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                              Vaccines: {appointment.vaccines.join(', ')}
                            </p>
                          )}
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">{appointment.status}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Appointment Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsAddModalOpen(false)}></div>
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl overflow-hidden w-full max-w-2xl mx-auto z-10">
                <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                    Schedule New Appointment
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Child Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                        placeholder="Enter child's name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Parent Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                        placeholder="Enter parent's name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Appointment Type
                      </label>
                      <select className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-m focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white">
                        <option value="vaccination">Vaccination</option>
                        <option value="checkup">Check-up</option>
                        <option value="consultation">Consultation</option>
                        <option value="follow-up">Follow-up</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Appointment Mode
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input type="radio" name="mode" value="in-person" className="mr-2" defaultChecked />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">In-person</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="mode" value="virtual" className="mr-2" />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">Virtual</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Time
                      </label>
                      <select className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white">
                        <option value="09:00">9:00 AM</option>
                        <option value="09:30">9:30 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="10:30">10:30 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="11:30">11:30 AM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="13:30">1:30 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="14:30">2:30 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="15:30">3:30 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="16:30">4:30 PM</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Clinic
                      </label>
                      <select className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white">
                        <option value="City Pediatrics">City Pediatrics</option>
                        <option value="Metro Medical Center">Metro Medical Center</option>
                        <option value="Community Health Center">Community Health Center</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Health Worker
                      </label>
                      <select className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white">
                        <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                        <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                        <option value="Nurse Jennifer Wilson">Nurse Jennifer Wilson</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Notes
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                        rows={3}
                        placeholder="Add any additional notes or instructions"
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Handle appointment creation
                      setIsAddModalOpen(false);
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Schedule Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View/Edit Appointment Modal */}
        {selectedAppointment && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedAppointment(null)}></div>
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl overflow-hidden w-full max-w-2xl mx-auto z-10">
                <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                    Appointment Details
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${getAppointmentTypeColor(selectedAppointment.appointmentType)}`}>
                        {selectedAppointment.appointmentType === 'vaccination' ? (
                          <Stethoscope className="h-5 w-5" />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-neutral-900 dark:text-white">
                          {selectedAppointment.appointmentType.charAt(0).toUpperCase() + selectedAppointment.appointmentType.slice(1)}
                        </h4>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {selectedAppointment.duration} minutes
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedAppointment.status)}`}>
                      {getStatusIcon(selectedAppointment.status)}
                      <span className="ml-1 capitalize">{selectedAppointment.status}</span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h5 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Patient Information</h5>
                      <p className="text-neutral-900 dark:text-white font-medium">{selectedAppointment.childName}</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">Parent: {selectedAppointment.parentName}</p>
                      <div className="flex items-center mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        <Phone className="h-4 w-4 mr-2" />
                        {selectedAppointment.parentPhone}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        <Mail className="h-4 w-4 mr-2" />
                        {selectedAppointment.parentEmail}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Appointment Details</h5>
                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 text-neutral-500 mr-2" />
                        <span className="text-neutral-900 dark:text-white">
                          {new Date(selectedAppointment.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 text-neutral-500 mr-2" />
                        <span className="text-neutral-900 dark:text-white">{selectedAppointment.time}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 text-neutral-500 mr-2" />
                        <span className="text-neutral-900 dark:text-white">{selectedAppointment.clinic}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-neutral-500 mr-2" />
                        <span className="text-neutral-900 dark:text-white">{selectedAppointment.healthWorker}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedAppointment.vaccines && (
                    <div className="mb-6">
                      <h5 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Vaccines</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedAppointment.vaccines.map((vaccine) => (
                          <span key={vaccine} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {vaccine}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedAppointment.notes && (
                    <div className="mb-6">
                      <h5 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Notes</h5>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-700 p-3 rounded-md">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                    <h5 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-3">Actions</h5>
                    <div className="flex flex-wrap gap-3">
                      {selectedAppointment.status === 'scheduled' && (
                        <button
                          onClick={() => handleStatusChange(selectedAppointment.id, 'confirmed')}
                          className="flex items-center px-3 py-2 bg-success-600 text-white rounded-md hover:bg-success-700 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirm
                        </button>
                      )}
                      
                      {selectedAppointment.status !== 'cancelled' && selectedAppointment.status !== 'completed' && (
                        <button
                          onClick={() => handleStatusChange(selectedAppointment.id, 'cancelled')}
                          className="flex items-center px-3 py-2 bg-error-600 text-white rounded-md hover:bg-error-700 transition-colors"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel
                        </button>
                      )}
                      
                      {selectedAppointment.status !== 'completed' && selectedAppointment.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusChange(selectedAppointment.id, 'completed')}
                          className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Completed
                        </button>
                      )}
                      
                      {!selectedAppointment.reminderSent && selectedAppointment.status !== 'cancelled' && selectedAppointment.status !== 'completed' && (
                        <button
                          onClick={() => handleSendReminder(selectedAppointment.id)}
                          className="flex items-center px-3 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Send Reminder
                        </button>
                      )}
                      
                      {selectedAppointment.isVirtual && selectedAppointment.status !== 'cancelled' && selectedAppointment.status !== 'completed' && (
                        <button className="flex items-center px-3 py-2 border border-primary-300 dark:border-primary-600 text-primary-700 dark:text-primary-300 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                          <Video className="h-4 w-4 mr-2" />
                          Start Video Call
                        </button>
                      )}
                      
                      <button className="flex items-center px-3 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600"
                  >
                    Close
                  </button>
                  <button
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Edit Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentScheduling;