<template>
	<view class="addFriendListItem">
		<view class="friendBaseInfo" @click="toDetail">
			<image class="avatar" :src="detail.avatar" mode=""></image>
			<view class="baseInfo">
				<text>{{detail.name}}</text>
				<text>{{friend.message}}</text>
			</view>
		</view>
		<view class="agreeBtn">
			<u-button v-if="friend.status === 0" color="#eaedf4" text="同意" style="color:#000;" @click="agree(friend.friendId,1)"></u-button>
			<text v-if="friend.status === 1">已同意</text>
			<text v-if="friend.status === 2">已拒绝</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "addFriendListItem",
		data() {
			return {
				detail: {}
			};
		},
		props: {
			friend: Object
		},
		methods: {
			toDetail() {
				uni.navigateTo({
					url: `./requestDetail?id=${this.detail.tid}&message=${this.friend.message}&status=${this.friend.status}`
				})
			},
			agree(friendId,status) {
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/addFriend/agree',
							method: 'post',
							data: {
								account:res.data,
								friendId: friendId,
								note: that.friend.note,
								group: that.friend.group,
								isRead: true,
								status: status,
								avatar:that.detail.avatar,
								name:that.detail.name,
								receiveSetting:1,
								messages:[]
							},
							success: (data) => {
								// this.detail = data.data.newFriendDetail
								// console.log(that.detail)
								uni.$emit('updateNewFriendList')
							}
						})
					}
				})
			},
			getFriendDetail() {
				let that = this
				uni.request({
					url: that.$baseUrl + '/users/home/newFriendDetail',
					method: 'post',
					data: {
						friendId: that.friend.friendId
					},
					success: (data) => {
						that.detail = data.data.newFriendDetail
					}
				})
			}
		},
		mounted() {
			this.getFriendDetail()
		
			uni.$on('agreeFriend',data =>{
				if(data.id === this.friend.friendId){
					this.agree(data.id,data.status)
				}
			})
		},
		
	}
</script>

<style lang="scss" scoped>
	.addFriendListItem {
		background: #ffffff;
		padding: 20rpx 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.friendBaseInfo {
			display: flex;

			.avatar {
				width: 100rpx;
				height: 100rpx;
				margin-right: 20rpx;
			}

			.baseInfo {
				display: flex;
				flex-direction: column;

				text:nth-child(1) {
					font-weight: 500;
					font-size: 36rpx;
				}

				text:nth-child(2) {
					color: #ccc;
					font-size: 30rpx;
				}
			}
		}

		.agreeBtn {
			text{
				color: #ccc;
			}
		}
	}
</style>
