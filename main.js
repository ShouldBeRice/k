import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Cấu hình Firebase (dùng mã bạn nhận được từ Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCIAEvk6L9v5dHyec3Y-HqeERqZicXTIpg",
  authDomain: "mynotificationproject-73ac9.firebaseapp.com",
  projectId: "mynotificationproject-73ac9",
  storageBucket: "mynotificationproject-73ac9.firebasestorage.app",
  messagingSenderId: "926597572713",
  appId: "1:926597572713:web:200ba3817f484562805af8",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
