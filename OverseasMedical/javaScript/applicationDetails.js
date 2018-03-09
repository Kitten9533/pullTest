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

	var detial = {
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
		init: function() {
			medtapCore.jzz(1);
			if(!!medtapCore.getRequest('id') == false) {
				alert('未能获取到详情页面的id');
			}
			$.ajax({
				url: 'https://devgw.medtap.cn/service/drug/getDrugPurchase',
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
						var content = data.content.drugPurchaseVO;
						$('#applyType').val(detial.typeDic[content.applyType]);
						$('#createTime').val(new Date(content.createTime).Format('yyyy-MM-dd hh:mm'));
						$('#medicineName').val(!!content.medicineName ? content.medicineName : '');
						$('#medicineForm').val(!!content.formulation ? content.formulation : '');
						$('#manufacturer').val(!!content.manufacturer ? content.manufacturer : '');
						$('#require').val(!!content.requirement ? content.requirement : '')
						$('#chargeWillFlg').val(!!content.chargeWill ? '是' : '否');
						$('#contactName').val(!!content.contactName ? content.contactName : '');
						$('#contactMobile').val(!!content.contactMobile ? content.contactMobile : '');
						$('#remark').val(!!content.remark ? content.remark : '');
					} else {
						alert(data.resultCode);
					}
				},
				error: function(err) {
					medtapCore.jzz(0);
					console.log(err);
				}
			});

		}
	};

	detial.init();
});