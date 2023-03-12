<template>
	<!--预计有什么功能：记录（图文）的发送和删除√，消息的发送时间√，数据的云端存取，数据的本地存取（？），
	用户给自己消息点赞√，系统发送每日总结，系统发出待办和自我管理计划的提醒，生日提醒-->
	<!--需要从云端读取相关数据，还需要比对时间……-->
	<view class="content">
		
		<!--消息内容区-->
		<scroll-view class="chat" scroll-y="true" scroll-with-animation="true" scroll-into-view="scrollToView">
			<view class="chat-main" :style="{paddingBottom:inputh+'px'}">
				<view class="chat-ls" v-for="(item,index) in unshiftmsg" :key="index" :id="'msg'+ index">
					<!--将一条消息的发送时间数据传到函数chatTime进行处理，然后显示-->
					<view class="chat-time" v-if=" item.createTime != ''"> {{chatTime(item.createTime)}} </view>
					
					<!--系统消息-->
					<view class="msg-m msg-left" v-if="item.sendName == '系统'" >
						<image class="user-img" src="../../static/system-head.png"  @click="bindClick(index)"></image>
						<!-- 文字 -->
						<view class="message" v-if="item.TextType == 0">
							<view class="msg-text">{{item.sendText}}</view>
						</view>
						<!-- 图像 -->
						<view class="message" v-if="item.TextType == 1" @tap="previewImg(item.sendText)">
							<image :src="item.sendText" class="msg-img" mode="widthFix"></image>
						</view>
					</view>
					
					<!--用户消息-->
					<view class="msg-m msg-right" v-if="item.sendName != '系统'">
						<image class="user-img" src="../../static/user-head.png" @click="bindClick(index)"></image>
						<!-- 文字 -->
						<view class="message" v-if="item.TextType == 0">
							<view class="msg-text">{{item.sendText}}</view>
						</view>
						<!-- 图像 -->
						<view class="message" v-if="item.TextType == 1" @tap="previewImg(item.sendText)">
							<image :src="item.sendText" class="msg-img" mode="widthFix"></image>
						</view>
						<!--点赞小心心图标-->
						<view class="like-heart" @tap="like(item)">
							<image v-if="item.isLike == 0" src="../../static/like-heart-white.png" style="max-width: 100rpx;" mode="widthFix"></image>
							<image v-if="item.isLike == 1" src="../../static/like-heart-red.png" style="max-width: 100rpx;" mode="widthFix"></image>
						</view>
						
					</view>
				</view>
			</view>
		</scroll-view>
		
		
		
		<!-- 输入栏 -->
		<submit @inputs="inputs"></submit>
		
		
		
	</view>
</template>

<script>
	
	import dateTime from './dateTime.js'  //引用js文件
	import submit from './component/submit/submit.vue'    //引用组件submit
	
	export default {
		data() {
			return {
				scrollToView:'',//定位消息界面所滚动到的元素是哪个
				sendName:'',
				receviceName:'',
				sendText:'',
				createTime:'',
				TextType:'',
				isLike:'',
				
				msg:[
					{
						"sendName": "我",
						"receviceName": "系统",
						"sendText": "测试5",
						"createTime": "2023-01-06 12:40:05",
						"TextType": 0,
						"isLike":0,
					},
					{
						"sendName": "我",
						"receviceName": "系统",
						"sendText": "测试4",
						"createTime": "2023-01-06 12:40:00",
						"TextType": 0,
						"isLike":0,
					},
					{
						"sendName": "我",
						"receviceName": "系统",
						"sendText": "测试3",
						"createTime": "2023-01-05 15:20:00",
						"TextType": 0,
						"isLike":0,
					},
					{
						"sendName": "我",
						"receviceName": "系统",
						"sendText": "测试2",
						"createTime": "2023-01-05 12:40:00",
						"TextType": 0,
						"isLike":0,
					},
					{
						"sendName": "我",
						"receviceName": "系统",
						"sendText": "测试1",
						"createTime": "2023-01-02 12:40:00",
						"TextType": 0,
						"isLike":0,
					},
					{
						"sendName": "系统",
						"receviceName": "我",
						"sendText": "发消息试试吧",
						"createTime": "2023-01-01 12:50:00",
						"TextType": 0,
						"isLike":0,
					},
					{
						"sendName": "我",
						"receviceName": "系统",
						"sendText": "啦啦啦",
						"createTime": "2023-01-01 12:45:20",
						"TextType": 0,
						"isLike":0,
					},
					{
						"sendName": "系统",
						"receviceName": "我",
						"sendText": "../../static/logo.png",
						"createTime": "2023-01-01 12:40:13",
						"TextType": 1,
						"isLike":0,
					},
					{
						"sendName": "系统",
						"receviceName": "我",
						"sendText": "如果想删除一条消息，可以点击该消息对应的头像",
						"createTime": "2023-01-01 12:40:12",
						"TextType": 0,
						"isLike":0,
					},
					{
						"sendName": "系统",
						"receviceName": "我",
						"sendText": "系统将会为你提供每日总结和事项提醒服务~",
						"createTime": "2023-01-01 12:40:11",
						"TextType": 0,
						"isLike":0,
					},
					{
						"sendName": "系统",
						"receviceName": "我",
						"sendText": "欢迎使用本APP！",
						"createTime": "2023-01-01 12:40:10",
						"TextType": 0,  //0表示文字消息，1表示图片消息
						"isLike":0,
					}
				],
				//反转数据接收
				unshiftmsg:[],  //尚未发送的消息
				imgMsg:[],  //图片消息
				oldTime: new Date(),
				inputh: '60'
			}
		},
		
		onLoad() {
			
			// 数组倒叙 主要是应对后端传过来的数据
			
			for (var i = 0; i < this.msg.length; i++) {
				//时间间隔处理
				if (i < this.msg.length - 1) { //这里表示头部时间还是显示一下
					let t = dateTime.spaceTime(this.oldTime, this.msg[i].createTime);
					if (t) {
						this.oldTime = t;
					}
					this.msg[i].createTime = t;
				}
				
				// 获取图片，为下面的预览做准备
				if (this.msg[i].TextType == 1) {
					this.imgMsg.unshift(this.msg[i].sendText)
				}
				this.unshiftmsg.unshift(this.msg[i]);
				
			}
			
			
			// 跳转到最后一条数据 与前面的:id进行对照
			this.$nextTick(function() {
				this.scrollToView = 'msg' + (this.unshiftmsg.length - 1)
			})
			
		},
		
		components:{
			submit
		},
		
		methods: {
			chatTime(date){
				return dateTime.dateTime1(date);
			},
			
			// 进行图片的预览
			previewImg(e) {
				let index = 0;
				for (let i = 0; i < this.imgMsg.length; i++) {
					if (this.imgMsg[i] == e) {
						index = i;
					}
				}
				console.log("index", index)
				// 预览图片
				uni.previewImage({
					current: index,
					urls: this.imgMsg,
				});
			},
			
			//接受输入内容
			inputs(e) {
				//时间间隔处理
				let data = {
					"sendName": "我",
					"receviceName": "系统",
					"sendText": e.message,
					"createTime": new Date(),
					"TextType": e.type,
					"isLike": 0,
				};
				
				this.unshiftmsg.push(data);
				// 跳转到最后一条数据 与前面的:id进行对照
				this.$nextTick(function() {
					this.scrollToView = 'msg' + (this.unshiftmsg.length - 1)
				})
				if (e.type == 1) {
					this.imgMsg.push(e.message);
				}
				console.log(e)
			},
			
			//输入框高度
			heights(e) {
				console.log("高度:", e)
				this.inputh = e;
				this.goBottom();
			},
			
			// 滚动到底部
			goBottom() {
				this.scrollToView = '';
				this.$nextTick(function() {
					this.scrollToView = 'msg' + (this.unshiftmsg.length - 1)
				})
			},
			
			//删除某一条消息
			bindClick(index) {
				let unshiftmsg=this.unshiftmsg;
				uni.showModal({
					title:'提示',
					content:'是否删除',
					success:function(res){
						if(res.confirm){
							console.log('确认删除');
							unshiftmsg.splice(index,1);
						}else if(res.cancel){
							console.log('取消');
						}
					}
				});
			},
			
			//点赞与取消
			like(e){
				if(e.isLike == 0){
					e.isLike=1;
					console.log("进行点赞")
				}
				else{
					e.isLike=0;
					console.log("取消点赞")
				}
			}
			
		}
	}
</script>

<style lang="scss" scoped>//使一个样式内部还可以嵌套

.content {
	height: 100%;
	background-color: #f4f4f4;
}


.chat{
	height: 100%;
	
	.chat-main{
		padding-left: 32rpx;//padding相关的设置元素内边距
		padding-right: 32rpx;
		padding-top: 20rpx;
		display: flex;
		flex-direction: column;//规定弹性项目的方向，column表示作为列垂直地显示弹性项目
	}
	
	.chat-ls{
		.chat-time{
			font-size: 24rpx;//设置字体大小
			color: rgba(39, 40, 50, 0.3);
			line-height: 34rpx;//设置行高（行间距）
			padding: 10rpx 0rpx;
			text-align: center;//文本对齐方式
		}
		
		.msg-m{
			display: flex;
			padding: 20rpx 0;
			.user-img{
				flex: none;
				width: 80rpx;
				height: 80rpx;
				border-radius: 20rpx;
			}
			.message{
				flex: none;
				max-width: 480rpx;
			}
			.msg-text{
				font-size: 32rpx;
				color: rgba(39, 40, 50, 1);
				line-height: 44rpx;
				padding: 18rpx 24rpx;
			}
			.msg-img{
				max-width: 400rpx;
				border-radius: 20rpx;
			}
			.like-heart{//点赞小心心图标
				margin-right: 5%;
			}
		}
		
		.msg-left{
			flex-direction: row;
			.msg-text{
				margin-right: 16rpx;
				background-color: #fff;
				border-radius: 0rpx 20rpx 20rpx 20rpx;
			}
			.ms-img{
				margin-right: 16rpx;
			}
		}
		
		.msg-right{
			flex-direction: row-reverse;
			.msg-text{
				margin-left: 16rpx;
				background-color: #95ec69;
				border-radius: 20rpx 0rpx 20rpx 20rpx;
			}
			.ms-img{
				margin-left: 16rpx;
			}
		}
	}
}



</style>