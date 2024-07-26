const jwt = require('jsonwebtoken');
const config = require('./config');

function authenticateSocket(socket, next) {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: Token not provided'));
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
    socket.user = decoded;
    next();
  });
}

function setupSocketHandlers(io) {
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    // Join a room for the user's ID to allow direct messaging
    socket.join(socket.user.id);

    socket.on('send_message', async (data) => {
      // TODO: Implement message sending logic
      // This should create a new message in the database and emit to the recipient
    });

    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.user.id} joined room ${roomId}`);
    });

    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.user.id} left room ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });
}

module.exports = { setupSocketHandlers };