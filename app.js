var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require('method-override');

const dashboardRouter = require('./app/dashboard/router');
const blankoRouter = require('./app/blanko/router');
const authRouter = require('./app/auth/router');
const petaniRouter = require('./app/petani/router');
// const testingRouter = require('./app/testing/router');
const stokRouter = require('./app/stok/router');

const app = express();
const petaniURL = `/api/v1/petani`
const adminURL = `/admin`

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/adminlte',
  express.static(path.join(__dirname, '/node_modules/admin-lte/'))
);


// admin page
app.use(`${adminURL}/`, dashboardRouter);
app.use(`${adminURL}/blanko`, blankoRouter);


// api
app.use(`${URL}/auth`, authRouter)
app.use(`${URL}/petani`, petaniRouter);
app.use(`${petaniURL}/blanko`, blankoRouter);
// app.use(`${URL}/testing`, testingRouter);
app.use(`${petaniURL}/stok`, stokRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
