import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Wallet, QrCode } from 'lucide-react';
import UserContext from '../../contexts/UserContext';
import supabase from '../../utils/supabaseClient';
import { PeraWalletConnect } from '@perawallet/connect';

const peraWallet = new PeraWalletConnect({
  network: "testnet" // Must match your algod client
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) throw signInError;

    const user = data.user;

    // Now fetch user's profile using the Auth user.id (UUID)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    if (error || !user) {
      setError('Invalid email or password');
    } else {
      login({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        wallet_address: profile.wallet_address || '',
      });
      navigate('/dashboard');
    }
  } catch (err) {
    console.error(err);
    setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectPeraWallet = async () => {
    setIsConnectingWallet(true);
    setError('');

    try {
  const accounts = await peraWallet.connect();
  const walletAddress = accounts[0];

  // ✅ Check if wallet user exists
  const { data: existing, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  let user;

  if (!existing) {
    // ✅ Create new wallet-based user profile
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([
        {
          name: 'Pera Wallet User',
          email: `${walletAddress}@wallet.medfi`,
          role: 'parent',
          wallet_address: walletAddress,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;
    user = newProfile;
  } else {
    user = existing;
  }

  login({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    wallet_address: user.wallet_address,
  });

  navigate('/dashboard');
} catch (err: any) {
  setError(err.message || 'Failed to connect wallet');
}
 finally {
      peraWallet.disconnect();
      setIsConnectingWallet(false);
    }
  };

  const handleScanQRCode = () => {
    const qrUser = {
      id: `user_qr_${Date.now()}`,
      name: 'QR Code User',
      email: 'qr.user@example.com',
      role: 'parent' as const,
    };

    login(qrUser);
    navigate('/dashboard');
  };

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Log in to your account</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">Welcome back to MedFiNet</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
            </div>
            <input
              id="email"
              type="email"
              required
              className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-neutral-700 dark:text-white"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || isConnectingWallet}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
            </div>
            <input
              id="password"
              type="password"
              required
              className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-neutral-700 dark:text-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || isConnectingWallet}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-md transition"
          disabled={isLoading || isConnectingWallet}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Logging in...
            </>
          ) : (
            'Log in'
          )}
        </button>
      </form>

      <div className="mt-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-300 dark:border-neutral-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">Or continue with</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <button
          onClick={handleConnectPeraWallet}
          disabled={isLoading || isConnectingWallet}
          className="w-full flex items-center justify-center py-2 px-4 border rounded-md bg-white dark:bg-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition"
        >
          {isConnectingWallet ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-5 w-5 mr-2 text-blue-500" />
              Connect Pera Wallet
            </>
          )}
        </button>

        <button
          onClick={handleScanQRCode}
          disabled={isLoading || isConnectingWallet}
          className="w-full flex items-center justify-center py-2 px-4 border rounded-md bg-white dark:bg-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition"
        >
          <QrCode className="h-5 w-5 mr-2" />
          Scan QR Code
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Don’t have an account?{' '}
          <Link to="/register" className="text-primary-600 font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
