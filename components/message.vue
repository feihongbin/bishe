<template>
	<view>
		<u-swipe-action>
			<u-swipe-action-item :options="options" @click="swipe">
				<view class="messageContainer" :style="{'background': messageItem.isTop ? '#f8f8f8' : ''}">
					<image class="avatar" :src="messageItem.avatar" mode=""></image>
					<view class="messageContent" @click="toMessageDetail">
						<view class="nameAndTime">
							<text>{{!messageItem.isGroup ? messageItem.sender : messageItem.groupName}}</text>
							<!-- <text>{{messageItem.lastDate}}</text> -->
							<uni-dateformat :date="Number(messageItem.lastDate)" :threshold="[60000,3600000 * 24 * 7]"
								format="yyyy/mm/dd"></uni-dateformat>
						</view>
						<view class="content">
							{{messageItem.isGroup ? ((messageItem.sender ? (messageItem.sender +':') : '') + messageItem.lastContent) : messageItem.lastContent}}
						</view>
						<text class="messageNumber" v-if="messageItem.notRead>0">
							{{messageItem.notRead | isNumberOverflow}}

						</text>

					</view>
				</view>
			</u-swipe-action-item>
		</u-swipe-action>
	</view>

	</view>
</template>

<script>
	export default {
		name: "message",
		props: {
			messageItem: {}
		},
		filters: {
			isNumberOverflow(num) {
				return num > 99 ? '99+' : num
			}
		},
		data() {
			return {
			};
		},
		computed: {
			options() {
				return [{
					text: this.messageItem.isTop ? '取消置顶' : '置顶',
					style: {
						backgroundColor: '#c9c8ce',
						width: '140rpx'
					}
				}, {
					text: this.messageItem.notRead === 0 ? '标为未读' : '标位已读',
					style: {
						backgroundColor: '#fb9c00',
						width: '140rpx'
					}
				}, {
					text: '删除',
					style: {
						backgroundColor: '#ff3a32',
						width: '140rpx'
					}
				}]
			}
		},
		methods: {
			toMessageDetail(item) {
				if(this.messageItem.isShow){
					if(this.messageItem.isGroup){
						uni.navigateTo({
							url: `/pages/chat/groupChatPage?groupName=${this.messageItem.sender}&groupId=${this.messageItem.friendId}`
						})
					}else{
						uni.navigateTo({
							url: `/pages/chat/chatPage?name=${this.messageItem.sender}&friendId=${this.messageItem.friendId}`
						})
					}
				}else {
					uni.navigateTo({
						url:`/pages/group/groupInfoMessage`
					})
				}
				
				
				
			},
			swipe(index) {
				console.log(index)
				if (index.index === 0) {
					this.setIsiTop()
				}
				if(index.index === 1){
					this.setNotRead()
				}
				if(index.index === 2){
					this.deleteMessage()
				}
			},
			setIsiTop() {
				uni.request({
					url: this.$baseUrl + '/users/chat/setIsTop',
					method: 'post',
					data: {
						account: this.messageItem.account,
						friendId: this.messageItem.friendId,
						isTop: this.messageItem.isTop
					},
					success: (data) => {
						this.isTop = data.data.isTop
						uni.$emit('refreshHomeMessage')
					}
				})
			},
			setNotRead() {
				uni.request({
					url: this.$baseUrl + '/users/chat/setNotRead',
					method: 'post',
					data: {
						account: this.messageItem.account,
						friendId: this.messageItem.friendId,
						notRead: this.messageItem.notRead === 0 ? 1 : 0
					},
					success: (data) => {
						uni.$emit('refreshHomeMessage')
					}
				})
			},
			deleteMessage(){
				uni.request({
					url: this.$baseUrl + '/users/chat/deleteMessage',
					method: 'post',
					data: {
						account: this.messageItem.account,
						friendId: this.messageItem.friendId
					},
					success: (data) => {
						uni.$emit('refreshHomeMessage')
					}
				})
			}
		},
		mounted() {

		}
	}
</script>

<style lang="scss" scoped>
	.messageContainer {
		display: flex;
		padding: 20rpx 20rpx 0;

		.avatar {
			width: 100rpx;
			height: 100rpx;
		}

		.messageContent {
			flex: 1;
			position: relative;
			box-sizing: border-box;

			.nameAndTime {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				padding: 10rpx 20rpx;
				padding-top: 0rpx;

				text:nth-child(1) {

					font-size: 36rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					max-width: 420rpx;
				}

				text:nth-child(2) {
					font-size: 20rpx;
					color: #666;
				}
			}
		}

		.content {
			min-width: 400rpx;
			max-width: 500rpx;
			padding: 0 20rpx;
			color: #666;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 24rpx;
		}

		.messageNumber {
			display: inline-block;
			position: absolute;
			top: 56rpx;
			right: 30rpx;
			font-size: 18rpx;
			border-radius: 30rpx;
			background-color: red;
			color: #fff;
			padding: 2rpx 6rpx;
			min-width: 20rpx;
			text-align: center;
		}
	}

</style>
