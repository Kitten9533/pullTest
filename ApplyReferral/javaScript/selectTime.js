define(['zepto', 'medtap'], function($, medtap) {
	var timer = {
		doctorId: medtap.getRequest('doctorId'),
		hospital: medtap.getRequest('hospital'),
		price: '',
		doctorName: medtap.getRequest('doctorName'),
		wechatId: medtap.getRequest('wechatId'),

		//页面初始化方法
		init: function() {
			timer.getReferralTime();
		},
		//获取当前医生的转诊排班
		getReferralTime: function() {
			$.ajax({
				//				url: 'http://192.168.8.14:6020/app/doctor/getDoctorOutpatientByDoctorId',
				url: 'https://gateway.medtap.cn/app/doctor/getDoctorOutpatientByDoctorId',
				type: 'get',
				headers: {
					appType: 'wechat'
				},
				data: medtap.setToken({
					weekNum: 2,
					doctorId: timer.doctorId
				}),
				success: function(data) {
					if(data.success) {
						var content = data.content;
						if(content.length <= 0) {
							$('.timerWrap').html('<li class="mui-table-view-cell" style="text-align:center;">暂无数据</li>');
							return;
						}
						timer.hospital = content[0].outpatientHospital;
						//timer.doctorName = content[0];
						var html = '';
						for(var i = 0; i < content.length; i++) {
							html += '<li class="mui-table-view-cell go">' +
								'<a class="mui-navigate-right">' +
								'<span class="year">' + content[i].outpatientInfo + '</span>' +
								'<span class="applyType">' + (!!content[i].outpatientType ? content[i].outpatientType : '') + '</span>' +
								'<span class="price">' + (content[i].hasOwnProperty('price') ? content[i].price : '') + '</span>' +
								' </a>' +
								'</li>';
						}
						$('.timerWrap').html(html);
					} else {

					}
				}
			})
		},
		//跳转至申请表单
		goApplyTable: function() {
			$('.timerWrap').on('click', 'li.go', function() {
				var time = !!$(this).find('.year').text() ? $(this).find('.year').text() : '',
					type = !!$(this).find('.applyType').text() ? $(this).find('.applyType').text() : '',
					price = !!$(this).find('.price').text() ? $(this).find('.price').text() : '';
				if(!!type == false || !!price == false) {
					alert('该医生未设置转诊复诊类型或价格，无法提交订单');
				} else {
					window.location.href = '../pages/applyReferral.html?v=1.0.0&time=' + time + '&type=' + type + '&doctorName=' + timer.doctorName + '&doctorId=' + timer.doctorId + '&hospital=' + timer.hospital + '&price=' + price + '&wechatId=' + timer.wechatId;
				}
			})
		}
	}
	timer.init();
	timer.goApplyTable();
})