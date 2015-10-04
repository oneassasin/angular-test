const Parse = require('parse/node');
const debug = require('debug')('Express');
const nconf = require('nconf');

module.exports = function(app) {
  Parse.Parse.initialize(nconf.get('parse:app_key'), nconf.get('parse:js_key'), nconf.get('parse:master_key'));
  Parse.User.enableRevocableSession();
  Parse.User.enableUnsafeCurrentUser();
  debug('Parse configuring complete!');
};
