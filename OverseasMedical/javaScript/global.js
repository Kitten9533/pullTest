var accountId = "";
var token = "";
var	globalDeviceRom = "";
var	globalAppVersion = "";
var	globalAppType = "";
var	globalDeviceModel = "";
var	globalDeviceType = "";
var deviceId = "";
var unloginMessage = "请先登录/注册易加医！" 

/*百度统计*/
var _hmt = _hmt || [];
	(function() {
	  var hm = document.createElement("script");
	  hm.src = "//hm.baidu.com/hm.js?da38c6a4c1e21f6f39023eba3ba9feb8";
	  var s = document.getElementsByTagName("script")[0]; 
	  s.parentNode.insertBefore(hm, s);
	})();


/**
 * @description 根据UA 返回访问链接
 * @return {String} 访问链接
 */
function getBaseUrl() {
	if(isWeChat()){
//		return 'http://192.168.8.181:8020/2017.10.09/webPageReview/TestModule/TstCommon/pages/OverseasMedical/';
		return 'https://review-formal.iplusmed.com/wxPayPrd/OverseasMedical/';
	}
	if (isMobile()) {
		// ios访问链接 FF499211739FD801USER://web/url/
		return "FF499211739FD801USER://web/url/http://cdn.iplusmed.com/apphtml/FF499211739FD801USER/";/*手机上访问FF499211739FD801USER://web/url/*/
//		return "http://127.0.0.1:8020/apphtml/FF499211739FD801USER/";
	} else {
		// 其他访问链接
		//return "http://127.0.0.1:8020/work/FF499211739FD801USER/"//本地测试
		return "https://cdn.iplusmed.com/apphtml/FF499211739FD801USER/";//正式服
	}
};


function getPrefixUrl() {
	
		return "";/*手机上访问*/
	
};

/**
 * @param {Object} type 
 */
function getInterfaceBaseUrl() {
//	return 'http://192.168.8.8:8888'/*本地*/
	return 'https://api.iplusmed.com';/*正式服*/
//	return 'http://test.iplusmed.com:80';/*测试服*/
};

/**
 * @param {Object} strParame 传入参数
 * @return {String} 参数值
 */
function getRequest(strParame) {
	var args = new Object();
	var query = location.search.substring(1);

	var pairs = query.split("&"); // Break at ampersand 
	for (var i = 0; i < pairs.length; i++) {
		var pos = pairs[i].indexOf('=');
		if (pos == -1) continue;
		var argname = pairs[i].substring(0, pos);
		var value = pairs[i].substring(pos + 1);
		value = decodeURIComponent(value);
		args[argname] = value;
	}
	return args[strParame];
}
function isMobile() {
	return navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i);
}
function isWeChat() {
    var weChat = (/MicroMessenger/gi).test(navigator.userAgent);
    if (weChat) {
        return true;
    } else {
        return false;
    }
};
function isHidden(a){/*锁定滚动条*/
	if(a==true){
		$('body').css('overflow-y','hidden');
		$('#container .opacity').show();
	}else{
		$('body').css('overflow-y','scroll');
		$('#container .opacity').hide();
	}
	
}
