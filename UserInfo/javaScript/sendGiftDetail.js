define(['zepto', 'medtapCore', 'mui'], function($, medtapCore, mui) {
	var consult = {
		orderType: null,
		typeDic: {
			'JZJY': '精准就医',
			'ZGJY': '尊贵就医',
			'DJJY': '顶级就医'
		},
		init: function(){
			consult.getData();
		},
		statusDic: {
			'0': '未支付',
			'1': '已支付',
			'2': '已无效',
			'3': '已取消',
			'4': '申请中'
		},
		getData: function(){
			medtapCore.jzz(1);
			$.ajax({
//				url: 'https://devgw.medtap.cn/common/getPrecisionMedicalById',
				url: 'https://gateway.medtap.cn/app/order/getOrderByOrderSn',
				contentType: "application/json",
				type: 'get',
				async: true,
				dataType: 'json',
				data: medtapCore.setToken({
					orderSn: medtapCore.getRequest('id')
				}),
				success: function(data) {
					medtapCore.jzz(0);
					if(data.success){
						data = data.content;
						if(!!data.status){
							$('.by-status[status="' + data.status + '"]').show();
						}
						var desc = JSON.parse(data.orderDesc);
						consult.bind();
						$('#orderSn').val(data.orderSn);
						$('#orderType').val('赠送礼物(' + desc.presentName + ')');
						$('#status').val(consult.statusDic[data.status]);
						$('#createTime').val(data.createTime);
						$('#doctorName').val(desc.doctorName);
						$('#presentScore').val(desc.presentScore);
						$('#presentContent').val(desc.hasOwnProperty('presentContent') ? desc.presentContent : '');
					}else{
						mui.toast('获取详情失败');
					}
				},
				error: function(err){
					medtapCore.jzz(0);
					console.log(err);
				}
			});
		},
		bind: function(){
			$('.cancel').on('click', function(){
				if(!confirm('确定要取消订单吗？')){
					return;
				}
				$.ajax({
					url: 'https://gateway.medtap.cn/app/order/updateConsultOrder',
					contentType: "application/json",
					type: 'post',
					async: true,
					dataType: 'json',
					data: JSON.stringify(medtapCore.setToken({
						orderSn: medtapCore.getRequest('id'),
						status: '3'
					})),
					success: function(data) {
						medtapCore.jzz(0);
						if(data.success) {
							alert('取消订单成功');
							window.location.reload();
						} else {
							alert(data.resultCode);
						}
					},
					error: function(err) {
						medtapCore.jzz(0);
						console.log(err);
					}
				});	
			});
			$('.pay').on('click', function(){
				//测试
//				window.location.href = 'https://review-formal.iplusmed.com/wxPayDev/wxPay/wxPay.html?orderId=' + medtapCore.getRequest('id') + '&wechatId=' + medtapCore.getRequest('wechatId');
//				正式
				window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/wxPay/wxPay.html?v=1.0.0&orderId=' + medtapCore.getRequest('id') + '&wechatId=' + medtapCore.getRequest('wechatId');
			});
		}
	};
	
	consult.init();
//	consult.bind();
});