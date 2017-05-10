'use strict';

const Sequelize = require('sequelize');
const db = require('../db');

const Engagement = db.Engagement;
const User = db.User;
const Message = db.Message;
const Service = db.Service;
const Review = db.Review;



var getBoundingBox = function (centerPoint, distance) {
  /**
   * @param {number} distance - distance (km) from the point represented by centerPoint
   * @param {array} centerPoint - two-dimensional array containing center coords [latitude, longitude]
   * @description
   *   Computes the bounding coordinates of all points on the surface of a sphere
   *   that has a great circle distance to the point represented by the centerPoint
   *   argument that is less or equal to the distance argument.
   *   Technique from: Jan Matuschek <http://JanMatuschek.de/LatitudeLongitudeBoundingCoordinates>
   * @author Alex Salisbury
   */
  var MIN_LAT, MAX_LAT, MIN_LON, MAX_LON, R, radDist, degLat, degLon, radLat, radLon, minLat, maxLat, minLon, maxLon, deltaLon;
  if (distance < 0) {
    return 'Illegal arguments';
  }
  // helper functions (degrees<–>radians)
  Number.prototype.degToRad = function () {
    return this * (Math.PI / 180);
  };
  Number.prototype.radToDeg = function () {
    return (180 * this) / Math.PI;
  };
  // coordinate limits
  MIN_LAT = (-90).degToRad();
  MAX_LAT = (90).degToRad();
  MIN_LON = (-180).degToRad();
  MAX_LON = (180).degToRad();
  // Earth's radius (km)
  // R = 6378.1;
  // Earth's radius (miles)
  R = 3959;
  // angular distance in radians on a great circle
  radDist = distance / R;
  // center point coordinates (deg)
  degLat = centerPoint[0];
  degLon = centerPoint[1];
  // center point coordinates (rad)
  radLat = degLat.degToRad();
  radLon = degLon.degToRad();
  // minimum and maximum latitudes for given distance
  minLat = radLat - radDist;
  maxLat = radLat + radDist;
  // minimum and maximum longitudes for given distance
  minLon = void 0;
  maxLon = void 0;
  // define deltaLon to help determine min and max longitudes
  deltaLon = Math.asin(Math.sin(radDist) / Math.cos(radLat));
  if (minLat > MIN_LAT && maxLat < MAX_LAT) {
    minLon = radLon - deltaLon;
    maxLon = radLon + deltaLon;
    if (minLon < MIN_LON) {
      minLon = minLon + 2 * Math.PI;
    }
    if (maxLon > MAX_LON) {
      maxLon = maxLon - 2 * Math.PI;
    }
  }
  // a pole is within the given distance
  else {
    minLat = Math.max(minLat, MIN_LAT);
    maxLat = Math.min(maxLat, MAX_LAT);
    minLon = MIN_LON;
    maxLon = MAX_LON;
  }
  return [
    minLon.radToDeg(),
    minLat.radToDeg(),
    maxLon.radToDeg(),
    maxLat.radToDeg()
  ];
};

var findAuth0User = function(req){
  return User.find({
    where: {auth0_id: req.user.sub}
  })
};


//figure out which controller to implement this in...
//and how to pass down the data to react component inside the console.log by tomorrow evening...
var findHighestRatedServiceProviders = function(req, res){
  let reviewsAverage = [[], []];
  let resultData = [];
  let personName = '';

  Service.findAll({ where: { type: req.body.specialty}, limit: 1})
    .then((service) => {
      User.findAll({ where: { service_id: service.id}})
        .then((users) => {
          users.forEach((person) => {
            personName = person.name;
            Review.findAll({ where: { sender_id: person.id}})
              .then((reviews) => {
                let avg = reviews.reduce((acc, index) => index + acc, 0)/reviews.length;
                reviewsAverage[0].push(avg);
                reviewsAverage[1].push({personName: avg});
                let bestRated = reviewAverage[0].sort().reverse();
                bestRated = [bestRated[0], bestRated[1]];
                reviewsAverage[1].map((data) => {
                  for(let key in data){
                    if(data[key] === bestRated[0] || bestRated[1]){
                      resultData.push(data);
                    }
                  }
                });
              });
          });
        });
    });
    if(resultData.length > 0){
      res.status(200).send(resultData)
    } else {
      res.status(404).send("Coudn't get Highest Rated Service Providers Due To Async Issues... Probably...");
    }
};

module.exports.findAuth0User = findAuth0User;
module.exports.getBoundingBox = getBoundingBox;
// module.exports.findHighestRatedServiceProviders = findHighestRatedServiceProviders;
