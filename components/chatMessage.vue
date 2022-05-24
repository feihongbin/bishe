<template>
	<view >
		<view class="container" v-for="(item,index) in messageList" :id="'msg'+ item.mid">
			<view v-if="item.type === 'time'" class="chatTime">
				<!-- {{item.content}} -->
				<uni-dateformat v-if="new Date().getDate() !== new Date(item.content).getDate()" :date="item.content"
					:threshold="[0,0]" format="MM/dd hh:mm"></uni-dateformat>
				<uni-dateformat v-else :date="item.content" :threshold="[0,0]" format="hh:mm"></uni-dateformat>
			</view>

			<view v-else :class="['chatText',item.type === 'myself' ? 'myselfChatContent' : '']">
				<image class="avatar" :src=" item.type === 'myself' ? selfAvatar : avatar" mode=""></image>
				<text selectable="true" v-if="item.tag === 'text'"
					:class="['content',item.type === 'myself' ? 'myContent' : '']">{{item.content}}</text>
				<!-- <u-tooltip :text='<text :class="['content',item.type === 'myself' ? 'myContent' : '']'>{{item.content}}</text>"></u-tooltip> -->
				<!-- <u-tooltip :text="item.content">{{item.content}}</u-tooltip> -->
				<image class="contentImage" v-if="item.tag === 'image' || item.tag === 'image/jpeg' || item.tag === 'image/png'"  :src="item.content"
					:fade-show="true" mode="widthFix" @click="previewImg(item)"></image>
				<!-- <u-tooltip src="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/avatar/1.jpeg" text="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/avatar/1.jpeg" direction="bottom"></u-tooltip> -->
				<view class="otherFiles"
					v-if="!['text','image','image/jpeg','image/png','application/pcm'].includes(item.tag)"
					@click="checkFile(item)">
					<view class="fileName">
						<text>{{item.content.split('/').pop()}}</text>
						<text>2.33MB/已发送</text>
						<u-line-progress v-if="progress !== 0" :percentage="progress" :showText="false" height="2">
						</u-line-progress>
					</view>
					<!-- <view class="fileSize">
						
					</view> -->
					<u-icon size="50" :name="fileType(item.tag)"></u-icon>
				</view>
				<view class="voiceContainer">
					<view @longpress="longpress($event,item)" @click="playVoice(item)" class="voice"
						v-if="item.tag === 'application/pcm' && item.type === 'myself' && item.timeLong > 0"
						:style="{width:item.timeLong * 6+'px'}">
						
							{{item.timeLong+'″'}}
							<u-icon size="20" name="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/speech.png">
							</u-icon>
							
							
						
						<!-- <view class="translate" @click="translate(item)">
							转
						</view> -->
					
					</view>
					<!-- <view v-if="item.tag === 'application/pcm' && item.type === 'myself' && item.timeLong > 0" class="translateContent">
						阿大师级的喀什爱神的箭安静的垃圾了收结案的 与他人与他人甜言软语关闭后记得把会计师的避开就边框间山东矿机阿山东矿机啊啥的
					</view> -->
				</view>
				<view @longpress="longpress($event,item)" @click="playVoice(item)" class="voice"
					v-if="item.tag === 'application/pcm' && item.type !== 'myself' && item.timeLong > 0"
					:style="{width:item.timeLong * 6+'px'}">
					<u-icon size="20" name="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/speech-left.png">
					</u-icon>
					{{item.timeLong+'″'}}

	<!-- 				<view class="translate" >
						转
					</view> -->
				</view>
				<!-- https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/speech.png -->
				<!-- <text v-if="item.type === 'myself'" :class="{'isRead':true,'hasRead':true}">{{true ? '未读' : '已读'}}</text> -->

			</view>
			<!-- <view v-if="currentVoice === item.mid" class="tooltip" :style="{top:tooltipy+'px',left:tooltipx+'px'}">
				转文本
			</view> -->
		</view>

	</view>
</template>

<script>
	const innerAudioContext = uni.createInnerAudioContext();

	innerAudioContext.autoplay = true;
	export default {
		name: "chatMessage",
		props: {
			messageList: {
				type: Array,
				default () {
					return [];
				}
			},
			avatar: String,
			selfAvatar: String
		},
		data() {
			return {
				progress: 0,
				totalBytesExpectedToWrite: '',
				tooltipy: 0,
				tooltipx: 0,
				currentVoice:''
			};
		},
		computed: {

		},
		methods: {
			longpress(event,item) {
				// console.log('231',[...arguments])
				console.log(3213,event,item)
				// console.log(event.mp.changedTouches[0].clientX, event.mp.changedTouches[0].clientY)
				this.tooltipx = event.mp.changedTouches[0].clientX
				this.tooltipy = event.mp.changedTouches[0].clientY
				this.currentVoice = item.mid
				console.log(this.currentVoice === item.mid)
				console.log(this.tooltipx,this.tooltipy)
			},
			translate(item){
				let arr = item.content.split('/')
				console.log(arr[arr.length-1])
				uni.request({
					url: this.$baseUrl + '/voice/recognize',
					method: 'post',
					data: {
						filename:arr[arr.length-1]
					},
					success: (data) => {
						// that.userInfo = data.data.info
						console.log(data)
					}
				})
			},
			previewImg(item) {

				uni.previewImage({
					urls: [item.content]
				})
			},
			fileType(val) {
				if (val === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || val ===
					'application/msword') return 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/docx.png'
				else if (val === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || val ===
					'application/vnd.ms-excel') return 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/xlsx.png'
				else if (val === 'application/vnd.ms-powerpoint' || val ===
					'application/vnd.openxmlformats-officedocument.presentationml.presentation')
					return 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/ppt.png'
				else if (val === 'application/pdf')
					return 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/pdf.png'
			},
			checkFile(item) {

			},
			checkFile(item) {
				console.log('开始下载')
				const downloadTask = uni.downloadFile({
					url: item.content, //仅为示例，并非真实的资源
					success: (res) => {
						if (res.statusCode === 200) {
							console.log('下载成功');
							uni.downloadFile({
								url: item.content,
								success: function(res) {
									var filePath = res.tempFilePath;
									uni.openDocument({
										filePath: filePath,
										showMenu: true,
										success: function(res) {
											console.log('打开文档成功', filePath);
										}
									});
								}
							});
						}
					}
				});

				downloadTask.onProgressUpdate((res) => {
					console.log('下载进度' + res.progress);
					console.log('已经下载的数据长度' + res.totalBytesWritten);
					console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);

					// 满足测试条件，取消下载任务。
					// if (res.progress > 50) {
					// 	downloadTask.abort();
					// }
				});
			},
			playVoice(item) {
				console.log(item)
				if (item.content) {
					innerAudioContext.src = item.content;
					innerAudioContext.play();
				}
			}
		}

	}
</script>

<style lang="scss" scoped>
	.container {
		position: relative;
	}

	.myselfChatContent {
		justify-content: flex-end;

		.avatar {
			order: 2
		}

		.content {
			order: 1;
			background: #1e6eff;
		}

	}

	.chatTime {
		text-align: center;
		font-size: 24rpx;
		color: #666;
	}

	.chatText {
		display: flex;
		align-items: flex-start;
		margin: 50rpx 0;
		position: relative;

		.avatar {
			width: 80rpx;
			height: 80rpx;
			padding: 0 20rpx 0 30rpx;
		}

		.content {
			background: #fff;
			padding: 15rpx;
			border-radius: 10rpx;
			max-width: 60vw;
		}

		.contentImage {
			max-width: 200rpx;
			border-radius: 20rpx;
		}

		.isRead {
			position: absolute;
			right: 130rpx;
			bottom: -36rpx;
			color: #ccc;
		}

		.hasRead {
			color: #58aff1;
		}
	}

	.myContent {
		background: #1e6eff !important;
		color: #fff;
	}

	.otherFiles {
		height: 120rpx;
		width: calc(60vw - 40rpx);
		background: #fff;
		border-radius: 10rpx;
		padding: 20rpx 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.fileName {
			display: flex;
			flex-direction: column;

			text:nth-child(1) {
				font-size: 36rpx;
			}

			text:nth-child(2) {
				font-size: 24rpx;
				color: #888b9a;
			}
		}
	}

	.voiceContainer{
		display: flex;
		flex-direction: column;
		// justify-content: flex-start;
		align-items: flex-end;
		background: #fff;
	}

	.voice {
		min-width: 70rpx;
		max-width: 56vw;
		height: 40rpx;
		padding: 16rpx 16rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 10rpx;
		position: relative;
	}
	.translate{
		position: absolute;
		top: 14rpx;
		left:-60rpx;
		z-index:999;
	}

	// .tooltip {
	// 	position: absolute;
	// 	border-radius: 10rpx;
	// 	padding: 20rpx;
	// 	z-index: 999;
	// 	background: rgb(34, 34, 34);
	// 	color: #fff;
	// 	display: flex;
	// 	align-items: center;
	// 	justify-content: center;
	// }

	// .tooltip::after {
	// 	position: absolute;
	// 	top: 78rpx;
	// 	left: 50rpx;
	// 	content: '';
	// 	width: 0rpx;
	// 	height: 0rpx;
	// 	border: 10px solid #000;
	// 	border-top-color: rgb(34, 34, 34);
	// 	border-bottom-color: transparent;
	// 	border-left-color: transparent;
	// 	border-right-color: transparent;
	// }
	.translateContent{
		margin-top: 20rpx;
		max-width: 56vw;
		padding: 10rpx;
		border-top: 1px solid #dcdfe6;
	}
</style>
