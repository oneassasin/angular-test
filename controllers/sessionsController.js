const sha1 = require('sha1');
const Promise = require('bluebird');
const nconf = require('nconf');
const promising = require('../libs/promising');
const Parse = require('parse/node');

module.exports.loginIn = function(req, res, next) {
  req.assert('username', 'username_required').notEmpty();
  req.assert('password', 'password_required').notEmpty();
  req.asyncValidationErrors()
      .catch(function(errors) {
        errors.status = 400;
        return Promise.reject(errors);
      })
      .then(function() {
        const username = req.sanitize('username').escape();
        const password = sha1(req.sanitize('password').toString());
        return promising.parsePromise(Parse.User.logIn(username, password));
      })
      .catch(function(errors) {
        if (errors.code === 101) {
          const error = [
            {
              msg: errors.message
            }
          ];
          error.status = 400;
          return Promise.reject(error);
        }

        return Promise.reject(errors);
      })
      .then(function(user) {
        res.status(201).cookie(nconf.get('cookie:name'), user.getSessionToken(), nconf.get('cookie:params')).end();
      })
      .catch(next);
};

module.exports.signOut = function(req, res, next) {
  promising.parsePromise(Parse.User.logOut())
      .then(function() {
        res.clearCookie(nconf.get('cookie:name'), {}).status(200).end();
      })
      .catch(next);
};
