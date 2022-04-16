<template>
	<view>
		<view class="chatTopBar">
			<uni-icons type="back" size="24"></uni-icons>
			<view class="chatFriendInfo">
				<text class="friendName">{{friendMessage.note || friendMessage.name}}</text>
				<text class="friendStatus">在线</text>
			</view>
			<uni-icons type="bars" size="24"></uni-icons>
		</view>
		<scroll-view class="chatContent" scroll-y="true" scroll-with-animation="true">
			<view class="">
				<chat-message :avatar="friendMessage.avatar" :messageList="friendMessage.messages"></chat-message>
			</view>
			<view v-if="isShowBlank" class="blankContent"></view>
		</scroll-view>
		<send-message-input :friendId="friendId" @showBlank="showBlank"></send-message-input>
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
				message: [{
						content: '昨天下午 6:31',
						type: 'time',
						tag: 'text'
					},

					{
						content: '你好啊',
						type: 'others',
						tag: 'text'
					},
					{
						content: 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/avatar/1.jpeg',
						type: 'myself',
						tag: 'image'
					}
				],
				isShowBlank: false,
				friendMessage: {},
				account:''
			};
		},
		onLoad: function(option) {
			this.name = option.name
			this.friendId = option.friendId
			this.acceptMessage()
			this.getFriendInfo()
			this.getAccount()
			

		},
		methods: {
			showBlank(val) {
				console.log(val)
				this.isShowBlank = val
			},
			getAccount(){
				let that = this
				uni.getStorage({
					key:'accountId',
					success:function(res){
						that.account = res.data
						console.log(res.data)
						console.log(that.account )
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
								console.log(data)
								that.friendMessage = data.data.friendMessage[0]
							}
						})
					}
				})
			},
			acceptMessage() {

				this.socket.on('news', (data) => {
					
					this.friendMessage.messages.push({
						content: data.content,
						type: this.account === data.account ? 'myself' : 'others',
						tag: 'text'
					})
					console.log(data)
					console.log('ac:',data.account,'acc:',this.account,this.friendMessage.messages)
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
