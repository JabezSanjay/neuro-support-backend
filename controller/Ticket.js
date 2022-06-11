const Ticket = require('../models/Ticket');
const BigPromise = require('../middleware/bigPromise');
const CustomError = require('../utils/customError');

exports.adminReadTickets = BigPromise(async (req, res, next) => {
  const tickets = await Ticket.find();
  res.status(200).json({
    success: true,
    data: tickets,
    message: 'Tickets fetched successfully',
  });
});

exports.mentorReadTickets = BigPromise(async (req, res, next) => {
  const tickets = await Ticket.find({ mentor: req.user._id });
  res.status(200).json({
    success: true,
    data: tickets,
    message: 'Tickets fetched successfully',
  });
});

exports.mentorCreateTickets = BigPromise(async (req, res, next) => {
  const { content, createdBy, createdFor, course } = req.body;
  if (!title || !description || !course) {
    return next(
      new CustomError('Title, description and course are required!', 400, res)
    );
  }
  const ticket = await Ticket.create({
    content,
    createdBy,
    createdFor,
    course,
    status: 'pending',
  });
  res.status(201).json({
    success: true,
    data: ticket,
    message: 'Ticket created successfully',
  });
});

exports.mentorChangeStatusTicket = BigPromise(async (req, res, next) => {
  const { id, status } = req.body;
  if (!id || !status) {
    return next(new CustomError('Id and status are required!', 400, res));
  }
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    return next(new CustomError('Ticket not found!', 404, res));
  }
  if (ticket.mentor.toString() !== req.user._id.toString()) {
    return next(new CustomError('Unauthorized!', 401, res));
  }
  ticket.status = status;
  await ticket.save();
  res.status(200).json({
    success: true,
    data: ticket,
    message: 'Ticket updated successfully',
  });
});

exports.mentorDeleteTicket = BigPromise(async (req, res, next) => {
  const { id } = req.body;
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
