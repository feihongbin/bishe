<template>
	<view class="career">
		<career-item v-for="(item,index) in careerList" :item="item" :current="current" :key="index" @changeCareer="change"></career-item>
	</view>
</template>

<script>
	import CareerItem from '../../../components/careerItem.vue'
	export default{
		data(){
			return{
				careerList:[
					{
						key:1,
						tag:'IT',
						content:'计算机/互联网/通信',
						type:'primary'
					},
					{
						key:2,
						tag:'制造',
						content:'生产/工艺/制造',
						type:'primary'
					},
					{
						key:3,
						tag:'医疗',
						content:'医疗/护理/制药',
						type:'primary'
					},
					{
						key:4,
						tag:'金融',
						content:'金融/银行/投资/保险',
						type:'warning'
					}
				],
				current:0
			}
		},
		components:{
			CareerItem
		},
		methods:{
			change(val){
				this.current = val
				this.submit()
			},
			submit(){
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/info/setCareer',
							method: 'post',
							data: {
								account: res.data,
								career: that.current
							},
							success: (data) => {
								uni.$emit('refreshData')
							}
						})
					}
				})
			}
		},
		onLoad(option) {
			this.current = option.current
		},
		onUnload() {
			this.submit()
		}
	}
</script>

<style>
</style>
