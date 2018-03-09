define(['zepto', 'medtapCore', 'mui', 'mui.picker'], function($, medtapCore, mui) {
	var list = {
		userPicker: [],
		localIds: [],
		serverId:"",
		imgList:"",
		showUserPickerButton: [],
		userResult: [],
		showUserPickerButton: [],
		sexDic: [
			{text: '男', value: 'M'},
			{text: '女', value: 'F'},
		],
		userTypeDic:[
			{text: '医生', value: 'YS'},
			{text: '患者', value: 'HZ'},
			{text: '家属', value: 'JS'},
			{text: '其他专业人士', value: 'QTZYRS'},
		],
		msgDic: {
			'userName': '请输入申请人姓名',
			'mobile': '请输入申请人手机号',
			'sex': '请选择申请人性别',
			'userType': '请选择申请人身份'
		},
		init: function(){
			list.getApply();
			list.getWeChatTicket();
			list.initPickers(1, 'sexBox', 'sex', list.sexDic);
			list.initPickers(2, 'userTypeBox', 'userType', list.userTypeDic);
		},
		bind: function(){
			$('.submit').click(function(){
				var flag = true,
					msg = '';
				$('.mui-input-group input.required, textarea.required').each(function(){
					if(!!$(this).val() == false) { 
						flag =false;
						msg = list.msgDic[$(this).attr('id')];
						return false;
					}
				});
				flag ? list.submit() : mui.alert(msg);
			});
		},
		submit: function(){
			medtapCore.jzz(1);
			$('.submit').attr('disabled', true);
			var picUrl = list.imgList.substring(0,list.imgList.length-1);
			$.ajax({
//				url: "https://gateway.medtap.cn/service/saveAgencyApply",
				url: "https://gateway.medtap.cn/service/saveAgencyApply",
//				url:'http://192.168.8.199:6020/service/saveAgencyApply',
				data: JSON.stringify(medtapCore.setToken({
					wechatId: medtapCore.getRequest('wechatId'),
					username: $('#userName').val().trim(),
					mobile: $('#mobile').val().trim(),
					sex: $('#sex').attr('sendKey'),
					applicantIdentity: $('#userType').attr('sendKey'),
					inviteCode: $('#inviteCode').val().trim(),
					picUrl:picUrl
				})),
				type: 'post',
				headers: {
					'appType': 'wechat'
				},
				contentType: "application/json",
				async: false,
				dataType: 'json',
				success: function(data) {
					$('.submit').removeAttr('disabled');
					medtapCore.jzz(0);
					if(data.success){
						window.location.replace('agentWaiting.html?v=1.0.0&wechatId=' + medtapCore.getRequest('wechatId'));
					}else{
						alert(data.resultDesc);
						//医生提交时
						if(data.resultCode == 5012){
							window.location.replace('agentWaiting.html?v=1.0.0&wechatId=' + medtapCore.getRequest('wechatId'));
						}
					}
				},
				error: function(err) {
					$('.submit').removeAttr('disabled');
					medtapCore.jzz(0);
				}
			});
		},
		getApply: function(){
			medtapCore.jzz(1);
			$.ajax({
//				url: "https://gateway.medtap.cn/service/getAgencyApply",
				url: "https://gateway.medtap.cn/service/getAgencyApply",
				data: medtapCore.setToken({
					wechatId: medtapCore.getRequest('wechatId')
				}),
				type: 'get',
				headers: {
					'appType': 'wechat'
				},
				contentType: "application/json",
				async: false,
				dataType: 'json',
				success: function(data) {
					medtapCore.jzz(0);
					if(data.success){
						if(data.content.agencyApplyItem.applyStatus == 0){
							//申请中
							window.location.replace('agentWaiting.html?v=1.0.0&wechatId=' + medtapCore.getRequest('wechatId'));
						}
						else if(data.content.agencyApplyItem.applyStatus == 2){
							window.location.replace('agentFailed.html');
						}
						else{
							$('.mui-content').css('opacity', 1);
							list.bind();
						}
					}else{
						$('.mui-content').css('opacity', 1);
						alert(data.resultDesc);
					}
				},
				error: function(err) {
					medtapCore.jzz(0);
				}
			});
		},
		initPickers: function(index, el, tarEl, vals) {
			var _this = list;
			_this.userPicker[index] = new mui.PopPicker();
			_this.userPicker[index].setData(vals);
			_this.showUserPickerButton[index] = document.getElementById(el);
			_this.userResult[index] = document.getElementById(tarEl);
			_this.showUserPickerButton[index].addEventListener('tap', function(event) {
				_this.userPicker[index].show(function(items) {
					document.getElementById(tarEl).nodeName === 'INPUT' || document.getElementById(tarEl).nodeName === 'TEXTAREA' ? 
						(_this.userResult[index].value = items[0]['text']) : 
						(_this.userResult[index].innerHTML = items[0]['text']);
					_this.userResult[index].setAttribute('sendKey', items[0]['value']);
				});
			}, false);
		},
		getWeChatTicket:function(){
			$.ajax({
				url: 'https://gateway.medtap.cn/wechat/fetchWechatTicket',
				type: 'get',
				async: false,
				contentType: "application/json",
				data: medtapCore.setToken({
					url: window.location.href
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
		choseImage:function(){
			$('.upLoad').on('click',function(){
				var html = '';
				wx.ready(function(){
					wx.chooseImage({
						count:1,
						sizeType:['original','compressed'],
						sourceType: ['album', 'camera'],
						success:function(res){
							list.localIds = res.localIds;
							html += '<li class="weui-uploader__file"><img src="'+list.localIds+'"/></li>'
							$('#ImgUp').append(html);
							list.previewImage();
							//TODO -->图片上传
							
							wx.uploadImage({
								localId:list.localIds[0].toString(),
								isShowProgressTips:1,
								success:function(res){
									var d = res.serverId;
									list.serverId = d;
									list.upLoadImg()
								},
								error:function(){
									medtapCore.winPop('图片上传失败~')
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
				data:medtapCore.setToken({
					bizType:"3",
					folder:'serviceAGENCY/' + medtapCore.getRequest('wechatId'), //wechatId
					mediaId:list.serverId,
					ext:'jpg'
				}),
				success:function(data){
					if(data.success == true){
						var res = data.content;
						var imgKey = res.ossKey;
						list.imgList += imgKey + ',';
					}
				}
				
			})
		}
	};
	
	list.init();
	list.choseImage()

});