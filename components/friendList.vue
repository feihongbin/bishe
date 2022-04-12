<template>
	<view class="indexListContianer">
		<u-index-list :index-list="indexList" class="friendList" :sticky="false">
			<template v-for="(item, index) in itemArr">
				<u-index-item>
					<u-index-anchor bgColor="#fff" :text="indexList[index]"></u-index-anchor>
					<view class="list-cell" v-for="(cell, index) in item">
						<image src="../static/logo.png" mode=""></image>
						<text>{{cell}}</text>
					</view>
				</u-index-item>
			</template>
		</u-index-list>
	</view>
</template>

<script>
	export default {
		name: "friendList",
		data() {
			return {
				indexList: ["A", "B"],
				itemArr: [
					['列表A1', '列表A2', '列表A3'],
					['列表B1', '列表B2', '列表B3'],
			
				]
			};
		}
	}
</script>

<style lang="scss">
	.friendList{
		padding-left: 20rpx;
	}
	.list-cell {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
		padding: 10px 24rpx;
		overflow: hidden;
		color: #323233;
		font-size: 14px;
		line-height: 24px;
		background-color: #fff;
		image{
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
			border-radius: 20rpx;
		}
	}
</style>
<style lang="scss" scoped>
	.u-border-bottom{
		border-bottom-width:0 !important;
	}
	// .u-border-bottom{
	// 	margin: 10rpx 0 !important;
	// }
	// .indexListContianer{
	// 	// height: 400rpx;
	// 	overflow: hidden;
	// }
</style>
