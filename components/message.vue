<template>
	<view>
		<u-swipe-action>
			<u-swipe-action-item :options="options">
				<view class="messageContainer">
					<image class="avatar" :src="messageItem.avatar" mode="aspectFit"></image>
					<view class="messageContent" @click="toMessageDetail">
						<view class="nameAndTime">
							<text>{{messageItem.sender}}</text>
							<!-- <text>{{messageItem.lastDate}}</text> -->
							<uni-dateformat :date="Number(messageItem.lastDate)" :threshold="[60000,3600000 * 24 * 7]" format="yyyy/mm/dd"></uni-dateformat>
						</view>
						<view class="content">
							{{messageItem.lastContent}}
						</view>
						<text class="messageNumber" v-if="messageItem.notRead>0">
							{{messageItem.notRead | isNumberOverflow}}
							
						</text>
					</view>
				</view>
			</u-swipe-action-item>
		</u-swipe-action>
	</view>






	<!-- <image class="avatar" src="../static/logo.png" mode="aspectFit"></image>
		<view class="messageContent" @click="toMessageDetail">
			<view class="nameAndTime">
				<text>{{name}}</text>
				<text>{{time}}</text>
			</view>
			<view class="content">
				{{content}}
			</view>
			<text class="messageNumber" v-if="messageNumber>0">
				{{messageNumber | isNumberOverflow}}
			</text>
		</view> -->









	</view>
</template>

<script>
	export default {
		name: "message",
		props: {
			messageItem:{}
		},
		filters: {
			isNumberOverflow(num) {
				return num > 99 ? '99+' : num
			}
		},
		data() {
			return {
				options: [{
					text: '置顶',
					style: {
						backgroundColor: '#c9c8ce',
						width:'140rpx'
					}
				}, {
					text: '标为未读',
					style: {
						backgroundColor: '#fb9c00',
						width:'140rpx'
					}
				},{
					text: '删除',
					style: {
						backgroundColor: '#ff3a32',
						width:'140rpx'
					}
				}]
			};
		},
		methods: {
			toMessageDetail() {
				uni.navigateTo({
					url: `/pages/chat/chatPage?name=${this.messageItem.sender}&id=${this.messageItem.friendId}`
				})
				console.log(this.id)
			}
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

			.nameAndTime {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				padding: 10rpx 20rpx;
				padding-top: 0rpx;

				text:nth-child(1) {
					font-size: 36rpx;
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
