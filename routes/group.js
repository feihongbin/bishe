var express = require('express');
var router = express.Router();
var group = require('../controller/group')

/* GET home page. */
router.post('/createGroup', group.newGroup);
router.post('/getGroupInfo', group.getGroupInfo);
router.post('/acceptGroupMessage', group.acceptGroupMessage);
router.post('/isExist', group.groupIsExist);
router.post('/editName', group.editName);
router.post('/myName', group.myName); // 修改群昵称

router.post('/quitGroup', group.quitGroup);
router.post('/groupAddAccount', group.groupAddAccount);





module.exports = router;
