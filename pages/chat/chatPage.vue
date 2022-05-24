<template>
	<view class="container">
		<view class="chatTopBar">
			<uni-icons type="back" @click="goBack" size="24"></uni-icons>
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
		<!-- <view class="tooltip" :style="{top:tooltipy+'px',left:tooltipx+'px'}">
			转文本
		</view> -->
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
				myFriendInfo:{},
				account: '',
				avatar: '',
				scrollView: '',
				uploadInfo: {
					progress: '',
					totalBytesExpectedToSend: ''
				},
				scrollTag:true,
				mid:''
				// tooltipx: 200,
				// tooltipy: 100,
				// tooltipShow:
			};
		},
		onLoad: function(option) {
			this.name = option.name
			this.friendId = option.friendId
			if(option.mid){
				this.scrollTag = false
				this.mid = option.mid
			}
			this.getFriendInfo()
			this.getAccount()
			this.getFriendAccount()
			this.clearHomeNotRead()
			
			

			uni.$on('sendFile', ({
				file,
				tag,
				timeLong
			}) => {
				this.sendFile(file, tag, timeLong)
			})
			this.socket.on('news', async (data) => {

				await this.acceptMessage(data)
				// console.log(2321)
				console.log('emit1')
				this.socket.emit('updateSingleNews')

				this.getFriendInfo()
			})
			this.socket.on('refreshSingleNews', (data) => {
				this.getFriendInfo()
			})
			uni.$on('refreshChatPage',()=>{
				this.getFriendInfo()
			})


		},
		async onUnload() {
			await this.clearHomeNotRead()
			uni.$emit('refreshHomeMessage')
			this.socket.removeAllListeners('news')
			uni.$off('sendFile')
		},
		methods: {
			goBack(){
				uni.navigateBack({
					delta:1
				})
			},
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
								// that.myFriendInfo = data.data.friendsList.filter(item => item.friendId == that.friendId)[0]
								// console.log(that.myFriendInfo)
							}
						})
					}
				})
			},
			getFriendAccount() {
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						that.account = res.data
						uni.request({
							url: that.$baseUrl + '/users/info',
							method: 'post',
							data: {
								account: that.friendId
							},
							success: (data) => {
								// that.avatar = data.data.info.avatar
								that.myFriendInfo = data.data.friendsList.filter(item => item.friendId == res.data)[0]
								console.log(that.myFriendInfo)
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
								if(that.scrollTag){
									that.$nextTick(function() {
										that.scrollView = 'msg' + that.friendMessage.messages[
											that.friendMessage.messages.length - 1].mid
									})
								}else{
									that.$nextTick(function() {
										that.scrollView = 'msg' + that.mid
									})
									that.scrollTag = true
								}
								console.log('friendInfo12312', that.friendMessage)
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
			async sendFile(file, tag, timeLong) {
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
				console.log(1)
				const uploadTask = uni.uploadFile({
					url: 'http://150.158.170.119:3000/upload/singleFile', //仅为示例，非真实的接口地址
					filePath: file,
					name: 'file',
					// fileType
					// formData: {
					// 	'user': this.account
					// },
					// header:{
					// 	'content-type': 'multipart/form-data',
					// },
					success: (uploadFileRes) => {

						console.log('abc', JSON.parse(uploadFileRes.data).mimetype)
						console.log('abcd', JSON.parse(uploadFileRes.data).filename)
						let data = JSON.parse(uploadFileRes.data)
						let fileUrl = 'http://150.158.170.119:3000/uploads/' + data.filename
						// console.log('data',data)
						let obj = {
							content: fileUrl,
							friendId: this.friendId,
							account: this.account,
							tag: data.mimetype,
							timeLong: timeLong ? timeLong : -1
						}
						console.log('obj', obj)
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
			clearHomeNotRead() {
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						that.account = res.data
						uni.request({
							url: that.$baseUrl + '/users/chat/clearNotRead',
							method: 'post',
							data: {
								account: res.data,
								friendId: that.friendId
							},
							success: (data) => {}
						})
					}
				})
			},
			acceptMessage(data) {
				// let that = this
				if (data.account === this.account && data.friendId === this.friendId) {
					console.log('执行了几次', data)
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
									isRead: 2,
									timeLong: data.timeLong
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
									isRead: 2,
									timeLong: data.timeLong
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
								isRead: 0,
								timeLong: data.timeLong

							}
						},
						success:async () => {
							await this.saveHomeMessageList({
								account: this.account,
								sender: this.friendMessage.note || this.friendMessage.name,
								friendId: this.friendMessage.friendId,
								lastDate: time,
								isShow: true,
								lastContent: data.tag ? '[图片]' : data.content,
								notRead: 0,
								isGroup: false,
								isTop: false,
								groupName: '',
								isRemind: true,
								avatar: this.friendMessage.avatar
							})
							// await this.clearHomeNotRead()
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
								isRead: 0,
								timeLong: data.timeLong
							}
						},
						success: () => {
							this.saveHomeMessageList({
								account: this.friendMessage.friendId,
								sender: this.myFriendInfo.note || this.myFriendInfo.name,
								friendId: this.account,
								lastDate: time,
								isShow: true,
								lastContent: data.tag ? '[图片]' : data.content,
								notRead: 1,
								isGroup: false,
								isTop: false,
								groupName: '',
								isRemind: true,
								avatar: this.avatar
							})
						}
					})
					// this.getFriendInfo()
					console.log('emit1')
					// this.socket.emit('updateSingleNews')




				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		position: relative;
	}

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

	// .tooltip {
	// 	position: absolute;
	// 	border-radius: 10rpx;
	// 	padding: 20rpx;
	// 	z-index: 999;
	// 	background: rgb(34, 34, 34);
	// 	color: #fff;
	// 	display: flex;
	// 	align-items: center;
	// 	justify-content: center;
	// }

	// .tooltip::after {
	// 	position: absolute;
	// 	top: 78rpx;
	// 	left: 50rpx;
	// 	content: '';
	// 	width: 0rpx;
	// 	height: 0rpx;
	// 	border: 10px solid #000;
	// 	border-top-color:  rgb(34, 34, 34);
	// 	border-bottom-color: transparent;
	// 	border-left-color: transparent;
	// 	border-right-color: transparent;
	// }
</style>
