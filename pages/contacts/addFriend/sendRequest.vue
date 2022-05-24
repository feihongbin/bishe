<template>
	<view class="sendRequestContainer">
		<view class="sendRequestBar">
			<text @click="back">取消</text>
			<view class="chatFriendInfo">
				<text class="friendName">添加好友</text>
			</view>
			<text @click="sendRequst">发送</text>
		</view>
		<view class="friendInfo">
			<image src="../../../static/logo.png" mode=""></image>
			<view class="info">
				<text>{{friendInfo.name}}</text>
				<text> {{ age }} {{' '+friendInfo.location || ' '}} </text>
			</view>
		</view>
		<view class="verify">
			<view class="verifyTitle">填写验证信息</view>
			<textarea v-model="message" placeholder="" />
		</view>
		<view class="groupAndNote">
			<view class="groupAndNoteTitle">设置备注和分组</view>
			<view class="note">
				<text>备注</text>
				<input v-model="note" class="noteCell" type="text" value="" />
			</view>
			<u-divider></u-divider>
			<view class="group" @click="changeGroup">
				<text>分组</text>
				<view class="groupCell">
					<text>{{group}}</text>
					<u-icon name="arrow-right" size="16" style="margin-right: 10px;"></u-icon>
				</view>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				friendId: '',
				message: '',
				group: '我的好友',
				note: '',
				friendInfo: {},
				age: '',
				param: {
					type: 'success',
					title: '成功主题(带图标)',
					message: "发送成功",
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
				},
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			changeGroup() {
				uni.navigateTo({
					url: `/pages/contacts/addFriend/selectGroup`
				})
			},
			showToast() {
				this.$refs.uToast.show({
					...this.param,
					duration:1000,
					complete() {
						 uni.reLaunch({
							url: '/pages/home/home'
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
							url: that.$baseUrl + `/users/info`,
							method: 'post',
							data: {
								account: that.friendId,

							},
							success: (data) => {
								// console.log('发送成功',data)
								that.friendInfo = data.data.info
								console.log(that.friendInfo)
								if (that.friendInfo.birth) {
									let now = new Date().getFullYear()
									let d = new Date(Number.parseInt(that.friendInfo.birth))
										.getFullYear()
									that.age = now - d + '岁'
									console.log(that.age)
								}
							}
						})

					}
				})
			},
			sendRequst() {
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + `/users/addFriend/sendRequest`,
							method: 'post',
							data: {
								account: res.data,
								friendId: that.friendId,
								message: that.message,
								group: that.group || '我的好友',
								note: that.note || that.friendInfo.name,
								isRead: false,
								status: 0
							},
							success: (data) => {
								that.socket.emit('newFriends', {
									friendId: that.friendId,
									account: res.data,
									count: 1,
									message: that.message,
									group: that.group,
									note: that.note
								})
								// uni.showToast({
								// 	duration:2000,
								// 	title:'发送成功',
								// 	icon:"success",
								// 	success() {
								// uni.reLaunch({
								// 	url:'/pages/home/home'
								// })
								// 	}
								// })
								that.showToast()
							}
						})

					}
				})
			},

		},
		onLoad(options) {
			this.friendId = options.friendId
			this.getFriendInfo(),
				uni.$on('selectedGroup', data => {
					this.group = data
					console.log(this.group)
				})
		}
	}
</script>

<style lang="scss" scoped>
	.sendRequestContainer {
		height: 100vh;
		background: #f8f8f8;
	}

	.sendRequestBar {
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

	.friendInfo {
		display: flex;
		align-items: center;
		position: relative;
		top: 0rpx;
		padding-top: 180rpx;
		background: #f8f8f8;

		image {
			width: 100rpx;
			height: 100rpx;
			margin: 40rpx 20rpx 40rpx 40rpx;
		}

		.info {
			display: flex;
			flex-direction: column;
			justify-content: center;

			text:nth-child(1) {
				font-weight: 500;
				font-size: 36rpx;
			}

			text:nth-child(2) {
				color: #666;
				font-size: 30rpx;
			}
		}
	}

	.verify {
		.verifyTitle {
			color: #666;
			padding: 20rpx 0 20rpx 40rpx;
		}

		textarea {
			width: 100vw;
			background: #ffffff;
			padding: 40rpx;
			height: 240rpx;
			box-sizing: border-box;
		}
	}

	.groupAndNote {
		background: #ffffff;

		.groupAndNoteTitle {
			background: #f8f8f8;
			color: #666;
			padding: 40rpx 0 40rpx 40rpx;
		}

		.u-divider {
			margin: 0 0 0 40rpx;
		}

		.note,
		.group {
			font-size: 36rpx;
			display: flex;
			align-items: center;
			height: 100rpx;
			padding-left: 40rpx;

			text {
				width: 120rpx;
			}

			.noteCell,
			.groupCell {
				flex: 1;
			}

			.groupCell {
				display: flex;
				justify-content: space-between;

				text {
					flex: 1;
				}
			}
		}

	}

	.group:active {
		background: #f6f6f6;
	}

	/deep/ .u-cell__body {
		padding: 0;
	}

	/deep/ .u-cell__title-text {
		font-size: 32rpx;
	}
</style>
