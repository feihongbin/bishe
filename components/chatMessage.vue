<template>
	<view>
		<view v-for="(item,index) in messageList" :id="'msg'+ item.mid">
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
				<image class="contentImage" v-if="item.tag === 'image' || item.tag === 'image/jpeg'" :src="item.content"
					:fade-show="true" mode="widthFix" @click="previewImg(item)"></image>
				<!-- <u-tooltip src="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/avatar/1.jpeg" text="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/avatar/1.jpeg" direction="bottom"></u-tooltip> -->
				<view class="otherFiles" v-if="!['text','image','image/jpeg','image/jepg'].includes(item.tag)"
					@click="checkFile(item)">
					<view class="fileName">
						<text>名字哈哈哈哈.doc</text>
						<text>2.33MB/已发送</text>
						<u-line-progress v-if="progress !== 0" :percentage="progress" :showText="false" height="2"></u-line-progress>
					</view>
					<!-- <view class="fileSize">
						
					</view> -->
					<u-icon size="50" :name="fileType(item.tag)"></u-icon>
				</view>
				<!-- <text v-if="item.type === 'myself'" :class="{'isRead':true,'hasRead':true}">{{true ? '未读' : '已读'}}</text> -->
			</view>
		</view>

	</view>
</template>

<script>
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
				progress:0,
				totalBytesExpectedToWrite:''
				
			};
		},
		computed: {

		},
		methods: {
			longpress() {
				console.log('long press')
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
			checkFile(item){
				
			},
			checkFile(item){
				console.log('开始下载')
				const downloadTask = uni.downloadFile({
					url: item.content, //仅为示例，并非真实的资源
					success: (res) => {
						if (res.statusCode === 200) {
							console.log('下载成功');
							uni.downloadFile({
							  url: item.content,
							  success: function (res) {
							    var filePath = res.tempFilePath;
							    uni.openDocument({
							      filePath: filePath,
							      showMenu: true,
							      success: function (res) {
							        console.log('打开文档成功',filePath);
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
			}
		}

	}
</script>

<style lang="scss">
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
</style>
