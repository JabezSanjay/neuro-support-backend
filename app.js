//setup express
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

//Regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true }));

//Cookies and File middleware
app.use(
  cookieSession({
    keys: [process.env.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(cookieParser());

//Morgan middleware
app.use(morgan('tiny'));

//Import all other routes
app.use('/api', require('./routes/User'));
app.use('/api', require('./routes/Ticket'));
app.use('/api', require('./routes/Course'));

module.exports = app;
