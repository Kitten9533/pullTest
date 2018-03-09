define(['zepto', 'medtapCore'], function($, medtapCore) {
	var home = {
		url: 'https://review-formal.iplusmed.com/wxPayPrd/OverseasMedical/',
		bind: function(){
			$('.home').on('click', function(){
				window.location.href = 'secondOpinion.html?wechatId=' + medtapCore.getRequest('wechatId');
			});
			//全球第二意见
			$('.whole').click(function(){
				window.location.href = home.url + "resourceDetail.html?v=1.0.0&p=2&resourceId=797&categoryId=15&formType=1&subCategoryId=0&title=全球第二意见&btnName=我要预约&wechatId=" + medtapCore.getRequest('wechatId') ;
			});
		}
	};
	
	home.bind();
});
