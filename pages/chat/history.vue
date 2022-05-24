<template>
	<view class="container">
		<u-tabs :list="list1" @click="changeTab" class="tabs" :activeStyle="{color:'#3c91ff'}"
			:itemStyle="{width:'100px',height:'40px'}"></u-tabs>
			
		
		<scroll-view class="chatContent" scroll-y="true" scroll-with-animation="true" :scroll-into-view="scrollView" v-if="currentTab==0">
			<view class="">
				<chat-message :avatar="friendMessage.avatar" :selfAvatar="userInfo.avatar" :messageList="friendMessage.messages">
				</chat-message>
			</view>
			<!-- <view v-if="isShowBlank" class="blankContent"></view> -->
		</scroll-view>	
		
			
			
		<history-img v-if="currentTab == 1" :images="images"></history-img>
	</view>
</template>

<script>
	import HistoryImg from '../../components/historyImg.vue'
	import ChatMessage from '../../components/chatMessage.vue'
	export default {
		components: {
			HistoryImg,
			ChatMessage
		},
		data() {
			return {
				friendId:'',
				userInfo:{},
				friendMessage:{},
				images:[],
				scrollView: '',
				currentTab: '0',
				list1: [{
						name: '全部',
					},
					{
						name: '图片',
					},
					{
						name: '文件'
					}
				]
			};
		},
		onLoad(option) {
			this.friendId = option.friendId,
			this.getFriendInfo()
		},
		methods: {
			changeTab(e) {
				this.currentTab = e.index
			},
			getFriendInfo() {
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/chat/friendInfo',
							method: 'post',
							data: {
								account: res.data,
								friendId: that.friendId
							},
							success: (data) => {
								console.log('friendInfo', data)
								that.friendMessage = data.data.friendMessage[0]
								if(that.scrollTag){
									that.$nextTick(function() {
										that.scrollView = 'msg' + that.friendMessage.messages[
											that.friendMessage.messages.length - 1].mid
									})
								}else{
									that.$nextTick(function() {
										that.scrollView = 'msg' + that.mid
									})
									that.scrollTag = true
								}
								console.log('friendInfo12312', that.friendMessage)
								that.images = that.friendMessage.messages.filter(item => item.tag === 'image/jpeg' || item.tag === 'image/png')
								console.log('f',that.images)
							}
						})
						
						uni.request({
							url: that.$baseUrl + '/users/info',
							method: 'post',
							data: {
								account: res.data,
							},
							success: (data) => {
								that.userInfo = data.data.info
								console.log(that.userInfo)
							}
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		padding-top:60rpx;
	}
	.tabs {
		background: #f2f2f2;
		position: fixed;
		top: 80rpx;
		left: 0;
		width: 100%;
		z-index: 1000;
	}
</style>
