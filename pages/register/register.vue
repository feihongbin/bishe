<template>
	<view>
		<view class="code">
			<view class="tips">
				<text class="title">设置昵称与密码</text>
			</view>
			<view class="accountInput">
				<input type="text" v-model="name" placeholder="昵称" />
			</view>
			<view class="accountInput">
				<input :type="isShowPassword ? 'text' : 'password'" v-model="password" placeholder="密码" />
				<u-icon v-if="!isShowPassword" class="showPassword" name="eye-off" size="20" @click="changeStatus"></u-icon>
				<u-icon v-if="isShowPassword" class="showPassword" name="eye-fill" color="#2eb7f1" size="20" @click="changeStatus"></u-icon>
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
			<button type="primary" :disabled="!isValid" @click="createAccount">注册并登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:'',
				password:'',
				isShowPassword:false,
				phone:''
			};
		},
		computed: {
			checkFirst() {
				return /.{8,16}/.test(this.password) ? '#53c21d' : '#b1b7bd'
			},
			checkSecond() {
				return /(?=.*[0-9])(?=.*[a-z])^[0-9A-Za-z]{2,}$/.test(this.password) ? '#53c21d' : '#b1b7bd'
			},
			isValid(){
				return /.{8,16}/.test(this.password) && /(?=.*[0-9])(?=.*[a-z])^[0-9A-Za-z]{2,}$/.test(this.password) && this.name!=''
			}
			
		},
		methods:{
			changeStatus(){
				this.isShowPassword = !this.isShowPassword
			},
			createAccount(){
				if(this.phone && this.name && this.isValid){
					uni.request({
						url: this.$baseUrl + '/users/register',
						method: 'POST',
						data: {
							phone: this.phone,
							name:this.name,
							password:this.password
						},
						success: (data) => {
							console.log('创建用户成功',data)
						}
					})
				}
			}
		},
		onLoad(options) {
			this.phone = options.phone
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

		}

		.accountInput {
			position: relative;
			display: flex;
			margin: 40rpx 40rpx 20rpx;
			border-bottom: 2rpx #eee solid;
			padding-bottom: 20rpx;
		
			text {
				display: inline-block;
				width: 160rpx;
			}
			.showPassword{
				position: absolute;
				right: -100rpx;
			}
		}

		button {
			margin: 0 40rpx;
		}
	}
	.ruleWrapper {
		margin-left: 20rpx;
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
