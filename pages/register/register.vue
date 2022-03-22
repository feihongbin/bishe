<template>
	<view class="register">
		<view class="title">
			输入手机号码
		</view>
		<view class="phoneInput">
			<text class="areaId">+86</text>
			<input type="text" placeholder="请输入手机号" v-model="phoneNumber" />
		</view>
		<button type="primary" :disabled="phoneNumber.length !== 11" @click="next">下一步</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phoneNumber:''
			};
		},
		methods:{
			next(){
				uni.navigateTo({
					url:'./code'
				})
			}
		}
	}
</script>

<style lang="scss">


.title{
	font-size: 72rpx;
	padding:40rpx 20rpx 20rpx;
}

.phoneInput{
		background: #fff;
		display: flex;
		margin: 40rpx 20rpx 40rpx;
		padding: 20rpx 0;
		.areaId{
			color: #58aff1;
			padding-right: 20rpx;
		}
		border-bottom: 2rpx #eee solid;
	}
button{
	margin: 0 20rpx;
}
</style>
