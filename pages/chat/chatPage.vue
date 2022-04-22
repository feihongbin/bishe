<template>
	<view>
		<view class="chatTopBar">
			<uni-icons type="back" size="24"></uni-icons>
			<view class="chatFriendInfo">
				<text class="friendName">{{friendMessage.note || friendMessage.name}}</text>
				<text class="friendStatus">在线</text>
			</view>
			<uni-icons type="bars" size="24" @click="toFriendDetail"></uni-icons>
		</view>
		<scroll-view class="chatContent" scroll-y="true" scroll-with-animation="true" :scroll-into-view="scrollView">
			<view class="">
				<chat-message :avatar="friendMessage.avatar" :selfAvatar="avatar" :messageList="friendMessage.messages">
				</chat-message>
			</view>
			<view v-if="isShowBlank" class="blankContent"></view>
		</scroll-view>
		<send-message-input :friendId="friendId" @showBlank="showBlank"></send-message-input>
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
				name: '',
				friendId: '',
				message: [],
				isShowBlank: false,
				friendMessage: {},
				account: '',
				avatar: '',
				scrollView: '',
				uploadInfo:{
					progress:'',
					totalBytesExpectedToSend:''
				}
			};
		},
		onLoad: function(option) {
			this.name = option.name
			this.friendId = option.friendId
			this.getFriendInfo()
			this.getAccount()

			uni.$on('sendFile', ({
				file,
				tag
			}) => {
				this.sendFile(file, tag)
			})
			this.socket.on('news', (data) => {

				this.acceptMessage(data)
			})
			this.socket.on('refreshSingleNews', (data) => {
				this.getFriendInfo()
			})


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
						uni.request({
							url: that.$baseUrl + '/users/info',
							method: 'post',
							data: {
								account: res.data
							},
							success: (data) => {
								that.avatar = data.data.info.avatar
							}
						})
					}
				})
			},
			getFriendInfo() {
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/chat/friendInfo',
							method: 'post',
							data: {
								account: res.data,
								friendId: that.friendId
							},
							success: (data) => {
								console.log('friendInfo', data)
								that.friendMessage = data.data.friendMessage[0]
								that.$nextTick(function() {
									that.scrollView = 'msg' + that.friendMessage.messages[
										that.friendMessage.messages.length - 1].mid
								})

								console.log('friendInfo12312', that.scrollView, that.friendMessage)
							}
						})
					}
				})
			},
			toFriendDetail() {
				uni.navigateTo({
					url: `/pages/contacts/addFriend/searchResult?id=${this.friendId}&isFriend=true`
				})
			},
			async sendFile(file, tag) {
				console.log('file', file, 'tag', tag)
				let time = Date.now()
				this.friendMessage.messages.push({
					content: file,
					isRead: 0,
					mid: this.account + time,
					tag: tag,
					time: time,
					type: 'myself'
				})
				console.log(this.friendMessage)
				this.$nextTick(function() {
					this.scrollView = 'msg' + this.account + time
				})

				const uploadTask = uni.uploadFile({
					url: 'http://150.158.170.119:3000/upload/singleFile', //仅为示例，非真实的接口地址
					filePath: file,
					name: 'file',
					// formData: {
					// 	'user': this.account
					// },
					success: (uploadFileRes) => {
						let data = JSON.parse(uploadFileRes.data)
						let fileUrl = 'http://150.158.170.119:3000/uploads/' + data.filename
						console.log('data',data)
						let obj = {
							content: fileUrl,
							friendId: this.friendId,
							account: this.account,
							tag:data.mimetype
						}
						console.log('obj',obj)
						this.socket.emit('singleMessage', obj)
					}
				});

				uploadTask.onProgressUpdate((res) => {
					this.uploadInfo.progress = res.progress
					this.uploadInfo.totalBytesExpectedToSend = res.totalBytesExpectedToSend
					console.log('上传进度' + res.progress);
					console.log('已经上传的数据长度' + res.totalBytesSent);
					console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);

					// 测试条件，取消上传任务。
					// if (res.progress > 50) {
					// 	uploadTask.abort();
					// }
				});



			},
			saveHomeMessageList(obj) {
				uni.request({
					url: this.$baseUrl + '/users/chat/saveHomeMessageList',
					method: 'post',
					data: obj,
					success: (data) => {
						this.socket.emit('updateMessageList', {
							account: this.account,
							friendId: this.friendId
						})
					}
				})
			},
			acceptMessage(data) {
				// let that = this
				console.log('accc', this.account, data.account, 'friendIDdd', this.friendId, data.friendId)
				if (data.account === this.account && data.friendId === this.friendId) {
					console.log('执行了几次',data)
					let time1 = Date.now()
					let timeDiff = this.friendMessage.messages?.length > 0 ? time1 - this.friendMessage
						.messages[this.friendMessage.messages.length - 1].time : 999999999999999
					if (timeDiff > 1000 * 60 * 3) {

						this.friendMessage.messages.push({
							mid: this.account + time1,
							content: time1,
							type: 'time',
							tag: 'text',
							time: time1,
							isRead: 2
						})
						uni.request({
							url: this.$baseUrl + '/users/chat/sendMessage',
							method: 'post',
							data: {
								account: this.account,
								friendId: this.friendId,
								message: {
									mid: this.account + time1,
									content: time1,
									type: 'time',
									tag: 'text',
									time: time1,
									isRead: 2
								}
							},
							success: (data) => {
								// that.getUserInfo()
							}
						})
						uni.request({
							url: this.$baseUrl + '/users/chat/sendMessage',
							method: 'post',
							data: {
								account: this.friendId,
								friendId: this.account,
								message: {
									mid: this.account + time1,
									content: time1,
									type: 'time',
									tag: 'text',
									time: time1,
									isRead: 2
								}
							},
							success: (data) => {
								// that.getUserInfo()
							}
						})
					}
					let time = Date.now()
					// this.friendMessage.messages.push({
					// 	mid: this.account + time,
					// 	content: data.content,
					// 	type: 'myself',
					// 	tag: data.tag || 'text',
					// 	time: time,
					// 	isRead: 0
					// })
					// this.$nextTick(function(){
					// 	this.scrollView = 'msg' + this.account + time
					// })
					uni.request({
						url: this.$baseUrl + '/users/chat/sendMessage',
						method: 'post',
						data: {
							account: this.account,
							friendId: this.friendId,
							message: {
								mid: this.account + time,
								content: data.content,
								type: 'myself',
								tag: data.tag || 'text',
								time: time,
								isRead: 0
							}
						},
						success: () => {
							this.saveHomeMessageList({
								account: this.account,
								sender: this.friendMessage.note || this.friendMessage.name,
								friendId: this.friendMessage.friendId,
								lastDate: time,
								isShow: true,
								lastContent: data.tag ? '[图片]' : data.content,
								notRead: 9,
								isGroup: false,
								isTop: false,
								groupName: '',
								isRemind: true,
								avatar: this.friendMessage.avatar
							})
						}
					})

					uni.request({
						url: this.$baseUrl + '/users/chat/sendMessage',
						method: 'post',
						data: {
							account: this.friendId,
							friendId: this.account,
							message: {
								mid: this.account + time,
								content: data.content,
								type: 'others',
								tag: data.tag || 'text',
								time: time,
								isRead: 0
							}
						},
						success: () => {
							this.saveHomeMessageList({
								account: this.friendMessage.friendId,
								sender: this.friendMessage.note || this.friendMessage.name,
								friendId: this.account,
								lastDate: time,
								isShow: true,
								lastContent: data.tag ? '[图片]' : data.content,
								notRead: 9,
								isGroup: false,
								isTop: false,
								groupName: '',
								isRemind: true,
								avatar: this.friendMessage.avatar
							})
						}
					})
					this.getFriendInfo()
					console.log('emit1')
					this.socket.emit('updateSingleNews')




				}
			}
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
