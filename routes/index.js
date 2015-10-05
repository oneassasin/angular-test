const debug = require('debug')('Errors');

// Routers
const usersRouter = require('../routes/usersRouter');
const sessionsRouter = require('../routes/sessionsRouter');
const taskRouter = require('../routes/taskRouter');

module.exports = function(app) {

  app.use('/', usersRouter);
  app.use('/', sessionsRouter);
  app.use('/', taskRouter);

  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      debug(err);
      next(err);
    });
  }

  app.use(function(error, req, res, next) {
    res.status(error.status || 500).send({errors: error}).end();
  });

};
