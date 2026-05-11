# 📋 Sistem Antrian Direktorat Kemahasiswaan, Karier & Alumni

Aplikasi web antrian dengan Firebase Realtime Database, React JSX, dan deploy ke GitHub Pages.

## 🚀 Fitur

- ✅ **Realtime Sync** - Data tersinkron otomatis antar device (HP mahasiswa, komputer admin, layar TV)
- ✅ **Multi-Category Calling** - Panggil beberapa antrian dari kategori berbeda bersamaan
- ✅ **WhatsApp Integration** - Kirim notifikasi WA langsung ke mahasiswa
- ✅ **Admin Login** - Dashboard terlindungi untuk admin
- ✅ **Analytics Dashboard** - Laporan harian/mingguan/bulanan
- ✅ **Export Excel** - Download laporan dalam format Excel
- ✅ **Reset Counter** - Tombol manual reset (data analytics tetap aman)
- ✅ **Responsive** - Bekerja di HP, tablet, desktop

---

## 📦 Cara Setup (Step by Step)

### **Langkah 1: Persiapan Tools**

Pastikan sudah terinstall:
- [Node.js](https://nodejs.org/) versi 18+ ([Download di sini](https://nodejs.org/))
- [Git](https://git-scm.com/) ([Download di sini](https://git-scm.com/))
- Akun [GitHub](https://github.com/)
- Akun Google (untuk Firebase)

---

### **Langkah 2: Setup Firebase (GRATIS)**

#### 2.1 Buat Project Firebase

1. Buka **https://console.firebase.google.com**
2. Login dengan akun Google
3. Klik **"Add project"** atau **"Create a project"**
4. Isi nama project: `antrian-kemahasiswaan`
5. Disable Google Analytics (tidak perlu)
6. Klik **"Create project"** → Tunggu ~1 menit
7. Klik **"Continue"**

#### 2.2 Buat Firestore Database

1. Di sidebar kiri, klik **"Build"** → **"Firestore Database"**
2. Klik **"Create database"**
3. Pilih **"Start in test mode"** → klik **"Next"**
4. Pilih location: **asia-southeast1 (Jakarta)** atau **asia-southeast2**
5. Klik **"Enable"** → Tunggu ~1 menit

#### 2.3 Setup Security Rules

1. Di Firestore Database, klik tab **"Rules"**
2. Ganti rules dengan ini:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Klik **"Publish"**

> ⚠️ Untuk production, sebaiknya pakai authentication. Untuk testing/internal, rules ini OK.

#### 2.4 Ambil Firebase Config

1. Klik icon **gear ⚙️** di sidebar → **"Project settings"**
2. Scroll ke bawah ke bagian **"Your apps"**
3. Klik icon **`</>`** (Web)
4. Isi nickname: `Antrian Web` → klik **"Register app"**
5. Anda akan melihat kode seperti ini:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "antrian-kemahasiswaan.firebaseapp.com",
  projectId: "antrian-kemahasiswaan",
  storageBucket: "antrian-kemahasiswaan.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

6. **COPY semua nilai itu**, akan dipakai nanti

---

### **Langkah 3: Setup Project**

#### 3.1 Download/Clone Project

Extract folder `sistem-antrian` ke komputer Anda.

#### 3.2 Install Dependencies

Buka **Terminal/Command Prompt** di folder project:

```bash
cd sistem-antrian
npm install
```

Tunggu ~2 menit sampai selesai.

#### 3.3 Konfigurasi Firebase

1. Buka file: `src/firebase.js`
2. Ganti konfigurasi dengan yang Anda copy dari Firebase:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...", // paste API key Anda
  authDomain: "antrian-kemahasiswaan.firebaseapp.com",
  projectId: "antrian-kemahasiswaan",
  storageBucket: "antrian-kemahasiswaan.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

3. **Save file**

---

### **Langkah 4: Jalankan di Local (Testing)**

```bash
npm run dev
```

Buka browser ke **http://localhost:5173**

Coba:
1. Klik "Ambil Antrian" → Isi form → Ambil nomor
2. Klik "Lihat Antrian" → Lihat data muncul
3. Klik "Admin" → Login `admin` / `admin123`
4. Test panggil antrian dari kategori berbeda

Buka di HP juga (samakan WiFi):
- Cek IP komputer (Settings → Network)
- Buka `http://[IP_KOMPUTER]:5173` di HP

---

### **Langkah 5: Deploy ke GitHub Pages**

#### 5.1 Buat Repository GitHub

1. Buka **https://github.com/new**
2. Repository name: `sistem-antrian`
3. Set ke **Public** (gratis pakai GitHub Pages)
4. Klik **"Create repository"**

#### 5.2 Push Code ke GitHub

Di terminal:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/sistem-antrian.git
git push -u origin main
```

Ganti `USERNAME_ANDA` dengan username GitHub Anda.

#### 5.3 Deploy ke GitHub Pages

Jalankan:

```bash
npm run deploy
```

Tunggu ~1-2 menit sampai selesai.

#### 5.4 Aktifkan GitHub Pages

1. Buka repository di GitHub
2. Klik **Settings** (tab)
3. Klik **Pages** (sidebar kiri)
4. Di **"Source"**: pilih branch **`gh-pages`** dan folder **`/ (root)`**
5. Klik **Save**
6. Tunggu ~1 menit
7. URL Anda akan muncul: `https://USERNAME_ANDA.github.io/sistem-antrian/`

🎉 **Selesai! Bagikan URL ini ke mahasiswa**

---

## 📱 Cara Pakai

### Untuk Mahasiswa:
1. Buka URL → Klik **"Ambil Antrian"**
2. Isi NIM, Nama, **Nomor WhatsApp**, Pilih Layanan
3. Screenshot nomor antrian
4. Tunggu panggilan (bisa cek di "Lihat Antrian" dari HP)

### Untuk Admin:
1. Buka URL → Klik **"Admin"**
2. Login: `admin` / `admin123`
3. **Kelola Antrian:**
   - Klik **"Panggil"** untuk panggil mahasiswa
   - Klik **icon WA** untuk kirim notifikasi WhatsApp
   - Klik **"Selesai"** saat sudah selesai dilayani
   - Klik **"Reset Counter"** untuk reset nomor (data tetap aman)
4. **Analytics:**
   - Filter per tanggal
   - Lihat layanan paling banyak
   - Export ke Excel

### Untuk Layar Display di Lobi:
1. Buka URL di browser TV/komputer
2. Klik **"Lihat Antrian"**
3. Tekan **F11** untuk fullscreen
4. Auto-update real-time

---

## 🔄 Update Code

Jika ada perubahan code:

```bash
git add .
git commit -m "Update fitur"
git push
npm run deploy
```

---

## 🔒 Keamanan Production

Untuk production, sebaiknya:

1. **Ganti password admin** di file `src/constants.js`:
```javascript
export const ADMIN_CREDENTIALS = {
  username: 'admin_anda',
  password: 'password_kuat_anda'
};
```

2. **Setup Firebase Authentication** untuk admin login (lebih aman)

3. **Update Firestore Rules** menjadi:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /queues/{document} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
    match /calling_queues/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /queue_counter/{document} {
      allow read, write: if true;
    }
  }
}
```

---

## 🆘 Troubleshooting

**Error: "Missing or insufficient permissions"**
- Cek Firestore Rules sudah di-Publish dengan `allow read, write: if true;`

**Data tidak sinkron antar device**
- Pastikan koneksi internet stabil
- Cek Firebase config sudah benar di `src/firebase.js`

**npm install error**
- Update Node.js ke versi terbaru
- Hapus folder `node_modules` dan file `package-lock.json`, jalankan ulang `npm install`

**GitHub Pages tidak muncul**
- Tunggu 5-10 menit setelah deploy
- Cek di Settings → Pages, pastikan source di branch `gh-pages`

**Build error saat deploy**
- Pastikan `firebase.js` sudah diisi dengan config valid

---

## 📞 Bantuan

- Firebase Docs: https://firebase.google.com/docs
- React Docs: https://react.dev/
- Tailwind Docs: https://tailwindcss.com/docs

---

## 📄 License

MIT - Bebas digunakan untuk Direktorat Kemahasiswaan, Karier & Alumni Telkom University.
