define(['zepto', 'md5'], function($, md5) {

	/**
	 * localStorage.isOnLine:"false" 为测试服，其他为正式服
	 * localStorage.globalAppType:"0" 为医生端，"1"为用户端
	 *
	 */

	/**
	 * 判断app医生端、用户端
	 * @returns {*} globalAppType
	 */
	var getGlobalAppType = function() {
		var globalAppType = '1';
		if(localStorage.medtapGlobalData) {
			globalAppType = JSON.parse(localStorage.medtapGlobalData).globalAppType;
		}
		return globalAppType;
	}
	/**
	 * 获取接口数据
	 * @param opts
	 * @param isWechat  微信端接口baseurl切换
	 */
	var fetchData = function(opts, isWechat) {
		var baseUrl = getUrlByPort();
		if(isWechat) {
			baseUrl = getUrlByPort() + "/wechat/";
		}
		var interfaceUrl = opts.url || '';

		if(/.*(\.json)$/.test(interfaceUrl)) {} else {
			interfaceUrl = baseUrl + interfaceUrl;
		}
		var params = {};
		if(localStorage.medtapGlobalData) {
			params = JSON.parse(localStorage.medtapGlobalData);
		}
		var ajaxPrams = opts.data || '';
		if(ajaxPrams != "") {
			for(var i in ajaxPrams) {
				params[i] = ajaxPrams[i];
			}
		}
		var async = true;
		if(opts.async != undefined) {
			async = opts.async;
		}
		var type = "application/x-www-form-urlencoded";
		if(opts.contentType == "application/json") {
			type = "application/json";
			params = JSON.stringify(params);
		}
		$.ajax({ //加载问题的回答
			url: interfaceUrl,
			data: params,
			type: opts.type || 'post',
			dataType: 'json',
			contentType: type,
			async: async,
			success: function(data) {
				if(opts.success) {
					var a = data;
					opts.success(a);

				}

			},
			error: function(data) {
				if(opts.error) {
					var a = data;
					opts.error(a);
				}
			}
		});

	}

	// 判断是否手机设备
	var isApp = function() {
		var isAndroid = (/android/gi).test(navigator.userAgent);
		var isIOS = (/iphone|ipad/gi).test(navigator.userAgent);
		var isWeChat = (/MicroMessenger/gi).test(navigator.userAgent);
		if((isAndroid || isIOS) && !isWeChat) {
			return true;
		} else {
			return false;
		}
	};
	// 判断是否微信端
	var isWeChat = function() {
		var weChat = (/MicroMessenger/gi).test(navigator.userAgent);
		if(weChat) {
			return true;
		} else {
			return false;
		}
	};
	// 获取链接参数
	var getRequest = function(strParame) {
		var args = new Object();
		var query = window.location.search.substring(1);
		var pairs = query.split("&");
		for(var i = 0; i < pairs.length; i++) {
			var pos = pairs[i].indexOf('=');
			if(pos == -1) continue;
			var argname = pairs[i].substring(0, pos);
			var value = pairs[i].substring(pos + 1);
			value = decodeURIComponent(value);
			args[argname] = value;
		}
		args[strParame] = args[strParame] || "";
		return args[strParame];
	};
	// 获取接口地址
	var getUrlByPort = function() {
		var isOnline = localStorage.isOnLine;
		if(isOnline && isOnline === "false") {
			return "http://test.iplusmed.com:80"
		} else {
			return "https://api.iplusmed.com";
		}
	};
	// 打开新页面
	var pushNewWindow = function(param, callback) {
		if(isWebAPI() && WebAPI.pushNewWindow) {
			if(param.indexOf("http") < 0) {
				param = cutUrl() + param;
			}
			if(callback) {
				WebAPI.pushNewWindow(encodeURI(param), callback)
			} else {
				WebAPI.pushNewWindow(encodeURI(param))
			}
		} else {
			var relativeHead = cutUrl();
			if(param.indexOf("http") == 0) {
				relativeHead = '';
			}
			if(getPrefix()) {
				window.location.href = getPrefix() + "web/url/" + relativeHead + encodeURI(param);
			} else {
				window.location.href = relativeHead + encodeURI(param);
			}
		}
	};
	//替換当前页面
	var replaceNewWindow = function(param) {
		if(param.indexOf("http") < 0) {
			param = cutUrl() + param;
		}
		if(isApp()) {
			pushNewWindow(param);
			setTimeout(function() {
				window.location.href = getPrefix() + "kRouteCloseWebView";
			}, 100);
		} else {
			window.location.replace(param);
		}
	}

	// 关闭当前webview(当前窗口在顶层时有动画效果，不在顶层时无动画效果)
	var popWindow = function(param) {
		if(isWebAPI() && WebAPI.popWindow) {
			WebAPI.popWindow();
		} else {
			if(getPrefix()) {
				window.location.href = getPrefix() + "kRouteCloseWebView";
			} else {
				history.back();
			}
		}
	};

	/**
	 * 以下为内部方法
	 */
	// 截取地址栏中的地址
	var cutUrl = function() {
		var targetUrl = window.location.href;
		var end = targetUrl.lastIndexOf('/') + 1;
		return targetUrl.substring(0, end)
	};
	// 设置跳转前缀
	var getPrefix = function() {
		if(isApp() && getGlobalAppType() == "0") {
			return 'FF499211739FD801DOCTOR://';
		} else if(isApp() && getGlobalAppType() == "1") {
			return 'FF499211739FD801USER://';
		} else {
			return '';
		}
	};

	/**pop成功提示
	 * @param str
	 * @param duration 弹出持续时长
	 */
	var popupSuccessToast = function(str, duration) {
		if(isWebAPI() && WebAPI.popupSuccessToast) {
			if(duration) {
				WebAPI.popupSuccessToast(str, duration);
			} else {
				WebAPI.popupSuccessToast(str);
			}

		}
	}
	/**pop失败提示
	 * @param str
	 * @param duration 弹出持续时长
	 */
	var popupErrorToast = function(str, duration) {
		if(isWebAPI() && WebAPI.popupErrorToast) {
			if(duration) {
				WebAPI.popupErrorToast(str, duration);
			} else {
				WebAPI.popupErrorToast(str);
			}

		}
	}
	//获取公参
	var getAPPInfo = function(callback) {
		if(isWebAPI() && WebAPI.getAPPInfo) {
			WebAPI.getAPPInfo(function(data) {
				callback(JSON.stringify(data));
			})
		}
	}
	//获取用户信息
	var getCurrentUser = function(callback) {
		if(isWebAPI() && WebAPI.getCurrentUser) {
			WebAPI.getCurrentUser(function(data) {
				callback(JSON.stringify(data));
			})
		}
	}
	//弹出带有菊花的进度条
	var popupActivityIndicator = function(message) {
		if(isWebAPI() && WebAPI.popupActivityIndicator) {
			WebAPI.popupActivityIndicator(message);
		}
	}
	//关闭菊花
	var dismissActivityIndicator = function() {
		if(isWebAPI() && WebAPI.dismissActivityIndicator) {
			WebAPI.dismissActivityIndicator();
		}
	}
	/**
	 * @param methodName
	 * @param params:方法参数值数组[1,'sd']
	 */
	var callLast = function(methodName, params) {
		if(isWebAPI() && WebAPI.callLast) {
			if(params && params.length > 0) {
				WebAPI.callLast(methodName, params);
			} else {
				WebAPI.callLast(methodName, []);
			}

		}
	}
	/**
	 *         所有参数非必填
	 * @param title 标题
	 * @param message 提示内容
	 * @param okButtonName 右边“确定”按钮的文本
	 * @param cancelButtonName 左边“取消”按钮的文本
	 * @param successBack 确定按钮回调
	 */
	var alerts = function(title, message, cancelButtonName, okButtonName, successBack) {
		if(isWebAPI() && WebAPI.alert) {
			WebAPI.alert(title, message, cancelButtonName, okButtonName, successBack);
		}
	}
	//分享
	var showShareView = function(title, content, imgUrl, linkUrl, success) {
		if(isWebAPI() && WebAPI.showShareView) {
			WebAPI.showShareView(title, content, imgUrl, linkUrl, function(resp) {
				if(resp) {
					var jsonStr = resp.replace(/\'/g, '"');
					success(JSON.parse(jsonStr))
				} else {
					success();
				}
			});
		}
	}
	//设置title
	var setTitle = function(title) {
		if(isWebAPI() && WebAPI.setTitle) {
			WebAPI.setTitle(title);
		}
	}
	//信息提示3秒消失，popupSuccessToast、popupErrorToast控件之后替代该效果。
	var pop = function(msg) {
		var b = $("body");
		b.append("<div class='winPop'>" + msg + "</div>");
		var a = setTimeout(function() {
			var a = $(".winPop");
			a.remove();
			clearTimeout(a);
		}, 3000);
	};
	var winPop = function(msg) { //用于pop提示效果的方法，提示文字为参数如$.winPop("加载失败")；
		var b = $("body");
		b.append("<div class='winPop'>" + msg + "</div>");
		var a = setTimeout(function() {
			var a = $(".winPop");
			a.remove();
			clearTimeout(a);
		}, 3000);
	}
	var jzz = function(opt) { //用于显示加载中效果的方法，参数1代表显示效果，0代表隐藏效果
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

	var getHeaders = function(localKey) {
		function isApp() {
			var isAndroid = (/android/gi).test(navigator.userAgent);
			var isIOS = (/iphone|ipad/gi).test(navigator.userAgent);
			var isWeChat = (/MicroMessenger/gi).test(navigator.userAgent);
			if((isAndroid || isIOS) && !isWeChat) {
				return true;
			} else {
				return false;
			}
		}
		var headers = {};
		if(!localKey) {
			localKey = 'appUserData';
		}
		if(isApp()) {
			var globalData = JSON.parse(localStorage[localKey]);
			headers['appType'] = globalData.appType;
			headers['agentNum'] = globalData.agentNum;
		} else {
			headers['appType'] = 'wechat';
		}
		return headers;
	}

	var getPostData = function(localKey) {
		var postData = {};
		if(!localKey) {
			localKey = 'appUserData';
		}
		if(isApp()) {
			postData.token = JSON.parse(localStorage[localKey]).token;
		} else {
			var wechatId = getRequest('wechatId');
			postData.wechatId = !!wechatId ? wechatId : JSON.parse(localStorage[localKey]).wechatId;
		}
		return postData;
	};

	// 判断新版本是否有WebAPI对象
	function isWebAPI() {
		if(typeof WebAPI == "undefined") {
			return false;
		} else {
			return true;
		}
	};

	function setToken(obj) {
		function isArray(o) {
			return Object.prototype.toString.call(o) == '[object Array]';
		}

		function sortByKey(ob) {
			var arr = [],
				newObj = {};
			for(var key in ob) {
				arr.push(key);
			}
			arr = arr.sort();
			arr.forEach(function(key) {
				(!!ob[key] || typeof(ob[key]) === 'boolean' || ob[key] === 0) && (newObj[key] = ob[key]);
			});
			arr = null;
			return newObj;
		}

		function getStr(ob) {
			function judge(arr) {
				var a = [];
				[].forEach.call(arr, function(ar) {
					typeof ar === 'object' ?
						a.push(JSON.stringify(ar)) :
						(typeof ar === 'number' ? a.push(ar) : a.push('"' + ar.toString() + '"'));
				});
				return a.join(',');
			}
			var str = [];
			for(var key in ob) {
				str.push(key + '=' + (isArray(ob[key]) ? '[' + judge(ob[key]) + ']' : ob[key]));
			}
			return md5(str.join('&').toLowerCase());
		}

		var auth_time_stamp = new Date().getTime().toString(),
			auth_nonce = (parseInt(Math.random() * 10000000000)).toString();
		if(!obj || !typeof(obj) === 'object') {
			obj = {};
		} else {
			obj = sortByKey(obj);
		}
		obj.auth_time_stamp = auth_time_stamp
		obj.auth_nonce = auth_nonce;
		obj.auth_secret_key = '733828MTIzNDU2CShFp1468889281801r9uV0aajI10';
		obj.auth_sign = getStr(obj);
		delete obj['auth_secret_key'];
		return obj;
	}

	var oldAlert = window.alert;

	window.alert = function(msg) {
		var iframe = document.createElement("IFRAME");
		iframe.style.display = "none";
		iframe.setAttribute("src", 'data:text/plain,');
		document.documentElement.appendChild(iframe);
		window.frames[0].window.alert(msg);
		iframe.parentNode.removeChild(iframe);
	}

	//	var _ajax = $.ajax;
	//	
	//	$.ajax = function(o){
	//		var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	//		if(!!getRequest('wechatId')){
	//			o = _extends({}, o, { headers: _extends({}, o.headers, { "agent-num": getRequest('wechatId') }) });
	//		}
	//		_ajax(o);
	//	}

	//暴露本模块的API给外部使用0.

	return {
		isApp: isApp,
		isWeChat: isWeChat,
		getRequest: getRequest,
		getUrlByPort: getUrlByPort,
		pushNewWindow: pushNewWindow,
		replaceNewWindow: replaceNewWindow,
		popupSuccessToast: popupSuccessToast,
		popupErrorToast: popupErrorToast,
		getAPPInfo: getAPPInfo,
		getCurrentUser: getCurrentUser,
		popupActivityIndicator: popupActivityIndicator,
		dismissActivityIndicator: dismissActivityIndicator,
		callLast: callLast,
		alert: alerts,
		showShareView: showShareView,
		setTitle: setTitle,
		popWindow: popWindow,
		getPrefix: getPrefix,
		fetchData: fetchData,
		getGlobalAppType: getGlobalAppType,
		pop: pop,
		jzz: jzz,
		winPop: winPop,
		setToken: setToken,
		getHeaders: getHeaders,
		getPostData: getPostData
	}
});