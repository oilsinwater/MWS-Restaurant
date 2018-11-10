/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "css/home.css",
    "revision": "fdfdc01ad50bfa8987ebef5dab49e0e9"
  },
  {
    "url": "css/review.css",
    "revision": "49c9f96fc8686c5b4e04fab04e444a3a"
  },
  {
    "url": "data/restaurants.json",
    "revision": "0531c074066a368ac27fded1461cc8d7"
  },
  {
    "url": "idb.js",
    "revision": "46300596db1a969b23efb7c32d8584c4"
  },
  {
    "url": "img/1.jpg",
    "revision": "cc074688becddd2725114187fba9471c"
  },
  {
    "url": "img/10.jpg",
    "revision": "2bd68efbe70c926de6609946e359faa2"
  },
  {
    "url": "img/2.jpg",
    "revision": "759b34e9a95647fbea0933207f8fc401"
  },
  {
    "url": "img/3.jpg",
    "revision": "81ee36a32bcfeea00db09f9e08d56cd8"
  },
  {
    "url": "img/4.jpg",
    "revision": "23f21d5c53cbd8b0fb2a37af79d0d37f"
  },
  {
    "url": "img/5.jpg",
    "revision": "0a166f0f4e10c36882f97327b3835aec"
  },
  {
    "url": "img/6.jpg",
    "revision": "eaf1fec4ee66e121cadc608435fec72f"
  },
  {
    "url": "img/7.jpg",
    "revision": "bd0ac197c58cf9853dc49b6d1d7581cd"
  },
  {
    "url": "img/8.jpg",
    "revision": "6e0e6fb335ba49a4a732591f79000bb4"
  },
  {
    "url": "img/9.jpg",
    "revision": "ba4260dee2806745957f4ac41a20fa72"
  },
  {
    "url": "img/unaltered/icon.png",
    "revision": "ebaa8e08f3b384a0317fc4fad0a10a37"
  },
  {
    "url": "img/unaltered/offline.png",
    "revision": "cd1d7fd408d63434158f3e072cced9c9"
  },
  {
    "url": "index.html",
    "revision": "db709473bef11644e3caae3581b62250"
  },
  {
    "url": "js/dbhelper.js",
    "revision": "d2f6b84bc2c8a7bae689a9658f2e2d4d"
  },
  {
    "url": "js/main.js",
    "revision": "efb0161c41e1f6166707cb0fd398922c"
  },
  {
    "url": "js/register.js",
    "revision": "338b986e8250fbe1175a45b373f4a200"
  },
  {
    "url": "js/restaurant_info.js",
    "revision": "c387be80e03489bb5b34baa01036cf92"
  },
  {
    "url": "restaurant.html",
    "revision": "3a90c5ef3fc7b3933f363990c328bfb5"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
