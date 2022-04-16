// 引入mongoose
const mongoose = require('mongoose')

const dbUrl = 'mongodb://127.0.0.1:27017/graduationproject'

// 建立连接
mongoose.connect(dbUrl, { useNewUrlParser: true }, function (err) {
  if (err) {
    console.log('数据库连接失败', err)
    return
  }
  console.log('数据库连接成功')
})


module.exports = mongoose