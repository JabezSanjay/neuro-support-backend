const express = require('express');
const {
  adminCreateCourse,
  readCourses,
  adminReadCourses,
  adminDeleteCourse,
} = require('../controller/Course');
const { isLoggedIn, customRole } = require('../middleware/user');
const router = express.Router();
const cookieToken = require('../utils/cookieToken');

router
  .route('/admin/create/course')
  .post(isLoggedIn, customRole('admin'), adminCreateCourse);
router
  .route('/admin/read/courses')
  .get(isLoggedIn, customRole('admin'), adminReadCourses);
router
  .route('/admin/delete/course/:id')
  .get(isLoggedIn, customRole('admin'), adminDeleteCourse);
router.route('/read/courses').get(readCourses);

module.exports = router;
