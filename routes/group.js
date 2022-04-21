var express = require('express');
var router = express.Router();
var group = require('../controller/group')

/* GET home page. */
router.post('/createGroup', group.newGroup);
router.post('/getGroupInfo', group.getGroupInfo);
router.post('/acceptGroupMessage', group.acceptGroupMessage);



module.exports = router;
