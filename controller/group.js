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
      groupNote: item.name,
      isAlive: true

    }
  })

  arr.push({
    member: leader.account,
    permission: 2,
    groupNote: leader.name,
    avatar: leader.avatar,
    isAlive: true
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
      groupName: groupName.join('、'),
      groupAvatar: 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/avatar/1.jpeg'
    });
  })
}

let getGroupInfo = function (req, res, next) {
  let { groupId } = req.body
  groupModel.find({ groupId: groupId }, (err, data) => {
    let m = data[0].members
    let ml = data[0].messageList
    let map = new Map(m.map(item => [item.member, [item.avatar, item.groupNote]]))

    let newMessageList = ml.map(item => {
      if (item.tag !== 'time' && item.tag !== 'welcome') {
        return {
          ...item,
          avatar: map.get(item.sender)[0],
          name: map.get(item.sender)[1]
        }
      } else {
        return item
      }
    })
    let members = data[0].members.filter(item => item.isAlive)
    data[0].members = members
    console.log(members)
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


// 添加群聊时判断用户存不存在
let groupIsExist = function (req, res, next) {
  let { account } = req.body

  groupModel.find({ groupId: account }, (err, data) => {
    if (data.length > 0) {
      res.send({
        code: 200,
        msg: 'success'
      })
    } else {
      res.send({
        code: 400,
        msg: '群聊不存在'
      })
    }
  })

}

// 修改群聊名称
let editName = function (req, res, next) {
  let { groupId, name } = req.body
  console.log(groupId, name)
  groupModel.updateOne({ groupId: groupId }, { groupName: name }, (err) => {
    if (err) {
      console.log(err)
    }
    res.send({
      code: 200,
      msg: 'success'
    })
  })
}

let myName = function (req, res, next) {
  let { groupId, name, account } = req.body

  groupModel.updateOne({ groupId: groupId, "members.member": account }, { $set: { "members.$.groupNote": name, } }, (err, data) => {
    res.send({
      code: 200,
      msg: 'success'
    })
  })
}
let quitGroup = function (req, res, next) {
  let { groupId, account } = req.body

  groupModel.updateOne({ groupId: groupId, "members.member": account }, { "$set": { 'members.$.isAlive': false } }, (err) => {
    res.send({
      code: 200,
      msg: '退群成功'
    })
  })
}


// 添加成员

let groupAddAccount = function (req, res, next) {
  let { groupId, member, permission, groupNote, isAlive, avatar } = req.body

  let objectItem = {
    member,
    permission,
    groupNote,
    isAlive,
    avatar
  }

  groupModel.find({ groupId: groupId, "members.member": member }, (err, data) => {
    if (data.length > 0) {
      groupModel.updateOne({ groupId: groupId }, { "$pull": { members: { member: member } } }, (err) => {
        if (err) {
          console.log(err)
        }
      })
    }

    groupModel.updateOne({ groupId: groupId }, { "$push": { members: objectItem } }, (err) => {
      if (err) {
        console.log(err)
      }
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  })
}
let changePermission = function (req, res, next) {
  let { groupId, account, permission } = req.body

  groupModel.updateOne({ groupId: groupId, "members.member": account }, { $set: { "members.$.permission": permission, } }, (err, data) => {
    res.send({
      code: 200,
      msg: 'success'
    })
  })
}

module.exports = {
  newGroup,
  getGroupInfo,
  acceptGroupMessage,
  groupIsExist,
  editName,
  myName,
  quitGroup,
  groupAddAccount,
  changePermission
}