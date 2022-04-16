<template>
	<view>
		<view v-for="(item,index) in messageList">
			<view v-if="item.type === 'time'" class="chatTime">
				{{item.content}}
			</view>
			
			<view v-else :class="['chatText',item.type === 'myself' ? 'myselfChatContent' : '']">
				<image class="avatar" :src="avatar" mode=""></image>
				<text v-if="item.tag === 'text'" :class="['content',item.type === 'myself' ? 'myContent' : '']">{{item.content}}</text>
				<!-- <u-tooltip :text='<text :class="['content',item.type === 'myself' ? 'myContent' : '']'>{{item.content}}</text>"></u-tooltip> -->
				<!-- <u-tooltip :text="item.content">{{item.content}}</u-tooltip> -->
				<image class="contentImage" v-if="item.tag === 'image'" :src="item.content" mode="widthFix"></image>
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
			avatar:String
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
	.contentImage{
		max-width: 400rpx;
		border-radius: 20rpx;
	}
}
.myContent{
		background: #1e6eff !important;
		color: #fff;
	}

</style>
