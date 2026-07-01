const CACHE = 'seismic-pulse-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('push', e => {
  if(!e.data) return;
  const data = e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title || 'Seismic Pulse', {
      body: data.body || '',
      icon: data.icon || '/icon.png',
      badge: data.badge || '/icon.png',
      tag: data.tag || 'seismic-alert',
      renotify: true,
      requireInteraction: data.urgent || false,
      vibrate: [300,100,300,100,300,100,700],
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      for(const client of clients){
        if(client.url.includes(self.location.origin) && 'focus' in client){
          return client.focus();
        }
      }
      if(self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});

self.addEventListener('message', e => {
  if(!e.data || e.data.type !== 'QUAKE_ALERT') return;
  const { mag, place, distance, depth, urgent } = e.data;
  const title = 'ALERTA SISMICA — M ' + mag.toFixed(1);
  const body = place + '\nA ' + Math.round(distance).toLocaleString('es') + ' km · ' + depth.toFixed(0) + ' km de profundidad';
  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'seismic-alert',
    renotify: true,
    requireInteraction: urgent,
    vibrate: [300,100,300,100,700],
    data: { url: '/' }
  });
});
