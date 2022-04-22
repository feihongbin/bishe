<template>
	<view class="infoItemContainer" @click="editInfo">
		<view class="infoItem">
			<text class="label">{{label}}</text>
			<text class="content">{{content}}</text>
		</view>
		<u-icon v-if="showArrow" name="arrow-right"  size="16"></u-icon>
	</view>
</template>

<script>
	export default {
		name:"infoItem",
		data() {
			return {
				
			};
		},
		props:{
			label:String,
			content:String,
			showArrow:{
				type:Boolean,
				default:true
			},
			to:String
		},
		methods:{
			editInfo(){
				console.log(this.to)
				uni.navigateTo({
					url:`/pages/mine/editInfo`
				})
			}
		}
	}
</script>

<style lang="scss">
.infoItemContainer{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 40rpx;
	.infoItem{
		display: flex;
		flex-direction: column;
		.label{
			color:#666
		}
	}
}
.infoItemContainer:active{
	background: #f6f6f6;
}
</style>
