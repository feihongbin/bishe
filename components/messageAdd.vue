<template>
	<view class="messageAdd">
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				indexList: ["A", "B", "C"],
				itemArr: [
					['列表A1', '列表A2', '列表A3'],
					['列表B1', '列表B2', '列表B3'],
					['列表C1', '列表C2', '列表C3']
				]
			};
		}
	}
</script>

<style lang="scss">
	.addContainer {
		width: 100vw;
		height: 100vh;
		position: relative;
	}
</style>
