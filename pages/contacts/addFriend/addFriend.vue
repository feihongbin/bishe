<template>
	<view class="addFriend">
		<search></search>
	</view>
</template>

<script>
	import Search from '../../../components/search.vue'
	export default {
		components:{
			Search
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.addFriend{
	height: 80rpx;
	background-color: #f2f2f2;
	padding: 0 20rpx;
	margin-top: -20rpx;
}
</style>
