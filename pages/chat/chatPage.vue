<template>
	<view>
		<view class="chatTopBar">
			<uni-icons type="back" size="24"></uni-icons>
			<view class="chatFriendInfo">
				<text class="friendName">{{this.name}}</text>
				<text class="friendStatus">在线</text>
			</view>
			<uni-icons type="bars" size="24"></uni-icons>
		</view>
		<scroll-view class="chatContent" scroll-y="true" scroll-with-animation="true">
			<view class="">
				<chat-message :messageList="message"></chat-message>
			</view>
			<view v-if="isShowBlank" class="blankContent"></view>
		</scroll-view>
		<send-message-input :friendId="friendId" @showBlank="showBlank"></send-message-input>
	</view>
</template>

<script>
	import ChatMessage from '../../components/chatMessage.vue'
	import SendMessageInput from '../../components/sendMessageInput.vue'
	export default {
		components:{
			ChatMessage,
			SendMessageInput
		},
		data() {
			return {
				name:'',
				friendId:'',
				message:[
					{
						content:'昨天下午 6:31',
						type:'time',
						tag:'text'
					},
					
					{
						content:'你好啊',
						type:'others',
						tag:'text'
					},
					{
						content:'你也好啊了快捷方式拉达克解放啦考试记录开始搭建拉开数据库拉法基埃里克森京东方拉克丝达拉斯会计分录卡设计费卢卡斯建档立卡世界来看的骄傲离开',
						type:'myself',
						tag:'text'
					},
					{
						content:'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/avatar/1.jpeg',
						type:'myself',
						tag:'image'
					},
					{
						content:'你高兴得太早了',
						type:'others',
						tag:'text'
					},
					{
						content:'昨天下午 6:31',
						type:'time',
						tag:'text'
					},
					{
						content:'你好啊',
						type:'others',
						tag:'text'
					},
					{
						content:'你也好啊',
						type:'myself',
						tag:'text'
					},
					{
						content:'很高兴认识你',
						type:'myself',
						tag:'text'
					},
					
				
				],
				isShowBlank:false
			};
		},
		onLoad:function(option){
			this.name = option.name
			this.friendId = option.id
			console.log(this.name)
			this.acceptMessage()
			
		},
		methods:{
			showBlank(val){
				console.log(val)
				this.isShowBlank = val
			},
			acceptMessage(){
				this.socket.on('news',(data)=>{
					// console.log('12345aszs')
					this.message.push({
						content:'你高兴得太早了',
						type:'others'
					})
				})
			}
		}
	}
</script>

<style lang="scss">
.chatTopBar{
	background: #f8f8f8;
	position: fixed;
	z-index: 999;
	height: 150rpx;
	width: 100%;
	box-sizing: border-box;
	padding: 80rpx 20rpx 0;

	display: flex;
	justify-content: space-between;
	
	.chatFriendInfo{
		display: flex;
		flex-direction: column;
		align-items: center;
		.friendStatus{
			font-size: 24rpx;
		}
	}
}
.chatContent{
	position: relative;
	top: 0rpx;
	padding-top:150rpx;
	padding-bottom: 120rpx;
	overflow: hidden;
	box-sizing: border-box;
	height: 100vh;
	background: #f8f8f8;
}
.blankContent{
	height: 278px;
}
</style>
