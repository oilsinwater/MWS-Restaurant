/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

let restaurant;
var map;

document.addEventListener('DOMContentLoaded', event => {
  initMap();
  window.lazySizesConfig = window.lazySizesConfig || {};
  lazySizesConfig.loadMode = 1; // no offscreen images load
});

/**
 * Get current restaurant from page URL.
 */
let fetchRestaurantFromURL = callback => {
  if (self.restaurant) {
    // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  let id = getParameterByName('id');
  if (!id) {
    // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant);
    });
  }
};

/**
 * Initialize Google map, called from HTML.
 */

let initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) {
      console.error(error);
    } else {
      if (navigator.onLine) {
        try {
          self.newMap = L.map('map', {
            center: [restaurant.latlng.lat, restaurant.latlng.lng],
            zoom: 16,
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
          DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
        } catch (error) {
          console.log("Map couldn't load", error);
          DBHelper.mapOffline();
        }
      } else {
        DBHelper.mapOffline();
      }
      fillBreadcrumb();
    }
  });
};

/*
 * fetch reviews
 */
let fetchReviews = () => {
  let id = getParameterByName('id');
  if (!id) {
    console.log('No ID in URL');
    return;
  }
  DBHelper.fetchReviewsForRestaurant(id, (err, reviews) => {
    self.reviews = reviews;
    if (err || !reviews) {
      console.log('reviews fetch error', err);
      return;
    }
    fillReviewsHTML();
  });
};

/*
 * Set favorite button
 */
let setFavoriteButton = status => {
  let favorite = document.getElementById('favBtn');
  if (status === 'true') {
    favorite.title = 'Restaurant is Favorite';
    favorite.innerHTML = '⭐️ Unfavorite';
  } else {
    favorite.title = 'Restaurant is not Favorite';
    favorite.innerHTML = '☆ Favorite';
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
let fillRestaurantHTML = (restaurant = self.restaurant) => {
  let name = document.getElementById('restaurant-name');
  let address = document.getElementById('restaurant-address');
  let image = document.getElementById('restaurant-img');
  let cuisine = document.getElementById('restaurant-cuisine');
  let imgTxt =
    restaurant.name +
    ' restaurant in the neighborhood of ' +
    restaurant.neighborhood +
    '.';

  name.innerHTML = restaurant.name;
  setFavoriteButton(restaurant.is_favorite);
  address.innerHTML = restaurant.address;
  cuisine.innerHTML = restaurant.cuisine_type;

  function setAtrributes(el, attrs) {
    for (let key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }

  setAtrributes(image, {
    alt: imgTxt,
    className: 'restaurant-img lazyload',
    src: DBHelper.imageUrlForRestaurant(restaurant),
    'data-src': DBHelper.imageUrlForRestaurant(restaurant),
    srcset: DBHelper.imageSrcsetForRestaurant(restaurant),
    sizes: DBHelper.imageSizesForRestaurant(restaurant),
    title: imgTxt
  });

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fetchReviews();
  fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
let fillRestaurantHoursHTML = (
  operatingHours = self.restaurant.operating_hours
) => {
  let hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    let row = document.createElement('tr');

    let day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    let time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
let fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  let container = document.getElementById('reviews-container');
  let title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    let noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  let ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
let createReviewHTML = review => {
  let li = document.createElement('li');
  let name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  let date = document.createElement('p');
  date.innerHTML = review.date;
  li.appendChild(date);

  let rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  let comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
let fillBreadcrumb = (restaurant = self.restaurant) => {
  let breadcrumb = document.getElementById('breadcrumb');
  let li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.setAttribute('aria-current', 'page');
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
let getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  // eslint-disable-next-line no-useless-escape
  name = name.replace(/[\[\]]/g, '\\$&');
  let regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const getHumanDate = ts => {
  let date = new Date(ts);
  return (
    date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
  );
};

/* Managing reviews */
// https://developers.google.com/web/updates/2015/12/background-sync
navigator.serviceWorker.ready.then(function(swRegistration) {
  let form = document.querySelector('#review-form');
  // listen to submit event
  form.addEventListener('submit', e => {
    e.preventDefault();
    let rating = form.querySelector('#rating');
    let review = {
      restaurant_id: getParameterByName('id'),
      name: form.querySelector('#name').value,
      rating: rating.options[rating.selectedIndex].value,
      comments: form.querySelector('#comment').value
    };
    console.log(review);
    // save to DB
    idb
      .open('review', 1, function(upgradeDb) {
        upgradeDb.createObjectStore('outbox', {
          autoIncrement: true,
          keyPath: 'id'
        });
      })
      .then(function(db) {
        var transaction = db.transaction('outbox', 'readwrite');
        return transaction.objectStore('outbox').put(review);
      })
      .then(function() {
        form.reset();
        // register for sync and clean up the form
        return swRegistration.sync.register('sync').then(() => {
          console.log('Sync registered');
          // add review to view (for better UX)
          // let ul = document.getElementById('reviews-list');
          // review.createdAt = new Date();
          // ul.appendChild(createReviewHTML(review));
        });
      });
    // finish
  });
});

/* Managing favorites */
navigator.serviceWorker.ready.then(function(swRegistration) {
  let btn = document.getElementById('favBtn');
  // listen to click event
  btn.addEventListener('click', e => {
    let opposite = self.restaurant.is_favorite === 'true' ? 'false' : 'true';
    console.log('clicked');
    let res = {
      resId: getParameterByName('id'),
      favorite: opposite
    };
    // save to DB
    idb
      .open('favorite', 1, function(upgradeDb) {
        upgradeDb.createObjectStore('outbox', {
          autoIncrement: true,
          keyPath: 'id'
        });
      })
      .then(function(db) {
        var transaction = db.transaction('outbox', 'readwrite');
        return transaction.objectStore('outbox').put(res);
      })
      .then(function() {
        setFavoriteButton(opposite);
        self.restaurant.is_favorite = opposite;
        // register for sync and clean up the form
        return swRegistration.sync.register('favorite').then(() => {
          console.log('Favorite Sync registered');
        });
      });
    // finish
  });
});
