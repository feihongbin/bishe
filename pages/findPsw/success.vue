<template>
	<view class="successContainer">
		<view class="success">
			<view class="u-content__circle">
				<u-icon name="checkbox-mark" color="#fff" size="30"></u-icon>
				
			</view>
			<view class="u-content__tip">
				<text>密码修改成功</text>
			</view>
			
		</view>
		<button class="u-content__button" type="primary" @click="toLogin()">返回登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods:{
			toLogin(){
				uni.reLaunch({
					url:'../login/login'
				})
				
			}
		}
	}
</script>

<style lang="scss">
	.successContainer{
		padding: 0 40rpx;
	}
	.success {
		padding: 40rpx 60rpx 0;
		@include flex(column);
		align-items: center;
		justify-content: center;
	
		.u-content__circle {
			background-color: $u-success;
			@include flex;
			border-radius: 100px;
			width: 60px;
			height: 60px;
			align-items: center;
			justify-content: center;
			margin-bottom: 20rpx;
		}
		.u-content__tip{
			font-size: 36rpx;
			font-weight: 900;
			margin-bottom: 40rpx;
		}
	}
	
</style>
