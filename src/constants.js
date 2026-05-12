export const SERVICES = [
  { name: 'TAK/SKPI', prefix: 'A', id: 'tak_skpi' },
  { name: 'Kegiatan Mahasiswa', prefix: 'B', id: 'kegiatan_mahasiswa' },
  { name: 'Prestasi', prefix: 'C', id: 'prestasi' },
  { name: 'Beasiswa', prefix: 'D', id: 'beasiswa' },
  { name: 'Asrama', prefix: 'E', id: 'asrama' },
  { name: 'Asuransi/Kesehatan', prefix: 'F', id: 'asuransi_kesehatan' }
];

// Helper untuk mendapatkan service dari name
export const getServiceByName = (name) => SERVICES.find(s => s.name === name);

// Helper untuk mendapatkan display name
export const getServiceDisplayName = (service) => {
  if (typeof service === 'string') return service;
  return service.name;
};

export const ADMIN_KEY = 'admin_login_telkom';

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
};

export const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};
