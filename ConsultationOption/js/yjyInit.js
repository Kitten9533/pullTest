define(['zepto', 'https://cdn.bootcss.com/blueimp-md5/2.10.0/js/md5.min.js'], function($, md5) {
	! function(a) {
		function i(a, b, c, d) {
			return Math.abs(a - b) >= Math.abs(c - d) ? a - b > 0 ? "Left" : "Right" : c - d > 0 ? "Up" : "Down"
		}

		function j() {
			f = null, b.last && (b.el.trigger("longTap"), b = {})
		}

		function k() {
			f && clearTimeout(f), f = null
		}

		function l() {
			c && clearTimeout(c), d && clearTimeout(d), e && clearTimeout(e), f && clearTimeout(f), c = d = e = f = null, b = {}
		}

		function m(a) {
			return("touch" == a.pointerType || a.pointerType == a.MSPOINTER_TYPE_TOUCH) && a.isPrimary
		}

		function n(a, b) {
			return a.type == "pointer" + b || a.type.toLowerCase() == "mspointer" + b
		}
		var c, d, e, f, h, b = {},
			g = 750;
		a(document).ready(function() {
			var o, p, s, t, q = 0,
				r = 0;
			"MSGesture" in window && (h = new MSGesture, h.target = document.body), a(document).bind("MSGestureEnd", function(a) {
				var c = a.velocityX > 1 ? "Right" : a.velocityX < -1 ? "Left" : a.velocityY > 1 ? "Down" : a.velocityY < -1 ? "Up" : null;
				c && (b.el.trigger("swipe"), b.el.trigger("swipe" + c))
			}).on("touchstart MSPointerDown pointerdown", function(d) {
				(!(t = n(d, "down")) || m(d)) && (s = t ? d : d.touches[0], d.touches && 1 === d.touches.length && b.x2 && (b.x2 = void 0, b.y2 = void 0), o = Date.now(), p = o - (b.last || o), b.el = a("tagName" in s.target ? s.target : s.target.parentNode), c && clearTimeout(c), b.x1 = s.pageX, b.y1 = s.pageY, p > 0 && 250 >= p && (b.isDoubleTap = !0), b.last = o, f = setTimeout(j, g), h && t && h.addPointer(d.pointerId))
			}).on("touchmove MSPointerMove pointermove", function(a) {
				(!(t = n(a, "move")) || m(a)) && (s = t ? a : a.touches[0], k(), b.x2 = s.pageX, b.y2 = s.pageY, q += Math.abs(b.x1 - b.x2), r += Math.abs(b.y1 - b.y2))
			}).on("touchend MSPointerUp pointerup", function(f) {
				(!(t = n(f, "up")) || m(f)) && (k(), b.x2 && Math.abs(b.x1 - b.x2) > 30 || b.y2 && Math.abs(b.y1 - b.y2) > 30 ? e = setTimeout(function() {
					b.el.trigger("swipe"), b.el.trigger("swipe" + i(b.x1, b.x2, b.y1, b.y2)), b = {}
				}, 0) : "last" in b && (30 > q && 30 > r ? d = setTimeout(function() {
					var d = a.Event("tap");
					d.cancelTouch = l, b.el.trigger(d), b.isDoubleTap ? (b.el && b.el.trigger("doubleTap"), b = {}) : c = setTimeout(function() {
						c = null, b.el && b.el.trigger("singleTap"), b = {}
					}, 250)
				}, 0) : b = {}), q = r = 0)
			}).on("touchcancel MSPointerCancel pointercancel", l), a(window).on("scroll", l)
		}), ["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap"].forEach(function(b) {
			a.fn[b] = function(a) {
				return this.on(b, a)
			}
		})
	}(Zepto);
    
	$.getRequest = function(strParame) { //用于取url中参数的值方法
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
	$.pop = function(msg) { //用于pop提示效果的方法，提示文字为参数如$.winPop("加载失败")；
		var b = $("body");
		b.append("<div class='winPop'>" + msg + "</div>");
		var a = setTimeout(function() {
			var a = $(".winPop");
			a.remove();
			clearTimeout(a);
		}, 3000);
	};
	$.isWx = function() { //判断是否是微信的webview方法
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		}
		return false;
	}
	$.fetchData = function(opts) {
//		var baseUrl = "http://jumpbox.medtap.cn:8888";
		var baseUrl = "https://api.iplusmed.com";
		var jiekouUrl = opts.url || '';

		if(/.*(\.json)$/.test(jiekouUrl)) {} else {
			jiekouUrl = baseUrl + jiekouUrl;
		}
		var canshu = {
			accountId: '',
			globalDeviceRom: '',
			globalAppVersion: "200",
			globalAppType: 1,
			globalDeviceModel: '',
			globalDeviceType: "APP"
		}
		if(localStorage.appUserData) {
			canshu = JSON.parse(localStorage.appUserData);
		}

		var ajaxCanshu = opts.data || '';
		if(ajaxCanshu != "") {
			for(var i in ajaxCanshu) {
				canshu[i] = ajaxCanshu[i];
			}
		}
		var async = true;
		if(opts.async != undefined) {
			async = opts.async;
		}
		$.ajax({ //加载问题的回答
			url: jiekouUrl,
			data: canshu,
			type: opts.type || 'post',
			dataType: 'json',
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
	$.next = function(opts) { //参数举例，以对象形式展示        
		var a = "";
		a += opts.url; //url:"prdouctDetai.html",//需要跳转的url
		if(opts.keys) {
			a += "?v=1.0.0";
			for(i in opts.keys) { //keys:{}url中所带的参数
				a += "&" + i + "=" + opts.keys[i]
			}
		}

		if($.isWx()) {
			if(opts.replaceOld) { //replaceOld:true,//微信页面跳转是否覆盖原页面
				location.replace(a);
			} else {
				window.location.href = a;
			}
		} else {


			if(opts.isLocal){

				window.location.href = a;
				return;
			}

			if(opts.closeOld) { //closeOld:true//app中页面跳转之后是否关闭原来页面
				window.location.href = window.webviewUrl + a;
				setTimeout(function() {
					window.location.href = "FF499211739FD801USER://kRouteCloseWebView";
				}, 0)
			} else {
				window.location.href = window.webviewUrl + a;
			}
		}
	}
	$.back = function() { //用于关闭当前页面的方法
		if($.isWx()) {
			history.back();
		} else {
			window.location.href = "FF499211739FD801USER://kRouteCloseWebView";
		}
	}
	
	$.setToken = function(obj) {
    	function isArray(o){
			return Object.prototype.toString.call(o)=='[object Array]';
		}
		function sortByKey(ob){
			var arr = [], newObj = {};
			for(var key in ob){
				arr.push(key);
			}
			arr = arr.sort();
			arr.forEach(function(key){
				(!!ob[key] || typeof(ob[key]) === 'boolean' || ob[key] === 0) && (newObj[key] = ob[key]);
			});
			arr = null;
			return newObj;
		}
		function getStr(ob){
			var str = [];
			for(var key in ob){
				str.push(key + '=' + (isArray(ob[key]) ? '["' + ob[key].join('","') + '"]' : ob[key]));
			}
			return md5(str.join('&').toLowerCase());
		}
		
		var auth_time_stamp = new Date().getTime().toString(),
			auth_nonce = (parseInt(Math.random() * 10000000000)).toString();
		if(!obj || !typeof(obj) === 'object') {
			obj = {};
		}
		else{
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

	
	window.webviewUrl="FF499211739FD801USER://web/url/https://cdn.iplusmed.com/web/FF499211739FD801USER/consultationOperations/";

});