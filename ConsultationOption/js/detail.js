define(['zepto', 'medtapCore', 'mui', 'mui.picker', 'mui.zoom', 'mui.previewimage'], function($, medtapCore, mui) {
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
			'0': '未支付',
			'1': '已支付',
			'2': '已无效',
			'3': '已取消',
			'4': '申请中'
		},
		init: function() {
			medtapCore.jzz(1);
			if(!!medtapCore.getRequest('id') == false) {
				alert('未能获取到详情页面的id');
			}
			$.ajax({
				url: 'https://devgw.medtap.cn/service/consultation/getConsultationApply',
				contentType: "application/json",
				type: 'get',
				async: true,
				dataType: 'json',
				data: medtapCore.setToken({
					applySn: medtapCore.getRequest('id')
				}),
				success: function(data) {
					medtapCore.jzz(0);
					if(data.success) {
						var data = data.content.consultationApplyVO;
						$('#contactFlg').val(data.hasOwnProperty('status') ? data.status.value : '');
						if(data.hasOwnProperty('recommend') && data.recommend == true){
							$('.recommend').show();
							$('.no-recommend').hide();
						}else{
							$('.recommend').hide();
							$('.no-recommend').show();
						}
//						if(data.hasOwnProperty('firstDoctorId')){
							$('#firstDoctorName').val(!!data.firstDoctorName ? data.firstDoctorName : '');
//							$('#firstDoctorId').attr('doctorid', data.firstDoctorId);
//						}
//						if(data.hasOwnProperty('secondDoctorId')){
							$('#secondDoctorName').val(!!data.secondDoctorName ? data.secondDoctorName : '');
//							$('#secondDoctorId').attr('doctorid', data.secondDoctorId);
//						}
						if(data.hasOwnProperty('expectedCityName')){
							$('#cityName').val(!!data.expectedCityName ? data.expectedCityName : '');
						}
						if(data.hasOwnProperty('expertLevel')){
							$('#expertLevel').val(!!data.expertLevel ? data.expertLevel : '');
						}
						$('#consultType').val(!!data.consultType ? data.consultType : '');
						$('#status').val(!!data.status ? detail.statusDic[data.status] : '');
						$('#createTime').val(!!data.createTime ? data.createTime : '');
						$('#diseaseName').val(!!data.diseaseName ? data.diseaseName : '');
//						$('#mobile').val(!!data.mobile ? data.mobile : '');
						$('#expectedTime').val(!!data.expectedTime ? data.expectedTime : '');
						$('#doctorName').val(!!data.ownDoctorName ? data.ownDoctorName : '');
						$('#hospitalName').val(!!data.ownHospitalName ? data.ownHospitalName : '');
						$('#contactName').val(!!data.contactName ? data.contactName : '');
						$('#contactMobile').val(!!data.contactMobile ? data.contactMobile : '');
						$('#diseaseDescription').val(!!data.diseaseDesc ? data.diseaseDesc : '');
						$('#helpRequirement').val(!!data.helpRequirement ? data.helpRequirement : '');
						$('#expectationHelp').val(!!data.expectationHelp ? data.expectationHelp : '');
						if(!!data.status){
							$('.by-status[status="' + data.status.key + '"]').show();
						}
						detail.bind();
						if(data.hasOwnProperty('picUrl')){
							var pics = data.picUrl,
								str = '';
							for(var i=0, len=pics.length; i<len; i++){
								str += 
									'<div class="mui-col-sm-3 mui-col-xs-3">' + 
										'<img src="' + pics[i] + '" data-preview-src="" data-preview-group="1" alt="显示失败了"/>' + 
									'</div>';
							}
							if(pics.length > 0){
								$('.img-box').html(str);
								mui.previewImage();
							}
						}
						
						
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
			$('.contact').on('click', function(){
				window.location.href = 'tel:4000059900';
			});
			$('.cancel').on('click', function(){
				if(!confirm('确定要取消订单吗？')){
					return;
				}
				var postData = medtapCore.getPostData();
				postData.applySn = medtapCore.getRequest('id');
				$.ajax({
					url: 'https://devgw.medtap.cn/service/apply/cancelApply',
					contentType: "application/json",
					type: 'get',
					async: true,
					dataType: 'json',
					headers: medtapCore.getHeaders(),
					data: medtapCore.setToken(postData),
					success: function(data) {
						medtapCore.jzz(0);
						if(data.success) {
							alert('取消成功');
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
//			$('.pay').on('click', function(){
//				//测试
////				window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/wxPay/wxPay.html?orderId=' + medtapCore.getRequest('id') + '&wechatId=' + medtapCore.getRequest('wechatId');
////				正式
//				window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/wxPay/wxPay.html?v=1.0.0&orderId=' + medtapCore.getRequest('id') + '&wechatId=' + medtapCore.getRequest('wechatId');
			});
		}
	};

	detail.init();
//	detail.bind();
});