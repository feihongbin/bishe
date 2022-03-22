<template>
	<view class="code">
		<view class="tips">
			<text class="title">输入短信验证码</text>
			<text class="content">已向 <text class="phoneNum">+86 13777899752 </text> 发送验证码</text>
		</view>
		<view class="codeInput">
			验证码
		</view>
		<text class="resend">重新发送</text>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				phoneNumber:''
			}
		}
	}
</script>

<style lang="scss">
.code{
	background: #fff;
	.tips{
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
	.codeInput{
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
.resend{
	color: #58aff1;
	font-size: 28rpx;
	margin: 0 20rpx;
}
</style>
