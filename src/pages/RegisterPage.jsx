import { useState } from 'react';
import { Ticket, CheckCircle, AlertCircle, Send, Lightbulb } from 'lucide-react';
import { SERVICES, formatPhone, validatePhone } from '../constants';
import { db } from '../firebase';
import { collection, addDoc, doc, getDoc, setDoc, increment, runTransaction } from 'firebase/firestore';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ nim: '', name: '', whatsapp: '', service: '' });
  const [alert, setAlert] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nim || !formData.name || !formData.whatsapp || !formData.service) {
      setAlert({ type: 'error', message: 'Semua field harus diisi!' });
      return;
    }

    if (!validatePhone(formData.whatsapp)) {
      setAlert({ type: 'error', message: 'Nomor WhatsApp tidak valid! Minimal 10 digit.' });
      return;
    }

    setLoading(true);

    try {
      const serviceData = SERVICES.find(s => s.name === formData.service);
      if (!serviceData) {
        setAlert({ type: 'error', message: 'Layanan tidak valid!' });
        setLoading(false);
        return;
      }

      // Counter per kategori service
      const counterRef = doc(db, 'service_counters', serviceData.id);
      
      const newQueueNumber = await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        let currentNumber = 0;
        
        if (counterDoc.exists()) {
          currentNumber = counterDoc.data().current_number || 0;
        }
        
        const newNumber = currentNumber + 1;
        transaction.set(counterRef, { 
          current_number: newNumber,
          service_name: formData.service,
          last_updated: new Date().toISOString()
        }, { merge: true });
        
        return newNumber;
      });

      // Format nomor dengan prefix: A001, A002, B001, B002, etc
      const displayNumber = `${serviceData.prefix}${String(newQueueNumber).padStart(3, '0')}`;
      const formattedPhone = formatPhone(formData.whatsapp);

      const newQueue = {
        queueNumber: newQueueNumber,
        displayNumber: displayNumber, // A001, B001, C001, etc
        servicePrefix: serviceData.prefix,
        serviceId: serviceData.id,
        nim: formData.nim,
        name: formData.name,
        whatsapp: formattedPhone,
        service: formData.service,
        status: 'waiting',
        timestamp: new Date().toISOString(),
        registeredTime: new Date().toLocaleTimeString('id-ID'),
        registeredDate: new Date().toLocaleDateString('id-ID')
      };

      await addDoc(collection(db, 'queues'), newQueue);

      setAlert({ type: 'success', message: 'Antrian berhasil diambil!' });
      setReceipt({ ...newQueue, displayNumber });
      setFormData({ nim: '', name: '', whatsapp: '', service: '' });

      setTimeout(() => setAlert(null), 4000);
    } catch (error) {
      console.error('Error:', error);
      setAlert({ type: 'error', message: 'Gagal mengambil antrian. Coba lagi!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
        <div className="text-white p-8 md:p-10 text-center" style={{ background: 'linear-gradient(135deg, #E31E24 0%, #8B7355 100%)' }}>
          <Ticket size={48} className="mx-auto mb-4 opacity-90" />
          <h3 className="text-xl md:text-2xl font-bold mb-2">Ambil Nomor Antrian</h3>
          <p className="text-xs md:text-sm opacity-90">Layanan Direktorat Kemahasiswaan, Karier & Alumni</p>
        </div>

        <div className="p-6 md:p-8">
          {alert && (
            <div className={`p-4 rounded-lg mb-5 border-l-4 flex items-center gap-2 ${
              alert.type === 'success' 
                ? 'bg-green-100 text-green-800 border-green-500' 
                : 'bg-red-100 text-red-800 border-red-500'
            }`}>
              {alert.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <strong>{alert.message}</strong>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-semibold text-sm">
                Nomor Induk Mahasiswa (NIM) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: 20230001"
                value={formData.nim}
                onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-100 transition-all"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-sm">
                Nama Lengkap <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap Anda"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-100 transition-all"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-sm">
                Nomor WhatsApp <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                placeholder="Contoh: 081234567890"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-100 transition-all"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Format: 08xxxxxxxxx atau 628xxxxxxxxx</p>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-sm">
                Jenis Layanan <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-100 transition-all"
                required
                disabled={loading}
              >
                <option value="">-- Pilih Layanan --</option>
                {SERVICES.map(s => <option key={s.id} value={s.name}>Layanan {s.name}</option>)}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-white rounded-lg text-base font-bold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #E31E24 0%, #8B7355 100%)' }}
            >
              <Send size={18} /> {loading ? 'Memproses...' : 'Ambil Antrian'}
            </button>
          </form>

          {receipt && (
            <div className="mt-8 p-6 md:p-8 rounded-xl border-2 border-dashed border-red-600 text-center" style={{ background: 'linear-gradient(135deg, #F5F7FA 0%, white 100%)' }}>
              <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-3">Nomor Antrian Anda</div>
              <div className="text-6xl md:text-7xl font-bold text-red-600 my-4 font-mono tracking-widest">
                {receipt.displayNumber}
              </div>
              <div className="text-base font-semibold">{receipt.name}</div>

              <div className="mt-6 text-left">
                <div className="text-xs text-gray-500 mb-1">NIM</div>
                <div className="text-sm font-medium mb-3">{receipt.nim}</div>

                <div className="text-xs text-gray-500 mb-1">WhatsApp</div>
                <div className="text-sm font-medium mb-3">+{receipt.whatsapp}</div>

                <div className="text-xs text-gray-500 mb-1">Layanan</div>
                <div className="text-sm font-medium mb-3">{receipt.service}</div>

                <div className="text-xs text-gray-500 mb-1">Waktu Pendaftaran</div>
                <div className="text-sm font-medium">{receipt.registeredDate} - {receipt.registeredTime}</div>
              </div>

              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-md text-left text-xs text-gray-700">
                <Lightbulb size={14} className="inline mr-1" /> <strong>Tips:</strong> Screenshot halaman ini sebagai bukti. Perhatikan papan informasi untuk pengumuman nomor antrian Anda.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
