<template>
	<view class="groupIntroduceContainer">
		<view class="groupCard">
			<view class="card">
				<image :src="groupInfo.groupAvatar" mode=""></image>
				<view class="info">
					<text class="name">{{groupInfo.groupName}}</text>
					<text class="id">{{groupInfo.groupId}}</text>
				</view>
			</view>
			<text class="date">本群创建于{{new Date(Number.parseInt(groupInfo.createDate)).getFullYear()}}年{{new Date(Number.parseInt(groupInfo.createDate)).getMonth()}}月{{new Date(Number.parseInt(groupInfo.createDate)).getDate()}}日</text>
		</view>
		
		<!-- <view class="memberInfo">
			<view class="">
				<view class="title">
					<text>成员概况</text>
					<view class="count">
						<text>{{groupInfo.members.length}}</text>
						<u-icon name="arrow-right" size="16" color="#ccc" style="margin-right: 10px;"></u-icon>
					</view>
				</view>
			</view>
			<view class="infoDetail">
				
			</view>
			<view class="cardList">
			</view>
		</view> -->
		
		<view class="manager">
			<text class="label">管理员</text>
			<view class="imgs">
				<image v-for="(item,index) in groupInfo.members.filter(m => m.permission!==0)" :key="index" :src="item.avatar" mode=""></image>
			</view>
			<view class="count">
				<text>共1人</text>
				<u-icon name="arrow-right" size="16" color="#ccc" style="margin-right: 10px;"></u-icon>
			</view>
		</view>
		
		<view class="btns" v-if="isJioned">
			<button type="primary" @click="toSendMessage">发消息</button>
		</view>
		<view class="btns" v-if="!isJioned">
			<button type="primary" @click="toSendQuest">申请加入</button>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				groupId:'',
				groupInfo:{},
				account:''
			}
		},
		computed:{
			isJioned(){
				return this.groupInfo.members.some(item => item.member == this.account && item.isAlive) ? true : false
			}
		},
		onLoad(option) {
			this.groupId = option.id
			this.getGroupInfo()
			
		},
		methods:{
	
		 getGroupInfo(){
				try {
					const value = uni.getStorageSync('accountId');
					if (value) {
						this.account = value
					}
				} catch (e) {
					// error
				}
				
				uni.request({
					url: this.$baseUrl + '/group/getGroupInfo',
					method: 'post',
					data: {
						groupId:this.groupId
					},
					success: (data) => {
						this.groupInfo = data.data.groupInfo
					}
				})
			},
			toSendQuest(){
				uni.navigateTo({
					url:`./sendGroupRequest/sendGroupRequest?account=${this.account}&groupId=${this.groupId}`
				})
			},
			toSendMessage(){
				uni.navigateTo({
					url:`/pages/chat/groupChatPage?groupName=${this.groupInfo.groupName}&groupId=${this.groupInfo.groupId}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.groupIntroduceContainer{
		position: relative;
		background: #f8f8f8;
		height: calc(100vh - 80rpx);
		
		.groupCard{
			background: #ffffff;
			padding:20rpx 20rpx;
			.card{
				display: flex;
				align-items: center;
				margin-bottom: 40rpx;
				image{
					width: 100rpx;
					height: 100rpx;
					margin-right: 20rpx;
					border-radius: 20rpx;
				}
				.info{
					display: flex;
					flex-direction: column;
					
					.name{
						font-weight: 900;
					}
					.id{
						color: #b0b2bf;
					}
				}
			}
			.date{
				color: #b0b2bf;
			}
		}
		
		.memberInfo{
			margin-top: 80rpx;
			background:#ffffff;
			
			.title{
				padding: 20rpx 20rpx;
				box-sizing: border-box;
				border-bottom: 1px solid #eeeff2;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.count{
					color: #ccc;
					display: flex;
					text{
						margin-right: 10rpx;
					}
				}
			}
			.infoDetail{
				height: 300rpx;
				background: #ffffff;
			}
		}
		.manager{
			display: flex;
			align-items: center;
			padding: 30rpx 20rpx;
			background: #ffffff;
			margin-top: 40rpx;
			.label{
				margin-right: 20rpx;
			}
			.imgs{
				flex: 1;
				image{
					width: 100rpx;
					height: 100rpx;
					border-radius: 20rpx;
					margin: 0 10rpx;
				}
			}
			.count{
				display: flex;
				color: #ccc;
				text{
					margin-right: 10rpx;
				}
			}
		}
		.btns{
			width: 100%;
			background: #ffffff;
			position: absolute;
			bottom: 0;
			padding: 40rpx 20rpx;
			box-sizing: border-box;
		}
	}
</style>
