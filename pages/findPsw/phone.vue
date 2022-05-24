<template>
	<view class="findByPhone">
		<view class="tips">
			<text class="title">填写手机号码</text>
			<text class="content">请填写出完整的手机号 <text class="phoneNum"> {{phone.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}} </text> 以验证身份</text>
		</view>
		<view class="phoneInput">
			<text class="areaId">+86</text>
			<input type="text" placeholder="请输入手机号" v-model="phoneNumber" />
		</view>
		<button type="primary" :disabled="phoneNumber.length !== 11" @click="next()">下一步</button>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				phoneNumber:'',
				phone:'',
				account:"",
			}
		},
		methods:{
			next(){
				if(this.phoneNumber === this.phone){
					uni.navigateTo({
						url:`./findPsw?account=${this.account}`
					})
				}else{
					uni.showToast({
						icon:"error",
						title: '手机号码验证错误',
						duration: 2000
					});
				}
			},
			getPhone(id){
				uni.request({
					url: this.$baseUrl + '/users/getPhone',
					method: 'post',
					data: {
						account: id,
					},
					success: (data) => {
						// that.userInfo = data.data.info
						// console.log(that.userInfo)
						this.phone = data.data.phone
					}
				})
			}
		},
		onLoad(option) {
			this.account = option.account
			this.getPhone(option.account)
		}
	}
</script>

<style lang="scss">
.findByPhone{
	background: #f8f8f8;
	
	.tips{
		background: #fff;
		padding: 40rpx 20rpx;
		.title{
			display: block;
			font-size: 72rpx;
		}
		.content{
			display: block;
			font-size: 24rpx;
			color: #666;
		}
	}
	.phoneInput{
		background: #fff;
		display: flex;
		margin: 40rpx 0 40rpx;
		padding: 20rpx;
		.areaId{
			color: #58aff1;
			padding-right: 20rpx;
			
		}
	}
	button{
		margin: 0 20rpx;
	}
}
.phoneNum{
	color: #ffd860;
}
</style>
