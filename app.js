const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const message = require('./controllers/message');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());

app.use('/message', message);

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message
  });
});

module.exports = app;
