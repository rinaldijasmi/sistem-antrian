import { Tv, Info, Inbox } from 'lucide-react';

export default function DisplayPage({ queues, callingQueues }) {
  const displayQueues = queues.filter(q => q.status !== 'done').sort((a, b) => a.queueNumber - b.queueNumber);
  const totalServing = Object.keys(callingQueues).length;
  const waitingCount = queues.filter(q => q.status === 'waiting').length;
  const doneCount = queues.filter(q => q.status === 'done').length;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-2 flex items-center justify-center gap-3">
          <Tv size={32} /> Papan Informasi Antrian
        </h2>
        <p className="text-gray-500 text-sm md:text-base">Direktorat Kemahasiswaan, Karier & Alumni - Telkom University</p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-md mb-6 text-sm text-blue-900 text-center">
        <Info size={14} className="inline mr-2" />
        <strong>Realtime:</strong> Data tersinkronisasi otomatis dari semua device
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 md:p-6 rounded-xl text-center shadow-md border-t-4 border-red-600">
          <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Total Antrian</div>
          <div className="text-3xl md:text-4xl font-bold text-red-600">{queues.length}</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl text-center shadow-md border-t-4 border-red-600">
          <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Sedang Dilayani</div>
          <div className="text-3xl md:text-4xl font-bold text-red-600">{totalServing}</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl text-center shadow-md border-t-4 border-red-600">
          <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Menunggu</div>
          <div className="text-3xl md:text-4xl font-bold text-red-600">{waitingCount}</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl text-center shadow-md border-t-4 border-red-600">
          <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Selesai</div>
          <div className="text-3xl md:text-4xl font-bold text-red-600">{doneCount}</div>
        </div>
      </div>

      {totalServing > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {Object.entries(callingQueues).map(([service, queueId]) => {
            const queue = queues.find(q => q.id === queueId);
            if (!queue) return null;
            return (
              <div key={service} className="text-white p-6 md:p-8 rounded-xl text-center shadow-lg" style={{ background: 'linear-gradient(135deg, #E31E24 0%, #8B7355 100%)' }}>
                <div className="text-xs opacity-90 uppercase font-bold tracking-wider mb-3">Sedang Dilayani</div>
                <div className="text-sm font-semibold mb-2 opacity-95">{service}</div>
                <div className="text-6xl md:text-7xl font-bold my-3 font-mono animate-pulse-slow">
                  {String(queue.queueNumber).padStart(3, '0')}
                </div>
                <div className="text-base font-semibold mt-2">{queue.name}</div>
              </div>
            );
          })}
        </div>
      )}

      <h3 className="text-lg font-bold text-red-600 mb-4 pb-3 border-b-2 border-gray-200">Daftar Antrian</h3>

      {displayQueues.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <Inbox size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">Tidak ada antrian saat ini</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {displayQueues.map(queue => (
            <div key={queue.id} className={`bg-white p-6 rounded-xl text-center transition-all relative overflow-hidden ${
              queue.status === 'calling' 
                ? 'border-2 border-red-600 shadow-lg' 
                : 'border-2 border-gray-200'
            }`}>
              <div className={`absolute top-0 left-0 right-0 h-1 ${queue.status === 'calling' ? 'bg-red-600' : 'bg-gray-400'}`}></div>
              <div className={`text-4xl md:text-5xl font-bold my-4 font-mono ${queue.status === 'calling' ? 'text-red-600' : 'text-gray-500'}`}>
                {String(queue.queueNumber).padStart(3, '0')}
              </div>
              <div className="text-sm text-gray-800 font-semibold mb-3 min-h-12 flex items-center justify-center">
                {queue.service}
              </div>
              <span className={`inline-block px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${
                queue.status === 'calling' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-yellow-400 text-gray-800'
              }`}>
                {queue.status === 'calling' ? 'SEDANG DILAYANI' : 'MENUNGGU'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
