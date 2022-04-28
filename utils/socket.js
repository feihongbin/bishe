var path = require('path')
module.exports = function (io) {
  let socketList = {}
  let member = 0
  let i = 0
  // newGroupRequest

  io.sockets.on('connection', socket => {
    console.log('socket', socket.id)

    socket.on('singleMessage', data => {
      console.log('执行了几次', socket.id)
      // socket.broadcast.emit('news', '哈哈哈哈')
      // socket.broadcast.emit('news')
      socket.emit('news', { ...data, i: ++i, id: socket.id })

      // socket.emit('news', data)
      // console.log('zzzz', {
      //   ...data,
      //   friendId: data.account,
      //   account: data.friendId
      // })

    })
    // 刷新聊天数据
    socket.on('updateSingleNews', () => {
      socket.broadcast.emit('refreshSingleNews')

    })

    socket.on('newFriends', data => {

      socket.broadcast.emit('newFriendRequest', data)
    })
    // 刷新首页消息列表
    socket.on('updateMessageList', data => {
      socket.broadcast.emit('toUpdateMessageList')
      socket.emit('toUpdateMessageList')
    })

    socket.on('newGroupRequest', data => {
      socket.broadcast.emit('toUpdateMessageList')
      // socket.emit('toUpdateMessageList')
    })

    // 添加好友
    socket.on('agreeNewFriend', data => {
      console.log(data)
      socket.broadcast.emit('newFriendAgreed')
      socket.emit('newFriendAgreed')
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
      console.log(data)
      socket.emit('acceptGroupMessage', data)
    })

    // 发送群聊消息后更新群聊消息
    socket.on('updateGroupMessageList', data => {
      socket.broadcast.emit('getUpdatedGroupMessage', data)
      socket.emit('getUpdatedGroupMessage', data)

    })


    // 音视频聊天
    socket.on('vedioInvite', data => {
      console.log('asdas', data)
      socket.broadcast.emit('getVedioInvite', data)
    })

    // 接收与拒绝音视频聊天
    socket.on('rejustVedioInvite', () => {
      socket.broadcast.emit('rejust')
    })

    socket.on('acceptVedioInvite', () => {
      socket.broadcast.emit('accept')
    })
  })

}