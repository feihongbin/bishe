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
			<u-badge numberType="overflow"  max="99" :value="newFriends" :absolute="true" :offset="[18,30]"></u-badge>
			<u-icon name="arrow-right"></u-icon>
		</view>
		<view class="friendsTab">
			<u-tabs :list="list" lineWidth="30" :activeStyle="{color:'#3c91ff'}" @click="tabClick"></u-tabs>
			<friend-list :list="friendList" v-if="currentTab === 0 && friendList.length > 0"></friend-list>
			<group :list="friendByGroup" :currentTab="currentTab" v-if="currentTab === 1"></group>
			<group :list="groupByGroup" :currentTab="currentTab" v-if="currentTab === 2"></group>
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
				newFriends: '0',
				friendList:[],
				indexList:[],
				itemArr:[],
				friendByGroup:[],
				groupByGroup:[],
				account:''
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
					url:'/pages/contacts/addFriend/addFriend'
				})
			},
		
			
			
			checkNewFriend(){
				this.newFriends = '0'
				uni.setStorage({
					key:'newFriendCount',
					data:'0',
				})
				uni.navigateTo({
					url:'/pages/contacts/addFriend/newFriends'
				})
			},
			filterFriendList(arr) {
				return arr.map((item, index) => {
					return item.note === '' ? item.name : item.note
				})
			},
			fixTheSearchTeachers(names) {
				let data = names;
				let indexList = []
				let itemArr = []
				data.sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', {
					sensitivity: 'accent'
				}));
				let compareStr = ["吧", "擦", "搭", "妸", "发", "旮", "哈", "击", "咖", "垃", "妈", "那", "噢", "葩", "妻", "燃", "仨", "它",
					"挖", "夕", "匝"
				];
				let UpperCode = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
					"T", "W", "X", "Z"
				];
				let temp = [],
					newData = [];
				for (let j = 0, i = 0; i < data.length;) {
					if (data[i].localeCompare(compareStr[j], 'zh-Hans-CN', {
							sensitivity: 'base'
						}) <= 0) {
						temp.push(data[i]);
						i++;
					} else if (temp.length > 0) {
						temp.unshift(UpperCode[j++]);
						newData.push(temp);
						temp = [];
					} else {
						j++;
					}
				}
				return newData
			},
			getNewFriendCount(){
				let that = this
				uni.getStorage({
					key:'newFriendCount',
					success:function(res){
						that.newFriends = res.data
					}
				})
			},
			getFriendList(){
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						that.account = res.data
						if(that.currentTab === 0){
							uni.request({
								url: that.$baseUrl + '/users/contacts/getFriendList',
								method: 'post',
								data: {
									account: res.data,
								},
								success: (data) => {
									// that.friendList = that.fixTheSearchTeachers(that.filterFriendList(data.data.friendList))
									that.friendList = data.data.friendList
									// that.indexList = that.friendList.map((item,index)=>item[0])
									// that.itemArr = that.friendList.map((item,index) => item.slice(1))
									that.friendByGroup = data.data.friendByGroup
									console.log(that.friendList )
								}
							})
						}
					}
				
				})
			},
			getGroupList(){
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						that.account = res.data
						if(that.currentTab === 0){
							uni.request({
								url: that.$baseUrl + '/users/contacts/getGroupList',
								method: 'post',
								data: {
									account: res.data,
								},
								success: (data) => {
									
									that.groupByGroup = data.data.groupByGroup
									console.log(data.data.groupByGroup)
								}
							})
						}
					}
				
				})
			},
	
		
		},
		created() {
			uni.$on('refreshFriend',()=>{
				this.getFriendList()
			})
		},
		mounted() {
			this.getFriendList(),
			this.getNewFriendCount(),
			this.getGroupList()
		
			// uni.$on('refreshContacts',()=>{
			// 	this.getFriendList(),
			// 	this.getNewFriendCount(),
			// 	this.getGroupList()
			// })
		},
		// destroyed() {
		// 	uni.$off('refreshContacts')
		// }
		
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
	position: relative;
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
