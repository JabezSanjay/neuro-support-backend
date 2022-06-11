const app = require('./app')
const connectWithDb = require('./config/db')
// const { connectWithRedis } = require('./config/redis');
require('dotenv').config()
const Msg = require('./models/Message')

//Database connection
connectWithDb()

const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
})

io.use(async (socket, next) => {
  const uid = socket.handshake.auth.id
  if (!uid) {
    return next(new Error('invalid username'))
  }
  socket.uid = uid
  console.log(uid, 'socket connectedx')

  next()
})

io.on('connection', async (socket) => {
  socket.join(socket.uid)

  socket.on('retrieve-messages', async ({ connectedUserId }) => {
    const messages = await Msg.find({
      commonId: {
        $in: [
          `${socket.uid}${connectedUserId}`,
          `${connectedUserId}${socket.uid}`,
        ],
      },
    })
    console.log(socket.uid, connectedUserId, 'my selected id')
    io.to(socket.uid).to(connectedUserId).emit('private message', messages)
  })
  socket.on('private-message', async ({ connectedUserId, content }) => {
    console.log(connectedUserId, content)
    console.log(socket.uid, 'my id')
    console.log(socket.uid, 'my id')

    Msg.create({
      content: content,
      sender: socket.uid,
      reciever: connectedUserId,
      commonId: `${socket.uid}${connectedUserId}`,
    })

    const messages = await Msg.find({
      commonId: {
        $in: [
          `${socket.uid}${connectedUserId}`,
          `${connectedUserId}${socket.uid}`,
        ],
      },
    })
    console.log(socket.uid, 'emitted id')
    io.to(socket.uid).to(connectedUserId).emit('private message', messages)
  })
})

server.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT || 3000}`)
})
