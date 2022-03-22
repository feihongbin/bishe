<template>
	<view>
		<view v-for="(item,index) in messageList">
			<view v-if="item.type === 'time'" class="chatTime">
				{{item.content}}
			</view>
			<view v-else :class="['chatText',item.type === 'myself' ? 'myselfChatContent' : '']">
				<image class="avatar" src="../static/logo.png" mode=""></image>
				<text :class="['content',item.type === 'myself' ? 'myContent' : '']">{{item.content}}</text>
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
			}
		},
		data() {
			return {
				
			};
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
	margin:30rpx 0;
	.avatar{
		width: 80rpx;
		height: 80rpx;
		padding: 0 20rpx 0 30rpx;
	}
	.content{
		background: #fff;
		padding: 15rpx;
		border-radius: 10rpx;
		max-width: 60vw;
	}
}
.myContent{
		background: #1e6eff !important;
		color: #fff;
	}

</style>
