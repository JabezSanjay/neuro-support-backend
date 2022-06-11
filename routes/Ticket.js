const express = require('express');
const { adminReadTickets } = require('../controller/Ticket');
const { isLoggedIn, customRole } = require('../middleware/user');
const router = express.Router();

//Admin read ticket
router.route('/admin/read/ticket').get(adminReadTickets);

module.exports = router;
