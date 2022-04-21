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
      data: '创建成功'
    });
  })
}
// newAccount()
// find()
// console.log(randomId())

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

// 用户登录
let login = function (req, res, next) {
  // let { account, password } = req.body
  // if (isMobile(account)) {
  //   accountModel.find({ tel: account }, (err, data) => {
  //     if (data.length === 1 && data[0].password === password && data[0].tel === account) {
  res.send({
    code: 200,
    msg: '登录成功',
    account: account

  })
  //     } else {
  //       res.send({
  //         code: 400,
  //         msg: '账号密码输入错误',
  //       })
  //     }
  //   })
  // } else {
  //   accountModel.find({ tid: account }, (err, data) => {
  //     if (data.length === 1 && data[0].password === password && data[0].tid === account) {
  //       res.send({
  //         code: 200,
  //         msg: '登录成功',
  //         account: account
  //       })
  //     } else {
  //       res.send({
  //         code: 400,
  //         msg: '账号密码输入错误',
  //       })
  //     }

  //   })
  // }
  // res.send({
  //   code: 200,
  //   msg: '账号密码输入错误'
  // })

}

let getInfo = function (req, res, next) {
  let { account } = req.body
  if (isMobile(account)) {
    accountModel.find({ tel: account }, (err, data) => {
      if (data.length === 1 && data[0].tel === account) {
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
          }

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
          }
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
        if (!groups.includes(item.group)) {
          groups.push(item.group)
        }
      }
      groups = groups.map((item, index) => {
        return [item]
      })
      for (let item of data[0].friendsList) {
        groups.map((arr, i) => {
          if (item.group === arr[0]) {
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
        friendList: data[0].friendsList,
        friendByGroup: groups
      })
    })
  } else {
    accountModel.find({ tid: account }, (err, data) => {
      let groups = []
      for (let item of data[0].friendsList) {
        if (!groups.includes(item.group)) {
          groups.push(item.group)
        }
      }
      groups = groups.map((item, index) => {
        return [item]
      })
      for (let item of data[0].friendsList) {
        groups.map((arr, i) => {
          if (item.group === arr[0]) {
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
        friendList: data[0].friendsList,
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
        return obj1.lastDate > obj2.lastDate ? 1 : -1
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
        return obj1.lastDate > obj2.lastDate ? 1 : -1
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

// 同意好友申请
let friendAgree = function (req, res, next) {
  let { account, friendId, note, group, status, isRead, avatar, name, receiveSetting, messages } = req.body
  let objectItem = {
    friendId: friendId,
    avatar: avatar,
    name: name,
    note: note,
    group: group,
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

    accountModel.find({ tid: account }, (err, data) => {

      let myItem = {
        friendId: account,
        avatar: data[0].avatar,
        name: data[0].name,
        note: '',
        group: '',
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

  if (isMobile(account)) {
    accountModel.find({ tel: account, "messageList.friendId": friendId }, (err, data) => {
      if (data.length > 0) {
        accountModel.updateOne({ tel: account }, { "$pull": { messageList: { friendId: friendId } } }, (err) => {
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
    accountModel.find({ tid: account, "messageList.friendId": friendId }, (err, data) => {
      if (data.length > 0) {
        accountModel.updateOne({ tid: account }, { "$pull": { messageList: { friendId: friendId } } }, (err) => {
          if (err) {
            console.log(err)
          }
        })
      }

      accountModel.updateOne({ tid: account }, { "$push": { messageList: body } }, (err) => {
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

let updateGroupList = function (req, res, next) {
  let { group } = req.body
  console.log('group', group)
  let objectItem = {
    group: group.groupId,
    groupName: group.groupName,
    permission: group.permission,
    receiveSetting: 1,
    groupAvatar: 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/avatar/timg%20%281%29.jpg'
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
  getGroupList
}