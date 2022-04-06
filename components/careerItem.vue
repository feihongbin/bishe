<template>
	<view class="careerItem">
		<view class="careerTag">
			<u-tag :text="this.tag"  size="mini" :type="this.type"></u-tag>
		</view>
		<text>{{content}}</text>
	</view>
</template>

<script>
	export default {
		props:{
			tag:String,
			type:String,
			content:String
		}
	}
</script>

<style lang="scss">
	.careerItem{
		display: flex;
		align-items: center;
		padding: 20rpx 20rpx;
		border-bottom: solid 1px #e5e5e5 ;
	}
	.careerTag{
		width: 80rpx;
		margin-right: 20rpx;
	}
</style>

<style lang="scss" scoped>
/deep/	.u-tag{
		justify-content: center;
	}
</style>

