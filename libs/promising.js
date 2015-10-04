const Promise = require('bluebird');

module.exports.parsePromise = function(object) {
  return new Promise(function(resolve, reject) {
    object.then(function(result) {
      return resolve(result);
    }, function(error) {
      return reject(error);
    });
  });
};
