<template>
	<view class="newFriendListContainer">
		<view class="title">
			
		</view>
		<group-request-item v-for="(item,index) in newGroupList" :key="index" :friend="item"></group-request-item>
	</view>
</template>

<script>
	import GroupRequestItem from '@/components/groupRequestItem.vue'
	export default{
		data(){
			return{
				newGroupList:null
			}
		},
		components:{
			GroupRequestItem
		},
		methods:{
			getNewFriendList(){
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/home/newGroupList',
							method: 'post',
							data: {
								account: res.data
							},
							success: (data) => {
								that.newGroupList = data.data.newGroupList
								console.log(that.newGroupList)
							}
						})
					}
				})
				
			},
			clearHomeNotRead() {
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						that.account = res.data
						uni.request({
							url: that.$baseUrl + '/users/chat/clearNotRead',
							method: 'post',
							data: {
								account: res.data,
								friendId: '999'
							},
							success: (data) => {}
						})
					}
				})
			},
		},
		onLoad() {
			this.getNewFriendList()
			uni.$on('updateGroupRequestList',()=>{
				this.getNewFriendList()
			})
			this.clearHomeNotRead()
		},
		onUnload() {
			uni.$emit('refreshHomeMessage')
		},
		
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
