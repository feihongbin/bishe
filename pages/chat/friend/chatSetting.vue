<template>
	<view class="chatSettingContainer">
		<view class="infoItem" v-if="isPermission" style="margin-bottom: 40rpx;background: #fff;">
			<text class="label">设为管理员</text>
			<u-switch style="margin-right: 40rpx;" v-model="myGroupPermission" @change="changePermission"></u-switch>
		</view>
		<view class="groupAndNote" v-if="isFriend">
			
			<view class="note" @click="changeNote">
				<text>备注</text>
				<view class="groupCell">
					<text>{{userInfo.note}}</text>
					<u-icon name="arrow-right" size="16" color="#ccc" style="margin-right: 10px;"></u-icon>
				</view>
			</view>
			<u-divider></u-divider>
			<view class="group" @click="changeGroup">
				<text>分组</text>
				<view class="groupCell">
					<text>{{userInfo.group}}</text>
					<u-icon name="arrow-right" size="16" color="#ccc" style="margin-right: 10px;"></u-icon>
				</view>
			</view>
		</view>
		
		<view class="groupAndNote" v-if="isFriend && !groupId" style="margin-top: 40rpx;">
			
			<view class="group" @click="checkHistory">
				<text>查看聊天记录</text>
				<view class="groupCell">
					<text>图片、文件等</text>
					<u-icon name="arrow-right" size="16" color="#ccc" style="margin-right: 10px;"></u-icon>
				</view>
			</view>
		</view>
		
		
		<view class="deleteBtn" v-if="isPermission" @click="removeMember">
			<text>移出群聊</text>
		</view>
		<view class="deleteBtn" @click="deleteFriend">
			<text>删除好友</text>
		</view>
		<u-modal showCancelButton :show="deleteShow" content='删除好友后将不再接收此人的消息,同时会删除与其的聊天记录,是否继续' showCancelButton @cancel="cancel"
			@confirm="confirm"></u-modal>
		<u-modal showCancelButton :show="removeShow" title="删除群成员" content='确认将该用户移除吗' showCancelButton @cancel="cancel"
			@confirm="removeConfirm"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				firendId: '',
				userInfo: {},
				deleteShow: false,
				removeShow:false,
				isManager:false,
				isFriend:false,
				isPermission:false,
				groupId:'',
				myGroupPermission:0,
				groupName:''
			}
		},
		onLoad(option) {
			this.isPermission = option?.isPermission == 'true' ? true  : false
			this.isManager = option.permission ? false : true
			this.firendId = option.friendId
			this.isFriend = option.isFriend || false
			this.groupId = option.groupId || ''
			this.getFriendInfo()
			this.groupId && this.getGroupInfo()
			console.log('213adas',this.isPermission,this.isFriend)
			uni.$on('refreshChatSetting', () => {
				this.getFriendInfo()
			})
		},
		methods: {
			checkHistory(){
				uni.navigateTo({
					url:`/pages/chat/history?friendId=${this.firendId}`
				})
			},
			changeNote() {
				uni.navigateTo({
					url: `./noteChange?note=${this.userInfo.note}&friendId=${this.firendId}`
				})
			},
			changeGroup() {
				uni.navigateTo({
					url: `./groupChange?group=${this.userInfo.group}&friendId=${this.firendId}`
				})
			},
			changePermission(){
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/changePermission',
							method: 'post',
							data: {
								account: that.firendId,
								group: that.groupId,
								permission:that.myGroupPermission ? 1 : 0
							},
							success: (data) => {
								uni.request({
									url: that.$baseUrl + '/group/changePermission',
									method: 'post',
									data: {
										account: that.firendId,
										groupId: that.groupId,
										permission:that.myGroupPermission ? 1 : 0
									},
									success: (data) => {
										
									}
								})
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
								friendId: that.firendId
							},
							success: (data) => {
								that.userInfo = data.data.friendMessage[0]

								console.log(that.userInfo)
							}
						})
					}

				})
			},
			getGroupInfo(){
				uni.request({
					url: this.$baseUrl + '/group/getGroupInfo',
					method: 'post',
					data: {
						groupId: this.groupId
					},
					success: (data) => {
						this.myGroupPermission = data.data.groupInfo.members.find(item => item.member == this.firendId).permission == 0 ? false : true
						console.log(this.myGroupPermission )
						this.groupName = data.data.groupInfo.groupName
					}
				})
			},
			cancel(){
				this.deleteShow = false
				this.removeShow = false
			},
			deleteFriend() {
				this.deleteShow = true
				
			},
			removeMember(){
				this.removeShow = true
			},
			confirm(){
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/contacts/deleteFriend',
							method: 'post',
							data: {
								account: res.data,
								friendId: that.firendId
							},
							success: (data) => {
								that.deleteShow = false
								uni.showToast({
									title: '已删除好友',
									duration: 2000,
									icon:'none',
									success() {
										that.socket.emit('updateMessageList')
										uni.reLaunch({
											url: '/pages/home/home'
										});
									}
								});
							}
						})
					}
				
				})
			},
			async removeConfirm(){
				console.log(this.userInfo)
				await this.clearGroupMemeberList()
			},
			
			
			
		
			
			
			clearMyGroupList(){
				uni.request({
					url: this.$baseUrl + '/users/quitGroup',
					method: 'post',
					data: {
						account: this.firendId,
						group: this.groupId + '',
						managers:[this.firendId+''],
						groupName:this.groupName
					},
					success: (data) => {
						this.removeShow = false
						
						// uni.reLaunch({
						// 	url:'/pages/home/home'
						// })
						uni.navigateBack({
							delta:2
						})
						this.socket.emit('updateMessageList')
					}
				})
			},
			clearGroupMemeberList() {
				uni.request({
					url: this.$baseUrl + '/group/quitGroup',
					method: 'post',
					data: {
						account: this.firendId,
						groupId: this.groupId + '',
					},
					success: (data) => {
						this.clearMyGroupList()
					}
				})
			},

		},
		onUnload() {
			uni.$emit('refreshChatSetting')
			uni.$emit('refreshgroupMemberList')
		}

	}
</script>

<style lang="scss" scoped>
	.chatSettingContainer {
		background: #f8f8f8;
		height: 100vh;
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
			justify-content: space-between;

			text {
				margin-right: 10rpx;
			}

			// .noteCell,
			// .groupCell {
			// 	flex: 1;
			// }

			.groupCell {
				display: flex;
				// justify-content: space-between;
				align-items: center;
				font-size: 36rpx;
				color: #ccc;

			}
		}

	}
	.infoItem,{
		font-size: 36rpx;
		display: flex;
		align-items: center;
		height: 100rpx;
		padding-left: 40rpx;
		justify-content: space-between;	
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
	/deep/ .u-modal__content__text{
		text-align: center;
	}
</style>