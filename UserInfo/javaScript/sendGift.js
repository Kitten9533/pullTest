define(['zepto', 'medtapCore', 'mui'], function($, medtapCore, mui) {
	var list = {
		type: medtapCore.getRequest('type'),
		offset: 1,
		limit: 10,
		init: function() {
			medtapCore.jzz(1);

			mui.init({
				pullRefresh: {
					container: '#pullrefresh',
					down: {
						auto: true,
						callback: list.pulldownRefresh
					},
					up: {
						contentrefresh: '正在加载...',
						callback: list.pullupRefresh,
						contentnomore: '没有更多数据了'
					}
				}
			});

		},
		dat: [],
		giftPicDic: {
			'1': '../images/gift1.png',
			'2': '../images/gift2.png',
			'3': '../images/gift3.png',
			'4': '../images/gift4.png',
			'5': '../images/gift5.png',
			'6': '../images/gift6.png'
		},
		giftNameDic: {
			'1': '一面锦旗',
			'2': '一朵鲜花',
			'3': '一个蛋糕',
			'4': '一只玫瑰',
			'5': '一杯咖啡',
			'6': '一份冰淇淋'
		},
		pulldownRefresh: function() {
			medtapCore.jzz(1);
			list.offset = 1;
			$.ajax({
				url: "https://gateway.medtap.cn/app/user/listDoctorGiftByUserId",
//				url: "https://devgw.medtap.cn/app/user/listDoctorGiftByUserId",
				data: medtapCore.setToken({
					wechatId: medtapCore.getRequest('wechatId'),
					offset: list.offset,
					limit: list.limit
				}),
				type: 'get',
				headers: {
					'appType': 'wechat'
				},
				contentType: "application/json",
				async: false,
				dataType: 'json',
				success: function(data) {
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
					medtapCore.jzz(0);
					if(!data.success) {
						alert(data.resultDesc);
						return;
					}
					list.dat = data.content;
					var content = data.content,
						item = {},
						str = '';
					if(content.length === 0) {
						str += '<div class="none-gift">暂无我的礼物数据</div>';
					}else{
						//TODO 礼物件数
//						$('.giftNum').text('100');
//						$('.header').show();
					}
					for(var i = 0, len = content.length; i < len; i++) {
						item = content[i];
						str +=
							'<li class="gifts">' +
							'<div class="li-content">' +
							'<img class="giftPic" src="' + list.giftPicDic[item.giftId] + '"/>' +
							'<div class="detail">' +
							'<p>送给<span class="doctorName">' + item.doctorName + '</span>医生<span class="giftName">' + list.giftNameDic[item.giftId] + '</span></p>' +
							'<p class="desc"><span>真情寄语：</span>' + item.presentContent + '</p>' +
							'</div>' +
							'</div>' +
							'</li>';
					}
					$('#list').html(str);
//					list.bind();
				},
				error: function(err) {
					medtapCore.jzz(0);
				}
			});
		},
		pullupRefresh: function() {
			medtapCore.jzz(1);
			list.offset++;
			$.ajax({
				url: "https://gateway.medtap.cn/app/user/listDoctorGiftByUserId",
//				url: "https://devgw.medtap.cn/app/user/listDoctorGiftByUserId",
				data: medtapCore.setToken({
					wechatId: medtapCore.getRequest('wechatId'),
					offset: list.offset,
					limit: list.limit
				}),
				headers: {
					'appType': 'wechat'
				},
				type: 'get',
				contentType: "application/json",
				async: false,
				dataType: 'json',
				success: function(data) {
					medtapCore.jzz(0);
					if(!data.success) {
						alert(data.resultDesc);
						return;
					}
					var content = data.content,
						item = {},
						str = '';
					for(var i = 0, len = content.length; i < len; i++) {
						item = content[i];
						str +=
							'<li class="gifts">' +
							'<div class="li-content">' +
							'<img class="giftPic" src="' + list.giftPicDic[item.presentName] + '"/>' +
							'<div class="detail">' +
							'<p>送给<span class="doctorName">' + item.doctorName + '</span>医生<span class="giftName">' + list.giftNameDic[item.presentName] + '</span></p>' +
							'<p class="desc"><span>真情寄语：</span>' + item.presentContent + '</p>' +
							'</div>' +
							'</div>' +
							'</li>';
					}
					$('#list').append(str);
//					list.bind();
					if(data.content.length == 0) {
						mui.toast('没有更多数据了');
						mui('#pullrefresh').pullRefresh().refresh(true);
					}
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(data.content.length == 0);
				},
				error: function(err) {
					medtapCore.jzz(0);
				}
			});
		}
//		,bind: function() {
//			
//		}
	};

	list.init();
});