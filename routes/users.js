var express = require('express');
var router = express.Router();
const account = require('../controller/account')


// router.post('/login', account.login);

router.post('/registerCode', account.sendPhoneCode);
router.post('/register', account.newAccount);
router.post('/login', account.login);
router.post('/info', account.getInfo);
router.get('/info/birth', account.getBirth);
router.post('/info/setBirth', account.setBirth);
router.post('/info/setGender', account.setGender);
router.post('/info/getLocation', account.getLocation);
router.post('/info/setLocation', account.setLocation);
router.post('/info/getNative', account.getNative);
router.post('/info/setNative', account.setNative);
router.post('/info/setName', account.setName);
router.post('/info/setSignature', account.setSignature);
router.post('/info/setCareer', account.setCareer);
router.post('/info/setAvatar', account.setAvatar);





router.post('/isExist', account.accountIsExist);
router.post('/addFriend/sendRequest', account.sendAddFriendRequest);
router.post('/addFriend/agree', account.friendAgree);

router.post('/home/messageList', account.getHomeMessageList);
router.post('/home/newFriendCount', account.getNewFriendCount);
router.post('/home/newFriendList', account.getNewFriendList);
router.post('/home/newFriendDetail', account.getNewFriendDetail);
router.post('/contacts/getFriendList', account.getFriendList);
router.post('/contacts/getGroupList', account.getGroupList);

router.post('/contacts/updateGroupList', account.updateGroupList);


router.post('/chat/friendInfo', account.getChatFriendInfo);
router.post('/chat/sendMessage', account.sendMessage);
router.post('/chat/saveHomeMessageList', account.saveHomeMessageList);


module.exports = router;
