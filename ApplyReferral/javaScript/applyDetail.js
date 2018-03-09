define(['zepto', 'medtapCore'], function($, medtapCore) {
	Date.prototype.Format = function(fmt) { //author: meizz 
		var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"h+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
		};
		if(/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

	var detail = {
		typeDic: {
			'HWYL': '海外医疗',
			'ZLFXPG': '肿瘤风险评估',
			'QQDEYJ': '全球第二意见',
			'FMJY': '赴美就医',
			'RBZZZL': '日本质子治疗',
			'GAXYZL': '港澳新药治疗',
			'QQZY': '全球找药',
			'GNZY': '国内找药'
		},
		statusDic: {
			'0': '申请中',
			'1': '审核通过',
			'2': '审核不通过',
			'3': '已完成',
			'4': '已取消',
			'5': '已删除'
		},
		init: function() {
			medtapCore.jzz(1);
			if(!!medtapCore.getRequest('id') == false) {
				alert('未能获取到详情页面的id');
			}
			$.ajax({
				url: 'https://devgw.medtap.cn/service/referral/getReferralApply',
//				url: 'http://192.168.8.120:6020/service/referral/getReferralApply',
				contentType: "application/json",
				type: 'get',
				async: true,
				dataType: 'json',
				data: medtapCore.setToken({
					applySn: medtapCore.getRequest('id')
				}),
				success: function(data) {
					medtapCore.jzz(0);
//					return;
					if(data.success) {
						var data = data.content.referralVO;
//						if(!!data.status){
//							$('#status').val(detail.statusDic[data.status]);
//							$('.by-status[status="' + data.status + '"]').show();
//							consult.bind();
//						}
						$('#status').val(data.hasOwnProperty('status') ? data.status.value : '');
						$('#orderSn').val(!!data.applySn ? data.applySn : '');
						$('#consultType').val('转诊复诊');
						$('#createTime').val(!!data.createTime ? new Date(data.createTime).Format('yyyy-MM-dd hh:mm:ss') : '');
						$('#mobile').val(!!data.mobile ? data.mobile : '');
						$('#doctorName').val(!!data.doctorName ? data.doctorName : '未确定');
						$('#customerTime').val(!!data.referralTime ? data.referralTime : '');
						$('#diseaseDescription').val(!!data.diseaseDesc ? data.diseaseDesc : '');
						$('#expectationHelp').val(!!data.expectationHelp ? data.expectationHelp : '');
					} else {
						alert(data.resultCode);
					}
				},
				error: function(err) {
					medtapCore.jzz(0);
					console.log(err);
				}
			});

		},
		bind: function(){
//			$('.cancel').on('click', function(){
//				if(!confirm('确定要取消订单吗？')){
//					return;
//				}
//				$.ajax({
//					url: 'https://gateway.medtap.cn/app/order/updateConsultOrder',
//					contentType: "application/json",
//					type: 'post',
//					async: true,
//					dataType: 'json',
//					data: JSON.stringify(medtapCore.setToken({
//						orderSn: medtapCore.getRequest('id'),
//						status: '3'
//					})),
//					success: function(data) {
//						medtapCore.jzz(0);
//						if(data.success) {
//							alert('取消订单成功');
//							window.location.reload();
//						} else {
//							alert(data.resultCode);
//						}
//					},
//					error: function(err) {
//						medtapCore.jzz(0);
//						console.log(err);
//					}
//				});	
//			});
			$('.pay').on('click', function(){
				//测试
//				window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/wxPay/wxPay.html?orderId=' + medtapCore.getRequest('id') + '&wechatId=' + medtapCore.getRequest('wechatId');
//				正式
				window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/wxPay/wxPay.html?v=1.0.0&orderId=' + medtapCore.getRequest('id') + '&wechatId=' + medtapCore.getRequest('wechatId');
			});
		}
	};

	detail.init();
	detail.bind();
});