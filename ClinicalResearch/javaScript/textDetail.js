require(['zepto','medtapCore'],function($,medtapCore){
	var details = {
		resourceId: medtapCore.getRequest("resourceId"),
		subCategoryId: medtapCore.getRequest("tabId"),
		detailContent: "",
		isHaveSubmit:"",
		accountId:"",
		medtapUserData:"",
		
		showPage: function(){
			var _this = this;
			medtapCore.jzz(1);
			medtapCore.fetchData({
				url:"/resource/fetchClinicalResearchDetail",
				data:{
					 resourceId: _this.resourceId
				},
				success: function(data){
					medtapCore.jzz(0);
					if(data.code == 0){
						var resource = data.resource;
						_this.isHaveSubmit = resource.isHaveSubmit;
						
						var theComment = resource.comment,
							title = resource.title;
							diseaseName = resource.diseaseName,
							medcineName = resource.medicineName,
							makeTime = resource.makeTime.split(" ");
						var	makeDate = makeTime[0];
						
//						document.title = title;
						
						if(diseaseName && medcineName){
							_this.detailContent += '<div class="title"><h4>' + title + '</h4></div><div class="tag_1"><div class="icon"></div><p class="module">' + 
								    diseaseName +'</p><div class="icon"></div><p class="disease">' + medcineName + '</p><div class="time"><p class="day">' +
									makeDate + '</p></div></div><div class="main"><div class="text"><p>' +
									theComment + '</p></div></div>';
						}
						if(diseaseName && !medcineName){
							_this.detailContent += '<div class="title"><h4>' + title + '</h4></div><div class="tag_1"><div class="icon"></div><p class="module">' + diseaseName +
									'</p><div class="time"><p class="day">' + makeDate + '</p></div></div><div class="main"><div class="text"><p>' +
									theComment + '</p></div></div>';
						}
						if(!diseaseName && medcineName){
							_this.detailContent += '<div class="title"><h4>' + title + '</h4></div><div class="tag_1"><div class="icon"></div><p class="module">' + medcineName+
									'</p><div class="time"><p class="day">' + makeDate + '</p></div></div><div class="main"><div class="text"><p>' +
									theComment + '</p></div></div>';
						}
						if(!diseaseName && !medcineName){
							_this.detailContent += '<div class="title"><h4>' + title + '</h4></div><div class="tag_1"><div class="time"><p class="day">' + makeDate + 
											 '</p></div></div><div class="main"><div class="text"><p>' + theComment + '</p></div></div>';
						}
						
						$('.container').html(_this.detailContent);
						
						$('.container').find("ul").css("list-style-type","none");
						
						_this.isShowSubmit();
					}else{
						medtapCore.popupErrorToast(data.message);
					}
				},
				error: function(){
					medtapCore.popupErrorToast(data.message);
				}
			});
		},
		
		isShowSubmit: function(){
			var _this = this;
			if(_this.isHaveSubmit == true){
				$('.learnAbout').show();
				_this.clickLearnAbout();
			}else{
				$('.learnAbout').hide();
			}
		},
		
		clickLearnAbout: function(){
			var _this = this;
			$('.learnAbout').click(function(){
				window.location.href = '../pages/applyNewDrug.html?v=1.0.0&type=wx&orderType=LCYJZM&title=临床研究招募&wechatId=' + medtapCore.getRequest('wechatId');
			});	
		},
		
		/*isNeedLogin: function(){
			var _this = this;
			
			if(!localStorage.medtapGlobalData){
				_this.isLogin();
			}else{
				_this.medtapUserData = JSON.parse(localStorage.medtapGlobalData);
				_this.accountId = _this.medtapUserData.accountId;

				_this.choose();
			}
			
		},
		
		choose: function(){
			var _this = this;
			if(!_this.accountId){
				_this.isLogin();
			}else{
				_this.isTel();
			}
		},
		
		isLogin: function(){
			var _this = this;
			
			$('.greyBg').show();
			$('.reminder2').show();
		},
		
		isTel: function(){
			var _this = this;
			
			$('.greyBg').show();
			$('.reminder1').show();
		},
		
		loginChoose: function(){
			var  _this = this;
			$('.no').click(function(){
				$('.greyBg').hide();
				$('.reminder2').hide();
			});
			
			$('.yes').click(function(){
				$('.greyBg').hide();
				$('.reminder2').hide();
				//window.location.href = " FF499211739FD801USER://kRouteWebLogin";
				//TODO  跳转至登录
				
			});
		},
		
		telChoose: function(){
			var _this = this;
			$('.noNeed').click(function(){
				$('.greyBg').hide();
				$('.reminder1').hide();
			});
			
			$('.yesNeed').click(function(){
				$('.greyBg').hide();
				$('.reminder1').hide();
				
				_this.goSubmit();
			});
		},
		
		goSubmit: function(){
			var _this = this;
			medtapCore.jzz(1);
			medtapCore.fetchData({
				url:"/yjy/submitResource",
				data:{
					resourceId: _this.resourceId,
		    		categoryId: "1",
		    		subCategoryId: _this.subCategoryId,
		    		accountId: _this.accountId,
					token: _this.medtapUserData.token,
					globalDeviceRom: _this.medtapUserData.globalDeviceRom ,
					globalAppVersion: _this.medtapUserData.globalAppVersion,
					globalAppType: _this.medtapUserData.globalAppType,
					globalDeviceModel: _this.medtapUserData.globalDeviceModel,
					globalDeviceType: _this.medtapUserData.globalDeviceType
				},
				type:'post',
			    dataType:'json',
			    success:function(data){
			    	medtapCore.jzz(0);
			        _this.sumbitCallback(data);
			     },
			     error : function(data) {
			     }
			});
		},
		
		submitCallback: function(result){
			var _this = this;
			if (result.code == '0') {
				medtapCore.winPop("感谢您对易加医的支持,客服会及时和您取得联系！");
			} else {
				medtapCore.winPop("提交失败，请重试！");
			}
		},*/
		
		
	}	
	details.showPage();
	//details.telChoose();
	//details.loginChoose();
});	
