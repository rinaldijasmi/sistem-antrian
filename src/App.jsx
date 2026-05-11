import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { ADMIN_KEY } from './constants';
import Navbar from './components/Navbar';
import DisplayPage from './pages/DisplayPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminManagePage from './pages/AdminManagePage';
import AnalyticsPage from './pages/AnalyticsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('public-display');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [queues, setQueues] = useState([]);
  const [callingQueues, setCallingQueues] = useState({});

  useEffect(() => {
    const loginData = sessionStorage.getItem(ADMIN_KEY);
    if (loginData) {
      const parsed = JSON.parse(loginData);
      const now = new Date().getTime();
      if (now - parsed.loginTime < 24 * 60 * 60 * 1000) {
        setIsLoggedIn(true);
      }
    }

    const q = query(collection(db, 'queues'), orderBy('queueNumber', 'asc'));
    const unsubQueues = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQueues(data);
    }, (error) => {
      console.error('Firebase queues error:', error);
    });

    const unsubCalling = onSnapshot(collection(db, 'calling_queues'), (snapshot) => {
      const data = {};
      snapshot.docs.forEach(doc => {
        data[doc.id] = doc.data().queue_id;
      });
      setCallingQueues(data);
    }, (error) => {
      console.error('Firebase calling error:', error);
    });

    return () => {
      unsubQueues();
      unsubCalling();
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm('Anda yakin ingin logout?')) {
      sessionStorage.removeItem(ADMIN_KEY);
      setIsLoggedIn(false);
      setCurrentPage('public-display');
    }
  };

  const handleAdminAccess = (page) => {
    if (!isLoggedIn && page.startsWith('admin-')) {
      setCurrentPage('admin-login');
    } else {
      setCurrentPage(page);
    }
  };

  if (currentPage === 'admin-login' && !isLoggedIn) {
    return <LoginPage setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onAdminAccess={handleAdminAccess}
      />

      <div className="py-6">
        {currentPage === 'public-display' && <DisplayPage queues={queues} callingQueues={callingQueues} />}
        {currentPage === 'public-register' && <RegisterPage />}
        {currentPage === 'admin-manage' && isLoggedIn && <AdminManagePage queues={queues} callingQueues={callingQueues} />}
        {currentPage === 'admin-analytics' && isLoggedIn && <AnalyticsPage queues={queues} />}
      </div>
    </div>
  );
}
