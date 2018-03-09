define(['https://review-formal.iplusmed.com/Common/javaScript/beforeSubmit.js', 'zepto', 'yjyInit'], function(beforeSubmit, $) {

	$.jzz = function(opt) { //用于显示加载中效果的方法，参数1代表显示效果，0代表隐藏效果
		var a = $(".jzzbg");
		if(a.attr("has")) {
			if(opt == 1) {
				a.show();
			}
			if(opt == 0) {
				a.hide();
			}
		} else {
			var html = '<div class="jzzbg" has="true"><div class="jzz"></div></div>';
			var b = $("body");
			b.append(html);
			var c = $(".jzzbg");
			if(opt == 1) {
				c.show();
			}
			if(opt == 0) {
				c.hide();
			}
		}
	}

	var huizhen = {

		theInf: "",
		otherInf: "",
		access: $.getRequest("access"),
		count: 0,
		arrId: ['fileElem0'],
		wechatId: "",
		orderType: '',
		applyUrl: window.location.href,
		localIds: [],
		serverId: "",
		imgList: "",
		init: function() {
			huizhen.getWeChatTicket();
			huizhen.choseImage();
			huizhen.orderType = $.getRequest('orderType') ? $.getRequest('orderType') : 'GNDEYJ';
		},
		choseImage: function() {
			$('.upLoad').on('click', function() {
				var html = '';
				wx.ready(function() {
					wx.chooseImage({
						count: 1,
						sizeType: ['original', 'compressed'],
						sourceType: ['album', 'camera'],
						success: function(res) {
							huizhen.localIds = res.localIds;
							html += '<li class="weui-uploader__file"><img src="' + huizhen.localIds + '"/></li>'
							$('#ImgUp').append(html);
							huizhen.previewImage();
							//TODO -->图片上传

							wx.uploadImage({
								localId: huizhen.localIds[0].toString(),
								isShowProgressTips: 1,
								success: function(res) {
									var d = res.serverId;
									huizhen.serverId = d;
									huizhen.upLoadImg();
								},
								error: function() {
									alert('图片上传失败~');
								}
							})
						}
					})
				})
			})
		},
		//图片预览
		previewImage: function() {
			$('#upLoaderWrap').on('click', 'img', function() {
				var imgArray = [];
				var curImageSrc = $(this).attr('src');
				if(curImageSrc) {
					$('#ImgUp img').each(function(index, el) {
						var itemSrc = $(this).attr('src');
						imgArray.push(itemSrc);
					});
					wx.previewImage({
						current: curImageSrc,
						urls: imgArray
					});
				}
			});
		},
		//上传图片
		upLoadImg: function() {
			$.ajax({
				url: 'https://gateway.medtap.cn/common/uploadWechatFile',
				type: 'post',
				data: $.setToken({
					bizType: "3",
					folder: 'service/' + $.getRequest('wechatId'), //wechatId
					mediaId: huizhen.serverId,
					ext: 'jpg'
				}),
				success: function(data) {
					if(data.success == true) {
						var res = data.content;
						var imgKey = res.ossKey;
						huizhen.imgList += imgKey + ',';
					}
				}

			})
		},
		getWeChatTicket: function() {
			$.ajax({
				url: 'https://gateway.medtap.cn/wechat/fetchWechatTicket',
				type: 'get',
				async: false,
				contentType: "application/json",
				data: $.setToken({
					url: huizhen.applyUrl
				}),
				success: function(data) {
					var res = data.content;
					wx.config({
						debug: false,
						appId: res.appId, // 必填，公众号的唯一标识
						timestamp: res.timestamp, // 必填，生成签名的时间戳
						nonceStr: res.nonceStr, // 必填，生成签名的随机串
						signature: res.signature, // 必填，签名，见附录1
						jsApiList: [
							'chooseImage',
							'previewImage',
							'uploadImage'
						]
					})
				},
				error: function(err) {
					alert('发生错误，请重试');
				}
			})
		},
		getDisease: function() {

			huizhen.theInf = JSON.parse(localStorage.inf1);
			huizhen.otherInf = JSON.parse(localStorage.inf2);

			var theDiseaseName = huizhen.theInf.diseaseName,
				theDiseaseId = huizhen.theInf.diseaseId,
				selfDoctorName = huizhen.theInf.selfDoctorName,
				selfHospitalName = huizhen.theInf.selfHospitalName,
				theTime = huizhen.theInf.time,
				illness = huizhen.theInf.illness,
				need = huizhen.theInf.need,
				level = huizhen.otherInf.level,
				money = huizhen.otherInf.money,
				cityName = huizhen.otherInf.cityName,
				cityId = huizhen.otherInf.cityId,
				otherDiseaseName = huizhen.otherInf.diseaseName,
				otherDiseaseId = huizhen.otherInf.diseaseId,
				otherTime = huizhen.otherInf.time,
				isShow = huizhen.otherInf.isShow;

			function theVal() {
				if(illness) {
					$('#illnessDescribe').val(illness);
				}
				if(need) {
					$('#need').val(need);
				}
			};

			if(isShow == 1) {
				$('.other').addClass("on");
				$('.page_1').hide().attr("isShow", "0");
				$('.page_2').show().attr("isShow", "1");
				if(otherDiseaseName) {
					$('#disease2').text(otherDiseaseName).css("color", "#000000").attr("diseaseId", otherDiseaseId);
				}
				if(otherTime) {
					$('#time2').text(otherTime).css("color", "#000000");
				}
				if(level) {
					$('.expert').text(level).css("color", "#000000");
				}
				if(money) {
					$('.money').text(money).css("color", "#000000");
				}
				if(cityName) {
					$('#city').text(cityName).css("color", "#000000").attr("cityId", cityId);
				}
				theVal();
			} else {
				$('.self').addClass("on");
				$('.page_2').hide().attr("isShow", "0");
				$('.page_1').show().attr("isShow", "1");
				if(selfDoctorName) {
					$('#doctorName').val(selfDoctorName);
				}
				if(selfHospitalName) {
					$('#hospitalName').val(selfHospitalName);
				}
				if(theDiseaseName) {
					$('#disease1').text(theDiseaseName).css("color", "#000000").attr("diseaseId", theDiseaseId);
				}
				if(theTime) {
					$('#time1').text(theTime).css("color", "#000000");
				}
				theVal();
			}

			if(localStorage.selectDoctorBeanFirst) {
				var selectDoctor = JSON.parse(localStorage.selectDoctorBeanFirst),
					doctorId = selectDoctor.doctorId,
					doctorName = selectDoctor.doctorName,
					firstProfessor = $('#firstProfessor'),
					hasChoce = firstProfessor.attr("hasChoce");
				firstProfessor.text(doctorName).css("color", "#000000")
					.attr("firstDoctorId", doctorId).attr("hasChoce", "no");
				//				localStorage.removeItem("selectDoctorBeanFirst");
			}
			if(localStorage.selectDoctorBeanSecond) {
				var selectDoctor = JSON.parse(localStorage.selectDoctorBeanSecond),
					doctorId = selectDoctor.doctorId,
					doctorName = selectDoctor.doctorName,
					firstProfessor = $('#firstProfessor'),
					hasChoce = firstProfessor.attr("hasChoce");
				$('#secondProfessor').text(doctorName).css("color", "#000000").attr("secondDoctorId", doctorId);
				//				localStorage.removeItem("selectDoctorBeanSecond");
			}

		},

		switchOver: function() {
			var self = $('.self');
			$('.other').click(function() {
				$(this).addClass("on");
				self.removeClass("on");
				$('.page_1').hide().attr("isShow", "0");
				$('.page_2').show().attr("isShow", "1");
				huizhen.otherInf.isShow = 1;
				localStorage.inf2 = JSON.stringify(huizhen.otherInf);
			});
			self.click(function() {
				self.addClass("on");
				$('.other').removeClass('on');
				$('.page_2').hide().attr("isShow", "0");
				$('.page_1').show().attr("isShow", "1");
				huizhen.otherInf.isShow = 0;
				localStorage.inf2 = JSON.stringify(huizhen.otherInf);
			});
		},

		choice: function() {
			var mod = $('.mod'),
				chooseList = $('.chooseList'),
				chooseContent = $('#chooseList'),
				lb;

			function toMiss() {
				mod.removeClass("on");
				chooseList.removeClass("on");
				chooseContent.empty();
			};

			//条件选择
			$('.choseTime').click(function() {
				lb = $(this).attr("lb");
				mod.addClass("on");
				chooseList.addClass("on");
				chooseContent.html("<ul lb='time'><li>越快越好</li><li>一周以内</li><li>两周以内</li><li>不是很着急</li></ul>");
			});
			$('.budget').click(function() {
				mod.addClass("on");
				chooseList.addClass("on");
				if(huizhen.access == "hzhen") {
					chooseContent.html("<ul lb='money'><li>1000元以下</li><li>1000元-3000元</li><li>3000元-5000元</li><li>5000元-10000元</li><li>10000元以上</li></ul>");
				} else {
					chooseContent.html("<ul lb='money'><li>3000元以下</li><li>3000元-5000元</li><li>5000元-10000元</li><li>10000元-20000元</li><li>20000元以上</li></ul>");
				}
			});
			$('.choseDisease').click(function() {
				$.next({
					url: "disease.html",
					keys: {
						isShow: 0,
						access: $.getRequest('access'),
						wechatId: $.getRequest('wechatId'),
						orderType: $.getRequest('orderType')
					}
				});
			});
			$('.illness').click(function() {
				$.next({
					url: "disease.html",
					keys: {
						isShow: 1,
						access: $.getRequest('access'),
						wechatId: $.getRequest('wechatId'),
						orderType: $.getRequest('orderType')
					}
				});
			});

			$('.firstList1').on("click", "li", function() {

				var lb = $(this).attr("lb");
				if(huizhen.access == "hzhen") {
					if(lb == "first") {
						$('#firstProfessor').attr("hasChoce", "yes");
						window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/FindDoctor/choseDoctorByThree.html?v=1.0.0&type=wx&sub=hz&sort=first&access=' + $.getRequest("access") + '&wechatId=' + $.getRequest('wechatId') + '&orderType=' + $.getRequest('orderType');
					} else {
						window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/FindDoctor/choseDoctorByThree.html?v=1.0.0&type=wx&sub=hz&sort=second&access=' + $.getRequest("access") + '&wechatId=' + $.getRequest('wechatId') + '&orderType=' + $.getRequest('orderType');
					}
					//					window.location.href = "FF499211739FD801USER://web/url/https://cdn.iplusmed.com/web/findDoctor/choseDoctorByThree.html?type=hz";
					//					window.location.href = 'http://tstcdn.iplusmed.com/web/tstReview/findDoctor/choseDoctorByThree.html?type=wx';
					//					window.location.href = 'http://192.168.8.181:8020/2017.10.09/webPageReview/TestModule/TstCommon/pages/FindDoctor/choseDoctorByThree.html?type=wx&sub=hz&access=' + $.getRequest("access");
				} else {
					if(lb == "first") {
						$('#firstProfessor').attr("hasChoce", "yes");
						window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/FindDoctor/choseDoctorByThree.html?v=1.0.0&type=wx&sub=dd&sort=first&access=' + $.getRequest("access") + '&wechatId=' + $.getRequest('wechatId') + '&orderType=' + $.getRequest('orderType');
					} else {
						window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/FindDoctor/choseDoctorByThree.html?v=1.0.0&type=wx&sub=dd&sort=second&access=' + $.getRequest("access") + '&wechatId=' + $.getRequest('wechatId') + '&orderType=' + $.getRequest('orderType');
					}
					//					window.location.href = "FF499211739FD801USER://web/url/https://cdn.iplusmed.com/web/findDoctor/choseDoctorByThree.html?type=dd";
					//					window.location.href = 'http://tstcdn.iplusmed.com/web/tstReview/findDoctor/choseDoctorByThree.html?type=wx';
					//					window.location.href = 'http://192.168.8.181:8020/2017.10.09/webPageReview/TestModule/TstCommon/pages/FindDoctor/choseDoctorByThree.html?type=wx&sub=dd&access=' + $.getRequest("access");
				}
			});

			$('.firstList2').on("click", "li", function() {
				var theLb = $(this).attr("lb");
				if(theLb == "city") {
					//					$.next({
					//						url: "city.html",
					//						access: $.getRequest('access')
					//					});
					window.location.href = 'city.html?v=1.0.0&access=' + $.getRequest('access') + '&wechatId=' + $.getRequest('wechatId') + '&orderType=' + $.getRequest('orderType');
				} else {
					mod.addClass("on");
					chooseList.addClass("on");
					chooseContent.html("<ul lb='expert'><li level='1'>海外专家（美、日、港澳专家）</li><li level='2'>顶级专家（全国主委、副主委、常委）</li><li level='3'>一流专家（省级主委、副主委）</li><li level='4'>热门专家（大三甲主任医师）</li><li level='5'>热门中青年专家（大三甲副主任医师）</li></ul>");
				}
			});

			//弹窗选择
			$('.miss').click(function() {
				toMiss();
			});
			$('#chooseList').on("click", "li", function() {
				toMiss();
				var sort = $(this).parent().attr("lb"),
					theContent = $(this).text();
				if(sort == "expert") {
					var newContent = theContent.split("（");
					$('.expert').text(newContent[0]).css("color", "#000000");
					huizhen.otherInf.level = newContent[0];
					localStorage.inf2 = JSON.stringify(huizhen.otherInf);
				} else if(sort == "time") {
					if(lb == "page1") {
						$('#time1').text(theContent).css("color", "#000000");
						huizhen.theInf.time = theContent;
						localStorage.inf1 = JSON.stringify(huizhen.theInf);
					} else {
						$('#time2').text(theContent).css("color", "#000000");
						huizhen.otherInf.time = theContent;
						localStorage.inf2 = JSON.stringify(huizhen.otherInf);
					}

				} else if(sort == "money") {
					$('.money').text(theContent).css("color", "#000000");
					huizhen.otherInf.money = theContent;
					localStorage.inf2 = JSON.stringify(huizhen.otherInf);
				}
			});
		},

		getVal: function() {

			//huizhen.theInf = JSON.parse(localStorage.inf1);

			$('#doctorName').blur(function() {
				huizhen.theInf.selfDoctorName = $(this).val();
				localStorage.inf1 = JSON.stringify(huizhen.theInf);
			});
			$('#hospitalName').blur(function() {
				huizhen.theInf.selfHospitalName = $(this).val();
				localStorage.inf1 = JSON.stringify(huizhen.theInf);
			});
			$('#illnessDescribe').blur(function() {
				var illness = $(this).val();
				huizhen.theInf.illness = illness;
				huizhen.otherInf.illness = illness;
				localStorage.inf1 = JSON.stringify(huizhen.theInf);
				localStorage.inf2 = JSON.stringify(huizhen.otherInf);
			});
			$('#need').blur(function() {
				var need = $(this).val();
				huizhen.theInf.need = need;
				huizhen.otherInf.need = need;
				localStorage.inf1 = JSON.stringify(huizhen.theInf);
				localStorage.inf2 = JSON.stringify(huizhen.otherInf);
			});
		},

		buildStorage: function() {
			var inf1 = {
				pId: "",
				diseaseId: "",
				diseaseName: "",
				time: "",
				selfDoctorName: "",
				selfHospitalName: "",
				illness: "",
				need: "",
			};
			var inf2 = {
				cityId: "",
				provinceId: "",
				cityName: "",
				pId: "",
				diseaseId: "",
				diseaseName: "",
				time: "",
				money: "",
				illness: "",
				need: "",
				isShow: 0
			};
			if(!!localStorage.inf1 == false) {
				localStorage.inf1 = JSON.stringify(inf1);
			}
			if(!!localStorage.inf2 == false) {
				localStorage.inf2 = JSON.stringify(inf2);
			}
		},

		goSubmit2: function() {
			var firstDoctorId, secondDoctorId, diseaseId, doctorName, hospitalName,
				expectTime, sickDescription, demand, cityId,
				needExpertGrade, estimatedCost, hasImg;
			$('#toSubmit').click(function() {
				var isShowPage = $('#page1').attr("isShow");
				var objImg = $('#fileList').find("img").length;

				function getInfoCommon(num) { //num为  1  自己选专家tab;  0  请帮我推荐tab
					var obj = {};
					obj.demand = $('#need').val();
					obj.sickDescription = $('#illnessDescribe').val();
					obj.expectTime = num == 1 ? $('#time1').text() : $('#time2').text();
					obj.diseaseId = num == 1 ? $('#disease1').attr("diseaseId") : $('#disease2').attr("diseaseId");
					//特有字段
					if(num == 1) {
						obj.doctorName = $('#doctorName').val(); //当 firstDoctordId 不填时 未必填，否则选填
						obj.hospitalName = $('#hospitalName').val(); //当 firstDoctordId 不填时 未必填，否则选填
						obj.secondDoctorId = $('#secondProfessor').attr("secondDoctorId");
						obj.firstDoctorId = $('#firstProfessor').attr("firstDoctorId");
						obj.firstDoctorName = $('#firstProfessor').text();
						obj.secondDoctorName = $('#secondProfessor').text();
						obj.contactName = $('#contactName-1').val();
						obj.contactMobile = $('#contactMobile-1').val();
					} else {
						obj.estimatedCost = $('.money').text();
						obj.needExpertGrade = $('#needExpertGrade').text();
						obj.cityId = $('#city').attr("cityId");
						obj.contactName = $('#contactName-2').val();
						obj.contactMobile = $('#contactMobile-2').val();
					}
					return obj;
				}

				var msgDic1 = { //必填字段    以及提示
					"diseaseId": "请选择疾病",
					"expectTime": "请选择期望时间",
					"contactName": "请输入联系人姓名",
					"contactMobile": "请输入联系人电话",
					"sickDescription": "请输入病情描述"
				};

				var msgDic2 = {
					"cityId": "请选择期望就医城市",
					"needExpertGrade": "请选择所需要的专家级别",
					"estimatedCost": "请选择预算费用范围",
					"diseaseId": "请选择疾病",
					"expectTime": "请选择期望时间",
					"contactName": "请输入联系人姓名",
					"contactMobile": "请输入联系人电话",
					"sickDescription": "请输入病情描述",

				};

				function checkResult(obj, num) {
					var flag = true;
					var msgDic = {};
					if(num == 1) {
						if(!!obj.firstDoctorId == false) {
							if(!obj.doctorName) {
								$.pop('请选择专家或手动填写专家姓名');
								flag = false;
								return flag;
							}
							if(!obj.hospitalName) {
								$.pop('请选择专家或手动填写专家所属医院');
								flag = false;
								return flag;
							}
						}
						msgDic = msgDic1;
					} else {
						msgDic = msgDic2;
					}
					console.log(obj);
					for(var key in msgDic) {
						if(!obj[key] || obj[key].indexOf('请选择') > -1 || obj[key].indexOf('请输入') > -1) {
							$.pop(msgDic[key]);
							//							console.log(key, msgDic[key]);
							flag = false;
							break;
						}
					}
					return flag;
				}

				var picUrl = huizhen.imgList.substring(0, huizhen.imgList.length - 1);
				var result = getInfoCommon(isShowPage);
				//表单值验证
				if(!checkResult(result, isShowPage)) {
					return;
				}
				result.isRecommend = (isShowPage == 1 ? false : true);

				beforeSubmit.config({
					wechatId: $.getRequest('wechatId'),
					getInfo: true,
					success: function() {
						_inner();
					}
				}).init();

				function _inner() {
					$.ajax({
						url: "https://devgw.medtap.cn/service/consultation/saveConsultationApply",
						contentType: "application/json",
						headers: {
							'appType': 'wechat'
						},
						data: JSON.stringify($.setToken({
							applyType: huizhen.orderType,
							isRecommend: result.isRecommend,
							expectedCityId: parseInt(result.cityId),
							expertLevel: result.needExpertGrade,
							budget: result.estimatedCost,
							firstDoctorId: parseInt(result.firstDoctorId),
							secondDoctorId: parseInt(result.secondDoctorId),
							ownDoctorName: result.doctorName,
							ownHospitalName: result.hospitalName,
							diseaseDesc: result.sickDescription,
							expectedTime: result.expectTime,
							helpRequirement: result.demand,
							diseaseId: parseInt(result.diseaseId),
							wechatId: $.getRequest('wechatId'),
							contactName: result.contactName,
							contactMobile: result.contactMobile,
							picUrl: picUrl
						})),
						type: 'post',
						async: true,
						dataType: 'json',
						success: function(data) {
							if(data.success == true) {
								window.localStorage.inf1 = '';
								window.localStorage.inf2 = '';
								window.localStorage.selectDoctorBean = '';
								window.localStorage.selectDoctorBeanFirst = '';
								window.localStorage.selectDoctorBeanSecond = '';
								alert('提交成功');
								window.location.href = 'https://review-formal.iplusmed.com/wxPayPrd/UserInfo/pages/myApply.html?v=1.0.0&wechatId=' + $.getRequest('wechatId');
							} else {
								alert(data.resultDesc);
							}
						},
						error: function(err) {}
					});
				}
			});
		},

		loadingImg: function() {

			if(isShowPage == 1) {
				var elementIds = {
					"accountId": JSON.parse(localStorage.appDoctorData).accountId,
					"globalAppType": "0",
					"firstDoctorId": firstDoctorId,
					"secondDoctorId": secondDoctorId,
					"doctorName": doctorName,
					"hospitalName": hospitalName,
					"diseaseId": diseaseId,
					"expectedTime": expectTime,
					"diseaseDescription": sickDescription,
					"helpRequirement": demand,
					"hasMultiMedia": hasImg
				};
			} else {
				var elementIds = {
					"accountId": JSON.parse(localStorage.appDoctorData).accountId,
					"globalAppType": "0",
					"diseaseId": diseaseId,
					"cityId": cityId,
					"expectedTime": expectTime,
					"expectedDoctorDescription": suggest,
					"diseaseDescription": sickDescription,
					"helpRequirement": demand,
					"budget": estimatedCost,
					"hasMultiMedia": hasImg
				};
			}

			var theUrl = "";
			if(huizhen.access == "hzhen") {
				//				theUrl = "https://api.iplusmed.com/medsrv/applyConsultation";
				theUrl = "http://test.iplusmed.com:80/medsrv/applyConsultation";
			} else {
				//				theUrl = "https://api.iplusmed.com/medsrv/applyOperation";
				theUrl = "http://test.iplusmed.com:80/medsrv/applyOperation";
			}
			$.ajaxFileUpload({
				url: theUrl,
				type: 'post',
				dataType: 'json',
				secureuri: false,
				fileElementId: huizhen.arrId, // 上传文件的id、name属性名
				data: elementIds, //传递参数到服务器
				success: function(data, status) {
					if(data.code == "0") {
						$.jzz(0);
						//	            		localStorage.removeItem("inf1");
						$.next({
							url: "myBooking.html",
							closeOld: true
						});
					} else {
						$.pop("提交失败。");
					}
				}
			});
		},

		upImg: function() {
			$("#fileElem" + huizhen.count).on("change", function() {
				huizhen.handleFiles(this, "#fileList", "#picture");
			});
		},
		handleFiles: function(obj, id, btn) {
			$(obj).css("display", "none");
			var files = $(obj)[0].files;
			_width = $(window).width();
			for(var i = 0; i < files.length; i++) {
				var img = new Image();
				img.setAttribute('applyAbroadTypeId', 'info');
				img.src = window.URL.createObjectURL(files[i]); //创建一个object URL，并不是你的本地路径
				img.width = 0.2 * _width;
				img.height = 0.2 * _width;
				img.className = 'small';
				img.onclick = function() {
					dx = 0; //重置位移
					dy = 0; //重置位移
					initialScale = 1; //重置图片放大               
					$('body').css("overflow", 'hidden');
					$('#bigimg').show();
					$('.opacity').show();
					var scaleImg = new Image();
					scaleImg.src = this.src;
					scaleImg.width = 300;
					$('#bigimg').append(scaleImg);
					$('body').append('<div class=' + 'close' + '></div>');
					$('body .close').click(function() {
						$('body').css("overflow", 'auto');
						$('.opacity').hide();
						$('#bigimg').hide();
						$(this).remove();
						$('#bigimg').children().remove();
					});
				}
				var $newDiv = $('<div class="simg"></div>')
				$(id).append($newDiv);
				var $delete = $('<button class="delete">X</button>')
				$newDiv.append(img); //图片预览
				$newDiv.append($delete);
				$(".delete").click(function() {
					huizhen.getDelete(this);
				});
			}
			huizhen.createInput(btn);
		},
		createInput: function(btn) {
			huizhen.count++;
			$(btn).append("<input type='file' multiple id=fileElem" + huizhen.count + " name='photos' class='upFile'/>");
			huizhen.arrId.push('fileElem' + huizhen.count);
			huizhen.upImg('fileElem' + huizhen.count);
		},
		getDelete: function(obj) {
			$(obj).parent('.simg').remove();
		},

	};
	huizhen.init();
	huizhen.buildStorage();
	huizhen.getDisease();
	huizhen.switchOver();
	huizhen.choice();
	huizhen.getVal();
	huizhen.upImg();
	//	huizhen.goSubmit();
	huizhen.goSubmit2();

	return huizhen;
});