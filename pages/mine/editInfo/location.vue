<template>
	<view class="editLocation">
		<view class="location">
			<view class="locationItem" @click="open">
				<text class="country">国家</text>
				<view class="locationContent">
					<text>中国</text>
					<u-icon name="arrow-right" size="14" color="#aeaeae"></u-icon>
				</view>
			</view>
			<view class="locationItem" @click="open">
				<text class="province">省市</text>
				<view class="locationContent">
					<text>{{location}}</text>
					<u-icon name="arrow-right" size="14" color="#aeaeae"></u-icon>
				</view>
			</view>
		</view>
		<u-picker :show="show" ref="uPicker" :columns="columns" @confirm="confirm" @cancel="cancel()"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				location: '',
				show: false,
				columns: [
					['中国', '美国'],
					['深圳', '厦门', '上海', '拉萨']
				],
				columnData: [
					['深圳', '厦门', '上海', '拉萨'],
					['得州', '华盛顿', '纽约', '阿拉斯加']
				]
			}
		},
		onLoad(option) {
		},
		methods: {
			open() {
				this.show = true
			},
			cancel() {
				this.show = false
			},
			confirm(e) {
				this.show = false
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/info/setLocation',
							method: 'post',
							data: {
								account: res.data,
								location: e.value[0]+'-'+e.value[1]
							},
							success: (data) => {
								that.getLocation()
							}
						})
					}
				})
			},
			getLocation(){
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/info/getLocation',
							method: 'post',
							data: {
								account: res.data,
							},
							success:function(data){
								that.location = data.data.location
							}
						})
					}
				})
			}
		},
		onLoad() {
			this.getLocation()
		},
		onUnload(){
			uni.$emit('refreshData')
		}
	}
</script>

<style lang="scss">
	.editLocation {
		background: #f2f2f2;
		height: 100vh;
	}

	.location {
		background: #ffffff;
	}

	.locationItem {
		display: flex;
		justify-content: space-between;
		padding: 30rpx 20rpx 30rpx 40rpx;

		.country {
			margin-right: 60rpx;
		}

		.locationContent {
			display: flex;
			align-items: center;
			font-size: 30rpx;
			color: #aeaeae;
		}
	}

	.locationItem:active {
		background: #f6f6f6;
	}
</style>
