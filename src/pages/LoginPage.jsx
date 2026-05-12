import { useState } from 'react';
import { Lock, AlertCircle, LogIn } from 'lucide-react';
import { ADMIN_KEY, ADMIN_CREDENTIALS } from '../constants';
import Logo from '../components/Logo';

export default function LoginPage({ setIsLoggedIn, setCurrentPage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      sessionStorage.setItem(ADMIN_KEY, JSON.stringify({
        username,
        loginTime: new Date().getTime()
      }));
      setIsLoggedIn(true);
      setCurrentPage('admin-manage');
    } else {
      setError('Username atau password salah');
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5" style={{ background: 'linear-gradient(135deg, #E31E24 0%, #8B7355 100%)' }}>
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md">
        <div className="text-white p-10 text-center" style={{ background: 'linear-gradient(135deg, #E31E24 0%, #8B7355 100%)' }}>
          <div className="flex justify-center mb-4">
            <Logo size={60} />
          </div>
          <Lock size={32} className="mx-auto mb-3 opacity-90" />
          <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
          <p className="text-sm opacity-90">Sistem Antrian Direktorat Kemahasiswaan</p>
        </div>

        <div className="p-8 md:p-10">
          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded-md mb-5 border-l-4 border-red-500 flex items-center gap-2">
              <AlertCircle size={16} />
              <strong>{error}</strong>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block mb-2 font-semibold text-sm">Username</label>
              <input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-100"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-sm">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-100"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 text-white rounded-lg text-base font-bold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #E31E24 0%, #8B7355 100%)' }}
            >
              <LogIn size={18} /> Masuk
            </button>
          </form>

          <div className="text-center mt-5">
            <button 
              onClick={() => setCurrentPage('public-display')}
              className="text-sm text-red-600 hover:underline font-semibold"
            >
              ← Kembali ke Halaman Utama
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
