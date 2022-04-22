var express = require('express');
var multer = require('multer');
var router = express.Router();
var path = require('path')
// 控制文件存储
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    console.log('user', req.body.user)
    console.log('222', path.join(__dirname, '../public/uploads'))

    // cb(null, path.join(__dirname, '../public/uploads'))
    cb(null, './public/uploads')

  },
  filename: function (req, file, cb) {
    let type = file.originalname.replace(/.+\./, ".")
    console.log(req.body)
    cb(null, file.fieldname + type)
  }
})

const upload = multer({ storage: storage })

router.post('/singleFile', upload.array('file', 10), function (req, res, next) {
  // req.file 是 `avatar` 文件的信息
  // req.body 将具有文本域数据，如果存在的话
  let data = req.files[0];
  res.send(data)

})


module.exports = router