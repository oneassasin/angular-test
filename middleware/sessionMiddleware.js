const nconf = require('nconf');
const Parse = require('parse/node');
const promising = require('../libs/promising');

module.exports = function() {
  return function(req, res, next) {
    const cookie = req.cookies[nconf.get('cookie:name')];
    promising.parsePromise(Parse.User.become(cookie)).then(function(user) {
      return next();
    }).catch(function(error) {
      error.status = 403;
      return next(error);
    });
  };
};
