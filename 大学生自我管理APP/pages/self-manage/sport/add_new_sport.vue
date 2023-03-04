<template>
	<view>
		<uni-card title="运动项目">
			<textarea :maxlength="20" v-model="item.title" auto-height placeholder="请输入运动项目"></textarea>
		</uni-card>
		<uni-card title="备注">
			<textarea v-model="item.note" auto-height placeholder="请输入备注"></textarea>
		</uni-card>
		<uni-card title="周期">
			<view class="period_box">
				<view class="period_item" :class="{ 'period_item_select': item.period_free }" @click="select_period_free">自由</view>
				<view class="period_item" :class="{ 'period_item_select': item.period }" @click="select_period">定时</view>
			</view>
			<view class="peroid" v-if="item.period">
				（周期设置 几天一次，每天几次
			</view>
		</uni-card>
		<uni-card title="强度">
			<radio-group class="intensity_group">
				<radio>低</radio>
				<radio>中</radio>
				<radio>高</radio>
			</radio-group>
		</uni-card>
		<view class="save_button" >√</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				item: {title:'', period_free:true, period:'', note:'', intensity: '低'},
				
			};
		},
		methods: {
			select_period_free(){
				this.item.period_free=true;
				this.item.period=false;
			},
			select_period(){
				this.item.period_free=false;
				this.item.period=true;
			}
		}
	}
</script>

<style>
	page {
		background-color: #f2fff3
	}
	.period_box{
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
	.period_item{
		font-size: 10px;
	}
	.period_item_select{
		font-size: 20px;
		font-weight: 700;
		color: #a8bda8;
	}
	.intensity_group{
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
	.save_button{
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		right: 10%;
		bottom: 20%;
		margin: 0 auto;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: #d9f5db;
		color: #85a181;
		font-size: 20px;
		font-weight: 900;
		box-shadow: -1px 1px 5px 2px rgba(0, 0, 0, 0.1), -1px 1px 1px 0 rgba(255, 255, 255) inset;
	}
</style>
