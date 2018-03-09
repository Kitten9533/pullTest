define(['zepto', 'medtapCore'], function($, medtapCore) {
	var info = {
		wechatId: medtapCore.getRequest('wechatId'),
		init: function() {
			$('.header').text('代理商信息');
			$('.header-2').text('代理商姓名:');
			$('.btns').css('opacity', 1);

			$.ajax({
				url: 'https://gateway.medtap.cn/wechat/createQrcode',
				type: 'post',
				dataType: 'json',
				contentType: "application/json",
				data: JSON.stringify(medtapCore.setToken({
					wechatId: info.wechatId
				})),
				success: function(res) {
					if(res.success == true) {
						var data = res.content;
						var imgUrl = data.qrcode;
						$('.qr_code').attr('src', imgUrl);
						$('.agentName').text(data.username)
					} else {
						//alert(res.code)
					}
				},
				error: function() {

				}
			});
		},
		bind: function() {
			$('.my').on('click', function() {
				window.location.href = 'myAchievement.html?v=1.0.0&wechatId=' + medtapCore.getRequest('wechatId');
			});
			$('.poster').on('click', function() {
				window.location.href = 'poster.html?v=1.0.0&wechatId=' + medtapCore.getRequest('wechatId');
				//				info.applyPoster();
			});
		},
		applyPoster: function() {
			$.ajax({
				url: 'https://gateway.medtap.cn/service/agency/savePosterApply',
				type: 'post',
				dataType: 'json',
				headers: {
					appType: 'wechat'
				},
				contentType: "application/json",
				data: JSON.stringify(medtapCore.setToken({
					wechatId: info.wechatId
				})),
				success: function(data) {
					if(data.success == true) {
						alert('代理商海报申请成功， 请耐心等待客服联系');
					} else {
						if(data.resultCode == 5013) {
							alert('代理商海报申请已提交，请稍后再次尝试。');
						} else {
							alert(data.resultDesc);
						}
					}
				},
				error: function() {

				}
			});
		}
	}
	info.init();
	info.bind();
})