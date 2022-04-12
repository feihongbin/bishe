<template>
	<view class="newFriendListContainer">
		<view class="title">
			好友通知
		</view>
		<add-friend-list-item ></add-friend-list-item>
		<add-friend-list-item ></add-friend-list-item>
		<add-friend-list-item ></add-friend-list-item>
		<add-friend-list-item ></add-friend-list-item>
	</view>
</template>

<script>
	import AddFriendListItem from '../../../components/addFriendListItem.vue'
	export default{
		data(){
			return{
				
			}
		},
		components:{
			AddFriendListItem
		},
		methods:{
			
		}
		
	}
</script>

<style lang="scss" scoped>
	.newFriendListContainer{
		.title{
			background-color: #fefefe;
			padding: 30rpx 20rpx 20rpx;
			color: #666;
		}
	}
</style>
