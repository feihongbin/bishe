const groupModel = require('../model/group')



// 利用随机数创建账户tid
const randomId = () => {
  const maxNum = 999999999
  const minNum = 100000000
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
}


// 查询id防止创建账户的时候id重复
function find(id) {
  groupModel.find({ groupId: id }, (err, res) => { })
}


// 新建群聊
let newGroup = function (req, res, next) {

  let id = randomId()
  while (find(id)) {
    id = randomId()
  }
  let { leader, members } = req.body;
  console.log(leader, members)
  let groupName = [leader.name]
  let arr = members.map((item, index) => {
    groupName.push(item.name)
    return {
      member: item.friendId,
      avatar: item.avatar,
      permission: 0,
      groupNote: item.name
    }
  })

  arr.push({
    member: leader.account,
    permission: 2,
    groupNote: leader.name,
    avatar: leader.avatar
  })
  const group = new groupModel({
    groupId: id,
    groupName: groupName.length > 3 ? groupName.slice(0, 3).join('、') : groupName.join('、'),
    createDate: Date.now(),
    announcement: '群公告',
    members: arr
  })

  group.save((err, result) => {
    if (err) {
      console.log("创建群聊失败", err)
      return
    }
    res.send({
      code: 200,
      msg: 'success',
      groupId: id,
      groupName: groupName.join('、')
    });
  })
}

let getGroupInfo = function (req, res, next) {
  let { groupId } = req.body
  console.log('groupId', groupId)
  groupModel.find({ groupId: groupId }, (err, data) => {
    let m = data[0].members
    let ml = data[0].messageList
    let map = new Map(m.map(item => [item.member, [item.avatar, item.groupNote]]))

    let newMessageList = ml.map(item => {
      if (item.tag !== 'time') {
        return {
          ...item,
          avatar: map.get(item.sender)[0],
          name: map.get(item.sender)[1]
        }
      } else {
        return item
      }
    })
    console.log('map', map)
    console.log('messageList', newMessageList)
    res.send({
      code: 200,
      msg: 'success',
      groupInfo: data[0],
      messageList: newMessageList
    });
  })
}

let acceptGroupMessage = function (req, res, next) {
  let { groupId, message } = req.body
  console.log(groupId, message)
  groupModel.updateOne({ groupId: groupId }, { "$push": { messageList: message } }, (err) => {
    if (err) {
      console.log(err)
    }
    res.send({
      code: 200,
      msg: 'success'
    })
  })
}

module.exports = {
  newGroup,
  getGroupInfo,
  acceptGroupMessage
}