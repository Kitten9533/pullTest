define(['zepto', 'medtapCore', 'mui'], function($, medtapCore, mui) {
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
		pulldownRefresh: function() {
			medtapCore.jzz(1);
			list.offset = 1;
			$.ajax({
				url: "https://gateway.medtap.cn/common/listApplyByUserId",
				data: JSON.stringify(medtapCore.setToken({
					wechatId: list.wechatId,
					offset: list.offset,
					limit: list.limit
				})),
				type: 'post',
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
						str +=
							'<div class="section" v-else>' +
							'<p class="desc none-question">暂无我的申请</p>' +
							'</div>';
					}
					str = list.dealData(content);
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
				url: "https://gateway.medtap.cn/common/listApplyByUserId",
				//				url: "http://192.168.8.199:6020/common/listApplyByUserId",
				data: JSON.stringify(medtapCore.setToken({
					wechatId: list.wechatId,
					offset: list.offset,
					limit: list.limit
				})),
				headers: {
					'appType': 'wechat'
				},
				type: 'post',
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
					str = list.dealData(content);
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
		typeDic: {
			'QQZY': '全球找药',
			'GNZY': '国内找药',
			'QQDEYJ': '全球第二意见',
			'FMJY': '赴美就医',
			'RBZZZL': '日本质子治疗',
			'GAXYZL': '港澳新药治疗',
			'XYMFY': '新药免费用',
			'LCYJZM': '临床研究招募',
			'ZLFXPG': '肿瘤风险评估',
			'JYGH': '就医规划',
			'GNDEYJ': '国内第二意见',
			'MYDD': '名医点刀',
			'ZZFZ': '转诊复诊'
		},
		bind: function() {
			$('#list').on('tap', 'li', function(){
//				window.location.href = '';
				var type = $(this).attr('ordertype'),
					id = $(this).attr('ordersn');
				switch(type){
					case 'QQDEYJ':
					case 'FMJY': 
					case 'RBZZZL':
					case 'GAXYZL': 
					case 'ZLFXPG': 
					case 'JYGH': 
						window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/medicalPlanning/pages/applyDetail.html?v=1.0.0&type=wx&id=' + id + '&title=' + list.typeDic[type];
						break;
					case 'QQZY':
					case 'GNZY':
						window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/OverseasMedical/applicationDetails.html?v=1.0.0&type=wx&id=' + id + '&title=' + list.typeDic[type];
						break;
					case 'XYMFY': 
					case 'LCYJZM': 
						window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/ClinicalResearch/pages/applyNewDrugDetail.html?v=1.0.0&type=wx&id=' + id + '&title=' + list.typeDic[type];
						break;
					case 'GNDEYJ': 
					case 'MYDD': 
						window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/ConsultationOption/detail.html?v=1.0.0&type=wx&id=' + id + '&title=' + list.typeDic[type];
//						window.location.href = 'http://192.168.8.181:8020/2017.10.09/webPageReview/TestModule/TstCommon/pages/ConsultationOption/detail.html?type=wx&id=' + id + '&title=' + list.typeDic[type];
						break;
					case 'ZZFZ':
						window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/ApplyReferral/pages/applyDetail.html?v=1.0.0&type=wx&id=' + id + '&title=' + list.typeDic[type];
						break;
					default:
						break;
				}
			});
		},
		iconDic: {
			'QQZY': '../images/my_apply_icon_global@2x.png',
			'GNZY': '../images/my_apply_icon_china@2x.png',
			'QQDEYJ': '../images/service_icon_professional@2x.png',
			'FMJY': '../images/my_apply_icon_usa@2x.png',
			'RBZZZL': '../images/my_apply_icon_japan@2x.png',
			'GAXYZL': '../images/my_apply_icon_hk@2x.png',
			'XYMFY': '../images/icon_content@2x.png',
			'LCYJZM': '../images/service_icon_search@2x.png',
			'ZLFXPG': '../images/service_icon_prevent@2x.png',
			'JYGH': '../images/doctor_home_icon_introduce@2x.png',
			'GNDEYJ': '../images/service_icon_professional@2x.png',
			'MYDD': '../images/service_icon_professional@2x.png',
			'ZZFZ': '../images/icon_referral_none@2x.png',
		},
		dealData: function(data) {
			var str = '';
			for(var i = 0, len = data.length; i < len; i++) {
				item = data[i];
				var type = item.orderType;
				var desc = JSON.parse(item.orderDesc);
				if(type == 'QQZY' || type == 'GNZY') {
					str +=
						'<li ordertype="' + type + '" ordersn="' + item.orderSn + '">' +
						'<div class="apply">' +
						'<span class="applyType"><img src="' + list.iconDic[item.orderType] + '"/></span>' +
						'<span class="applyName">' + list.typeDic[item.orderType] + '</span>' +
						'<span class="applyTime">' + item.createTime + '</span>' +
						'</div>' +
						'<div class="applyInfo">' +
						'<p>药品名:<span class="drugName">' + desc.medicineName + '</span></p>' +
						'<p>剂型:<span class="drugType">' + desc.medicineForm + '</span></p>' +
						'</div>' +
						'</li>';
				} else if(type == 'QQDEYJ' || type == 'FMJY' || type == 'RBZZZL' || type == 'GAXYZL' || type == 'ZLFXPG' || type == 'JYGH') {
					str +=
						'<li ordertype="' + type + '" ordersn="' + item.orderSn + '">' +
						'<div class="apply">' +
						'<span class="applyType"><img src="' + list.iconDic[item.orderType] + '"/></span>' +
						'<span class="applyName">' + list.typeDic[item.orderType] + '</span>' +
						'<span class="applyTime">' + item.createTime + '</span>' +
						'</div>' +
						'<div class="applyInfo">' +
						'<p>联系人:<span class="drugName">' + (!!desc.contactName ? desc.contactName : '') + '</span></p>' +
						'<p>联系电话:<span class="drugType">' + (!!desc.contactMobile ? desc.contactMobile : '') + '</span></p>' +
						'</div>' +
						'</li>';
				} else if(type == 'XYMFY' || type == 'LCYJZM') {
					str +=
						'<li ordertype="' + type + '" ordersn="' + item.orderSn + '">' +
						'<div class="apply">' +
						'<span class="applyType"><img src="' + list.iconDic[item.orderType] + '"/></span>' +
						'<span class="applyName">' + list.typeDic[item.orderType] + '</span>' +
						'<span class="applyTime">' + item.createTime + '</span>' +
						'</div>' +
						'<div class="applyInfo">' +
						'<p>联系人:<span class="drugName">' + (!!desc.contactName ? desc.contactName : '') + '</span></p>' +
						'<p>联系电话:<span class="drugType">' + (!!desc.contactMobile ? desc.contactMobile : '') + '</span></p>' +
						'</div>' +
						'</li>';
				} else if(type == 'GNDEYJ' || type == 'MYDD'){
					str += 
						'<li ordertype="' + type + '" ordersn="' + item.orderSn + '">' +
						'<div class="apply">' +
						'<span class="applyType"><img src="' + list.iconDic[item.orderType] + '"/></span>' +
						'<span class="applyName">' + list.typeDic[item.orderType] + '</span>' +
						'<span class="applyTime">' + item.createTime + '</span>' +
						'</div>' +
						'<div class="applyInfo">' +
						'<p>联系人:<span class="drugName">' + (!!desc.contactName ? desc.contactName : '') + '</span></p>' +
						'<p>联系电话:<span class="drugType">' + (!!desc.contactMobile ? desc.contactMobile : '') + '</span></p>' +
						'</div>' +
						'</li>';
				} else if(type == 'ZZFZ'){
					str += 
						'<li ordertype="' + type + '" ordersn="' + item.orderSn + '">' +
						'<div class="apply">' +
						'<span class="applyType"><img src="' + list.iconDic[item.orderType] + '"/></span>' +
						'<span class="applyName">' + list.typeDic[item.orderType] + '</span>' +
						'<span class="applyTime">' + item.createTime + '</span>' +
						'</div>' +
						'<div class="applyInfo">' +
						'<p>医生姓名:<span class="drugName">' + (!!desc.doctorName ? desc.doctorName : '') + '</span></p>' +
						'<p>简要病情:<span class="drugType">' + (!!desc.diseaseDescription ? desc.diseaseDescription : '') + '</span></p>' +
						'<p>留言内容:<span class="drugType">' + (!!desc.expectationHelp ? desc.expectationHelp : '') + '</span></p>' +
						'<p>预约时间:<span class="drugType">' + desc.customerTime + ' ' + ' ' + desc.weekday + ' ' + desc.outpatientTimeType + '</span></p>' +
						'</div>' +
						'</li>';
				}
			}
			
			return str;
		}
	};

	list.init();
});