define(['zepto', 'medtapCore', 'https://review-formal.iplusmed.com/Common/javaScript/beforeSubmit.js', 'mui', 'mui.picker'], function($, medtapCore, beforeSubmit, mui) {
	console.log(beforeSubmit);
	var consult = {
		userPicker: [],
		showUserPickerButton: [],
		userResult: [],
		showUserPickerButton: [],
		applyType: null,
		en: medtapCore.getRequest('en'),
		form: medtapCore.getRequest('form'),
		mfrs: medtapCore.getRequest('mfrs'),
		formDic: [{
				text: '注射剂',
				value: 'ZSJ'
			},
			{
				text: '片剂',
				value: 'PJ'
			},
			{
				text: '胶囊',
				value: 'JN'
			},
			{
				text: '预充针',
				value: 'YCZ'
			},
			{
				text: '乳剂',
				value: 'RJ'
			},
			{
				text: '不清楚',
				value: 'BQC'
			}
		],
		requirementDic: [{
				text: '价格比较',
				value: '1'
			},
			{
				text: '了解资讯',
				value: '2'
			},
			{
				text: '寻找购买途径',
				value: '3'
			},
			{
				text: '不确定',
				value: '4'
			}
		],
		willPayDic: [{
				text: '是',
				value: '1'
			},
			{
				text: '否',
				value: '2'
			}
		],
		msgDic: {
			'medicineName': '请先输入药品名',
			'medicineForm': '请先选择剂型',
			'require': '请先选择需求',
			'contactName': '请先填写联系人姓名',
			'contactMobile': '请先填写手机号码'
		},
		init: function() {
			consult.applyType = medtapCore.getRequest('applyType');
			if(!!consult.applyType == false) {
				mui.alert('无法获取到参数，请返回首页后重试');
				return;
			}
			document.getElementById('medicineName').value = !!consult.en ? consult.en : '';
			document.getElementById('medicineForm').value = !!consult.form ? consult.form : '';
			document.getElementById('manufacturer').value = !!consult.mfrs ? consult.mfrs : '';
			consult.initPickers(1, 'formBox', 'medicineForm', consult.formDic);
			consult.initPickers(2, 'requirementBox', 'require', consult.requirementDic);
			consult.initPickers(3, 'chargeWillFlgBox', 'chargeWillFlg', consult.willPayDic);
		},
		initPickers: function(index, el, tarEl, vals) {
			var _this = consult;
			_this.userPicker[index] = new mui.PopPicker();
			_this.userPicker[index].setData(vals);
			_this.showUserPickerButton[index] = document.getElementById(el);
			_this.userResult[index] = document.getElementById(tarEl);
			_this.showUserPickerButton[index].addEventListener('tap', function(event) {
				_this.userPicker[index].show(function(items) {
					document.getElementById(tarEl).nodeName === 'INPUT' ?
						(_this.userResult[index].value = items[0]['text']) :
						(_this.userResult[index].innerHTML = items[0]['text']);
				});
			}, false);
		},
		bind: function() {
			$('.submit').click(function() {
				var flag = true,
					msg = '';
				$('#form input.required').each(function() {
					if(!!$(this).val() == false) {
						flag = false;
						msg = consult.msgDic[$(this).attr('id')];
						return false;
					}
				});
				flag ? consult.submit() : mui.alert(msg);
			});
		},
		submit: function() {
			var type = '';
			if(consult.applyType == 1) {
				type = 'QQZY';
			} else if(consult.applyType == 2) {
				type = 'GNZY';
			}
			var appUserData = JSON.parse(window.localStorage.appUserData);
			var wechatId = appUserData.wechatId;
			if(!medtapCore.isWeChat()) {
				alert('请在微信上打开页面');
				return;
			}
			beforeSubmit.config({
				wechatId: wechatId,
				getInfo: true,
				success: function() {
					_inner();
				}
			}).init();

			function _inner() {
				medtapCore.jzz(1);
				$.ajax({
					url: 'https://devgw.medtap.cn/service/drug/saveDrugPurchase',
					contentType: "application/json",
					type: 'post', 
					async: true,
					headers: {
						"appType": "wechat"
					},
					dataType: 'json',
					data: JSON.stringify(medtapCore.setToken({
						wechatId: wechatId,
						applyType: type,
						medicineName: $('#medicineName').val(),
						formulation: $('#medicineForm').val(),
						manufacturer: $('#manufacturer').val(),
						contactName: $('#contactName').val(),
						contactMobile: $('#contactMobile').val(),
						requirement: $('#require').val(),
						chargeWill: $('#chargeWillFlg').val() == '是' ? true :  false,
						remark: $('#remark').val()
					})),
					success: function(data) {
						medtapCore.jzz(0);
						if(data.success) {
							window.location.href = 'msgSuccess.html?v=1.0.0&msgType=2&title=' + medtapCore.getRequest('title') + '&id=' + data.content.drugPurchaseVO.applySn;
						} else {
							window.location.href = 'msgWarn.html?v=1.0.0&msgType=2&title=' + medtapCore.getRequest('title');
						}
					},
					error: function(err) {
						medtapCore.jzz(0);
						console.log(err);
					}
				});
			}
		}
	};

	consult.init();
	consult.bind();
});