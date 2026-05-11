import { useState } from 'react';
import { BarChart3, Users, CheckCircle, Clock, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function AnalyticsPage({ queues }) {
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');

  const getFilteredData = () => {
    let from = filterFrom ? new Date(filterFrom) : new Date(new Date().setDate(new Date().getDate() - 30));
    let to = filterTo ? new Date(filterTo + 'T23:59:59') : new Date();

    return queues.filter(q => {
      let qDate = new Date(q.timestamp);
      return qDate >= from && qDate <= to;
    });
  };

  const filtered = getFilteredData();
  const done = filtered.filter(q => q.status === 'done').length;
  const waiting = filtered.filter(q => q.status === 'waiting').length;

  const serviceCount = {};
  filtered.forEach(q => {
    serviceCount[q.service] = (serviceCount[q.service] || 0) + 1;
  });
  const maxServiceCount = Math.max(...Object.values(serviceCount), 1);

  const hourlyCount = {};
  for (let i = 0; i < 24; i++) hourlyCount[i] = 0;
  filtered.forEach(q => {
    const hour = new Date(q.timestamp).getHours();
    hourlyCount[hour] = (hourlyCount[hour] || 0) + 1;
  });
  const maxHourlyCount = Math.max(...Object.values(hourlyCount), 1);

  const handleExportExcel = () => {
    if (filtered.length === 0) {
      alert('Tidak ada data untuk diexport');
      return;
    }

    const exportData = filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(q => ({
      'No. Antrian': String(q.queueNumber).padStart(3, '0'),
      'Nama': q.name,
      'NIM': q.nim,
      'WhatsApp': '+' + (q.whatsapp || ''),
      'Layanan': q.service,
      'Waktu Pendaftaran': new Date(q.timestamp).toLocaleString('id-ID'),
      'Status': q.status === 'calling' ? 'Sedang Dilayani' : (q.status === 'waiting' ? 'Menunggu' : 'Selesai')
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Antrian');
    XLSX.writeFile(workbook, `Laporan_Antrian_${new Date().toLocaleDateString('id-ID')}.xlsx`);
  };

  const filterByToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setFilterFrom(today);
    setFilterTo(today);
  };

  const filterByWeek = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    setFilterFrom(weekAgo.toISOString().split('T')[0]);
    setFilterTo(today.toISOString().split('T')[0]);
  };

  const filterByMonth = () => {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setDate(today.getDate() - 30);
    setFilterFrom(monthAgo.toISOString().split('T')[0]);
    setFilterTo(today.toISOString().split('T')[0]);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-red-600 flex items-center gap-3">
          <BarChart3 size={28} /> Dashboard Analytics
        </h2>
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          <label className="text-xs font-semibold flex items-center gap-1">
            Dari:
            <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} className="px-3 py-2 border-2 border-gray-200 rounded-md text-xs" />
          </label>
          <label className="text-xs font-semibold flex items-center gap-1">
            Sampai:
            <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} className="px-3 py-2 border-2 border-gray-200 rounded-md text-xs" />
          </label>
          <button onClick={filterByToday} className="px-4 py-2 bg-red-600 text-white rounded-md text-xs font-bold hover:bg-red-700 transition-all">Hari Ini</button>
          <button onClick={filterByWeek} className="px-4 py-2 bg-red-600 text-white rounded-md text-xs font-bold hover:bg-red-700 transition-all">Minggu Ini</button>
          <button onClick={filterByMonth} className="px-4 py-2 bg-red-600 text-white rounded-md text-xs font-bold hover:bg-red-700 transition-all">Bulan Ini</button>
          <button onClick={handleExportExcel} className="px-4 py-2 bg-green-600 text-white rounded-md text-xs font-bold hover:bg-green-700 transition-all flex items-center gap-1">
            <Download size={14} /> Export Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white p-6 rounded-xl text-center shadow-md">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
            <Users size={14} /> Total Antrian
          </div>
          <div className="text-4xl font-bold text-red-600">{filtered.length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl text-center shadow-md">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
            <CheckCircle size={14} /> Selesai
          </div>
          <div className="text-4xl font-bold text-red-600">{done}</div>
        </div>
        <div className="bg-white p-6 rounded-xl text-center shadow-md">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
            <Clock size={14} /> Menunggu
          </div>
          <div className="text-4xl font-bold text-red-600">{waiting}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-base font-bold mb-5">Layanan Paling Banyak Diakses</h3>
          {Object.keys(serviceCount).length === 0 ? (
            <p className="text-center text-gray-500 py-10">Tidak ada data</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(serviceCount).sort((a, b) => b[1] - a[1]).map(([service, count]) => (
                <div key={service}>
                  <div className="flex justify-between mb-1 text-xs">
                    <span className="font-semibold">{service}</span>
                    <span className="text-gray-600 font-bold">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${(count / maxServiceCount) * 100}%`,
                      background: 'linear-gradient(90deg, #E31E24 0%, #8B7355 100%)'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-base font-bold mb-5">Tren Antrian Per Jam</h3>
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Tidak ada data</p>
          ) : (
            <div className="flex items-end gap-1 h-48">
              {Object.entries(hourlyCount).map(([hour, count]) => (
                <div key={hour} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-full rounded-t hover:opacity-80 transition-all" style={{
                    height: `${(count / maxHourlyCount) * 100}%`,
                    background: count > 0 ? 'linear-gradient(180deg, #E31E24 0%, #8B7355 100%)' : '#E5E7EB',
                    minHeight: count > 0 ? '4px' : '2px'
                  }} title={`${hour}:00 - ${count} antrian`}></div>
                  <div className="text-[9px] text-gray-500 mt-1 font-mono">{String(hour).padStart(2, '0')}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider">No.</th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider">Nama</th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider">NIM</th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider">WA</th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider">Layanan</th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider">Waktu</th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-10 text-gray-500">Tidak ada data</td></tr>
              ) : (
                filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(q => (
                  <tr key={q.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm font-bold">{String(q.queueNumber).padStart(3, '0')}</td>
                    <td className="px-5 py-4 text-sm">{q.name}</td>
                    <td className="px-5 py-4 text-sm">{q.nim}</td>
                    <td className="px-5 py-4 text-sm">+{q.whatsapp}</td>
                    <td className="px-5 py-4 text-sm">{q.service}</td>
                    <td className="px-5 py-4 text-sm">{new Date(q.timestamp).toLocaleString('id-ID')}</td>
                    <td className="px-5 py-4 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-xl text-xs font-bold uppercase ${
                        q.status === 'calling' ? 'bg-red-100 text-red-700' :
                        q.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {q.status === 'calling' ? 'Dilayani' : (q.status === 'waiting' ? 'Menunggu' : 'Selesai')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
