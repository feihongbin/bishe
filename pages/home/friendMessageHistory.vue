<template>
	<view>
		<view class="tips">
			共{{messageInfo[0].count}}条与"{{content}}"相关的聊天记录
		</view>
		<view class="messageContainer" v-for="(item,index) in messageInfo[0].messages" :key="index" @click="toContentDetail(item.mid)">
			<image class="avatar" :src="item.type == 'myself' ? userInfo.avatar : messageInfo[0].avatar" mode=""></image>
			<view class="messageContent" @click="toMessageDetail">
				<view class="nameAndTime">
					<text>{{item.type == 'myself' ? userInfo.name : (messageInfo[0].note || messageInfo[0].name)}}</text>
					<uni-dateformat :date="Number(item.time)" :threshold="[60000,3600000 * 24 * 7]"
						format="yyyy/mm/dd"></uni-dateformat>
				</view>
				<view class="content">
					{{item.content}}
				</view>
			</view>
		</view>
		
		
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:{},
				friendId:'',
				friendName:'',
				content:'',
				messageInfo:[]
			}
		},
		onLoad(option) {
			this.friendId = option.friendId
			this.content = option.search
			this.friendName = option.friendName
			uni.setNavigationBarTitle({
			title:option.friendName
			})
			this.getContact(this.content)
		},
		methods: {
			getContact(content) {
				let that = this
				uni.getStorage({
					key: 'accountId',
					success(res) {
						uni.request({
							url: that.$baseUrl + '/users/search',
							method: 'post',
							data: {
								account: res.data,
								content1:content
							},
							success: (data) => {
								if (content) {
									console.log(content)
									let exp = eval("/" + content + "/g");
									that.messageInfo =  data.data.friends.map(item => {
										let count = 0
										let messages = []
										if(item.friendId){
											for(let meg of item.messages){
												if(meg.tag == 'text' && meg.type!= 'time' && meg.content.includes(content)){
													count++
													messages.push(meg)
												}
											}
											return {
												friendId:item.friendId,
												avatar:item.avatar,
												note:item.note,
												name:item.name,
												count:count,
												messages:messages
											}
										}
										
									})
									that.messageInfo = that.messageInfo.filter(item => item && item.friendId == that.friendId)
									console.log(that.messageInfo)
								}
							}
						})
						
						uni.request({
							url: that.$baseUrl + '/users/info',
							method: 'post',
							data: {
								account: res.data,
							},
							success: (data) => {
								that.userInfo = data.data.info
								console.log(that.userInfo)
							}
						})
					}
				})
			},
			toContentDetail(id){
				uni.navigateTo({
					url:`/pages/chat/chatPage?name=${this.friendName}&friendId=${this.friendId}&mid=${id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.messageContainer {
		display: flex;
		padding: 20rpx 20rpx 20rpx;

		.avatar {
			width: 80rpx;
			height: 80rpx;
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

					font-size: 32rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					max-width: 420rpx;
				}

				text:nth-child(2) {
					font-size: 28rpx;
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
			font-size: 28rpx;
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
	
	.tips{
		padding: 20rpx;
		color: #c1c1c3;
		border-bottom: 1px solid #c1c1c3;
	}
</style>
