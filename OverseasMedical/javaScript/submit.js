define(['zepto', 'medtapCore', 'https://review-formal.iplusmed.com/Common/javaScript/beforeSubmit.js'], function($, medtapCore, beforeSubmit) {
	var submit = {
		orderType: '0',
		typeDic: {
			'海外医疗': 'HWYL',
			'肿瘤风险评估': 'ZLFXPG',
			'全球第二意见': 'QQDEYJ',
			'赴美就医': 'FMJY',
			'日本质子治疗': 'RBZZZL',
			'港澳新药治疗': 'GAXYZL'
		},
		msgDic: {
			'userName': '请先填写联系人姓名',
			'mobile': '请先填写手机号码'
		},
		init: function(){
//			console.log('orderType: ' + submit.orderType);
			if(!!document.title && document.title != 'null'){
				submit.orderType = submit.typeDic[document.title];
//				console.log('orderType: ' + submit.typeDic[document.title]);
			}else{
//				console.log('无法获取到咨询类型');
			}
			
		},
		bind: function(){
			$('.submit').click(function(){
				var flag = true,
					msg = '';
				$('input.required').each(function(){
					if(!!$(this).val() == false) { 
						flag =false;
						msg = submit.msgDic[$(this).attr('id')];
						return false;
					}
				});
				flag ? submit.submit() : alert(msg);
			});
		},
		submit: function(){
			var appUserData = JSON.parse(window.localStorage.appUserData);
			var wechatId = appUserData.wechatId;
			if(!medtapCore.isWeChat()) {
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
				medtapCore.jzz(1);
				$.ajax({
					url: 'https://devgw.medtap.cn/service/other/saveOtherApply',
					contentType: "application/json",
					type: 'post',
					headers: {
						'appType': 'wechat'
					},
					async: true,
					dataType: 'json',
					data: JSON.stringify(medtapCore.setToken({
						wechatId: wechatId,
						applyType: submit.orderType,   // 1.全球找药  2.国内找药
						contactMobile: $('#mobile').val(),
						contactName: $('#userName').val()
					})),
					success: function(data) {
						medtapCore.jzz(0);
						if(data.success){
							window.location.href = 'msgSuccess.html?v=1.0.0&msgType=1&title=' + medtapCore.getRequest('title') + '&id=' + data.content.otherApplyVO.applySn;
						}else{
							window.location.href = 'msgWarn.html?v=1.0.0&msgType=1&title=' + medtapCore.getRequest('title');
						}
					},
					error: function(err){
						medtapCore.jzz(0);
						console.log(err);
					}
				});
			}
		}
	};
	
	submit.init();
	submit.bind();
});