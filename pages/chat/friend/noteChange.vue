<template>
	<view class="nameContainer">
		<view class="chatTopBar">
			<uni-icons type="back" size="24"></uni-icons>
			<view class="chatFriendInfo">
				<text class="friendName">修改备注</text>
			</view>
			<text @click="submit">完成</text>
		</view>
		<view class="inputContainer">
			<u--input class="input" v-model="note" border="none" :focus="true" clearable></u--input>
		</view>
		<!-- <u-notify ref="uNotify"></u-notify> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				note: '',
				friendId:''
			}
		},
		
		methods: {
			// showTip() {
			// 	this.$refs.uNotify.show({
			// 		top: 10,
			// 		type: 'error',
			// 		color: '#000',
			// 		bgColor: '#ffffff',
			// 		message: '备注不能为空',
			// 		duration: 1000 * 3,
			// 		fontSize: 20,
			// 		safeAreaInsetTop: true
			// 	})
			// },
			submit() {
				
					let that = this
					uni.getStorage({
						key: 'accountId',
						success: function(res) {
							uni.request({
								url: that.$baseUrl + '/users/info/setNote',
								method: 'post',
								data: {
									account: res.data,
									friendId:that.friendId,
									note: that.note
								},
								success: (data) => {
									uni.navigateBack({
										delta:1
									})
								}
							})
						}
					})
				
			}
		},
		
		onLoad(option) {
			this.note = option.note
			this.friendId = option.friendId
		},
		onUnload(){
			uni.$emit('refreshChatSetting')
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
			height: 100rpx;
		}
	}
</style>
