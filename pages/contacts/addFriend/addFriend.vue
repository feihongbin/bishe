<template>
	<view class="addFriendContainer">
		<view class="addFriend">
			<view class="searchInput">
				<uni-icons type="search" color="#b3b3b3" size="24" ></uni-icons>
				<input confirm-type="search" v-model="searchInput" placeholder="搜索联系人/群" />
			</view>
		</view>
		<view class="searchList" v-if="searchInput !== ''" @click="toResult()">
			<u-icon class="addIcon" name="man-add-fill" size="32"></u-icon>
			<text>找人: {{searchInput}}</text>
		</view>
		<view class="searchList" v-if="searchInput !== ''" @click="toResult()">
			<u-icon class="addIcon" name="man-add-fill" size="32"></u-icon>
			<text>找群: {{searchInput}}</text>
		</view>
	</view>

</template>

<script>
	export default {

		data() {
			return {
				searchInput: ''
			};
		},
		methods:{
			toResult(){
				console.log(this.searchInput)
				// uni.navigateTo({
				// 	url:`./addFriend/searchResult?id=${this.searchInput}`
				// })
				uni.navigateTo({
					url:`./searchResult?id=${this.searchInput}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.addFriendContainer{
		background: #f7f7f7;
		height: 100vh;
	}
	.addFriend {
		background-color: #f7f7f7;
		padding: 0 20rpx;
		margin-top: -20rpx;
		margin-bottom: 40rpx;

	}

	.searchList {
		display: flex;
		align-items: center;
		background: #ffffff;
		padding: 10rpx 30rpx;
		border-bottom: 1px solid #dedede;
		.addIcon{
			width: 60rpx;
			margin-right: 30rpx;
		}
	}
	.searchInput{
	display: flex;
	
	background-color: #fff;
	padding: 10rpx;
	border-radius: 10rpx;
	margin-top: 20rpx;
}
</style>
