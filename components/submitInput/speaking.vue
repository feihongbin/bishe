<template>
	<view class="speak">
		<text class="tip">{{tip}}</text>
		<view :class="['mkf',isTouched ? 'touched' : '']" @touchstart="start" @touchmove="move" @touchend="end">
			<view>

				<u-icon size="60" name="https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/mkf.png"></u-icon>
			</view>
			<view v-if="isTouched"  :class="['delete',isDeleteTouched ? 'deleteTouch' : '']">
				<u-icon size="40"
					:name="!isDeleteTouched ? 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/delete.png' : 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/delete-fill.png'">
				</u-icon>
			</view>
		</view>

	</view>
</template>

<script>
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;
	export default {
		data() {
			return {
				isDeleteTouched: false,
				isTouched: false,
				voicePath: '',
				timer:'',
				voiceTime:0
			}
		},
		computed:{
			tip(){
				if(!this.isDeleteTouched && !this.isTouched){
					return '按住说话'
				}
				if(!this.isDeleteTouched && this.isTouched){
					return this.formatTime(this.voiceTime)
				}
				if(this.isDeleteTouched && this.isTouched){
					return '松手取消发送'
				}
			}
		},
		onLoad() {
			
		},
		methods: {
			formatTime(val){
				if(val < 60){
					return '0:'+val
				}
			},
			start(event) {
				console.log(2)
				this.isTouched = true
				recorderManager.start({
					format:'pcm',
					sampleRate:16000
				});
				this.timer = setInterval(() =>{
					this.voiceTime++
					// if(this.voiceTime >= 60){
						
					// }
				},1000)

			},
			end(event) {
				
				let self = this
				recorderManager.stop();
				clearInterval(this.timer)
				let timeLong = this.voiceTime
				this.voiceTime = 0
				recorderManager.onStop(function(res) {
					if(!self.isDeleteTouched){
						console.log('recorder stop' + JSON.stringify(res.tempFilePath));
						console.log('rtime',timeLong,this.isDeleteTouched);
						uni.$emit('sendFile', {
							file: res.tempFilePath,
							tag: 'application/pcm',
							timeLong:timeLong
						})
					}
					self.isDeleteTouched = false
					self.isTouched = false
					
				});
				
			},
			move(event) {
				console.log(5, event.mp.changedTouches[0].clientX, event.mp.changedTouches[0].clientY)
				if ((event.mp.changedTouches[0].clientX > 270 && event.mp.changedTouches[0].clientX < 340) && (event.mp
						.changedTouches[0].clientY > 570 && event.mp.changedTouches[0].clientY < 640)) {
					this.isDeleteTouched = true
				}else{
					this.isDeleteTouched = false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.speak {
		height: 278px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		.tip {
			margin-bottom: 80rpx;
			color: #cccccc;
		}

		.mkf {
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			width: 190rpx;
			height: 190rpx;
			border-radius: 50%;
			box-shadow: 0 0 20rpx 2rpx rgba(180, 189, 190, .5);
			margin-bottom: 100rpx;

			.delete {
				position: absolute;
				top: 0rpx;
				right: -200rpx;
				background: #f2f3f7;
				width: 140rpx;
				height: 140rpx;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;

			}

			.deleteTouch {
				background: #fff0f3;
				border: 2px #fe5a6b solid;
			}

		}

		.touched {
			background: #f2f3f7;
		}

	}
</style>
