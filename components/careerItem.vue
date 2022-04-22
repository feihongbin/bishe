<template>
	<view class="careerItem" @click="changeCareer()">
		<view class="careerTag">
			<u-tag :text="item.tag"  size="mini" :type="item.type"></u-tag>
		</view>
		<text>{{item.content}}</text>
		<view class="icon" v-if="current === item.key+''">
			<u-icon name="checkmark" size="20"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			item:Object,
			current:String
		},
		data(){
			return{
				
			}
		},
		methods:{
			changeCareer(){
				this.$emit('changeCareer',this.item.key+'')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.careerItem{
		display: flex;
		align-items: center;
		padding: 20rpx 20rpx;
		border-bottom: solid 1px #e5e5e5 ;
		position: relative;
	}
	.careerTag{
		width: 80rpx;
		margin-right: 20rpx;
	}
	.icon{
		position: absolute;
		right: 40rpx;
		top: 30rpx;
	}
</style>

<style lang="scss" scoped>
/deep/	.u-tag{
		justify-content: center;
	}
</style>

