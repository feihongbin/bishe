<template>
	<view class="">
		<view class="careerItem" v-for="(item,index) in groupList" :key="index" @click="changeGroup(item)">

			<text>{{item}}</text>
			<view class="icon" v-if="item === currentGroup">
				<u-icon name="checkmark" size="20"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				friendId: '',
				currentGroup: '',
				groupList: []
			}
		},
		methods: {
			getGroupList() {
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/contacts/getGroup',
							method: 'post',
							data: {
								account: res.data,
							},
							success: (data) => {
								that.groupList = data.data.groupList
								console.log(that.groupList)
							}
						})
					}

				})
			},
			changeGroup(val) {
				let that = this
				that.currentGroup = val
				uni.navigateBack({
					delta: 1
				})
				
			}
		},
		onLoad(option) {
			this.getGroupList()
		},
		onUnload() {
			uni.$emit('selectedGroup',this.currentGroup)
		}
	}
</script>
<style lang="scss" scoped>
	.careerItem {
		display: flex;
		align-items: center;
		padding: 20rpx 20rpx;
		border-bottom: solid 1px #e5e5e5;
		position: relative;
	}

	.careerTag {
		width: 80rpx;
		margin-right: 20rpx;
	}

	.icon {
		position: absolute;
		right: 40rpx;
		top: 30rpx;
	}
</style>

<style lang="scss" scoped>
	/deep/ .u-tag {
		justify-content: center;
	}
</style>
