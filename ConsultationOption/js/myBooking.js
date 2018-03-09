define(['zepto', 'yjyInit'], function($) {

	
	var body = $('#app');
	var lists = {
		max: "LAST",
		hasMore: true,
		getListsData: function() {
			$.fetchData({
				url: "/medsrv/queryConsultationOperationAppointments",
				data: {
					max: lists.max
					

				},
				success: function(data) {
					if(data.code != 0) {
						$.pop(data.message);
						return;
					}

					var html = "";
					var len = data.consultationOperations.length;
					var back = data.consultationOperations;
					if(len < 1) {
						html += '<div class="zanwu">暂无数据</div>';
						body.html(html);
						return;
					}
					html += '<ul class="myBookingList">';
					for(var i = 0; i < len; i++) {
						if(back[i].consultation) {
							html += '<li listId="' + back[i].consultation.consultationId + '" title="' + back[i].consultation.type + '"><span class="huizhen">' + back[i].consultation.type + '</span><div class="bookingDate">' + back[i].consultation.formatCreateTime + '</div><div class="rightArrow"></div><span class="agree">' + back[i].consultation.status.statusName + '</span></li>';

						}
						if(back[i].operation) {
							html += '<li listId="' + back[i].operation.operationId + '" title="' + back[i].operation.type + '"><span class="huizhen">' + back[i].operation.type + '</span><div class="bookingDate">' + back[i].operation.formatCreateTime + '</div><div class="rightArrow"></div><span class="agree">' + back[i].operation.status.statusName + '</span></li>';
						}
					}
					html += '</ul>';
					html += "<div class='more'>查看更多</div>";
					if(len > 0) {
						lists.max = back[len - 1].sequence;
					}
					lists.hasMore = data.hasMore;
					body.html(html);
					

				},
				error: function() {
					$.pop("请求失败");
				}
			})
		},
		eventBind: function() {

			$('#app').on("click", "li", function() {

				var listId = $(this).attr("listId");
				var title = $(this).attr("title");

				$.next({
					url: "hzddDetail.html",
					keys: {
						listId: listId,
						title: title
					}
				});

			});

			$('#app').on("click", ".more", function() {
				if(!lists.hasMore) {
					$('.more').html("没有更多了");
					return;
				}
				$.fetchData({
					url: "/medsrv/queryConsultationOperationAppointments",
					data: {
						max: lists.max

					},
					success: function(data) {
						if(data.code != 0) {
							$.pop(data.message);
							return;
						}

						var html = "";
						var len = data.consultationOperations.length;
						var back = data.consultationOperations;
						html += '<ul class="myBookingList">';
						for(var i = 0; i < len; i++) {
							if(back[i].consultation) {
								html += '<li listId="' + back[i].consultation.consultationId + '" title="' + back[i].consultation.type + '"><span class="huizhen">' + back[i].consultation.type + '</span><div class="bookingDate">' + back[i].consultation.formatCreateTime + '</div><div class="rightArrow"></div><span class="agree">' + back[i].consultation.status.statusName + '</span></li>';

							}
							if(back[i].operation) {
								html += '<li listId="' + back[i].operation.operationId + '" title="' + back[i].operation.type + '"><span class="huizhen">' + back[i].operation.type + '</span><div class="bookingDate">' + back[i].operation.formatCreateTime + '</div><div class="rightArrow"></div><span class="agree">' + back[i].operation.status.statusName + '</span></li>';
							}
						}
						html += '</ul>';
						if(len > 0) {
							lists.max = back[len - 1].sequence;
						}

						lists.hasMore = data.hasMore;
						$('.more').before(html);

					},
					error: function() {
						$.pop("请求失败");
					}
				})

			});
		},
		init: function() {
			this.getListsData();
			this.eventBind();
		}
	}

	//lists.getListsData();
	lists.eventBind();

	return lists;
});