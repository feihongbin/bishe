<template>
	<view class="contactsContainer">
		<view class="topBar">
			<view class="topBarContent">
				<text>联系人</text>
				<uni-icons type="personadd" size="24" @click="toAddFriend"></uni-icons>
			</view>
		
			<search></search>
		</view>
		<view class="newFriendTab" @click="checkNewFriend">
			<text>新朋友</text>
			<u-icon name="arrow-right"></u-icon>
		</view>
		<view class="friendsTab">
			<u-tabs :list="list" lineWidth="30" :activeStyle="{color:'#3c91ff'}" @click="tabClick"></u-tabs>
			<friend-list v-if="currentTab === 0"></friend-list>
			<group v-if="currentTab === 1"></group>
			<group v-if="currentTab === 2"></group>
		</view>
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
	import FriendList from '../../components/friendList.vue'
	import Group from '../../components/group.vue'
	export default {
		components:{
			Search,
			FriendList,
			Group
		},
		data() {
			return {
				currentTab:0,
				list:[
					{
						name:'好友'
					},
					{
						name:'分组'
					},
					{
						name:'群聊'
					}
				],
				navMap: new Map([
					['chatbubble', 'home'],
					['staff', 'contacts'],
					['person', 'mine']
				]),
				navItems: ['chatbubble-filled', 'staff', 'person'],
				notReadMessages: 123,
				newFriends: 2,
			};
		},
		filters: {
			isNumberOverflow(num) {
				return num > 99 ? '99+' : num
			}
		},
		methods:{
			tabClick(item){
				this.currentTab = item.index
			},
			toAddFriend(){
				uni.navigateTo({
					url:'./addFriend/addFriend'
				})
			},
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
					uni.navigateTo({
						url: `../${this.navMap.get(str)}/${this.navMap.get(str)}`
					})
				}
			
			
			},
			checkNewFriend(){
				uni.navigateTo({
					url:'./addFriend/newFriends'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.contactsContainer{
	background-color: #f2f2f2;
	height: 100vh;

}
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


	}
.newFriendTab{
	display: flex;
	justify-content: space-between;
	padding: 30rpx 20rpx;
	margin: 20rpx 0;
	background-color: #ffffff;
}
.friendsTab{
	background-color: #ffffff;
	height: calc(100vh - 400rpx)
}

.bottomNav {
		width: 100%;
		height: 100rpx;
		background: #f8f8f8;
		position: fixed;
		z-index: 999;
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
</style>
