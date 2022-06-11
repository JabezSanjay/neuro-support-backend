const User = require('../models/User');
const crypto = require('crypto');
const BigPromise = require('../middleware/bigPromise');
const cookieToken = require('../utils/cookieToken');
const CustomError = require('../utils/customError');
const validator = require('validator');

exports.signup = BigPromise(async (req, res, next) => {
  let newUser;
  const { name, email, password } = req.body;
  if (!name) {
    return next(new CustomError('Name is required!', 400, res));
  }
  if (!email) {
    return next(new CustomError('Email is required!', 400, res));
  }
  if (!password) {
    return next(new CustomError('Password is required!', 400, res));
  }
  const user = await User.findOne({ email });
  if (user) {
    return next(new CustomError('User already exists', 400, res));
  }
  newUser = await User.create({
    name,
    email,
    password,
  });
  cookieToken(newUser, res);
});

exports.signin = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email) {
    return next(new CustomError('Email is required!', 400, res));
  }
  if (!password) {
    return next(new CustomError('Password is required!', 400, res));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new CustomError('User does not exists!', 404, res));
  }
  const isPasswordValid = await user.validatePassword(password);
  if (!isPasswordValid) {
    return next(new CustomError('Email and password does not match', 400, res));
  }
  cookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: 'Logout successfully!',
  });
});

exports.getLoggedInUserInfo = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});
