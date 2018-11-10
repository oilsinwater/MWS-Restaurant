// // register service worker
// if ('serviceWorker' in navigator) {
//   console.log('CLIENT: service worker registration in progress...');
//   navigator.serviceWorker.register('idb.js').then(
//     function() {
//       console.log('CLIENT: service worker registration complete!');
//     },
//     function() {
//       console.log('CLIENT: service worker registration failure!');
//     }
//   );
// } else {
//   console.log('CLIENT: service worker is not supported!');
// }

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
