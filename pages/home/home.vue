<template>
	<view>
		<view class="homeContainer" v-if="currentPage === 'home'">
			<u-overlay :show="show" @click="addFriends">
				<view class="addScreen">
					<view class="addItem" @click="toCreateGroup">
						<uni-icons class="icon" type="paperplane-filled" size="28"></uni-icons>
						<text>创建群聊</text>
					</view>
					<view class="addItem" @click="toAddFriend">
						<uni-icons class="icon" type="personadd-filled" size="28"></uni-icons>
						<text>添加好友</text>
					</view>
				</view>
			</u-overlay>

			<view class="topBar">
				<view class="topBarContent">
					<text>消息</text>
					<uni-icons type="plusempty" size="24" @click="addFriends"></uni-icons>
				</view>

				<search></search>
			</view>
			<view class="messages" v-for="(messageItem,index) in messageList" :key="messageItem.key">
				<message :messageItem="messageItem"></message>
			</view>
		</view>
		<contact v-if="currentPage==='contacts'"></contact>
		<mine v-if="currentPage==='mine'"></mine>
		<view class="bottomNav">
			<view class="navItem" @click="changeNavItem(navItems[0])">
				<uni-icons :type="navItems[0]" :color="navItems[0] === 'chatbubble-filled' ? '#3c91ff':''" size="30">
				</uni-icons>
				<text :class="{navName:true,clicked:navItems[0]==='chatbubble-filled'}">消息</text>
				<text class="notReadmessageCounts"
					v-if="notReadMessages>0">{{notReadMessages | isNumberOverflow}}</text>
			</view>
			<view class="navItem" @click="changeNavItem(navItems[1])">
				<uni-icons :type="navItems[1]" :color="navItems[1] === 'staff-filled' ? '#3c91ff':''" size="30">
				</uni-icons>
				<text :class="{navName:true,clicked:navItems[1]==='staff-filled'}">联系人</text>
				<text class="newFriends" v-if="newFriends>0">{{newFriends | isNumberOverflow}}</text>
			</view>
			<view class="navItem" @click="changeNavItem(navItems[2])">
				<uni-icons :type="navItems[2]" :color="navItems[2] === 'person-filled' ? '#3c91ff':''" size="30">
				</uni-icons>
				<text :class="{navName:true,clicked:navItems[2]==='person-filled'}">我的</text>
			</view>

		</view>
	</view>

</template>

<script>
	import Search from '../../components/search.vue'
	import Message from '../../components/message.vue'
	import Mine from '../../pages/mine/mine.vue'
	import Contact from '../contacts/contacts.vue'
	export default {
		components: {
			Search,
			Message,
			Mine,
			Contact
		},
		filters: {
			isNumberOverflow(num) {
				return Number.parseInt(num) > 99 ? '99+' : num
			}
		},
		data() {
			return {
				navItems: ['chatbubble-filled', 'staff', 'person'],
				notReadMessages: 123,
				newFriends: '0',
				show: false,
				messageList:[],
				navMap: new Map([
					['chatbubble', 'home'],
					['staff', 'contacts'],
					['person', 'mine']
				]),
				currentPage:'home',
				account:''
			};
		},
		methods: {
			changeNavItem(str) {
				const reg = /-filled$/;
				if (!reg.test(str)) {
					this.navItems = this.navItems.map(item => {
						if (reg.test(item)) {
							return item.replace(reg, '')
						} else if (item === str) {
							return item + '-filled'
						} else return item
					})
					
					this.currentPage = this.navMap.get(str)
					// if(this.currentPage === 'mine'){
					// 	uni.navigateTo({
					// 		url: `../${this.navMap.get(str)}/${this.navMap.get(str)}`
					// 	})
					// }
				}


			},
			addFriends() {
				this.show = !this.show
			},
			getMessageList(){
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						that.account = res.data
						uni.request({
							url: that.$baseUrl + '/users/home/messageList',
							method: 'post',
							data: {
								account: res.data,
							},
							success: (data) => {
								that.messageList = data.data.messageList
								that.notReadMessages = 0
								for(let item of that.messageList){
									that.notReadMessages += item.notRead 
								}
								console.log(that.notReadMessages)
							}
						})
					}
				
				})
			},
			watchNewFriend(){
				let that = this
				this.socket.on('newFriendRequest', data => {
					console.log(data)
					uni.getStorage({
						key: 'accountId',
						success: function(res) {
							
							if(data.friendId === res.data){
								console.log('zxasd')
								// uni.getStorage({
								// 	key:'newFriendCount',
								// 	success:function(res) {
								// 		that.newFriends = res.data + data.count
								// 		uni.setStorage({
								// 			key:'newFriendCount',
								// 			data:res.data + data.count
								// 		})
								// 	}
								// })
								that.getNewFriendCount()
							}
						}
					
					})
				})
			},
			getNewFriendCount(){
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/home/newFriendCount',
							method: 'post',
							data: {
								account: res.data
							},
							success: (data) => {
								that.newFriends = data.data.newFriendCount
								uni.setStorage({
									key:'newFriendCount',
									data:data.data.newFriendCount
								})
							}
						})
					}
				
				})
				
			},
			toCreateGroup(){
				uni.navigateTo({
					url:`../group/createGroup/createGroup?account=${this.account}`
				})
			},
			toAddFriend(){
				uni.navigateTo({
					url:'../contacts/addFriend/addFriend'
				})
			}
			
		},
		onLoad() {
			this.getMessageList(),
			this.watchNewFriend(),
			this.getNewFriendCount()
			uni.$on('refreshContacts',()=>{
				// this.watchNewFriend()
				console.log(99)
				this.getNewFriendCount()
			}),
			// 接收音视频邀请
			this.socket.on('getVedioInvite',data => {
				console.log('213',data)
				
				let oInfo = JSON.stringify({
					appid:data.appid,
					channel:data.channel,
					token:'',
					uid:data.account,
					scenario:data.scenario,
					liveUrl:data.liveUrl
				})
				
				
				uni.navigateTo({
					url: `/pages/index/rtcPage?tag=0&friendId=${data.channel}&info=${oInfo}`,
				});
			})
			uni.$on('refreshHomeMessage',()=>{
				this.getMessageList()
			})
			this.socket.on('toUpdateMessageList',(data)=>{
				console.log(233212)
				this.getMessageList()
			
			})
			// this.socket.on('updateContactsList',()=>{
				
			// })
		
		},
		
		onUnload() {
			// this.socket.removeAllListeners('toUpdateMessageList')
			
			// this.socket.removeAllListeners('newFriendRequest')
		}
	
	}
</script>

<style lang="scss" scoped>
	.topBar {
		height: 180rpx;
		background-color: #f2f2f2;
		padding: 0 20rpx;
		padding-top: 70rpx;
		position: relative;

		.topBarContent {
			color: #000;
			display: flex;
			justify-content: space-between;

			text:nth-child(1) {
				font-size: 48rpx;
			}
		}

		.homeContainer {
			position: relative;
		}

	}

	.bottomNav {
		width: 100%;
		height: 100rpx;
		background: #f8f8f8;
		position: fixed;
		bottom: 0rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;

		.navItem {
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
		}

		.navName {
			font-size: 20rpx;
		}
	}

	.notReadmessageCounts,
	.newFriends {
		display: inline-block;
		position: absolute;
		top: 0rpx;
		left: 40rpx;
		font-size: 18rpx;
		border-radius: 30rpx;
		background-color: red;
		color: #fff;
		padding: 2rpx 6rpx;
		min-width: 20rpx;
		text-align: center;

	}

	.clicked {
		color: #3c91ff;
	}

	.addScreen {
		width: 280rpx;
		height: 140rpx;
		background: #fff;
		position: absolute;
		z-index: 888;
		top: 150rpx;
		right: 10rpx;
		padding: 20rpx;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;

		.addItem {
			display: flex;
			align-items: center;

			.icon {
				padding-left: 20rpx;
			}

			text {
				padding-left: 20rpx;
			}
		}
	}

	.addScreen::before {
		content: '';
		width: 0;
		height: 0;
		border: 15rpx solid transparent;
		border-bottom: 20rpx solid #fff;
		position: absolute;
		top: -35rpx;
		right: 30rpx;
	}
</style>
