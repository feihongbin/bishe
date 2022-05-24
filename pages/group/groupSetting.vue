<template>
	<view class="groupSettingContainer">
		<view class="groupName" @click="toDetail">
			<view class="groupCell">
				<image :src="groupInfo.groupAvatar" mode=""></image>
				<text>{{groupInfo.groupName}}</text>
			</view>
			<u-icon name="arrow-right" size="16" color="#ccc" style="margin-right: 10px;"></u-icon>
		</view>

		<view class="groupMembers">
			<view class="title" @click="checkMemberList">
				<text class="titleContent">群聊成员</text>
				<view class="count">
					<text>共{{groupInfo.members && groupInfo.members.length}}人</text>
					<u-icon name="arrow-right" size="16" color="#ccc" style="margin-right: 10px;"></u-icon>
				</view>
			</view>
			<view class="imgList">
				<view class="imgItem" v-for="(item,index) in memberList" :key="index">
					<image :src="item.avatar" mode=""></image>
					<text>{{item.groupNote}}</text>
				</view>

				<view class="imgItem" @click="inviteNewFriend">
					<image src="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/yaoqing.png" mode=""></image>
					<text>邀请</text>
				</view>
			</view>

		</view>
		<view class="groupInfo">
			<view class="infoItem" @click="setGroupName">
				<text class="label">群聊名称</text>
				<view class="content">
					<text>{{groupInfo.groupName}}</text>
					<u-icon name="arrow-right" size="16" color="#ccc" style="margin-right: 10px;"></u-icon>
				</view>
			</view>
			<view class="infoItem">
				<text class="label">群号</text>
				<view class="content">
					<text>{{groupInfo.groupId}}</text>
					<u-icon name="arrow-right" size="16" color="#ccc" style="margin-right: 10px;"></u-icon>
				</view>
			</view>
		</view>

		<view class="groupSetting">
			<view class="infoItem">
				<text class="label">置顶</text>
				<u-switch v-model="isTop" @change="changeIsTop"></u-switch>
			</view>
			<!-- 	<view class="infoItem">
				<text class="label">消息免打扰</text>
				<u-switch v-model="isRemind" @change="isRemindChange"></u-switch>
			</view> -->
		</view>

		<view class="groupInfo">
			<view class="infoItem" @click="setMyName">
				<text class="label">我的群昵称</text>
				<view class="content">
					<text>{{note}}</text>
					<u-icon name="arrow-right" size="16" color="#ccc" style="margin-right: 10px;"></u-icon>
				</view>
			</view>

		</view>

		<view class="deleteBtn" v-if="userInfo.permission === 2" @click="disbandGroup">
			<text>解散群聊</text>
		</view>
		<view class="deleteBtn" @click="quitGroup" v-else>
			<text>退出群聊</text>
		</view>

		<u-modal :show="quitShow" title="退出群聊" content='你将退出群聊,退群通知仅群管理员可见,是否继续' @cancel="quitCancel" showCancelButton
			:asyncClose="true" closable @confirm="quitConfirm"></u-modal>
		<u-modal :show="disbandShow" title="解散群聊" content='解散群聊后你将失去和群友的联系,确认要解散吗' @cancel="disbandCancel"
			showCancelButton :asyncClose="true" closable @confirm="disbandConfirm"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isTop: false,
				isRemind: false,
				groupInfo: {},
				account: '',
				userInfo: {},
				quitShow: false,
				disbandShow: false,
				managers: [],
				permission: 0
			}
		},
		computed: {
			note() {
				if (this.groupInfo.members) {
					return this.groupInfo.members.find(item => item.member === this.account).groupNote
				}

			},
			memberList() {
				if (this.groupInfo.members) {
					return this.groupInfo.members.sort((a, b) => b.permission - a.permission)
				}
			}
		},
		methods: {
			changeIsTOP() {
				this.isTop = !this.isTop
			},
			toDetail() {
				console.log(223)
				uni.navigateTo({
					// url:`/pages/group/groupintroduce?id=${this.groupInfo.groupId}`
					url: `/pages/group/groupIntroduce?id=${this.groupInfo.groupId}`
				})
			},
			getGroupInfo(groupId) {
				uni.request({
					url: this.$baseUrl + '/group/getGroupInfo',
					method: 'post',
					data: {
						groupId: groupId,
					},
					success: (data) => {
						console.log(data.data.groupInfo)
						this.groupInfo = data.data.groupInfo
						this.managers = data.data.groupInfo.members.filter(item => item.permission > 0).map(
							i => i.member)
						console.log('asd', this.groupInfo.members.sort((a, b) => b.permission - a.permission))
					}
				})
			},
			getInfo(id) {
				uni.request({
					url: this.$baseUrl + '/users/info',
					method: 'post',
					data: {
						account: this.account
					},
					success: (data) => {
						for (let item of data.data.groupList) {
							if (item.group == id) {
								this.userInfo = item
								this.isRemind = item.receiveSetting == 1 ? true : false
								return
							}
						}

					}
				})
			},
			isRemindChange() {
				uni.request({
					url: this.$baseUrl + '/users/chat/changeGroupRemind',
					method: 'post',
					data: {
						account: this.account,
						group: this.userInfo.group + '',
						isRemind: this.isRemind ? 1 : 0
					},
					success: (data) => {}
				})
			},
			getMessageList(id) {

				uni.request({
					url: this.$baseUrl + '/users/home/messageList',
					method: 'post',
					data: {
						account: this.account,
					},
					success: (data) => {
						this.isTop = data.data.messageList.find(item => item.friendId === id).isTop

					}
				})

			},
			changeIsTop() {
				console.log(this.isTop)
				uni.request({
					url: this.$baseUrl + '/users/chat/setIsTop',
					method: 'post',
					data: {
						account: this.account,
						friendId: this.userInfo.group + '',
						isTop: !this.isTop
					},
					success: (data) => {

					}
				})
			},
			checkMemberList() {
				uni.navigateTo({
					url: `groupMangement/groupMemberList?id=${this.groupInfo.groupId}&permission=${this.permission }`
				})
			},
			setGroupName() {
				if (this.permission != 0) {
					uni.navigateTo({
						url: `groupMangement/setGroupName?id=${this.groupInfo.groupId}&name=${this.groupInfo.groupName}`
					})
				}

			},
			setMyName() {
				uni.navigateTo({
					url: `groupMangement/editMyName?id=${this.groupInfo.groupId}&name=${this.note}`
				})
			},
			inviteNewFriend() {
				uni.navigateTo({
					url: `groupMangement/inviteFriend?id=${this.groupInfo.groupId}&account=${this.account}`
					// url:`invitefriend/invitefriend`
				})
			},
			clearMyGroupList() {
				uni.request({
					url: this.$baseUrl + '/users/quitGroup',
					method: 'post',
					data: {
						account: this.account,
						group: this.userInfo.group + '',
						managers: this.managers
					},
					success: (data) => {
						this.quitShow = false

						uni.reLaunch({
							url: '/pages/home/home'
						})
					}
				})
			},
			clearGroupMemeberList() {
				uni.request({
					url: this.$baseUrl + '/group/quitGroup',
					method: 'post',
					data: {
						account: this.account,
						groupId: this.userInfo.group + '',
					},
					success: (data) => {
						this.clearMyGroupList()
					}
				})
			},
			disband() {
				let that = this
				that.groupInfo.members.forEach(async (item) => {
					await uni.request({
						url: that.$baseUrl + '/users/quitGroup',
						method: 'post',
						data: {
							account: item.member,
							group: that.userInfo.group + '',
							managers: [item.member],
							groupName: that.groupInfo.groupName,
							isDisband: true
						},
						success: (data) => {
							// this.quitShow = false




						}
					})
				})
				uni.request({
					url: that.$baseUrl + '/group/disbandGroup',
					method: 'post',
					data: {
						groupId: that.userInfo.group + '',
					},
					success: (data) => {
						this.socket.emit('updateMessageList')


						uni.reLaunch({
							url: '/pages/home/home'
						})


					}
				})

			},
			quitGroup() {
				this.quitShow = true
			},
			quitConfirm() {
				this.clearGroupMemeberList()
			},
			quitCancel() {
				this.quitShow = false
			},
			disbandGroup() {
				this.disbandShow = true
			},
			disbandCancel() {
				this.disbandShow = false
			},
			disbandConfirm() {
				this.disband()
			}
		},
		onLoad(option) {
			this.permission = option.permission
			this.getGroupInfo(option.id)
			try {
				const value = uni.getStorageSync('accountId');
				if (value) {
					this.account = value
					this.getInfo(option.id)
					this.getMessageList(option.id)
				}
			} catch (e) {
				// error
			}
			uni.$on('refreshGroupInfo', () => {
				this.getGroupInfo(option.id)
				this.getInfo(option.id)
			})
		},
		onUnload() {
			uni.$emit('refreshGroupChatPage')
		}
	}
</script>

<style lang="scss" scoped>
	.groupSettingContainer {
		background: #f8f8f8;
		height: 100vh;
	}

	.groupName {
		background: #ffffff;
		display: flex;
		justify-content: space-between;
		height: 120rpx;
		padding: 0 20rpx;

		.groupCell {
			display: flex;
			// justify-content: space-between;
			align-items: center;
			font-size: 36rpx;
			color: #ccc;

			image {
				width: 90rpx;
				height: 90rpx;
				margin-right: 20rpx;
			}

			text {
				width: 40vw;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap
			}
		}

	}

	.groupMembers {
		margin-top: 40rpx;
		background: #ffffff;
		padding: 20rpx 20rpx;

		.title {
			display: flex;
			justify-content: space-between;
			padding-bottom: 10rpx;

			.count {
				display: flex;
				color: #ccc;

				text {
					margin-right: 10rpx;
				}
			}
		}

		.imgList {
			display: flex;
			flex-wrap: wrap;

			.imgItem {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 80rpx;
				box-sizing: border-box;
				margin: 20rpx 40rpx 0 20rpx;

				image {
					width: 80rpx;
					height: 80rpx;
				}

				text {
					max-width: 80rpx;
					font-size: 24rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap
				}
			}

			.imgItem:nth-last-child(1) {
				color: #ccc;
			}
		}
	}


	.groupInfo,
	.groupSetting {
		background: #fff;
		margin-top: 60rpx;

		.infoItem {
			display: flex;
			justify-content: space-between;
			padding: 40rpx 20rpx;
			box-sizing: border-box;
			border-bottom: 1px solid #eeeff2;

			.content {
				color: #ccc;
				display: flex;
				justify-content: flex-end;
				width: 400rpx;

				text {
					margin-right: 20rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap
				}
			}
		}
	}


	.group:active {
		background: #f6f6f6;
	}




	.deleteBtn {
		height: 100rpx;
		background: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 40rpx;
		color: #f25e77
	}
</style>
<style lang="scss" scoped>
	/deep/ .u-modal__content__text {
		text-align: center;
	}
</style>
