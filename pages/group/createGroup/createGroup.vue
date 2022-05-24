<template>
	<view class="createGroupContainer">

		<view class="searchInput">
			<view class="checkedAvatarList">
				<view class="" v-if="checkedList.length <= 0">
					<uni-icons type="search" color="#b3b3b3" size="24"></uni-icons>
				</view>
				<scroll-view v-else scroll-x="true" class="scrollX" :enable-flex="true">
					<image v-for="(item,index) in checkedList" :src="item.avatar"></image>
				</scroll-view>
			</view>
			<input type="text" value="" placeholder="搜索" />
		</view>

		<scroll-view scroll-y="true" class="people">
			<view class="tip">选人创建</view>
			<!-- <create-group-people-list :list="friendByGroup"></create-group-people-list> -->

			<u-collapse :border="false">
				<u-collapse-item v-for="(item,index) in friendByGroup">
					<!-- <u-icon name="play-right-fill" size="20" slot="icon"></u-icon> -->
					<text slot="right-icon">
						<u-icon name="arrow-up-fill" size="16" color="#cfcfcf"></u-icon>
					</text>
					<text slot="title">
						<view class="groupTitle">
							<text>{{item[0]}}</text>
							<text>{{item.length - 1}}</text>
						</view>
					</text>
					<text class="u-collapse-content">
						<view class="friend" v-for="(friend,i) in item.slice(1)" @click="checkItem(friend)">
							<u-icon size="32"
								:name="friend.isChecked ? 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/circle-fill.png' : 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/circle.png'">
							</u-icon>
							<image class="friendAvatar" :src="friend.avatar" mode=""></image>
							<text class="friendName">{{friend.note || friend.name}}</text>
						</view>
					</text>
				</u-collapse-item>
			</u-collapse>


		</scroll-view>

		<view class="btn">
			<button type="primary" :disabled="checkedList.length < 1" @click="createGroup">立即创建<text
					v-if="checkedList.length > 0">({{checkedList.length}})</text></button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				friendByGroup: [],
				checkedList: [],
				info: {},
				socketObj: null
			};
		},

		methods: {

			getFriendList() {
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/contacts/getFriendList',
							method: 'post',
							data: {
								account: res.data,
							},
							success: (data) => {

								let arr = []
								data.data.friendByGroup.forEach((item, index) => {
									let tmp = []
									item.forEach((it, i) => {

										if (i === 0) {
											tmp.push(it)
										} else {
											tmp.push({
												avatar: it.avatar,
												friendId: it.friendId,
												name: it.name,
												note: it.note,
												isChecked: false
											})
										}
									})
									arr.push(tmp)

								})
								that.friendByGroup = arr
								console.log('group', that.friendByGroup, arr)
							}
						})
					}

				})
			},
			checkItem(item) {
				item.isChecked = !item.isChecked
				console.log('ite', item)
				if (item.isChecked) {
					this.checkedList.push(item)
				} else {
					let index = this.checkedList.findIndex((i) => {
						return i.friendId === item.friendId
					})
					console.log(index)
					if (index >= 0) {
						this.checkedList.splice(index, 1)
					}
				}
				console.log(this.checkedList)
			},
			createGroup() {

				uni.request({
					url: this.$baseUrl + '/group/createGroup',
					method: 'post',
					data: {
						leader: this.info,
						members: this.checkedList
					},
					success: async (data) => {
						let groupId = data.data.groupId
						let groupName = data.data.groupName
						let that = this


						let time = Date.now()
						uni.request({
							url: this.$baseUrl + '/group/acceptGroupMessage',
							method: 'post',
							data: {
								groupId: groupId,
								message: {
									mid: groupId + time,
									content: '你加入了群聊 ' + groupName,
									sender: '',
									tag: 'welcome',
									time: time,
									isRead: 0
								}
							},
							success: (res) => {

							}

						})




















						await that.saveHomeMessageList({
							account: that.info.account,
							friendId: groupId,
							sender: '',
							lastDate: Date.now(),
							isShow: true,
							lastContent: '你已加入了群聊 ' + groupName,
							notRead: 1,
							isGroup: true,
							isTop: false,
							groupName: groupName,
							isRemind: true,
							avatar: data.data.groupAvatar
						})


						await this.checkedList.forEach((item) => {
							that.saveHomeMessageList({
								account: item.friendId + '',
								friendId: groupId + '',
								sender: '',
								lastDate: Date.now(),
								isShow: true,
								lastContent: '你已加入了群聊 ' + groupName,
								notRead: 1,
								isGroup: true,
								isTop: false,
								groupName: groupName,
								isRemind: true,
								avatar: data.data.groupAvatar
							})
						})
						
						this.socket.emit('createdNewGroup', {
							leader: this.info,
							members: this.checkedList,
							groupId: data.data.groupId,
							groupName: data.data.groupName
						})
						this.socket.emit('updateMessageList')
						

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
					}
				})
			},
			updateGroupList(group) {

				uni.request({
					url: this.$baseUrl + '/users/contacts/updateGroupList',
					method: 'post',
					data: {
						group: group
					},
					success: (data) => {

					}
				})
			}

		},
		onLoad(option) {
			this.getFriendList()
			uni.request({
				url: this.$baseUrl + '/users/info',
				method: 'post',
				data: {
					account: option.account,
				},
				success: (data) => {
					this.info = {
						account: option.account,
						name: data.data.info.name,
						avatar: data.data.info.avatar
					}
				}
			})
		
			this.socket.on('updateGroupList', data => {
				console.log('0nnnnn', data.members, option.account)
				let index = data.members.findIndex((item, i) => {
					return item.account === option.account
				})
				if (index === data.members.length - 1) {
					console.log('asdasd', index, data)
					for (let i = 0; i <= index; i++) {
						this.updateGroupList({
							account: data.members[i].account,
							groupId: data.groupId,
							groupName: data.groupName,
							permission: i === index ? data.members[index].permission : data.members[i]
								.permission,
							groupAvatar: 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/avatar/1.jpeg'

						})
					}
				}
				uni.reLaunch({
					url: '/pages/home/home'
				})
			})
		},
		onUnload() {
			this.socket.removeAllListeners('updateGroupList')
		}

	}
</script>

<style lang="scss" scoped>
	.createGroupContainer {
		background: #f8f8f8;
		padding-top: 60rpx;
		height: calc(100vh - 80rpx);
		position: relative;
		box-sizing: border-box;
	}

	.searchInput {
		display: flex;
		background-color: #fff;
		padding: 30rpx 20rpx;
		border-radius: 10rpx;
		box-sizing: border-box;
		align-items: center;

		.checkedAvatarList {
			.scrollX {
				display: flex;
				max-width: 400rpx;
				white-space: nowrap;

				image {
					width: 80rpx;
					height: 80rpx;
					margin: 0 10rpx;
					border-radius: 10rpx;
				}
			}
		}

		input {
			margin-left: 10rpx;
			flex: 1;
		}
	}

	.people {
		margin-top: 100rpx;
		background: #fff;
		padding: 20rpx;
	}

	.btn {
		background: #fff;
		position: absolute;
		bottom: 0;
		padding: 20rpx 20rpx;
		width: 100%;
		box-sizing: border-box;
	}

	.groupTitle {
		display: flex;
		justify-content: space-around;
		align-items: center;

		text:nth-child(1) {
			flex: 1;
			font-size: 36rpx;
		}

		text:nth-child(2) {
			font-size: 24rpx;
			color: #666;
		}
	}

	.friend {
		display: flex;
		align-items: center;
		height: 120rpx;

		.friendAvatar {
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
			margin-left: 20rpx;
			border-radius: 20rpx;
		}

		.friendName {
			color: #000000;
		}
	}
</style>

<style lang="scss" scoped>
	/deep/ .u-cell__body__content {
		order: 2;
	}

	/deep/ .u-cell__right-icon-wrap--up {
		transform: rotate(180deg);
	}

	/deep/ .u-cell__right-icon-wrap--down {
		transform: rotate(90deg);
	}

	/deep/ .u-cell__right-icon-wrap {
		margin-left: 0;
		margin-right: 8rpx;
	}
</style>
