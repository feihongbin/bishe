<template>
	<view class="editBirth">
		<view class="birthDate">
			<view class="birthItem" @click="open">
				<text class="birthLabel">年龄</text>
				<text class="birthContent">22</text>
			</view>
			<view class="birthItem" @click="open">
				<text class="birthLabel">星座</text>
				<text class="birthContent">天蝎</text>
			</view>
		</view>
		<u-datetime-picker :show="show" v-model="date" mode="date" @cancel="cancel()" @confirm="confirm"></u-datetime-picker>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				date:'',
				show:false
			}
		},
		onLoad(option) {
			this.date = option.birth
			console.log(option)
		},
		methods:{
			open(){
				this.show = true
			},
			cancel(){
				this.show = false
			},
			confirm(val){
				this.show = false
				console.log(val)
			}
		}
	}
</script>

<style lang="scss">
	.editBirth{
		background: #f2f2f2;
		height: 100vh;
	}
	.birthDate{
		background: #ffffff;
	}
	.birthItem{
		display: flex;
		justify-content: space-between;
		padding: 30rpx 0 30rpx 40rpx;
		.birthLabel{
			margin-right: 60rpx;
		}
		.birthContent{
			flex: 1;
		}
	}
	.birthItem:active{
		background:#f6f6f6 ;
	}
</style>
