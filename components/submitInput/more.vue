<template>
	<view class="more">
		<view class="moreList">
			<view class="moreItem">
				<u-icon name="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/photo.png" size="42"
					@click="chooseImg('album')"></u-icon><text>图片</text>
			</view>
			<view class="moreItem">
				<u-icon name="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/camera.png" size="42"
					@click="chooseImg('camera')"></u-icon><text>拍摄</text>
			</view>
			<view class="moreItem">
				<u-icon name="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/phone.png" size="42"
					@click="goBack()"></u-icon><text>语音通话</text>
			</view>
			<view class="moreItem">
				<u-icon name="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/vedio.png" size="42"></u-icon>
				<text>视频通话</text>
			</view>
		</view>
		<view class="moreList">
			<view class="moreItem">
				<u-icon name="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/file.png" size="40"
					@click="openFile"></u-icon><text>文件</text>
			</view>
		</view>
	</view>
</template>

<script>
	import Config from "../../utils/config.js";
	var AfDocument = uni.requireNativePlugin("Aq-ChooseFile");
	export default {
		data() {
			return {
				// 输入的频道
				channel: "",
				// 场景选择
				scenarioLits: [{
						value: 0,
						name: '通信场景',
					},
					{
						value: 1,
						name: '直播场景',
					},
				],
				scenario: 0,
				// 直播场景下 角色选择 1 (主播) 2 (游客)
				roleChoices: 1,

				windowWidth: 200,
				windowHeight: 200,
			}
		},
		props:{
			friendId:String
		},
		mounted() {
			let that = this
			uni.getStorage({
				key:'accountId',
				success(res) {
					that.channel = res.data+''
				}
			})
		},
		methods: {
			chooseImg(type) {
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: [type], //从相册选择
					success: function(res) {
						const filePath = res.tempFilePaths
						for (let i = 0; i < filePath.length; i++) {
							uni.$emit('sendFile', {
								file: filePath[i],
								tag: 'image/jpeg'
							})
						}
						console.log(filePath);
					}
				});
			},
			openFile() {
				console.log(1)
				AfDocument.openMode({
					size: '1', //选择总数量
					// paths: ['/storage/emulated/0/Download', '/storage/emulated/0/A', ], //自定义选择目录
					isDown: true, //是否下钻（true 筛选当前目录以下的所有文件，fales 只筛选当前目录文件） 
					types: [{
						name: '文档',
						value: ["doc", "wps", "docx", "xls", "xlsx", "pdf"]
					}, {
				 	name: '视频',
						value: ["mp4"]
					}, {
						name: '音乐',
						value: ['mp3', 'flac']
					}, {
						name: '图片',
						value: ['jpg', 'png']
					}]
				}, (res) => {
					// this.data = JSON.stringify(res);
					uni.$emit('sendFile', {
						file: res.res[0].pathHolp,
						tag: res.res[0].type
					})
					console.log(JSON.stringify(res))
					console.log(res.res[0].pathHolp)
				})
			},

			goBack() {
				
				// 邀请对方
				console.log('2341')
				this.socket.emit('vedioInvite',{account:this.channel,channel:this.channel,friendId:this.friendId,appid:Config.appid,scenario: this.scenario,roleChoices: this.roleChoices,liveUrl: Config.liveUrl})
				
				// 没有填写 appid
				if (!Config.appid) {
					uni.showToast({
						title: '请前往 utils 文件夹的 config.js 文件中配置 appid',
						icon: 'none',
						duration: 3000
					});
					return
				}
				// 没有填写频道
				if (!this.channel) {
					uni.showToast({
						title: '请输入频道',
						icon: 'none',
						duration: 3000
					});
					return
				}
				// 传递数据
				const oInfo = JSON.stringify({
					appid: Config.appid,
					// anyRTC 实现通话的频道
					channel: this.channel + '',
					token: Config.token,
					// 默认 uid 标识或随机生成 uid 标识
					uid: Config.uid ? Config.uid : this.$Utils.randomFn(6),
					scenario: this.scenario, // 通信场景
					roleChoices: this.roleChoices, // 直播场景下 角色选择 1 (主播) 2 (游客)
					// 旁路推流
					liveUrl: Config.liveUrl,
				})
				uni.navigateTo({
					// tag用来标识接收方又没有接收  0没接收  1接收了   2拒绝了
					url: `/pages/index/rtcPage?tag=0&friendId=${this.friendId}&info=${oInfo}`,
					success(res) {
						console.log("成功", res);
					},
					fail(res) {
						console.log("失败", res);
					}
				});

			},
		}
	}
</script>

<style lang="scss" scoped>
	.more {
		height: 278px;
		width: 100%;

		.moreList {
			display: flex;
			justify-content: space-between;
			padding: 0 60rpx;
			margin: 60rpx 0 80rpx;
		}

		// .moreList:nth-child(2){
		// 	display: flex;
		// 	justify-content: flex-start;
		// }
		.moreItem {
			// margin: 0 20rpx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			font-size: 24rpx;

		}

	}
</style>
