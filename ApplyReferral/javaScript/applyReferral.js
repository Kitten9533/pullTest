define(['zepto','medtap', 'https://review-formal.iplusmed.com/Common/javaScript/beforeSubmit.js'],function($,medtap, beforeSubmit){
	var apply = {
		price:medtap.getRequest('price') ? medtap.getRequest('price') : '',
		type:medtap.getRequest('type') ? medtap.getRequest('type') : '',
		time:medtap.getRequest('time'),
		hospital:medtap.getRequest('hospital'),
		orderId:'',
		doctorId:medtap.getRequest('doctorId'),
		wechatId:medtap.getRequest('wechatId'),
		doctorName:medtap.getRequest('doctorName'),
		init:function(){
			apply.goLinces();
			$('.doctor').text(apply.doctorName);
			$('.time').text(apply.time);
			$('.hospital').text(apply.hospital);
			$('.price').text(apply.type + apply.price);
			
			$('.submit').on('click',function(){
				beforeSubmit.config({
					wechatId: medtap.getRequest('wechatId'),
					getInfo: true,
					success: function() {
						apply.applyReferral();
					}
				}).init();
			})
		},
		goLinces:function(){
			$('.linces').on('click',function(){
				medtap.pushNewWindow('UserReservationLicens.html?v=1.0.0');	
			})
		},
		applyReferral:function(){
			if($('.mobile').val() == ''){
				mui.alert('请输入您的联系电话');
				return;
			}else if($('.aboutDisease').val() == ''){
				mui.alert('请输入病情描述，且不少于10个字');
				return;
			}else if($('.toDoctor').val() == ''){
				mui.alert('请填写您要对医生说的话，且不少于10个字');
				return;
			}
			var str = $('.time').text().replace(/\s/g, "");
			var custTime = str.substring(10);
			var week = custTime.substring(0,3);
			var timeType = str.substring(13);

			$.ajax({
				url:'https://devgw.medtap.cn/service/referral/saveReferralApply',
//				url:'http://192.168.8.120:6020/service/referral/saveReferralApply',
				type:'post',
				contentType:"application/json",
				headers:{
					appType:'wechat'
				},
				data:JSON.stringify(medtap.setToken({
					wechatId:apply.wechatId,
					doctorId:apply.doctorId,
					doctorName:apply.doctorName,
					referralTime: $('.time').text(),
					hospital: $('.hospital').text(),
					price: $('.price').text(),
					mobile:$('.mobile').val(),
					diseaseDesc: $('.aboutDisease').val(),
					expectationHelp: $('.toDoctor').val()
					
//					customerTime:$('.time').text().substring(0,10),
//					diseaseDescription:$('.aboutDisease').val(),
//					expectationHelp:$('.toDoctor').val(),
//					weekday:week,
//					outpatientTimeType:timeType,
				})),
				success:function(data){
					if(data.success == true){
						apply.orderId = data.content.orderSn;
						window.location.href = "msgSuccess.html?v=1.0.0&id=" + data.content.referralApplyVO.applySn + "&title=转诊复诊&wechatId=" + medtap.getRequest('wechatId');
					}
					else{
						window.location.href = "msgWarn.html?v=1.0.0";
					}
				}
			})
		}	
	}
	apply.init()
})
