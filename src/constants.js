export const SERVICES = [
  'TAK/SKPI',
  'Kegiatan Mahasiswa',
  'Prestasi',
  'Beasiswa',
  'Asrama',
  'Asuransi/Kesehatan'
];

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
