<template>
	<view class="editBirth">
		<view class="birthDate">
			<view class="birthItem" @click="open">
				<text class="birthLabel">年龄</text>
				<text class="birthContent">{{age || ''}}</text>
			</view>
			<view class="birthItem" @click="open">
				<text class="birthLabel">星座</text>
				<text class="birthContent">{{age ? astro : ''}}</text>
			</view>
		</view>
		<u-datetime-picker :show="show" v-model="date" mode="date" @cancel="cancel()" @confirm="confirm">
		</u-datetime-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				date: '',
				show: false,
				timestamp: 0,
				month: 0,
				day: 0,
				birth: 0
			}
		},
		computed: {
			age() {
				console.log(this.timestamp)
				let date = new Date(this.timestamp)
				let curDate = new Date(Date.now())
				let month = date.getMonth() + 1
				let curMonth = curDate.getMonth() + 1
				let year = date.getFullYear()
				let curYear = curDate.getFullYear()

				return month <= curMonth ? curYear - year : curYear - year - 1
			},
			astro() {
				const s = "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯"
				const dates = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
				return s.substr(this.month * 2 - (this.day < dates[this.month - 1] ? 2 : 0), 2)
			}
		},
		methods: {
			open() {
				this.show = true
			},
			cancel() {
				this.show = false
			},
			confirm(val) {
				this.show = false
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + `/users/info/setBirth`,
							method: 'post',
							data: {
								account: res.data,
								birth: val.value
							},
							success: (data) => {
								that.getBirth()
							}
						})
					}
				})
			},
			getBirth() {
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + `/users/info/birth?account=${res.data}`,
							method: 'get',
							success: (data) => {
								console.log(data.data.birth)
								that.timestamp = Number.parseInt(data.data.birth)
								let date = new Date(Number.parseInt(data.data.birth))
								that.month = date.getMonth() + 1
								that.day = date.getDate()
								console.log(that.month, that.day)
							}
						})
					}
				})
			}

		},
		onLoad() {
			this.getBirth()
		},
		onUnload(){
			uni.$emit('refreshData')
		}

	}
</script>

<style lang="scss">
	.editBirth {
		background: #f2f2f2;
		height: 100vh;
	}

	.birthDate {
		background: #ffffff;
	}

	.birthItem {
		display: flex;
		justify-content: space-between;
		padding: 30rpx 0 30rpx 40rpx;

		.birthLabel {
			margin-right: 60rpx;
		}

		.birthContent {
			flex: 1;
		}
	}

	.birthItem:active {
		background: #f6f6f6;
	}
</style>
