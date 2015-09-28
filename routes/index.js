const debug = require('debug')('Errors');

// Routers

module.exports = function(app) {

  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      debug(err);
      next(err);
    });
  }

  app.use(function(err, req, res, next) {
    res.status(err.status || 500).end();
  });

};
