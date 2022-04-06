<template>
	<view class="career">
		<career-item v-for="(item,index) in careerList" :content="item.content" :tag="item.tag" :type="item.type" :key="index"></career-item>
	</view>
</template>

<script>
	import CareerItem from '../../../components/careerItem.vue'
	export default{
		data(){
			return{
				careerList:[
					{
						tag:'IT',
						content:'计算机/互联网/通信',
						type:'primary'
					},
					{
						tag:'制造',
						content:'生产/工艺/制造',
						type:'primary'
					},
					{
						tag:'医疗',
						content:'医疗/护理/制药',
						type:'primary'
					},
					{
						tag:'金融',
						content:'金融/银行/投资/保险',
						type:'warning'
					}
				]
			}
		},
		components:{
			CareerItem
		}
	}
</script>

<style>
</style>
