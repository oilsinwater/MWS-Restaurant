const registerWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(
      registration => {
        console.log(
          'CLIENT: service worker registration complete!',
          registration
        );
      },
      error => {
        console.log(
          'CLIENT: service worker registration failure, error: ',
          error
        );
      }
    );
    navigator.serviceWorker.ready.then(function(registration) {
      console.log('Service Worker Ready', registration);
    });
  }
};

window.addEventListener('load', () => {
  registerWorker();
});
