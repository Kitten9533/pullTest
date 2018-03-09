require(['zepto', 'yjyInit'], function($) {
	
	var theDisease,
	    theId,
	    isShow = $.getRequest("isShow");
    
    function getDisease(){
    	var str = '';
    	[].forEach.call(theDisease, function(obj){
    		str += '<li diseaseId=' + obj.diseaseId + '>' + obj.diseaseName + '</li>';
    	});
    	$('#diseaseList').html(str);
		if (isShow == 0) {
	        theId = JSON.parse(localStorage.inf1).pId;
		       	if (theId) {
					$('#diseaseList li[diseaseid="' + theId + '"]').click();
		        } else {
		            $('#diseaseList li').eq(0).addClass("on").click();
		        }
	    } else {
	        theId = JSON.parse(localStorage.inf2).pId;
		    if (theId) {
				$('#diseaseList li[diseaseid="' + theId + '"]').click();
		    } else {
		        $('#diseaseList li').eq(0).addClass("on").click();
		    }
	    }
    };

	$.ajax({
		url: "https://gateway.medtap.cn/base/getDiseaseTree",
		contentType: "application/json",
		data: $.setToken(),
		type: 'get',
		async: true,
		dataType: 'json',
		success: function(data) {
			if(data.success){
				theDisease = data.content;		
				getDisease();
			}
		},
		error: function(data) {

		}
	});
	
	
	

	var height = $(window).height(),
		diseaseList = $('.diseaseList'),
		detailsList = $('.detailsList');
	diseaseList.css("height", height);
    detailsList.css("height", height);
    
    
	diseaseList.on("click", "li", function() {
		var parentId = $(this).attr("diseaseId"),
			length = theDisease.length;
		for(var i = 0; i < length; i++) {
			var id = theDisease[i].diseaseId,
				html = "";
			if(parentId == id) {
				var len = theDisease[i].diseaseItemList.length;
				for(var j = 0; j < len; j++) {
					var diseaseName = theDisease[i].diseaseItemList[j].diseaseName,
						diseaseId = theDisease[i].diseaseItemList[j].diseaseId;
					html += '<li parentId="' + id + '" diseaseId="' + diseaseId + '">' + diseaseName + '</li>';
				}
				detailsList.html(html);
			}
		}
		$(this).addClass("on").siblings().removeClass("on");
	});
	detailsList.on("click", "li", function() {
		var name = $(this).text(),
			pid = $(this).attr("parentId"),
			did = $(this).attr("diseaseId");
			inf2 = JSON.parse(localStorage.inf2);
		var inf1 = JSON.parse(localStorage.inf1);
	    if (isShow == 0) {
	    	
	    	inf1.diseaseName = name;
			inf1.pId = pid;
			inf1.diseaseId = did;
			inf2.isShow = 0;
			localStorage.inf1 = JSON.stringify(inf1);
			localStorage.inf2 = JSON.stringify(inf2);
	    } else{ 
	    	inf2.diseaseName = name;
			inf2.pId = pid;
			inf2.diseaseId = did;
			inf2.isShow = 1;
			localStorage.inf2 = JSON.stringify(inf2);
	    }
		
		if(typeof WebAPI == "undefined"){
			//微信下
			localStorage.inf1 = JSON.stringify(inf1);
			localStorage.inf2 = JSON.stringify(inf2);
			window.location.replace('https://review-formal.iplusmed.com/wxPayPrd/ConsultationOption/huizhen.html?v=1.0.0&access=' + $.getRequest("access") + '&wechatId=' + $.getRequest('wechatId')  + '&orderType=' + $.getRequest("orderType"));
		} else {
			var arrayObj = new Array();
			arrayObj. push(JSON.stringify(inf1));
			arrayObj. push(JSON.stringify(inf2));
			WebAPI.callLast("selectDiseaseForIOS",arrayObj);
		}
		
		setTimeout(function() {
			$.back();
		}, 200);
		
	});
});