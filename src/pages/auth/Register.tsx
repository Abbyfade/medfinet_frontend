import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import UserContext from '../../contexts/UserContext';
import supabase from '../../utils/supabaseClient';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('parent');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  if (!name || !email || !password || password !== confirmPassword) {
    setError('Please check your input');
    setIsLoading(false);
    return;
  }

  try {
    // 🔐 1. Sign up the user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;

    const user = data.user;
    if (!user) throw new Error('User not returned from Supabase');

    // 📄 2. Insert into 'profiles' table
    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      name,
      email,
      role,
    });

    if (profileError) throw profileError;

    // ✅ 3. Log user in and navigate
    login({
      id: user.id,
      name,
      email,
      role,
      wallet_address: '', // default empty if not from wallet
    });

    navigate('/dashboard');
  } catch (err: any) {
    setError(err.message || 'Registration failed');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Create your account</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">Join MedFiNet Healthcare Platform</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
            </div>
            <input
              id="name"
              type="text"
              className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-neutral-700 dark:text-white"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
            </div>
            <input
              id="email"
              type="email"
              className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-neutral-700 dark:text-white"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
            </div>
            <input
              id="password"
              type="password"
              className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-neutral-700 dark:text-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <p className="text-xs mt-1 text-neutral-500">Minimum 6 characters</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
            </div>
            <input
              id="confirmPassword"
              type="password"
              className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-neutral-700 dark:text-white"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">I am a:</label>
          <select
            id="role"
            className="w-full px-3 py-2 border rounded-md dark:bg-neutral-700 dark:text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isLoading}
          >
            <option value="parent">Parent / Guardian</option>
            <option value="health practitioner">Healthcare Provider</option>
            <option value="funder">Medical Finance Provider</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-primary-600 border-neutral-300 rounded"
            disabled={isLoading}
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
            I agree to the <a href="#" className="text-primary-600 underline">Terms of Service</a> and <a href="#" className="text-primary-600 underline">Privacy Policy</a>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
