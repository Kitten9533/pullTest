define(['zepto', 'medtapCore', 'mui', 'mui.picker'], function($, medtapCore, mui) {
	var list = {
		offset: 1,
		limit: 10,
		wechatId: medtapCore.getRequest('wechatId'),
		date: '',
		urlBase: 'https://gateway.medtap.cn',
		//		urlBase: 'http://192.168.8.14:6020',
		urlDic: {
			me: '/service/listShopOrderForMe',
			others: '/service/listShopOrderForOthers',
			tier: '/service/listShopOrderForTier'
		},
		key: 'me',
		init: function() {
			//			mui.init({
			//				pullRefresh: {
			//					container: '#pullrefresh',
			//					down: {
			//						auto: true,
			//						callback: list.pulldownRefresh
			//					},
			//					up: {
			//						contentrefresh: '正在加载...',
			//						callback: list.pullupRefresh,
			//						contentnomore: '没有更多数据了'
			//					}
			//				}
			//			});
			list.pulldownRefresh();
		},
		bind: function() {
			$('.searchValue').on('click', function() {
				var year = new Date().getFullYear();
				var dPicker = new mui.DtPicker({
					"type": "month",
					"beginYear": 1900,
					"endYear": year
				});
				dPicker.show(function(rs) {
					list.date = rs.text;
					$('.searchValue').val(rs.text);
				});
			});
			$('.search').on('click', function() {
				list.pulldownRefresh();
			});
			$('.clearSearch').on('click', function() {
				$('.searchValue').val('');
				if(!!list.date) {
					list.date = '';
					list.pulldownRefresh();
				} else {
					list.date = '';
				}
			});
			$('.filter').on('click', 'li', function() {
				list.key = $(this).attr('key');
				list.pulldownRefresh();
				$('.filter li').removeClass('on');
				$(this).addClass('on');
			});
		},
		pulldownRefresh: function() {
			medtapCore.jzz(1);
			list.offset = 1;
			$.ajax({
				url: list.urlBase + list.urlDic[list.key],
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
					//					mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
					medtapCore.jzz(0);
					if(!data.success) {
						alert(data.resultDesc);
						return;
					}
					var dataContent = list.getDataContent(data);
					$('#forDetal').html(list.dealData(dataContent));
				},
				error: function(err) {
					medtapCore.jzz(0);
				}
			});
		},
		//		pullupRefresh: function(){
		//			medtapCore.jzz(1);
		//			list.offset++;
		//			$.ajax({
		//				url: "https://gateway.medtap.cn/service/getShopOrderByMobile",
		//				data: medtapCore.setToken({
		//					wechatId: list.wechatId,
		//					date: list.date
		//				}),
		//				headers: {
		//					'appType': 'wechat'
		//				},
		//				type: 'get',
		//				contentType: "application/json",
		//				async: false,
		//				dataType: 'json',
		//				success: function(data) {
		//					medtapCore.jzz(0);
		//					if(!data.success) {
		//						alert(data.resultDesc);
		//						return;
		//					}
		//					
		//					var dataContent = list.getDataContent(data);
		//					$('#forDetal').append(list.dealData(dataContent));
		//					if(dataContent.length == 0) {
		//						mui.toast('没有更多数据了');
		//						mui('#pullrefresh').pullRefresh().refresh(true);
		//					}
		//					mui('#pullrefresh').pullRefresh().endPullupToRefresh(dataContent.length == 0);
		//				},
		//				error: function(err) {
		//					medtapCore.jzz(0);
		//				}
		//			});
		//		},
		dealData: function(list) {
			var str = '';
			for(var i = 0, len = list.length; i < len; i++) {
				var item = list[i];
				var goods = '';
				[].forEach.call(item.goods, function(good) {
					goods += '<p class="goodsInfo"><span class="goodsName">' + good.goods_name + '</span><span class="goodsAmount">X' + good.amount + '<span></p>';
				});
				str += '<li class="section">' +
					'<div>' +
					'<p><span>手机号码: </span><span class="value">' + (!!item.mobile ? item.mobile.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3') : '') + '</span></p>' +
					'<p><span>支付时间: </span><span class="value">' + item.payTime + '</span></p>' +
					'<p><span>购物金额: </span><span class="value">' + (!!item.totalFee ? new Number(item.totalFee).toFixed(2) : '') + '元</span></p>' +
					'<p><span>商品信息：<span></p>' +
					goods +
					'</div>' +
					'</li>';
			}
			return str;
		},
		getDataContent: function(data) {
			var dataContent;
			if(!!list.date) {
				$('.summary-desc-1').text('月订单');
				$('.summary-desc-2').text('月订单明细');
			} else {
				$('.summary-desc-1').text('订单总览');
				$('.summary-desc-2').text('订单明细');
			}
			dataContent = data.content.shopOrder;
			$('.allFee').text((!!data.content.hasOwnProperty('allFee') ? new Number(data.content.allFee).toFixed(2) : '') + '元');
			$('.shopOrder').text(data.content.shopOrder.length);
			return dataContent;
		}
	};

	list.init();
	list.bind();
});