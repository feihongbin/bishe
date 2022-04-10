<template>
	<view class="code">
		<view class="tips">
			<text class="title">输入短信验证码</text>
			<text class="content">已向 <text class="phoneNum">+86 {{phoneNumber}} </text> 发送验证码</text>
		</view>
		<view class="codeInput">
			<u-code-input mode="line" maxlength="4" hairline color="#f56c6c" :focus="true" @finish="finish">
			</u-code-input>
		</view>
		<text :class="countdown > 0 ? 'cantResend' : 'resend'" @click="resend">重新发送<text
				v-if="this.countdown > 0">({{countdown}})</text></text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phoneNumber: '',
				inputCode: '',
				countdown: 0,
				intervalId: ''
			}
		},

		methods: {
			finish(e) {
				// console.log(typeof this.inputCode,typeof e)
				console.log(this.inputCode)
				if (this.inputCode === e) {
					console.log(123124)
					uni.navigateTo({
						url: `./register?phone=${this.phoneNumber}`
					})
				}
			},
			sendRegisterCode(phone) {
				uni.request({
					url: this.$baseUrl + '/users/registerCode',
					method: 'POST',
					data: {
						phone: phone
					},
					success: (data) => {
						this.inputCode = data.data.data
						console.log(data)
					}
				})
			},
			setCountdown() {
				if (this.intervalId || this.countdown <= 0) {
					this.countdown = 10
					clearInterval(this.intervalId)
				}
				this.intervalId = setInterval(() => {
					if (this.countdown > 0) {
						this.countdown--
					}
					return
				}, 1000)

			},
			resend() {
				if (this.countdown <= 0) {
					this.sendRegisterCode(this.phoneNumber)
					this.setCountdown()
				}
			}
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			this.phoneNumber = option.phone; //打印出上个页面传递的参数。
			this.sendRegisterCode(option.phone)
			this.setCountdown()
		}
	}
</script>

<style lang="scss">
	.code {
		background: #fff;

		.tips {
			padding: 40rpx 20rpx 20rpx;

			.title {
				display: block;
				font-size: 72rpx;
			}

			.content {
				display: block;
				font-size: 24rpx;
				color: #666;
			}
		}

		.codeInput {
			display: flex;
			margin: 0rpx 0 40rpx;
			padding: 20rpx;

			.areaId {
				color: #58aff1;
				padding-right: 20rpx;

			}
		}

		button {
			margin: 0 20rpx;
		}
	}

	.phoneNum {
		color: #ffd860;
	}

	.resend {
		color: #58aff1;
		font-size: 28rpx;
		margin: 0 20rpx;
	}

	.cantResend {
		color: #6e6d6c;
		font-size: 28rpx;
		margin: 0 20rpx;
	}
</style>
