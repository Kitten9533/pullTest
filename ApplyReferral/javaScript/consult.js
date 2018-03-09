define(['zepto','medtap'],function($,medtap){
	var consult = {
		type:'',
		targetUrl:'',
		wechatId:medtap.getRequest('wechatId'),
		init:function(){
			//获取当前点击项
			$('.content').on('click','div',function(){
				if($(this).hasClass('recommend')){
					consult.type = 'recommend'; 
				}else{
					consult.type = 'follow';
				}
				consult.setData(consult.type);
			})
		},
		//设置跳转参数
		setData:function(type){
			switch(type){
				case 'recommend':
					consult.targetUrl = 'https://review-formal.iplusmed.com/wxPayPrd/FindDoctor/choseDoctorByThree.html?v=1.0.0&type=wx&wechatId=' + consult.wechatId + '&applyReferral=1';
				break;
				case 'follow':
					consult.targetUrl = 'https://review-formal.iplusmed.com/wxPayPrd/UserInfo/pages/myDoctor.html?v=1.0.0&type=wx&wechatId=' + consult.wechatId;
				break;
			}
			window.location.href = consult.targetUrl;
		}
//		,goTargetUrl:function(){
//			$.ajax({
//				url:'',
//			})
//		}
	}
	consult.init();
})
