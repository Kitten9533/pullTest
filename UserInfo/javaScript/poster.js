define(['zepto','medtapCore'],function($,medtapCore){
	var info = {
		wechatId: medtapCore.getRequest('wechatId'),
		createQrcode: function(){
			$.ajax({
				url:'https://gateway.medtap.cn/wechat/createQrcode',
				type:'post',
				dataType:'json',
				contentType: "application/json",
				data:JSON.stringify(medtapCore.setToken({
					wechatId:info.wechatId
				})),
				success:function(res){
					if(res.success == true){
						var data = res.content;
						var imgUrl = data.qrcode;
						$('.qr_code').attr('src',imgUrl);
						$('.qCode').css('opacity', 1);
//						$('.agentName').text(data.username)
					}else{
						//alert(res.code)
					}
				},
				error: function(){
					
				}
			});
		}
	};
	info.createQrcode();
});