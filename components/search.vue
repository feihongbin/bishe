<template>
	<view :class="['searchInput', isSearch ? 'cancel' : '']">
		<uni-icons type="search" color="#b3b3b3" size="24"></uni-icons>
		<input v-if="!isSearch" type="text" value="" placeholder="搜索" @focus="toResult" />
		<input v-if="isSearch" type="text" value="" placeholder="搜索" @input="handleSearch()" v-model="content" />
		<text v-if="isSearch" class="cancelBtn" @click="back">取消</text>
	</view>

</template>

<script>
	export default {
		name: "search",
		data() {
			return {
				content:''
			};
		},
		props: {
			isSearch: {
				type: Boolean,
				default: false
			}

		},
		methods: {
			toResult() {
				uni.navigateTo({
					url: `/pages/home/homeSearch?type=1`
				})

			},
			back() {
				uni.reLaunch({
					url: `/pages/home/home`
				})
			},
			handleSearch() {
				this.$emit('onInput',this.content)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.searchInput {
		display: flex;

		background-color: #fff;
		padding: 10rpx;
		border-radius: 10rpx;
		margin-top: 20rpx;
		position: relative;
	}

	.cancel {
		margin-right: 100rpx;
	}

	.cancelBtn {
		position: absolute;
		right: -80rpx;
		color: #2372fd;
	}
</style>
