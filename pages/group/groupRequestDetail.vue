<template>
	<view class="requestDetailContainer">
		<view class="info" @click="checkDetail">
			<view class="baseInfo">
				<image :src="userInfo.avatar" mode=""></image>
				<text class="name">{{userInfo.name}}</text>
				<text class="tid">({{userInfo.tid}})</text>
			</view>
			<u-icon name="arrow-right" size="16" style="margin-right: 10px;"></u-icon>
		</view>
		<view class="extra">
			<!-- <text class="label">附加消息</text>
			<text class="content">{{message}}</text> -->
			<text>{{(this.type == '0' ? '申请加入 ' : '邀请你加入 ') + name}}</text>
			<!-- <view class="">
			</view> -->
			<text class="content">{{message}}</text>
		</view>
		<view class="btns">
				<u-button v-if="status === '0'" class="btn" text="拒绝" @click="reject"></u-button>
				<u-button v-if="status === '0'" class="btn" text="同意" @click="agree" type="primary"></u-button>
			
		</view>
		<view v-if="status !== '0'" class="result">
			<text>已{{status===1?'同意':'拒绝'}}该申请</text>
		</view>
	</view>      
</template>

<script>
	export default{
		data(){
			return{
				userInfo:{},
				message:'',
				id:'',
				status:'0',
				type:'',
				name:''
			}
		},
		methods:{
			checkDetail(){
				uni.navigateTo({
					url:`/pages/contacts/addFriend/searchResult?id=${this.id}`
				})
			},
			getInfo(id){
				uni.request({
					url: this.$baseUrl + '/users/info',
					method: 'post',
					data: {
						account: id
					},
					success: (data) => {
						this.userInfo = data.data.info
					}
				})
			},
			reject(){
				this.status = '2'
				uni.$emit('agreeFriend',{id:this.id,status:2})
			},
			agree(){
				this.status = '1'
				uni.$emit('agreeFriend',{id:this.id,status:1})
			}
		},
		onLoad(option) {
			this.id = option.id
			this.name = option.name
			this.status = option.status
			this.type = option.type
			this.getInfo(option.id)
			this.message = option.message
		}
	}
</script>

<style lang="scss" scoped>
.requestDetailContainer{
	background: #f8f8f8;
	height: 100vh;
	.info{
		background: #ffffff;
		padding: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #efefef;
		image{
			width: 100rpx;
			height: 100rpx;
			margin-right: 20rpx;
		}
		.baseInfo{
			display: flex;
			align-items: center;
		}
		.name{
			width: 200rpx;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space:nowrap;
			font-weight: 500;
		}
		.tid{
			color: #666666
		}
	}
	
	.extra{
		background: #ffffff;
		display: flex;
		flex-direction: column;
		// align-items: center;
		padding: 50rpx 60rpx 50rpx 20rpx;
		border-bottom: 1px solid #efefef;
		.label{
			color: #666666;
			width: 140rpx;
			margin-right:20rpx ;
		}
		.content{
			flex: 1;
			margin-top: 20rpx;
			// overflow: hidden;
			// text-overflow:ellipsis;
			// white-space:nowrap;
			color: #666666;
		}
	}
	.btns{
		display: flex;
		padding: 0 20rpx;
		margin-top: 40rpx;
		justify-content: space-between;
		.btn{
			flex: 1;
			margin: 10rpx;
		}
		
	}
	.result{
		color: #ccc;
		text-align: center;
		margin-top: 40rpx;
	}
	
}
</style>
