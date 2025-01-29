const onlineUsers = {};

function handleSocket(io) {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user joining
    socket.on('join', (username) => {
      onlineUsers[socket.id] = username;
      io.emit('onlineUsers', Object.values(onlineUsers));
    });

    // Handle sending messages
    socket.on('sendMessage', (message) => {
      const username = onlineUsers[socket.id] || 'Unknown';
      io.emit('receiveMessage', {
        text: message,
        sender: username,
        timestamp: Date.now()
      });
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      delete onlineUsers[socket.id];
      io.emit('onlineUsers', Object.values(onlineUsers));
      console.log('User disconnected:', socket.id);
    });
  });
}

module.exports = { handleSocket };