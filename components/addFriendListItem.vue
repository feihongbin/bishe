<template>
	<view class="addFriendListItem" >
		<view class="friendBaseInfo" @click="toDetail">
			<image class="avatar" src="../static/logo.png" mode=""></image>
			<view class="baseInfo">
				<text>哈哈哈哈</text>
				<text>我是哈哈哈哈哈</text>
			</view>
		</view>
		<view class="agreeBtn">
			<u-button color="#eaedf4" text="同意" style="color:#000;" @click="agree"></u-button>
		</view>
	</view>
</template>

<script>
	export default {
		name:"addFriendListItem",
		data() {
			return {
				
			};
		},
		methods:{
			toDetail(){
				uni.navigateTo({
					url:'./requestDetail'
				})
			},
			agree(){
				console.log('同意')
			}
		}
	}
</script>

<style lang="scss" scoped>
.addFriendListItem{
	background: #ffffff;
	padding: 20rpx 40rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.friendBaseInfo{
		display: flex;
		.avatar{
			width: 100rpx;
			height: 100rpx;
			margin-right: 20rpx;
		}
		.baseInfo{
			display: flex;
			flex-direction: column;
			text:nth-child(1){
				font-weight: 500;
				font-size: 36rpx;
			}
			text:nth-child(2){
				color: #666;
				font-size: 30rpx;
			}
		}
	}
	
	.agreeBtn{
	}
}
</style>
