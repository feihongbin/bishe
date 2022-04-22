<template>
	<view class="mineContainer">
		<uni-icons type="back" size="24"></uni-icons>
		<view class="info">
			<image @click="changeAvatar" class="avatar" :src="userInfo.avatar" mode=""></image>
			<view>
				<view class="nameItem" @click="nameClick(userInfo.name)">
					<text class="name">{{userInfo.name}}</text>
					<u-icon name="edit-pen" size="18"></u-icon>
				</view>
				<view class="nameItem" @click="signatureClick(userInfo.signature)">
					<text class="signature">{{userInfo.signature}}</text>
					<u-icon name="edit-pen" size="18"></u-icon>
				</view>

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
			<info-item class="detailItem" label="职业" :content="careerMap.get(userInfo.career) || '选择职业，发现同行'" showArrow
				@click.native="careerClick(userInfo.career)"></info-item>
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
				],
				careerMap:new Map([
					['1','计算机/互联网/通信'],
					['2','生产/工艺/制造'],
					['3','医疗/护理/制药'],
					['4','金融/银行/投资/保险']
				])

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
					url: `/pages/mine/editInfo/birth`
				})
			},
			locationClick(str) {
				uni.navigateTo({
					url: `/pages/mine/editInfo/location${str}`
				})
			},
			nativeClick(str) {
				uni.navigateTo({
					url: `/pages/mine/editInfo/native${str}`
				})
			},
			careerClick(val) {
				uni.navigateTo({
					url: `/pages/mine/editInfo/career?current=${val}`
				})
			},
			nameClick(str) {
				uni.navigateTo({
					url: `/pages/mine/editInfo/name?name=${str}`
				})
			},
			signatureClick(str) {
				uni.navigateTo({
					url: `/pages/mine/editInfo/signature?signature=${str}`
				})
			},
			changeAvatar(){
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						uni.uploadFile({
							url: 'http://127.0.0.1:3000/upload/singleFile', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							// formData: {
							// 	'user': 'test'
							// },
							success: (uploadFileRes) => {
								let data = JSON.parse(uploadFileRes.data)
								let fileUrl = 'http://127.0.0.1:3000/uploads/' + data.filename
								uni.request({
									url: this.$baseUrl + '/users/info/setAvatar',
									method: 'post',
									data: {
										account: this.userInfo.tid,
										avatar: fileUrl
									},
									success: (data) => {
										console.log(123444)
										this.getUserInfo()
									}
								})
							}
						});
					}
				});
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
		created() {
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

				.nameItem {
					display: flex;
					flex-direction: row;
					align-items: flex-end;

					.name {
						max-width: 400rpx;
						font-size: 48rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap
					}

					.signature {
						max-width: 400rpx;
						font-size: 30rpx;
						color: #333333;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap
					}
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
