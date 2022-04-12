<template>
	<view class="requestDetailContainer">
		<view class="info" @click="checkDetail">
			<view class="baseInfo">
				<image src="../../../static/logo.png" mode=""></image>
				<text class="name">哈哈哈哈哈哈哈哈哈哈</text>
				<text class="tid">(214979722)</text>
			</view>
			<u-icon name="arrow-right" size="16" style="margin-right: 10px;"></u-icon>
		</view>
		<view class="extra">
			<text class="label">附加消息</text>
			<text class="content">我是哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</text>
		</view>
		<view class="btns">
			<u-button class="btn" text="拒绝"></u-button>
			<u-button class="btn" text="同意" type="primary"></u-button>
		</view>
	</view>      
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			checkDetail(){
				uni.navigateTo({
					url:'./searchResult'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.requestDetailContainer{
	background: #f8f8f8;
	height: 100vh;
	.info{
		background: #ffffff;
		padding: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #efefef;
		image{
			width: 100rpx;
			height: 100rpx;
			margin-right: 20rpx;
		}
		.baseInfo{
			display: flex;
			align-items: center;
		}
		.name{
			width: 200rpx;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space:nowrap;
			font-weight: 500;
		}
		.tid{
			color: #666666
		}
	}
	
	.extra{
		background: #ffffff;
		display: flex;
		align-items: center;
		padding: 50rpx 60rpx 50rpx 20rpx;
		border-bottom: 1px solid #efefef;
		.label{
			color: #666666;
			width: 140rpx;
			margin-right:20rpx ;
		}
		.content{
			flex: 1;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space:nowrap;
		}
	}
	.btns{
		display: flex;
		padding: 0 20rpx;
		margin-top: 40rpx;
		justify-content: space-between;
		.btn{
			flex: 1;
			margin: 10rpx;
		}
	}
}
</style>
