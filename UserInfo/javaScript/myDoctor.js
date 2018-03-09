define(['zepto', 'medtap'], function($, medtap) {
	var myDoctor = {
		wechatId: medtap.getRequest('wechatId'),
		init: function() {

			myDoctor.getMyAttentionDocotr();
			//			myDoctor.getMyProviderDoctor();
		},
		getMyAttentionDocotr: function() {
			var appUserData = JSON.parse(window.localStorage.appUserData);
			var wechatId = appUserData.wechatId;
			if(!medtap.isWeChat()) {
				alert('请在微信上打开页面');
				return;
			}
			$.ajax({
				url: 'https://gateway.medtap.cn/app/friend/getDoctorUserFriendByUserId',
				type: 'get',
				headers: {
					appType: 'wechat'
				},
				data: medtap.setToken({
					wechatId: myDoctor.wechatId,
					offset: '1',
					limit: '100000'
				}),
				success: function(data) {
					if(data.success == true) {
						var myAtDoctor = data.content;
						var html = '';
						for(var i = 0; i < myAtDoctor.length; i++) {
							html += '<li class="mui-table-view-cell mui-media" doctorid="' + myAtDoctor[i].doctorId + '" doctorname="' + myAtDoctor[i].doctorName + '">' +
								'<a href="javascript:;">' +
								'<img class="mui-media-object mui-pull-left profile" src="' + myAtDoctor[i].profile + '">' +
								'<div class="mui-media-body">' +
								'<span class="docotrName">' + myAtDoctor[i].doctorName + '</span><span class="level">' + (!!myAtDoctor[i].technologyProfessional ? myAtDoctor[i].technologyProfessional : '') + '</span>' +
								' <p class="mui-ellipsis hospital">' + (!!myAtDoctor[i].hospitalName ? myAtDoctor[i].hospitalName : '') + '</p>' +
								'<p class="mui-ellipsis depart">' + (!!myAtDoctor[i].departmentName ? myAtDoctor[i].departmentName : '') + '</p>' +
								'</div>' +

								//						            '<div class="chosebg" doctorid="' + myAtDoctor[i].doctorId + '" doctorname="' + myAtDoctor[i].doctorName + '">'+
								//									'<div class="chose"></div>'+

								'</div>' +
								'</a>' +
								'</li>';
						}
						$('.myAttentionDoctor').html(html);
						myDoctor.bind();
					} else {
						alert(data.resultDesc);
					}
				}
			})
		},
		getMyProviderDoctor: function() {
			var appUserData = JSON.parse(window.localStorage.appUserData);
			var wechatId = appUserData.wechatId;
			if(!medtap.isWeChat()) {
				alert('请在微信上打开页面');
				return;
			}
			$.ajax({
				url: 'https://gateway.medtap.cn/app/user/listPmdDoctor',
				type: 'get',
				headers: {
					appType: 'wechat'
				},
				data: medtap.setToken({
					wechatId: myDoctor.wechatId,
					offset: '1',
					limit: '100000'
				}),
				success: function(data) {
					if(data.success == true) {
						var myPrDoctor = data.content;
						var html = '';
						for(var i = 0; i < myPrDoctor.length; i++) {
							html += '<li class="mui-table-view-cell mui-media" doctorid="' + myAtDoctor[i].doctorId + '" doctorname="' + myAtDoctor[i].doctorName + '">' +
								'<a href="javascript:;">' +
								'<img class="mui-media-object mui-pull-left profile" src="' + myPrDoctor[i].profile + '">' +
								'<div class="mui-media-body">' +
								'<span class="docotrName">' + myPrDoctor[i].doctorName + '</span><span class="level">' + myPrDoctor[i].technologyProfessional + '</span>' +
								' <p class="mui-ellipsis hospital">' + myPrDoctor[i].hospitalName + '</p>' +
								'<p class="mui-ellipsis depart">' + myPrDoctor[i].departmentName + '</p>' +
								'</div>' +
								'</a>' +
								'</li>';
						}
						$('.myProviderDoctor').html(html);
					} else {
						alert(data.resultDesc);
					}
				}
			})
		},
		bind: function() {
			$('#followList').on('click', 'li', function() {
				window.location.href = "https://review-formal.iplusmed.com/wxPayPrd/FindDoctor/doctorHomePage.html?v=1.0.0&type=wx&doctorId=" + $(this).attr('doctorid') + '&wechatId=' + medtap.getRequest('wechatId'); 
			});
		}
	}
	myDoctor.init();
})