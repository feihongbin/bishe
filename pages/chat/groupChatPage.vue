<template>
	<view>
		<view class="chatTopBar">
			<uni-icons type="back" size="24"></uni-icons>
			<view class="chatFriendInfo">
				<view class="friendNameBox"><text class="friendName">{{groupName}}</text><text>({{100}})</text></view>
				<text class="friendStatus">3人在线</text>
			</view>
			<uni-icons type="bars" size="24" @click="toSetGroup"></uni-icons>
		</view>
		<scroll-view class="chatContent" scroll-y="true" scroll-with-animation="true">
			<view class="">
				<chat-message :avatar="friendMessage.avatar" :messageList="friendMessage.messages"></chat-message>
			</view>
			<view v-if="isShowBlank" class="blankContent"></view>
		</scroll-view>
		<!-- <send-message-input :friendId="friendId" @showBlank="showBlank"></send-message-input> -->
	</view>
</template>

<script>
	import ChatMessage from '../../components/chatMessage.vue'
	import SendMessageInput from '../../components/sendMessageInput.vue'
	export default {
		components: {
			ChatMessage,
			SendMessageInput
		},
		data() {
			return {
				groupName: '',
				groupId: '',
				message: [{
						content: '昨天下午 6:31',
						type: 'time',
						tag: 'text'
					},

					{
						content: '你好啊',
						type: 'others',
						tag: 'text'
					},
					{
						content: 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/avatar/1.jpeg',
						type: 'myself',
						tag: 'image'
					}
				],
				isShowBlank: false,
				friendMessage: {},
				account: ''
			};
		},
		onLoad: function(option) {
			this.groupName = option.groupName
			this.groupId = option.groupId
			// this.acceptMessage()
			// this.getFriendInfo()
			// this.getAccount()


		},
		methods: {
			showBlank(val) {
				this.isShowBlank = val
			},
			getAccount() {
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						that.account = res.data
					}
				})
			},
			toSetGroup() {
				uni.navigateTo({
					url: `/pages/group/groupSetting?id=${this.groupId}`
				})
			},
			// getFriendInfo() {
			// 	let that = this
			// 	uni.getStorage({
			// 		key: 'accountId',
			// 		success: function(res) {
			// 			uni.request({
			// 				url: that.$baseUrl + '/users/chat/friendInfo',
			// 				method: 'post',
			// 				data: {
			// 					account: res.data,
			// 					friendId: that.friendId
			// 				},
			// 				success: (data) => {
			// 					console.log('friendInfo', data)
			// 					that.friendMessage = data.data.friendMessage[0]
			// 				}
			// 			})
			// 		}
			// 	})
			// },
			
			// saveHomeMessageList(obj) {
			// 	uni.request({
			// 		url: this.$baseUrl + '/users/chat/saveHomeMessageList',
			// 		method: 'post',
			// 		data: obj,
			// 		success: (data) => {
			// 			this.socket.emit('updateMessageList', {
			// 				account: this.account,
			// 				friendId: this.friendId
			// 			})
			// 		}
			// 	})
			// },
			// acceptMessage() {

			// 	this.socket.on('news', (data) => {
			// 		console.log('accc', this.account, data.account, 'friendIDdd', this.friendId, data.friendId)
			// 		console.log('if', data.account === this.account && data.friendId === this.friendId)
			// 		if (data.account === this.account && data.friendId === this.friendId || data.account === this
			// 			.friendId && data.friendId === this.account) {
			// 			let timeDiff = this.friendMessage.messages?.length > 0 ? Date.now() - this.friendMessage
			// 				.messages[this.friendMessage.messages.length - 1].time : 999999999999999
			// 			if (timeDiff > 1000 * 60 * 3) {

			// 				this.friendMessage.messages.push({
			// 					mid: this.account + Date.now(),
			// 					content: Date.now(),
			// 					type: 'time',
			// 					tag: 'text',
			// 					time: Date.now(),
			// 					isRead: 2
			// 				})
			// 				uni.request({
			// 					url: this.$baseUrl + '/users/chat/sendMessage',
			// 					method: 'post',
			// 					data: {
			// 						account: this.account,
			// 						friendId: this.friendId,
			// 						message: {
			// 							mid: this.account + Date.now(),
			// 							content: Date.now(),
			// 							type: 'time',
			// 							tag: 'text',
			// 							time: Date.now(),
			// 							isRead: 2
			// 						}
			// 					},
			// 					success: (data) => {
			// 						// that.getUserInfo()
			// 					}
			// 				})
			// 			}

			// 			this.friendMessage.messages.push({
			// 				mid: this.account + Date.now(),
			// 				content: data.content,
			// 				type: this.account === data.account ? 'myself' : 'others',
			// 				tag: 'text',
			// 				time: Date.now(),
			// 				isRead: 0
			// 			})
			// 			uni.request({
			// 				url: this.$baseUrl + '/users/chat/sendMessage',
			// 				method: 'post',
			// 				data: {
			// 					account: this.account,
			// 					friendId: this.friendId,
			// 					message: {
			// 						mid: this.account + Date.now(),
			// 						content: data.content,
			// 						type: this.account === data.account ? 'myself' : 'others',
			// 						tag: 'text',
			// 						time: Date.now(),
			// 						isRead: 0
			// 					}
			// 				},
			// 				success: (data) => {
			// 					// that.getUserInfo()
			// 				}
			// 			})
			// 			console.log(this.firendMessage)
			// 			this.saveHomeMessageList({
			// 				account: this.account,
			// 				sender: this.friendMessage.note || this.friendMessage.name,
			// 				friendId: this.friendMessage.friendId,
			// 				lastDate: Date.now(),
			// 				isShow: true,
			// 				lastContent: data.content,
			// 				notRead: 9,
			// 				isGroup: false,
			// 				isTop: false,
			// 				groupName: '',
			// 				isRemind: true,
			// 				avatar: this.friendMessage.avatar
			// 			})
			// 			this.saveHomeMessageList({
			// 				account: this.friendMessage.friendId,
			// 				sender: this.friendMessage.note || this.friendMessage.name,
			// 				friendId: this.account,
			// 				lastDate: Date.now(),
			// 				isShow: true,
			// 				lastContent: data.content,
			// 				notRead: 9,
			// 				isGroup: false,
			// 				isTop: false,
			// 				groupName: '',
			// 				isRemind: true,
			// 				avatar: this.friendMessage.avatar
			// 			})
			// 		}
			// 	})
			// }
		}
	}
</script>

<style lang="scss">
	.chatTopBar {
		background: #f8f8f8;
		position: fixed;
		z-index: 999;
		height: 150rpx;
		width: 100%;
		box-sizing: border-box;
		padding: 80rpx 20rpx 0;

		display: flex;
		justify-content: space-between;

		.chatFriendInfo {
			display: flex;
			flex-direction: column;
			align-items: center;
			
			.friendNameBox{
				display: flex;
				justify-content: center;
				.friendName {
					width: 50%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap
				}
			}
			
			
			.friendStatus {
				font-size: 24rpx;
			}
		}
	}

	.chatContent {
		position: relative;
		top: 0rpx;
		padding-top: 150rpx;
		padding-bottom: 120rpx;
		overflow: hidden;
		box-sizing: border-box;
		height: 100vh;
		background: #f8f8f8;
	}

	.blankContent {
		height: 278px;
	}
</style>
