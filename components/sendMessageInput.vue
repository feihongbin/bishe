<template>
	<view class="messageInput" :style="isSending ? 'bottom:278px' : 'bottom:0'">
		<!-- <view class="messageInput" :style="`bottom:${bottom}px`"> -->
		<view class="submitIcon">
			<u-icon :name="voiceUrl" size="30" @click="changeInput('speaking')"></u-icon>
		</view>

		<textarea auto-height="true" cursor-spacing="30" class="contentInput" value="" @focus="focusInput" />
		<view class="submitIcon">
			<u-icon :name="smileUrl" size="30" @click="changeInput('emoji')"></u-icon>
		</view>
		<view class="submitIcon">
			<u-icon :name="plusUrl" size="30" :color="!isPlus ? '#000' : '#1a74fa'" @click="changeInput('plus')">
			</u-icon>
		</view>
		<emoji v-if="isEmoji" class="emojiBox" ref="emojiBox"></emoji>
		<speak v-if="isSpeaking" class="speakBox"></speak>
		<more v-if="isPlus" class="moreBox"></more>
	</view>
</template>

<script>
	import Emoji from './submitInput/emoji.vue'
	import Speak from './submitInput/speaking.vue'
	import More from './submitInput/more.vue'
	export default {
		name: "sendMessageInput",
		data() {
			return {
				isSpeaking: false,
				isEmoji: false,
				isPlus: false,
				isSending: false,

			};
		},
		components: {
			Emoji,
			Speak,
			More
		},
		computed: {
			voiceUrl() {
				return this.isSpeaking ? 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/voice-fill_1.png' :
					'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/voice.png'
			},
			smileUrl() {
				return this.isEmoji ? 'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/smile-fill_1.png' :
					'https://fhin-1308131188.cos.ap-nanjing.myqcloud.com/svg/smile.png'
			},
			plusUrl() {
				return this.isPlus ? 'plus-circle-fill' : 'plus-circle'
			}
		},
		methods: {
			changeInput(val) {
				uni.hideKeyboard()
				this.$emit('showBlank', true)
				// uni.onKeyboardHeightChange(res => {
				
				// 	if (val === "emoji") {
				// 		this.isPlus = false
				// 		this.isSpeaking = false
				// 		console.log('emoji ', this.isEmoji)
				// 		if (this.isEmoji === true) {
				// 			console.log(11111)
				// 			this.isEmoji = false
				// 			this.isSending = false
				// 			this.$emit('showBlank', false)
				// 		} else {
				// 			console.log(2323)
				// 			this.isEmoji = true
				// 			this.isSending = true
				// 		}
				
				// 	} else if (val === 'plus') {
				// 		this.isEmoji = false
				// 		this.isSpeaking = false
				// 		this.isPlus = true
				// 	} else if (val === 'speaking') {
				// 		this.isEmoji = false
				// 		this.isPlus = false
				// 		this.isSpeaking = true
				// 	}
				// 	return
				// })
				
				
				if (val === "emoji") {
					this.isPlus = false
					this.isSpeaking = false
					if (this.isEmoji === true) {
						console.log(11111)
						this.isEmoji = false
						this.isSending = false
						this.$emit('showBlank', false)
					} else {
						console.log(2323)
						this.isEmoji = true
						this.isSending = true
					}

				} else if (val === 'plus') {
					this.isEmoji = false
					this.isSpeaking = false
					if (this.isPlus === true) {
						this.isPlus = false
						this.isSending = false
						this.$emit('showBlank', false)
					} else {
						this.isPlus = true
						this.isSending = true
					}
				} else if (val === 'speaking') {
					this.isEmoji = false
					this.isPlus = false
					if (this.isSpeaking === true) {
						this.isSpeaking = false
						this.isSending = false
						this.$emit('showBlank', false)
					} else {
						console.log(2323)
						this.isSpeaking = true
						this.isSending = true
					}
				}
				

			},
			focusInput() {
				this.isSending = false
				this.$emit('showBlank', false)
				this.isPlus = false
				this.isSpeaking = false
				this.isEmoji = false
				console.log(123)

			}

		},
		// onLoad() {
		// 	uni.onKeyboardHeightChange(res => {})
		// }

	}
</script>

<style lang="scss">
	.messageInput {
		position: fixed;
		bottom: 0rpx;
		z-index: 999;
		background: #fff;
		display: flex;
		width: 100vw;
		justify-content: space-between;
		padding: 10rpx 0rpx 20rpx;
		align-items: flex-end;

		.contentInput {
			box-sizing: border-box;
			background-color: #f8f8f8;
			margin: 10rpx 10rpx;
			padding: 15rpx;
			border-radius: 20rpx;
			caret-color: #1e6eff;
			max-height: 200rpx;
			overflow-y: scroll;
		}

		.submitIcon {
			padding-bottom: 10rpx;
			margin: 0 10rpx;
		}
	}

	.emojiBox,.speakBox,.moreBox {
		position: absolute;
		bottom: -278px;
		z-index: 888;
		background: #fff;
	}
</style>
