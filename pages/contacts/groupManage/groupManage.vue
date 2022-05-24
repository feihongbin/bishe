<template>
	<view class="nameContainer">
		<view class="chatTopBar">
			<uni-icons @click="goBack" type="back" size="24"></uni-icons>
			<view class="chatFriendInfo">
				<text class="friendName">分组管理</text>
				<!-- <text class="friendStatus">在线</text> -->
			</view>
			<text ></text>
		</view>
		<view class="groupList">
			<view class="groupListItem" @click="showModal('新建分组','')">
				<u-icon size="40" name="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/add.png"></u-icon>
				<text class="itemText">添加分组</text>
			</view>
			
			<view class="groupListItem extra" v-for="(item,index) in groupList" :key="index" >
				<u-icon @click="showDelete(item)" size="20" name="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/jianshao.png"></u-icon>
				<text class="textExtra" @click="showModal('编辑分组',item)">{{item}}</text>
			</view>
		</view>
		<u-modal :show="show" :title="title" @confirm="confirm" showCancelButton @cancel="cancel">
			<view class="slot-content">
				<text>请输入新的分组名称</text>
				<view class="input">
					<u--input v-model="value" placeholder="请输入分组名"  border="none" focus :clearable="true"></u--input>
				</view>
			</view>
		</u-modal>
		<u-modal showCancelButton :show="deleteShow" content='删除该分组后,组内联系人将移至默认分组' showCancelButton @cancel="cancel" @confirm="confirm"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				signature: '',
				show: false,
				title: '',
				value:'',
				oldValue:'',
				groupList:[],
				deleteShow:false,
				isDelete:false
			}
		},
		onLoad() {
			this.getGroupList()
		},
		onUnload() {
			uni.$emit('refreshFriend')
		},
		methods: {
			showDelete(item){
				console.log(2)
				this.deleteShow = true
				this.isDelete = true
				this.oldValue = item
			},
			getGroupList() {

				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/contacts/getGroup',
							method: 'post',
							data: {
								account: res.data,
							},
							success: (data) => {
								
								that.groupList = data.data.groupList
								console.log(this.groupList)
							}
						})
					}
				})

			},
			confirm() {
				this.show = false;
				this.deleteShow = false;
				uni.showLoading({
					title: '正在修改'
				});
				let that = this
				uni.getStorage({
					key: 'accountId',
					success: function(res) {
						uni.request({
							url: that.$baseUrl + '/users/contacts/editGroup',
							method: 'post',
							data: {
								account: res.data,
								newGroupName: that.value,
								oldGroupName:that.oldValue,
								isAdd: that.title === '新建分组' && !that.isDelete ? true : false,
								isDelete:that.isDelete
							},
							success: (data) => {
								uni.hideLoading();
								that.groupList = data.data.groupList
								console.log(this.groupList)
							}
						})
					}
				})
			},
			showModal(title, content) {
				this.title = title,
				this.value = content
				this.oldValue = content
				this.show = true
				
			},
			cancel(){
				this.show = false,
				this.deleteShow = false
				this.isDelete = false
				this.oldValue = ''
			},
			goBack(){
				uni.navigateBack({
					delta:1
				})
			}
		},


	}
</script>

<style lang="scss" scoped>
	.nameContainer {
		box-sizing: border-box;
		height: 100vh;
		background: #f8f8f8;
	}

	.chatTopBar {
		background: #f8f8f8;
		position: fixed;
		z-index: 999;
		height: 150rpx;
		width: 100%;
		box-sizing: border-box;
		padding: 80rpx 20rpx 0;

		display: flex;
		justify-content: space-between;

		.chatFriendInfo {
			display: flex;
			flex-direction: column;
			align-items: center;

			.friendStatus {
				font-size: 24rpx;
			}
		}
	}

	.groupList {
		position: relative;
		top: 180rpx;
		padding-left: 20rpx;
		box-sizing: border-box;
		background: #fff;

		.groupListItem {
			display: flex;
			padding: 20rpx 0 20rpx 20rpx;
			align-items: center;
			border-bottom: solid 1px #e5e5e5;

			.itemText {
				margin-left: 20rpx;
			}
		}

		.extra {
			padding-left: 40rpx;
		}

		.textExtra {
			margin-left: 40rpx;
		}
	}
	.slot-content{
		
		display: flex;
		flex-direction: column;
		align-items: center;
		.input{
			background: #f2f2f2;
			padding: 10rpx 20rpx 20rpx 20rpx;
			margin-top: 20rpx;
			
		}
	}
	
</style>
