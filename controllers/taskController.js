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
        const taskID = req.sanitize('id').escape();
        const query = new Parse.Query(ToDo);
        query.equalTo('objectId', taskID);
        query.equalTo('author', user.id);
        return promising.parsePromise(query.first());
      })
      .then(function(task) {
        const text = req.sanitize('text').escape();
        task.set('text', text);
        return promising.parsePromise(task.save(null));
      })
      .then(function(task) {
        res.status(200).header('Location', task.id).end();
      })
      .catch(function(error) {
        error.status = 404;
        return next(error);
      });
};

module.exports.deleteTask = function(req, res, next) {
  promising.parsePromise(Parse.User.currentAsync())
      .then(function(user) {
        const taskID = req.sanitize('id').escape();
        const query = new Parse.Query(ToDo);
        query.equalTo('objectId', taskID);
        query.equalTo('author', user.id);
        return promising.parsePromise(query.first());
      })
      .then(function(task) {
        if (!task) {
          const error = new Error();
          error.status = 404;
          error.message = 'task_not_found';
          return Promise.reject(error);
        }

        return promising.parsePromise(task.destroy(null));
      })
      .then(function() {
        res.status(200).end();
      })
      .catch(next);
};

module.exports.getTask = function(req, res, next) {
  promising.parsePromise(Parse.User.currentAsync())
      .then(function(user) {
        const taskID = req.sanitize('id').escape();
        const query = new Parse.Query(ToDo);
        query.equalTo('objectId', taskID);
        query.equalTo('author', user.id);
        return promising.parsePromise(query.first());
      })
      .then(function(task) {
        if (!task) {
          const error = new Error();
          error.status = 404;
          error.message = 'task_not_found';
          return Promise.reject(error);
        }

        res.status(200).send(task).end();
      })
      .catch(next);
};

