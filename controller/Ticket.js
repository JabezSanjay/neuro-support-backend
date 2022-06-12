const Ticket = require('../models/Ticket');
const User = require('../models/User');
const BigPromise = require('../middleware/bigPromise');
const CustomError = require('../utils/customError');
const mailHelper = require('../utils/emailHelper');

exports.adminReadTickets = BigPromise(async (req, res, next) => {
  const tickets = await Ticket.find();
  res.status(200).json({
    success: true,
    data: tickets,
    message: 'Tickets fetched successfully',
  });
});

exports.mentorReadTickets = BigPromise(async (req, res, next) => {
  const tickets = await Ticket.find({
    mentor: { $in: req.user.socketId },
  });
  res.status(200).json({
    success: true,
    data: tickets,
    message: 'Tickets fetched successfully',
  });
});

exports.mentorCreateTicket = BigPromise(async (req, res, next) => {
  const { content, createdFor, course, mentor } = req.body;
  if (!content || !course || !createdFor) {
    return next(new CustomError('Title and course are required!', 400, res));
  }
  const ticket = await Ticket.create({
    content,
    createdBy: req.user.socketId.toString(),
    createdFor,
    course,
    status: 'pending',
    mentor,
  });

  const student = await User.findOne({ socketId: createdFor });
  student.mentorsId.push(mentor);
  await student.save();

  const mentorUser = await User.findOne({ socketId: mentor });
  mentorUser.studentsId.push(createdFor);
  await mentorUser.save();

  res.status(201).json({
    success: true,
    data: ticket,
    message: 'Ticket created successfully',
  });
});

exports.mentorChangeStatusTicket = BigPromise(async (req, res, next) => {
  let mentor = req.user.socketId;

  const { createdFor, status } = req.body;

  console.log(req.body);

  if (!createdFor || !status || !mentor) {
    return next(new CustomError('Mentor and status are required!', 400, res));
  }
  const ticket = await Ticket.findOne({
    createdFor,
    mentor,
  });
  if (!ticket) {
    return next(new CustomError('Ticket not found!', 404, res));
  }
  ticket.status = status;
  await ticket.save();
  res.status(200).json({
    success: true,
    data: ticket,
    message: 'Ticket updated successfully',
  });
});

exports.getTicketStatus = BigPromise(async (req, res, next) => {
  const mentor = req.user.socketId;
  const { createdFor } = req.body;
  if (!createdFor || !mentor) {
    return next(new CustomError('Mentor and status are required!', 400, res));
  }
  const ticket = await Ticket.find({
    createdFor,
    mentor,
  });
  if (!ticket) {
    return next(new CustomError('Ticket not found!', 404, res));
  }
  res.status(200).json({
    success: true,
    data: ticket,
    message: 'Ticket updated successfully',
  });
});

exports.mentorDeleteTicket = BigPromise(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new CustomError('Id is required!', 400, res));
  }
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    return next(new CustomError('Ticket not found!', 404, res));
  }
  if (ticket.mentor.toString() !== req.user._id.toString()) {
    return next(new CustomError('Unauthorized!', 401, res));
  }
  await ticket.remove();
  res.status(200).json({
    success: true,
    data: {},
    message: 'Ticket deleted successfully',
  });
});

exports.showMentorsForSpecificCourse = BigPromise(async (req, res, next) => {
  const { course } = req.body;
  const mentors = await User.find({
    role: 'mentor',
    course: { $in: course },
  });
  res.status(200).json({
    success: true,
    data: mentors,
    message: 'Mentors fetched successfully',
  });
});

exports.studentReadTickets = BigPromise(async (req, res, next) => {
  const tickets = await Ticket.find({
    createdFor: { $in: req.user.socketId },
  });
  res.status(200).json({
    success: true,
    data: tickets,
    message: 'Tickets fetched successfully',
  });
});

exports.askForUpdate = BigPromise(async (req, res, next) => {
  const { ticket } = req.body;

  if (!ticket) {
    return next(new CustomError('Ticket is required!', 400, res));
  }

  const student = await User.findOne({ socketId: ticket.createdFor });
  const mentor = await User.findOne({ socketId: ticket.mentor });
  const topMentor = await User.findOne({ socketId: ticket.createdBy });

  await mailHelper({
    email: mentor.email,
    subject: 'Password reset email',
    ccEmail: [student.email, topMentor.email],
  });

  res.status(200).json({
    success: true,
    message: 'Email sent successfully',
  });
});
