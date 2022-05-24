<template>
	<view class="addFriendListItem">
		<view class="friendBaseInfo" @click="toDetail">
			<image class="avatar" :src="detail.avatar" mode=""></image>
			<view class="baseInfo">
				<text>{{detail.name}}</text>
				<text>{{(friend.type === 0 ? '申请加入 ' : '邀请加入 ') + groupDetail.groupName}}</text>
				<text>{{friend.messgae}}</text>
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
				groupDetail: {}
			};
		},
		props: {
			friend: Object
		},
		methods: {
			toDetail() {
				uni.navigateTo({
					url: `/pages/group/groupRequestDetail?id=${this.detail.tid}&message=${this.friend.messgae}&status=${this.friend.status}&type=${this.friend.type}&friendId=${this.detail.account}&name=${this.detail.name}`
					// url:'/pages/group/groupRequestDetail'
				})
			},
			agree(friendId, status) {
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/updateGroupRequest',
							method: 'post',
							data: {
								account: res.data,
								friendId: friendId,
								groupId: that.friend.groupId,
								status: status
							
							},
							success: async (data) => {
								
								
								let time = Date.now()
								// 添加到群聊信息中去
								uni.request({
									url: that.$baseUrl + '/group/acceptGroupMessage',
									method: 'post',
									data: {
										groupId: that.friend.groupId,
										message: {
											mid: that.friend.groupId + time,
											content: friendId+'加入了群聊 ',
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
								await that.saveHomeMessageList({
									account: friendId,
									friendId: that.friend.groupId,
									sender: '',
									lastDate: time,
									isShow: true,
									lastContent: '你已加入了群聊 ' + that.groupDetail.groupName,
									notRead: 1,
									isGroup: true,
									isTop: false,
									groupName: that.groupDetail.groupName,
									isRemind: true,
									avatar: that.groupDetail.groupAvatar
								})
								
								
								// 其他群成员看到的信息
								await that.groupDetail.members.forEach((item) => {
									that.saveHomeMessageList({
										account: item.member + '',
										friendId: that.friend.groupId + '',
										sender: '',
										lastDate: time,
										isShow: true,
										lastContent: friendId+'加入了群聊 ' ,
										notRead: 1,
										isGroup: true,
										isTop: false,
										groupName: that.groupDetail.groupName,
										isRemind: true,
										avatar: that.groupDetail.groupAvatar
									})
								})
								
								
								that.accountJoinGroup()
								
								
								// let obj = {
								// 	content:that.detail.name + ' 加入群聊',
								// 	groupId:that.friend.groupId,
								// 	account:res.data,
								// 	tag:'welcome'
								// }
								// console.log(obj)
								uni.$emit('updateGroupRequestList')
								that.socket.emit('updateMessageList')
								// this.socket.emit('newGroupRequest',this.managers)
								
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
					}
				})
			},
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
						console.log(that.detail,this.friend)
					}
				})
			},
			getGroupDetail() {
				let that = this
				uni.request({
					url: that.$baseUrl + '/group/getGroupInfo',
					method: 'post',
					data: {
						groupId: that.friend.groupId,
					},
					success: (data) => {
						that.groupDetail = data.data.groupInfo
						console.log(that.groupDetail,that.detail)
					}
				})
			},
			
			accountJoinGroup(){
				uni.request({
					url: this.$baseUrl + '/users/accountJoinGroup',
					method: 'post',
					data: {
						account:this.friend.friendId,
						group: this.friend.groupId,
						groupName: this.groupDetail.groupName,
						permission:0,
						groupAvatar:this.groupDetail.groupAvatar
					},
					success: (data) => {
						this.groupAddAccount()
					}
				})
			},
			groupAddAccount(){
				uni.request({
					url: this.$baseUrl + '/group/groupAddAccount',
					method: 'post',
					data: {
						member:this.friend.friendId,
						groupId: this.friend.groupId,
						permission:0,
						groupNote:this.detail.name,
						isAlive:true,
						avatar:this.detail.avatar
					},
					success: (data) => {
						// that.groupDetail = data.data.groupInfo
						// console.log(that.groupDetail)
					}
				})
			}
		},
		mounted() {
			this.getFriendDetail()
			this.getGroupDetail()
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
			align-items: center;
			.avatar {
				width: 120rpx;
				height: 120rpx;
				margin-right: 20rpx;
			}

			.baseInfo {
				display: flex;
				flex-direction: column;
				
				width: 50vw;
			
				text {
					color: #ccc;
					font-size: 30rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				text:nth-child(1) {
					font-weight: 500;
					font-size: 36rpx;
					color: #000;
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
