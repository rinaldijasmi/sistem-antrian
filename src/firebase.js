// Firebase Configuration
// GANTI dengan config Firebase Anda sendiri (lihat README untuk panduan)

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBeQEucQb2cCTtfR8f82j3W3vKOgaUV15o",
  authDomain: "antrian-kemahasiswaan.firebaseapp.com",
  projectId: "antrian-kemahasiswaan",
  storageBucket: "antrian-kemahasiswaan.firebasestorage.app",
  messagingSenderId: "693840452147",
  appId: "1:693840452147:web:a87a33d7c22b70cc206146"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
