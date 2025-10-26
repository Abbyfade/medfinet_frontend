import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2,
  Plus,
  Shield,
  User,
  Stethoscope,
  Baby,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Loader2,
  X,
  Save
} from 'lucide-react';

interface HealthWorker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'doctor' | 'nurse' | 'administrator';
  specialization: string;
  licenseNumber: string;
  status: 'active' | 'inactive' | 'suspended';
  walletAddress: string;
  verified: boolean;
  joinDate: string;
  lastActive: string;
  password: string;
}

interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  walletAddress: string;
  children: number;
  status: 'active' | 'inactive';
  joinDate: string;
  lastActive: string;
}

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  parentId: string;
  parentName: string;
  vaccinations: number;
  status: 'up-to-date' | 'overdue' | 'pending';
  lastVaccination: string;
  medicalConditions: string[];
  allergies: string[];
}

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState<'health-workers' | 'parents' | 'children'>('health-workers');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [healthWorkerForm, setHealthWorkerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'nurse' as 'doctor' | 'nurse' | 'administrator',
    specialization: '',
    licenseNumber: '',
    password: ''
  });

  const [parentForm, setParentForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [childForm, setChildForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: 'male' as 'male' | 'female' | 'other',
    parentId: '',
    medicalConditions: [] as string[],
    allergies: [] as string[]
  });

  // Mock data
  const [healthWorkers, setHealthWorkers] = useState<HealthWorker[]>([
    {
      id: 'hw_001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@hospital.com',
      phone: '(555) 123-4567',
      role: 'doctor',
      specialization: 'Pediatrics',
      licenseNumber: 'MD-12345-NY',
      status: 'active',
      walletAddress: 'ALGO7X8Y9Z...ABC123',
      verified: true,
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      password: 'temp123'
    },
    {
      id: 'hw_002',
      firstName: 'Maria',
      lastName: 'Rodriguez',
      email: 'maria.rodriguez@hospital.com',
      phone: '(555) 987-6543',
      role: 'nurse',
      specialization: 'Immunization',
      licenseNumber: 'RN-67890-CA',
      status: 'active',
      walletAddress: 'ALGO9A8B7C...DEF456',
      verified: true,
      joinDate: '2024-01-20',
      lastActive: '1 day ago',
      password: 'temp456'
    }
  ]);

  const [parents, setParents] = useState<Parent[]>([
    {
      id: 'p_001',
      firstName: 'John',
      lastName: 'Williams',
      email: 'john.williams@email.com',
      phone: '(555) 123-4567',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      walletAddress: 'ALGO7X8Y9Z...ABC123',
      children: 2,
      status: 'active',
      joinDate: '2024-01-10',
      lastActive: '1 hour ago'
    },
    {
      id: 'p_002',
      firstName: 'Maria',
      lastName: 'Davis',
      email: 'maria.davis@email.com',
      phone: '(555) 987-6543',
      address: '456 Oak Ave',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201',
      walletAddress: 'ALGO9A8B7C...DEF456',
      children: 1,
      status: 'active',
      joinDate: '2024-01-12',
      lastActive: '3 hours ago'
    }
  ]);

  const [children, setChildren] = useState<Child[]>([
    {
      id: 'c_001',
      firstName: 'Jacob',
      lastName: 'Williams',
      birthDate: '2020-05-15',
      gender: 'male',
      parentId: 'p_001',
      parentName: 'John Williams',
      vaccinations: 8,
      status: 'up-to-date',
      lastVaccination: '2024-01-15',
      medicalConditions: ['Asthma'],
      allergies: ['Peanuts']
    },
    {
      id: 'c_002',
      firstName: 'Emma',
      lastName: 'Davis',
      birthDate: '2022-03-10',
      gender: 'female',
      parentId: 'p_002',
      parentName: 'Maria Davis',
      vaccinations: 5,
      status: 'overdue',
      lastVaccination: '2023-12-20',
      medicalConditions: [],
      allergies: ['Shellfish']
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'up-to-date':
        return 'text-success-600 bg-success-50 border-success-200';
      case 'pending':
        return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'suspended':
      case 'overdue':
        return 'text-error-600 bg-error-50 border-error-200';
      case 'inactive':
        return 'text-neutral-600 bg-neutral-50 border-neutral-200';
      default:
        return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor':
        return <Stethoscope className="h-4 w-4" />;
      case 'nurse':
        return <Shield className="h-4 w-4" />;
      case 'administrator':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const openModal = (type: 'add' | 'edit' | 'view', item?: any) => {
    setModalType(type);
    setSelectedItem(item || null);
    
    if (type === 'edit' && item) {
      if (activeTab === 'health-workers') {
        setHealthWorkerForm({
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
          phone: item.phone,
          role: item.role,
          specialization: item.specialization,
          licenseNumber: item.licenseNumber,
          password: item.password
        });
      } else if (activeTab === 'parents') {
        setParentForm({
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
          phone: item.phone,
          address: item.address,
          city: item.city,
          state: item.state,
          zipCode: item.zipCode
        });
      } else if (activeTab === 'children') {
        setChildForm({
          firstName: item.firstName,
          lastName: item.lastName,
          birthDate: item.birthDate,
          gender: item.gender,
          parentId: item.parentId,
          medicalConditions: item.medicalConditions,
          allergies: item.allergies
        });
      }
    } else {
      // Reset forms for add mode
      setHealthWorkerForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'nurse',
        specialization: '',
        licenseNumber: '',
        password: ''
      });
      setParentForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
      });
      setChildForm({
        firstName: '',
        lastName: '',
        birthDate: '',
        gender: 'male',
        parentId: '',
        medicalConditions: [],
        allergies: []
      });
    }
    
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (activeTab === 'health-workers') {
        const newHealthWorker: HealthWorker = {
          id: modalType === 'add' ? `hw_${Date.now()}` : selectedItem.id,
          ...healthWorkerForm,
          status: 'active',
          walletAddress: modalType === 'add' ? `ALGO${Math.random().toString(36).substr(2, 20).toUpperCase()}` : selectedItem.walletAddress,
          verified: true,
          joinDate: modalType === 'add' ? new Date().toISOString().split('T')[0] : selectedItem.joinDate,
          lastActive: 'Just now'
        };
        
        if (modalType === 'add') {
          setHealthWorkers(prev => [...prev, newHealthWorker]);
        } else {
          setHealthWorkers(prev => prev.map(hw => hw.id === selectedItem.id ? newHealthWorker : hw));
        }
      } else if (activeTab === 'parents') {
        const newParent: Parent = {
          id: modalType === 'add' ? `p_${Date.now()}` : selectedItem.id,
          ...parentForm,
          walletAddress: modalType === 'add' ? `ALGO${Math.random().toString(36).substr(2, 20).toUpperCase()}` : selectedItem.walletAddress,
          children: modalType === 'add' ? 0 : selectedItem.children,
          status: 'active',
          joinDate: modalType === 'add' ? new Date().toISOString().split('T')[0] : selectedItem.joinDate,
          lastActive: 'Just now'
        };
        
        if (modalType === 'add') {
          setParents(prev => [...prev, newParent]);
        } else {
          setParents(prev => prev.map(p => p.id === selectedItem.id ? newParent : p));
        }
      } else if (activeTab === 'children') {
        const newChild: Child = {
          id: modalType === 'add' ? `c_${Date.now()}` : selectedItem.id,
          ...childForm,
          parentName: parents.find(p => p.id === childForm.parentId)?.firstName + ' ' + parents.find(p => p.id === childForm.parentId)?.lastName || 'Unknown Parent',
          vaccinations: modalType === 'add' ? 0 : selectedItem.vaccinations,
          status: 'pending',
          lastVaccination: modalType === 'add' ? 'Never' : selectedItem.lastVaccination
        };
        
        if (modalType === 'add') {
          setChildren(prev => [...prev, newChild]);
        } else {
          setChildren(prev => prev.map(c => c.id === selectedItem.id ? newChild : c));
        }
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      if (activeTab === 'health-workers') {
        setHealthWorkers(prev => prev.filter(hw => hw.id !== id));
      } else if (activeTab === 'parents') {
        setParents(prev => prev.filter(p => p.id !== id));
      } else if (activeTab === 'children') {
        setChildren(prev => prev.filter(c => c.id !== id));
      }
    }
  };

  const addConditionOrAllergy = (type: 'medicalConditions' | 'allergies') => {
    const value = prompt(`Enter ${type === 'medicalConditions' ? 'medical condition' : 'allergy'}:`);
    if (value) {
      setChildForm(prev => ({
        ...prev,
        [type]: [...prev[type], value]
      }));
    }
  };

  const removeConditionOrAllergy = (type: 'medicalConditions' | 'allergies', index: number) => {
    setChildForm(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const renderHealthWorkers = () => (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <input type="checkbox" className="rounded border-neutral-300" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Health Worker
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Role & Specialization
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Last Active
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
            {healthWorkers.map((worker) => (
              <tr key={worker.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="checkbox" 
                    className="rounded border-neutral-300"
                    checked={selectedUsers.includes(worker.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, worker.id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== worker.id));
                      }
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        {getRoleIcon(worker.role)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        {worker.firstName} {worker.lastName}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {worker.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-900 dark:text-white capitalize">
                    {worker.role}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    {worker.specialization}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-900 dark:text-white">
                    {worker.phone}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    License: {worker.licenseNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(worker.status)}`}>
                    {worker.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                  {worker.lastActive}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => openModal('view', worker)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openModal('edit', worker)}
                      className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(worker.id)}
                      className="text-error-600 dark:text-error-400 hover:text-error-900 dark:hover:text-error-300"
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
  );

  const renderParents = () => (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <input type="checkbox" className="rounded border-neutral-300" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Parent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Children
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
            {parents.map((parent) => (
              <tr key={parent.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded border-neutral-300" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                        <User className="h-4 w-4 text-secondary-600 dark:text-secondary-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        {parent.firstName} {parent.lastName}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {parent.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-900 dark:text-white">
                    {parent.phone}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 font-mono">
                    {parent.walletAddress}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-900 dark:text-white">
                    {parent.address}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    {parent.city}, {parent.state} {parent.zipCode}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Baby className="h-4 w-4 text-accent-600 dark:text-accent-400 mr-1" />
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      {parent.children}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(parent.status)}`}>
                    {parent.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => openModal('view', parent)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openModal('edit', parent)}
                      className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(parent.id)}
                      className="text-error-600 dark:text-error-400 hover:text-error-900 dark:hover:text-error-300"
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
  );

  const renderChildren = () => (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Child
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Parent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Age & Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Vaccinations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
            {children.map((child) => (
              <tr key={child.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                        <Baby className="h-4 w-4 text-accent-600 dark:text-accent-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        {child.firstName} {child.lastName}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        Born: {new Date(child.birthDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
                  {child.parentName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-900 dark:text-white">
                    {Math.floor((new Date().getTime() - new Date(child.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 capitalize">
                    {child.gender}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-900 dark:text-white">
                    {child.vaccinations} completed
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    Last: {child.lastVaccination === 'Never' ? 'Never' : new Date(child.lastVaccination).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(child.status)}`}>
                    {child.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => openModal('view', child)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openModal('edit', child)}
                      className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(child.id)}
                      className="text-error-600 dark:text-error-400 hover:text-error-900 dark:hover:text-error-300"
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
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          User Management
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Manage health workers, parents, and children in your hospital system
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'health-workers', label: 'Health Workers', icon: Stethoscope },
            { id: 'parents', label: 'Parents', icon: User },
            { id: 'children', label: 'Children', icon: Baby }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => openModal('add')}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {activeTab === 'health-workers' ? 'Health Worker' : activeTab === 'parents' ? 'Parent' : 'Child'}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'health-workers' && renderHealthWorkers()}
      {activeTab === 'parents' && renderParents()}
      {activeTab === 'children' && renderChildren()}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}></div>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl overflow-hidden w-full max-w-2xl mx-auto z-10">
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {modalType === 'add' ? 'Add' : modalType === 'edit' ? 'Edit' : 'View'} {
                    activeTab === 'health-workers' ? 'Health Worker' : 
                    activeTab === 'parents' ? 'Parent' : 'Child'
                  }
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                {/* Health Worker Form */}
                {activeTab === 'health-workers' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={healthWorkerForm.firstName}
                          onChange={(e) => setHealthWorkerForm({...healthWorkerForm, firstName: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={healthWorkerForm.lastName}
                          onChange={(e) => setHealthWorkerForm({...healthWorkerForm, lastName: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={healthWorkerForm.email}
                          onChange={(e) => setHealthWorkerForm({...healthWorkerForm, email: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={healthWorkerForm.phone}
                          onChange={(e) => setHealthWorkerForm({...healthWorkerForm, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Role *
                        </label>
                        <select
                          value={healthWorkerForm.role}
                          onChange={(e) => setHealthWorkerForm({...healthWorkerForm, role: e.target.value as any})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        >
                          <option value="doctor">Doctor</option>
                          <option value="nurse">Nurse</option>
                          <option value="administrator">Administrator</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Specialization *
                        </label>
                        <input
                          type="text"
                          value={healthWorkerForm.specialization}
                          onChange={(e) => setHealthWorkerForm({...healthWorkerForm, specialization: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          License Number *
                        </label>
                        <input
                          type="text"
                          value={healthWorkerForm.licenseNumber}
                          onChange={(e) => setHealthWorkerForm({...healthWorkerForm, licenseNumber: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Password *
                        </label>
                        <input
                          type="password"
                          value={healthWorkerForm.password}
                          onChange={(e) => setHealthWorkerForm({...healthWorkerForm, password: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                          placeholder={modalType === 'edit' ? 'Leave blank to keep current password' : 'Enter password'}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Parent Form */}
                {activeTab === 'parents' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={parentForm.firstName}
                          onChange={(e) => setParentForm({...parentForm, firstName: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={parentForm.lastName}
                          onChange={(e) => setParentForm({...parentForm, lastName: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={parentForm.email}
                          onChange={(e) => setParentForm({...parentForm, email: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={parentForm.phone}
                          onChange={(e) => setParentForm({...parentForm, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Address *
                        </label>
                        <input
                          type="text"
                          value={parentForm.address}
                          onChange={(e) => setParentForm({...parentForm, address: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={parentForm.city}
                          onChange={(e) => setParentForm({...parentForm, city: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          value={parentForm.state}
                          onChange={(e) => setParentForm({...parentForm, state: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          value={parentForm.zipCode}
                          onChange={(e) => setParentForm({...parentForm, zipCode: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Child Form */}
                {activeTab === 'children' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={childForm.firstName}
                          onChange={(e) => setChildForm({...childForm, firstName: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={childForm.lastName}
                          onChange={(e) => setChildForm({...childForm, lastName: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Birth Date *
                        </label>
                        <input
                          type="date"
                          value={childForm.birthDate}
                          onChange={(e) => setChildForm({...childForm, birthDate: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Gender *
                        </label>
                        <select
                          value={childForm.gender}
                          onChange={(e) => setChildForm({...childForm, gender: e.target.value as any})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Parent *
                        </label>
                        <select
                          value={childForm.parentId}
                          onChange={(e) => setChildForm({...childForm, parentId: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={modalType === 'view'}
                        >
                          <option value="">Select Parent</option>
                          {parents.map(parent => (
                            <option key={parent.id} value={parent.id}>
                              {parent.firstName} {parent.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Medical Conditions */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Medical Conditions
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {childForm.medicalConditions.map((condition, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                            {condition}
                            {modalType !== 'view' && (
                              <button
                                onClick={() => removeConditionOrAllergy('medicalConditions', index)}
                                className="ml-1 text-warning-600 hover:text-warning-800"
                              >
                                ×
                              </button>
                            )}
                          </span>
                        ))}
                        {modalType !== 'view' && (
                          <button
                            onClick={() => addConditionOrAllergy('medicalConditions')}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                          >
                            + Add Condition
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Allergies */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Allergies
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {childForm.allergies.map((allergy, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-800">
                            {allergy}
                            {modalType !== 'view' && (
                              <button
                                onClick={() => removeConditionOrAllergy('allergies', index)}
                                className="ml-1 text-error-600 hover:text-error-800"
                              >
                                ×
                              </button>
                            )}
                          </span>
                        ))}
                        {modalType !== 'view' && (
                          <button
                            onClick={() => addConditionOrAllergy('allergies')}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                          >
                            + Add Allergy
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {modalType !== 'view' && (
                <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-primary-400 flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {modalType === 'add' ? 'Create' : 'Save'}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;