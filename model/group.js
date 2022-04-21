const mongodb = require('../config/dbConfig')


const GroupSchema = mongodb.Schema({
  groupId: {
    type: String,
    default: ''
  },
  groupName: {
    type: String,
    default: ''
  },
  groupAvatar: {
    type: String,
    default: 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/avatar/1.jpeg'
  },
  createDate: String,
  announcement: {
    type: String,
    default: ''
  },
  members: {
    type: Array,
    default: []
  },
  messageList: {
    type: Array,
    default: []
  },

})

module.exports = mongodb.model('Group', GroupSchema, 'group')