// let restaurants, neighborhoods, cuisines; /* eslint-disable-line no-alert */
// var map; /* eslint-disable-line no-alert */
// var markers = []; /* eslint-disable-line no-alert */
const state = {
  restaurants: [],
  neighborhoods: [],
  cuisines: [],
  markers: [],
  interactive: false
};
let newMap;

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', event => {
  initMap();
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
const fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) {
      // Got an error
      console.error(error);
    } else {
      state.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = (neighborhoods = state.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
const fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      state.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = (cuisines = state.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = L.map('map', {
    center: [40.722216, -73.987501],
    zoom: 12,
    scrollWheelZoom: false
  });
  L.tileLayer(
    'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}',
    {
      mapboxToken: '<your MAPBOX API KEY HERE>',
      maxZoom: 18,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox.streets'
    }
  ).addTo(newMap);

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
const updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

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
const resetRestaurants = restaurants => {
  // Remove all restaurants
  state.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  state.markers.forEach(m => m.setMap(null));
  state.markers = [];
  state.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
const fillRestaurantsHTML = (restaurants = state.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
const createRestaurantHTML = restaurant => {
  const li = document.createElement('li');
  const image = document.createElement('img');
  const name = document.createElement('h1');
  const neighborhood = document.createElement('p');
  const address = document.createElement('p');
  const more = document.createElement('a');
  const imgTxt = `${restaurant.name} restaurant, in the neighborhood of ${
    restaurant.neighborhood
  }`;

  function setAtrributes(el, attrs) {
    for (let key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }

  setAtrributes(image, {
    alt: imgTxt,
    className: 'restaurant-img',
    src: DBHelper.imageUrlForRestaurant(restaurant),
    srcset: DBHelper.imageSrcsetForRestaurant(restaurant),
    sizes: DBHelper.imageSizesForRestaurant(restaurant),
    title: imgTxt
  });
  li.append(image);

  name.innerHTML = restaurant.name;
  li.append(name);

  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  address.innerHTML = restaurant.address;
  li.append(address);

  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  more.addEventListener('click', () => {
    window.location.href = DBHelper.urlForRestaurant(restaurant);
  });
  li.append(more);
  return li;
};

/**
 * Add markers for current restaurants to the map.
 */

const addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });


  /* addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
} */