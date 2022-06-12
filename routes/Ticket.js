const express = require('express');
const {
  adminReadTickets,
  mentorReadTickets,
  mentorCreateTicket,
  mentorChangeStatusTicket,
  mentorDeleteTicket,
  showMentorsForSpecificCourse,
  getTicketStatus,
  studentReadTickets,
  askForUpdate,
} = require('../controller/Ticket');
const { isLoggedIn, customRole } = require('../middleware/user');

const router = express.Router();

//Admin APIs
router
  .route('/admin/read/ticket')
  .get(isLoggedIn, customRole('mentor'), adminReadTickets);

//Mentor APIs
router
  .route('/mentor/read/ticket')
  .get(isLoggedIn, customRole('mentor'), mentorReadTickets);

router
  .route('/student/read/ticket')
  .get(isLoggedIn, customRole('student'), studentReadTickets);

router
  .route('/mentor/read/ticket/status')
  .post(isLoggedIn, customRole('mentor'), getTicketStatus);

router
  .route('/mentor/read/course')
  .post(isLoggedIn, customRole('mentor'), showMentorsForSpecificCourse);
router
  .route('/mentor/create/ticket')
  .post(isLoggedIn, customRole('mentor'), mentorCreateTicket);
router
  .route('/mentor/change/status/ticket')
  .post(isLoggedIn, customRole('mentor'), mentorChangeStatusTicket);
router
  .route('/mentor/delete/ticket/:id')
  .delete(isLoggedIn, customRole('mentor'), mentorDeleteTicket);
router
  .route('/student/ask/update')
  .post(isLoggedIn, customRole('student'), askForUpdate);

module.exports = router;
