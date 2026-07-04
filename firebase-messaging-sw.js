/* AlertaCuba — Firebase Messaging Service Worker
   Maneja notificaciones push en segundo plano (pantalla bloqueada incluida) */

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyC9v2qp6zGtmvsFiOknlmTHnN6zZY1RLcI",
  authDomain: "ggggg-f2508.firebaseapp.com",
  databaseURL: "https://ggggg-f2508-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ggggg-f2508",
  storageBucket: "ggggg-f2508.firebasestorage.app",
  messagingSenderId: "120837533638",
  appId: "1:120837533638:web:6720ebd1367f3acf9f4cc7",
  measurementId: "G-E2JX3ZGG5K"
});

const messaging = firebase.messaging();

/* Notificación recibida con app en segundo plano */
messaging.onBackgroundMessage(function(payload) {
  console.log('[AlertaCuba SW] Push en segundo plano:', payload);

  const data = payload.data || {};
  const severidad = data.severidad || 'aviso';

  const iconColor = severidad === 'critica' ? '%23e10600' :
                    severidad === 'alta'    ? '%23f5b700' :
                    severidad === 'media'   ? '%230057b8' : '%23ce1126';

  const iconSvg = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill="${iconColor}" opacity="0.15"/>
    <circle cx="50" cy="50" r="36" fill="none" stroke="${iconColor}" stroke-width="3" opacity="0.4"/>
    <circle cx="50" cy="50" r="22" fill="none" stroke="${iconColor}" stroke-width="3" opacity="0.7"/>
    <circle cx="50" cy="50" r="10" fill="${iconColor}"/>
  </svg>`.replace(/#/g, '%23');

  const notificationTitle = payload.notification?.title || data.titulo || '🚨 ALERTA — AlertaCuba';
  const notificationOptions = {
    body: payload.notification?.body || data.cuerpo || 'Nueva alerta emitida.',
    icon: iconSvg,
    badge: iconSvg,
    tag: 'alertacuba-alerta',
    renotify: true,
    requireInteraction: (severidad === 'critica' || severidad === 'alta'),
    vibrate: severidad === 'critica'
      ? [500, 150, 500, 150, 500, 150, 1000]
      : [300, 100, 300, 100, 600],
    data: { url: '/', ...data },
    actions: [
      { action: 'abrir', title: 'Ver alerta' },
      { action: 'cerrar', title: 'Descartar' }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

/* Clic en notificación: abrir la app */
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'cerrar') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
