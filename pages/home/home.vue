<template>
	<view>
		<view class="homeContainer">
			<u-overlay :show="show" @click="addFriends">
				<view class="addScreen">
					<view class="addItem">
						<uni-icons class="icon" type="paperplane-filled" size="28"></uni-icons>
						<text>创建群聊</text>
					</view>
					<view class="addItem">
						<uni-icons class="icon" type="personadd-filled" size="28"></uni-icons>
						<text>添加好友</text>
					</view>
				</view>
			</u-overlay>

			<view class="topBar">
				<view class="topBarContent">
					<text>消息</text>
					<uni-icons type="plusempty" size="24" @click="addFriends"></uni-icons>
				</view>

				<search></search>
			</view>
			<view class="messages" v-for="(messageItem,index) in messageList" :key="messageItem.key">
				<message :id="messageItem.key" :name="messageItem.name" :time="messageItem.time"
					:content="messageItem.content" :messageNumber="messageItem.messageNumber"></message>
			</view>
		</view>
		<view class="bottomNav">
			<view class="navItem" @click="changeNavItem(navItems[0])">
				<uni-icons :type="navItems[0]" :color="navItems[0] === 'chatbubble-filled' ? '#3c91ff':''" size="30">
				</uni-icons>
				<text :class="{navName:true,clicked:navItems[0]==='chatbubble-filled'}">消息</text>
				<text class="notReadmessageCounts"
					v-if="notReadMessages>0">{{notReadMessages | isNumberOverflow}}</text>
			</view>
			<view class="navItem" @click="changeNavItem(navItems[1])">
				<uni-icons :type="navItems[1]" :color="navItems[1] === 'staff-filled' ? '#3c91ff':''" size="30">
				</uni-icons>
				<text :class="{navName:true,clicked:navItems[1]==='staff-filled'}">联系人</text>
				<text class="newFriends" v-if="newFriends>0">{{newFriends | isNumberOverflow}}</text>
			</view>
			<view class="navItem" @click="changeNavItem(navItems[2])">
				<uni-icons :type="navItems[2]" :color="navItems[2] === 'person-filled' ? '#3c91ff':''" size="30">
				</uni-icons>
				<text :class="{navName:true,clicked:navItems[2]==='person-filled'}">我的</text>
			</view>

		</view>
	</view>

</template>

<script>
	import Search from '../../components/search.vue'
	import Message from '../../components/message.vue'
	import Mine from '../../pages/mine/mine.vue'
	export default {
		components: {
			Search,
			Message,
			Mine
		},
		filters: {
			isNumberOverflow(num) {
				return num > 99 ? '99+' : num
			}
		},
		data() {
			return {
				navItems: ['chatbubble-filled', 'staff', 'person'],
				notReadMessages: 123,
				newFriends: 2,
				show: false,
				messageList: [{
						key: 1,
						name: '张三',
						time: '2022-01-22',
						content: '我是张三',
						messageNumber: 20
					},
					{
						key: 2,
						name: '张三',
						time: '2022-01-22',
						content: '我是张三',
						messageNumber: 200
					},
					{
						key: 3,
						name: '张三',
						time: '2022-01-22',
						content: '我是张三',
						messageNumber: 99
					}
				],
				navMap: new Map([
					['chatbubble', 'home'],
					['staff', 'contacts'],
					['person', 'mine']
				])
			};
		},
		methods: {
			changeNavItem(str) {
				const reg = /-filled$/;
				if (!reg.test(str)) {
					this.navItems = this.navItems.map(item => {
						if (reg.test(item)) {
							return item.replace(reg, '')
						} else if (item === str) {
							return item + '-filled'
						} else return item
					})
					uni.navigateTo({
						url: `../${this.navMap.get(str)}/${this.navMap.get(str)}`
					})
				}


			},
			addFriends() {
				this.show = !this.show
			},
			
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

		.homeContainer {
			position: relative;
		}

	}

	.bottomNav {
		width: 100%;
		height: 100rpx;
		background: #f8f8f8;
		position: fixed;
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

	.clicked {
		color: #3c91ff;
	}

	.addScreen {
		width: 280rpx;
		height: 140rpx;
		background: #fff;
		position: absolute;
		z-index: 888;
		top: 150rpx;
		right: 10rpx;
		padding: 20rpx;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;

		.addItem {
			display: flex;
			align-items: center;

			.icon {
				padding-left: 20rpx;
			}

			text {
				padding-left: 20rpx;
			}
		}
	}

	.addScreen::before {
		content: '';
		width: 0;
		height: 0;
		border: 15rpx solid transparent;
		border-bottom: 20rpx solid #fff;
		position: absolute;
		top: -35rpx;
		right: 30rpx;
	}
</style>
