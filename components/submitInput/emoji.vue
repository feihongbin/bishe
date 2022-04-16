<template>
	<scroll-view class="emoji" scroll-y="true">
		<view class="emojiList" v-for="(item,index) in emojiList" :key="index" >
			<view class="emojiItem" v-for="(emoji,i) in item" @click="toInput(emoji)">
				{{emoji}}
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default{
		data(){
			return {
				emojiList:[
					['😀','😁','😂','🤣','😃','😄','😅'],
					['😆','😉','😊','😋','😎','😍','😘'],
					['😗','😙','☺️️','🙂','🤗','🤔','😐'],
					['😑','😶','🙄','😏','😣','😥','😮'],
					['🤐','😯','😪','😫','😴','😌','😛'],
					['😜','😝','🤤','😒','😓','😔','😕'],
					['🙃','🤑','😲','😩','🙁','😖','😞'],
					['😟','😤','😢','😭','😦','😧','😨'],
					['😬','😰','😱','😳','😵','😡','😠'],
					['😷','🤒','🤕','🤢','🤧','😇','🤠'],
					['🤡','🤥','🤓','😈','👿','👹','👺'],
					['💀','👻','👽','🤖','💩','😺','😸'],
					['👔','👕','👖','⛑','🌂','👀','👓'],
				]
			}
		},
		methods:{
			toInput(str){
				this.$emit('addEmoji',str)
			}
		}
		
	}
</script>

<style lang="scss">
	.emoji{
		height: 278px;
		width: 100%;
	}
	.emojiList{
		display: flex;
		justify-content: space-around;
		.emojiItem{
			font-size: 24px;
		}
	}
</style>
