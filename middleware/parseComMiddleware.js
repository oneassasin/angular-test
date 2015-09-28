const Parse = require('node-parse-api').Parse;
const nconf = require('nconf');

const parseAPI = new Parse(nconf.get('parse:app_key'), nconf.get('parse:master_key'));

module.exports = function index() {
  return function middleware(req, res, next) {
    req.parse = parseAPI;
    return next();
  };
};
