<template>
	<view class="more">
		<view class="moreList">
			<view class="moreItem"><u-icon name="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/photo.png" size="42" @click="chooseImg()"></u-icon><text>图片</text></view>
			<view class="moreItem"><u-icon name="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/camera.png" size="42"></u-icon><text>拍摄</text></view>
			<view class="moreItem"><u-icon name="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/phone.png" size="42"></u-icon><text>语音通话</text></view>
			<view class="moreItem"><u-icon name="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/vedio.png" size="42"></u-icon><text>视频通话</text></view>
		</view>
		<view class="moreList">
			<view class="moreItem"><u-icon name="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/file.png" size="40"></u-icon><text>文件</text></view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {}
		},
		methods:{
			chooseImg(){
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function (res) {
						console.log(JSON.stringify(res.tempFilePaths));
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.more{
		height: 278px;
		width: 100%;
		
		.moreList{
			display: flex;
			justify-content: space-between;
			padding: 0 60rpx;
			margin: 60rpx 0 80rpx;
		}
		// .moreList:nth-child(2){
		// 	display: flex;
		// 	justify-content: flex-start;
		// }
		.moreItem{
			// margin: 0 20rpx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			font-size: 24rpx;
			
		}
		
	}
</style>
