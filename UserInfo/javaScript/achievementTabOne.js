define(['zepto', 'medtapCore', 'mui', 'mui.picker'], function($, medtapCore, mui) {
	var list = {
		offset: 1,
		limit: 10,
		wechatId: medtapCore.getRequest('wechatId'),
		date: '',
		filterDic: {
			'type1': 0,
			'type2': 2,
			'type3': 1,
		},
		userType: 0,
		init: function(){
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
		bind: function(){
			$('.searchValue').on('click', function(){
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
			$('.search').on('click', function(){
				list.pulldownRefresh();
			});
			$('.clearSearch').on('click', function(){
				$('.searchValue').val('');
				if(!!list.date){
					list.date = '';
					list.pulldownRefresh();
				}else{
					list.date = '';
				}
			});
			$('.filterBox').on('click', 'p', function(){
				$('.filter').text('筛选:' + $(this).text());
				$('.filter, .filterBox').removeClass('on');
				//TODO 修改 filter 
				list.userType = list.filterDic[$(this).attr('key')];
				list.pulldownRefresh();
			});
			$('.filter').on('click', function(){
				var elFilter = $('.filter');
				!!elFilter.hasClass('on') 
					? $('.filter, .filterBox').removeClass('on')
					: $('.filter, .filterBox').addClass('on');
			})
		},
		pulldownRefresh: function(){
			medtapCore.jzz(1);
			list.offset = 1;
			$.ajax({
				url: "https://gateway.medtap.cn/service/listUserByOriginInfo",
				data: medtapCore.setToken({
					wechatId: list.wechatId,
//					offset: list.offset,
//					limit: list.limit,
					date: list.date,
					userType: list.userType
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
		pullupRefresh: function(){
			medtapCore.jzz(1);
			list.offset++;
			$.ajax({
				url: "https://gateway.medtap.cn/service/listUserByOriginInfo",
				data: medtapCore.setToken({
					wechatId: list.wechatId,
					offset: list.offset,
					limit: list.limit,
					date: list.date,
					userType: list.userType
				}),
				headers: {
					'appType': 'wechat'
				},
				type: 'get',
				contentType: "application/json",
				async: true,
				dataType: 'json',
				success: function(data) {
					medtapCore.jzz(0);
					if(!data.success) {
						alert(data.resultDesc);
						return;
					}
					
					var dataContent = list.getDataContent(data);
					$('#forDetal').append(list.dealData(dataContent));
					if(dataContent.length == 0) {
						mui.toast('没有更多数据了');
						mui('#pullrefresh').pullRefresh().refresh(true);
					}
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(dataContent.length == 0);
				},
				error: function(err) {
					medtapCore.jzz(0);
				}
			});
		},
		dealData: function(list){
			var str = '';
			for(var i=0, len=list.length; i < len; i++){
				var item = list[i],
					userTypeText = '';
				if(!!item.userType && item.userType == 2){
					userTypeText = ' agentFlg';
				}
				str +=	'<li>' + 
							'<div class="box">' + 
								'<p class="val-desc"><span>微信昵称: </span><span class="value' + userTypeText + '">' + (!!item.nickname ? item.nickname : '') + '</span></p>' +
								'<p class="val-desc"><span>手机号码: </span><span class="value">' + item.mobile.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3') + '</span></p>' + 
								'<p class="val-desc"><span>注册时间: </span><span class="value">' + item.createTime + '</span></p>' + 
//								'<p><span>购物金额: </span>' +  + '</p> + 
							'</div>' +
						'</li>';
			}
			return str;
		},
		getDataContent: function(data){
			var dataContent;
			if(!!list.date){
				$('.summary-desc-1').text('月注册');
				$('.summary-desc-2').text('月业绩明细');
				dataContent = data.content.monthPerformance;
				$('.monthScan').text(data.content.monthScan);
				$('.monthValid').text(data.content.monthValid);
			}else{
				$('.summary-desc-1').text('业绩总览');
				$('.summary-desc-2').text('业绩明细');
				dataContent = data.content.allPerformance;
				$('.monthScan').text(data.content.scan);
				$('.monthValid').text(data.content.valid);
			}
			return dataContent;
		}
	};
	
	list.init();
	list.bind();
});