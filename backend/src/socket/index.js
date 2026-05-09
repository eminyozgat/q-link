function initSocket(io) {
  io.on('connection', (socket) => {
    // İstemci hangi odaya katılacağını bildirir: 'kitchen', 'waiter', 'table_7' vb.
    socket.on('join', (room) => {
      socket.join(String(room));
    });

    socket.on('leave', (room) => {
      socket.leave(String(room));
    });
  });
}

module.exports = { initSocket };
