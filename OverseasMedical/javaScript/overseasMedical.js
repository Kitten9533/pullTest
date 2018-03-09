define(['zepto', 'medtapCore'], function($, medtapCore){
	var global = {
//		url: medtapCore.getPrefix() + 'web/url/https://cdn.iplusmed.com/apphtml/FF499211739FD801USER/overseasMedical/',
//		url: 'https://cdn.iplusmed.com/apphtml/FF499211739FD801USER/overseasMedical/',
//		url: 'http://192.168.8.181:8020/2017.10.09/webPageReview/TestModule/TstCommon/pages/OverseasMedical/',
		url: 'https://review-formal.iplusmed.com/wxPayPrd/OverseasMedical/',
		bind: function(){
			$('.hotSearchDrug').on('click', function(){
				//applyType,  1: 全球找药    2.国内找药
				window.location.href = 'hotSearchDrug.html?v=1.0.0&applyType=1&title=全球找药';
			});
			
			//全球找药
			$('.global-drug').click(function() {
				window.location.href = global.url + 'globalDrugInfo.html?v=1.0.0';
			});

			//全球第二意见
			$('.second-option').click(function(){
//				window.location.href = "FF499211739FD801USER://web/url/http://cdn.iplusmed.com/apphtml/FF499211739FD801USER/resourceDetail.html?p=2&resourceId=797&categoryId=15&formType=1&subCategoryId=0&title=全球第二意见";
				window.location.href = global.url + "resourceDetail.html?v=1.0.0&p=2&resourceId=797&categoryId=15&formType=1&subCategoryId=0&title=全球第二意见";
			});
			
			//赴美就医
			$('.to-US').click(function(){
//				window.location.href = "FF499211739FD801USER://web/url/http://cdn.iplusmed.com/apphtml/FF499211739FD801USER/resourceList.html?p=1&resourceId=758&categoryId=15&title=赴美就医";
				window.location.href = global.url + "resourceList.html?v=1.0.0&p=1&resourceId=758&categoryId=15&title=赴美就医";
			});
			
			//赴日质子治疗
			$('.to-Japan').click(function(){
//				window.location.href = "FF499211739FD801USER://web/url/http://cdn.iplusmed.com/apphtml/FF499211739FD801USER/resourceList.html?p=1&resourceId=759&categoryId=15&title=赴日质子治疗";
				window.location.href = global.url + "resourceList.html?v=1.0.0&p=1&resourceId=759&categoryId=15&title=日本质子治疗";
			});
			
			$('.to-newDrug').click(function(){
				window.location.href = global.url + "newDrug.html?v=1.0.0&title=港澳新药治疗";
			});
			
		}
	};
	
	global.bind();
});
