<template>
	<view>
		<view v-for="(item,index) in messageList">
			<view v-if="item.type === 'time'" class="chatTime">
				<!-- {{item.content}} -->
				<uni-dateformat v-if="new Date().getDate() !== new Date(item.content).getDate()" :date="item.content" :threshold="[0,0]" format="MM/dd hh:mm"></uni-dateformat>
				<uni-dateformat v-else :date="item.content" :threshold="[0,0]" format="hh:mm"></uni-dateformat>
			</view>
			
			<view v-else :class="['chatText',item.type === 'myself' ? 'myselfChatContent' : '']" >
				<image class="avatar" :src="avatar" mode=""></image>
				<text selectable="true" v-if="item.tag === 'text'" :class="['content',item.type === 'myself' ? 'myContent' : '']">{{item.content}}</text>
				<!-- <u-tooltip :text='<text :class="['content',item.type === 'myself' ? 'myContent' : '']'>{{item.content}}</text>"></u-tooltip> -->
				<!-- <u-tooltip :text="item.content">{{item.content}}</u-tooltip> -->
				<image class="contentImage" v-if="item.tag === 'image'" :src="item.content" mode="widthFix"></image>
				 <!-- <u-tooltip src="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/avatar/1.jpeg" text="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/avatar/1.jpeg" direction="bottom"></u-tooltip> -->
				<text v-if="item.type === 'myself'" :class="{'isRead':true,'hasRead':true}">{{true ? '未读' : '已读'}}</text>
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
