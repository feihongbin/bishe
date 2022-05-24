<template>
	<view class="nameContainer">
		<view class="chatTopBar">
			<text></text>
			<view class="chatFriendInfo">
				<text class="friendName">发送成功</text>
				<!-- <text class="friendStatus">在线</text> -->
			</view>
			<text @click="submit">关闭</text>
		</view>
		<view class="inputContainer">
			<!-- <u--input  class="input" v-model="signature"  border="none" :focus="true" clearable></u--input> -->
			<u-icon  size="40" name="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/success.png"></u-icon>
			<text style="color: #a6a6a6;">请求发送成功，等待管理员审核</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				signature: ''
			}
		},
		methods: {
			submit() {

				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/info/setSignature',
							method: 'post',
							data: {
								account: res.data,
								signature: that.signature
							},
							success: (data) => {
								uni.reLaunch({
									url:'/pages/home/home'
								})
							}
						})
					}
				})
				// this.show = false

			}
		},
		onLoad(option) {
			this.signature = option.signature
		},
		onUnload(){
			uni.$emit('refreshData')
		}
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
	

	.inputContainer {
		position: relative;
		top: 150rpx;
		padding: 60rpx 0 60rpx;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
