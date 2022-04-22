<template>
	<view class="content" :style="{width: windowWidth + 'px',height: windowHeight + 'px'}">
		
		<!-- 本地视频渲染 -->
		<view :class="" style="position: relative;">
			<view style="flex: 1;">
				<AR-CanvasView ref="location" style="flex: 1;" />
			</view> 
			<!-- 关闭视频后显示 -->
			<view class="location-none"
				:style="{left: true ? '-800px' : '0px',backgroundColor:  true ? '':'#0A1621',opacity: true ? '0':'1'}">
				<image style="width: 60px;height: 80px;" src="../../static/icon_launch_logo.png" mode=""></image>
			</view>
			<view class="user-hint">
				<text class="hint-text">{{info.uid}}</text>
			</view>
		</view>
		
		
		<view v-for="peerid in peeridInfo" :key="peerid.uid" :class="">
			<view style="flex: 1;">
				<AR-CanvasView :ref="'remote'+peerid.uid" style="flex: 1;" />
			</view>
			<!-- 远端关闭视频后显示 -->
			<view class="location-none"
				:style="{left: peerid.videoStatus ? '-800px' : '0px',backgroundColor:  peerid.videoStatus ? '':'#0A1621',opacity: peerid.videoStatus ? '0':'1'}">
				<image style="width: 60px;height: 80px;" src="../../static/icon_launch_logo.png" mode=""></image>
			</view>
			<view class="user-hint">
				<text class="hint-text">{{peerid.uid}}</text>
			</view>
		</view>
		
		<view :style="{flexDirection: 'row',justifyContent: true ? 'space-between':'center'}">
			<!-- 音频开关(非游客显示)-->
			<view class="icon" @click="audioFn" >
				<image class="icon_img" src="../../static/au_in.png"></image>
				<!-- <image class="icon_img" src="../../static/au_on.png"></image> -->
				<text class="icon_text">静音</text>
			</view>
			<!-- 挂断 -->
			<view class="icon" @click="closeFn">
				<image class="icon_img" src="../../static/over.png"></image>
				<text class="icon_text">挂断</text>
			</view>
			<!-- 扬声器开关(非游客显示) -->
			<view class="icon" @click="speakerphoneFn" >
				<image class="icon_img" src="../../static/icon_speakers.png"></image>
				<!-- <image class="icon_img" src="../../static/icon_speaker.png" ></image> -->
				<text class="icon_text">扬声器</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	import Utils from "../../utils/until.js";
	import RTC from "../../utils/rtc.js";
	export default {
		data(){
			return {
				windowWidth: 400,
				windowHeight: 800,
				// RTC 所需信息
				info: {},
				// 生成远端视频容器
				peeridInfo: [],
			}
		},
		
		
		async created() {
			const oInfo = await Utils.getWidthHeight();
			this.windowWidth = oInfo.windowWidth;
			this.windowHeight = oInfo.windowHeight;
			// 监测远端用户加入(创建容器)
			uni.$on("peeridJoinChannel", data => {
				if (data) {
					const oa = this.peeridInfo.filter((item) => {
						return item.uid == data
					})
					if (oa.length == 0) {
						this.peeridInfo.push({
							uid: data,
							videoStatus: true,
						});
						this.$nextTick(() => {
							uni.$emit("CanvasView", {
								remote: this.$refs['remote' + data],
								peerid: data,
							})
						})
					}
				}
			});
			// 监测远端用户离开(删除容器)
			uni.$on("UserOffline", data => {
				console.log("监测远端用户离开", data);
				if (data) {
					this.peeridInfo.splice(this.peeridInfo.findIndex(item => item.uid === data.uid), 1);
					
				}
			});
			// 监测远端用户视频状态
			uni.$on("VideoStateChanged", data => {
				if (data) {
					this.peeridInfo.map(item => {
						if (item.uid == data.uid) {
							// 远端用户关闭视频
							if (data.reason == 5 && data.state == 0) {
								item.videoStatus = false;
								// 远端用户开启视频
							} else if (data.state == 2 && data.reason == 0) {
								item.videoStatus = true;
							}
						}
					})
				}
			})
		},
		onLoad(options) {
			if (options.info) {
				uni.showLoading({
					title: '加载中,请稍后'
				});
				const oInfo = JSON.parse(options.info);
				this.info = Object.assign(this.info, oInfo);
				// 初始化
				this.init();
			}
		},
		mounted() {
			if (this.info.roleChoices != 2) {
				// 传入本地视频容器
				uni.$emit("CanvasView", {
					location: this.$refs.location
				});
			}
		},
		beforeDestroy() {
			// 移除App级别的所有事件监听器
			uni.$off();
		},
		
		methods: {
			// 挂断
			async closeFn() {
				// 销毁实例
				await RTC.destroyRtc();
				// 返回首页
				uni.redirectTo({
					url: 'index'
				});
			},
			// 视频开关
			videoFn() {
				this.video = !this.video;
				RTC.enableLocalVideo(this.video);
			},
			// 摄像头前后
			cameraFn() {
				this.camera = !this.camera;
				RTC.switchCamera();
			},
			// 音频开关
			audioFn() {
				this.audio = !this.audio;
				RTC.enableLocalAudio(this.audio);
			},
			// 免提
			speakerphoneFn() {
				this.Speakerphone = !this.Speakerphone;
				RTC.setEnableSpeakerphone(this.Speakerphone);
			},
			
			async init() {
				// 初始化 RTC 实例
				await RTC.init(this.info);
				
				// 启用视频模块
				await RTC.enableVideo();
			
				// 加入频道
				await RTC.joinChannel();
				uni.hideLoading();
				
			},
			// 禁止穿透
			penetrateFn(e) {
				e.stopPropagation()
			},
		}
	}
</script>

<style scoped>
	
	
	.icon {
		/* background-color: #007AFF; */
		justify-content: center;
		align-items: center;
	}
	
	.icon_img {
		width: 60px;
		height: 60px;
	}
	
	.icon_text {
		color: #FFFFFF;
		margin: 10px;
	}
</style>
