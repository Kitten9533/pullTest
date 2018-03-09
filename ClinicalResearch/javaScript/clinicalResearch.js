define(['zepto', 'medtapCore'], function($, medtapCore){
	var main = {
		wechatId:medtapCore.getRequest('wechatId'),
		bind: function(){
			$('.newDrugFree').click(function(){
				window.location.href = 'pages/newDrugFree.html?v=1.0.0&type=wx&orderType=XYMFY&title=新药免费用&wechatId=' + main.wechatId;
			});
			//临床研究招募
			$('.aboutClincalResearch').click(function(){
				window.location.href = 'pages/aboutClincalResearch.html?v=1.0.0&wechatId=' + main.wechatId;
			});
			//临床研究知识
			$('.clincalResearchMore').click(function(){
				window.location.href = 'pages/clincalResearchMore.html?v=1.0.0&wechatId=' + main.wechatId;
			});
			//帮我匹配
			$('.cooperative-agency').click(function(){
				window.location.href = 'pages/applyNewDrug.html?v=1.0.0&type=wx&orderType=LCYJZM&title=帮我匹配&wechatId=' + main.wechatId;
			})
		}
	};
	
	main.bind();
});
