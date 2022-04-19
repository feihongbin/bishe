<template>
	<view class="groupSettingContainer">
		<view class="groupName">
			<view class="groupCell">
				<image :src="groupInfo.groupAvatar" mode=""></image>
				<text>{{groupInfo.groupName}}</text>
			</view>
			<u-icon name="arrow-right" size="16" color="#ccc" style="margin-right: 10px;"></u-icon>
		</view>

		<view class="groupMembers">
			<view class="title">
				<text class="titleContent">群聊成员</text>
				<view class="count">
					<text>共{{groupInfo.members.length}}人</text>
					<u-icon name="arrow-right" size="16" color="#ccc" style="margin-right: 10px;"></u-icon>
				</view>
			</view>
			<view class="imgList">
				<view class="imgItem" v-for="(item,index) in groupInfo.members" :key="index">
					<image :src="item.avatar" mode=""></image>
					<text>{{item.groupNote}}</text>
				</view>
				<!-- <view class="imgItem">
					<image src="../../static/logo.png" mode=""></image>
					<text>哈哈哈</text>
				</view>
				<view class="imgItem">
					<image src="../../static/logo.png" mode=""></image>
					<text>哈哈哈哈</text>
				</view>
				<view class="imgItem">
					<image src="../../static/logo.png" mode=""></image>
					<text>哈哈哈哈</text>
				</view>
				<view class="imgItem">
					<image src="../../static/logo.png" mode=""></image>
					<text>哈哈哈哈</text>
				</view>
				<view class="imgItem">
					<image src="../../static/logo.png" mode=""></image>
					<text>哈哈哈哈</text>
				</view> -->
				<view class="imgItem">
					<image src="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/yaoqing.png" mode=""></image>
					<text>邀请</text>
				</view>
			</view>

		</view>
		<view class="groupInfo">
			<view class="infoItem">
				<text class="label">群聊名称</text>
				<view class="content">
					<text>{{groupInfo.groupName}}</text>
					<u-icon name="arrow-right" size="16" color="#ccc" style="margin-right: 10px;"></u-icon>
				</view>
			</view>
			<view class="infoItem">
				<text class="label">群号</text>
				<view class="content">
					<text>{{groupInfo.groupId}}</text>
					<u-icon name="arrow-right" size="16" color="#ccc" style="margin-right: 10px;"></u-icon>
				</view>
			</view>
		</view>

		<view class="groupSetting">
			<view class="infoItem">
				<text class="label">置顶</text>
				<u-switch v-model="isTop" @change="changeIsTop"></u-switch>
			</view>
			<view class="infoItem">
				<text class="label">消息免打扰</text>
				<u-switch v-model="isRemind" @change="changeIsTop"></u-switch>
			</view>
		</view>

		<view class="groupInfo">
			<view class="infoItem">
				<text class="label">我的群昵称</text>
				<view class="content">
					<text>未设置</text>
					<u-icon name="arrow-right" size="16" color="#ccc" style="margin-right: 10px;"></u-icon>
				</view>
			</view>

		</view>

		<view class="deleteBtn">
			<text>解散群聊</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isTop: true,
				isRemind: false,
				groupInfo: {}
			}
		},
		methods: {
			changeIsTOP() {
				this.isTop = !this.isTop
			},
			getGroupInfo(groupId) {
				uni.request({
					url: this.$baseUrl + '/group/getGroupInfo',
					method: 'post',
					data: {
						groupId: groupId,
					},
					success: (data) => {
						console.log(data.data.groupInfo)
						this.groupInfo = data.data.groupInfo
					}
				})
			}
		},
		onLoad(option) {
			this.getGroupInfo(option.id)
		}
	}
</script>

<style lang="scss" scoped>
	.groupSettingContainer {
		background: #f8f8f8;
		height: 100vh;
	}

	.groupName {
		background: #ffffff;
		display: flex;
		justify-content: space-between;
		height: 120rpx;
		padding: 0 20rpx;

		.groupCell {
			display: flex;
			// justify-content: space-between;
			align-items: center;
			font-size: 36rpx;
			color: #ccc;

			image {
				width: 90rpx;
				height: 90rpx;
				margin-right: 20rpx;
			}

			text {
				width: 40vw;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap
			}
		}

	}

	.groupMembers {
		margin-top: 40rpx;
		background: #ffffff;
		padding: 20rpx 20rpx;

		.title {
			display: flex;
			justify-content: space-between;
			padding-bottom: 10rpx;

			.count {
				display: flex;
				color: #ccc;

				text {
					margin-right: 10rpx;
				}
			}
		}

		.imgList {
			display: flex;
			flex-wrap: wrap;

			.imgItem {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 80rpx;
				box-sizing: border-box;
				margin: 20rpx 40rpx 0 20rpx;

				image {
					width: 80rpx;
					height: 80rpx;
				}

				text {
					max-width: 80rpx;
					font-size: 24rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap
				}
			}

			.imgItem:nth-last-child(1) {
				color: #ccc;
			}
		}
	}


	.groupInfo,
	.groupSetting {
		background: #fff;
		margin-top: 60rpx;

		.infoItem {
			display: flex;
			justify-content: space-between;
			padding: 40rpx 20rpx;
			box-sizing: border-box;
			border-bottom: 1px solid #eeeff2;

			.content {
				color: #ccc;
				display: flex;
				justify-content: flex-end;
				width: 400rpx;

				text {
					margin-right: 20rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap
				}
			}
		}
	}


	.group:active {
		background: #f6f6f6;
	}




	.deleteBtn {
		height: 100rpx;
		background: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 40rpx;
		color: #f25e77
	}
</style>
