<template>
	<view class="chatSettingContainer">
		<view class="groupAndNote">
			<view class="note">
				<text>备注</text>
				<view class="groupCell">
					<text v-model="group">哈哈哈</text>
					<u-icon name="arrow-right" size="16" color="#ccc" style="margin-right: 10px;"></u-icon>
				</view>
			</view>
			<u-divider></u-divider>
			<view class="group">
				<text>分组</text>
				<view class="groupCell">
					<text v-model="group">嘿嘿嘿</text>
					<u-icon name="arrow-right" size="16" color="#ccc" style="margin-right: 10px;"></u-icon>
				</view>
			</view>
		</view>
		<view class="deleteBtn">
			<text>删除好友</text>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.chatSettingContainer{
		background: #f8f8f8;
		height: 100vh;
	}
	.groupAndNote {
		background: #ffffff;

		.groupAndNoteTitle {
			background: #f8f8f8;
			color: #666;
			padding: 40rpx 0 40rpx 40rpx;
		}

		.u-divider {
			margin: 0 0 0 40rpx;
		}

		.note,
		.group {
			font-size: 36rpx;
			display: flex;
			align-items: center;
			height: 100rpx;
			padding-left: 40rpx;
			justify-content: space-between;
			text {
				margin-right: 10rpx;
			}

			// .noteCell,
			// .groupCell {
			// 	flex: 1;
			// }

			.groupCell {
				display: flex;
				// justify-content: space-between;
				align-items: center;
				font-size: 36rpx;
				color: #ccc;
				
			}
		}

	}

	.group:active {
		background: #f6f6f6;
	}
	.deleteBtn{
		height: 100rpx;
		background: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 40rpx;
		color:#f25e77
	}
	
</style>
