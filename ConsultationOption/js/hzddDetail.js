define(['zepto', 'vue', 'yjyInit'], function($, Vue) {
	$("title").text($.getRequest("title"));
	
		var backData = {
		status: {
			statusId: "",
			statusName: "",
		},
		formatRealTime: '',
		consultationId: '',
		diseaseName: '',
		formatExpectedTime: '',
		diseaseDescription: '',
		diseaseDescriptionforbianji: '',
		helpRequirement: '',
		helpRequirementforbianji: '',
		formatCreateTime: '',
		doctorList: [],
		imgList: '',
		hasImg: false,
		btn: {
			isDelBtnShow: false, //删除预约按钮标记
			isCacelBtnShow: false, //取消预约按钮标记
			isTjBtnShow: false, //帮我推荐按钮标记
			isKefuBtnShow: true, //客服按钮
			isFirst: true,
			isBianjiFirst: true, //第一个编辑选项标记
			isSecond: true,
			isBianjiSecond: true //第二个编辑选项标记
		},
		ddaddress: "未确定",
		isDD: false, //是否是电刀来显示地址标记
		isHz: true

	};
	var mod = $('.mod'),
		call = $('.call'),
		order = $('.order'),
		toDelete = $('.toDelete');
	var hzDetail = {
		appointmentId: $.getRequest("listId"),
		getDetailData: function() {
			$.fetchData({
				url: "/medsrv/queryConsultationOperationAppointmentDetail",
				data: {
					appointmentId: hzDetail.appointmentId
					
					

				},
				async: false,
				success: function(data) {
					if(data.code != 0) {
						$.pop(data.message);
						return;
					}
					var a;
					if(data.consultationOperation.consultation) {
						a = data.consultationOperation.consultation;
						backData.isHz = true;

					}
					if(data.consultationOperation.operation) {
						a = data.consultationOperation.operation;
						backData.isDD = true;
						$(".timeList").css("border-bottom","1px solid #E0E0E0");
						backData.isHz = false;

						if(backData.status.statusId == "11" || backData.status.statusId == "90") {
							if(a.province && a.province.provinceName) {
								backData.ddaddress = a.province.provinceName + a.province.city.cityName;
							} else {
								backData.ddaddress = a.province.city.cityName;
							}

						}
					}

					backData.status = a.status;
					backData.formatRealTime = a.formatRealTime;
					backData.consultationId = a.consultationId;
					backData.diseaseName = a.disease.diseaseName;
					backData.formatExpectedTime = a.formatExpectedTime;
					backData.diseaseDescription = a.diseaseDescription;
					backData.helpRequirement = a.helpRequirement;
					backData.formatCreateTime = a.formatCreateTime;
					if(backData.status.statusId == "02" || backData.status.statusId == "09" || backData.status.statusId == "99") {
						backData.formatRealTime = "未确定";
					}
					if(a.firstDoctor) {
						var doc = {
							doctorName: a.firstDoctor.doctorDetail.doctorName,
							departmentName: a.firstDoctor.doctorDetail.department.departmentName,
							skillTitle: a.firstDoctor.doctorDetail.skillTitle.titleName,
							academicTitle: a.firstDoctor.doctorDetail.academicTitle.titleName,
							hospitalName: a.firstDoctor.doctorDetail.hospital.hospitalName,
							isMyDoctor: false,
							doctorId: a.firstDoctor.doctorDetail.doctorId
						};
						if(backData.status.statusId == "11" || backData.status.statusId == "90") {
							if(data.consultationOperation.consultation) {
								if(a.consultationDoctorIndex == "1") {
									doc.isMyDoctor = true;
								}

							}
							if(data.consultationOperation.operation) {
								if(a.operationDoctorIndex == "1") {
									doc.isMyDoctor = true;
								}
							}
						}
						backData.doctorList.push(doc);

					}
					if(a.secondDoctor) {
						doc = {
							doctorName: a.secondDoctor.doctorDetail.doctorName,
							departmentName: a.secondDoctor.doctorDetail.department.departmentName,
							skillTitle: a.secondDoctor.doctorDetail.skillTitle.titleName,
							academicTitle: a.secondDoctor.doctorDetail.academicTitle.titleName,
							hospitalName: a.secondDoctor.doctorDetail.hospital.hospitalName,
							isMyDoctor: false,
							doctorId: a.secondDoctor.doctorDetail.doctorId
						};
						if(backData.status.statusId == "11" || backData.status.statusId == "90") {

							if(data.consultationOperation.consultation) {
								if(a.consultationDoctorIndex == "2") {
									doc.isMyDoctor = true;
								}

							}
							if(data.consultationOperation.operation) {
								if(a.operationDoctorIndex == "2") {
									doc.isMyDoctor = true;
								}
							}
						}
						backData.doctorList.push(doc);

					}
					if(a.doctorName && a.doctorName != "") {
						doc = {
							doctorName: a.doctorName,
							departmentName: "",
							skillTitle: "",
							academicTitle: "",
							hospitalName: a.hospitalName,
							isMyDoctor: false,
							doctorId: ""
						}
						if(backData.status.statusId == "11" || backData.status.statusId == "90") {
							if(data.consultationOperation.consultation) {
								if(a.consultationDoctorIndex == "3") {
									doc.isMyDoctor = true;
								}

							}
							if(data.consultationOperation.operation) {
								if(a.operationDoctorIndex == "3") {
									doc.isMyDoctor = true;
								}
							}
						}
						backData.doctorList.push(doc);

					}
					if(a.isRecommend&&a.recommendDoctor) {

						doc = {
							doctorName: a.recommendDoctor.doctorDetail.doctorName,
							departmentName: a.recommendDoctor.doctorDetail.department.departmentName,
							skillTitle: a.recommendDoctor.doctorDetail.skillTitle.titleName,
							academicTitle: a.recommendDoctor.doctorDetail.academicTitle.titleName,
							hospitalName: a.recommendDoctor.doctorDetail.hospital.hospitalName,
							isMyDoctor: false,
							doctorId: a.recommendDoctor.doctorDetail.doctorId
						};
						if(backData.status.statusId == "11" || backData.status.statusId == "90") {
							if(data.consultationOperation.consultation) {
								if(a.consultationDoctorIndex == "4") {
									doc.isMyDoctor = true;
								}

							}
							if(data.consultationOperation.operation) {
								if(a.operationDoctorIndex == "4") {
									doc.isMyDoctor = true;
								}
							}
						}
						backData.doctorList.push(doc);
					}
					if(backData.status.statusId == "02") { //正在联系
						backData.btn = {
							isDelBtnShow: false, //删除预约按钮标记
							isCacelBtnShow: true, //取消预约按钮标记
							isTjBtnShow: false, //帮我推荐按钮标记
							isKefuBtnShow: true,
							isFirst: true,
							isBianjiFirst: true, //第一个编辑选项标记
							isSecond: true,
							isBianjiSecond: true //第二个编辑选项标记
						}
					}
					if(backData.status.statusId == "09") { //已拒绝
						backData.btn = {
							isDelBtnShow: true, //删除预约按钮标记
							isCacelBtnShow: false, //取消预约按钮标记
							isTjBtnShow: true, //帮我推荐按钮标记
							isKefuBtnShow: false,
							isFirst: false,
							isBianjiFirst: true, //第一个编辑选项标记
							isSecond: false,
							isBianjiSecond: true //第二个编辑选项标记
						}
					}
					if( backData.status.statusId == "99") { //已取消
						backData.btn = {
							isDelBtnShow: true, //删除预约按钮标记
							isCacelBtnShow: false, //取消预约按钮标记
							isTjBtnShow: false, //帮我推荐按钮标记
							isKefuBtnShow: true,
							isFirst: false,
							isBianjiFirst: true, //第一个编辑选项标记
							isSecond: false,
							isBianjiSecond: true //第二个编辑选项标记
						}
					}
					if(backData.status.statusId == "11") { //已同意
						backData.btn = {
							isDelBtnShow: false, //删除预约按钮标记
							isCacelBtnShow: false, //取消预约按钮标记
							isTjBtnShow: false, //帮我推荐按钮标记
							isKefuBtnShow: true,
							isFirst: false,
							isBianjiFirst: true, //第一个编辑选项标记
							isSecond: false,
							isBianjiSecond: true //第二个编辑选项标记
						}
					}
					if(backData.status.statusId == "90") { //已完成
						backData.btn = {
							isDelBtnShow: true, //删除预约按钮标记
							isCacelBtnShow: false, //取消预约按钮标记
							isTjBtnShow: false, //帮我推荐按钮标记
							isKefuBtnShow: true,
							isFirst: false,
							isBianjiFirst: true, //第一个编辑选项标记
							isSecond: false,
							isBianjiSecond: true //第二个编辑选项标记
						}
					}
					if(a.multiMedias) {
						backData.hasImg = true;
						backData.imgList = a.multiMedias[0].frontCoverUrl;

					}

				},
				error: function() {
					$.winPop("请求失败");
				}

			});

		},
		eventBind: function() {

			//拨打客服

			$('#qxCall').click(function() {
				call.hide();
				mod.removeClass("on");
			});
			$('#forCall').click(function() {
				window.location.href = "tel:4000059900";
				call.hide();
				mod.removeClass("on");
			});

			//取消预约

			$('#orderNo').click(function() {
				order.hide();
				mod.removeClass("on");
			});
			$('#orderSure').click(function() {
				order.hide();
				mod.removeClass("on");
				hzDetail.cancelOrder();
			});

			//删除预约
			$('#deleteNo').click(function() {
				toDelete.hide();
				mod.removeClass("on");
			});
			$('#deleteSure').click(function() {
				toDelete.hide();
				mod.removeClass("on");
				hzDetail.delOrder();
			});
			$("#btnAll").on("click", ".qxOrder", function() {
				$('.order').show();
				$('.mod').addClass("on");
			});
			$("#btnAll").on("click", ".delete", function() {
				toDelete.show();
				mod.addClass("on");
			});
			$("#btnAll").on("click", ".kefu", function() {
				call.show();
				mod.addClass("on");
			});
			$("#btnAll").on("click", ".tuijian", function() {
				if(backData.isHz) {
					$.next({
						url: "huizhen.html",
						keys: {
							access: "hzhen"
						},
						closeOld: true
					});
				} else {
					$.next({
						url: "huizhen.html",
						keys: {
							access: "ddao"
						},
						closeOld: true
					});
				}
			});
			$(".secondList").on("click", "li", function() {
				var doctorId = $(this).attr("doctorId");
				if(doctorId == "") {
					return;
				}
				if($.isWx()) {
					return;
				}
				window.location.href = "FF499211739FD801USER://kRouteDoctorDetail/doctorID/" + doctorId;
			});
			$(".bj_first").on("click", ".bj_quxiao", function() {
				backData.btn.isFirst = true;
				backData.btn.isBianjiFirst = true;
			});
			$(".bj_first").on("click", ".bj_baocun", function() {
				if(backData.diseaseDescriptionforbianji == "") {
					$.pop("请输入内容");
					return;
				}
				$.fetchData({
					url: "/medsrv/updateConsultationOperation",
					data: {
						appointmentId: hzDetail.appointmentId,

						diseaseDescription: backData.diseaseDescriptionforbianji

					},
					success: function(data) {
						if(data.code != 0) {
							$.pop(data.message);
							return;
						}
						backData.btn.isFirst = true;
						backData.btn.isBianjiFirst = true;
						backData.diseaseDescription = backData.diseaseDescriptionforbianji;

					},
					error: function() {
						$.pop("请求失败");
					}
				})

			});
			$(".bj_second").on("click", ".bj_quxiao", function() {
				backData.btn.isBianjiSecond = true;
				backData.btn.isSecond = true;

			});
			$(".bj_second").on("click", ".bj_baocun", function() {
				if(backData.helpRequirementforbianji == "") {
					$.pop("请输入内容");
					return;
				}
				$.fetchData({
					url: "/medsrv/updateConsultationOperation",
					data: {
						appointmentId: hzDetail.appointmentId,
						helpRequirement: backData.helpRequirementforbianji

					},
					success: function(data) {
						if(data.code != 0) {
							$.pop(data.message);
							return;
						}
						backData.btn.isBianjiSecond = true;
						backData.btn.isSecond = true;
						backData.helpRequirement = backData.helpRequirementforbianji;

					},
					error: function() {
						$.pop("请求失败");
					}
				})
			});
			$("#illnessSup").on("click", function() { //第一个编辑按钮
				backData.btn.isFirst = false;
				backData.btn.isBianjiFirst = false;
				backData.diseaseDescriptionforbianji = backData.diseaseDescription;
			});
			$("#requireSup").on("click", function() {
				backData.btn.isSecond = false;
				backData.btn.isBianjiSecond = false;
				backData.helpRequirementforbianji = backData.helpRequirement;
			});
		},
		cancelOrder: function() {
			$.fetchData({
				url: '/medsrv/cancelConsultationOperationAppointment',
				data: {
					appointmentId: hzDetail.appointmentId

				},
				success: function(data) {
					if(data.code != 0) {
						$.pop(data.message);
						return;
					}
					$.pop('取消成功');
					backData.btn = {
						isDelBtnShow: true, //删除预约按钮标记
						isCacelBtnShow: false, //取消预约按钮标记
						isTjBtnShow: false, //帮我推荐按钮标记
						isKefuBtnShow: true,
						isFirst: false,
						isBianjiFirst: true, //第一个编辑选项标记
						isSecond: false,
						isBianjiSecond: true //第二个编辑选项标记

					}
					backData.status = {
						statusId: "99",
						statusName: '已取消'
					}

				},
				error: function() {
					$.pop("请求失败")
				}
			});
		},
		delOrder: function() {
			$.fetchData({
				url: '/medsrv/deleteConsultationOperationAppointment',
				data: {
					appointmentId: hzDetail.appointmentId

				},
				success: function(data) {
					if(data.code != 0) {
						$.pop(data.message);
						return;
					}
					$.pop('删除成功');
					backData.btn.isDelBtnShow = false;
					setTimeout(function() {
						$.back();
					}, 1000);

				},
				error: function() {
					$.pop("请求失败")
				}
			});
		},
		init: function() {

			this.getDetailData();
			new Vue({
				el: "#app",
				data: backData
			});
			this.eventBind();

		}
	}
	hzDetail.init();
	$("body").css("opacity", '1');

});