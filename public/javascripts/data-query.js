$(function () {

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


