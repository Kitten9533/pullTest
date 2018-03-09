define(['zepto', 'medtapCore', 'mui', 'mui.picker'], function($, medtapCore, mui) {
	var info = {
		userPicker: [],
		showUserPickerButton: [],
		userResult: [],
		dPicker: null,
		serverId: '', 
		wechatId: '',
		localIds: [],
		imgList: '',
		sexData: [{
				text: '男',
				value: '0'
			},
			{
				text: '女',
				value: '1'
			}
		],
		healthData: [{
				text: '患者',
				value: 'HE3'
			},
			{
				text: '家属',
				value: 'HE2'
			},
			{
				text: '健康咨询者',
				value: 'HE1'
			},
		],
		healthInsuranceData: [{
				text: '城镇职工基本医疗保险',
				value: 'HT1'
			},
			{
				text: '城镇居民基本医疗保险',
				value: 'HT2'
			},
			{
				text: '新型农村合作医疗',
				value: 'HT3'
			},
			{
				text: '商业医疗保险',
				value: 'HT4'
			},
			{
				text: '全自费',
				value: 'HT5'
			},
			{
				text: '全公费',
				value: 'HT6'
			},
			{
				text: '贫困救助',
				value: 'HT7'
			},
			{
				text: '其他社会保险',
				value: 'HT8'
			}
		],
		highRiskData: [{
				text: '长期吸烟;',
				value: 'RF1'
			},
			{
				text: '长期过量饮酒;',
				value: 'RF2'
			},
			{
				text: '家人或亲属患肿瘤;',
				value: 'RF3'
			},
			{
				text: '疾病史：乙肝、胃病等;',
				value: 'RF4'
			},
			{
				text: '较少食用新鲜蔬菜水果;',
				value: 'RF5'
			},
			{
				text: '喜欢食用腌、熏、烧烤食品;',
				value: 'RF6'
			},
			{
				text: '超重或肥胖;',
				value: 'RF7'
			},
			{
				text: '经历过巨大精神创伤;',
				value: 'RF9'
			},
			{
				text: '长期工作压力大、精神压抑;',
				value: 'RF10'
			},
			{
				text: '长期接触射线工作;',
				value: 'RF11'
			},
			{
				text: '长期处于空气污染严重的环境;',
				value: 'RF12'
			}
		],
		highRiskDic: {
			'RF1': '长期吸烟;',
			'RF2': '长期过量饮酒;',
			'RF3': '家人或亲属患肿瘤;',
			'RF4': '疾病史：乙肝、胃病等;',
			'RF5': '较少食用新鲜蔬菜水果;',
			'RF6': '喜欢食用腌、熏、烧烤食品;',
			'RF7': '超重或肥胖;',
			'RF9': '经历过巨大精神创伤;',
			'RF10': '长期工作压力大、精神压抑;',
			'RF11': '长期接触射线工作;',
			'RF12': '长期处于空气污染严重的环境;'
		},
		resourceData: [{
				text: '疾病知识和防治最新进展;',
				value: 'AR1'
			},
			{
				text: '专家的肿瘤防治科普讲座（多媒体）;',
				value: 'AR2'
			},
			{
				text: '肿瘤筛查/体检优惠信息;',
				value: 'AR3'
			},
			{
				text: '最新检测技术（如基因测序）信息;',
				value: 'AR4'
			},
			{
				text: '病友俱乐部的加入及活动信息;',
				value: 'AR5'
			},
			{
				text: '最新临床研究招募;',
				value: 'AR6'
			},
			{
				text: '抗肿瘤相关药物信息;',
				value: 'AR7'
			},
			{
				text: '自费/短缺药物信息搜寻;',
				value: 'AR8'
			},
			{
				text: '自费检测项目或机构推荐;',
				value: 'AR9'
			},
			{
				text: '慈善赠药项目细则;',
				value: 'AR10'
			},
			{
				text: '医保政策咨询;',
				value: 'AR11'
			},
		],
		resourceDic: {
			'AR1': '疾病知识和防治最新进展;',
			'AR2': '专家的肿瘤防治科普讲座（多媒体）;',
			'AR3': '肿瘤筛查/体检优惠信息;',
			'AR4': '最新检测技术（如基因测序）信息;',
			'AR5': '病友俱乐部的加入及活动信息;',
			'AR6': '最新临床研究招募;',
			'AR7': '抗肿瘤相关药物信息;',
			'AR8': '自费/短缺药物信息搜寻;',
			'AR9': '自费检测项目或机构推荐;',
			'AR10': '慈善赠药项目细则;',
			'AR11': '医保政策咨询;'
		},
		init: function() {
			info.getWeChatTicket();
			info.getUserInfo();
			info.initSex();
			info.initBirth();
			info.initDisease();
			info.initHealth();
			info.healthInsurance();
			info.initCity();
			info.initHighRisk();
			info.initResource();
		},
		applyUrl: window.location.href,
		//获取微信票据
		getWeChatTicket: function() {
			$.ajax({
				url: 'https://gateway.medtap.cn/wechat/fetchWechatTicket',
				type: 'get',
				async: false,
				contentType: "application/json",
				data: medtapCore.setToken({
					url: info.applyUrl
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
//							'previewImage',
							'uploadImage'
                        ]
					})
				},
				error: function(err){
					alert('发生错误，请重试');
				}
			})
		},
		initSex: function() {
			info.initPickers(1, 'sexBox', 'sex', info.sexData, 1);
		},
		initBirth: function() {
			$('#birthBox').on('click', function() {
				var year = new Date().getFullYear();
				info.dPicker = new mui.DtPicker({
					"type": "date",
					"beginYear": 1900,
					"endYear": year
				});
				info.dPicker.show(function(rs) {
					$('#birthday').val(rs.text);
				});
			});
		},
		initHealth: function() {
			info.initPickers(3, 'healthBox', 'health', info.healthData, 1);
		},
		healthInsurance: function() {
			info.initPickers(4, 'healthInsuranceBox', 'healthInsurance', info.healthInsuranceData, 1);
		},
		initCity: function() {
			medtapCore.jzz(1);
			$.ajax({
				url: "https://gateway.medtap.cn/base/initCitys",
				contentType: "application/json",
				data: medtapCore.setToken(),
				type: 'get',
				async: true,
				dataType: 'json',
				success: function(data) {
					medtapCore.jzz(0);
					if(data.success) {
						var arr = data.content;
						var cityData = [];
						for(var i = 0, len = arr.length; i < len; i++) {
							var obj = {};
							obj.text = arr[i].name;
							obj.value = arr[i].provinceId;
							var temp = [];
							for(var j = 0, len2 = arr[i].city.length; j < len2; j++) {
								var item = arr[i].city[j];
								var o = {};
								o.text = item.name;
								o.value = item.cityId;
								temp.push(o);
							}
							obj.children = temp;
							cityData.push(obj);
						}
						info.initPickers(5, 'locationBox', 'location', cityData, 2);
					}
				},
				error: function(data) {
					medtapCore.jzz(0);
					mui.toast('获取所在地失败');
				}
			});
		},
		initHighRisk: function() {
			var str = '';
			for(var key in info.highRiskDic) {
				str += '<div class="mui-input-row mui-checkbox">' +
					'<label>' + info.highRiskDic[key] + '</label>' +
					'<span class="highRiskCh" name="' + key + '" value="' + info.highRiskDic[key] + '" type="checkbox"></span>' +
					'</div>';
			}
			$('#highRiskContent').html(str);
			$('.highRiskCh').on('click', function(){
				$(this).hasClass('on') ? 
					$(this).removeClass('on') :
					$(this).addClass('on');
			});
		},
		initDisease: function() {
			medtapCore.jzz(1);
			$.ajax({
				url: "https://gateway.medtap.cn/base/getDiseaseTree",
				contentType: "application/json",
				data: medtapCore.setToken(),
				type: 'get',
				async: true,
				dataType: 'json',
				success: function(data) {
					medtapCore.jzz(0);
					if(data.success) {
						var arr = data.content;
						var diseaseData = [];
						for(var i = 0, len = arr.length; i < len; i++) {
							var obj = {};
							obj.text = arr[i].diseaseName;
							obj.value = arr[i].diseaseId;
							var temp = [];
							for(var j = 0, len2 = arr[i].diseaseItemList.length; j < len2; j++) {
								var item = arr[i].diseaseItemList[j];
								var o = {};
								o.text = item.diseaseName;
								o.value = item.diseaseId;
								temp.push(o);
							}
							obj.children = temp;
							diseaseData.push(obj);
						}
						info.initPickers(2, 'diseaseBox', 'disease', diseaseData, 2);
					}
				},
				error: function(data) {
					medtapCore.jzz(0);
					mui.toast('获取关注疾病失败');
				}
			});
		},
		initResource: function() {
			var str = '';
			for(var key in info.resourceDic) {
				str += '<div class="mui-input-row mui-checkbox">' +
					'<label>' + info.resourceDic[key] + '</label>' +
					'<span class="resourceCh" name="' + key + '" value="' + info.resourceDic[key] + '" type="checkbox"></span>' +
					'</div>';
			}
			$('#resourceContent').html(str);
			$('.resourceCh').on('click', function(){
				$(this).hasClass('on') ? 
					$(this).removeClass('on') :
					$(this).addClass('on');
			});
		},
		initPickers: function(index, el, tarEl, vals, layer) {
			var _this = this;
			_this.userPicker[index] = new mui.PopPicker({
				layer: layer
			});
			_this.userPicker[index].setData(vals);
			_this.showUserPickerButton[index] = document.getElementById(el);
			_this.userResult[index] = document.getElementById(tarEl);
			_this.showUserPickerButton[index].addEventListener('tap', function(event) {
				_this.userPicker[index].show(function(items) {
					if(layer == 1) {
						document.getElementById(tarEl).nodeName === 'INPUT' || document.getElementById(tarEl).nodeName === 'TEXTAREA' ?
							(_this.userResult[index].value = items[0]['text']) :
							(_this.userResult[index].innerHTML = items[0]['text']);
							_this.userResult[index].setAttribute("sendKey", items[0]['value']);
					} else {
						//只显示第二级的数据
						document.getElementById(tarEl).nodeName === 'INPUT' || document.getElementById(tarEl).nodeName === 'TEXTAREA' ?
							(_this.userResult[index].value = items[0]['text'] + items[1]['text']) :
							(_this.userResult[index].innerHTML = items[0]['text'] + ' ' + items[1]['text']);
						_this.userResult[index].setAttribute("sendKey", items[0]['value']);
						if(tarEl == 'disease') {
							document.getElementById(tarEl).setAttribute('diseaseid', items[1]['value']);
							_this.userResult[index].setAttribute("sendKey", items[1]['value']);
						} else if(tarEl == 'location') {
							document.getElementById(tarEl).setAttribute('locationid', items[1]['value']);
							_this.userResult[index].setAttribute("sendKey", items[1]['value']);
						}
					}

				});
			}, false);
		},
		bind: function() {
			$('#resourceBox').on('click', function() {
				$('#resourceContainer, #resourceContainer .selectContainer').show();
			});
			$('#highRiskBox').on('click', function() {
				$('#highRiskContainer, #highRiskContainer .selectContainer').show();
			});
			$('.resource-btn').on('click', function() {
				var res = info.getCheckVal('resourceCh');
				$('#resource').val(res.checkVal.join('')).attr('sendKey', res.checkKey.join(','));
				$('.selectBg').hide();
			});
			$('.highRisk-btn').on('click', function() {
				var res = info.getCheckVal('highRiskCh');
				$('#highRisk').val(res.checkVal.join('')).attr('sendKey', res.checkKey.join(','));
				$('.selectBg').hide();
			});
			$('.submit').on('click', function(){
				info.submit();
			});
			$('#profileBox').on('click', function(){
				//头像框点击选择
				var html = '';
				wx.ready(function(){
					wx.chooseImage({
						count:1,
						sizeType:['original','compressed'],
						sourceType: ['album', 'camera'],
						success:function(res){
							info.localIds = res.localIds;
							$('#preview').attr('src', info.localIds);
//							info.previewImage();
							wx.uploadImage({
								localId:info.localIds[0].toString(),
								isShowProgressTips:1,
								success:function(res){
									var d = res.serverId;
									info.serverId = d;
									info.upLoadImg();
								},
								error:function(){
									medtapCore.winPop('图片上传失败~')
								}
							})
						}
					})
				})
			});
		},
		upLoadImg: function(){
			$.ajax({
				url:'https://gateway.medtap.cn/common/uploadWechatFile',
				type:'post',
				data:medtapCore.setToken({
					bizType:"3",
					folder:'picture/user/' + info.wechatId, //wechatId
					mediaId:info.serverId,
					ext:'jpg'
				}),
				success:function(data){
					if(data.success == true){
						var res = data.content;
						var imgKey = res.ossKey;
						info.imgList = imgKey + ',';
					}
				}
				
			});
		},
		getCheckVal: function(className) {
			var rdsObj = document.getElementsByClassName(className);
			var checkVal = new Array(),
				checkKey = new Array();
			var k = 0;
			for(i = 0; i < rdsObj.length; i++) {
				if(rdsObj[i].className.indexOf('on') > -1) {
					checkVal[k] = rdsObj[i].getAttribute('value');
					checkKey[k] = rdsObj[i].getAttribute('name');
					k++;
				}
			}
			return {
				checkKey: checkKey,
				checkVal: checkVal
			};
		},
		getUserInfo: function() {
			if(!!window.localStorage.appUserData == false){
				alert('未能获取到本地用户数据');
			}
			var wechatId = JSON.parse(window.localStorage.appUserData).wechatId;
			info.wechatId = wechatId;
			medtapCore.jzz(1);
			$.ajax({
				url: 'https://gateway.medtap.cn/app/user/getUserDetailByParam',
				headers: {
					appType: 'wechat'
				},
				type: 'get',
				data: medtapCore.setToken({
					wechatId: wechatId
				}),
				async: true,
				success: function(data) {
					medtapCore.jzz(0);
					if(data.success == true) {
						var info = data.content;
						//头像   info.profile
						$('#preview').attr('src', !!info.profile ? info.profile : '').css('opacity', 1);
						$('#username').val(!!info.username ? info.username : '');
						$('#nickname').val(!!info.nickname ? info.nickname : '');
						$('#mobile').val(!!info.mobile ? info.mobile : '');
						$('#sex').val(!!info.sex ? (info.sex=='M' ? '男' : '女') : '未填写');
						$('#birthday').val(!!info.birthday ? info.birthday : '');
						$('#height').val(!!info.height ? info.height : '');
						$('#weight').val(!!info.weight ? info.weight : '');
						$('#disease').val(!!info.attentionDisease ? info.attentionDisease : '').attr('sendKey', !!info.attentionDiseaseCode ? info.attentionDiseaseCode : '');
						$('#health').val(!!info.healthType ? info.healthType : '').attr('sendKey', !!info.healthTypeCode ? info.healthTypeCode : '');
						$('#healthInsurance').val(!!info.healthInsuranceType ? info.healthInsuranceType : '').attr('sendKey', !!info.healthInsuranceTypeCode ? info.healthInsuranceTypeCode : '');
						$('#location').val(!!info.location ? info.location : '');
						$('#highRisk').val(!!info.highRiskFactor ? info.highRiskFactor : '').attr('sendKey', !!info.highRiskFactorCode ? info.highRiskFactorCode : '');
						$('#p-history').val(!!info.previousHistory ? info.previousHistory : '');
						$('#o-history').val(!!info.operationHistory ? info.operationHistory : '');
						$('#d-history').val(!!info.drugHistory ? info.drugHistory : '');
						$('#m-history').val(!!info.medicineHistory ? info.medicineHistory : '');
						$('#resource').val(!!info.attentionResource ? info.attentionResource : '').attr('sendKey', !!info.attentionResourceCode ? info.attentionResourceCode : '');
					}
				},
				error: function(err){
					medtapCore.jzz(0);
				}
			});
		},
		submit: function(){
			var sex = $('#sex').val();
			sex = !!sex ? (sex == '男' ? 'M' : 'F') : '';
			if(!!window.localStorage.appUserData == false){
				alert('请在微信上打开');
			}
			var wechatId = JSON.parse(window.localStorage.appUserData).wechatId;
			var requestData = {
				wechatId: wechatId,
				username: $('#username').val(),
				nickname: $('#nickname').val(),
				mobile: $('#mobile').val(),
				sex: sex,
				birthday: $('#birthday').val(),
				height: $('#height').val(),
				weight: $('#weight').val(),
				attentionDisease: $('#disease').attr('sendKey'),
				healthType: $('#health').attr('sendKey'),
				healthInsuranceType: $('#healthInsurance').attr('sendKey'),
				cityId: $('#location').attr('locationid'),
				highRiskFactor: $('#highRisk').attr('sendKey'),
				previousHistory: $('#p-history').val(),
				operationHistory: $('#o-history').val(),
				drugHistory: $('#d-history').val(),
				medicineHistory: $('#m-history').val(),
				attentionResource: $('#resource').attr('sendKey')
			};
			
			if(info.imgList.length > 0){
				requestData.profile = info.imgList.substring(0,info.imgList.length-1);
			}
			
			$.ajax({
				url: 'https://gateway.medtap.cn/app/user/updateUserInfo',
				type: 'post',
				data: JSON.stringify(medtapCore.setToken(requestData)),
				async: true,
				headers: {
					'appType': 'wechat'
				},
				contentType: "application/json",
				dataType: 'json',
				success: function(data) {
					medtapCore.jzz(0);
					if(data.success == true) {
						alert('保存个人信息成功');
						window.location.reload();
					}else{
						mui.alert(data.resultDesc);
					}
				},
				error: function(err){
					medtapCore.jzz(0);
				}
			});
			
		}
	};

	info.init();
	info.bind();
});