<template>
	<view>
		<u-collapse accordion :border="false">
			<u-collapse-item v-for="(item,index) in list">
				<!-- <u-icon name="play-right-fill" size="20" slot="icon"></u-icon> -->
				<text slot="right-icon">
					<u-icon name="arrow-up-fill" size="16" color="#cfcfcf"></u-icon>
				</text>
				<text slot="title">
					<view class="groupTitle">
						<view class="tooltip" v-if="currentTab === 1">
							<u-tooltip @click="groupManage" :text="item[0]" overlay  :showCopy="false" :buttons="['管理分组']" ></u-tooltip>
						</view>
						<view class="tooltip" v-if="currentTab === 2">
							<text class="titleText" >{{item[0]}}</text>
						</view>
						
						<text class="titleConent" >{{item.length - 1}}</text>
					</view>
				</text>
				<text class="u-collapse-content" v-if="currentTab===1">
					<view class="friend" v-for="(friend,i) in item.slice(1)" @click="toFriendDetail(friend.friendId)">
						<image class="friendAvatar" :src="friend.avatar" mode=""></image>
						<text class="friendName">{{friend.note || friend.name}}</text>
					</view>
				</text>
				<text class="u-collapse-content" v-if="currentTab===2">
					<view class="friend" v-for="(group,i) in item.slice(1)" @click="toGroupDetail(group.group,group.groupName)">
						<image class="friendAvatar" :src="group.groupAvatar" mode=""></image>
						<text class="friendName">{{group.groupName}}</text>
					</view>
				</text>
			
			</u-collapse-item>
			
		</u-collapse>
	</view>
</template>

<script>
	export default {
		name: "group",
		data() {
			return {
			};
		},
		props:{
			list:Array,
			currentTab:Number
		},
		methods:{
			toFriendDetail(str){
				uni.navigateTo({
					url:`/pages/contacts/addFriend/searchResult?id=${str}&isFriend=${true}`
				})
			},
			toGroupDetail(id,name){
				console.log('totototo')
				uni.navigateTo({
					url:`/pages/chat/groupChatPage?groupId=${id}&groupName=${name}`
					// url:'../pages/chat/groupChatPage?groupId=${id}&groupName=${name}'
				})
			},
			groupManage(index){
				console.log(index)
				if(index === 0){
					uni.navigateTo({
						url:'/pages/contacts/groupManage/groupManage'
					})
				}
			}
		}

	}
</script>

<style lang="scss">
	.groupTitle{
		display: flex;
		justify-content: space-around;
		align-items: center;
		.tooltip{
			flex: 1;
		}
		.titleText{
			font-size: 36rpx;
			color: #666;
		}
		.titleContent{
			font-size: 24rpx;
			color: #666;
		}
	}
	.friend{
		display: flex;
		align-items: center;
		height: 120rpx;
		.friendAvatar{
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
			border-radius: 20rpx;
		}
		.friendName{
			color: #000000;
		}
	}
</style>

<style lang="scss" scoped>
/deep/	.u-cell__body__content{
		order: 2 ;
	}
/deep/	.u-cell__right-icon-wrap--up{
		transform: rotate(180deg);
	}
/deep/	.u-cell__right-icon-wrap--down{
		transform: rotate(90deg);
	}
/deep/	.u-cell__right-icon-wrap{
		margin-left: 0;
		margin-right: 8rpx;
	}
/deep/ .u-tooltip__wrapper__text{
	font-size: 36rpx;
}
</style>
