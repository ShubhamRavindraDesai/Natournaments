const express = require('express');

const morgan = require('morgan');
const matchRouter = require('./routes/matchRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) middlewares
if ((process.env.NODE_ENV = 'development')) {
	app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
// 	console.log('hello from the middleware....');
// 	next();
// });

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

// 3) Routes

app.use('/api/v1/matches', matchRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
