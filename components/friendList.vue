<template>
	<view class="indexListContianer">
		<u-index-list :index-list="indexList" class="friendList" :sticky="false">
			<template v-for="(item, index) in itemArr">
				<u-index-item>
					<u-index-anchor bgColor="#fff" :text="indexList[index]"></u-index-anchor>
					<view class="list-cell" v-for="(cell, i) in item" @click="toDetail(cell.id)">
						<image :src="cell.avatar" mode=""></image>
						<text>{{cell.name}}</text>
					</view>
				</u-index-item>
			</template>
		</u-index-list>
	</view>
</template>

<script>
	export default {
		name: "friendList",
		data() {
			return {
				friendList:[],
				indexList:[],
				itemArr:[]
			};
		},
		props:{
			list:Array
		},
		methods: {
			filterFriendList(arr) {
				return arr.map((item, index) => {
					return item.note === '' ? {name:item.name,avatar:item.avatar,id:item.friendId} :  {name:item.note,avatar:item.avatar,id:item.friendId}
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
						}) < 0) {
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
			toDetail(id){
				uni.navigateTo({
					url:`/pages/contacts/addFriend/searchResult?id=${id}&isFriend=${true}`
				})
			}
		

		},
	
		mounted() {
			// console.log(this.indexList, this.itemArr)
			// this.names = fixTheSearchTeachers(filterFriendList(this.friendList))
			// console.log(this.names)
			this.friendList = this.fixTheSearchTeachers(this.filterFriendList(this.list))
			this.indexList = this.friendList.map((item,index)=>item[0])
			this.itemArr = this.friendList.map((item,index) => item.slice(1))
			console.log(this.list)
			// console.log('f',this.friendList)
			// console.log('asd',this.indexList)
			console.log('asd1',this.itemArr)
			// console.log('asd2',this.fillItem(this.itemArr))
			
			
		},
		
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
