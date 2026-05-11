import { Tv, PlusCircle, Lock, ListTodo, BarChart3, LogOut } from 'lucide-react';
import Logo from './Logo';

export default function Navbar({ currentPage, setCurrentPage, isLoggedIn, onLogout, onAdminAccess }) {
  const isAdminPage = currentPage.startsWith('admin-') && isLoggedIn;

  return (
    <nav className="bg-white border-b-2 border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <h1 className="text-base font-bold text-red-600 leading-tight">
              {isAdminPage ? 'Admin Dashboard' : 'Antrian Kemahasiswaan'}
            </h1>
            <p className="text-xs text-gray-500">
              {isAdminPage ? 'Sistem Antrian' : 'Telkom University'}
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap justify-center">
          {!isAdminPage ? (
            <>
              <button
                className={`px-3 md:px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                  currentPage === 'public-display' ? 'text-red-600 bg-red-50' : 'text-gray-800 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentPage('public-display')}
              >
                <Tv size={16} /> Lihat Antrian
              </button>
              <button
                className={`px-3 md:px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                  currentPage === 'public-register' ? 'text-red-600 bg-red-50' : 'text-gray-800 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentPage('public-register')}
              >
                <PlusCircle size={16} /> Ambil Antrian
              </button>
              <button
                className={`px-3 md:px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                  currentPage === 'admin-login' ? 'text-red-600 bg-red-50' : 'text-gray-800 hover:bg-gray-100'
                }`}
                onClick={() => onAdminAccess(isLoggedIn ? 'admin-manage' : 'admin-login')}
              >
                <Lock size={16} /> Admin
              </button>
            </>
          ) : (
            <>
              <button
                className={`px-3 md:px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                  currentPage === 'admin-manage' ? 'text-red-600 bg-red-50' : 'text-gray-800 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentPage('admin-manage')}
              >
                <ListTodo size={16} /> Kelola
              </button>
              <button
                className={`px-3 md:px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                  currentPage === 'admin-analytics' ? 'text-red-600 bg-red-50' : 'text-gray-800 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentPage('admin-analytics')}
              >
                <BarChart3 size={16} /> Analytics
              </button>
              <button
                className="px-3 md:px-4 py-2 rounded-md text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-all flex items-center gap-2"
                onClick={onLogout}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
