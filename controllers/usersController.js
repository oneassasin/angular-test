const sha1 = require('sha1');
const Promise = require('bluebird');
const nconf = require('nconf');
const escaper = require('../libs/escaper');
const promising = require('../libs/promising');
const Parse = require('parse/node');

module.exports.createUser = function createUser(req, res, next) {
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
        return promising.parsePromise(Parse.User.signUp(username, password));
      })
      .catch(function(errors) {
        if (errors.code === 202) {
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

module.exports.updateUser = function(req, res, next) {
  req.assert('password', 'password_required').notEmpty();
  req.asyncValidationErrors()
      .catch(function(errors) {
        errors.status = 400;
        return Promise.reject(errors);
      })
      .then(function() {
        return promising.parsePromise(Parse.User.currentAsync());
      })
      .then(function(user) {
        const password = sha1(req.sanitize('password').toString());
        user.set('password', password);
        return promising.parsePromise(user.save(null));
      })
      .then(function(user) {
        return promising.parsePromise(Parse.User.logOut());
      })
      .then(function() {
        res.status(200).clearCookie(nconf.get('cookie:name'), {}).end();
      })
      .catch(next);
};

module.exports.getUserInfo = function getUserInfo(req, res, next) {
  promising.parsePromise(Parse.User.currentAsync())
      .then(function(user) {
        res.status(200).send(user).end();
      })
      .catch(function(error) {
        return next(error);
      });
};

module.exports.deleteUser = function deleteUser(req, res, next) {
  promising.parsePromise(Parse.User.currentAsync())
      .then(function(user) {
        return promising.parsePromise(user.destroy(null));
      })
      .then(function(user) {
        return promising.parsePromise(Parse.User.logOut());
      })
      .then(function() {
        res.status(200).clearCookie(nconf.get('cookie:name'), {}).end();
      })
      .catch(function(error) {
        return next(error);
      });
};
