define(['zepto','MedtapCore'],function($,MedtapCore){
	var clinicalStudy = {
		diseaseId: "",
		diseaseName: "",
		medcineId: "",
		medcineName: "",
		tabId: "4",
		Dlist:"",   //疾病列表
		Mlist:"",    //药物列表
		selectLists:"",//选择栏
		pageList:"",//页面内容列表
		hasMore:"",
		sequence:"",
		canScroll: true,
		
		//初始化页面默认临床研究招募
		showFirstView: function(){
			var _this = this;
			if(_this.selectLists == ""){
				$('.firstView').addClass("on");
				_this.selectLists = $('#selectLists').html();
			}
			
			$('.selectLists').html(_this.selectLists);
			$('.diseaseList').hide();
			$('.medcineList').hide();
			$('.guan_one').hide();
			$('.guan_two').hide();
			$('.choseDisease').attr("isDopen","no");
			$('.choseMedcine').attr("isMopen","no");
			
			_this.showKeywords();
			
			$('.diseaseList').on("click","li",function(){
				$(this).addClass("on").siblings().removeClass("on");
				_this.diseaseId = $(this).attr("diseaseId");
				_this.diseaseName = $(this).text();
				_this.closeDisease();
				_this.getData(_this.tabId,_this.diseaseId,_this.medcineId,"LAST");
				_this.showKeywords();
			});
			$('.medcineList').on("click","li",function(){
				$(this).addClass("on").siblings().removeClass("on");
				_this.medcineId = $(this).attr("medcineId");
				_this.medcineName = $(this).text();
				_this.closeMedcine();
				_this.getData(_this.tabId,_this.diseaseId,_this.medcineId,"LAST");
				_this.showKeywords();
			});
			
			_this.toChoose();
			
		},
		
		
		//切换显示页面
		showPage: function(){
			var _this = this;
			$('.chooseTab').on("click","li",function(){
				_this.tabId = $(this).attr("tabId");
				$(this).addClass("on").siblings().removeClass("on");
				
				_this.pageList = "";
				
				if(_this.tabId == "5"){
					_this.showFirstView();
					_this.getData(_this.tabId,_this.diseaseId,_this.medcineId,"LAST");
				}else{
					$('.selectLists').html("");
					_this.getData(_this.tabId,"","","LAST");
					
				}
			});
			
		},
		
		// 选择疾病类型  药物类型
		toChoose: function(){
			var _this = this;
			
			$('.choseDisease').click(function(){
				$('.diseaseList').html(_this.Dlist);
				
				var isDopen = $('.choseDisease').attr("isDopen");
				var isMopen = $('.choseMedcine').attr("isMopen");
				if(isDopen == "no"){
					if(isMopen == "yes"){
						_this.closeMedcine();
						_this.openDisease();
						_this.chooseDisease();
					}else{
						_this.openDisease();
						_this.chooseDisease();
					}
				}else{
					_this.closeDisease();
				}
			});
			
			$('.choseMedcine').click(function(){
				$('.medcineList').html(_this.Mlist);
				
				var isDopen = $('.choseDisease').attr("isDopen");
				var isMopen = $('.choseMedcine').attr("isMopen");
				if(isMopen == "no"){
					if(isDopen == "yes"){
						_this.closeDisease();
						_this.openMedcine();
						_this.chooseMedcine();
					}else{
						_this.openMedcine();
						_this.chooseMedcine();
					}
				}else{
					_this.closeMedcine();
				}
			});
			
		},
		
		//疾病列表选择
		chooseDisease: function(){
			var _this = this;
			if(_this.diseaseId == ""){
				$('#allDisease').addClass("on");
			}else{
				$(".diseaseList li").each(function(k,v){
					var Did = $(v).attr("diseaseId");
					if(Did == _this.diseaseId){
						$(v).addClass("on");
					}
				});
			}
			
			_this.pageList = "";
			
		},
		
		
		//药物列表选择
		chooseMedcine: function(){
			var _this = this;
			if(_this.medcineId == ""){
				$('#allMedcine').addClass("on");
				
			}else{
				$(".medcineList li").each(function(k,v){
					var Mid = $(v).attr("medcineId");
					if(Mid == _this.medcineId){
						$(v).addClass("on");
					}
				});
			}
			
			_this.pageList = "";
			
		},
		
		//关闭疾病列表
		closeDisease: function(){
			$('.choseDisease').attr("isDopen","no");
			$('.diseaseName').removeClass("on");
			$('.guan_one').hide();
			$('.kai_one').show();
			$('.sec1').css({
				"height": "0",
				"-webkit-transition": "height 0.25s linear",
				"transition": "height 0.25s linear"
			});
			$('.diseaseList').hide();
		},
		
		
		//打开疾病列表
		openDisease: function(){
			$('.choseDisease').attr("isDopen","yes");
			$('.diseaseName').addClass("on");
			$('.guan_one').show();
			$('.kai_one').hide();
			$('.sec1').css({
				"height": "2.8rem",
				"-webkit-transition": "height 0.25s linear",
				"transition": "height 0.25s linear"
			});
			setTimeout(function(){
				$('.diseaseList').show();
			},200);
		},
		
		//关闭药物列表
		closeMedcine: function(){
			$('.choseMedcine').attr("isMopen","no");
			$('.medcineName').removeClass("on");
			$('.guan_two').hide();
			$('.kai_two').show();
			$('.sec2').css({
				"height": "0",
				"-webkit-transition": "height 0.2s linear",
				"transition": "height 0.2s linear"
			});
			$('.medcineList').hide();
		},
		
		
		//打开药物列表
		openMedcine: function(){
			$('.choseMedcine').attr("isMopen","yes");
			$('.medcineName').addClass("on");
			$('.guan_two').show();
			$('.kai_two').hide();
			$('.sec2').css({
				"height": "2rem",
				"-webkit-transition": "height 0.2s linear",
				"transition": "height 0.2s linear"
			});
			setTimeout(function(){
				$('.medcineList').show();
			},200);
		},
		
		//疾病、药物筛选关键词显示
		showKeywords: function(){
			var _this = this;
			if(_this.diseaseId == ""){
				$('.diseaseName').text("疾病");
			}else{
				$('.diseaseName').text(_this.diseaseName);
			}
			
			if(_this.medcineId == ""){
				$('.medcineName').text("药物");
			}else{
				$('.medcineName').text(_this.medcineName);
			}
		},
		
		//获取疾病类型 药物类型
		getResource: function(){
			var _this = this;
			
			MedtapCore.fetchData({
				url:"/yjy_common/fetchMetadata",
				success: function(data){
					if(data.code == 0){
						var resourcediseases = data.resourcediseases;
						var medcines = data.medicines;
						
						for(var i=0 ; i < resourcediseases.length ; i++){
							var dName = resourcediseases[i].diseaseName;
							var dId = resourcediseases[i].diseaseId;
							
							_this.Dlist += '<li diseaseId="'+ dId +'">'+ dName +'</li>';
						}
						_this.Dlist += '<li id="allDisease" diseaseId="">全部</li>';
						
						for(var j=0 ; j < medcines.length ; j++){
							var mName = medcines[j].medicineName;
							var mId = medcines[j].medicineId;
							_this.Mlist += '<li medcineId="'+ mId +'">'+ mName +'</li>';
						}
						_this.Mlist += '<li id="allMedcine" medcineId="">全部</li>';
					}
				}
				
			}); 
		},
		
		//获取对应tab信息并显示
		getData: function(tabId,diseaseId,medcineId,max){
			var _this = this;
			MedtapCore.jzz(1);
			MedtapCore.fetchData({
				url:"/resource/fetchClinicalResearchs",
				data:{
					resourceId: tabId,
					diseaseId: diseaseId,
					medicineId: medcineId,
					categoryId: "1",
					max: max
				},
				success: function(data){
					MedtapCore.jzz(0);
					_this.canScroll = true;
					if(data.code == 0){
						$('.reminder').hide();
						$('#list').show();
						
						var resources = data.resources;
						var lastLen = resources.length - 1;
						_this.hasMore = data.hasMore;
						
						if(_this.hasMore == false){
							return;
						}else{
							_this.sequence = resources[lastLen].sequence;
							
							for(var i = 0; i < resources.length; i++){
								var picPosition = resources[i].pictureSPosition,
									picUrl = resources[i].pictureUrlS,
									resourceId = resources[i].resourceId;
									title = resources[i].title;
								
								if(!picUrl){
									_this.pageList += '<li resourceId="'+ resourceId +'" theTitle="'+ title +'"><p class="biaoti2">'+ title +'</p></li>';
								}else{
									if(picPosition == "R"){
										_this.pageList += '<li resourceId="'+ resourceId +'" theTitle="'+ title +'"><div class="content"><p class="biaoti1">'+ title +'</p></div><div class="tupian"><img src="'+ picUrl +'"/></div></li>'
									}
									if(picPosition == "D"){
										_this.pageList += '<li resourceId="'+ resourceId +'" theTitle="'+ title +'"><p class="biaoti2">'+ title +'</p><div class="image"><img src="'+ picUrl +'" /></div></li>';
									}
									if(picPosition == "M"){
										_this.pageList += '<li resourceId="'+ resourceId +'" theTitle="'+ title +'"><div class="image"><img src="'+ picUrl +'"/><div class="picturebg"></div><div class="wenzi">'+title +'</div></div></li>'
									}
								}
								
							}
							$('.list').html(_this.pageList);
						}
						
					}else{
						$('#list').hide();
						$('.reminder').show();
					}
				},
				error: function(data){
					MedtapCore.winPop(data.message);
				}
			});
		},
		
		getScroll: function(){
			var _this = this;
			$(window).scroll(function(){
				if($(document).height() - $(this).scrollTop() - $(this).height() < 50){
					if(_this.canScroll == true){
						_this.canScroll = false;
						
						if(_this.hasMore == true){
							if(_this.tabId == "5"){
								_this.getData(_this.tabId,_this.diseaseId,_this.medcineId,_this.sequence);
							}else{
								_this.getData(_this.tabId,"","",_this.sequence);
							}
						}else{
							return;
						}
						
					}else{
						return;
					}
				}
			});
		},
		
		goNext: function(){
			var _this = this;
			$('#list').on("click","li",function(){
				var resourceId = $(this).attr("resourceId");
				var title = $(this).attr("theTitle");
				var txtTitle = encodeURIComponent(title);
				
				window.location.href = '../pages/textDetail.html?v=1.0.0&resourceId=' + resourceId + '&title=' + txtTitle + '&tabId=' + _this.tabId;
			});
		}
		
	};
	
	
	
	clinicalStudy.showFirstView();
	clinicalStudy.showPage();
	clinicalStudy.getResource();
	clinicalStudy.getData(clinicalStudy.tabId,"","","LAST");
	clinicalStudy.getScroll();
	clinicalStudy.goNext();
});