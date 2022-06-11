const Course = require('../models/Course');
const crypto = require('crypto');
const BigPromise = require('../middleware/bigPromise');
const CustomError = require('../utils/customError');

exports.adminCreateCourse = BigPromise(async (req, res, next) => {
  let newCourse;
  const { name } = req.body;
  if (!name) {
    return next(new CustomError('Name is required!', 400, res));
  }
  const course = await Course.findOne({ name });
  if (course) {
    return next(new CustomError('Course already exists', 400, res));
  }
  newCourse = await Course.create({
    name,
    createdBy: req.user._id,
  });
  res.status(201).json({
    success: true,
    data: newCourse,
    message: 'Course created successfully',
  });
});

exports.adminReadCourses = BigPromise(async (req, res, next) => {
  const courses = await Course.find();
  res.status(200).json({
    success: true,
    data: courses,
    message: 'Courses fetched successfully',
  });
});

exports.adminDeleteCourse = BigPromise(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return next(new CustomError('Course does not exists!', 404, res));
  }
  res.status(200).json({
    success: true,
    message: 'Course deleted successfully',
  });
});

exports.readCourses = BigPromise(async (req, res, next) => {
  const courses = await Course.find();
  res.status(200).json({
    success: true,
    data: courses,
    message: 'Courses fetched successfully',
  });
});
