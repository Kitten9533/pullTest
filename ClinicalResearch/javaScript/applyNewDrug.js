define(['zepto', 'medtap', 'https://review-formal.iplusmed.com/Common/javaScript/beforeSubmit.js'], function($, medtap, beforeSubmit) {
	var apply = {
		userName: '',
		userGender: '',
		userAge: '',
		disease: '',
		drug: '',
		contactUser: '',
		contactPhone: '',
		dic: {},
		applyUrl: window.location.href,
		localIds: [],
		serverId:"",
		imgList:"",
		wechatId:medtap.getRequest('wechatId'),
		init: function() {
			apply.getWeChatTicket();
		},
		//获取微信票据
		getWeChatTicket: function() {
			$.ajax({
				url: 'https://gateway.medtap.cn/wechat/fetchWechatTicket',
				type: 'get',
				async: false,
				contentType: "application/json",
				data: medtap.setToken({
					url: apply.applyUrl
				}),
				success: function(data) {
					var res = data.content;
					wx.config({
						debug: false,
                        appId: res.appId, // 必填，公众号的唯一标识
                        timestamp: res.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.nonceStr, // 必填，生成签名的随机串
                        signature: res.signature, // 必填，签名，见附录1
                        jsApiList: [
                         	'chooseImage',
							'previewImage',
							'uploadImage'
                        ]
					})
				},
				error: function(err){
					alert('发生错误，请重试');
				}
			})
		},
		//调用微信JS-SDK进行图片预览
		bind: function() {
			$('.submit').on('click', function() {
				//必填项校验
				if($('.userName').val() == '') {
					mui.alert('请输入您的姓名');
					return;
				} else if($('.userGender').val() == '') {
					mui.alert('请选择您的性别');
					return;
				} else if($('.userAge').val() == '') {
					mui.alert('请输入您的年龄');
					return;
				} else if($('.disease').val() == '') {
					mui.alert('请输入疾病信息');
					return;
				} else if($('.contactUser').val() == '') {
					mui.alert('请输入联系人姓名');
					return;
				} else if($('.contactPhone').val() == '') {
					mui.alert('请输入联系人电话');
					return;
				}
				apply.submit();
			})
		},
		//提交申请
		submit: function() {
			var appUserData = JSON.parse(window.localStorage.appUserData);
			var wechatId = appUserData.wechatId;
			var picUrl = apply.imgList.substring(0,apply.imgList.length-1);
			if(!medtap.isWeChat()) {
				alert('请在微信上打开页面');
				return;
			}
			beforeSubmit.config({
				wechatId: wechatId,
				getInfo: true,
				success: function() {
					_inner();
				}
			}).init();
			function _inner(){
				medtap.jzz(1);
				$.ajax({
					url: 'https://gateway.medtap.cn/common/insertClinicalResearch',
					type: 'post',
					headers: {
						'appType': 'wechat'
					},
					contentType: 'application/json',
					data: JSON.stringify(medtap.setToken({
						wechatId: wechatId,
						orderType: medtap.getRequest('orderType'),
						paientName: $('.userName').val(),
						sex: $('.userGender').val(),
						age: $('.userAge').val(),
						diseaseName: $('.disease').val(),
						willMedicine: $('.drug').val(),
						contactName: $('.contactUser').val(),
						contactMobile: $('.contactPhone').val(),
						remark: $('#textarea').val(),
						picUrl:picUrl
					})),
					success: function(data) {
						medtap.jzz(0);
						if(data.success){
							window.location.href = 'msgSuccess.html?v=1.0.0&msgType=3&title=' + medtap.getRequest('title') + '&id=' + data.content.orderSn;
						}else{
							window.location.href = 'msgWarn.html?v=1.0.0&msgType=3&title=' + medtap.getRequest('title');
						}
					},
					error: function(err){
						medtap.jzz(0);
						alert('发生错误，请重试');	
					}
				});
			}
		},
		choseImage:function(){
			$('.upLoad').on('click',function(){
				var html = '';
				wx.ready(function(){
					wx.chooseImage({
						count:1,
						sizeType:['original','compressed'],
						sourceType: ['album', 'camera'],
						success:function(res){
							apply.localIds = res.localIds;
							html += '<li class="weui-uploader__file"><img src="'+apply.localIds+'"/></li>'
							$('#ImgUp').append(html);
							apply.previewImage();
							//TODO -->图片上传
							
							wx.uploadImage({
								localId:apply.localIds[0].toString(),
								isShowProgressTips:1,
								success:function(res){
									var d = res.serverId;
									apply.serverId = d;
									apply.upLoadImg()
								},
								error:function(){
									medtap.winPop('图片上传失败~')
								}
							})
						}
					})
				})
			})
		},
		//图片预览
		previewImage:function(){
			$('#upLoaderWrap').on('click','img',function(){
				var imgArray = [];
		        var curImageSrc = $(this).attr('src');
		        if (curImageSrc) {
		            $('#ImgUp img').each(function(index, el) {
		                var itemSrc = $(this).attr('src');
		                imgArray.push(itemSrc);
		            });
		            wx.previewImage({
		                current: curImageSrc,
		                urls: imgArray
		            });
		        }
			});
		},
		//上传图片
		upLoadImg:function(){
			$.ajax({
				url:'https://gateway.medtap.cn/common/uploadWechatFile',
				type:'post',
				data:medtap.setToken({
					bizType:"3",
					folder:'service/' + apply.wechatId, //wechatId
					mediaId:apply.serverId,
					ext:'jpg'
				}),
				success:function(data){
					if(data.success == true){
						var res = data.content;
						var imgKey = res.ossKey;
						apply.imgList += imgKey + ',';
					}
				}
				
			})
		}
	}
	
	apply.init();
	apply.bind();
	apply.choseImage();
})