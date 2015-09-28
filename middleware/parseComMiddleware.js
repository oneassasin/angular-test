const Parse = require('node-parse-api').Parse;
const nconf = require('nconf');
const Promise = require('bluebird');

const parseAPI = new Parse(nconf.get('parse:app_key'), nconf.get('parse:master_key'));
const promisesParseAPI = Promise.promisifyAll(parseAPI);

module.exports = function index() {
  return function middleware(req, res, next) {
    req.parse = promisesParseAPI;
    return next();
  };
};
