import { useState, useEffect } from 'react';
import { ListTodo, Info, CheckCircle, Phone, Forward, RotateCcw } from 'lucide-react';
import { SERVICES } from '../constants';
import { db } from '../firebase';
import { doc, updateDoc, deleteDoc, setDoc, getDocs, collection, writeBatch, query, where } from 'firebase/firestore';

export default function AdminManagePage({ queues, callingQueues }) {
  const [filterService, setFilterService] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleCallQueue = async (queueId, service, serviceId) => {
    try {
      const previousQueueId = callingQueues[serviceId];
      
      // Jika ada yang sebelumnya, langsung set status ke done
      if (previousQueueId && previousQueueId !== queueId) {
        await updateDoc(doc(db, 'queues', previousQueueId), { 
          status: 'done',
          finished_at: new Date().toISOString()
        });
      }

      // Update queue baru ke calling
      await updateDoc(doc(db, 'queues', queueId), { 
        status: 'calling',
        called_at: new Date().toISOString()
      });

      // Simpan ke calling_queues dengan key serviceId
      await setDoc(doc(db, 'calling_queues', serviceId), {
        queue_id: queueId,
        service_name: service,
        called_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error calling queue:', error);
      alert('Gagal memanggil antrian');
    }
  };

  const handleFinishService = async (serviceId) => {
    try {
      const queueId = callingQueues[serviceId];
      if (queueId) {
        // Set antrian selesai
        await updateDoc(doc(db, 'queues', queueId), { 
          status: 'done',
          finished_at: new Date().toISOString()
        });
        
        // Hapus dari calling_queues
        await deleteDoc(doc(db, 'calling_queues', serviceId));
      }
    } catch (error) {
      console.error('Error finishing service:', error);
      alert('Gagal menyelesaikan layanan');
    }
  };

  const handleSkipQueue = async (queueId) => {
    try {
      await updateDoc(doc(db, 'queues', queueId), { 
        status: 'done',
        finished_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error skipping queue:', error);
      alert('Gagal skip antrian');
    }
  };

  const handleResetCounter = async () => {
    const confirm = window.confirm(
      'PERHATIAN!\n\n' +
      'Anda akan mereset counter nomor antrian kembali ke 0.\n' +
      'Antrian yang masih MENUNGGU dan SEDANG DILAYANI akan dihapus.\n' +
      '\n' +
      'Data history (analytics) TIDAK akan terhapus.\n\n' +
      'Lanjutkan?'
    );

    if (!confirm) return;

    setResetLoading(true);
    try {
      const batch = writeBatch(db);

      // Hapus semua antrian aktif (bukan yang sudah done)
      const activeQueues = queues.filter(q => q.status !== 'done');
      activeQueues.forEach(q => {
        batch.delete(doc(db, 'queues', q.id));
      });

      // Hapus semua calling_queues
      const callingSnapshot = await getDocs(collection(db, 'calling_queues'));
      callingSnapshot.forEach(d => {
        batch.delete(doc(db, 'calling_queues', d.id));
      });

      // Reset semua service counters
      const counterSnapshot = await getDocs(collection(db, 'service_counters'));
      counterSnapshot.forEach(d => {
        batch.update(doc(db, 'service_counters', d.id), {
          current_number: 0,
          last_reset: new Date().toISOString()
        });
      });

      await batch.commit();
      alert('Counter berhasil direset! Data analytics tetap aman.');
    } catch (error) {
      console.error('Error resetting:', error);
      alert('Gagal reset counter');
    } finally {
      setResetLoading(false);
    }
  };

  // Filter berdasarkan service yang dipilih
  const filteredQueues = queues
    .filter(q => q.status === 'waiting' && (!filterService || q.service === filterService))
    .sort((a, b) => a.queueNumber - b.queueNumber);

  // Get service display name
  const getServiceName = (serviceName) => {
    return serviceName;
  };

  const getServiceId = (serviceName) => {
    const service = SERVICES.find(s => s.name === serviceName);
    return service?.id || '';
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-red-600 flex items-center gap-3">
          <ListTodo size={28} /> Kelola Antrian
        </h2>
        <button
          onClick={handleResetCounter}
          disabled={resetLoading}
          className="px-5 py-3 bg-orange-500 text-white rounded-md text-sm font-bold hover:bg-orange-600 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <RotateCcw size={16} /> {resetLoading ? 'Mereset...' : 'Reset Counter'}
        </button>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-md mb-6 text-sm text-blue-900">
        <Info size={14} className="inline mr-2" />
        <strong>Multi-Category Calling:</strong> Setiap kategori memiliki nomor antrian terpisah dengan prefix (A, B, C, dst).
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <div className="bg-white p-5 rounded-xl shadow-md h-fit">
          <div className="text-sm font-bold uppercase tracking-wider mb-4">Filter Layanan</div>
          <button
            className={`block w-full px-4 py-3 border-2 rounded-md font-semibold cursor-pointer mb-2 text-left text-xs transition-all ${
              !filterService ? 'bg-red-600 text-white border-red-600' : 'border-gray-200 hover:border-red-600 hover:text-red-600'
            }`}
            onClick={() => setFilterService('')}
          >
            Semua Layanan
          </button>
          {SERVICES.map(service => (
            <button
              key={service.id}
              className={`block w-full px-4 py-3 border-2 rounded-md font-semibold cursor-pointer mb-2 text-left text-xs transition-all ${
                filterService === service.name ? 'bg-red-600 text-white border-red-600' : 'border-gray-200 hover:border-red-600 hover:text-red-600'
              }`}
              onClick={() => setFilterService(service.name)}
            >
              <span className="font-bold">[{service.prefix}]</span> {service.name}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {Object.keys(callingQueues).length > 0 && (
            <div>
              <h3 className="text-base font-bold text-gray-800 mb-3">
                Sedang Dilayani ({Object.keys(callingQueues).length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(callingQueues).map(([serviceId, queueId]) => {
                  const queue = queues.find(q => q.id === queueId);
                  if (!queue) return null;
                  return (
                    <div key={serviceId} className="text-white p-6 rounded-xl text-center shadow-lg" style={{ background: 'linear-gradient(135deg, #E31E24 0%, #8B7355 100%)' }}>
                      <div className="text-xs opacity-90 uppercase font-bold tracking-wider mb-2">Sedang Dilayani</div>
                      <div className="text-xs font-semibold mb-2 opacity-95">{queue.service}</div>
                      <div className="text-5xl md:text-6xl font-bold my-3 font-mono">
                        {queue.displayNumber || String(queue.queueNumber).padStart(3, '0')}
                      </div>
                      <div className="text-sm font-semibold mb-3">{queue.name}</div>
                      <button
                        onClick={() => handleFinishService(serviceId)}
                        className="px-4 py-2 bg-white text-red-600 rounded-md text-xs font-bold hover:bg-gray-100 transition-all flex items-center gap-1 mx-auto"
                      >
                        <CheckCircle size={14} /> Selesai
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-base font-bold text-gray-800 mb-3">
              Antrian Menunggu ({filteredQueues.length})
            </h3>
            {filteredQueues.length === 0 ? (
              <div className="text-center py-16 text-gray-500 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-base">Tidak ada antrian menunggu</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredQueues.map((queue, i) => {
                  const serviceId = getServiceId(queue.service);
                  const isCurrentlyServing = callingQueues[serviceId];
                  const isFirstInCategory = filteredQueues.findIndex(q => q.service === queue.service) === i;
                  return (
                    <div
                      key={queue.id}
                      className={`bg-white p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm transition-all ${
                        isFirstInCategory && !isCurrentlyServing
                          ? 'border-2 border-red-600' 
                          : 'border-2 border-gray-200'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-red-600 font-mono mb-1">
                          {queue.displayNumber || String(queue.queueNumber).padStart(3, '0')}
                        </div>
                        <div className="text-sm font-semibold text-gray-800">{queue.name}</div>
                        <div className="text-xs text-gray-500 mt-1">NIM: {queue.nim}</div>
                        <div className="text-xs text-gray-500">WA: +{queue.whatsapp}</div>
                        <div className="text-xs text-gray-500">Layanan: {queue.service}</div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <button
                          className="flex-1 md:flex-none px-5 py-2.5 bg-green-600 text-white rounded-md text-xs font-bold hover:bg-green-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                          onClick={() => handleCallQueue(queue.id, queue.service, serviceId)}
                        >
                          <Phone size={14} /> Panggil
                        </button>
                        <button
                          className="flex-1 md:flex-none px-4 py-2.5 bg-yellow-400 text-gray-800 rounded-md text-xs font-bold hover:bg-yellow-500 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                          onClick={() => handleSkipQueue(queue.id)}
                        >
                          <Forward size={14} /> Lewati
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
