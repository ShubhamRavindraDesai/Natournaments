const express = require('express');
const dotenv = require('dotenv');

const path = require('path')
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');

// const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const matchRouter = require('./routes/matchRoutes');
const userRouter = require('./routes/userRoutes');

dotenv.config({ path: './config.env' });

const app = express();

// 1) middlewares

// app.set('view engine', "pug")
// app.set('views', path.join(__dirname, 'views'))


// serving static files
app.use(express.static(path.join(__dirname,'public')));

// security http headers middleware
app.use(helmet());

// data sanitation for noSQL query injection
app.use(mongoSanitize());

// data sanitation from xss
app.use(xss());

app.use(compression());

// prevent parameter polution
// app.use(hpp())

// logging development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// fixed server req limit for security
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'to many requests please try after 1 hour',
});
app.use('/api', limiter);

// body parser reading data  in body into req.body
app.use(express.json({ limit: '10kb' }));



// test middleware

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) Routes

// app.get('/', (req, res) => {
//   res.status(200).render('base')
// })

app.use('/api/v1/matches', matchRouter);
app.use('/api/v1/users', userRouter);

// app.all('*', (req, res, next) => {
//   next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
// });

app.use(globalErrorHandler);
module.exports = app;
