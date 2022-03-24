<template>
	<view>
		<u-collapse accordion :border="false">
			<u-collapse-item>
				<!-- <u-icon name="play-right-fill" size="20" slot="icon"></u-icon> -->
				<text slot="right-icon">
					<u-icon name="arrow-up-fill" size="16" color="#cfcfcf"></u-icon>
				</text>
				<text slot="title">
					<view class="groupTitle">
						<text>特别关注</text>
						<text>2/10</text>
					</view>
				</text>
				<text class="u-collapse-content">
					<view class="friend" v-for="(item,index) in friendsList">
						<image class="friendAvatar" src="../static/logo.png" mode=""></image>
						<text class="friendName">{{item}}</text>
					</view>
				</text>
			
			</u-collapse-item>
		</u-collapse>
	</view>
</template>

<script>
	export default {
		name: "group",
		data() {
			return {
				friendsList:['张三','李四','王五','朱六']
			};
		}
	}
</script>

<style lang="scss">
	.groupTitle{
		display: flex;
		justify-content: space-around;
		align-items: center;
		text:nth-child(1){
			flex: 1;
			font-size: 36rpx;
		}
		text:nth-child(2){
			font-size: 24rpx;
			color: #666;
		}
	}
	.friend{
		display: flex;
		align-items: center;
		height: 120rpx;
		.friendAvatar{
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
			border-radius: 20rpx;
		}
		.friendName{
			color: #000000;
		}
	}
</style>

<style lang="scss" scoped>
/deep/	.u-cell__body__content{
		order: 2 ;
	}
/deep/	.u-cell__right-icon-wrap--up{
		transform: rotate(180deg);
	}
/deep/	.u-cell__right-icon-wrap--down{
		transform: rotate(90deg);
	}
/deep/	.u-cell__right-icon-wrap{
		margin-left: 0;
		margin-right: 8rpx;
	}

</style>
