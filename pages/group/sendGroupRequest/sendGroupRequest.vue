<template>
	<view class="nameContainer">
		<view class="chatTopBar">
			<uni-icons type="back" size="24"></uni-icons>
			<view class="chatFriendInfo">
				<text class="friendName">验证信息</text>
				<!-- <text class="friendStatus">在线</text> -->
			</view>
			<text @click="submit">发送</text>
		</view>
		<text class="title">个人介绍</text>
		<view class="inputContainer">
			<!-- <u--input  class="input" v-model="signature"  border="none" :focus="true" clearable></u--input> -->

			<u--textarea class="input" v-model="message" border="none" :focus="true" placeholder="" count>
			</u--textarea>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				message: '',
				managers: [],
				groupInfo: {},
				account:'',
				groupId:''
			}
		},
		methods: {
			getGroupInfo() {
				uni.request({
					url: this.$baseUrl + '/group/getGroupInfo',
					method: 'post',
					data: {
						groupId: this.groupId,
					},
					success: (data) => {
						console.log(data.data.groupInfo)
						this.groupInfo = data.data.groupInfo
						this.managers = data.data.groupInfo.members.filter(item => item.permission > 0).map(
							i => i.member)
						console.log(this.managers)
					}
				})
			},
			submit() {
				uni.request({
					url: this.$baseUrl + '/users/groupRequest',
					method: 'post',
					data: {
						managers: this.managers,
						account:this.account,
						obj: {
							messgae:this.message,
							friendId:this.account,
							type:0,
							isRead:1,
							status:0,
							groupId:this.groupId
						}
					},
					success: (data) => {
						this.socket.emit('newGroupRequest',this.managers)
						uni.navigateTo({
							url:'./success'
						})
						
					}
				})
				// let that = this
				// uni.getStorage({
				// 	key: 'accountId',
				// 	success: function(res) {
				// 		uni.request({
				// 			url: that.$baseUrl + '/users/info/setSignature',
				// 			method: 'post',
				// 			data: {
				// 				account: res.data,
				// 				signature: that.signature
				// 			},
				// 			success: (data) => {
				// 				uni.navigateBack({
				// 					delta:1
				// 				})
				// 			}
				// 		})
				// 	}
				// })
				// this.show = false
				
			}
		},
		onLoad(option) {
			this.groupId = option.groupId
			this.account = option.account
			this.getGroupInfo()
		},
		// onUnload(){
		// uni.$emit('refreshData')
		// }
	}
</script>

<style lang="scss" scoped>
	.nameContainer {
		box-sizing: border-box;
		height: 100vh;
		background: #f8f8f8;
	}

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

	.title {
		position: relative;
		top: 160rpx;
		left: 20rpx;
		color: #9498a4;
	}

	.inputContainer {
		position: relative;
		top: 180rpx;
		padding-left: 20rpx;
		box-sizing: border-box;
		background: #fff;

		.input {
			padding: 20rpx;
			height: 360rpx;
		}
	}
</style>
