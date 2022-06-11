const socketServer  = require("../index")

//socket.io
socketServer.use(async (socket, next) => {
  const uid = socket.handshake.auth.id
  const connectedUsers = socket.handshake.auth.connectedUsers
  if (!uid) {
    return next(new Error('invalid username'))
  }
  socket.uid = uid
  socket.connectedUsers = connectedUsers
  // console.log(uid, connectedUsers)
  //   let user = await User.findOneAndUpdate({ socketId: uid }, { isOnline: true })
  // user.isOnline = true

  // console.log(user, 'socket connected')
  next()
})

io.on('connection', async (socket) => {
  console.log(socket.uid, 'socket connected')

  socket.join(socket.uid)

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
  socket.on('retrieve-messages',({connectedUserId})=>{

     const messages = await Msg.find({
      commonId: {
        $in: [`${socket.uid}${connectedUserId}`, `${connectedUserId}${socket.uid}`],
      },
    })

    io.to(socket.uid).to(connectedUserId).emit('private message', messages)

  })
  socket.on('private-message', async ({  connectedUserId, content }) => {
    const message = await Msg.create({
      content: content,
      sender: senderId,
      reciever: recieverId,
      commonId: `${senderId}${recieverId}`,
    })

    const messages = await Msg.find({
      commonId: {
        $in: [`${socket.uid}${connectedUserId}`, `${connectedUserId}${socket.uid}`],
      },
    })
    io.to(socket.uid).to(connectedUserId).emit('private message', messages)
  })
})
