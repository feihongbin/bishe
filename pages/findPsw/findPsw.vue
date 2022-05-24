<template>
	<view class="findPswContainer">
		<view class="accountInput">
			<text>新密码 </text>
			<input type="password" v-model="password" placeholder="请输入新密码" />
		</view>
		<view class="accountInput">
			<text>确认密码</text>
			<input type="password" v-model="newPassword" placeholder="请再次输入新密码" />
		</view>
		<view class="ruleWrapper">
			<view class="ruleItem">
				<u-icon name="checkmark-circle-fill" :color="checkFirst" size="16"></u-icon>
				<text>密码由8-16位数字、大写字母、小写字母组成</text>
			</view>
			<view class="ruleItem">
				<u-icon name="checkmark-circle-fill" :color="checkSecond" size="16"></u-icon>
				<text>至少含有两种及以上字符</text>
			</view>
		</view>
		<button type="primary" :disabled="!(password!=='' &&(newPassword === password))" @click="changePsw()">确定</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				password: '',
				newPassword: '',
				account:''
			}
		},
		computed: {
			checkFirst() {
				return /.{8,16}/.test(this.password) ? '#53c21d' : '#b1b7bd'
			},
			checkSecond() {
				return /(?=.*[0-9])(?=.*[a-z])^[0-9A-Za-z]{2,}$/.test(this.password) ? '#53c21d' : '#b1b7bd'
			}
		},
		methods:{
			changePsw(){
				uni.request({
					url: this.$baseUrl + '/users/changePsw',
					method: 'post',
					data: {
						account: this.account,
						newPassword:this.newPassword
					},
					success: (data) => {
						// that.userInfo = data.data.info
						// console.log(that.userInfo)
						// this.phone = data.data.phone
						uni.navigateTo({
							url:'./success'
						})
					}
				})
			}
		
		},
		onLoad(option) {
			this.account = option.account
		}

	}
</script>

<style lang="scss">
	.findPswContainer {
		padding: 0 40rpx;
	}

	.accountInput {
		display: flex;
		margin-top: 40rpx;
		border-bottom: 2rpx #eee solid;
		padding-bottom: 20rpx;

		text {
			display: inline-block;
			width: 160rpx;
		}
	}

	.ruleWrapper {
		margin-top: 30rpx;
		margin-left: -20rpx;
		margin-bottom: 40rpx;

		.ruleItem {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			margin: 10rpx 0;

			text {
				margin-left: 20rpx;
				font-size: 24rpx;
				color: #666
			}
		}
	}
</style>
