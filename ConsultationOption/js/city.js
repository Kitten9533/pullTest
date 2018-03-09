require(['zepto', 'yjyInit'], function($) {

	var theCity;
	$.ajax({
		url: "https://gateway.medtap.cn/base/initCitys",
		contentType: "application/json",
		data: $.setToken(),
		type: 'get',
		async: true,
		dataType: 'json',
		success: function(data) {
			if(data.success) {
				theCity = data.content;
				var str = '';
				[].forEach.call(theCity, function(obj) {
					str += '<li provinceId="' + obj.provinceId + '">' + obj.name + '</li>';
				});
				$('#provincialList').html(str);

				var theId = JSON.parse(localStorage.inf2).provinceId;
				if(theId) {
					$('#provincialList li[provinceId="' + theId + '"]').click();
				} else {
					$("#provincialList li").eq(0).addClass("on").click();
				}
			}
		}
	});

	var height = $(window).height(),
		provincialList = $('#provincialList'),
		cityList = $('#cityList');
	provincialList.css("height", height);
	cityList.css("height", height);

	provincialList.on("click", "li", function() {
		var ID = $(this).attr('provinceId'),
			html = '';
		for(var i = 0, len = theCity.length; i < len; i++) {
			if(ID == theCity[i].provinceId) {
				var provinceName = theCity[i].name;
				for(var j = 0, len2 = theCity[i].city.length; j < len2; j++) {
					var item = theCity[i].city[j],
						name = '';
					if(provinceName.indexOf('北京')>-1 || provinceName.indexOf('天津')>-1 || provinceName.indexOf('重庆')>-1 || provinceName.indexOf('上海')>-1){
						name = provinceName + ' ' + item.name;
					}else{
						name = item.name;
					}
					html += '<li parentid="' + ID + '" cityid=" ' + item.cityId + '">' + name + '</li>';
				}
			}
		}
		$('#cityList').html(html);
		$(this).addClass("on").siblings().removeClass("on");
	});
	cityList.on("click", "li", function() {
		var name = $(this).text(),
			pid = $(this).attr("parentId"),
			cid = $(this).attr("cityId"),
			inf2 = JSON.parse(localStorage.inf2);
		inf2.cityName = name;
		inf2.provinceId = pid;
		inf2.cityId = cid;
		inf2.isShow = 1;
		localStorage.inf2 = JSON.stringify(inf2);

		if(typeof WebAPI == "undefined") {
			//微信下
//						window.location.replace('http://192.168.8.181:8020/2017.10.09/webPageReview/TestModule/TstCommon/pages/ConsultationOption/huizhen.html?access=' + $.getRequest("access"));
			window.location.replace('https://review-formal.iplusmed.com/wxPayPrd/ConsultationOption/huizhen.html?v=1.0.0&access=' + $.getRequest("access") + '&wechatId=' + $.getRequest('wechatId')  + '&orderType=' + $.getRequest("orderType"));
		} else {
			WebAPI.callLast("selectCityForIOS", new Array(JSON.stringify(inf2)));
		}
		setTimeout(function() {
			$.back();
		}, 200);

	});
});