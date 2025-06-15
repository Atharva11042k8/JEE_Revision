self.addEventListener('install', event => {
  console.log('[SW] Installed');
  self.skipWaiting(); // Makes the SW active immediately
});

self.addEventListener('activate', event => {
  console.log('[SW] Activated');
});

self.addEventListener('fetch', event => {
  // This just lets requests go through normally for now
});
