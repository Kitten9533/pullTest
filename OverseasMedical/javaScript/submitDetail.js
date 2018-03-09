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
			'JYGH': '就医规划'
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
				url: 'https://devgw.medtap.cn/service/other/getOtherApply',
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
						var content = data.content;
						$('#applyType').val(detail.typeDic[content.applyType]);
						$('#status').val(detail.statusDic[content.applyStatus]);
						$('#createTime').val(content.createTime);
						$('#userName').val(content.contactName);
						$('#mobile').val(content.contactMobile);
						if(!!content.status){
							$('.by-status[status="' + content.status.key + '"]').show();
						}
						detail.bind();
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
				if(!confirm('确定要取消申请吗？')){
					return;
				}
				var postData = medtapCore.getPostData();
				postData.applySn = medtapCore.getRequest('id');
				$.ajax({
					url: 'https://devgw.medtap.cn/service/cancelApply',
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