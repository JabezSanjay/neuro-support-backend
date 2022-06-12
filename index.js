const app = require('./app');
const connectWithDb = require('./config/db');
// const { connectWithRedis } = require('./config/redis');
require('dotenv').config();
const Msg = require('./models/Message');

//Database connection
connectWithDb();

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

io.use(async (socket, next) => {
  const uid = socket.handshake.auth.id;
  if (!uid) {
    return next(new Error('invalid username'));
  }
  socket.uid = uid;
  console.log(uid);
  //   let user = await User.findOneAndUpdate({ socketId: uid }, { isOnline: true })
  // user.isOnline = true

  next();
});
io.on('connection', async (socket) => {
  console.log(socket.uid, 'socket connected');

  socket.join(socket.uid);

  //   socket.on('connect-student-mentor', async ({ studentId, mentorId }) => {
  //     //update mentorId to student
  //     await User.updateOne({ _id: studentId }, { $push: { mentorId: mentorId } })
  //     //update studentId to mentor
  //     await User.updateOne({ _id: mentorId }, { $push: { studentId: studentId } })
  //   })
  //   socket.on('disconnect-student-mentor', async ({ studentId, mentorId }) => {
  //     //update mentorId to student
  //     await User.updateOne({ _id: studentId }, { $push: { mentorId: mentorId } })
  //     await User.updateOne({ _id: studentId }, { $push: { mentorId: mentorId } })
  //   })
  socket.on('retrieve-messages', async ({ connectedUserId }) => {
    const messages = await Msg.find({
      commonId: {
        $in: [
          `${socket.uid}${connectedUserId}`,
          `${connectedUserId}${socket.uid}`,
        ],
      },
    });

    io.to(socket.uid).to(connectedUserId).emit('private-message', messages);
  });
  socket.on('private-message', async ({ connectedUserId, content }) => {
    console.log(connectedUserId, content);
    console.log(socket.uid, 'my id');
    console.log(socket.uid, 'my id');

    Msg.create({
      content: content,
      sender: socket.uid,
      reciever: connectedUserId,
      commonId: `${socket.uid}${connectedUserId}`,
    });

    const messages = await Msg.find({
      commonId: {
        $in: [
          `${socket.uid}${connectedUserId}`,
          `${connectedUserId}${socket.uid}`,
        ],
      },
    });
    console.log(socket.uid, 'emitted id');
    io.to(socket.uid).to(connectedUserId).emit('private-message', messages);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT || 3000}`);
});
