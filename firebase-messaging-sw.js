importScripts("https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging.js");

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
  console.log("Received background message", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon.png", // Đảm bảo có biểu tượng icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
