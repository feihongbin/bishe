<template>
	<view class="mineContainer">
		<view>
			<uni-icons type="back" size="24"></uni-icons>
			<text class="setting" @click="toFriendSetting" v-if="isFriend">设置</text>
			<view class="info">
				<image class="avatar" :src="userInfo.avatar" mode=""></image>
				<view>
					<text class="name">{{userInfo.name}}</text>
					<text class="signature">{{userInfo.signature}}</text>
				</view>
			</view>
			<view class="detail">
				<info-item  class="detailItem" label="账号" :content="userInfo.tid" :showArrow="false">
				</info-item>
				<info-item v-if="userInfo.gender" class="detailItem" label="性别" :content="userInfo.gender" :showArrow="false">
				</info-item>
				<info-item v-if="userInfo.birth" class="detailItem" label="生日" :content="formateStampToDate(Number.parseInt(userInfo.birth))"
					:showArrow="false"></info-item>
				<info-item v-if="userInfo.location" class="detailItem" label="所在地" :content="userInfo.location" :showArrow="false"></info-item>
				<info-item v-if="userInfo.native" class="detailItem" label="家乡" :content="userInfo.native" :showArrow="false"></info-item>
				<info-item v-if="userInfo.career" class="detailItem" label="职业" :content="userInfo.career" :showArrow="false"></info-item>
			</view>
		</view>
		<view class="addFriendBtn" v-if="!isFriend">
			<button type="primary" @click="sendRequest">加为好友</button>
		</view>
		<view class="chatBtn" v-if="isFriend">
			<button class="btn" type="primary" @click="sendRequest">音视频通话</button>
			<button class="btn" type="primary" @click="sendMessage">发消息</button>
		</view>
	</view>
</template>

<script>
	import InfoItem from '../../../components/infoItem.vue'
	export default{
		data(){
			return {
				userInfo:{},
				isFriend:false
			}
		},
		components: {
			InfoItem
		},
		methods:{
			formateStampToDate(timestamp) {
				let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				let Y = date.getFullYear() + '-';
				let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				let D = date.getDate() + ' ';
				// let h = date.getHours() + ':';
				// let m = date.getMinutes() + ':';
				// let s = date.getSeconds();
				// console.log(Y,M,D,timestamp,date)
				return Y + M + D
			},
			sendRequest(){
				uni.navigateTo({
					url:`./sendRequest?friendId=${this.userInfo.tid}`
				})
			},
			sendMessage(){
				uni.navigateTo({
					url:`/pages/chat/chatPage?friendId=${this.userInfo.tid}`
				})
			},
			toFriendSetting(){
				uni.navigateTo({
					url:'/pages/chat/chatSetting'
				})
			}
		},
		onLoad(option) {
			this.isFriend = option.isFriend
			uni.request({
				url: this.$baseUrl + '/users/info',
				method: 'post',
				data: {
					account: option.id,
				},
				success: (data) => {
					this.userInfo = data.data.info
					console.log(this.userInfo)
				}
			})
		}
		
	}
</script>

<style lang="scss" scoped>
	.mineContainer {
		padding: 80rpx 20rpx 0;
		background-color: #f8f8f8;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border;
		position: relative;
		.setting{
			position: absolute;
			top: 80rpx;
			right: 40rpx;
			font-size: 36rpx;
		}
		.info {
			display: flex;
			align-items: center;
			margin-top: 60rpx;
			margin-left: 60rpx;
	
			.avatar {
				width: 160rpx;
				height: 160rpx;
				margin-right: 20rpx;
			}
	
			view {
				display: flex;
				flex-direction: column;
	
				.name {
					font-size: 48rpx;
				}
	
				.signature {
					font-size: 30rpx;
					color: #333333;
				}
			}
		}
	
		.detail {
			padding: 0rpx 0rpx 20rpx;
			margin-top: 40rpx;
			background-color: #FFFFFF;
			border-radius: 20rpx;
		}
		.addFriendBtn{
			margin-bottom: 100rpx;
		}
		.chatBtn{
			display: flex;
			justify-content: space-around;
			margin-bottom: 100rpx;
			.btn{
				flex: 1;
				margin: 0 20rpx;
			}
			.btn:nth-child(1){
				background-color:#eaedf4 ;
				color: #000;
			}
		}
	}
	
	.detailItem:nth-child(1) {
		padding-top: 40rpx;
	}
	

</style>
