const Promise = require('bluebird');
const escaper = require('../libs/escaper');
const promising = require('../libs/promising');
const Parse = require('parse/node');
const ToDo = require('../models/ToDo');

module.exports.createTask = function(req, res, next) {
  req.assert('text').notEmpty();
  req.asyncValidationErrors()
      .catch(function(errors) {
        errors.status = 400;
        return Promise.reject(errors);
      })
      .then(function() {
        return promising.parsePromise(Parse.User.currentAsync());
      })
      .then(function(user) {
        const text = req.sanitize('text').escape();
        const newToDo = new ToDo();
        newToDo.set('text', text);
        newToDo.set('author', user.id);
        return promising.parsePromise(newToDo.save(null));
      })
      .then(function(ToDo) {
        res.status(201).header('Location', ToDo.id).end();
      })
      .catch(next);
};

module.exports.updateTask = function(req, res, next) {
};

module.exports.deleteTask = function(req, res, next) {
};

module.exports.getTask = function(req, res, next) {
};

