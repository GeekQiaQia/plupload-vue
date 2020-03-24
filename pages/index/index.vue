
<template class="videoUpLoad">
	<view>
		<view class="rules">
			<span class="title">视频要求</span>
			<view class="rule"><span class="round"></span>视频大小不得超过100M</view>
			<view class="rule"><span class="round"></span>视频仅支持m4v、mp4格式</view>
			<view class="rule"><span class="round"></span>视频需全程清晰</view>
		</view>
		<view class="content">
			<span class="title-content">录制人需朗诵以下内容：</span>
			<view class="text">我是XXXXX，我同意XX视频资料真实有效，如有不实由我愿意承担一切法律后果。</view>
		</view>
		<view v-if="showFlug" class="upload">
			<view class="first" v-if="!success">视频上传中（{{width}}%）</view>
			<view class="success" v-if="success">{{tipText}}</view>
			<view class="second"><view class="progress" :style="{width:width+'%'}"></view></view>
			<!-- <view class="third" @tap="cancel">取消上传</view> -->
		</view>
		
		<view  class="btn-box"  id="container">
			<view  id="selectfiles" class="left-btn" ><span class="icon-left"></span>上传本地视频</view>
					<view class="right-btn" @click="toNextStep" v-if="showNext">下一步</view>
		</view>
		 <video style="visibility:hidden;width:0;height:0;" :src="src"></video>
		
	</view>
</template>

<script>
	import urlConfig from '../../common/config.js'
	import plupload from "plupload";
	import md5 from 'md5'

	export default {
		data() {
			return {
				tipText:'上传完成',
				userId:"",
				success:false,
				first:true,
				fileAddedFileName:"",
				fileAddedFileSize:"",
				src: '',
				width: 0,
				showFlug: false,
				headers: {},
				showNext: false,
				plupLoader: null,
				now: Date.parse(new Date()) / 1000,
				expire: 0,
				accessid: '',
				accesskey: '',
				host: '',
				policyBase64: '',
				signature: '',
				callbackbody: '',
				filename:'',
				key: '',
				g_object_name: '',
				g_object_name_type:'random_name',

			};
		},
		methods: {
	
			startUpload() {
				let self = this;
				self.set_upload_param(self.plupLoader, '', false);
			},
			initplupLoader: function() {
				let self = this;
				self.plupLoader = new plupload.Uploader({
					runtimes: 'html5,flash,silverlight,html4',
					browse_button: 'selectfiles',
					flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
					silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
					url: 'http://oss.aliyuncs.com',	
					/**
					 * 文件上传过滤条件；
					 * */
					filters: {
						mime_types: [ //只允许上传视频文件 过滤条件；
						    
							//在微信浏览器上不支持打开本地相册或者文件夹；
							// {
							// 	title: "files",
							// 	extensions: "mp4,M4V,mov,MP4,m4v,MOV,jpeg"
							// },
							 // {
							 //                    title: "files",
							 //                    // extensions: "jpg,png,gif,jpeg"//这一行加上jpeg然后服务器接收的加上jpeg就好了
							 //                }
							 
						],
						max_file_size: '100mb', //最大只能上传10mb的文件
						prevent_duplicates: true //不允许选取重复文件
					},
					init: {
						PostInit: function() {

							self.set_upload_param(self.plupLoader, '', false);
						},
						/**
						 * @description 文件选择成功回调函数；
						 * */
						FilesAdded: function(up, files) {
						
							let file=files[0];
							self.fileAddedFileName=file.name;
							self.fileAddedFileSize=file.size;
							console.log(self.fileAddedFileName);
							self.showFlug = true;
							let fileName=self.fileAddedFileName;
							let videoType=fileName.split(".")[1];
							console.log(videoType);
							if(videoType=="mp4"||videoType=="MP4"||videoType=="M4V"||videoType=="m4v"||videoType=="mov"||videoType=="MOV"){
								console.log(videoType);
								 self.startUpload();
								 
							}else{
								console.log("您选择的文件后缀不对哦");
								uni.showToast({
									title: "您选择的文件后缀不对哦",
									icon: "none",
									duration: 2000
								});
							}
						    
						},
						/**
						 * @description  开始上传前回调函数；
						 * */
						BeforeUpload: function(up, file) {
						    self.tipText="视频上传中";
							//mp4,M4V,mov,MP4,m4v,MOV
							console.log(file);
							self.set_upload_param(up, file.name, true);
						
						   
						},
							  
						/**
						 * @description  文件上传进度条回调函数
						 * */
						UploadProgress: function(up, file) {
							console.log(file);
							self.width=file.percent;
						},
						/**
						 * @description  文件上传成功回调函数；
						 * */ 
						FileUploaded: function(up, file, info) {
						
							console.log(info);
							
							if (info.status == 200){
						          self.upLoadVideo();
								  //是否第一次上传
								if(self.first){
									
									self.first = false
								    self.tipText="上传完成"
									// self.showFlug = false
									self.success=true
									self.showNext = true
									uni.showToast({
										title: '上传成功',
										icon: "success",
										duration: 2000,
										
									});
									
								}else{
									
									self.success=true
									self.showNext = true
									self.tipText = '重新上传成功'
									uni.showToast({
										title: '重新上传成功',
										icon: "none",
										duration: 2000
									});
									
								}
							}else{
							
								if(self.first){
									self.showFlug = false
									self.width = 0
									self.showNext = false
								
									uni.showToast({
										title: info.response,
										icon: "none",
										duration: 2000
									});
								}else{
									
									self.width = 100
									self.success=true
									self.showNext = true
									self.showFlug = true
									self.tipText = '原视频不变，重新上传失败'
									uni.showToast({
										title: info.response,
										icon: "none",
										duration: 2000
									});
									
								}
								
								
							}
						},
						/**
						 * @description  文件限制错误回调函数；
						 * */
						Error: function(up, err) {
							if(self.first){
								self.width = 0
								self.showFlug = false
							}else{
								self.width = 100
								self.success = true
								self.tipText = '原视频不变，重新上传失败'
							}
							
						     if (err.code == -600) {
						              
									uni.showToast({
										title: "您选择的文件太大了哦",
										icon: "none",
										duration: 2000
									});
						            }
						            else if (err.code == -601) {
										
										uni.showToast({
											title: "您选择的文件后缀不对哦",
											icon: "none",
											duration: 2000
										});
										
						            }
						            else if (err.code == -602) {
										
										uni.showToast({
											title: "此文件已经上传过一遍了哦",
											icon: "none",
											duration: 2000
										});
										
						            }
						            else 
						            {
										uni.showToast({
											title: err.response,
											icon: "none",
											duration: 2000
										});
						             
						            }
								}
					}
				});

			},
			/**
			 * @description pluploader对象初始化；
			 * */
			initLoaderInfo() {
				let self = this;
				self.plupLoader.init();
			},
			/**
			 * @description  获取文件名后缀；
			 * 
			 * */
			get_suffix: function(filename) {
				let pos = filename.lastIndexOf('.')
				let suffix = ''
				if (pos != -1) {
					suffix = filename.substring(pos)
				}
				return suffix;
			},
			/**
			 * @description :设置文件上传参数；获取服务端签名
			 * @param {type} up 
			 * @param {type} ret
			 * @param {type} ret  
			 * */
			set_upload_param: function(up, filename, ret) {
				console.log("into set_upload_param ", up);
				let self = this;
				if (ret == false) {
					ret = self.get_signature()
				}
				let suffix = self.get_suffix(self.filename)
				self.calculate_object_name(filename)
			
				let new_multipart_params = {
					'key': self.g_object_name, // 文件服务器存储路径以及文件名；
					'policy': self.policyBase64,
					'OSSAccessKeyId': self.accessid,
					'success_action_status': '200', //让服务端返回200,不然，默认会返回204
					'signature': self.signature, // 服务端获取到的签名
				};
			

				self.plupLoader.setOption({
					'url': self.host, // oss文件服务器上传地址；
					'multipart_params': new_multipart_params // oss文件服务器上传参数；
				});

				self.plupLoader.start();
			},
			/**
			 * @description :获取服务器签名；
			 * 
			 * */

			get_signature: function() {
				// 可以判断当前expire是否超过了当前时间， 如果超过了当前时间， 就重新取一下，3s 作为缓冲。
				let self = this;
			     // 通过api接口获取服务端签名以及policy等数据；
                 this.$api.GetSignature()
				 .then(res=>{
				
					 let now = self.now = Date.parse(new Date()) / 1000;
					 let expire = self.expire;
					 if (expire < now + 3) {
					
					 	let body = res.data.data;
					
					 	let resultData =body
					 	let obj = body;
					 	self.accessid = obj['accessId']
					 	self.policyBase64 = obj['policy']
					 	self.signature = obj['signature']
					 	self.key = obj['dir']
					 	self.host = obj['host']
					 	self.expire = parseInt(obj['expire'])
						console.log("into signature");
					 
					 }
					
				 })
				 .catch(err=>{
					 
				 })

		
			},
			/**
			 * @description 封装xml请求
			 *   发送xml http 请求；
			 *   本案例中使用统一封装的axios request请求；
			 * */
			send_request: function() {
				let token=uni.getStorageSync("token");
				
				let self = this;
				let xmlhttp = null;
				if (window.XMLHttpRequest) {
					xmlhttp = new XMLHttpRequest();
				} else if (window.ActiveXObject) {
					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				}

				if (xmlhttp != null) {
					// serverUrl是 用户获取 '签名和Policy' 等信息的应用服务器的URL，请将下面的IP和Port配置为您自己的真实信息。
					let serverUrl = urlConfig+self.$api.serverURL;
                    console.log(serverUrl);
					xmlhttp.open("POST", serverUrl, false);
					if(token){
						
						xmlhttp.setRequestHeader("authorize-token",token);
					}
					
					xmlhttp.send(null);
					return xmlhttp.responseText
				} else {
					alert("Your browser does not support XMLHTTP.");
				}
			},
			
			/**
			 * @description 获取随机字符串；
			 * @param {type} len = [value] 
			 * */
			random_string:function (len) {
			　　len = len || 32;
			　　let  chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';   
			　 let maxPos = chars.length;
			　　let  pwd = '';
			　　for (let i = 0; i < len; i++) {
			    　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
			    }
			    return pwd;
			},
			
			/**
			 * @description  设置选择上传文件名；
			 * @param {string} filename 文件名； 
			 * */
			calculate_object_name: function(filename) {
				let self = this;
			
				if (self.g_object_name_type == 'local_name') {
					self.g_object_name += self.filename;
				} else if (self.g_object_name_type == 'random_name') {
					
					let suffix = self.get_suffix(filename)
					// 本案例使用唯一登录的用户id作为上传视频的唯一文件名，如果重复上传则在服务端进行文件覆盖，
					//避免浪费空间；如果么有以上需求，可使用下方注释代码，获取随机文件名作为上传文件名；
					self.g_object_name = self.key + md5(self.userId)+ suffix
					
					//self.g_object_name = self.key + self.random_string(10)+ suffix
				
				}

				return ''
			},
            /**
			 * @description  完成上传，跳转至下一个路由；
			 * */
			toNextStep: function() {
				uni.navigateTo({
					url: '../logisticsInfo/logisticsInfo'
				})
			},
			
		    /**
			 * @description  弃用方法；
			 *  弃用使用uni.chooseImage选择上传视频的方式；
			 *  如果图片等小文件可以使用此方法；
			 * 
			 * */
			upLoad: function() {
				var self = this;
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					success: function(res) {
						let token = uni.getStorageSync("token")
						if (token) {
							self.headers['authorize-token'] = token
						}
						self.showFlug = true
						self.width = 10
						self.src = res.tempFilePath;
						console.log(res)
						let fileTypeArr = res.name.split('.')
						let videoType = fileTypeArr[fileTypeArr.length - 1]
						console.log(videoType)
						console.log(res.size)
						console.log(videoType == 'm4v' || videoType == 'mp4' && res.size < 73400320)
						if ((videoType == 'm4v' || videoType == 'mp4') && res.size < 73400320) {
							self.upLoadVideo()
						} else {
							if (videoType !== 'm4v' && videoType !== 'mp4') {
								uni.showToast({
									title: '文件格式不支持',
									icon: "none",
									duration: 2000
								});
							}
							if (res.size > 73400320) {
								uni.showToast({
									title: '文件过大',
									icon: "none",
									duration: 2000
								});
							}
							self.width = 0
							self.showFlug = false
						}
					}
				});
			},
			/**
			 * @description  将上传视频信息上传到后端服务器，以获取查看视频或者文件阅读路径；
			 * 根据项目需求需要上传自己到自己服务器的api；
			 * */
			upLoadVideo: function() {
				let self=this;
				let filterArray=(self.g_object_name).split("/");
				let name=filterArray[1];
				console.log(name);
				let url=self.host+"/video";
				let reqData={
					event:"reApprove",
					name,
					url
				};
				this.$api.uploadAuthVideo(reqData)
				.then(res=>{
					console.log(res);
					
				})
				.catch(err=>{
					console.log(err);
					
				})
			},
			/**
			 * @description  获取上传视频的唯一iD；
			 * 用来处理上传文件名的唯一性；
			 * 达到文件覆盖节约空间；
			 * */
			toGetUserId(){
				let self = this;
				let userInfo=uni.getStorageSync("loginInfo");
				if(userInfo){
					let userId=userInfo.userId;
					self.userId=userId;
				}
				
			},
            /**
			 * @description 初始化函数；
			 * */
			init() {
			
				this.initplupLoader();
				this.initLoaderInfo();
				this.toGetUserId();
			}
		},
		mounted() {

			this.init();
		}
	}
</script>

<style lang="less">
	.rules {
		width: 666rpx;
		padding-top: 42rpx;
		height: 338rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(202, 219, 252, 1);
		border-radius: 16rpx;
		margin: 0 auto;
	}

	.title {
		font-size: 24rpx;
		color: #6499FE;
		margin-left: 46rpx;
		margin-bottom: 14rpx;
	}

	.rule {
		height: 40rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: rgba(68, 74, 89, 1);
		line-height: 40rpx;
		text-indent: 84rpx;
		margin-bottom: 14rpx;
		position: relative;
	}

	.round {
		display: inline-block;
		width: 14rpx;
		height: 14rpx;
		border-radius: 50%;
		background: linear-gradient(90deg, rgba(71, 142, 253, 1) 1%, rgba(34, 85, 251, 1) 100%);
		position: absolute;
		left: 48rpx;
		top: 18rpx;
	}

	.content {
		width: 666rpx;
		height: 400rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(202, 219, 252, 1);
		border-radius: 16rpx;
		margin: 0 auto;
		margin-top: 40rpx;
		padding-top: 52rpx;
	}

	.title-content {
		font-size: 24rpx;
		color: #6499FE;
		margin-left: 46rpx;
	}

	.text {
		width: 588rpx;
		height: 240rpx;
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(68, 74, 89, 1);
		line-height: 40rpx;
		margin-top: 20rpx;
		margin-left: 40rpx;
	}

	.btn-box {
		margin: 0 auto;
		width: 720rpx;
		margin-top: 64rpx;
		overflow: hidden;
	}

	.left-btn {
		width: 360rpx;
		height: 138rpx;
		text-align: center;
		line-height: 136rpx;
		font-size: 28rpx;
		color: #fff;
		float: left;
		background: url(../../static/image/btn-bac.png) no-repeat center;
		background-size: 100%;
		position: relative;
	}

	.right-btn {
		width: 360rpx;
		height: 138rpx;
		text-align: center;
		line-height: 136rpx;
		font-size: 28rpx;
		color: #fff;
		float: left;
		background: url(../../static/image/btn-bac.png) no-repeat center;
		background-size: 100%;
		position: relative;
	}

	.icon-left {
		display: inline-block;
		width: 38rpx;
		height: 38rpx;
		background: url(../../static/image/left-btn.png) no-repeat center;
		background-size: 100%;
		position: absolute;
		left: 56rpx;
		top: 46rpx;
	}

	.icon-right {
		display: inline-block;
		width: 38rpx;
		height: 38rpx;
		position: absolute;
		background: url(../../static/image/record.png) no-repeat center;
		background-size: 100%;
		left: 56rpx;
		top: 46rpx;
	}

	.upload {
		width: 666rpx;
		height: 260rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(202, 219, 252, 1);
		border-radius: 16rpx;
		margin: 0 auto;
		padding-top: 68rpx;
	}

	.first {
		width: 400rpx;
		height: 40rpx;
		font-size: 28rpx;
		color: #9B9B9B;
		line-height: 40rpx;
		margin-left: 36rpx;
		text-indent: 60rpx;
		background: url(../../static/image/uping.png) no-repeat left 2rpx;
		background-size: 38rpx 38rpx;
	}

	.second {
		width: 592rpx;
		height: 16rpx;
		margin: 0 auto;
		margin-top: 12rpx;
		background: #9B9B9B;
		border-radius: 6rpx;
		position: relative;
	}

	.progress {
		width: 200rpx;
		height: 16rpx;
		background: #6499FE;
		position: absolute;
		left: 0;
		top: 0;
	}

	.third {
		width: 200rpx;
		height: 98rpx;
		background: url(../../static/image/red-btn.png) no-repeat center;
		background-size: 200rpx 98rpx;
		text-align: center;
		line-height: 98rpx;
		margin-top: 36rpx;
		margin-left: 36rpx;
		font-size: 28rpx;
		color: #D60000;
	}

	.next {
		width: 744rpx;
		height: 138rpx;
		text-align: center;
		line-height: 138rpx;
		font-size: 28rpx;
		color: #fff;
		margin-top: 26rpx;
		background: url(../../static/image/bg-next.png) no-repeat center;
		background-size: 744rpx 138rpx;
	}
	.success{
		width: 400rpx;
		height: 40rpx;
		font-size: 28rpx;
		color: #2966FF;
		line-height: 40rpx;
		margin-left: 36rpx;
		text-indent: 60rpx;
		font-weight: bold;
		background: url(../../static/image/export-success-icon.png) no-repeat left center/contain;
		background-size: 38rpx 38rpx;
	}
</style>
