module.exports = function (io) {
  let socketList = {}
  let member = 0

  io.sockets.on('connection', socket => {
    console.log('socket')
    socket.on('singleMessage', data => {
      console.log(data)
      // socket.broadcast.emit('news', '哈哈哈哈')
      socket.broadcast.emit('news', data)
      socket.emit('news', data)
      console.log(data)

      // socket.emit('news', data)
      // console.log('zzzz', {
      //   ...data,
      //   friendId: data.account,
      //   account: data.friendId
      // })

    })

    socket.on('newFriends', data => {
      console.log(data)

      socket.broadcast.emit('newFriendRequest', data)
    })
    // 刷新首页消息列表
    socket.on('updateMessageList', data => {
      socket.broadcast.emit('toUpdateMessageList')
      socket.emit('toUpdateMessageList')
    })

    // 创建群聊
    socket.on('createdNewGroup', data => {
      let arr = data.members.map((item, index) => {
        return {
          account: item.friendId,
          avatar: item.avatar,
          permission: 0
        }
      })
      arr.push({
        account: data.leader.account,
        avatar: data.leader.avatar,
        permission: 2
      })

      let obj = { members: arr, groupId: data.groupId, groupName: data.groupName }

      // socket.broadcast.emit('updateGroupList', obj)
      socket.emit('updateGroupList', obj)
    })

    // 发送群聊消息
    socket.on('groupMessage', data => {

      socket.emit('acceptGroupMessage', data)
    })

    // 发送群聊消息后更新群聊消息
    socket.on('updateGroupMessageList', data => {
      socket.broadcast.emit('getUpdatedGroupMessage', data)
      socket.emit('getUpdatedGroupMessage', data)

    })

  })

}