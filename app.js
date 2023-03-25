var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

// ADMIN
const dashboardRouter = require('./app/admin/dashboard/router');
const admBlankoRouter = require('./app/admin/blanko/router');

// API
const blankoRouter = require('./app/blanko2/router');
const authRouter = require('./app/auth/router');
const petaniRouter = require('./app/petani/router');
const dinasRouter = require('./app/dinas/router');
// const testingRouter = require('./app/testing/router');
const stokRouter = require('./app/stok2/router');
const transaksiRouter = require('./app/transaksi2/router');
const usangRouter = require('./app/usang/router');
const userRouter = require('./app/users/router');
const supervisiRouter = require('./app/supervisi/router');
const lahanRouter = require('./app/lahan/router');
const modalRouter = require('./app/modal/router');
// const transaksi2Router = require('./app/transaksi2/router');

const app = express();
const URL = `/api/v1`;
const petaniURL = `/api/v1/petani`;
const adminURL = `/admin`;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);
app.use(flash());
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
app.use(cors());

app.use('/', petaniRouter);

// ADMIN PAGE ---------------------------
app.use(`${adminURL}/`, dashboardRouter);
app.use(`${adminURL}/blanko`, admBlankoRouter);

// API ----------------------------------
app.use(`${URL}/auth`, authRouter);
app.use(`${URL}/petani`, petaniRouter);
app.use(`${URL}/dinas`, dinasRouter);
app.use(`${URL}/blanko`, blankoRouter);
// app.use(`${URL}/testing`, testingRouter);
app.use(`${URL}/stok`, stokRouter);
app.use(`${URL}/transaksi`, transaksiRouter);
app.use(`${URL}/usang`, usangRouter);
app.use(`${URL}/user`, userRouter);
app.use(`${URL}/supervisi`, supervisiRouter);
app.use(`${URL}/lahan`, lahanRouter);
app.use(`${URL}/modal`, modalRouter);
// app.use(`${URL}/transaksi2`, transaksi2Router);

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
