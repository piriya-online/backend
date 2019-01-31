var order_arr = [];

$(function() {
	moment.locale('th');
	$('#txt_barcode-orderNo').focus();

	$(document).keypress(function(e) {
		//$('#txt_barcode-orderNo').focus();
		if(e.which == 13) {
			if($('#txt_barcode-orderNo').val().length > 0){
				searchData();
			}			
		}
	});

	$(document).on('click', '#btn-barcode', function() {
		if($('#txt_barcode-orderNo').val().length > 0){
			searchData();
		}
  	});

	$('.datepicker').datepicker('update', new Date());
	loadData();
	transporter();
	loadDataAssign();
	loadDataSent();
	
	

	$(document).on('click', '#tb-result tr', function() {
		$('#check-'+$(this).attr('data-order')).iCheck('toggle');
		if(document.getElementById('check-'+$(this).attr('data-order')).checked){
			$(this).addClass('text-danger');
			$(this).css("font-weight","bold");
		}else{
			$(this).removeClass('text-danger');
			$(this).css("font-weight","");
		}	
  	});

	$(document).on('click', '#btn-clear', function() {
		$('input.select_order').iCheck('uncheck');
		$('tr').removeClass('text-danger');
		$('tr').css("font-weight","");
  	});

	$(document).on('click', '#btn-submit', function() {	
		var name_arr = [];
		var box_arr = [];
		order_arr = [];
		$('#tb-result > tbody  > tr').each(function() {
			if(document.getElementById('check-'+$(this).attr('data-order')).checked){
				order_arr.push($(this).attr('data-order'))
				name_arr.push($(this).attr('data-name'))
				box_arr.push($(this).attr('data-box'))
			}
		});

		var html = '';
		var sum_box = 0;
		for(i=0; i<name_arr.length; i++){
			var result = name_arr[i];
			var result_box = box_arr[i];
			sum_box += parseInt(result_box);
			html += '<tr>';
			html += '<td width="90" class="" valign="middle">'+result+'</td>';
			html += '<td width="10" class="text-center" valign="middle">'+result_box+'</td>';
			html += '</tr>';

		}
		$('#tb-confirm tbody').html( html );
		$('.sp-box').html(sum_box);

		if(order_arr.length > 0){
			$('#modal-list').modal();
		}		
  	});

	$(document).on('click', '#btn-confirm', function() {	
		if(order_arr.length > 0){
			for(i=0; i<order_arr.length; i++){
				$.post('https://api.remaxthailand.co.th/transport/add', {
					apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
					memberKey: $('#authKey').val(),
					orderNo: order_arr[i]
				}, function(data){
					if (data.success) {
						order_arr.splice(i,1);
					}
				}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
				
			}
		}
		$('#modal-list').modal('hide');
		loadData();
		loadDataAssign();
		loadDataTransporting();

  	});
	
	$(document).on('click', '#tb-result2 .btn-send', function() {
        $('.sp-orderNo').html($(this).attr('data-value'));
    });

	$(document).on('click', '#tb-result2 .btn-cancel', function() {
        $('.sp-orderNo-cancel').html($(this).attr('data-value'));
    });

	$(document).on('click', '#btn-send_confirm', function() {	
		
		$.post('https://api.remaxthailand.co.th/transport/confirmSend', {
			apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
			memberKey: $('#authKey').val(),
			orderNo: $('.sp-orderNo').html()
		}, function(data){
			if (data.success) {
				$('#modal-send').modal('hide');
				loadData();
				loadDataAssign();
				loadDataSent();
				loadDataTransporting();
			}
		}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
				
  	});
	
	$(document).on('click', '#btn-send_cancel', function() {	
		
		$.post('https://api.remaxthailand.co.th/transport/cancelAssign', {
			apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
			memberKey: $('#authKey').val(),
			orderNo: $('.sp-orderNo-cancel').html()
		}, function(data){
			if (data.success) {
				$('#modal-cancel').modal('hide');
				loadData();
				loadDataAssign();
				loadDataTransporting();
			}
		}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
				
  	}); 
	
	$(document).on('click', '#btn-search_sent', function() {		
		loadDataSent();
  	});

	$(document).on('change', '.select-transporter', function(){
		loadDataTransporting();
	});

	$('#btn-print').click(function() {
		if($('.select-transporter option:selected').val() != ''){
			window.open('https://api.remaxthailand.co.th/report/transport/' + $('.select-transporter option:selected').val(), '_blank');
			return false;
		}	
	});
});


function loadData(){
	$('#dv-loading_data').show();
	$('.wait').hide();
	$('#dv-no_data').hide();
	$.post('https://api.remaxthailand.co.th/transport/info', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		orderNo: ''
	}, function(data){
		
		if (data.success) {
			var values = data.result;
			if(values.length > 0){
				var html = '';
				$('#tb-result tbody').html( '' );
				for( i=0; i<values.length; i++ ) {
					var result = values[i];
					//var no = i+1;
					html += '<tr data-order="'+result.orderNo+'" data-name="'+result.orderNo+': '+result.name+'" data-box="'+result.box+'">';
					html += '<td width="20" class="text-center" valign="middle"><input id="check-'+result.orderNo+'" class="select_order" type="checkbox"> '+result.orderNo+'</td>';
					html += '<td width="50" class="" valign="middle">'+result.name+((result.contactName) != ''? ' ('+result.contactName+')' : '')+'</td>';
					html += '<td width="100" class="" valign="middle">'+result.address+'</td>';
					html += '<td width="20" class="text-center" valign="middle">'+result.transport+'</td>';
					html += '<td width="10" class="text-center" valign="middle">'+result.box+'</td>';
					html += '<td width="10" class="text-center" valign="middle">'+moment(result.checkDate).utcOffset(0).format('dddd')+'<p>'+moment(result.checkDate).utcOffset(0).format('DD/MM/YYYY HH:mm')+'</p></td>';
					html += '</tr>';
				}

				$('#tb-result tbody').html( html );
				$('#dv-loading_data').hide();
				$('#dv-no_data').hide();
				$('.wait').show();
			} else {
				$('#dv-loading_data').hide();
				$('#dv-no_data').show();
			}
		} else {
			$('#dv-loading_data').hide();
			$('#dv-no_data').show();
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadDataAssign(){
	$('#dv-loading_data2').show();
	$('.wait2').hide();
	$('#dv-no_data2').hide();
	$.post('https://api.remaxthailand.co.th/transport/assign', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val(),
		orderNo: ''
	}, function(data){
		if (data.success) {
			var values = data.result;
			if(values.length > 0){
				var html = '';
				$('#tb-result2 tbody').html( '' );
				for( i=0; i<values.length; i++ ) {
					var result = values[i];
					//var no = i+1;
					html += '<tr data-order="'+result.orderNo+'">';
					html += '<td width="20" class="text-center" valign="middle"><label class="btn-send label label-primary btn button" data-toggle="modal" data-target="#modal-send" data-value="'+result.orderNo+'">ส่งแล้ว</label> '+result.orderNo+'</td>';
					html += '<td width="50" class="" valign="middle">'+result.name+((result.contactName) != ''? ' ('+result.contactName+')' : '')+'</td>';
					html += '<td width="20" class="text-center" valign="middle">'+result.transport+'</td>';
					html += '<td width="10" class="text-center" valign="middle">'+result.box+' <label class="btn-cancel label label-danger btn button" data-toggle="modal" data-target="#modal-cancel" data-value="'+result.orderNo+'">ยกเลิก</label></td>';
					html += '</tr>';
				}

				$('#tb-result2 tbody').html( html );
				$('#dv-loading_data2').hide();
				$('#dv-no_data2').hide();
				$('.wait2').show();
			} else {
				$('#dv-loading_data2').hide();
				$('#dv-no_data2').show();
			}
		} else {
			$('#dv-loading_data2').hide();
			$('#dv-no_data2').show();
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadDataTransporting(){
	$('#dv-loading_data4').show();
	$('.wait4').hide();
	$('#dv-no_data4').hide();
	$.post('https://api.remaxthailand.co.th/transport/assign', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('.select-transporter option:selected').val(),
		orderNo: ''
	}, function(data){
		if (data.success) {
			var values = data.result;
			if(values.length > 0){
				var html = '';
				$('#tb-result4 tbody').html( '' );
				for( i=0; i<values.length; i++ ) {
					var result = values[i];
					var no = i+1;
					html += '<tr data-order="'+result.orderNo+'">';
					html += '<td width="10" class="text-center" valign="middle">'+no+'</td>';
					html += '<td width="20" class="text-center" valign="middle">'+result.orderNo+'</td>';
					html += '<td width="50" class="" valign="middle">'+result.name+((result.contactName) != ''? ' ('+result.contactName+')' : '')+'</td>';
					html += '<td width="20" class="text-center" valign="middle">'+result.transport+'</td>';
					html += '<td width="10" class="text-center" valign="middle">'+result.box+'</td>';
					html += '<td width="10" class="text-center" valign="middle">'+moment(result.addDate).utcOffset(0).format('dddd')+'<p>'+moment(result.addDate).utcOffset(0).format('DD/MM/YYYY HH:mm')+'</p></td>';					
					html += '<td width="10" class="text-center" valign="middle">'+result.memberName+'</td>';
					html += '</tr>';
				}
				

				$('#tb-result4 tbody').html( html );
				$('#dv-loading_data4').hide();
				$('#dv-no_data4').hide();
				$('.wait4').show();
			} else {
				$('#dv-loading_data4').hide();
				$('#dv-no_data4').show();
			}
		} else {
			$('#dv-loading_data4').hide();
			$('#dv-no_data4').show();
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadDataSent(){
	$('#dv-loading_data3').show();
	$('.wait3').hide();
	$('#dv-no_data3').hide();

	var date = $('#date').val().split('/');
	var strDate;
	if($('#date').val() != ''){
		strDate = date[1] + '/' + date[0] + '/' + date[2];
	}else{
		strDate = '';
	}
     

	$.post('https://api.remaxthailand.co.th/transport/transportSent', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		date: strDate,
		orderNo: $('#orderNo-sent').val()
	}, function(data){
		if (data.success) {
			var values = data.result;
			if(values.length > 0){
				var html = '';
				$('#tb-result3 tbody').html( '' );
				for( i=0; i<values.length; i++ ) {
					var result = values[i];
					var no = i+1;
					html += '<tr data-order="'+result.orderNo+'">';
					html += '<td width="10" class="text-center" valign="middle">'+no+'</td>';
					html += '<td width="20" class="text-center" valign="middle">'+result.orderNo+'</td>';
					html += '<td width="50" class="" valign="middle">'+result.name+((result.contactName) != ''? ' ('+result.contactName+')' : '')+'</td>';
					html += '<td width="20" class="text-center" valign="middle">'+result.transport+'</td>';
					html += '<td width="10" class="text-center" valign="middle">'+result.box+'</td>';
					html += '<td width="10" class="text-center" valign="middle">'+moment(result.sentDatetime).utcOffset(0).format('dddd')+'<p>'+moment(result.sentDatetime).utcOffset(0).format('DD/MM/YYYY HH:mm')+'</p></td>';
					html += '<td width="10" class="text-center" valign="middle">'+result.memberName+'</td>';
					html += '</tr>';
				}

				$('#tb-result3 tbody').html( html );
				$('#dv-loading_data3').hide();
				$('#dv-no_data3').hide();
				$('.wait3').show();
			} else {
				$('#dv-loading_data3').hide();
				$('#dv-no_data3').show();
			}
		} else {
			$('#dv-loading_data3').hide();
			$('#dv-no_data3').show();
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function searchData(){
	$.post('https://api.remaxthailand.co.th/transport/info', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		orderNo: $('#txt_barcode-orderNo').val()
	}, function(data){
		if (data.success) {
			var values = data.result;
			if(values.length > 0){			
				$('#lbl-alert_order').html('เพิ่มข้อมูลเลขที่คำสั่งซื้อ <b>'+ values[0].orderNo +'</b> จำนวน <b>'+values[0].box+'</b> กล่อง');
				addData();
			} else {
				$('#lbl-alert_order').html('ไม่พบข้อมูลเลขที่คำสั่งซื้อนี้!!!');
				$('#txt_barcode-orderNo').val('');
			}
		} else {
			$('#lbl-alert_order').html('ไม่พบข้อมูลเลขที่คำสั่งซื้อนี้!!!');
			$('#txt_barcode-orderNo').val('');
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function addData(){
	$.post('https://api.remaxthailand.co.th/transport/add', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val(),
		orderNo: $('#txt_barcode-orderNo').val()
	}, function(data){
		if (data.success) { 
			$('#txt_barcode-orderNo').val('');	
			loadData();
			loadDataAssign();
			loadDataTransporting();							
		} else {
			$('#lbl-alert_order').html('ไม่พบข้อมูลเลขที่คำสั่งซื้อนี้!!! (กรุณาติดต่อโปรแกรมเมอร์)');
			$('#txt_barcode-orderNo').val('');	
		}
		$('#selected').addClass('in');
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });	
}

function transporter(){
	$.post('https://api.remaxthailand.co.th/transport/transporter', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C'
	}, function(data){
		if (data.success) { 
			$('.select-transporter').append('<option value="">ทั้งหมด</option>');
			for( i=0; i<data.result.length; i++ ) {
				var result = data.result[i];
				$('.select-transporter').append('<option value='+result.member+'>'+result.memberName+'</option>');
			}						
		}
		loadDataTransporting();
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });	
}

function sortJSON(data, key, way) {
    return data.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        if (way === 'desc') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
		else { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
    });
};
