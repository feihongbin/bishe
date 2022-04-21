const mongodb = require('../config/dbConfig')


const AccountSchema = mongodb.Schema({
  tid: String,
  password: String,
  name: String,
  gender: {
    type: String,
    default: '男'
  },
  birth: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  native: {
    type: String,
    default: ''
  },
  career: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  tel: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/avatar/1.jpeg'
  },
  signature: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'offLine'
  },
  friendsList: {
    type: Array,
    default: []
  },
  friendGroups: {
    type: Array,
    default: []
  },
  groupList: {
    type: Array,
    default: []
  },
  messageList: {
    type: Array,
    default: []
  },
  toBeConfirmed: {
    type: Array,
    default: []
  }
})

module.exports = mongodb.model('Account', AccountSchema, 'account')