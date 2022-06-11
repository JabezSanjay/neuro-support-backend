const express = require('express');
const {
  signup,
  signin,
  logout,
  getLoggedInUserInfo,
} = require('../controller/User');
const { isLoggedIn, customRole } = require('../middleware/user');
const router = express.Router();
const cookieToken = require('../utils/cookieToken');

router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/logout').get(logout);

router.route('/user/me').get(isLoggedIn, getLoggedInUserInfo);

module.exports = router;
