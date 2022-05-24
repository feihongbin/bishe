<template>
	<view class="addFriendListItem">
		<view class="friendBaseInfo" @click="toDetail">
			<image class="avatar" :src="detail.avatar" mode=""></image>
			<view class="baseInfo">
				<text>{{detail.name}}</text>
				<text>{{friend.message}}</text>
			</view>
		</view>
		<view class="agreeBtn">
			<u-button v-if="friend.status === 0" color="#eaedf4" text="同意" style="color:#000;"
				@click="agree(friend.friendId,1)"></u-button>
			<text v-if="friend.status === 1">已同意</text>
			<text v-if="friend.status === 2">已拒绝</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "addFriendListItem",
		data() {
			return {
				detail: {},
				myInfo: {}
			};
		},
		props: {
			friend: Object
		},

		methods: {
			toDetail() {
				uni.navigateTo({
					url: `./requestDetail?id=${this.detail.tid}&message=${this.friend.message}&status=${this.friend.status}`
				})
			},
			agree(friendId, status) {
				let that = this
				let time1 = Date.now()
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/addFriend/agree',
							method: 'post',
							data: {
								account: res.data,
								friendId: friendId,
								note: that.friend.note,
								group: that.friend.group,
								isRead: true,
								status: status,
								avatar: that.detail.avatar,
								name: that.detail.name,
								receiveSetting: 1,
								messages: []
							},
							success: (data) => {
								// this.detail = data.data.newFriendDetail
								// console.log(that.detail)
								
								
								uni.request({
									url: that.$baseUrl + '/users/chat/sendMessage',
									method: 'post',
									data: {
										account: friendId,
										friendId: res.data,
										message: {
											mid: res.data + time1,
											content: that.friend.message,
											type: 'myself',
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
									url: that.$baseUrl + '/users/chat/sendMessage',
									method: 'post',
									data: {
										account: res.data,
										friendId: friendId,
										message: {
											mid: res.data + time1,
											content: that.friend.message,
											type: 'others',
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
								
								
								that.saveHomeMessageList({
									account: res.data,
									friendId: friendId,
									sender:that.detail.name,
									lastDate: Date.now(),
									isShow: true,
									lastContent: that.friend.message,
									notRead: 1,
									isGroup: false,
									isTop: false,
									groupName: '',
									isRemind: true,
									avatar: that.detail.avatar
								})
								that.saveHomeMessageList({
									account: friendId,
									friendId: res.data,
									sender:that.myInfo.name,
									lastDate: Date.now(),
									isShow: true,
									lastContent: that.friend.message,
									notRead: 1,
									isGroup: false,
									isTop: false,
									groupName: '',
									isRemind: true,
									avatar: that.myInfo.avatar
								})
								// let obj = {
								// 	account: friendId,
								// 	friendId: res.data,
								// 	content: that.friend.message,

								// }
								uni.$emit('updateNewFriendList')
								that.socket.emit('updateMessageList')

							}
						})
					}
				})
			},
			saveHomeMessageList(obj) {
				uni.request({
					url: this.$baseUrl + '/users/chat/saveHomeMessageList',
					method: 'post',
					data: obj,
					success: (data) => {
						console.log(2)
						// fn || fn()
					}
				})
			},


			// acceptMessage(data) {
			// 	if (data.account === this.account && data.friendId === this.friendId) {
			// 		console.log('执行次', data)
			// 		let time1 = Date.now()
			// 		let timeDiff = 999999999999999
			// 		if (timeDiff > 1000 * 60 * 3) {


			// 			uni.request({
			// 				url: this.$baseUrl + '/users/chat/sendMessage',
			// 				method: 'post',
			// 				data: {
			// 					account: this.myInfo.tid,
			// 					friendId: this.detail.tid,
			// 					message: {
			// 						mid: this.myInfo.tid + time1,
			// 						content: time1,
			// 						type: 'time',
			// 						tag: 'text',
			// 						time: time1,
			// 						isRead: 2,
			// 						timeLong: data.timeLong
			// 					}
			// 				},
			// 				success: (data) => {
			// 					// that.getUserInfo()
			// 				}
			// 			})
			// 			uni.request({
			// 				url: this.$baseUrl + '/users/chat/sendMessage',
			// 				method: 'post',
			// 				data: {
			// 					account: this.detail.tid,
			// 					friendId: this.myInfo.tid,
			// 					message: {
			// 						mid: this.myInfo.tid + time1,
			// 						content: time1,
			// 						type: 'time',
			// 						tag: 'text',
			// 						time: time1,
			// 						isRead: 2,
			// 						timeLong: data.timeLong
			// 					}
			// 				},
			// 				success: (data) => {
			// 					// that.getUserInfo()
			// 				}
			// 			})
			// 		}
			// 		let time = Date.now()

			// 		uni.request({
			// 			url: this.$baseUrl + '/users/chat/sendMessage',
			// 			method: 'post',
			// 			data: {
			// 				account: this.myInfo.tid,
			// 				friendId: this.detail.tid,
			// 				message: {
			// 					mid: this.myInfo.tid + time,
			// 					content: data.content,
			// 					type: 'myself',
			// 					tag: data.tag || 'text',
			// 					time: time,
			// 					isRead: 0,
			// 					timeLong: data.timeLong

			// 				}
			// 			},
			// 			success: () => {
			// 				this.saveHomeMessageList({
			// 					account: this.myInfo.tid,
			// 					sender:  this.detail.name,
			// 					friendId: this.detail.id,
			// 					lastDate: time,
			// 					isShow: true,
			// 					lastContent: data.tag ? '[图片]' : data.content,
			// 					notRead: 9,
			// 					isGroup: false,
			// 					isTop: false,
			// 					groupName: '',
			// 					isRemind: true,
			// 					avatar: this.detail.avatar
			// 				})
			// 			}
			// 		})

			// 		uni.request({
			// 			url: this.$baseUrl + '/users/chat/sendMessage',
			// 			method: 'post',
			// 			data: {
			// 				account: this.detail.id,
			// 				friendId: this.myInfo.tid,
			// 				message: {
			// 					mid: this.myInfo.tid + time,
			// 					content: data.content,
			// 					type: 'others',
			// 					tag: data.tag || 'text',
			// 					time: time,
			// 					isRead: 0,
			// 					timeLong: data.timeLong
			// 				}
			// 			},
			// 			success: () => {
			// 				this.saveHomeMessageList({
			// 					account: this.detail.id,
			// 					sender: this.myInfo.name,
			// 					friendId: this.myInfo.tid,
			// 					lastDate: time,
			// 					isShow: true,
			// 					lastContent: data.tag ? '[图片]' : data.content,
			// 					notRead: 1,
			// 					isGroup: false,
			// 					isTop: false,
			// 					groupName: '',
			// 					isRemind: true,
			// 					avatar: this.myInfo.avatar
			// 				})
			// 			}
			// 		})
			// 		// this.getFriendInfo()
			// 		// console.log('emit1')
			// 		// this.socket.emit('updateSingleNews')




			// 	}
			// },










			getFriendDetail() {
				let that = this
				uni.request({
					url: that.$baseUrl + '/users/home/newFriendDetail',
					method: 'post',
					data: {
						friendId: that.friend.friendId
					},
					success: (data) => {
						that.detail = data.data.newFriendDetail
					}
				})
			},
			getMyInfo() {
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/info',
							method: 'post',
							data: {
								account: res.data
							},
							success: (data) => {
								that.myInfo = data.data.info
							}
						})
					}
				})

			}
		},
		mounted() {
			this.getFriendDetail()
			this.getMyInfo()
			uni.$on('agreeFriend', data => {
				if (data.id === this.friend.friendId) {
					this.agree(data.id, data.status)
				}
			})
		},

	}
</script>

<style lang="scss" scoped>
	.addFriendListItem {
		background: #ffffff;
		padding: 20rpx 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.friendBaseInfo {
			display: flex;

			.avatar {
				width: 100rpx;
				height: 100rpx;
				margin-right: 20rpx;
			}

			.baseInfo {
				display: flex;
				flex-direction: column;

				text:nth-child(1) {
					font-weight: 500;
					font-size: 36rpx;
				}

				text:nth-child(2) {
					color: #ccc;
					font-size: 30rpx;
				}
			}
		}

		.agreeBtn {
			text {
				color: #ccc;
			}
		}
	}
</style>
