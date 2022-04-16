<template>
	<view class="newFriendListContainer">
		<view class="title">
			好友通知
		</view>
		<add-friend-list-item v-for="(item,index) in newFriendList" :key="index" :friend="item"></add-friend-list-item>
	</view>
</template>

<script>
	import AddFriendListItem from '../../../components/addFriendListItem.vue'
	export default{
		data(){
			return{
				newFriendList:null
			}
		},
		components:{
			AddFriendListItem
		},
		methods:{
			getNewFriendList(){
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/home/newFriendList',
							method: 'post',
							data: {
								account: res.data
							},
							success: (data) => {
								that.newFriendList = data.data.newFriendList
								console.log(that.newFriendList)
							}
						})
					}
				})
				
			}
		},
		onLoad() {
			this.getNewFriendList()
			uni.$on('updateNewFriendList',()=>{
				this.getNewFriendList()
			})
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
