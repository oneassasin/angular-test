const sha1 = require('sha1');
const Promise = require('bluebird');
const nconf = require('nconf');

module.exports.createUser = function createUser(req, res, next) {
  req.assert('username', 'username_required').notEmpty();
  req.assert('password', 'password_required').notEmpty();
  req.asyncValidationErrors()
      .catch(function(errors) {
        errors.status = 400;
        return Promise.reject(errors);
      })
      .then(function() {
        const newUser = {
          username: req.sanitize('username').escape(),
          password: sha1(req.sanitize('password').toString())
        };
        return req.parse.insertUserAsync(newUser);
      })
      .catch(function(errors) {
        if (errors.code === 202) {
          const error = [
            {
              msg: errors.error
            }
          ];
          error.status = 400;
          return Promise.reject(error);
        }

        return Promise.reject(errors);
      })
      .then(function(response) {
        res.status(200).cookie(nconf.get('cookie:name'), response.sessionToken, nconf.get('cookie:params')).end();
      })
      .catch(next);
};

module.exports.updateUser = function updateUser(req, res, next) {
};

module.exports.getUserInfo = function getUserInfo(req, res, next) {
};

module.exports.deleteUser = function deleteUser(req, res, next) {
};
