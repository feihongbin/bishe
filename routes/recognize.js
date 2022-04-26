var express = require('express');
var router = express.Router();
var fs = require('fs');

var AipSpeechClient = require("baidu-aip-sdk").speech;

var APP_ID = "26076545";
var API_KEY = "zh8ZAOHFP56lxpeYtAySyK2P";
var SECRET_KEY = "39q13ThrLZXZU3Ac2mXGCGY9ToHK2fzY";
var client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);

// let voice = fs.readFileSync(`./public/uploads/test.amr`);

// let voiceBuffer = new Buffer.from(voice);

// // // 识别本地文件
// // // client.recognize(voiceBuffer, 'amr', 16000).then(function (result) {
// // //   console.log('<recognize>: ' + JSON.stringify(result));
// // // }, function (err) {
// // //   console.log(err);
// // // });

// console.log(voice, voiceBuffer)
// // // // 识别本地文件，附带参数
// client.recognize(voiceBuffer, 'amr', 16000, { dev_pid: 1537 }).then(function (result) {
//   console.log('<recognize>: ' + JSON.stringify(result));
// }, function (err) {
//   console.log(err);
// });


router.post('/recognize', (req, res, next) => {
  let voice = fs.readFileSync(`./public/uploads/${req.body.filename}`);
  console.log(req.body.filename)

  let voiceBuffer = new Buffer.from(voice);
  console.log('识别', req.body.filename)
  console.log(voiceBuffer)

  client.recognize(voiceBuffer, 'amr', 16000, { dev_pid: 1537 }).then(function (result) {
    console.log('<recognize>: ' + JSON.stringify(result));
    res.send({
      code: 200,
      result: JSON.stringify(result)
    })
  }, function (err) {
    console.log(err);
  });
})
module.exports = router