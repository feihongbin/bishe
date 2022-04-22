<template>
	<view class="nameContainer">
		<view class="chatTopBar">
			<uni-icons type="back" size="24"></uni-icons>
			<view class="chatFriendInfo">
				<text class="friendName">修改我的签名</text>
				<!-- <text class="friendStatus">在线</text> -->
			</view>
			<text @click="submit">发布</text>
		</view>
		<view class="inputContainer">
			<!-- <u--input  class="input" v-model="signature"  border="none" :focus="true" clearable></u--input> -->
			<u--textarea class="input" v-model="signature" border="none" :focus="true" placeholder="" count>
			</u--textarea>
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
								uni.navigateBack({
									delta:1
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
