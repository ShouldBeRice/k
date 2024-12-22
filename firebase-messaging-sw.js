importScripts("https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCIAEvk6L9v5dHyec3Y-HqeERqZicXTIpg",
  authDomain: "mynotificationproject-73ac9.firebaseapp.com",
  projectId: "mynotificationproject-73ac9",
  storageBucket: "mynotificationproject-73ac9.firebasestorage.app",
  messagingSenderId: "926597572713",
  appId: "1:926597572713:web:200ba3817f484562805af8",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
const requestPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BHm4KpK7l2sYVeDQ5Iv5nXyv7Dw2KiMZiukkxUFG4LMvufhHGJQwOxz8x2qraHPcSa6nVBK2KPAQr1uG4r5Ush8",
    }); // Thay YOUR_VAPID_KEY bằng khóa VAPID từ Firebase
    if (token) {
      console.log("Token nhận được:", token);
      // Lưu token vào server của bạn để gửi thông báo sau này
    } else {
      console.log("Không thể nhận token. Vui lòng kiểm tra lại.");
    }
  } catch (error) {
    console.error("Lỗi khi yêu cầu quyền:", error);
  }
};

requestPermission();
