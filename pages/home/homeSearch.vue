<template>
	<view class="container">
		<view class="topBar">
			<search :isSearch="true" @onInput="search"></search>
		</view>
		<view v-if="friendsInfo.length == 0 && groupsInfo.length == 0 && messageInfo.length == 0" class="searchTip">
			<text>搜索聊天记录、联系人等</text>
		</view>
		<scroll-view scroll-y="true" scroll-with-animation="true">
			<view class="scrollItem" v-if="friendsInfo.length > 0">
				<text class="title">联系人</text>
				<view class="content" v-for="(item,index) in friendsInfo" :key="index" @click="toFriendChatPage(item.friendId)">
					<view class="avatar">
						<image :src="item.avatar" mode=""></image>
					</view>
					<view class="info">
						<text class="name"><text class="itemName" v-html="item.note || item.name"></text> <text
								:style="{color:'#a1a1a3'}" v-html="friendsSearchFilter(item)"></text></text>
						<text class="detail">来自：{{item.group}}</text>
					</view>
				</view>


			</view>

			<view class="scrollItem" v-if="groupsInfo.length > 0">
				<text class="title">群聊</text>
				<view class="content" v-for="(item,index) in groupsInfo" :key="index" @click="toGroupChatPage(item)">
					<view class="avatar">
						<image :src="item.avatar" mode=""></image>
					</view>
					<view class="info">
						<text class="name"><text class="itemName" v-html="item.groupName"></text> <text
								:style="{color:'#a1a1a3'}" v-html="'('+item.groupId+')'"></text></text>
						<!-- <text class="detail">包含：哈哈哈</text> -->
					</view>
				</view>

			</view>

			<view class="scrollItem" v-if="messageInfo.length > 0">
				<text class="title">聊天记录</text>
				<view class="content" v-for="(item,index) in messageInfo" :key="index" @click="toHistoryDetail(item)">
					<view class="avatar">
						<image :src="item.avatar" mode=""></image>
					</view>
					<view class="info">
						<text class="name">{{item.note || item.name}}</text>
						<text class="detail">{{item.count}}条与<span style='color:#4AAAFF;'>"{{content}}"</span>相关记录</text>
					</view>
				</view>
				
			
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import Search from '../../components/search.vue'
	export default {
		components: {
			Search
		},
		data() {
			return {
				content: ' ',
				friendsInfo: [],
				groupsInfo: [],
				messageInfo:[]
			}
		},
		computed: {
			isNumber() {
				return this.content.length > 0 && /^[0-9]$/.test(this.content)
			}
		},
		methods: {
			search(content) {
				if(content.length > 0){
					this.content = content
					this.getContact(content)
					this.getGroup(content)
				}
			},
			toFriendChatPage(id){
				console.log(id)
				let friendId = id.replaceAll("<span style='color:#4AAAFF;'>",'').replaceAll("<span>",'').replaceAll("</span>",'')
				console.log(friendId)
				uni.navigateTo({
					url:`/pages/chat/chatPage?friendId=${friendId}`
				})
			},
			toGroupChatPage(item){
				let groupId = item.groupId.replaceAll("<span style='color:#4AAAFF;'>",'').replaceAll("<span>",'').replaceAll("</span>",'')
				let groupName = item.groupName.replaceAll("<span style='color:#4AAAFF;'>",'').replaceAll("<span>",'').replaceAll("</span>",'')
				console.log(groupId,groupName)
				uni.navigateTo({
					url:`/pages/chat/groupChatPage?groupId=${groupId}&groupName=${groupName}`
				})
			},
			toHistoryDetail(item){
				let friendId = item.friendId.replaceAll("<span style='color:#4AAAFF;'>",'').replaceAll("<span>",'').replaceAll("</span>",'')
				let friendName = item.note || item.name
				friendName = friendName.replaceAll("<span style='color:#4AAAFF;'>",'').replaceAll("<span>",'').replaceAll("</span>",'')
				uni.navigateTo({
					url:`/pages/home/friendMessageHistory?friendId=${friendId}&friendName=${friendName}&search=${this.content}`
				})
			},
			// /pages/chat/groupChatPage?groupId=554677195&groupName=群聊21312
			friendsSearchFilter(item) {
				if (item.name.includes("<span style='color:#4AAAFF;'>")) {
					return '(' + item.name + ')'
				} else if (item.friendId.includes("<span style='color:#4AAAFF;'>")) {
					return '(' + item.friendId + ')'
				}

				return '(' + item.name + ')'

			},
			getContact(content) {
				let that = this
				uni.getStorage({
					key: 'accountId',
					success(res) {
						uni.request({
							url: that.$baseUrl + '/users/search',
							method: 'post',
							data: {
								account: res.data,
								content: content
							},
							success: (data) => {
								// that.userInfo = data.data.info
								console.log(data.data.friends)
								if (content) {
									let exp = eval("/" + content + "/g");
									that.friendsInfo = data.data.friends.map(item => {
										if (item.friendId && (item.friendId.includes(
												content) || item.name.includes(content)) || (
												item.note && item.note.includes(content))) {
											return {
												friendId: item.friendId.replace(exp,
													"<span style='color:#4AAAFF;'>" +
													content + "</span>"),
												name: item.name.replace(exp,
													"<span style='color:#4AAAFF;'>" +
													content + "</span>"),
												group: item.group,
												avatar: item.avatar,
												note: item.note.replace(exp,
													"<span style='color:#4AAAFF;'>" +
													content + "</span>") || ''
											}
										}
									})
									that.friendsInfo = that.friendsInfo.filter(item => item)
									
									
									that.messageInfo =  data.data.friends.map(item => {
										let count = 0
										let messages = []
										if(item.friendId){
											for(let meg of item.messages){
												if(meg.tag == 'text' && meg.type!= 'time' && meg.content.includes(content)){
													count++
													messages.push(meg)
												}
											}
											return {
												friendId:item.friendId,
												avatar:item.avatar,
												note:item.note,
												name:item.name,
												count:count,
												messages:messages
											}
										}
										
									})
									that.messageInfo = that.messageInfo.filter(item => item && item.count > 0)
									console.log(that.messageInfo)
								}
							}
						})
					}
				})
			},
			getGroup(content) {
				let that = this
				uni.getStorage({
					key: 'accountId',
					success(res) {
						uni.request({
							url: that.$baseUrl + '/group/search',
							method: 'post',
							data: {
								account: res.data
							},
							success: (data) => {
								console.log(data.data.groups)
								if (content) {
									let exp = eval("/" + content + "/g");
									that.groupsInfo = data.data.groups.map(item => {
										if (item.groupId && (item.groupId.includes(content) ||
												item.groupName.includes(content))) {
											return {
												groupId: item.groupId.replace(exp,
													"<span style='color:#4AAAFF;'>" +
													content + "</span>"),
												groupName: item.groupName.replace(exp,
													"<span style='color:#4AAAFF;'>" +
													content + "</span>"),
												avatar: item.groupAvatar,
											}
										}
									})
									that.groupsInfo = that.groupsInfo.filter(item => item)
									console.log(that.groupsInfo)
								}
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #f2f2f2;
		height: 100vh;

		.topBar {
			height: 120rpx;
			background-color: #f2f2f2;
			padding: 0 20rpx;
			padding-top: 70rpx;
			position: relative;
		}

		.searchTip {
			color: #c1c1c3;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 40rpx;
		}

		.scrollItem {
			background: #ffffff;
			padding: 20rpx 0;
			margin-bottom: 20rpx;

			.title {
				color: #c1c1c3;
				display: inline-block;
				padding: 0 20rpx;
			}

			.content {
				padding: 10rpx 20rpx;
				// margin-top: 20rpx;
				display: flex;

				.avatar {
					image {
						width: 80rpx;
						height: 80rpx;
					}
				}

				.info {
					margin-left: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.name {
						font-size: 36rpx;

						.itemName {
							display: inline-block;
							max-width: 60%;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}

					.detail {
						color: #c1c1c3;
						font-size: 30rpx;
					}
				}
			}
		}
	}

	.content:active {
		background: #f6f6f6;
	}
</style>
