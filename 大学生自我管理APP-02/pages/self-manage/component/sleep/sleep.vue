<template>
	<view class="box">
		<view class="manage_box">	<!--睡眠目标&打卡-->
			<view class="goalTime_box" >	<!--目标设置-->
				<view class="goalTime_item">
					<picker mode="time" :value="getup_goal" start="00:00" end="23:59" @change="bindTimeChange_g">
						<view >{{getup_goal}}</view>
					</picker>
					<view>起床目标</view>
				</view>
				<view class="goalTime_item">
					<picker mode="time" :value="sleep_goal" start="00:00" end="23:59" @change="bindTimeChange_s">
						<view >{{sleep_goal}}</view>
					</picker>
					<view>就寝目标</view>
				</view>
			</view>
			<view class="clock_box">	<!--打卡-->
				<view >
					<image v-if="DayTimeJudge" class="img" src="../../static/sun.png" mode="heightFix"></image>
					<image v-if="!DayTimeJudge" class="img" src="../../static/moon.png" mode="heightFix"></image>
				</view>
				<view class="clock_button">打卡</view> <!--早于目标时间则点赞-->
			</view>
		</view>
		<uni-list class="assitant_box" :border="false">	<!--睡眠助手-->
			<uni-collapse class="assitant_item" style="width: 95%;">
				<uni-collapse-item  title="助眠音乐">
					<uni-list style="margin-left: 20px;">
						<uni-list-item title="白噪音" showArrow clickable @click="goto_baizaoyin"></uni-list-item>
						<uni-list-item title="钢琴曲" showArrow clickable @click="goto_piano"></uni-list-item>
						<uni-list-item title="睡前故事" showArrow clickable @click="goto_shuiqianstory"></uni-list-item>
						<uni-list-item title="其他" showArrow clickable @click="goto_other_music"></uni-list-item>
					</uni-list>
				</uni-collapse-item>
			</uni-collapse>
			<uni-list-item class="assitant_item" title="睡眠小tips" showArrow clickable @click="goto_tips"></uni-list-item>
			<uni-list-item class="assitant_item" title="睡眠报告" showArrow clickable @click="goto_analyse"></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	export default {
		name:"sleep",
		data() {
			return {
				getup_goal:'07:00',
				sleep_goal:'23:00',
				nowtime: [{hour:''}, {minute:''}, {seconds:''}],
				getup_time:'',
				sleep_time:'',
			};
		},
		computed:{
			DayTimeJudge(){//判断白天晚上
				this.getNowTime();
				if(this.nowtime.hour<18 && this.nowtime.hour>=6){
					return true;
				};
				return false;
			}
		},
		methods:{
			getNowTime(){ //获取当前时间
				var time=new Date();
				let h=time.getHours();
				let m=time.getMinutes();
				let s=time.getSeconds();
				console.log(h,m,s);
				this.nowtime.hour=h;
				this.nowtime.minute=m;
				this.nowtime.seconds=s;
			},
			bindTimeChange_g: function(e) {
				this.getup_goal = e.detail.value
			},
			bindTimeChange_s: function(e) {
				this.sleep_goal = e.detail.value
			},
			goto_baizaoyin(){
				uni.navigateTo({
					url:'/pages/self-manage/sleep/baizaoyin/baizaoyin'
				})
			},
			goto_piano(){
				uni.navigateTo({
					url:'/pages/self-manage/sleep/piano/piano'
				})
			},
			goto_shuiqianstory(){
				uni.navigateTo({
					url:'/pages/self-manage/sleep/shuiqianstory/shuiqianstory'
				})
			},
			goto_other_music(){
				uni.navigateTo({
					url:'/pages/self-manage/sleep/other_music/other_music'
				})
			},
			goto_tips(){
				uni.navigateTo({
					url:'/pages/self-manage/sleep/sleep_tips/sleep_tips'
				})
			},
			goto_analyse(){
				uni.navigateTo({
					url:'/pages/self-manage/sleep/sleep_analyse/sleep_analyse'
				})
			}
		}
	}
</script>

<style>
	.box{
		justify-content: center;
	}
	.manage_box{
		width: 90%;
		margin: 15px;
		height: 350px;
		border-radius: 10px;
		background: white;
		box-shadow: -1px 1px 5px 1px rgba(0, 0, 0, 0.1), -1px 2px 1px 0 rgba(255, 255, 255) inset;
		
	}
	.goalTime_box{
		box-shadow: -1px 1px 5px 1px rgba(0, 0, 0, 0.1), -1px 2px 1px 0 rgba(255, 255, 255) inset;
		border-radius: 10px;
		height: 80px;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		background: #f1fdf2;
	}
	.goalTime_item{
		font-size: 25px;
		text-align: center;
	}
	.picker-view {
		width: 750rpx;
		height: 600rpx;
		margin-top: 20rpx;
		z-index: 99;
		position: relative;
	}
	.item {
		line-height: 100rpx;
		text-align: center;
	}
	.picker-box {
		height: 30rpx;
	}
	.clock_box{
		height: 270px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 5px;
	}
	.img{
		height:190px;
		align-items: center;
		justify-content: center;
	}
	.clock_button{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 150px;
		height: 50px;
		font-size: 23px;
		box-shadow: -1px 1px 5px 1px rgba(0, 0, 0, 0.1), -1px 2px 1px 0 rgba(255, 255, 255) inset;
		border-radius: 10px;
		margin: 3px;
		background: #f1fdf2;
	}
	.assitant_box{
		width: 90%;
		margin: 15px;
		border-radius: 10px;
		background:  #f1fdf2;
		box-shadow: -1px 1px 5px 1px rgba(0, 0, 0, 0.1), -1px 2px 1px 0 rgba(255, 255, 255) inset;
		
	}
	.assitant_item{
		background: white;
 		box-shadow: -1px 1px 5px 1px rgba(0, 0, 0, 0.1), -1px 2px 1px 0 rgba(255, 255, 255) inset;
		margin: 8px;
	} 
</style>