const express = require('express');
const {
  adminReadTickets,
  mentorReadTickets,
  mentorCreateTicket,
  mentorChangeStatusTicket,
  mentorDeleteTicket,
} = require('../controller/Ticket');
const { isLoggedIn, customRole } = require('../middleware/user');
const router = express.Router();

//Admin APIs
router.route('/admin/read/ticket').get(adminReadTickets);

//Mentor APIs
router.route('/mentor/read/ticket').post(mentorReadTickets);
router.route('/mentor/create/ticket').post(mentorCreateTicket);
router.route('/mentor/change/status/ticket').post(mentorChangeStatusTicket);
router.route('/mentor/delete/ticket/:id').delete(mentorDeleteTicket);

module.exports = router;
