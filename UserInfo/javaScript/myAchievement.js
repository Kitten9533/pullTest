define(['zepto', 'medtapCore', 'mui', 'mui.picker'], function($, medtapCore, mui) {
	var list = {
		offset: 1,
		limit: 10,
		wechatId: medtapCore.getRequest('wechatId'),
		date: '',
		flag1: false,
		flag2: false,
		init: function(){
			medtapCore.jzz(1);
			list.getInfo();
			list.getOrder();
		},
		bind: function(){
			$('.tabOne').on('click', function(){
				window.location.href = 'achievementTabOne.html?v=1.0.0&wechatId=' + medtapCore.getRequest('wechatId');
			});
			$('.tabTwo').on('click', function(){
				window.location.href = 'achievementTabTwo.html?v=1.0.0&wechatId=' + medtapCore.getRequest('wechatId');
			});
		},
		getInfo: function(){
//			medtapCore.jzz(1);
			list.offset = 1;
			$.ajax({
				url: "https://gateway.medtap.cn/service/listUserByOriginInfo",
				data: medtapCore.setToken({
					wechatId: list.wechatId,
//					offset: list.offset,
//					limit: list.limit,
					userType: 0,
					date: list.date
				}),
				type: 'get',
				headers: {
					'appType': 'wechat'
				},
				contentType: "application/json",
				async: true,
				dataType: 'json',
				success: function(data) {
//					mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
//					medtapCore.jzz(0);
					list.flag1 = true;
					list.jzzByFlg();
					if(!data.success) {
						alert(data.resultDesc);
						return;
					}
					$('.scan').text(data.content.scan);
					$('.valid').text(data.content.valid);
					var dataContent;
					if(!!list.date){
						dataContent = data.content.monthPerformance;
						$('.monthScan').text(data.content.monthScan);
						$('.monthValid').text(data.content.monthValid);
					}else{
						dataContent = data.content.allPerformance;
					}
				},
				error: function(err) {
					list.flag1 = true;
					list.jzzByFlg();
//					medtapCore.jzz(0);
				}
			});
		},
		getOrder: function(){
			medtapCore.jzz(1);
			$.ajax({
				url: "https://gateway.medtap.cn/service/countAllOrder",
				data: medtapCore.setToken({
					wechatId: list.wechatId,
					date: list.date
				}),
				type: 'get',
				headers: {
					'appType': 'wechat'
				},
				contentType: "application/json",
				async: true,
				dataType: 'json',
				success: function(data) {
					list.flag2 = true;
					list.jzzByFlg();
//					medtapCore.jzz(0);
					if(!data.success) {
						alert(data.resultDesc);
						return;
					}
					$('.allFee').text(!!data.content.hasOwnProperty('price') ? new Number(data.content.price).toFixed(2) : '');
					$('.amount').text(data.content.count);
				},
				error: function(err) {
					list.flag2 = true;
					list.jzzByFlg();
//					medtapCore.jzz(0);
				}
			});
		},
		jzzByFlg: function(){
			if(list.flag1 && list.flag2){
				medtapCore.jzz(0);
			}
		}
	};
	
	list.bind();
	list.init();
});