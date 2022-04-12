<template>
	<view class="loginContainer">
		<view class="loginImg">
			<image src="../../static/logo.png" width="20rpx" mode=""></image>
		</view>
		<view class="loginInput">
			<input type="text" v-model="account" placeholder="请输入账号" />
			<input type="password" v-model="password" placeholder="请输入密码" />
		</view>
		<view class="loginBtn">
			<button type="primary" @click="loginAccount">登录</button>
		</view>
		<view class="loginSpan">
			<view class="spanCtx">
				<text @click="findPsw">忘记密码</text><text>|</text><text @click="register">用户注册</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				account:'',
				password:''
			};
		},
		methods:{
			loginAccount(){
				// if(this.account && this.password){
				// 	uni.request({
				// 		url:this.$baseUrl+'/users/login',
				// 		method:'post',
				// 		data:{
				// 			account:this.account,
				// 			password:this.password
				// 		},
				// 		success:(data)=>{
				// 			console.log(data.data.code)
				// 			if(data.data.code === 200){
				// 				uni.setStorage({
				// 					key: 'accountId',
				// 					data: data.data.account,
				// 					success: function () {
				// 						uni.navigateTo({
				// 							url:`../home/home`
				// 						})
				// 					}
				// 				});
								
				// 			}
				// 		}
				// 	})
					
				// }
				uni.navigateTo({
					url:`../home/home`
				})
			},
			findPsw(){
				uni.navigateTo({
					url:'../findPsw/index'
				})
			},
			register(){
				uni.navigateTo({
					url:'../register/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	.loginContainer {
		margin-top: 50%;
		transformY: -50%;
		overflow: hidden;
		padding: 0 100rpx;
	}

	.loginImg {
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 1;

		image {
			width: 150rpx;
			height: 150rpx;
		}
	}

	.loginInput {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 50rpx;

		input {
			background-color: #f6f7f8;
			text-align: center;
			margin: 10rpx 0;
			padding: 30rpx 0rpx;
			border-radius: $uni-border-radius-lg;
			box-sizing: content-box;
			width: 100%;
			font-size: $uni-font-size-lg;
		}
	}

	.loginBtn {
		margin-top: 80rpx;
	}

	.loginSpan {
		font-size: $uni-font-size-sm;
		color: #666;
		display: flex;
		margin-top: 40rpx;
		justify-content: center;

		.spanCtx {
			text:nth-child(2) {
				margin: 0 40rpx;
			}
		}

	}

	.placeholderCtx {
		text-align: left;
	}
</style>
