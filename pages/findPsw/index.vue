<template>
	<view class="findPsw">
		<text class="findPswTitle">找回密码</text>
		<view class="accountInput">
			<text>账号</text>
			<input id='account' type="text" v-model="account" placeholder="账号/手机号" />
		</view>
		
		<button type="primary" :disabled="account.length<=0" @click="next">下一步</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				account:''
			};
		},
		methods:{
			next(){
				console.log(1)
				uni.navigateTo({
					url:'./phone'
				})
			}
		}
	}
</script>

<style lang="scss">
.findPsw{
	padding: 0 40rpx;
	.findPswTitle{
		display: block;
		font-size: 72rpx;
		margin: 60rpx 0;
	}
	.accountInput{
		display: flex;
		margin-bottom: 60rpx;
		border-bottom: 2rpx #eee solid;
		padding-bottom: 20rpx;
		text{
			padding-right: 20rpx;
		}
	}
	
}
</style>
