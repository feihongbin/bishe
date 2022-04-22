<template>
	<view>
		<view class="chatTopBar">
			<uni-icons type="back" size="24"></uni-icons>
			<view class="chatFriendInfo">
				<view class="friendNameBox"><text class="friendName">{{groupName}}</text><text>({{100}})</text></view>
				<text class="friendStatus">3人在线</text>
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
				avatar:'',
				groupInfo:{},
				scrollView:''
			};
		},
		onLoad: function(option) {
			this.groupName = option.groupName
			this.groupId = option.groupId
			// this.acceptGroupMessage(data)
			// this.getFriendInfo()
			this.getAccount()
			this.getGroupInfo(option.groupId)
			this.socket.on('getUpdatedGroupMessage',(data)=>{
				if(this.groupInfo.members.some(item => item.member === this.account)){
					console.log('data',this.account)
					this.getGroupInfo(option.groupId)
					// this.saveHomeMessageList({
					// 	account:this.account,
					// 	friendId:this.groupInfo.groupId,
					// 	sender:this.groupInfo.members.find(item => item.member === this.account).groupNote,
					// 	lastDate:Date.now(),
					// 	isShow:true,
					// 	lastContent:data.content,
					// 	notRead:2,
					// 	isGroup:true,
					// 	isTop:false,
					// 	groupName:this.groupInfo.groupName,
					// 	isRemind:true,
					// 	avatar:this.groupInfo.groupAvatar
					// })
				}
			})
			this.socket.on('acceptGroupMessage',data => {
				this.acceptGroupMessage(data)
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
					}
				})
			},
			toSetGroup() {
				uni.navigateTo({
					url: `/pages/group/groupSetting?id=${this.groupId}`
				})
			},
			getGroupInfo(groupId){
				uni.request({
					url: this.$baseUrl + '/group/getGroupInfo',
					method: 'post',
					data: {
						groupId:groupId
					},
					success: (data) => {
						console.log('groupInfo', data.data.messageList)
						this.groupMessage = data.data.messageList
						this.groupInfo = data.data.groupInfo
						this.$nextTick(function(){
							this.scrollView = "msg"+this.groupMessage[this.groupMessage.length - 1].mid
						})
					}
				})
			},
		
			saveHomeMessageList(obj){
				console.log('save')
				uni.request({
					url: this.$baseUrl + '/users/chat/saveHomeMessageList',
					method: 'post',
					data:obj,
					success: (data) => {
						this.socket.emit('updateMessageList',{
							account:this.account,
							friendId:this.groupId
						})
					}
				})
			},
			acceptGroupMessage(data){
				
					let time = Date.now()
					let timeDiff = this.groupMessage?.length > 0 ? time - this.groupMessage[this.groupMessage.length - 1].time : 999999999999999
					if (timeDiff > 1000 * 60 * 3) {
						uni.request({
							url: this.$baseUrl + '/group/acceptGroupMessage',
							method: 'post',
							data: {
								groupId:data.groupId,
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
							groupId:data.groupId,
							message: {
								mid: data.groupId + data.account + time,
								content: data.content,
								sender: data.account,
								tag: 'text',
								time: time,
								isRead: 0
							}
						},
						success: (res) => {
							this.socket.emit('updateGroupMessageList',data)
							this.groupInfo.members.forEach((item)=>{
								this.saveHomeMessageList({
									account:item.member,
									friendId:this.groupInfo.groupId,
									sender:this.groupInfo.members.find(item => item.member === this.account).groupNote,
									lastDate:time,
									isShow:true,
									lastContent:data.content,
									notRead:2,
									isGroup:true,
									isTop:false,
									groupName:this.groupInfo.groupName,
									isRemind:true,
									avatar:this.groupInfo.groupAvatar
								})
							})
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
		padding: 80rpx 20rpx 0;

		display: flex;
		justify-content: space-between;

		.chatFriendInfo {
			display: flex;
			flex-direction: column;
			align-items: center;
			
			.friendNameBox{
				display: flex;
				justify-content: center;
				.friendName {
					width: 50%;
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
