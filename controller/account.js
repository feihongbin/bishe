const accountModel = require('../model/account')

const client = require("../utils/sendPhoneMessage")
const { isMobile } = require("../utils/reg/regTest")
// 利用随机数生成验证码
const randomCode = () => {
  const maxNum = 9999
  const minNum = 1000
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
}

// 利用随机数创建账户tid
const randomId = () => {
  const maxNum = 99999999
  const minNum = 10000000
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
}


// 查询id防止创建账户的时候id重复
function find(id) {
  accountModel.find({ tid: id }, (err, res) => {
  })
}


// 新建用户
let newAccount = function (req, res, next) {
  let { phone, name, password } = req.body;
  let id = randomId()
  while (find(id)) {
    id = randomId()
  }
  const user = new accountModel({
    tid: id,
    password: password,
    name: name,
    tel: phone
  })

  user.save((err, result) => {
    if (err) {
      console.log("创建用户失败", err)
      return
    }
    res.send({
      code: 200,
      msg: 'success',
      data: '创建成功',
      id: id
    });
  })
}
// newAccount()
// find()
// console.log(randomId())

// 获取手机号
let getPhone = function (req, res, next) {
  let { account } = req.body
  if (isMobile(account)) {
    res.send({
      code: 200,
      phone: account
    })
  } else {
    accountModel.find({ tid: account }, (err, data) => {
      if (data.length > 0) {
        res.send({
          code: 200,
          phone: data[0].tel
        })
      }
    })
  }
}

// 发送验证码
let sendPhoneCode = function (req, res, next) {
  let { phone } = req.body;
  let code = randomCode().toString()
  client.sendPhoneCode(phone, code).then(
    (data) => {
      res.send({
        code: 200,
        msg: 'success',
        data: code
      });
    },
    (err) => {
      console.error("error", err);
    }
  );
}

// 修改密码
let changePsw = function (req, res, next) {
  let { account, newPassword } = req.body
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account }, { password: newPassword }, (err, data) => {
      res.send({
        code: 200,
        msg: '修改成功'
      })
    })
  } else {
    accountModel.updateOne({ tid: account }, { password: newPassword }, (err, data) => {
      res.send({
        code: 200,
        msg: '修改成功'
      })
    })
  }
}

// 用户登录
let login = function (req, res, next) {
  let { account, password } = req.body
  if (isMobile(account)) {
    accountModel.find({ tel: account }, (err, data) => {
      if (data.length > 0 && data[0].password === password && data[0].tel === account) {
        res.send({
          code: 200,
          msg: '登录成功',
          account: data[0].tid

        })
      } else {
        res.send({
          code: 400,
          msg: '账号密码输入错误',
        })
      }
    })
  } else {
    accountModel.find({ tid: account }, (err, data) => {
      if (data.length === 1 && data[0].password === password && data[0].tid === account) {
        res.send({
          code: 200,
          msg: '登录成功',
          account: account
        })
      } else {
        res.send({
          code: 400,
          msg: '账号密码输入错误',
        })
      }

    })
  }
  // res.send({
  //   code: 400,
  //   msg: '账号密码输入错误'
  // })

}

let getInfo = function (req, res, next) {
  let { account, isFriendId } = req.body
  if (isMobile(account)) {
    accountModel.find({ tel: account }, (err, data) => {
      if (data.length === 1 && data[0].tel === account) {
        let isFriend = false
        if (isFriendId) {
          isFriend = data[0].friendsList.some(item => item.friendId === isFriendId)
        }
        res.send({
          code: 200,
          msg: 'success',
          info: {
            tid: data[0].tid,
            gender: data[0].gender,
            birth: data[0].birth,
            location: data[0].location,
            native: data[0].native,
            career: data[0].career,
            avatar: data[0].avatar,
            signature: data[0].signature,
            name: data[0].name
          },
          isFriend: isFriend,
          groupList: data[0].groupList,
          friendsList: data[0].friendsList
        })
      } else {
        res.send({
          code: 400,
          msg: '出错了',
        })
      }
    })
  } else {
    accountModel.find({ tid: account }, (err, data) => {
      if (data.length === 1 && data[0].tid === account) {
        let isFriend = false
        if (isFriendId) {
          isFriend = data[0].friendsList.some(item => item.friendId === isFriendId)
        }
        res.send({
          code: 200,
          msg: 'success',
          info: {
            tid: data[0].tid,
            gender: data[0].gender,
            birth: data[0].birth,
            location: data[0].location,
            native: data[0].native,
            career: data[0].career,
            avatar: data[0].avatar,
            signature: data[0].signature,
            name: data[0].name
          },
          isFriend: isFriend,
          groupList: data[0].groupList,
          friendsList: data[0].friendsList

        })
      } else {
        res.send({
          code: 400,
          msg: '出错了',
        })
      }
    })
  }
}

let getBirth = function (req, res, next) {
  let { account } = req.query
  if (isMobile(account)) {
    accountModel.find({ tel: account }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success',
        birth: data[0].birth
      })
    })
  } else {
    accountModel.find({ tid: account }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success',
        birth: data[0].birth
      })
    })
  }

}

let setBirth = function (req, res, next) {
  let { account, birth } = req.body
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account }, { birth: birth }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  } else {
    accountModel.updateOne({ tid: account }, { birth: birth }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success',
      })
    })
  }
}

let setGender = function (req, res, next) {
  let { account, gender } = req.body
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account }, { gender: gender }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  } else {
    accountModel.updateOne({ tid: account }, { gender: gender }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success',
      })
    })
  }
}

let setCareer = function (req, res, next) {
  let { account, career } = req.body
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account }, { career: career }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  } else {
    accountModel.updateOne({ tid: account }, { career: career }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success',
      })
    })
  }
}

let setAvatar = function (req, res, next) {
  let { account, avatar } = req.body
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account }, { avatar: avatar }, (err, data) => {
      accountModel.find({ tel: account }, (err, data1) => {
        for (let item of data1[0].friendsList) {
          if (item.friendId) {
            accountModel.updateOne({ tel: item.friendId, "friendsList.friendId": account }, { $set: { "friendsList.$.avatar": avatar } }, (err, data) => {

            })
            accountModel.updateOne({ tel: item.friendId, "messageList.friendId": account }, { $set: { "messageList.$.avatar": avatar } }, (err, data) => {

            })
          }
        }
        res.send({
          code: 200,
          msg: 'success',
        })
      })
    })
  } else {
    accountModel.updateOne({ tid: account }, { avatar: avatar }, (err, data) => {

      accountModel.find({ tid: account }, (err, data1) => {
        for (let item of data1[0].friendsList) {
          if (item.friendId) {
            accountModel.updateOne({ tid: item.friendId, "friendsList.friendId": account }, { $set: { "friendsList.$.avatar": avatar } }, (err, data) => {

            })
            accountModel.updateOne({ tid: item.friendId, "messageList.friendId": account }, { $set: { "messageList.$.avatar": avatar } }, (err, data) => {

            })
          }
        }
        // for(let item of data1[0].messageList){
        //   if(item.friendId){
        //     accountModel.updateOne({ tid: item.friendId, "friendsList.friendId": account }, { $set: { "friendsList.$.avatar": avatar } }, (err, data) => {

        //     })
        //   }
        // }
        res.send({
          code: 200,
          msg: 'success',
        })
      })

    })

  }
}
let setName = function (req, res, next) {
  let { account, name } = req.body
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account }, { name: name }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  } else {
    accountModel.updateOne({ tid: account }, { name: name }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success',
      })
    })
  }
}

let setSignature = function (req, res, next) {
  let { account, signature } = req.body
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account }, { signature: signature }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  } else {
    accountModel.updateOne({ tid: account }, { signature: signature }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success',
      })
    })
  }
}
let getLocation = function (req, res, next) {
  let { account } = req.body
  if (isMobile(account)) {
    accountModel.find({ tel: account }, (err, data) => {
      if (data) {
        res.send({
          code: 200,
          msg: 'success',
          location: data[0].location
        })
      }
    })
  } else {
    accountModel.find({ tid: account }, (err, data) => {

      res.send({
        code: 200,
        msg: 'success',
        location: data[0].location
      })
    })
  }

}

let setLocation = function (req, res, next) {
  let { account, location } = req.body
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account }, { location: location }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  } else {
    accountModel.updateOne({ tid: account }, { location: location }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success',
      })
    })
  }
}

let getNative = function (req, res, next) {
  let { account } = req.body
  if (isMobile(account)) {
    accountModel.find({ tel: account }, (err, data) => {
      if (data) {
        res.send({
          code: 200,
          msg: 'success',
          native: data[0].native
        })
      }
    })
  } else {
    accountModel.find({ tid: account }, (err, data) => {

      res.send({
        code: 200,
        msg: 'success',
        native: data[0].native
      })
    })
  }

}


let setNative = function (req, res, next) {
  let { account, native } = req.body
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account }, { native: native }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  } else {
    accountModel.updateOne({ tid: account }, { native: native }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success',
      })
    })
  }
}


// 修改好友备注
let setNote = function (req, res, next) {
  let { account, note, friendId } = req.body
  if (isMobile(account)) {

    accountModel.updateOne({ tel: account, "friendsList.friendId": friendId }, { $set: { "friendsList.$.note": note, } }, (err, data) => {
      accountModel.updateOne({ tid: account, "messageList.friendId": friendId }, { $set: { "messageList.$.sender": note, } }, (err, data) => {
        res.send({
          code: 200,
          msg: 'success',
        })
      })
    })
  } else {
    accountModel.updateOne({ tid: account, "friendsList.friendId": friendId }, { $set: { "friendsList.$.note": note, } }, (err, data) => {

      accountModel.updateOne({ tid: account, "messageList.friendId": friendId }, { $set: { "messageList.$.sender": note, } }, (err, data) => {
        res.send({
          code: 200,
          msg: 'success',
        })
      })


    })
  }
}
// 添加用户时判断用户存不存在
let accountIsExist = function (req, res, next) {
  let { account } = req.body
  if (isMobile(account)) {
    accountModel.find({ tel: account }, (err, data) => {
      if (data.length > 0) {
        res.send({
          code: 200,
          msg: 'success'
        })
      } else {
        res.send({
          code: 400,
          msg: '账户不存在'
        })
      }
    })
  } else {
    accountModel.find({ tid: account }, (err, data) => {

      if (data.length > 0) {
        res.send({
          code: 200,
          msg: 'success'
        })
      } else {
        res.send({
          code: 400,
          msg: '账户不存在'
        })
      }
    })
  }
}

let sendAddFriendRequest = function (req, res, next) {
  let { account, friendId, message, note, group, status, isRead } = req.body
  let objectItem = {
    friendId: account,
    message: message,
    note: note,
    group: group,
    isRead: isRead,
    status: status
  }
  if (isMobile(account)) {
    accountModel.find({ tel: friendId, "toBeConfirmed.friendId": account }, (err, data) => {
      if (data.length > 0) {
        accountModel.updateOne({ tel: friendId }, { "$pull": { toBeConfirmed: { friendId: account } } }, (err) => {
          if (err) {
            console.log(err)
          }
        })
      }
      accountModel.updateOne({ tel: friendId }, { "$push": { toBeConfirmed: objectItem } }, (err) => {
        if (err) {
          console.log(err)
        }
        res.send({
          code: 200,
          msg: 'success'
        })
      })
    })

  } else {
    accountModel.find({ tid: friendId, "toBeConfirmed.friendId": account }, (err, data) => {
      if (data.length > 0) {
        accountModel.updateOne({ tid: friendId }, { "$pull": { toBeConfirmed: { friendId: account } } }, (err) => {
          if (err) {
            console.log(err)
          }
        })
      }

      accountModel.updateOne({ tid: friendId }, { "$push": { toBeConfirmed: objectItem } }, (err) => {
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
}

// 获取联系人好友列表
let getFriendList = function (req, res, next) {
  let { account } = req.body
  if (isMobile(account)) {
    accountModel.find({ tel: account }, (err, data) => {
      let groups = []
      for (let item of data[0].friendsList) {
        if (!groups.includes(item.group) && item.group !== '') {
          groups.push(item.group)
        }
      }
      groups = groups.map((item, index) => {
        return [item]
      })
      for (let item of data[0].friendsList) {
        groups.map((arr, i) => {
          if (item.group === arr[0] && item.friendId !== "") {
            arr.push({
              friendId: item.friendId,
              avatar: item.avatar,
              note: item.note,
              name: item.name,
            })


            return arr

          }
        })
      }
      res.send({
        code: 200,
        msg: 'success',
        friendList: data[0].friendsList.filter(item => item.friendId !== ""),
        friendByGroup: groups
      })
    })
  } else {
    accountModel.find({ tid: account }, (err, data) => {
      let groups = []
      for (let item of data[0].friendsList) {
        if (!groups.includes(item.group) && item.group !== '') {
          groups.push(item.group)
        }
      }
      groups = groups.map((item, index) => {
        return [item]
      })
      for (let item of data[0].friendsList) {
        groups.map((arr, i) => {
          if (item.group === arr[0] && item.friendId !== "") {
            arr.push({
              friendId: item.friendId,
              avatar: item.avatar,
              note: item.note,
              name: item.name,
            })
            return arr

          }
        })
      }
      res.send({
        code: 200,
        msg: 'success',
        friendList: data[0].friendsList.filter(item => item.friendId !== ""),
        friendByGroup: groups
      })
    })
  }
}

// 获取联系人群聊列表
let getGroupList = function (req, res, next) {
  let { account } = req.body
  if (isMobile(account)) {
    accountModel.find({ tel: account }, (err, data) => {
      let groups = [['我加入的群聊'], ['我管理的群聊'], ['我创建的群聊']]
      for (let item of data[0].groupList) {
        groups[item.permission].push(item)
      }

      res.send({
        code: 200,
        msg: 'success',
        groupByGroup: groups
      })
    })
  } else {
    accountModel.find({ tid: account }, (err, data) => {
      let groups = [['我加入的群聊'], ['我管理的群聊'], ['我创建的群聊']]
      for (let item of data[0].groupList) {
        groups[item.permission].push(item)
      }

      res.send({
        code: 200,
        msg: 'success',
        groupByGroup: groups
      })
    })
  }
}

// 获取首页聊天列表
let getHomeMessageList = function (req, res, next) {
  let { account } = req.body
  if (isMobile(account)) {
    accountModel.find({ tel: account }, null, { sort: { 'messageList.lastDate': -1 } }, (err, data) => {
      let message = data[0].messageList
      message.sort((obj1, obj2) => {
        return obj1.lastDate - obj2.lastDate > 0 ? -1 : 1
      })

      let result = []
      message.forEach(element => {
        if (element.isTop) {
          result.unshift(element)
        } else {
          result.push(element)
        }
      });
      res.send({
        code: 200,
        msg: 'success',
        messageList: result
      })
    })
  } else {
    accountModel.find({ tid: account }, (err, data) => {

      let message = data[0].messageList
      message.sort((obj1, obj2) => {
        return obj1.lastDate - obj2.lastDate > 0 ? -1 : 1
      })

      let result = []
      message.forEach(element => {
        if (element.isTop) {
          result.unshift(element)
        } else {
          result.push(element)
        }
      });
      res.send({
        code: 200,
        msg: 'success',
        messageList: result
      })
    })
  }
}

// 获取联系人的标徽
let getNewFriendCount = function (req, res, next) {
  let { account } = req.body
  if (isMobile(account)) {
    accountModel.find({ tel: account }, (err, data) => {
      if (data.length > 0) {
        let count = 0
        data.toBeConfirmed.forEach(item => {
          if (!item.isRead) {
            count++
          }
        })
        res.send({
          code: 200,
          msg: 'success',
          newFriendCount: count
        })
      }
    })
  } else {
    accountModel.find({ tid: account }, (err, data) => {
      if (data.length > 0) {
        let count = 0
        data[0].toBeConfirmed.forEach(item => {
          if (!item.isRead) {
            count++
          }
        })
        res.send({
          code: 200,
          msg: 'success',
          newFriendCount: count
        })
      }
    })
  }
}
// 获取新朋友的列表
let getNewFriendList = function (req, res, next) {
  let { account } = req.body
  if (isMobile(account)) {
    accountModel.find({ tel: account }, (err, data) => {
      if (data.length > 0) {
        res.send({
          code: 200,
          msg: 'success',
          newFriendList: data[0].toBeConfirmed
        })
      }
    })
  } else {
    accountModel.find({ tid: account }, (err, data) => {
      if (data.length > 0) {
        res.send({
          code: 200,
          msg: 'success',
          newFriendList: data[0].toBeConfirmed
        })
      }
    })
  }
}


// 获取群通知列表
let getNewGroupList = function (req, res, next) {
  let { account } = req.body
  if (isMobile(account)) {
    accountModel.find({ tel: account }, (err, data) => {
      if (data.length > 0) {
        res.send({
          code: 200,
          msg: 'success',
          newGroupList: data[0].groupRequest
        })
      }
    })
  } else {
    accountModel.find({ tid: account }, (err, data) => {
      console.log(data[0].groupRequest)
      if (data.length > 0) {
        res.send({
          code: 200,
          msg: 'success',
          newGroupList: data[0].groupRequest

        })
      }
    })
  }
}

let getNewFriendDetail = function (req, res, next) {
  let { friendId } = req.body
  if (isMobile(friendId)) {
    accountModel.find({ tel: friendId }, (err, data) => {
      if (data.length > 0) {
        res.send({
          code: 200,
          msg: 'success',
          newFriendDetail: data[0]
        })
      }
    })
  } else {
    accountModel.find({ tid: friendId }, (err, data) => {
      if (data.length > 0) {
        res.send({
          code: 200,
          msg: 'success',
          newFriendDetail: data[0]
        })
      }
    })
  }
}

// 获取好友分组
let getGroup = function (req, res, next) {
  let { account } = req.body

  if (isMobile(account)) {
    accountModel.find({ tel: account }, (err, data) => {
      let arr = []
      data[0].friendsList.forEach(item => {
        if (!arr.includes(item.group) && item.group !== '') {
          arr.push(item.group)
        }
      })
      res.send({
        code: 200,
        msg: 'success',
        groupList: arr
      })
    })


  } else {
    accountModel.find({ tid: account }, (err, data) => {
      let arr = []
      data[0].friendsList.forEach(item => {
        if (!arr.includes(item.group) && item.group !== '') {
          arr.push(item.group)
        }
      })
      res.send({
        code: 200,
        msg: 'success',
        groupList: arr
      })
    })
  }

}

// 将好友移至其他分组
let changeGroup = function (req, res, next) {
  let { account, newGroup, friendId } = req.body
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account, "friendsList.friendId": friendId }, { $set: { "friendsList.$.group": newGroup } }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  } else {
    accountModel.updateOne({ tid: account, "friendsList.friendId": friendId }, { $set: { "friendsList.$.group": newGroup } }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  }

}
// 编辑好友分组
let editGroup = function (req, res, next) {
  let { account, newGroupName, oldGroupName, isAdd, isDelete } = req.body
  if (isMobile(account)) {
    accountModel.find({ tel: account }, (err, data1) => {
      if (!isAdd) {
        data1[0].friendsList.forEach(item => {
          if (item.group === oldGroupName) {
            item.group = newGroupName
          }
        })
      } else {
        console.log(data1)

        data1[0].friendsList.push({
          friendId: '',
          avatar: '',
          name: '',
          note: '',
          group: newGroupName,
          receiveSetting: 1,
          messages: []
        })
      }

      accountModel.updateOne({ tel: account }, { friendsList: data1[0].friendsList }, (err, data) => {
        let arr = []
        data1[0].friendsList.forEach(item => {
          if (!arr.includes(item.group) && item.group !== '') {
            arr.push(item.group)
          }
        })
        res.send({
          code: 200,
          msg: 'success',
          groupList: arr
        })
      })
    })

  } else {
    accountModel.find({ tid: account }, (err, data1) => {
      if (isDelete) {
        data1[0].friendsList.forEach(item => {
          if (item.group === oldGroupName) {
            console.log(item.group)
            item.group = '我的好友'
          }
        })
      }
      if (!isAdd) {
        data1[0].friendsList.forEach(item => {
          if (item.group === oldGroupName) {
            item.group = newGroupName
          }
        })
      } else {

        data1[0].friendsList.push({
          friendId: '',
          avatar: '',
          name: '',
          note: '',
          group: newGroupName,
          receiveSetting: 1,
          messages: []
        })
      }

      accountModel.updateOne({ tid: account }, { friendsList: data1[0].friendsList }, (err, data) => {
        let arr = []
        data1[0].friendsList.forEach(item => {
          if (!arr.includes(item.group) && item.group !== '') {
            arr.push(item.group)
          }
        })
        res.send({
          code: 200,
          msg: 'success',
          groupList: arr
        })
      })
    })
  }

}


// 同意好友申请
let friendAgree = function (req, res, next) {
  let { account, friendId, note, group, status, isRead, avatar, name, receiveSetting, messages } = req.body

  // let friendInfo = {}
  // let myselfInfo = {}

  // accountModel.find({ tid: account }, (err, data_1) => {
  //   friendInfo = data_1
  // })

  let objectItem = {
    friendId: friendId,
    avatar: avatar,
    name: name,
    note: '',
    group: '我的好友',
    receiveSetting: receiveSetting,
    messages: messages
  }

  if (isMobile(account)) {
    accountModel.updateOne({ tel: account, "toBeConfirmed.friendId": friendId }, { $set: { "toBeConfirmed.$.status": status, "toBeConfirmed.$.isRead": isRead } }, (err, data) => { })

    accountModel.updateOne({ tel: account }, { "$push": { friendsList: objectItem } }, (err) => { })

    accountModel.find({ tel: account }, (err, data) => {

      let myItem = {
        friendId: account,
        avatar: data[0].avatar,
        name: data[0].name,
        note: '',
        group: '',
        receiveSetting: 1,
        messages: []
      }
      accountModel.updateOne({ tel: friendId }, { "$push": { friendsList: myItem } }, (err) => {
        res.send({
          code: 200,
          msg: 'success',
          item: myItem
        })
      })

    })



  } else {
    accountModel.updateOne({ tid: account, "toBeConfirmed.friendId": friendId }, { $set: { "toBeConfirmed.$.status": status, "toBeConfirmed.$.isRead": isRead } }, (err, data) => { })

    accountModel.updateOne({ tid: account }, { "$push": { friendsList: objectItem } }, (err) => { })



    // accountModel.find({ tid: account,'messageList.friendId': friendId} , (err,data2) => { 
    //   let messageItem = {
    //     account:account,
    //     sender
    //   }
    //   if (data2.length > 0) {
    //     accountModel.updateOne({ tid: account }, { "$pull": { messageList: { friendId: friendId } } }, (err) => {
    //       if (err) {
    //         console.log(err)
    //       }
    //     })
    //   }
    //   accountModel.updateOne({ tid: account }, { "$push": { messageList: objectItem } }, (err) => {
    //     if (err) {
    //       console.log(err)
    //     }
    //     res.send({
    //       code: 200,
    //       msg: 'success'
    //     })
    //   })

    // })

    accountModel.find({ tid: account }, (err, data) => {

      let myItem = {
        friendId: account,
        avatar: data[0].avatar,
        name: data[0].name,
        note: note,
        group: group,
        receiveSetting: 1,
        messages: []
      }
      accountModel.updateOne({ tid: friendId }, { "$push": { friendsList: myItem } }, (err) => {
        res.send({
          code: 200,
          msg: 'success',
          item: myItem
        })
      })

    })
  }
}

let getChatFriendInfo = function (req, res, next) {
  let { account, friendId } = req.body
  if (isMobile(account)) {
    accountModel.find({ tel: account, "friendsList.friendId": friendId }, { "friendsList": { $elemMatch: { "friendId": friendId } } }, (err, data) => {
      if (data.length > 0) {
        res.send({
          code: 200,
          msg: 'success',
          friendMessage: data[0].friendsList
        })
      }
    })
  } else {
    accountModel.find({ tid: account, "friendsList.friendId": friendId }, { "friendsList": { $elemMatch: { "friendId": friendId } } }, (err, data) => {
      if (data.length > 0) {
        res.send({
          code: 200,
          msg: 'success',
          friendMessage: data[0].friendsList
        })
      }
    })
  }
}

let sendMessage = function (req, res, next) {
  let { account, friendId, message } = req.body
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account, "friendsList.friendId": friendId }, { "$push": { "friendsList.$.messages": message } }, (err) => {
      // if (isMobile(friendId)) {
      //   accountModel.updateOne({ tel: friendId, "friendsList.friendId": account }, { "$push": { "friendsList.$.messages": message } }, (err) => {
      //     res.send({
      //       code: 200,
      //       msg: 'success'
      //     })
      //   })
      // } else {
      //   accountModel.updateOne({ tid: friendId, "friendsList.friendId": account }, { "$push": { "friendsList.$.messages": message } }, (err) => {
      //     res.send({
      //       code: 200,
      //       msg: 'success'
      //     })
      //   })
      // }
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  } else {
    accountModel.updateOne({ tid: account, "friendsList.friendId": friendId }, { "$push": { "friendsList.$.messages": message } }, (err) => {
      // if (isMobile(friendId)) {
      //   accountModel.updateOne({ tel: friendId, "friendsList.friendId": account }, { "$push": { "friendsList.$.messages": message } }, (err) => {
      //     res.send({
      //       code: 200,
      //       msg: 'success'
      //     })
      //   })
      // } else {
      //   accountModel.updateOne({ tid: friendId, "friendsList.friendId": account }, { "$push": { "friendsList.$.messages": message } }, (err) => {
      //     res.send({
      //       code: 200,
      //       msg: 'success'
      //     })
      //   })
      // }
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  }
}

// 每次聊天过后就保存首页的聊天messageList
let saveHomeMessageList = function (req, res, next) {
  let { account, friendId } = req.body
  let body = req.body
  let originNotRead = 0
  if (isMobile(account)) {
    accountModel.find({ tel: account, "messageList.friendId": friendId + '' }, (err, data) => {
      if (data.length > 0) {
        console.log('ax', data[0])
        accountModel.updateOne({ tel: account }, { "$pull": { messageList: { friendId: friendId + '' } } }, (err) => {
          if (err) {
            console.log(err)
          }
        })
      }
      accountModel.updateOne({ tel: account }, { "$push": { messageList: body } }, (err) => {
        if (err) {
          console.log(err)
        }
        res.send({
          code: 200,
          msg: 'success'
        })
      })
    })

  } else {
    accountModel.find({ tid: account, "messageList.friendId": friendId + '' }, (err, data) => {
      if (data.length > 0) {
        originNotRead = data[0].messageList.find(item => item.friendId == friendId + '').notRead + 1
        accountModel.updateOne({ tid: account }, { "$pull": { messageList: { friendId: friendId + '' } } }, (err) => {
          if (err) {
            console.log(err)
          }
        })
      } else {
        originNotRead = 1
      }

      accountModel.updateOne({ tid: account }, { "$push": { messageList: { ...body, notRead: originNotRead, friendId: friendId + '' } } }, (err) => {
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
}

// 更新群聊信息
let updateGroupList = function (req, res, next) {
  let { group } = req.body
  console.log('group', group)
  let objectItem = {
    group: group.groupId,
    groupName: group.groupName,
    permission: group.permission,
    receiveSetting: 1,
    groupAvatar: group.groupAvatar
  }
  if (isMobile(group.account)) {
    // accountModel.find({ tel: account, "groupList.group": data.groupId }, (err, data) => {
    //   if (data.length > 0) {
    //     // accountModel.updateOne({ tel: friendId }, { "$pull": { toBeConfirmed: { friendId: account } } }, (err) => {
    //     //   if (err) {
    //     //     console.log(err)
    //     //   }
    //     // })
    //   }

    // })
    accountModel.updateOne({ tel: group.account }, { "$push": { groupList: objectItem } }, (err) => {
      if (err) {
        console.log(err)
      }
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  } else {
    // accountModel.find({ tid: friendId, "toBeConfirmed.friendId": account }, (err, data) => {
    //   console.log('data', data)
    //   if (data.length > 0) {
    //     accountModel.updateOne({ tid: friendId }, { "$pull": { toBeConfirmed: { friendId: account } } }, (err) => {
    //       if (err) {
    //         console.log(err)
    //       }
    //     })
    //   }

    //   accountModel.updateOne({ tid: friendId }, { "$push": { toBeConfirmed: objectItem } }, (err) => {
    //     if (err) {
    //       console.log(err)
    //     }
    //     res.send({
    //       code: 200,
    //       msg: 'success'
    //     })
    //   })
    // })
    accountModel.updateOne({ tid: group.account }, { "$push": { groupList: objectItem } }, (err) => {
      if (err) {
        console.log(err)
      }
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  }
}
let deleteFriend = function (req, res, next) {
  let { account, friendId } = req.body
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account }, { "$pull": { friendsList: { friendId: friendId } } }, (err, data) => {
      accountModel.updateOne({ tel: friendId }, { "$pull": { friendsList: { friendId: account } } }, (err, data) => {
        console.log(data)
        res.send({
          code: 200,
          msg: '删除好友成功'
        })
      })
    })
  } else {
    accountModel.updateOne({ tid: account }, { "$pull": { friendsList: { friendId: friendId } } }, (err, data) => { })
    accountModel.updateOne({ tid: account }, { "$pull": { messageList: { friendId: friendId } } }, (err, data) => { })

    accountModel.updateOne({ tid: friendId }, { "$pull": { friendsList: { friendId: account } } }, (err, data) => { })
    accountModel.updateOne({ tid: friendId }, { "$pull": { messageList: { friendId: account } } }, (err, data) => { })
    console.log(data)
    res.send({
      code: 200,
      msg: '删除好友成功'
    })
  }
}

let clearNotRead = function (req, res, next) {
  let { account, friendId } = req.body
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account, "messageList.friendId": friendId }, { $set: { "messageList.$.notRead": 0 } }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success'
      })
    })

  } else {
    accountModel.updateOne({ tid: account, "messageList.friendId": friendId }, { $set: { "messageList.$.notRead": 0 } }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success'
      })
    })

  }
}

let setIsTop = function (req, res, next) {
  let { account, friendId, isTop } = req.body
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account, "messageList.friendId": friendId }, { $set: { "messageList.$.isTop": !isTop } }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success',
        isTop: !isTop
      })
    })

  } else {
    accountModel.updateOne({ tid: account, "messageList.friendId": friendId }, { $set: { "messageList.$.isTop": !isTop } }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success',
        isTop: !isTop
      })
    })

  }
}

let setNotRead = function (req, res, next) {
  let { account, friendId, notRead } = req.body
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account, "messageList.friendId": friendId }, { $set: { "messageList.$.notRead": notRead } }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success'
      })
    })

  } else {
    accountModel.updateOne({ tid: account, "messageList.friendId": friendId }, { $set: { "messageList.$.notRead": notRead } }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success'
      })
    })

  }
}

let deleteMessage = function (req, res, next) {
  let { account, friendId } = req.body
  if (isMobile(account)) {
    accountModel.find({ tel: account, "messageList.friendId": friendId }, (err, data) => {
      if (data.length > 0) {
        accountModel.updateOne({ tel: account }, { "$pull": { messageList: { friendId: friendId } } }, (err) => {
          res.send({
            code: 200,
            msg: 'success'
          })
        })
      }

    })
  } else {
    accountModel.find({ tid: account, "messageList.friendId": friendId }, (err, data) => {
      if (data.length > 0) {
        accountModel.updateOne({ tid: account }, { "$pull": { messageList: { friendId: friendId } } }, (err) => {
          res.send({
            code: 200,
            msg: 'success'
          })
        })
      }

    })
  }
}

let changeGroupRemind = function (req, res, next) {
  let { account, group, isRemind } = req.body

  if (isMobile(account)) {
    accountModel.updateOne({ tel: account, "groupList.group": group }, { $set: { "groupList.$.receiveSetting": isRemind } }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  } else {
    accountModel.updateOne({ tid: account, "groupList.group": group }, { $set: { "groupList.$.receiveSetting": isRemind } }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  }
}

let quitGroup = function (req, res, next) {
  let { account, group, managers, groupName, isDisband } = req.body

  accountModel.find({ tid: account }, (err, data) => {
    let acName = data[0].name
    let tipMsg = groupName && groupName.length > 0 ? '你被移除了群聊 ' + groupName : acName + '退出了群聊'
    if (isDisband) {
      tipMsg = groupName + ' 已被群主解散'
    }
    managers.length > 0 && managers.forEach(item => {
      let objItem = {
        account: item,
        friendId: '999',
        sender: '群通知',
        lastDate: Date.now(),
        isShow: false,
        lastContent: tipMsg,
        notRead: 1,
        isGroup: false,
        isTop: false,
        groupName: '',
        isRemind: true,
        avatar: 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/avatar/0CCA2198D8769118035B4CDC2755299E.jpg'
      }

      accountModel.find({ tid: item, "messageList.friendId": '999' }, (err, data) => {
        if (data.length > 0) {
          accountModel.updateOne({ tid: item }, { "$pull": { messageList: { friendId: '999' } } }, (err) => {
            if (err) {
              console.log(err)
            }
          })
        }

        accountModel.updateOne({ tid: item }, { "$push": { messageList: objItem } }, (err) => {
          if (err) {
            console.log(err)
          }

        })
      })
    })
  })



  if (isMobile(account)) {
    accountModel.updateOne({ tel: account }, { "$pull": { groupList: { group: Number.parseInt(group) } } }, (err) => {
      accountModel.updateOne({ tel: account }, { "$pull": { messageList: { friendId: group } } }, (err) => {
        res.send({
          code: 200,
          msg: '退群成功'
        })
      })
    })
  } else {
    accountModel.updateOne({ tid: account }, { "$pull": { groupList: { group: Number.parseInt(group) } } }, (err) => {
      accountModel.updateOne({ tid: account }, { "$pull": { messageList: { friendId: group } } }, (err) => {
        res.send({
          code: 200,
          msg: '退群成功',
          aa: Number.parseInt(group)
        })
      })
    })
  }
}

let groupRequest = function (req, res, next) {
  let { managers, account, obj } = req.body

  accountModel.find({ tid: account }, (err, data) => {
    let acName = data[0].name
    managers.forEach(item => {
      accountModel.find({ tid: item, "groupRequest.friendId": account }, (err, data) => {
        if (data.length > 0) {
          accountModel.updateOne({ tid: item }, { "$pull": { groupRequest: { friendId: account } } }, (err) => {
            if (err) {
              console.log(err)
            }
          })
        }

        accountModel.updateOne({ tid: item }, { "$push": { groupRequest: obj } }, (err) => {
          if (err) {
            console.log(err)
          }

        })
      })

      // 插入home message


      let objItem = {
        account: item,
        friendId: '999',
        sender: '群通知',
        lastDate: Date.now(),
        isShow: false,
        lastContent: acName + (obj.type === 0 ? ' 申请加入群聊' : ' 要求你加入群聊'),
        notRead: 1,
        isGroup: false,
        isTop: false,
        groupName: '',
        isRemind: true,
        avatar: 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/avatar/0CCA2198D8769118035B4CDC2755299E.jpg'
      }

      accountModel.find({ tid: item, "messageList.friendId": '999' }, (err, data) => {
        if (data.length > 0) {
          accountModel.updateOne({ tid: item }, { "$pull": { messageList: { friendId: '999' } } }, (err) => {
            if (err) {
              console.log(err)
            }
          })
        }

        accountModel.updateOne({ tid: item }, { "$push": { messageList: objItem } }, (err) => {
          if (err) {
            console.log(err)
          }

        })
      })
    })


  })
  res.send({
    code: 200,
    msg: 'success'
  })

}

let accountJoinGroup = function (req, res, next) {
  let { group, groupName, permission, groupAvatar, account } = req.body
  let objectItem = {
    group: Number.parseInt(group),
    groupName,
    permission,
    groupAvatar
  }
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account }, { "$push": { groupList: objectItem } }, (err) => {
      if (err) {
        console.log(err)
      }
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  } else {
    accountModel.updateOne({ tid: account }, { "$push": { groupList: objectItem } }, (err) => {
      if (err) {
        console.log(err)
      }
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  }
}

let updateGroupRequest = function (req, res, next) {
  let { account, friendId, groupId, status } = req.body

  if (isMobile(account)) {
    accountModel.updateOne({ tel: account, "groupRequest.friendId": friendId, "groupRequest.groupId": groupId }, { $set: { "groupRequest.$.status": status } }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  } else {
    accountModel.updateOne({ tid: account, "groupRequest.friendId": friendId, "groupRequest.groupId": groupId }, { $set: { "groupRequest.$.status": status } }, (err, data) => {
      console.log('1624', data, status)
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  }

}

let changePermission = function (req, res, next) {
  let { account, group, permission } = req.body
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account, "groupList.group": group }, { $set: { "groupList.$.permission": permission } }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  } else {
    accountModel.updateOne({ tid: account, "groupList.group": group }, { $set: { "groupList.$.permission": permission } }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success'
      })
    })
  }
}

let editGroupName = function (req, res, next) {
  let { account, groupId, name } = req.body
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account, "groupList.group": Number.parseInt(groupId) }, { $set: { "groupList.$.groupName": name } }, (err, data) => {
      accountModel.updateOne({ tel: account, "messageList.friendId": groupId }, { $set: { "messageList.$.groupName": name } }, (err, data) => {
        res.send({
          code: 200,
          msg: 'success'
        })
      })
    })
  } else {
    accountModel.updateOne({ tid: account, "groupList.group": Number.parseInt(groupId) }, { $set: { "groupList.$.groupName": name } }, (err, data) => {
      accountModel.updateOne({ tid: account, "messageList.friendId": groupId }, { $set: { "messageList.$.groupName": name } }, (err, data) => {
        res.send({
          code: 200,
          msg: 'success'
        })
      })


    })
  }

}

let search = function (req, res, next) {
  let { account } = req.body
  if (isMobile(account)) {
    accountModel.find({ tel: account }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success',
        friends: data[0].friendsList || []
      })
    })
  } else {
    accountModel.find({ tid: account }, (err, data) => {
      res.send({
        code: 200,
        msg: 'success',
        friends: data[0].friendsList || []
      })
    })
  }
}


let deleteGroup = function (req, res, next) {
  let { account, groupId } = req.body
  if (isMobile(account)) {
    accountModel.updateOne({ tel: account }, { "$pull": { groupList: { group: Number(groupId) } } }, (err) => {
      if (err) {
        console.log(err)
        return
      }
      res.send({
        code: 200,
        msg: 'success',
      })
    })
  } else {
    accountModel.updateOne({ tel: account }, { "$pull": { groupList: { group: Number(groupId) } } }, (err) => {
      if (err) {
        console.log(err)
        return
      }
      res.send({
        code: 200,
        msg: 'success',
      })
    })
  }
}
module.exports = {
  sendPhoneCode,
  newAccount,
  login,
  getInfo,
  getBirth,
  setBirth,
  setGender,
  getLocation,
  setLocation,
  getNative,
  setNative,
  accountIsExist,
  sendAddFriendRequest,
  getFriendList,
  getHomeMessageList,
  getNewFriendCount,
  getNewFriendList,
  getNewFriendDetail,
  friendAgree,
  getChatFriendInfo,
  sendMessage,
  saveHomeMessageList,
  updateGroupList,
  getGroupList,
  setSignature,
  setName,
  setCareer,
  setAvatar,
  editGroup,
  getGroup,
  setNote,
  changeGroup,
  deleteFriend,
  clearNotRead,
  setIsTop,
  setNotRead,
  deleteMessage,
  changeGroupRemind,
  getNewGroupList,
  quitGroup,
  groupRequest,
  accountJoinGroup,
  updateGroupRequest,
  getPhone,
  changePsw,
  changePermission,
  editGroupName,
  search,
  deleteGroup
}