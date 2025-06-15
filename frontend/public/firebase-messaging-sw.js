importScripts(
  "https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDJbUEXlvsCIS4UjREbKwOuKsq1nEETIjE",
  authDomain: "codequest-d0956.firebaseapp.com",
  projectId: "codequest-d0956",
  storageBucket: "codequest-d0956.firebasestorage.app",
  messagingSenderId: "733755178723",
  appId: "1:733755178723:web:7f0e8a46e850c715d7cfd6",
  measurementId: "G-RMHFJ7CCCG",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
