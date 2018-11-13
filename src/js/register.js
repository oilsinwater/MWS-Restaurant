let registerWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(
      () => {
        console.log('CLIENT: service worker registration complete!');
      },
      error => {
        console.log(
          'CLIENT: service worker registration failure, error: ',
          error
        );
      }
    );
  }
};

window.addEventListener('load', () => {
  registerWorker();
});
