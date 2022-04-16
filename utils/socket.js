module.exports = function (io) {
  let socketList = {}
  let member = 0

  io.sockets.on('connection', socket => {
    console.log('socket')
    socket.on('message', data => {
      console.log(data)
      // socket.broadcast.emit('news', '哈哈哈哈')
      socket.emit('news', '哈哈哈哈')
      console.log('zzzz')

    })

    socket.on('newFriends', data => {
      console.log(data)

      socket.broadcast.emit('newFriendRequest', data)
    })
  })

}