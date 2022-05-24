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
			<view class="tip">选择好友</view>
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
							<!-- <text>2/10</text> -->
						</view>
					</text>
					<text class="u-collapse-content">
						<view class="friend" v-for="(friend,i) in item.slice(1)" @click="checkItem(friend)">
							<u-icon size="32" v-if="!friend.isMember"
								:name="friend.isChecked ? 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/circle-fill.png' : 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/circle.png'">
							</u-icon>
							<u-icon size="32" v-if="friend.isMember"
								name="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/circle-checked.png">
							</u-icon>
							<image class="friendAvatar" :src="friend.avatar" mode=""></image>
							<text class="friendName">{{friend.note || friend.name}}</text>
						</view>
					</text>
				</u-collapse-item>
			</u-collapse>


		</scroll-view>

		<view class="btn">
			<button type="primary" :disabled="checkedList.length < 1" @click="submit">立即邀请</button>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				friendByGroup: [],
				checkedList: [],
				info: {},
				friendInfo:{},
				groupDetail: {},
				managers: [],
				groupId: '',
				account: '',
				param: {
					type: 'success',
					title: '成功主题(带图标)',
					message: "发送成功,等待管理员审核",
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
				},
			};
		},

		methods: {
			showToast() {
				this.$refs.uToast.show({
					...this.param,
					duration: 1000,
					complete() {
						uni.reLaunch({
							url: '/pages/home/home'
						})
					}
				})
			},
			getGroupDetail() {
				uni.request({
					url: this.$baseUrl + '/group/getGroupInfo',
					method: 'post',
					data: {
						groupId: this.groupId,
					},
					success: (data) => {
						this.groupDetail = data.data.groupInfo
						console.log(this.groupDetail)
					}
				})
			},
			getFriendList(id) {
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/group/getGroupInfo',
							method: 'post',
							data: {
								groupId: id,
							},
							success: (data) => {
								let members = data.data.groupInfo.members.map(item => item.member)
								that.managers = data.data.groupInfo.members.filter(item => item
									.permission != 0).map(i => i.member)
								console.log(members, that.managers)
								uni.request({
									url: that.$baseUrl + '/users/contacts/getFriendList',
									method: 'post',
									data: {
										account: res.data,
									},
									success: (data1) => {

										let arr = []
										data1.data.friendByGroup.forEach((item,
											index) => {
											let tmp = []
											item.forEach((it, i) => {

												if (i === 0) {
													tmp.push(it)
												} else {
													tmp.push({
														avatar: it
															.avatar,
														friendId: it
															.friendId,
														name: it
															.name,
														note: it
															.note,
														isChecked: false,
														isMember: members
															.some(
																me =>
																it
																.friendId ==
																me
															)
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

					}

				})
			},
			checkItem(item) {
				if (!item.isMember) {
					if (this.checkedList.length > 0) {
						this.checkedList.forEach(i => {
							if (i.friendId != item.friendId) {
								i.isChecked = false
							}
						})
					}
					this.checkedList = []
					item.isChecked = !item.isChecked
					if (item.isChecked) {
						this.checkedList.push(item)
					} else {
						let index = this.checkedList.findIndex((i) => {
							return i.friendId === item.friendId
						})
						if (index >= 0) {
							this.checkedList.splice(index, 1)
						}
					}
					console.log(this.checkedList)
				}
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
			accountJoinGroup() {
				uni.request({
					url: this.$baseUrl + '/users/accountJoinGroup',
					method: 'post',
					data: {
						account: this.checkedList[0].friendId,
						group: this.groupId,
						groupName: this.groupDetail.groupName,
						permission: 0,
						groupAvatar: this.groupDetail.groupAvatar
					},
					success: (data) => {
						this.groupAddAccount()
					}
				})
			},
			groupAddAccount() {
				uni.request({
					url: this.$baseUrl + '/group/groupAddAccount',
					method: 'post',
					data: {
						member: this.checkedList[0].friendId,
						groupId: this.groupId,
						permission: 0,
						groupNote: this.friendInfo.name,
						isAlive: true,
						avatar: this.friendInfo.avatar
					},
					success: (data) => {
						// that.groupDetail = data.data.groupInfo
						// console.log(that.groupDetail)
						console.log( this.friendInfo)
					}
				})
			},
			async submit() {
				if (this.managers.includes(this.account)) {
					await uni.request({
						url: this.$baseUrl + '/users/info',
						method: 'post',
						data: {
							account: this.checkedList[0].friendId,
						},
						success: (data) => {
							this.friendInfo = data.data.info
						}
					})
					
					
					
					let time = Date.now()
					// 添加到群聊信息中去
					uni.request({
						url: this.$baseUrl + '/group/acceptGroupMessage',
						method: 'post',
						data: {
							groupId: this.groupId,
							message: {
								mid: this.groupId + time,
								content: this.checkedList[0].friendId + '加入了群聊 ',
								sender: '',
								tag: 'welcome',
								time: time,
								isRead: 0
							}
						},
						success: (res) => {

						}

					})

					// 加入群聊的人提示不一样
					await this.saveHomeMessageList({
						account: this.checkedList[0].friendId,
						friendId: this.groupId,
						sender: '',
						lastDate: time,
						isShow: true,
						lastContent: '你已加入了群聊 ' + this.groupDetail.groupName,
						notRead: 1,
						isGroup: true,
						isTop: false,
						groupName: this.groupDetail.groupName,
						isRemind: true,
						avatar: this.groupDetail.groupAvatar
					})

					// 其他群成员看到的信息
					await this.groupDetail.members.forEach((item) => {
						this.saveHomeMessageList({
							account: item.member + '',
							friendId: this.groupId + '',
							sender: '',
							lastDate: time,
							isShow: true,
							lastContent: this.checkedList[0].friendId + '加入了群聊 ',
							notRead: 1,
							isGroup: true,
							isTop: false,
							groupName: this.groupDetail.groupName,
							isRemind: true,
							avatar: this.groupDetail.groupAvatar
						})
					})

					this.accountJoinGroup()
					this.socket.emit('updateMessageList')
					uni.reLaunch({
						url: "/pages/home/home"
					})
				} else {
					uni.request({
						url: this.$baseUrl + '/users/groupRequest',
						method: 'post',
						data: {
							managers: this.managers,
							account: this.checkedList[0].friendId,
							obj: {
								messgae: `大家好，我是${this.checkedList[0].name}`,
								friendId: this.checkedList[0].friendId,
								type: 0,
								isRead: 1,
								status: 0,
								groupId: this.groupId
							}
						},
						success: (data) => {
							this.socket.emit('newGroupRequest', this.managers)
							this.showToast()

						}
					})
				}



			}



		},
		onLoad(option) {
			this.groupId = option.id
			this.account = option.account
			this.getFriendList(option.id)
			this.getGroupDetail()
			uni.request({
				url: this.$baseUrl + '/users/info',
				method: 'post',
				data: {
					account: option.account,
				},
				success: (data) => {
					this.info = data.data.info
					console.log(this.info)
				}
			})
			

			// this.socket.on('updateGroupList',data => {
			// 	console.log('0nnnnn',data.members,option.account)
			// 	let index = data.members.findIndex((item,i)=>{
			// 		return item.account === option.account
			// 	})
			// 	if(index === data.members.length - 1){
			// 		console.log('asdasd',index)
			// 		for(let i=0;i<=index;i++){
			// 			this.updateGroupList({
			// 				account:data.members[i].account,
			// 				groupId:data.groupId,
			// 				groupName:data.groupName,
			// 				permission:i === index ? data.members[index].permission:data.members[i].permission
			// 			})
			// 		}
			// 	}
			// })
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
