<template>
	<view>
		<view class="play_box">播放区</view>
		<view class="music_box">
			<view class="music_item">1</view>
			<view class="music_item">2</view>
			<view class="music_item">3</view>
			<view class="music_item">4</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.play_box{
		height: 250px;
		box-shadow: 0px 1px 5px 1px rgba(0, 0, 0, 0.1), -1px 2px 1px 0 rgba(255, 255, 255) inset;
		border-radius: 0px 0px 10px 10px;
	}
	.music_box{
		display: flex;
		justify-content: flex-start;
		/* align-items: center; */
		margin-top: 10px;
		margin-left: 10px;
		flex-wrap: wrap;
	}
	.music_item{
		width: 30%;
		height: 100px;
		background-color: #ececec;
		margin: 5px;
		border-radius: 10px;
	}
</style>
