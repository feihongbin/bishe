<template>
	<view class="messageInput">
		<uni-icons type="sound" size="30"></uni-icons>
		<input  class="contentInput" type="text" value="" />
		<uni-icons type="plus" size="30"></uni-icons>
	</view>
</template>

<script>
	export default {
		name:"sendMessageInput",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.messageInput{
	position: fixed;
	bottom: 0rpx;
	z-index: 999;
	width: 100%;
	height: 120rpx;
	background: #fff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.contentInput{
		flex: 1;
		background-color:#f8f8f8 ;
		margin: 10rpx 30rpx;
		padding: 15rpx;
		border-radius: 20rpx;
		caret-color: #1e6eff;
	}
}
</style>
