<template>
	<view class="">
		<group-list :list="memberList" :permission="permission" :groupId="groupId"></group-list>
	</view>
</template>

<script>
	import GroupList from '../../../components/groupList.vue'
	export default {
		data() {
			return {
				memberList:[],
				friendList:[],
				permission:'0',
				groupId:''
			}
		},
		components:{
			GroupList
		},
		methods:{
			getGroupInfo(groupId) {
				uni.request({
					url: this.$baseUrl + '/group/getGroupInfo',
					method: 'post',
					data: {
						groupId: groupId,
					},
					success: (data) => {
						this.memberList = data.data.groupInfo.members.sort((a,b) => b.permission - a.permission)
						console.log('213',this.memberList)
					}
				})
			},
			getFriendList(){
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						that.account = res.data
							uni.request({
								url: that.$baseUrl + '/users/contacts/getFriendList',
								method: 'post',
								data: {
									account: res.data,
								},
								success: (data) => {
									that.friendList = data.data.friendList
								}
							})
					}
				
				})
			},
			
		},
		onLoad(option) {
			this.permission = option.permission
			this.groupId = option.id
			this.getGroupInfo(option.id)
			this.getFriendList()
			uni.$on('refreshgroupMemberList',()=>{
				this.getGroupInfo(option.id)
			})
		},
		onUnload() {
			uni.$emit('refreshGroupInfo')
		}
	}
</script>

<style lang="scss" scoped>
	// .list-cell {
	// 	display: flex;
	// 	box-sizing: border-box;
	// 	width: 100%;
	// 	padding: 10px 24rpx;
	// 	overflow: hidden;
	// 	color: #323233;
	// 	font-size: 14px;
	// 	line-height: 24px;
	// 	background-color: #fff;
	// }
</style>