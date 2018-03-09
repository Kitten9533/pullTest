define(['zepto', 'medtapCore', 'mui', 'mui.zoom', 'mui.picker', 'mui.previewimage'], function($, medtapCore, mui) {
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
			'GNZY': '国内找药',
			'XYMFY': '新药免费用',
			'LCYJZM': '临床研究招募'
		},
		statusDic: {
			"0": "申请中",
			"1": "服务中",
			"2": "已完成",
			"4": "已取消"
		},
		init: function() {
			medtapCore.jzz(1);
			if(!!medtapCore.getRequest('id') == false) {
				alert('未能获取到详情页面的id');
			}
			$.ajax({
				url: 'https://devgw.medtap.cn/service/clinical/getClinicalResearch',
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
						var content = data.content.clinicalResearchVO;
						$('#applyType').val(content.serviceType.value);
						$('#createTime').val(content.createTime);
						$('.userName').val(!!content.patientName ? content.patientName : '');
						$('.userGender').val(!!content.sex ? content.sex : '');
						$('.userAge').val(!!content.age ? content.age : '');
						$('.disease').val(!!content.diseaseName ? content.diseaseName : '');
						$('.drug').val(!!content.willMedicine ? content.willMedicine : '');
						$('.contactUser').val(!!content.contactName ? content.contactName : '');
						$('.contactPhone').val(!!content.contactMobile ? content.contactMobile : '');
						$('#orderStatus').val(content.hasOwnProperty('status') ? content.status.value : '');
						$('#textarea').val(!!content.remark ? content.remark : '');
						if(content.hasOwnProperty('picUrl')){
							var pics = content.picUrl,
								str = '';
							for(var i=0, len=pics.length; i<len; i++){
								str += 
									'<div class="mui-col-sm-3 mui-col-xs-3">' + 
										'<img src="' + pics[i] + '" data-preview-src="" data-preview-group="1" alt="显示失败了"/>' + 
									'</div>';
							}
							$('.img-box').html(str);
							mui.previewImage();
						}
						if(!!content.status){
							$('.by-status[status="' + content.status.key + '"]').show();
						}
						detail.bind();
					} else {
						alert(data.resultDesc);
					}
				},
				error: function(err) {
					medtapCore.jzz(0);
				}
			});
		},
		bind: function(){
			$('.contact').on('click', function(){
				window.location.href = 'tel:4000059900';
			});
			$('.cancel').on('click', function(){
				if(!confirm('确定要取消申请吗？')){
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
			});
		}
	};

	detail.init();
});