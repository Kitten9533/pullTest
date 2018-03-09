define(['zepto', 'medtapCore'], function($, medtapCore) {
	var home = {
		bind: function(){
			$('#consult').on('click', function(){
				window.location.href = 'huizhen.html?v=1.0.0&access=国内第二意见&orderType=GNDEYJ&wechatId=' + medtapCore.getRequest('wechatId');
			});
		}
	};
	
	home.bind();
});
