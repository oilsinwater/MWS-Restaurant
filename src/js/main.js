/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

let restaurants;
let neighborhoods;
let cuisines;
var markers = [];
var newMap;

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', event => {
  initMap();
  fetchNeighborhoods();
  fetchCuisines();
  window.lazySizesConfig = window.lazySizesConfig || {};
  lazySizesConfig.loadMode = 1;
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
let fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) {
      // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
let fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  let select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    let option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
let fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
let fillCuisinesHTML = (cuisines = self.cuisines) => {
  let select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    let option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Initialize leaflet map, called from HTML.
 */
let initMap = () => {
  if (navigator.onLine) {
    try {
      self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
        scrollWheelZoom: false
      });
      L.tileLayer(
        'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}',
        {
          mapboxToken: SECRET.mapbox_key,
          maxZoom: 18,
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: 'mapbox.streets'
        }
      ).addTo(newMap);
    } catch (error) {
      console.log('Map couldn\'t load', error);
      DBHelper.mapOffline();
    }
  }

  updateRestaurants();
};

/**
 * Initialize Google map, called from HTML.
 */
// window.initMap = () => {
//   let loc = {
//     lat: 40.722216,
//     lng: -73.987501
//   };
//   self.map = new google.maps.Map(document.getElementById('map'), {
//     zoom: 11.75,
//     center: loc,
//     scrollwheel: false
//   });
//   updateRestaurants();
// };

/**
 * Update page and map for current restaurants.
 */
let updateRestaurants = () => {
  let cSelect = document.getElementById('cuisines-select');
  let nSelect = document.getElementById('neighborhoods-select');

  let cIndex = cSelect.selectedIndex;
  let nIndex = nSelect.selectedIndex;

  let cuisine = cSelect[cIndex].value;
  let neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(
    cuisine,
    neighborhood,
    (error, restaurants) => {
      if (error) {
        // Got an error!
        console.error(error);
      } else {
        resetRestaurants(restaurants);
        fillRestaurantsHTML();
      }
    }
  );
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
let resetRestaurants = restaurants => {
  // Remove all restaurants
  self.restaurants = [];
  let ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
let fillRestaurantsHTML = (restaurants = self.restaurants) => {
  let ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
let createRestaurantHTML = restaurant => {
  let li = document.createElement('li');
  li.setAttribute('role', 'listitem');

  let image = document.createElement('img');
  image.className = 'restaurant-img lazyload';
  image.alt = imgTxt;
  image.title = imgTxt;
  image.setAttribute('data-src', DBHelper.imageUrlForRestaurant(restaurant));
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.srcset = DBHelper.imageSrcsetForRestaurant(restaurant);
  image.sizes = DBHelper.imageSizesForRestaurant(restaurant);
  let name = document.createElement('h1');
  let neighborhood = document.createElement('p');
  let address = document.createElement('p');
  let more = document.createElement('a');
  let imgTxt = `${restaurant.name} restaurant, in the neighborhood of ${
    restaurant.neighborhood
  }`;
  li.append(image);

  name.innerHTML = restaurant.name;
  li.append(name);

  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  address.innerHTML = restaurant.address;
  li.append(address);

  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);
  return li;
};

/**
 * Add markers for current restaurants to the map.
 */

let addMarkersToMap = (restaurants = self.restaurants) => {
  if (!newMap || !L) return;
  restaurants.forEach(restaurant => {
    // Add marker to the map
    let marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on('click', onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });
};
