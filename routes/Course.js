const express = require('express');
const {} = require('../controller/Course');
const { isLoggedIn, customRole } = require('../middleware/user');
const router = express.Router();
const cookieToken = require('../utils/cookieToken');

router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/logout').get(logout);
router.route('/user/me').get(isLoggedIn, getLoggedInUserInfo);

//admin routes
router
  .route('/admin/create/user')
  .post(isLoggedIn, customRole('admin'), adminCreateUser);
router
  .route('/admin/read/users')
  .get(isLoggedIn, customRole('admin'), adminReadUsers);
router
  .route('/admin/delete/user/:id')
  .delete(isLoggedIn, customRole('admin'), adminDeleteOneUser);
router
  .route('/admin/add/mentors/:id')
  .put(isLoggedIn, customRole('admin'), adminAddMentorToUsers);

module.exports = router;
