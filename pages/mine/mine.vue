<template>
	<view class="mineContainer">
		<uni-icons type="back" size="24"></uni-icons>
		<view class="info">
			<image class="avatar" :src="userInfo.avatar" mode=""></image>
			<view>
				<text class="name">{{userInfo.name}}</text>
				<text class="signature">{{userInfo.signature}}</text>
			</view>
		</view>
		<view class="detail">
			<!-- <info-item class="detailItem" v-for="(item,index) in infoList" :label="item.label" :content="item.content" :showArrow="item.showArrow" :to="item.to"></info-item> -->
			<info-item class="detailItem" label="账号" :content="userInfo.tid" :showArrow="false" @click.native="click">
			</info-item>
			<info-item class="detailItem" label="性别" :content="userInfo.gender" showArrow @click.native="genderClick">
			</info-item>
			<info-item class="detailItem" label="生日" :content="formateStampToDate(Number.parseInt(userInfo.birth))"
				showArrow @click.native="birthClick()"></info-item>
			<info-item class="detailItem" label="所在地" :content="userInfo.location" showArrow
				@click.native="locationClick('?location=浙江-杭州')"></info-item>
			<info-item class="detailItem" label="家乡" :content="userInfo.native" showArrow
				@click.native="nativeClick('?native=浙江-杭州')"></info-item>
			<info-item class="detailItem" label="职业" :content="userInfo.career" showArrow
				@click.native="careerClick('')"></info-item>
		</view>
		<u-picker :show="genderShow" :columns="columns" :defaultIndex="defaultIndex" @cancel="genderCancel"
			@confirm="genderConfirm" :closeOnClickOverlay="true"></u-picker>
	</view>
</template>

<script>
	import InfoItem from '../../components/infoItem.vue'

	export default {
		data() {
			return {
				userInfo: {},
				genderShow: false,
				columns: [
					['男', '女']
				]

			};
		},
		components: {
			InfoItem
		},
		computed: {
			defaultIndex() {
				return this.userInfo.gender === '男' ? [0] : [1]
			}
		},
		methods: {
			genderClick() {
				this.genderShow = true
			},
			genderCancel() {
				this.genderShow = false
			},
			genderConfirm(e) {
				this.genderShow = false
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/info/setGender',
							method: 'post',
							data: {
								account: res.data,
								gender: e.value[0]
							},
							success: (data) => {
								that.getUserInfo()
							}
						})
					}
				})
			},

			birthClick(str) {
				uni.navigateTo({
					url: `editInfo/birth`
				})
			},
			locationClick(str) {
				uni.navigateTo({
					url: `editInfo/location${str}`
				})
			},
			nativeClick(str) {
				uni.navigateTo({
					url: `editInfo/native${str}`
				})
			},
			careerClick() {
				uni.navigateTo({
					url: `editInfo/career`
				})
			},
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
			getUserInfo() {
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/info',
							method: 'post',
							data: {
								account: res.data,
							},
							success: (data) => {
								that.userInfo = data.data.info
								console.log(that.userInfo)
							}
						})
					}

				})

			},
		},
		onLoad() {
			this.getUserInfo()
			uni.$on('refreshData', () => {
				this.getUserInfo()
			})
		}
	}
</script>

<style lang="scss" scoped>
	.mineContainer {
		padding: 80rpx 20rpx 0;
		background-color: #f8f8f8;
		height: 100vh;

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
	}

	.detailItem:nth-child(1) {
		padding-top: 40rpx;
	}
</style>
