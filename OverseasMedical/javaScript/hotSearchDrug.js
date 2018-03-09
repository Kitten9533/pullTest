define(['zepto', 'MedtapCore'], function($, medtapCore) {
	var infoList = {
		applyType: null,
		ui: {
			drug: $('#drug')
		},
		data: {
			//表名，药物名称，（英），药物名称，（中），制造商
			list: []
		},
		init: function() {
			infoList.applyType = medtapCore.getRequest('applyType');
			if(!!infoList.applyType == false){
				alert('无法获取到参数，请返回首页后重试');
				return;
			}
			medtapCore.fetchData({
				type: 'GET',
				url: './javaScript/hotSearchDrug.json',
				async: false,
				success: function(data) {
					if(data.code == '0') {
						infoList.data.list = data.list;
						window.localStorage['hotSearchDrug'] = data.list;
					}
				},
				error: function(err) {}
			});
		},
		show: function() {
			var str = '';
			[].forEach.call(infoList.data.list, function(item) {
				if(!!item.showTitle) {
					
					if(item.title == '肺癌'){
						str += '<span class="icon icon-lung"></span>';
					}
					else if(item.title == '乳腺癌/妇瘤'){
						str += '<span class="icon icon-women"></span>';
					}else if(item.title == '恶性黑色素瘤'){
						str += '<span class="icon icon-tumor"></span>';
					}else if(item.title == '膀胱癌'){
						str += '<span class="icon icon-bladder"></span>';
					}
					else if(item.title == '其它'){
						str += '<span class="icon icon-other"></span>';
					}
					str += '<p class="drug-title">' + item.title + '</p>';
				} else {
					str += '<p class="no-title"></p>';
				}
				if(!!item.showTitle){
					str += '<table class="drug-table table-header"><tr class="head">' +
					'<td class="first-td padding-left" colspan="2"><p>药物名称</p></td>' +
					'<td class="other-td"><p>通用名</p></td>' +
					'<td class="other-td last-td"><p>厂家</p></td>' +
					'</tr></table>';
				}
				str +='<table class="drug-table"><tr class="detail"><td class="first-td padding-left" colspan="2">';

				if(!!item.en) {
					str += '<p>' + item.en + '</p>';
				}
				if(!!item.form){
					str += '<p class="form">(' + item.form + ')</p>';
 				}
				
				str += '</td><td class="other-td">';
				if(!!item.en_Alias) {
					str += '<p>' + item.en_Alias + '</p>';
				}
				if(!!item.en) {
					str += '<p>' + item.ch + '</p>';
				}
				if(!!item.en_Alias) {
					str += '<p>' + item.ch_Alias + '</p></td>';
				}
				str += '<td class="other-td last-td"><p>' + item.mfrs + '</p></td>' +
					'</tr>' +
					'<tr>' +
					'<td class="icon-base"><span class="icon icon-content"></span></td><td colspan="3" class="introduction padding"><p>' + item.introduction + '</p></td>' +
					'</tr>' +
					'<tr class="link" en=' + item.en + ' form=' + item.form + ' mfrs=' + item.mfrs + '><td><p>咨询购药</p></td></tr>' + 
					'</table>';
			});
			$('.container').height($('body').height() - $('#test').width());
			infoList.ui.drug.html(str);
			$('.other').css('display', 'block');
			$('.link').on('click', function(){
				el = $(this);
				window.location.href = 'purchaseConsulting.html?v=1.0.0&applyType=' + infoList.applyType + '&en=' + el.attr('en') + '&form=' + el.attr('form') + '&mfrs=' + el.attr('mfrs') + '&title=' + medtapCore.getRequest('title');
			});
			$('.other').on('click', function(){
				window.location.href = 'purchaseConsulting.html?v=1.0.0&applyType=' + infoList.applyType + '&title=' + medtapCore.getRequest('title');
			});
		}
	};

	infoList.init();
	infoList.show();
});