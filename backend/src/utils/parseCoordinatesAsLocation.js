module.exports = function parseCoordinatesAsLocation(longitude, latitude) {
  return {
    type: 'Point',
    coordinates: [longitude, latitude],
  };
};
