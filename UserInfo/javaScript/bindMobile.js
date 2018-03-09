define(['zepto', 'medtapCore'], function($, medtapCore) {
	var clock = null,
		nums = 60;

	var login = {
		wechatId: medtapCore.getRequest('wechatId'),
		init: function() {

		},
		bind: function() {
			$('#getSms').click(function() {
				if(/^1[3|4|5|7|8][0-9]{9}$/.test($('#mobile').val()) == false) {
					alert('请输入正确的手机号');
					return;
				}
				$.ajax({
					url: 'https://gateway.medtap.cn/app/user/sendLoginSmsCode',
					type: 'post',
					async: true,
					data: medtapCore.setToken({
						mobile: $('#mobile').val()
					}),
					success: function(data) {
						login.sendCode(document.getElementById('getSms'));
						if(data.success) {
							alert('验证码已发送，请注意查收！');
						} else {
							alert(data.resultDesc);
						}

					},
					error: function(err) {
						console.log('err: ' + err);
						alert('发送失败，请重试！')
					}
				});
			});

			$('#login').click(function() {
				if(/^1[3|4|5|7|8][0-9]{9}$/.test($('#mobile').val()) == false) {
					alert('请输入正确的手机号');
					return;
				}
				if(!$('#smsCode').val()) {
					alert('请输入验证码');
					return;
				}
				$.ajax({
					url: 'https://gateway.medtap.cn/app/user/loginUserBySmsCode',
					type: 'post',
					async: true,
					dataType: 'json',
					headers: {
						appType: 'wechat'
					},
					data: medtapCore.setToken({
						mobile: $('#mobile').val(),
						smsCode: $('#smsCode').val(),
						wechatId: login.wechatId
					}),
					success: function(data) {
						if(data.success) {
							login.updateUserInfo();
						} else {
							alert(data.resultDesc);
						}
					},
					error: function(err) {
						console.log('err: ' + err);
					}
				});
			});
			$('.userLicens').click(function() {
				medtapCore.pushNewWindow('userLicens.html');
			});
		},
		updateUserInfo: function() {
			$.ajax({
				url: 'https://gateway.medtap.cn/app/user/updateUserInfo',
				type: 'post',
				async: true,
				dataType: 'json',
				contentType: "application/json",
				headers: {
					appType: 'wechat'
				},
				data: JSON.stringify(medtapCore.setToken({
					mobile: $('#mobile').val(),
					wechatId: login.wechatId
				})),
				success: function(data) {
					if(data.success) {
						alert('绑定手机号成功');
						window.location.replace('../userInfoIndex.html?v=1.0.0&type=wx&wechatId=' + medtapCore.getRequest('wechatId'));
					} else {
						alert(data.resultDesc);
					}
				},
				error: function(err) {
					console.log('err: ' + err);
				}
			});
		},
		sendCode: function(thisBtn) {
			btn = thisBtn;
			btn.disabled = true;
			btn.innerHTML = nums + 'S';
			clock = setInterval(doLoop, 1000);
			$(thisBtn).addClass('bg');

			function doLoop() {
				nums--;
				if(nums > 0) {
					btn.innerHTML = nums + 'S';
				} else {
					clearInterval(clock); //清除js定时器
					btn.disabled = false;
					btn.innerHTML = '获取验证码';
					nums = 60; //重置时间
					$(thisBtn).removeClass('bg');
				}
			}
		}
	};

	login.init();
	login.bind();
});