// 引入mongoose
const mongoose = require('mongoose')

// 建立连接
mongoose.connect('mongodb://127.0.0.1:27017/graduationproject')

// 操作集合，定义Schema
const UserSchema = mongoose.Schema({
  age: Number,
  name: String
})

// 创建model
const User = mongoose.model('accounts', UserSchema)

// 查询数据
User.find({}, function (err, doc) {
  if (err) {
    console.log('出错了', err)
    return
  }
  console.log(doc)
})


// 增加数据
// 通过实例化Model创建增加的数据

// const u = new User({
//   name: '张三',
//   age: 23
// })
// u.save((err) => {
//   if (err) {
//     console.log(err)
//     return
//   }
//   console.log('添加成功')
// })   // 执行添加操作


// 更新数据
// User.updateOne({ "_id": "62441cc1219b58300425dedd" }, { "age": 30 }, function (err, doc) {
//   if (err) {
//     console.log("出错了", err)
//     return
//   }
//   console.log('修改成功', doc)
// })

// 删除数据

User.deleteOne({ "_id": "62441cc1219b58300425dedd" }, function (err, doc) {
  if (err) {
    console.log("出错了", err)
    return
  }
  console.log('删除成功', doc)
})