<template>
	<view>
		<u-collapse @change="change" @close="close" @open="open" :value="['1']">
			<u-collapse-item>
				<text slot="right-icon">
					<u-icon name="arrow-up-fill" size="16" color="#cfcfcf"></u-icon>
				</text>
				<text slot="title">
					<view class="groupTitle">
						<text>2022年5月</text>
					</view>
				</text>
				<view class="u-collapse-content contentItem">
					 <u-album :urls="urls1" keyName="src2" :rowCount="4" :space="10"></u-album>
				</view>
			</u-collapse-item>
			
			
			<u-collapse-item>
				<text slot="right-icon">
					<u-icon name="arrow-up-fill" size="16" color="#cfcfcf"></u-icon>
				</text>
				<text slot="title">
					<view class="groupTitle">
						<text>2022年4月</text>
					</view>
				</text>
				<view class="u-collapse-content contentItem">
					 <u-album :urls="urls1" keyName="src2" :rowCount="4" :space="10"></u-album>
				</view>
			</u-collapse-item>
		</u-collapse>
	</view>
</template>

<script>
	export default {
		name: "historyImg",
		data() {
			return {
			
				urls1: [
					{
					src2: 'https://cdn.uviewui.com/uview/album/1.jpg',
					},
					{
					src2: 'https://cdn.uviewui.com/uview/album/1.jpg',
					},
					{
					src2: 'https://cdn.uviewui.com/uview/album/1.jpg',
					},
					{
					src2: 'https://cdn.uviewui.com/uview/album/1.jpg',
					},
					{
					src2: 'https://cdn.uviewui.com/uview/album/1.jpg',
					},
					{
					src2: 'https://cdn.uviewui.com/uview/album/1.jpg',
					},
					{
					src2: 'https://cdn.uviewui.com/uview/album/1.jpg',
					},
				]
			};
		}
	}
</script>

<style lang="scss" scoped>
.contentItem{
	margin-left: 10rpx;
	
}
</style>

<style lang="scss" scoped>
	/deep/ .u-cell__body__content {
		order: 2;
	}

	/deep/ .u-cell__right-icon-wrap--up {
		transform: rotate(180deg);
	}

	/deep/ .u-cell__right-icon-wrap--down {
		transform: rotate(90deg);
	}

	/deep/ .u-cell__right-icon-wrap {
		margin-left: 0;
		margin-right: 8rpx;
	}

	/deep/ .u-tooltip__wrapper__text {
		font-size: 36rpx;
	}
</style>
