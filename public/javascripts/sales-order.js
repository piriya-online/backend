var currentDate = new Date();

$(function() {
	//setInterval(function(){ loadOrder(currentDate.getFullYear(),currentDate.getMonth()+1); }, 120000);
	$('.datepicker').datepicker('update', new Date());
	loadOrder(currentDate.getFullYear(),currentDate.getMonth()+1);

	$(document).on('click', '#ul-month li', function(){
		$('#ul-month li.active').removeClass('active');
		$(this).addClass('active');
		currentDate = new Date();
		currentDate.setMonth(currentDate.getMonth() - parseInt($(this).data('month')));
		loadOrder(currentDate.getFullYear(), parseInt(currentDate.getMonth())+1);
		//loadOrder();
		
	});

	$(document).on('click', '.notPaid .fa-credit-card', function(){
		$('#txt-orderNo').val( $(this).attr('data-orderNo') );
		$('#txt-comment').val( $(this).hasClass('text-primary') || $(this).hasClass('blink-blue-orange') ? $(this).attr('data-original-title') : '' );
		if($(this).attr('data-dueDate') != ''){
			$("#datepicker").datepicker("setDate", $(this).attr('data-dueDate'));
			console.log(1);
		}
		else {
			$('#datepicker').val('');
			console.log(2);
		}
		console.log($(this).attr('data-dueDate'));

	});

	$(document).on('click', '.fa-truck', function(){
		$('#txt-orderNo').val( $(this).attr('data-orderNo') );
		if ( $(this).attr('data-shippingType') == '' ) {
			//$('#shipping_method').attr('disabled', '').removeAttr('disabled');
			$('#txt-tracking').val(''); //.attr('readonly', '').removeAttr('readonly');
			//$('#dv-input_shipping .modal-footer').show();
		}
		else {
			//$('#shipping_method').attr('disabled', 'disabled');
			$('#txt-tracking').val( $(this).attr('data-shippingCode') == null ? '' : $(this).attr('data-shippingCode') ); //.attr('readonly', 'readonly');
			//$('#dv-input_shipping .modal-footer').hide();
			$('#shipping_method').val( $(this).attr('data-shippingType') );
			if ( $(this).attr('data-shippingType') == 'CC' || $(this).attr('data-shippingType') == 'SS' ) {
				$('#txt-tracking').parent().hide();
			}
			else {
				$('#txt-tracking').parent().show();
			}

		}
	});

	$(document).on('click', '#btn-tracking-search', function(){
		if ($.trim($('#txt-tracking').val()) != '') {
			if ( $('#shipping_method').val() == 'KE' ) {
				var win = window.open('https://th.kerryexpress.com/th/track/?track='+$.trim($('#txt-tracking').val()), '_blank');
				win.focus();
			}
			else if ( $('#shipping_method').val() == 'SCG' ) {
				var win = window.open('https://www.scgexpress.co.th/tracking/detail/'+$.trim($('#txt-tracking').val()), '_blank');
				win.focus();
			}
		}
	});

	$(document).on('change', '#shipping_method', function(){
		if ( $('#shipping_method').val() == 'CC' || $('#shipping_method').val() == 'SS' ) {
			$('#txt-tracking').parent().hide();
		}
		else {
			$('#txt-tracking').parent().show();
		}
	});

	$(document).on('click', '#dv-input_shipping .btn-save', function(){
		$.post($('#apiUrl').val()+'/order/tracking/update', {
			orderNo: $('#txt-orderNo').val(),
			type: $('#shipping_method').val(),
			trackingNo: $('#txt-tracking').val(),
		}, function(data){
			if (data.success) {
				$('#tr'+$('#txt-orderNo').val()+' .fa-truck')
					.removeClass('text-muted')
					.addClass('text-success')
					.attr('data-original-title', $('#msg-shipped').val())
					.attr('data-shippingType', $('#shipping_method').val() == null ? '' : $('#shipping_method').val())
					.attr('data-shippingCode', $('#txt-tracking').val() == null ? '' : $('#txt-tracking').val())
					.css('opacity', 1);
				$('.show-tooltip').tooltip();
				$('#dv-input_shipping').modal('hide');
				$('#txt-tracking').val('');
			}
		}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
	});

	$(document).on('click', '#dv-input_credit .btn-save', function(){
		$.post($('#apiUrl').val()+'/order/credit/comment', {
			orderNo: $('#txt-orderNo').val(),
			comment: $('#txt-comment').val(),
			dueDate: $('#datepicker').val()
		}, function(data){
			if (data.success) {
				$('#tr'+$('#txt-orderNo').val()+' .fa-credit-card')
					.removeClass('color-orange')
					.addClass('text-primary')
					.attr('data-original-title', $('#txt-comment').val())
					.attr('data-dueDate', $('#datepicker').val())
					.css('opacity', 1);
				//$('.show-tooltip').tooltip();
				$('#dv-input_credit').modal('hide');
				$('#txt-comment').val('');
				$('#datepicker').val('');
			}
		}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
	});

	$(document).on('mouseover', '.fa-credit-card.text-red', function(){
		//console.log( $(this).attr('area-describedby') );
		$obj = $(this);
		if ( $obj.attr('data-original-title') == $('#msg-loadingData').val() ) {
			$obj.removeClass('text-red').addClass('text-success');

			$.post($('#apiUrl').val()+'/order/tracking/paid', {
				authKey: $('#authKey').val(),
				orderNo: $obj.parents('tr').attr('id').replace('tr',''),
			}, function(data){
				if (data.success) {
					if (data.correct) {
						if ( data.result[0][0] != undefined ) {
							if ( data.result[0][0].payType == 1) {
								$obj.attr('data-original-title', "จำนวนเงินสดที่รับ <b class='font-bigger text-yellow'>"+numberWithCommas(data.result[0][0].ReceiveMoney.toFixed(0))+
									"</b> บาท<br>วันที่รับเงิน <b>"+data.result[0][0].ReceiveDate );
							}
							else if ( data.result[0][0].payType == 2 ) {
								$obj.attr('data-original-title', "จำนวนเงินที่รับ <b class='font-bigger text-yellow'>"+numberWithCommas(data.result[0][0].ReceiveMoney.toFixed(0))+
									"</b> บาท<br>เช็คธนาคาร <b>"+data.result[0][0].BankName+
									"</b><br>เช็คเลขที่ <b>"+data.result[0][0].ChequeNumber+
									"</b><br>จำนวนเงินในเช็ค <b class='font-bigger'>"+numberWithCommas(data.result[0][0].ChequeMoney.toFixed(0))+"</b> บาท" );
							}
							else if ( data.result[0][0].payType == 4 ) {
								$obj.attr('data-original-title', "จำนวนเงินที่รับ <b class='font-bigger text-yellow'>"+numberWithCommas(data.result[0][0].ReceiveMoney.toFixed(0))+
									"</b> บาท<br>วันที่รับเงิน <b>"+data.result[0][0].ReceiveDate+
									"</b><br>โอนเข้าธนาคาร <b>"+data.result[0][0].BankName+
									"</b><br>เลขที่บัญชี <b class='font-bigger text-yellow'>"+data.result[0][0].AccountNumber+
									"</b><br>ชื่อบัญชี <b>"+data.result[0][0].AccountName+
									"</b><br>จำนวนเงินที่โอน <b class='font-bigger'>"+numberWithCommas(data.result[0][0].TransferMoney.toFixed(0))+"</b> บาท" );
							}
							else if ( data.result[0][0].payType == 5 ) {
								$obj.attr('data-original-title', "จำนวนเงินสดที่รับ <b class='font-bigger text-yellow'>"+numberWithCommas(data.result[0][0].ReceiveMoney.toFixed(0))+
									"</b> บาท<br>วันที่รับเงิน <b>"+data.result[0][0].ReceiveDate +
									"</b><div class='line'></div>จำนวนเงินที่รับ <b class='font-bigger text-yellow'>"+numberWithCommas(data.result[1][0].ReceiveMoney.toFixed(0))+
									"</b> บาท<br>วันที่รับเงิน <b>"+data.result[1][0].ReceiveDate+
									"</b><br>โอนเข้าธนาคาร <b>"+data.result[1][0].BankName+
									"</b><br>เลขที่บัญชี <b class='font-bigger text-yellow'>"+data.result[1][0].AccountNumber+
									"</b><br>ชื่อบัญชี <b>"+data.result[1][0].AccountName+
									"</b><br>จำนวนเงินที่โอน <b class='font-bigger'>"+numberWithCommas(data.result[1][0].TransferMoney.toFixed(0))+"</b> บาท" );
							}
							else if ( data.result[0][0].payType == 6 ) {
								$obj.attr('data-original-title', "จำนวนเงินที่รับ <b class='font-bigger text-yellow'>"+numberWithCommas(data.result[0][0].ReceiveMoney.toFixed(0))+
									"</b> บาท<br>เช็คธนาคาร <b>"+data.result[0][0].BankName+
									"</b><br>เช็คเลขที่ <b>"+data.result[0][0].ChequeNumber+
									"</b><br>จำนวนเงินในเช็ค <b class='font-bigger'>"+numberWithCommas(data.result[0][0].ChequeMoney.toFixed(0))+"</b> บาท"+
									"<div class='line'></div>จำนวนเงินที่รับ <b class='font-bigger text-yellow'>"+numberWithCommas(data.result[1][0].ReceiveMoney.toFixed(0))+
									"</b> บาท<br>วันที่รับเงิน <b>"+data.result[1][0].ReceiveDate+
									"</b><br>โอนเข้าธนาคาร <b>"+data.result[1][0].BankName+
									"</b><br>เลขที่บัญชี <b class='font-bigger text-yellow'>"+data.result[1][0].AccountNumber+
									"</b><br>ชื่อบัญชี <b>"+data.result[1][0].AccountName+
									"</b><br>จำนวนเงินที่โอน <b class='font-bigger'>"+numberWithCommas(data.result[1][0].TransferMoney.toFixed(0))+"</b> บาท" );
							}
						}
					}
				}

			}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });

		}
	});

	$('#isPaid, #notPaid, #isPack, #notPack, #isShip, #notShip, #isCancel, #notCancel, #notPrint, #isPrint').on('ifChecked', function(event){
		showDataType();
	});

	$('#isPaid, #notPaid, #isPack, #notPack, #isShip, #notShip, #isCancel, #notCancel, #notPrint, #isPrint').on('ifUnchecked', function(event){
		showDataType();
	});

	$('#datepicker').datepicker({
		autoclose: true,
		format: 'dd/mm/yyyy',
		language: 'th'
	});


    $(document).on('click', '#tb-result .orderPremium', function() {
        $('tr.selected').removeClass('selected');
        $(this).parents('tr').addClass('selected');
		$('#dv-premium').modal('show');
    });

	
    $(document).on('click', '#btn-premium', function() {
		$.post($('#apiUrl').val() + '/order/premium', {
			authKey: $('#authKey').val(),
			orderNo: $('tr.selected .orderNo').text(),
			status: 1,
		}, function(data) {
			if (data.success) {
				$('#dv-premium').modal('hide');
				$('tr.selected i.fa-trophy').removeClass('text-muted').addClass('text-red').css('opacity', 1)
					.attr('title', 'สินค้าพรีเมี่ยม')
					.tooltip();
				$('tr.selected').removeClass('selected');
			}
		});
	});
	
    $(document).on('click', '#btn-cancel_premium', function() {
		$.post($('#apiUrl').val() + '/order/premium', {
			authKey: $('#authKey').val(),
			orderNo: $('tr.selected .orderNo').text(),
			status: 0,
		}, function(data) {
			if (data.success) {
				$('#dv-premium').modal('hide');
				$('tr.selected i.fa-trophy').addClass('text-muted').removeClass('text-red').css('opacity', 0.3)
					.removeAttr('title');
				$('tr.selected').removeClass('selected');
			}
		});
	});

	$(document).on('click', '#tb-result .printer', function() {
		$('#txt-orderPrint').html($(this).attr('data-orderPrint'));
		$(this).parents('tr').addClass('selected');
	});

	$(document).on('click', '#tb-result_istpack .printer', function() {
		$('#txt-orderPrint').html($(this).attr('data-orderPrint'));
		$(this).parents('tr').addClass('selected');
	});

	$(document).on('click', '#btn-print', function() {
		$.post($('#apiUrl').val() + '/order/printed', {
			authKey: $('#authKey').val(),
			orderNo: $('#txt-orderPrint').text(),
			status: 1,
		}, function(data) {
			if (data.success) {
				$('#dv-print').modal('hide');
				window.open('https://us-central1-power-system-api.cloudfunctions.net/report/order/forOffice?id='+$('tr.selected .orderNo').text()+'', '_blank');
				$('tr.selected i.fa-cloud-download').removeClass('text-muted').addClass('text-success').css('opacity', 1);
				$('tr.selected').removeClass('selected');
			}
		});
	}); 
	$(document).on('click', '#btn-print_view', function() {
		window.open('https://us-central1-power-system-api.cloudfunctions.net/report/order/forOffice?id='+$('#txt-orderPrint').text()+'', '_blank');
		$('#dv-print').modal('hide');
	});

	$(document).on('click', '#tb-result .orderEvent', function() {
		$('#txt-orderEvent').html($(this).attr('data-orderEvent'));
		$('#txt-nameEvent').html($(this).attr('data-nameEvent'));
		$(this).parents('tr').addClass('selected');
		if($(this).attr('data-dateEvent') != "-"){
			$('#date-event').hide();
			$('#date-evented').show();
			$('#txt-eventDate').html($(this).attr('data-dateEvent'));
			$('#txt-eventAddBy').html('เพิ่มข้อมูลโดย: '+ $(this).attr('data-eventAddBy'));
			console.log('เพิ่มข้อมูลโดย: '+ $(this).attr('data-eventAddBy'))
		}else{
			$('#date-event').show();
			$('#date-evented').hide();
			$('#date-evented').html('');
		}
		$('#dv-event').modal();
	});

	$(document).on('click', '#dv-event #btn-submit', function() {
		var startDate = $('#dv-event #startDate').val().split('/');
		var endDate = $('#dv-event #endDate').val().split('/');
		var strStartDate = startDate[1] + '/' + startDate[0] + '/' + startDate[2];
		var strEndDate = endDate[1] + '/' + endDate[0] + '/' + endDate[2];
		$.post($('#apiUrl').val() + '/order/event', {
			authKey: $('#authKey').val(),
			orderNo: $('#txt-orderEvent').text(),
			status: 1,
			startDate: $('#dv-event #startDate').val(),
			endDate: $('#dv-event #endDate').val()
		}, function(data) {
			if (data.success) {
				$('#dv-event').modal('hide');
				$('tr.selected i.fa-calendar').removeClass('text-muted').addClass('text-success').css('opacity', 1);
				$('tr.selected').removeClass('selected');
			}
		});
	}); 

	$(document).keypress(function(e) {
		//$('#txt_barcode-orderNo').focus();
		if(e.which == 13) {
			if($('#txt-search').val().length > 0){
				search();
			}			
		}
	});

	$(document).on('click', '#btn-search', function() {
		if($('#txt-search').val().length > 0){
			search();
		}
  	});
});

function showDataType(){
	$('#tb-result tbody tr').hide();
	var name = '';
	if($('#isPrint').prop('checked')) name += '.isPrint';
	if($('#notPrint').prop('checked')) name += '.notPrint';
	if($('#isPaid').prop('checked')) name += '.isPaid';
	if($('#notPaid').prop('checked')) name += '.notPaid';
	if($('#isPack').prop('checked')) name += '.isPack';
	if($('#notPack').prop('checked')) name += '.notPack';
	if($('#isShip').prop('checked')) name += '.isShip';
	if($('#notShip').prop('checked')) name += '.notShip';
	if($('#isCancel').prop('checked')) name += '.isCancel';
	if($('#notCancel').prop('checked')) name += '.notCancel';
	$(name).show();
	$('#typeCount').html($(name).length);
}

function loadOrder(year, month){
	loadTotalPrice(year, month);
	$('#dv-loading').show();
	$('#dv-no_data, #tb-result').hide();
	$.post($('#apiUrl').val()+'/order/summary/month', {
		authKey: $('#authKey').val(),
		year: year,
		month: month,
	}, function(data){
		$('#dv-loading').hide();
		if (data.success) {
			if (data.correct) {
				$('#isPaid, #notPaid, #isPack, #notPack, #isShip, #notShip, #isCancel, #notCancel, #notPrint, #isPrint').iCheck('uncheck');
				var html = '';
				var sumPrice = 0;
				for( i=0; i<data.result.length; i++ ) {
					var result = data.result[i];
					html += '<tr id="tr'+result.orderNo+'" class="'
						+((result.isPrint) ? 'isPrint ' : 'notPrint ')
						+((result.isPay) ? 'isPaid ' : 'notPaid ')
						+((result.isPack) ? 'isPack ' : 'notPack ')
						+((result.shippingType != null) ? 'isShip ' : 'notShip ')
						+((result.active) ? 'notCancel ' : 'isCancel ')+'">'
					html += '<td class="orderNo text-center '+((!result.active) ? ' msg_erase' : '')+((!result.isPack && result.active) ? ' text-red font-bold' : '')+'">'+result.orderNo+'</td>';
					var sp = result.orderDate.split(' ');
					var date = sp[0].split('-');
					html += '<td class="text-center" nowrap="nowrap">'+date[2]+'-'+date[1]+'-'+(parseInt(date[0])+543)+' '+sp[1]+'</td>';
					html += '<td class="status" width="60">';
					//html += '<i class="fa pointer fa-credit-card show-tooltip '+((result.isPay) ? 'text-success' : 'text-muted')+'" data-toggle="tooltip" data-placement="top" title="'+((result.isPay) ? $('#msg-paid').val() : $('#msg-unpaid').val())+'"></i>'; // isOverDueDate
					html += '<i data-orderNo="'+result.orderNo+'" data-dueDate="'+(result.creditDueDate == null ? '' : result.creditDueDate)+'" class="fa pointer fa-credit-card show-tooltip '+((result.isPay) ? 'text-red' : ((result.hasCredit) ? ((result.creditComment == '') ? 'color-orange' : ((result.isOverDueDate == 1) ? 'blink-blue-orange' : 'text-primary')) : 'text-muted'))
						+'" '+((result.hasCredit) ? 'data-target="#dv-input_credit" data-toggle="modal"' : '')+' data-toggle="tooltip" data-html="true" data-placement="top" title="'
						+((result.isPay) ? $('#msg-loadingData').val() : ((result.creditComment != '') ? result.creditComment : $('#msg-unpaid').val()))+'"></i>';
					html += ' <i class="fa pointer fa-cube show-tooltip '+((result.isPack) ? 'text-success' : 'text-muted')+'" data-toggle="tooltip" data-placement="top" title="'+((result.isPack) ? $('#msg-pack').val() : $('#msg-unpack').val())+'"></i>';
					html += ' <i data-orderNo="'+result.orderNo+'" data-shippingType="'+(result.shippingType == null ? '' : result.shippingType)
						+'" data-shippingCode="'+(result.shippingCode == null ? '' : result.shippingCode)+'" class="fa pointer fa-truck show-tooltip '
						+((result.isShip) ? 'text-success' : 'text-muted')+'" data-target="#dv-input_shipping" data-toggle="modal" data-toggle="tooltip" data-placement="top" title="'
						+((result.isShip) ? $('#msg-shipped').val() : $('#msg-awaiting_shipment').val())+'"></i>';
					html += '</td>';
					//html += '<td class="action" width="45"><a href="https://24fin-api.remaxthailand.co.th/report/order4office/1/'+result.orderNo+'"><i class="fa pointer fa-cloud-download"></i></a>'; 
					html += '<td class="action" width="45"><i class="printer fa pointer fa-cloud-download '+((result.isPrint) ? 'text-success' : 'text-muted')+'" data-placement="top" data-toggle="modal" data-target="#dv-print" data-orderPrint="'+result.orderNo+'"></i>';
					html += ' <a href="https://24fin-api.remaxthailand.co.th/report/envelope/1/'+result.orderNo+'"><i class="fa pointer fa-envelope"></i></a>';
					html += '</td>';
					if(result.eventStartDate != '' && result.eventStartDate != undefined && result.eventStartDate != null){
						var eventStartDate = result.eventStartDate.split('T');
						var eventEndDate = result.eventEndDate.split('T');
						var eStartDate = eventStartDate[0].split('-');
						var eEndDate = eventEndDate[0].split('-');
					}
					html += '<td>'+
						'<i class="orderEvent fa pointer fa-calendar show-tooltip '+((result.isEvent) ? 'text-success' : 'text-muted')+'" '+((result.isEvent) ? ' data-toggle="tooltip" title="สินค้าอีเว้นท์"' : '')+' data-placement="top" data-toggle="modal" data-target="#dv-event" data-orderEvent="'+result.orderNo+'" data-nameEvent="'+
						result.firstname+' '+result.lastname+'" data-dateEvent="'+((result.eventStartDate != '' && result.eventStartDate != undefined && result.eventStartDate != null) ? eStartDate[2]+'/'+eStartDate[1]+'/'+(parseInt(eStartDate[0])+543)+' - '+eEndDate[2]+'/'+eEndDate[1]+'/'+(parseInt(eEndDate[0])+543) : '-')+'" data-eventAddBy="'+ result.eventAddBy +'"></i>&nbsp;<i class="orderPremium fa pointer fa-trophy show-tooltip '+((result.isPremium) ? 'text-red' : 'text-muted')+'" '+((result.isPremium) ? ' data-toggle="tooltip" title="สินค้าพรีเมี่ยม"' : '')+' data-placement="top" data-toggle="modal" data-target="#dv-premium"></i> ' +
						result.firstname+' '+result.lastname+(result.customerComment != '' ? ' <span class="text-'+((result.customerComment == 'Neolution' && result.isApprove) ? 'green' : 'orange')+'">('+
						((result.customerComment == 'Neolution' && result.isApprove) ? ' <i class="fa pointer fa-check-circle text-success"></i> ' : '')+
						result.customerComment+')</span>' : '')+'</td>';
					html += '<td>'+result.shopName+'</td>';
					html += '<td class="text-right '+((result.isPay) ? 'text-red font-bold' : ((result.hasCredit) ? ((result.creditComment == '') ? 'color-orange' : ((result.isOverDueDate == 1) ? 'blink-blue-orange' : 'text-primary')) : 'text-muted'))+'">'+numberWithCommas(result.totalPrice.toFixed(0))+'</td>';
					html += '</tr>';
					//sumPrice += (result.isPay) ? result.totalPrice : 0;
				}
				$('#tb-result tbody').html( html );
				//$('.sp-Income').html( numberWithCommas(sumPrice.toFixed(0)) );
				$('.show-tooltip').tooltip();
				$('i.text-muted').css('opacity', 0.3);
				$('.wait').show();
				if (data.result.length == 0)
				{
					$('#dv-no_data').show();
					$('#tb-result').hide();
				}
				$('#typeCount').html($('#tb-result tbody tr').length);
			}
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
	loadOrderIstPack(year, month);
}

function loadOrderIstPack(year, month){
	$.post($('#apiUrl').val()+'/order/summary/istpack', {
		authKey: $('#authKey').val(),
		year: year,
		month: month,
	}, function(data){
		if (data.success) {
			if (data.correct) {
				$('#isPaid, #notPaid, #isPack, #notPack, #isShip, #notShip, #isCancel, #notCancel, #notPrint, #isPrint').iCheck('uncheck');
				var html = '';
				var sumPrice = 0;
				for( i=0; i<data.result.length; i++ ) {
					var result = data.result[i];
					html += '<tr id="tr'+result.orderNo+'" class="'
						+((result.isPrint) ? 'isPrint ' : 'notPrint ')
						+((result.isPay) ? 'isPaid ' : 'notPaid ')
						+((result.isPack) ? 'isPack ' : 'notPack ')
						+((result.shippingType != null) ? 'isShip ' : 'notShip ')
						+((result.active) ? 'notCancel ' : 'isCancel ')+'">'
					html += '<td class="orderNo text-center '+((!result.active) ? ' msg_erase' : '')+((!result.isPack && result.active) ? ' text-red font-bold' : '')+'">'+result.orderNo+'</td>';
					var sp = result.orderDate.split(' ');
					var date = sp[0].split('-');
					html += '<td class="text-center" nowrap="nowrap">'+date[2]+'-'+date[1]+'-'+(parseInt(date[0])+543)+' '+sp[1]+'</td>';
					html += '<td class="status" width="60">';
					//html += '<i class="fa pointer fa-credit-card show-tooltip '+((result.isPay) ? 'text-success' : 'text-muted')+'" data-toggle="tooltip" data-placement="top" title="'+((result.isPay) ? $('#msg-paid').val() : $('#msg-unpaid').val())+'"></i>'; // isOverDueDate
					html += '<i data-orderNo="'+result.orderNo+'" data-dueDate="'+(result.creditDueDate == null ? '' : result.creditDueDate)+'" class="fa pointer fa-credit-card show-tooltip '+((result.isPay) ? 'text-red' : ((result.hasCredit) ? ((result.creditComment == '') ? 'color-orange' : ((result.isOverDueDate == 1) ? 'blink-blue-orange' : 'text-primary')) : 'text-muted'))
						+'" '+((result.hasCredit) ? 'data-target="#dv-input_credit" data-toggle="modal"' : '')+' data-toggle="tooltip" data-html="true" data-placement="top" title="'
						+((result.isPay) ? $('#msg-loadingData').val() : ((result.creditComment != '') ? result.creditComment : $('#msg-unpaid').val()))+'"></i>';
					html += ' <i class="fa pointer fa-cube show-tooltip '+((result.isPack) ? 'text-success' : 'text-muted')+'" data-toggle="tooltip" data-placement="top" title="'+((result.isPack) ? $('#msg-pack').val() : $('#msg-unpack').val())+'"></i>';
					html += ' <i data-orderNo="'+result.orderNo+'" data-shippingType="'+(result.shippingType == null ? '' : result.shippingType)
						+'" data-shippingCode="'+(result.shippingCode == null ? '' : result.shippingCode)+'" class="fa pointer fa-truck show-tooltip '
						+((result.isShip) ? 'text-success' : 'text-muted')+'" data-target="#dv-input_shipping" data-toggle="modal" data-toggle="tooltip" data-placement="top" title="'
						+((result.isShip) ? $('#msg-shipped').val() : $('#msg-awaiting_shipment').val())+'"></i>';
					html += '</td>';
					//html += '<td class="action" width="45"><a href="https://24fin-api.remaxthailand.co.th/report/order4office/1/'+result.orderNo+'"><i class="fa pointer fa-cloud-download"></i></a>'; 
					html += '<td class="action" width="45"><i class="printer fa pointer fa-cloud-download '+((result.isPrint) ? 'text-success' : 'text-muted')+'" data-placement="top" data-toggle="modal" data-target="#dv-print" data-orderPrint="'+result.orderNo+'"></i>';
					html += ' <a href="https://24fin-api.remaxthailand.co.th/report/envelope/1/'+result.orderNo+'"><i class="fa pointer fa-envelope"></i></a>';
					html += '</td>';
					if(result.eventStartDate != '' && result.eventStartDate != undefined && result.eventStartDate != null){
						var eventStartDate = result.eventStartDate.split('T');
						var eventEndDate = result.eventEndDate.split('T');
						var eStartDate = eventStartDate[0].split('-');
						var eEndDate = eventEndDate[0].split('-');
					}
					html += '<td>'+
						'<i class="orderEvent fa pointer fa-calendar show-tooltip '+((result.isEvent) ? 'text-success' : 'text-muted')+'" '+((result.isEvent) ? ' data-toggle="tooltip" title="สินค้าอีเว้นท์"' : '')+' data-placement="top" data-toggle="modal" data-target="#dv-event" data-orderEvent="'+result.orderNo+'" data-nameEvent="'+
						result.firstname+' '+result.lastname+'" data-dateEvent="'+((result.eventStartDate != '' && result.eventStartDate != undefined && result.eventStartDate != null) ? eStartDate[2]+'/'+eStartDate[1]+'/'+(parseInt(eStartDate[0])+543)+' - '+eEndDate[2]+'/'+eEndDate[1]+'/'+(parseInt(eEndDate[0])+543) : '-')+'" data-eventAddBy="'+ result.eventAddBy +'"></i>&nbsp;<i class="orderPremium fa pointer fa-trophy show-tooltip '+((result.isPremium) ? 'text-red' : 'text-muted')+'" '+((result.isPremium) ? ' data-toggle="tooltip" title="สินค้าพรีเมี่ยม"' : '')+' data-placement="top" data-toggle="modal" data-target="#dv-premium"></i> ' +
						result.firstname+' '+result.lastname+(result.customerComment != '' ? ' <span class="text-'+((result.customerComment == 'Neolution' && result.isApprove) ? 'green' : 'orange')+'">('+
						((result.customerComment == 'Neolution' && result.isApprove) ? ' <i class="fa pointer fa-check-circle text-success"></i> ' : '')+
						result.customerComment+')</span>' : '')+'</td>';
					html += '<td>'+result.shopName+'</td>';
					html += '<td class="text-right '+((result.isPay) ? 'text-red font-bold' : ((result.hasCredit) ? ((result.creditComment == '') ? 'color-orange' : ((result.isOverDueDate == 1) ? 'blink-blue-orange' : 'text-primary')) : 'text-muted'))+'">'+numberWithCommas(result.totalPrice.toFixed(0))+'</td>';
					html += '</tr>';
					//sumPrice += (result.isPay) ? result.totalPrice : 0;
				}
				$('#tb-result_istpack tbody').html( html );
				$('#tb-result_istpack').show();
				$('#panel-istpack').show();
				//$('.sp-Income').html( numberWithCommas(sumPrice.toFixed(0)) );
				$('.show-tooltip').tooltip();
				$('i.text-muted').css('opacity', 0.3);
				if (data.result.length == 0)
				{
					$('#panel-istpack').hide();
					$('#tb-result_istpack').hide();
				}
				$('#typeCount').html($('#tb-result_istpack tbody tr').length);
			}
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadTotalPrice(year, month){
	$('.sp-Income').html( numberWithCommas(0) );
	$.post('https://api.remaxthailand.co.th/sale/totalPriceByMonth', {
		apiKey:	'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		year: year,
		month: month
	}, function(data){
		if (data.success) {
			$('.sp-Income').html( numberWithCommas(data.result[0].totalPrice.toFixed(0)) ); 
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function search(){
	$('#dv-loading_search').show();
	$('#dv-no_data_search, #tb-result_search').hide();
	$.post($('#apiUrl').val()+'/order/search', {
		authKey: $('#authKey').val(),
		sku: $('#txt-search').val()
	}, function(data){
		$('#dv-loading_search').hide();
		if (data.success) {
			if (data.correct) {
				var html = '';
				for( i=0; i<data.result.length; i++ ) {
					var result = data.result[i];
					html += '<tr>'
					html += '<td class="orderNo text-center">'+result.orderNo+'</td>';
					html += '<td class="text-right ">'+numberWithCommas(result.qty.toFixed(0))+'</td>';
					html += '</tr>';
				}
				$('#tb-result_search tbody').html( html );
				$('#tb-result_search').show();
				if (data.result.length == 0)
				{
					$('#dv-no_data_search').show();
					$('#tb-result_search').hide();
				}
			}
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}