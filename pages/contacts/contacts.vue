<template>
	<view>
		<view class="topBar">
			<view class="topBarContent">
				<text>联系人</text>
				<uni-icons type="personadd" size="24" @click="toAddFriend"></uni-icons>
			</view>
		
			<search></search>
		</view>
		 <u-tabs :list="list" lineWidth="30" :activeStyle="{color:'#3c91ff'}" @click="tabClick"></u-tabs>
		 <friend-list v-if="currentTab === 0"></friend-list>
		 <group v-if="currentTab === 1"></group>
		 <group v-if="currentTab === 2"></group>
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
				]
			};
		},
		methods:{
			tabClick(item){
				this.currentTab = item.index
			},
			toAddFriend(){
				uni.navigateTo({
					url:'./addFriend/addFriend'
				})
			}
		}
	}
</script>

<style lang="scss">
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
</style>
