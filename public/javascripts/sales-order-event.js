var currentDate = new Date();
var valuesHeader;
var valuesDetail;
$(function () {
	loadOrderEvent();
	$(document).on('click', '.panel', function () {
		$('.loadEventDetail').hide();
		var $obj = $('.eventDetail').parents('#tb-result tbody');
		if (valuesDetail.length > 0) {
			var html = '';
			for (i = 0; i < valuesDetail.length; i++) {
				var result = valuesDetail[i];
				if ($(this).attr('data-value') == result.firstname + result.lastname + result.shopName + moment(result.eventStartDate).format('YYYYMMDD') + moment(result.eventEndDate).format('YYYYMMDD')) {
					var eventStartDate = result.eventStartDate.split('T');
					var eventEndDate = result.eventEndDate.split('T');
					var eStartDate = eventStartDate[0].split('-');
					var eEndDate = eventEndDate[0].split('-');
					html += '<tr id="'+result.orderNo+'">';
					html += '<td width="20" class="text-right"><i class="fa fa-sign-in orderEvent text-muted pointer" aria-hidden="true" data-placement="top" data-toggle="modal" data-target="#dv-event" data-orderEvent="'+result.orderNo+'" data-nameEvent="'+
					result.firstname+' '+result.lastname+'" data-dateEvent="'+((result.eventStartDate != '' && result.eventStartDate != undefined && result.eventStartDate != null) ? eStartDate[2]+'/'+eStartDate[1]+'/'+(parseInt(eStartDate[0])+543)+' - '+eEndDate[2]+'/'+eEndDate[1]+'/'+(parseInt(eEndDate[0])+543) : '-')+'" data-eventAddBy="'+ result.addBy +'"></i></td>';
					html += '<td width="20" class="orderNo text-center' + ((result.isReturn == 1) ? ' text-red font-bold pointer' : '') + '" valign="middle">' + result.orderNo + '</td>';
					html += '<td width="80" class="text-right" valign="middle">' + ((result.totalPrice) != undefined ? numberWithCommas(result.totalPrice) : '-') + '</td>';
				}
			}
		}
		$('#tb-result tbody').html(html).show();
	});
	$(document).on('click', '.orderNo', function () {
		window.open('https://api.remaxthailand.co.th/report/orderReturn4office/' + $(this).html(), '_blank');
	});
	$(document).on('click', '.btn-summary', function () {
		window.open('https://api.remaxthailand.co.th/report/orderReturn4officeEvent/' + $(this).attr('data-value'), '_blank');
	});
	$(document).on('click', '#tb-result .orderEvent', function() {
		$('#txt-orderEvent').html($(this).attr('data-orderEvent'));
		$('#txt-nameEvent').html($(this).attr('data-nameEvent'));
		$('#load-event').hide();
		$('#date-evented').show();
		$('#txt-eventDate').html($(this).attr('data-dateEvent'));
		$('#txt-eventAddBy').html('เพิ่มข้อมูลโดย: '+ $(this).attr('data-eventAddBy'));
		$('#dv-event').modal();
	}); //loading not hide and text success
	$(document).on('click', '#dv-event #btn-submit', function() {
		$('#date-evented').hide();
		$('#load-event').show();
		$.post('https://api.remaxthailand.co.th/order/orderEventToStock', {
			apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
			memberKey: $('#authKey').val(),
			orderNo: $('#txt-orderEvent').text(),
			comment: $('#dv-event #txt-eventDate').html() 
		}, function(data) {			
			if (data.success) {
				$('#dv-event').modal('hide');
				$('tr#'+$('#txt-orderEvent').text()+' i.fa-sign-in').removeClass('text-muted, pointer').addClass('text-success').css('opacity', 1);
			} else {
				$('#load-event').hide();
				$('#date-evented').show();
			}
		});
	});
});

function loadOrderEvent() {
	$.post('https://api.remaxthailand.co.th/order/orderEventInfo', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C'
	}, function (data) {
		if (data.success) {
			valuesHeader = data.result[0];
			valuesDetail = data.result[1];
			if (valuesHeader.length > 0) {
				var $obj = $('.panel-group');
				for (i = 0; i < valuesHeader.length; i++) {
					var result = valuesHeader[i];
					$obj.append('<div class="panel panel-default" data-value="' + result.firstname + result.lastname + result.shopName + moment(result.eventStartDate).format('YYYYMMDD') + moment(result.eventEndDate).format('YYYYMMDD') + '"><div id="headingOne" role="tab" class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#event' + i + '" aria-expanded="false" class="event' + i + '"><strong> ' + result.firstname + ' ' + result.lastname + ((result.shopName != '') ? '( '+ result.shopName +' )' : '') + '   | ระยะเวลาอีเว้นท์:' + moment(result.eventStartDate).utcOffset(0).format('DD/MM/YYYY') + ' - ' + moment(result.eventEndDate).utcOffset(0).format('DD/MM/YYYY') + ' </strong></a></h4></div><div id="event' + i + '" role="tabpanel" class="panel-collapse collapse"><div class="panel-body"><div class="row padding-10"><div class=""><i class="fa fa-refresh fa-spin loadEventDetail"></i><div class="eventDetail"><div class="col-md-4 col-md-offset-4"><div class="table-responsive wait" style="display: block;"><table id="tb-result" class="table table-striped table-condensed table-hover wait" style="display: table;"><thead><tr class="font-sm"><th width="20" class="text-center"></th><th width="20" class="text-center">เลขที่คำสั่งซื้อ</th><th width="80" class="text-right">ยอดสุทธิ</th></tr></thead><tbody></tbody></table></div><div class="footButton row"><div class="col-md-4"><button type="button" class="btn btn-success" style="display: none;">รับเข้าทั้งหมด</button></div><div class="col-md-4 col-md-offset-4"><button type="button" class="btn btn-info btn-summary" data-value="' + result.firstname + result.lastname + moment(result.eventStartDate).format('YYYYMMDD') + moment(result.eventEndDate).format('YYYYMMDD') + '">พิมพ์ใบสรุป</button></div></div></div></div></div>');
				}
			}
			$('.loadRoles').hide();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}


