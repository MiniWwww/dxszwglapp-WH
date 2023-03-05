<template>
	<view class="box">
		<view class="todo_box">
			<view class="todo_item" v-for="(item,index) in list" :key="item.title"> 	<!--可计时,计时结束时完成一次该运动-->
				<view class="todo_checkbox">
					<view v-if="item.times" style="color: #8c8c8c;;">{{item.times}}</view>
				</view>
				<view class="todo_title"> {{item.title}}</view>
			</view>
			
		</view>
		<view class="select_pop">
			<view class="select_box" v-if="activePopUp">
				<view class="select_item_1" @click="to_add">添加</view>
				<view class="select_item_2" @click="to_analyse">统计</view>
			</view>
			<view class="button" @click="popUp"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"sport",
		data() {
			return {
				activePopUp: false,
				list:[{title: '跳绳', times:'2', finish: false, },{title: '跑步',times:'', finish: false}],
			};
		},
		methods:{
			popUp(){
				if(this.activePopUp){
					this.activePopUp=false;
				}
				else{
					this.activePopUp=true;
				}
			},
			to_add(){
				uni.navigateTo({
					url:'/pages/self-manage/sport/add_new_sport'
				})
				this.activePopUp=false;
			},
			to_analyse(){
				uni.navigateTo({
					url:'/pages/self-manage/sport/sport_analyse'
				})
				this.activePopUp=false;
			}
		}
	}
</script>

<style>
	.box{
		
	}
	.todo_box{
		
	}
	.todo_item{
		position: relative;
		display: flex;
		/*align-items: center;*/
		padding: 15px;
		margin: 15px;
		color: #085432;
		font-size: 14px;
		border-radius: 10px;
		background: #e3fde4;
		box-shadow: -1px 1px 5px 1px rgba(0, 0, 0, 0.1), -1px 2px 1px 0 rgba(255, 255, 255) inset;
		/*justify-content: space-between;*/
	}
	.todo_checkbox{
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #ffffff;
		box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
		margin-right: 10px;
		display: flex;
		justify-content: center;
	}
	.select_pop{
		display: flex;
		align-items: center;
		width: 45%;
		height: 40%;
		position: fixed;
		bottom: 0;
		right: 30px;
	}
	.select_box{
		width: 70%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}
	.select_item_1{
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: #d9f5db;
		box-shadow: -1px 1px 5px 2px rgba(0, 0, 0, 0.1), -1px 1px 1px 0 rgba(255, 255, 255) inset;
		
		
	}
	.select_item_2{
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: #d9f5db;
		box-shadow: -1px 1px 5px 2px rgba(0, 0, 0, 0.1), -1px 1px 1px 0 rgba(255, 255, 255) inset;
		
	}
	.button{
		position: absolute;
		right: 10%;
		margin: 0 auto;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: #d9f5db;
		box-shadow: -1px 1px 5px 2px rgba(0, 0, 0, 0.1), -1px 1px 1px 0 rgba(255, 255, 255) inset;
	}
</style>