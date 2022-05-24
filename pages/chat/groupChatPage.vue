<template>
	<view>
		<view class="chatTopBar">
			<uni-icons type="back" @click="goBack" size="24"></uni-icons>
			<view class="chatFriendInfo">
				<view class="friendNameBox"><text class="friendName">{{groupInfo.groupName}}</text><text></text></view>
				<text class="friendStatus">2人在线</text>
			</view>
			<uni-icons type="bars" size="24" @click="toSetGroup"></uni-icons>
		</view>
		<scroll-view class="chatContent" scroll-y="true" scroll-with-animation="true" :scroll-into-view="scrollView">
			<view class="">
				<group-chat-message :account="account" :messageList="groupMessage"></group-chat-message>
			</view>
			<view v-if="isShowBlank" class="blankContent"></view>
		</scroll-view>
		<group-submit :groupId="groupId" @showBlank="showBlank"></group-submit>
	</view>
</template>

<script>
	import GroupChatMessage from '../../components/group/groupChatMessage.vue'
	import GroupSubmit from '../../components/group/groupSubmit.vue'
	export default {
		components: {
			GroupChatMessage,
			GroupSubmit
		},
		data() {
			return {
				groupName: '',
				groupId: '',
				message: [],
				isShowBlank: false,
				groupMessage: [],
				account: '',
				avatar: '',
				groupInfo: {},
				scrollView: '',
				permission: 0,
			};
		},
		onLoad: function(option) {
			this.groupName = option.groupName
			this.groupId = option.groupId
			// this.acceptGroupMessage(data)
			// this.getFriendInfo()
			this.getAccount()
			this.clearHomeNotRead()
			this.getGroupInfo(option.groupId)
			let that = this
			uni.$on('refreshGroupChatPage', () => {
				this.getGroupInfo(option.groupId)
			})
			this.socket.on('getUpdatedGroupMessage', (data) => {
				console.log(23123, that.groupInfo.members)
				if (this.groupInfo.members.some(item => item.member === this.account)) {
					console.log('data', this.account)
					this.getGroupInfo(option.groupId)

				}
			})

			this.groupMessage = this.socket.on('acceptGroupMessage', (data) => {

				this.acceptGroupMessage(data)
			})


			this.socket.on('getUpdatedGroupMessage', (data) => {
				console.log(23123, that.groupInfo.members)
				if (this.groupInfo.members.some(item => item.member === this.account)) {
					console.log('data', this.account)
					this.getGroupInfo(option.groupId)

				}
			})



			uni.$on('sendGroupFile', ({
				file,
				tag,
				timeLong
			}) => {
				this.sendGroupFile(file, tag, timeLong)
			})


		},
		onUnload() {
			uni.$emit('refreshHomeMessage')
			this.socket.removeAllListeners('acceptGroupMessage')
			this.socket.removeAllListeners('getUpdatedGroupMessage')
			uni.$off('refreshGroupChatPage')
			uni.$off('sendGroupFile')
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
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
					}
				})
			},
			toSetGroup() {
				uni.navigateTo({
					url: `/pages/group/groupSetting?id=${this.groupId}&permission=${this.permission}`
				})
			},
			getGroupInfo(groupId) {
				uni.request({
					url: this.$baseUrl + '/group/getGroupInfo',
					method: 'post',
					data: {
						groupId: groupId
					},
					success: (data) => {
						console.log('groupInfo', data.data.messageList)
						this.groupMessage = data.data.messageList
						this.groupInfo = data.data.groupInfo
						this.permission = data.data.groupInfo.members.find(item => item.member === this
							.account).permission
						this.$nextTick(function() {
							this.scrollView = "msg" + this.groupMessage[this.groupMessage.length - 1]
								.mid
						})
					}
				})
			},
			async sendGroupFile(file, tag, timeLong) {
				console.log('file', file, 'tag', tag)
				let time = Date.now()
				this.groupMessage.push({
					content: file,
					isRead: 0,
					mid: this.account + time,
					tag: tag,
					time: time,
					type: 'myself'
				})
				console.log(this.groupMessage)
				this.$nextTick(function() {
					this.scrollView = 'msg' + this.account + time
				})
				console.log(1)
				const uploadTask = uni.uploadFile({
					url: 'http://127.0.0.1:3000/upload/singleFile', //仅为示例，非真实的接口地址
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
						let fileUrl = 'http://127.0.0.1:3000/uploads/' + data.filename
						// console.log('data',data)
						let obj = {
							content: fileUrl,
							groupId: this.groupId,
							account: this.account,
							tag: data.mimetype,
							timeLong: timeLong ? timeLong : -1
						}
						console.log('obj', obj)
						this.socket.emit('groupMessage', obj)
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
				console.log('save')
				uni.request({
					url: this.$baseUrl + '/users/chat/saveHomeMessageList',
					method: 'post',
					data: obj,
					success: (data) => {
						this.socket.emit('updateMessageList', {
							account: this.account,
							friendId: this.groupId
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
								friendId: that.groupId
							},
							success: (data) => {
								console.log(123)
							}
						})
					}
				})
			},
			fileType(val) {
				if (val === 'image/jpeg') {
					return '图片'
				} else if (val === 'application/pcm') {
					return '语音消息'
				} else {
					return '文件'
				}
			},
			acceptGroupMessage(data) {

				let time = Date.now()
				let timeDiff = this.groupMessage.length > 0 ? time - this.groupMessage[this.groupMessage.length - 1].time :
					999999999999999
				if (timeDiff > 1000 * 60 * 3) {
					uni.request({
						url: this.$baseUrl + '/group/acceptGroupMessage',
						method: 'post',
						data: {
							groupId: data.groupId,
							message: {
								mid: data.groupId + data.account + time,
								content: time,
								tag: 'time',
								time: time,
								isRead: 0,
							}
						},
						success: (data) => {
							// that.getUserInfo()
						}
					})
				}

				uni.request({
					url: this.$baseUrl + '/group/acceptGroupMessage',
					method: 'post',
					data: {
						groupId: data.groupId,
						message: {
							mid: data.groupId + data.account + time,
							content: data.content,
							sender: data.account,
							tag: data.tag || 'text',
							time: time,
							isRead: 0
						}
					},
					success: async (res) => {

						await this.groupInfo.members.forEach((item) => {
							this.saveHomeMessageList({
								account: item.member,
								friendId: this.groupInfo.groupId,
								sender: this.groupInfo.members.find(item => item.member ===
									this.account).groupNote,
								lastDate: time,
								isShow: true,
								lastContent: data.tag && data.tag !== 'welcome' ? this
									.fileType(data.tag) : data.content,
								notRead: 2,
								isGroup: true,
								isTop: false,
								groupName: this.groupInfo.groupName,
								isRemind: true,
								avatar: this.groupInfo.groupAvatar
							})
						})
						this.socket.emit('updateGroupMessageList', data)
					}

				})
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
		padding: 80rpx 20rpx 0rpx;

		display: flex;
		justify-content: space-between;

		.chatFriendInfo {
			display: flex;
			flex-direction: column;
			align-items: center;

			.friendNameBox {
				display: flex;
				justify-content: center;

				.friendName {
					width: 100%;
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
