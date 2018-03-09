define(['zepto', 'medtapCore'], function($, medtapCore) {
	var info = {
		userName: '',
		nickName: '',
		age: '',
		sex: '',
		mobile: '',
		profile: '',
		wechatId:medtapCore.getRequest('wechatId'),
//		测试用 weichatid  oJRR4wNSqkkv3gBpU83K0KbX3_mE
		init: function() {
			var context = medtapCore.getRequest('wechatId'),
				appUserData = {};
			appUserData.wechatId = context;
//			appUserData.wechatId = 'oJRR4wNSqkkv3gBpU83K0KbX3_mE';
			localStorage.appUserData = JSON.stringify(appUserData);
			info.getUserInfo();
		},
		getUserInfo: function() {
			var _this = this;
			$.ajax({
				//url: 'https://gateway.medtap.cn/app/user/getUserDetailByParam',
				url:'https://gateway.medtap.cn/app/user/getUserDetailByParam',
				headers: {
					appType: 'wechat'
				},
				type: 'get',
				data: medtapCore.setToken({
					wechatId: medtapCore.getRequest('wechatId')
				}),
				success: function(data) {
					if(data.success == true) {
						var info = data.content;
						_this.mobile = info.mobile;
						_this.userName = !!info.username ? info.username : '未指定';
						_this.nickName = !!info.nickname ? info.nickname : '';
						_this.age = info.age;
						_this.profile = info.profile;
						$('.profile').attr('src', info.profile).css('opacity', 1);
						$('.userName').text(!!info.userName ? info.userName : '' + "(" + !!info.nickName ? info.nickName : '' + ")");
						if(info.age != -1){
							$('.age').text(info.age);
//							$('.userAge').show();
						}
						if(info.sex == "F") {
							$('.sex').attr('src', 'images/personal_icon_gender_woman@2x.png').css('opacity',1);
						} else {
							$('.sex').attr('src', 'images/personal_icon_gender_man@2x.png').css('opacity',1);
						}
						if(!info.hasOwnProperty('mobile')){
							$('.phoneNum').html('<span class="bindTel">绑定手机</span>');
						}else{
							$('.tel-icon').show();
							$('.phoneNum').text(info.mobile);
						}
						$('.bindTel').on('click', function(e){
							e.stopPropagation();
							window.location.href = 'pages/bindMobile.html?v=1.0.0&wechatId=' + medtapCore.getRequest('wechatId');
						});
						
						if(info.userType == 1 || info.userType == 2){
							if(info.userType == 1) {
								$('.QRTip').text('代理商');
							}else if(info.userType == 2){
								$('.QRTip').text('代理商');
							}
							$('.QR_Wrap').show().attr('userType', info.userType);
							$('.QR_Wrap').on('click',function(){
								window.location.href = 'pages/my_QR_Code.html?v=1.0.0&wechatId=' + medtapCore.getRequest('wechatId') + '&userType=' + $(this).attr('userType');
							})
						}else {
							$('.beAgency').show();
							$('.beAgency').on('click',function(){
								if(_this.hasOwnProperty('mobile') && _this['mobile']){
									window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/UserInfo/pages/applyAgent.html?v=1.0.0&wechatId=' + medtapCore.getRequest('wechatId');
								}else{
									window.location.href = "https://review-formal.iplusmed.com/wxPayPrd/login/login.html?v=1.0.0&wechatId=" + medtapCore.getRequest('wechatId') + '&doctorId=' + medtapCore.getRequest('doctorId') + '&redirect_uri=https://review-formal.iplusmed.com/wxPayPrd/UserInfo/pages/applyAgent.html';
								}
							})
						}
						$('.inviteCode').text(!!info.inviteCode ? info.inviteCode : '');
						//为代理商时显示邀请码
						if(!!info.inviteCode && (info.userType == 2 || info.userType == 1)){
							$('.inviteBox').show();
						}
					}
				}
			})
		},
		route: function() {
			$('.toDetial').on('click', function() {
				window.location.href = 'pages/userInformation.html?v=1.0.0';
			})
			
			$('.tools').on('click', 'div', function() {
				var type = $(this).attr('class');
				var router = type.substring(0, type.length - 5).trim();

				switch(router) {
					case 'myOrder':
						window.location.href = 'pages/myOrder.html?v=1.0.0&wechatId=' + info.wechatId;
						break;
					case 'myApply':
						window.location.href = 'pages/myApply.html?v=1.0.0&wechatId=' + info.wechatId;
						break;
					case 'myDoctor':
						window.location.href = 'pages/myDoctor.html?v=1.0.0&wechatId=' + info.wechatId;
						break;
					case 'sendGift':
						window.location.href = 'pages/sendGift.html?v=1.0.0&wechatId=' + info.wechatId;
						break;
				}
			})
			
//			$('.bindMobile').on('click', function(){
//				window.location.href = 'pages/bindMobile.html?wechatId=' + medtapCore.getRequest('wechatId');
//			});
		}
	}
	info.init();
	info.route();
})