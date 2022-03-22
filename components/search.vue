<template>
	<view class="searchInput">
		<uni-icons type="search" color="#b3b3b3" size="24" ></uni-icons>
		<input type="text" value="" placeholder="搜索" />
	</view>
</template>

<script>
	export default {
		name:"search",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.searchInput{
	display: flex;
	
	background-color: #fff;
	padding: 10rpx;
	border-radius: 10rpx;
	margin-top: 20rpx;
}
</style>
