<template>
	<view>
		<view v-for="(item,index) in messageList">
			<view v-if="item.tag === 'time'" class="chatTime">
				<uni-dateformat v-if="new Date().getDate() !== new Date(item.content).getDate()" :date="item.content" :threshold="[0,0]" format="MM/dd hh:mm"></uni-dateformat>
				<uni-dateformat v-else :date="item.content" :threshold="[0,0]" format="hh:mm"></uni-dateformat>
			</view>
			
			<view v-else :class="['chatText',item.sender === account ? 'myselfChatContent' : '']" >
				<image class="avatar" :src="item.avatar" mode=""></image>
				<view :class="['contentContainer',item.sender === account ? 'myContentContainer' : 'othersContentContainer']">
					<text class="name">{{item.name}}</text>
					<text selectable="true" v-if="item.tag === 'text'" :class="['content',item.sender === account ? 'myContent' : '']">{{item.content}}</text>
				</view>
	
				<image class="contentImage" v-if="item.tag === 'image'" :src="item.content" mode="widthFix"></image>
				<!-- <text v-if="item.type === 'myself'" :class="{'isRead':true,'hasRead':true}">{{true ? '未读' : '已读'}}</text> -->
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		name: "chatMessage",
		props:{
			messageList:{
				type:Array,
				default(){
					return [];
				}
			},
			account:String
		},
		data() {
			return {
				
			};
		},
		methods:{
			longpress(){
				console.log('long press')
			}
		}
		
	}
</script>

<style lang="scss">
.myselfChatContent{
	justify-content: flex-end;
	.avatar{
		order:2
	}
	.content{
		order:1;
		background: #1e6eff;
	}
	
}
.chatTime {
		text-align: center;
		font-size: 24rpx;
		color: #666;
	}
.chatText{
	display: flex;
	align-items: flex-start;
	margin:50rpx 0;
	position: relative;
	.avatar{
		width: 80rpx;
		height: 80rpx;
		padding: 0 20rpx 0 30rpx;
	}
	.contentContainer{
		display: flex;
		flex-direction: column;
	}
	.othersContentContainer{
		align-items: flex-start;
	}
	.myContentContainer{
		align-items: flex-end;
	}
	.name{
		font-size: 30rpx;
		color: #8a8d9b;
		margin-bottom: 10rpx;
	}
	.content{
		background: #fff;
		padding: 15rpx;
		border-radius: 10rpx;
		max-width: 60vw;
	}
	.contentImage{
		max-width: 400rpx;
		border-radius: 20rpx;
	}
	.isRead{
		position: absolute;
		right: 130rpx;
		bottom: -36rpx;
		color: #ccc;
	}
	.hasRead{
		color: #58aff1;
	}
}
.myContent{
		background: #1e6eff !important;
		color: #fff;
	}

</style>
