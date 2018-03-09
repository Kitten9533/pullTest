define(['zepto', 'medtapCore', 'mui'], function($, medtapCore, mui) {
	Date.prototype.format = function(format) {
		var o = {
			"M+": this.getMonth() + 1, //month 
			"d+": this.getDate(), //day 
			"h+": this.getHours(), //hour 
			"m+": this.getMinutes(), //minute 
			"s+": this.getSeconds(), //second 
			"q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
			"S": this.getMilliseconds() //millisecond 
		}
		if(/(y+)/i.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for(var k in o) {
			if(new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	}
	var list = {
		type: medtapCore.getRequest('type'),
		wechatId: medtapCore.getRequest('wechatId'),
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
		classDic: {
			'KACS': 'kacs',
			'SRYS': 'srys',
			'DHZX': 'dhzx',
			'YYZX': 'dhzx',
			'ZZFZ': 'zzfz',
			'ZSLW': 'zslw',
			'SJHYK': 'sjhyk',
			'GNDEYJ': 'gndeyj',
			'MYDD': 'mydd',
			'JTYS': 'jtys', //家庭医生（会员卡中心）订单
			'KJZX': 'kjzx',
			'JZJY': 'jzjy',
			'ZGJY': 'zgjy',
			'DJJY': 'djjy',
			'ZJHZ': 'zjhz',
			'转诊复诊': 'zzfz'
		},
		nameDic: {
			'KACS': '抗癌超市',
			'SRYS': '私人医生',
			'DHZX': '电话咨询',
			'YYZX': '预约咨询',
			'ZZFZ': '转诊复诊',
			'ZSLW': '赠送礼物',
			'SJHYK': '升级会员卡',
			'GNDEYJ': '国内第二意见',
			'MYDD': '名医点刀',
			'JTYS': '家庭医生',
			'KJZX': '快捷咨询',
			'JZJY': '精准就医',
			'ZGJY': '尊贵就医',
			'DJJY': '顶级就医',
			//			'ZJHZ': '专家会诊'
		},
		statusDic: {
//			'0': '待付款',
//			'1': '待咨询',
//			'2': '已无效',
//			'3': '订单取消',
//			'4': '待确认'
						'0': '未支付',
						'1': '已支付',
						'2': '已无效',
						'3': '已取消',
						'4': '申请中'
		},
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
				url: "https://gateway.medtap.cn/app/order/listOrder",
				//				 url: "https://devgw.medtap.cn/app/order/listOrder",
				data: medtapCore.setToken({
					wechatId: list.wechatId,
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
						str += '<li class="none-order">没有更多订单数据</li>';
					}
					str = list.dealData(data);
					$('#list').html(str);
					list.bind();
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
				url: "https://gateway.medtap.cn/app/order/listOrder",
				//				url: "https://devgw.medtap.cn/app/order/listOrder",
				data: medtapCore.setToken({
					wechatId: list.wechatId,
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
					str = list.dealData(data);
					$('#list').append(str);
					list.bind();
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
		},
		dealData: function(data) {
			var content = data.content,
				str = '';
			for(var i = 0, len = content.length; i < len; i++) {
				item = content[i];
				str += list.getTemplateByOrderType(item);
			}
			return str;
		},
		getTemplateByOrderType: function(item) {
			var orderType = item.orderType;
			var desc = JSON.parse(item.orderDesc);
			var str = '';
			switch(orderType) {
				case 'ZZFZ':
					str +=
						'<li class="apply" orderSn="' + item.orderSn + '" title="' + list.nameDic[orderType] + '" orderType="' + orderType + '">' +
						'<div class="li-header">' +
						'<span class="li-title ' + list.classDic[orderType] + '">' + list.nameDic[orderType] + '</span>' +
						'<span class="li-status clearfix">' + list.statusDic[item.status] + '</span>' +
						'</div>' +
						'<div class="li-content no-border-bottom">' +
						'<p class="ellipsis-1">' +
						'<span>医生姓名：</span><span class="doctorName">' + (!!desc.doctorName ? desc.doctorName : '') + '</span><span class="price">' + (!!item.totalFee ? '￥' + item.totalFee : '') + ' </span>' +
						'</p>' +
						'<p class="ellipsis-2">' +
						'<span>简要病情：</span><span>' + (!!desc.diseaseDescription ? desc.diseaseDescription : '') + '</span>' +
						'</p>' +
						'<p class="ellipsis-1">' +
						'<span class="content">留言内容：</span><span>' + (!!desc.expectationHelp ? desc.expectationHelp : '') + '</span>' +
						'</p>' +
						'<p class="ellipsis-1"><span class="time">预约时间：</span><span>' + new Date(desc.customerTime).format('yyyy-MM-dd') + ' ' + (!!desc.weekday ? desc.weekday : '') + ' ' + (!!desc.outpatientTimeType ? desc.outpatientTimeType : '') + '</span></p>' +
						'</div>' +
						//				'<div class="li-footer clearfix">' +
						//				'<span class="pay">付款</span>' +
						//				'<span class="cancel">取消订单</span>' +
						//				'</div>' +
						'</li>';
					break;
				case 'DHZX':
				case 'YYZX':
					str +=
						'<li class="apply" orderSn="' + item.orderSn + '" title="' + list.nameDic[orderType] + '" orderType="' + orderType + '">' +
						'<div class="li-header">' +
						'<span class="li-title ' + list.classDic[orderType] + '">' + list.nameDic[orderType] + '</span>' +
						'<span class="li-status clearfix">' + list.statusDic[item.status] + '</span>' +
						'</div>' +
						'<div class="li-content no-border-bottom">';
					if(orderType == '电话咨询') {
						str += '<p class="ellipsis-1">' +
							'<span>医生姓名：</span><span class="doctorName">' + (!!desc.doctorName ? desc.doctorName : '') + '</span><span class="price">' + (!!item.balanceFee ? '￥' + item.balanceFee : '') + ' </span>' +
							'</p>';
					}
					str +=
						'<p class="ellipsis-2">' +
						'<span>简要病情：</span><span>' + (!!desc.diseaseDescription ? desc.diseaseDescription : '') + '</span>' +
						'</p>' +
						'<p class="ellipsis-1">' +
						'<span class="content">留言内容：</span><span>' + (!!desc.expectationHelp ? desc.expectationHelp : '') + '</span>' +
						'</p>' +
						'<p class="ellipsis-1"><span class="time">服务时间：</span><span></span></p>' +
						'</div>' +
						'</li>';
					break;
				case 'JZJY':
				case 'ZGJY':
				case 'DJJY':
					str +=
						'<li class="apply" orderSn="' + item.orderSn + '" title="' + list.nameDic[orderType] + '" orderType="' + orderType + '">' +
						'<div class="li-header">' +
						'<span class="li-title jyfw">' + list.nameDic[orderType] + '</span>' +
						'<span class="li-status clearfix">' + list.statusDic[item.status] + '</span>' +
						'</div>' +
						'<div class="li-content no-border-bottom">' +
						'<p class="ellipsis-1"><span>订单类型：</span><span class="doctorName">' + list.nameDic[orderType] + '</span><span class="price">' + (!!item.balanceFee ? '￥' + item.balanceFee : '') + '</span><span class="payStatus" style="display:none;">已支付</span></p>' +
						'<p class="ellipsis-2"><span>创建时间：</span><span>' + (!!item.createTime ? item.createTime : '') + '</span></p>' +
						'</div>' +
						'</li>';
					break;
				case '送礼物':
					str +=
						'<li class="apply" orderSn="' + item.orderSn + '" title="' + orderType + '" orderType="' + orderType + '">' +
						'<div class="li-header">' +
						'<span class="li-title jyfw">' + orderType + '</span>' +
						'<span class="li-status clearfix">' + list.statusDic[item.status] + '</span>' +
						'</div>' +
						'<div class="li-content no-border-bottom">' +
						'<p class="ellipsis-1"><span>医生姓名：</span><span class="doctorName">' + (!!desc.doctorName ? desc.doctorName : '') + '</span></p>' +
						'<p class="ellipsis-1"><span>礼物类型：</span><span class="doctorName">' + list.giftNameDic[desc.giftId] + '</span><span class="price">' + (!!item.payFee ? '￥' + item.payFee : '') + '</span><span class="payStatus" style="display:none;">已支付</span></p>' +
						'<p class="ellipsis-2"><span>提交时间：</span><span>' + (!!item.createTime ? item.createTime : '') + '</span></p>' +
						'</div>' +
						'</li>';
				default:
					break;
			}

			return str;
		},
		bind: function() {
			$('#list').on('tap', 'li', function() {
				var title = $(this).attr('title'),
					id = $(this).attr('ordersn'),
					type = $(this).attr('ordertype');
				switch(type) {
					case 'DHZX':
					case 'YYZX':
						window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/TelConsultation/pages/teConsultationDetail.html?v=1.0.0&type=wx&id=' + id + '&title=' + title + '&wechatId=' + medtapCore.getRequest('wechatId');
						break;
					case 'JZJY':
					case 'ZGJY':
					case 'DJJY':
						window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/MedicalService/medicaDetail.html?v=1.0.0&type=wx&id=' + id + '&title=' + title + '&wechatId=' + medtapCore.getRequest('wechatId');
						break;
					case 'ZZFZ':
						window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/ApplyReferral/pages/applyDetail.html?v=1.0.0&type=wx&id=' + id + '&title=' + title + '&wechatId=' + medtapCore.getRequest('wechatId');
						break;
					case '送礼物':
						window.location.href = '../pages/sendGiftDetail.html?v=1.0.0&type=wx&id=' + id + '&wechatId=' + medtapCore.getRequest('wechatId');
						break;
					default:
						break;
				}
			});

		}
	};

	list.init();
});