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
    message: 'Logout successfull!',
  });
});

exports.getLoggedInUserInfo = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
    message: 'User info fetched successfully!',
  });
});

//Admin APIs
exports.adminCreateUser = BigPromise(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name) {
    return next(new CustomError('Name is required!', 400, res));
  }
  if (!email) {
    return next(new CustomError('Email is required!', 400, res));
  }
  if (!password) {
    return next(new CustomError('Password is required!', 400, res));
  }
  if (!role) {
    return next(new CustomError('Role is required!', 400, res));
  }
  const user = await User.findOne({ email });
  if (user) {
    return next(new CustomError('User already exists', 400, res));
  }
  const newUser = await User.create({
    name,
    email,
    password,
    role,
  });
  res.status(201).json({
    success: true,
    data: newUser,
    message: 'User created successfully!',
  });
});

exports.adminReadUsers = BigPromise(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    data: users,
    message: 'Users fetched successfully!',
  });
});

exports.adminDeleteOneUser = BigPromise(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new CustomError('User does not exists!', 404, res));
  }
  res.status(200).json({
    success: true,

    message: 'User deleted successfully!',
  });
});

exports.adminAddMentorToUsers = BigPromise(async (req, res, next) => {
  const { mentorId, studentId } = req.body;
  if (!mentorId) {
    return next(new CustomError('Mentor is required!', 400, res));
  }
  const user = await User.findOne({
    socketId: studentId,
  });
  if (!user) {
    return next(new CustomError('User does not exists!', 404, res));
  }
  user.mentorsId.push(mentorId);
  await user.save();
  //add users to mentor id
  const mentor = await User.findOne({
    socketId: mentorId,
  });
  if (!mentor) {
    return next(new CustomError('Mentor does not exists!', 404, res));
  }
  mentor.studentsId.push(studentId);
  await mentor.save();

  if (!user) {
    return next(new CustomError('User does not exists!', 404, res));
  }
  res.status(200).json({
    success: true,
    data: user,
    message: 'Mentor added successfully!',
  });
});

exports.getConnectedUsers = BigPromise(async (req, res, next) => {
  const currentUser = await User.findById(req.user._id);
  let connectedUsers;

  if (req.user.role === 'mentor') {
    connectedUsers = await User.find({
      socketId: {
        $in: currentUser.studentsId,
      },
    });
  } else {
    connectedUsers = await User.find({
      socketId: {
        $in: currentUser.mentorsId,
      },
    });
  }
  res.json({
    success: true,
    data: connectedUsers,
    message: 'Connected users fetched successfully!',
  });
});
