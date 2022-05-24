<template>
	<view class="indexListContianer">
	<!-- 	<u-index-list :index-list="indexList" class="friendList" :sticky="false">
			<template v-for="(item, index) in itemArr">
				<u-index-item> -->
					<!-- <u-index-anchor bgColor="#fff" :text="indexList[index]"></u-index-anchor> -->
					<view class="list-cell" v-for="(cell, index) in list" @click="toDetail(cell)">
						<image :src="cell.avatar" mode=""></image>
						<u-tag v-if="cell.permission === 2" text="群主" size="mini" type="warning"></u-tag>
						<u-tag v-if="cell.permission === 1" text="管理员" size="mini" type="success"></u-tag>
						<text class="name">{{cell.groupNote}}</text>
						<!-- <button class="btn" type="default" size="mini">加好友</button> -->
					</view>

		<!-- 		</u-index-item>
			</template>
		</u-index-list> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				memberList: [],
				indexList: [],
				itemArr: []
			};
		},
		props: {
			list: Array,
			permission:String,
			groupId:''
		},
		watch:{
			list(val){
				
			}
		},
		methods: {
			toDetail(val) {
				let that = this
				let per = val.permission >= that.permission ? '0' : '1'
				uni.getStorage({
					key:'accountId',
					success(res) {
						if(val.member == res.data){
							uni.navigateTo({
								url:`/pages/contacts/addFriend/searchResult?id=${res.data}&isSelf=${true}`
							})
						}else {
							uni.navigateTo({
								url: `/pages/contacts/addFriend/searchResult?id=${val.member}&permission=${per}&groupId=${that.groupId}`
							})
						}
					}
				})
				console.log(val)
				
			},
			filterFriendList(arr) {
				return arr.map((item, index) => {
					return  {
						name: item.groupNote,
						avatar: item.avatar,
						id: item.member,
						permission:item.permission
					} 
				})
			},
			fixTheSearchTeachers(names) {
				let data = names;
				let indexList = []
				let itemArr = []
				data.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN', {
					sensitivity: 'accent'
				}));
				let compareStr = ["吧", "擦", "搭", "妸", "发", "旮", "哈", "击", "咖", "垃", "妈", "那", "噢", "葩", "妻", "燃", "仨", "它",
					"挖", "夕", "匝"
				];
				let UpperCode = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
					"T", "W", "X", "Z"
				];
				let temp = [],
					newData = [];
				for (let j = 0, i = 0; i < data.length;) {
					if (data[i].name.localeCompare(compareStr[j], 'zh-Hans-CN', {
							sensitivity: 'base'
						}) <= 0) {
						temp.push(data[i]);
						i++;
					} else if (temp.length > 0) {
						temp.unshift(UpperCode[j++]);
						newData.push(temp);
						temp = [];
					} else {
						j++;
					}
				}
				return newData
			},


		},

		mounted() {
		
		}
		
	}
</script>

<style lang="scss">
	.friendList {
		padding-left: 20rpx;
	}

	.list-cell {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		position: relative;
		width: 100%;
		padding: 10px 24rpx;
		overflow: hidden;
		color: #323233;
		font-size: 14px;
		line-height: 24px;
		background-color: #fff;

		image {
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
			border-radius: 20rpx;
		}
		.name{
			margin-left: 20rpx;
			font-size: 32rpx;
		}
	}

	.btn {
		position: absolute;
		top: 30rpx;
		right: 80rpx;
	}
</style>
<style lang="scss" scoped>
	.u-border-bottom {
		border-bottom-width: 0 !important;
	}

	// .u-border-bottom{
	// 	margin: 10rpx 0 !important;
	// }
	// .indexListContianer{
	// 	// height: 400rpx;
	// 	overflow: hidden;
	// }
</style>
