<template>
	<view class="mineContainer">
		<uni-icons type="back" size="24"></uni-icons>
		<view class="info">
			<image class="avatar" src="../../static/logo.png" mode=""></image>
			<view>
				<text class="name">嘿哈</text>
				<text class="signature">让我们一起成为更好的人吧</text>
			</view>
		</view>
		<view class="detail">
			<!-- <info-item class="detailItem" v-for="(item,index) in infoList" :label="item.label" :content="item.content" :showArrow="item.showArrow" :to="item.to"></info-item> -->
			<info-item class="detailItem" label="账号" content="123456789" :showArrow="false" @click.native="click"></info-item>
			<info-item class="detailItem" label="性别" content="男" showArrow @click.native="click"></info-item>
			<info-item class="detailItem" label="生日" content="2001-11-10" showArrow @click.native="birthClick('?birth=2001-11-10')"></info-item>
			<info-item class="detailItem" label="所在地" content="浙江-杭州" showArrow @click.native="locationClick('?location=浙江-杭州')"></info-item>
			<info-item class="detailItem" label="家乡" content="浙江-杭州" showArrow @click.native="nativeClick('?native=浙江-杭州')"></info-item>
			<info-item class="detailItem" label="职业" content="计算机/互联网/通信" showArrow @click.native="careerClick('')"></info-item>
		</view>
	</view>
</template>

<script>
	import InfoItem from '../../components/infoItem.vue'
	export default {
		data() {
			return {
				columns: [
					['中国', '美国', '日本']
				],
				infoList:[
					{
						label:'账号',
						content:'1234567890',
						showArrow:false,
						to:''
					},
					{
						label:'性别',
						content:'男',
						showArrow:true,
						to:'gender'
					},
					{
						label:'生日',
						content:'2001-11-10',
						showArrow:true,
						to:`date=2001-11-10`
					},
				]
			};
		},
		components: {
			InfoItem
		},
		methods:{
			birthClick(str){
				uni.navigateTo({
					url:`editInfo/birth${str}`
				})
			},
			locationClick(str){
				uni.navigateTo({
					url:`editInfo/location${str}`
				})
			},
			nativeClick(str){
				uni.navigateTo({
					url:`editInfo/native${str}`
				})
			},
			careerClick(){
				uni.navigateTo({
					url:`editInfo/career`
				})
			}
		}
	}
</script>

<style lang="scss">
	.mineContainer {
		padding: 80rpx 20rpx 0;
		background-color: #f8f8f8;
		height: 100vh;
		.info {
			display: flex;
			align-items: center;
			margin-top: 60rpx;
			margin-left: 60rpx;

			.avatar {
				width: 160rpx;
				height: 160rpx;
				margin-right: 20rpx;
			}

			view {
				display: flex;
				flex-direction: column;

				.name {
					font-size: 48rpx;
				}

				.signature {
					font-size: 30rpx;
					color: #333333;
				}
			}
		}

		.detail {
			padding: 0rpx 0rpx 20rpx;
			margin-top: 40rpx;
			background-color: #FFFFFF;
			border-radius: 20rpx;
		}
	}
	.detailItem:nth-child(1){
		padding-top: 40rpx;
	}
</style>
