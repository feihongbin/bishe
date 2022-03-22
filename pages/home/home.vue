<template>
	<view class="homeContainer">
		<view class="globalGray"></view>
		
		<view class="topBar">
			<view class="topBarContent">   
				<text>消息</text>
				<uni-icons type="plusempty" size="24" @click="addFriends()"></uni-icons>
			</view>
			<view class="addScreen" v-if="addScreen">
				<text>创建群聊</text>
				<text>添加好友</text>
			</view>
			<search></search>
		</view>
		<view class="messages" v-for="(messageItem,index) in messageList" :key="messageItem.key">
			<message :id="messageItem.key" :name="messageItem.name" :time="messageItem.time" :content="messageItem.content" :messageNumber="messageItem.messageNumber"></message>
		</view>
		<view class="bottomNav">
			<view class="navItem" @click="changeNavItem(navItems[0])">
				<uni-icons :type="navItems[0]" :color="navItems[0] === 'chatbubble-filled' ? '#3c91ff':''" size="30"></uni-icons>
				<text :class="{navName:true,clicked:navItems[0]==='chatbubble-filled'}">消息</text>
				<text class="notReadmessageCounts" v-if="notReadMessages>0">{{notReadMessages | isNumberOverflow}}</text>
			</view>
			<view class="navItem" @click="changeNavItem(navItems[1])">
				<uni-icons :type="navItems[1]" :color="navItems[1] === 'staff-filled' ? '#3c91ff':''" size="30"></uni-icons>
				<text :class="{navName:true,clicked:navItems[1]==='staff-filled'}">联系人</text>
				<text class="newFriends" v-if="newFriends>0">{{newFriends | isNumberOverflow}}</text>
			</view>
			<view class="navItem" @click="changeNavItem(navItems[2])">
				<uni-icons :type="navItems[2]" :color="navItems[2] === 'person-filled' ? '#3c91ff':''" size="30"></uni-icons>
				<text :class="{navName:true,clicked:navItems[2]==='person-filled'}">我的</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	import Search from '../../components/search.vue'
	import Message from '../../components/message.vue'
	import AddScreen from '../../components/messageAdd.vue'
	export default {
		components:{
			Search,
			Message,
			AddScreen
		},
		filters:{
			isNumberOverflow(num){
				return num > 99 ? '99+' : num
			}
		},
		data() {
			return {
				navItems:['chatbubble-filled','staff','person'],
				notReadMessages:123,
				newFriends:2,
				addScreen:false,
				messageList:[
					{
						key:1,
						name:'张三',
						time:'2022-01-22',
						content:'我是张三',
						messageNumber:20
					},
					{
						key:2,
						name:'张三',
						time:'2022-01-22',
						content:'我是张三',
						messageNumber:200
					},
					{
						key:3,
						name:'张三',
						time:'2022-01-22',
						content:'我是张三',
						messageNumber:99
					}
				]
			};
		},
		methods:{
			changeNavItem(str){
				const reg = /-filled$/;
				if(!reg.test(str)){
					this.navItems = this.navItems.map(item =>{
						if(reg.test(item)){
							return item.replace(reg,'')
						}else if(item === str) {
							return item+'-filled'
						}else return item
					})
				}

			},
			addFriends(){
				this.addScreen = !this.addScreen
			}
		}
	}
</script>

<style lang="scss">
.topBar{
	height: 180rpx;
	background-color: #f2f2f2;
	padding: 0 20rpx;
	padding-top: 70rpx;
	position: relative;
	.topBarContent{
		color: #000;
		display: flex;
		justify-content: space-between;
		text:nth-child(1){
			font-size: 48rpx;
		}
	}
	.homeContainer{
		position: relative;
	}
	.globalGray{
		height: 100vh;
		background:#000;
		opacity: 1;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10000;
	}
	.addScreen{
		width: 160rpx;
		height: 140rpx;
		background: #fff;
		position: absolute;
		top: 150rpx;
		right: 10rpx;
		padding: 20rpx;
	}
	.addScreen::before{
		
	}
}

.bottomNav{
	width: 100%;
	height: 100rpx;
	background: #f8f8f8;
	position: fixed;
	bottom: 0rpx;
	display: flex;
	justify-content: space-around;
	align-items: center;
	
	.navItem{
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}
	.navName{
		font-size: 20rpx;
	}
}
.notReadmessageCounts,.newFriends{
	display: inline-block;
	position: absolute;
	top:0rpx;
	left: 40rpx;
	font-size: 18rpx;
	border-radius: 30rpx;
	background-color: red;
	color: #fff;
	padding: 2rpx 6rpx;
	min-width: 20rpx;
	text-align: center;
	
}
.clicked{
	color: #3c91ff;
}
</style>
