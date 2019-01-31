var currentDate = new Date();
$(function() {
	$(window).scroll(function(){
		var a = $('#scroll-top').find('a');
		if ($(this).scrollTop() > 250) {		
			a.fadeIn(200);
		} else {
			a.fadeOut(200);
		}
    });
	
	$('#scroll-top').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 1000);
        return false;
    });
	
	loadData(currentDate.getFullYear(),currentDate.getMonth()+1);

	$(document).on('click', '#ul-month li', function(){
		$('#ul-month li.active').removeClass('active');
		$(this).addClass('active');
		currentDate = new Date();
		currentDate.setMonth(currentDate.getMonth() - parseInt($(this).data('month')));
		loadData(currentDate.getFullYear(), parseInt(currentDate.getMonth())+1);
	});
	
	$('#btn-submit').click(function(){
		if($('#txt-orderNo').val().length > 0){
			if($('#txt-orderNo').val().length >= 10){
				cancelOrder();
			}else{
				$('#msg-alert').html('กรุณาระบุเลขที่คำสั่งซื้อให้ครบถ้วน');
				$('#modal-alert').modal('show');
			}
		}else{
			$('#msg-alert').html('กรุณาระบุเลขที่คำสั่งซื้อ');
			$('#modal-alert').modal('show');
		}
       
		return false;
    });	
});
function cancelOrder(){
	$('#dv-load').show();
	$.post('https://api.remaxthailand.co.th/order/cancel', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val(),
		orderNo: $.trim($('#txt-orderNo').val()),
		remark: $('#txt-remark').val()
	}, function(data){
		if (data.success) {
			if(data.result[0].success){
				$('#orderNolbl').html($('#txt-orderNo').val());
				$('#dv-load').hide();
				$('#dv-done').show();
				loadData(currentDate.getFullYear(),currentDate.getMonth()+1);
			}else{
				$('#msg-alert').html('กรุณาแจ้งผู้พัฒนาระบบ');
				$('#modal-alert').modal('show');
			}
		}else{
				$('#msg-alert').html('กรุณาแจ้งผู้พัฒนาระบบ');
				$('#modal-alert').modal('show'); 
			}
		$('#dv-load').hide();
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadData(year, month){
	$.post('https://api.remaxthailand.co.th/order/canceledInfo', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val(),
		year: year,
		month: month
	}, function(data){
		$('#dv-loading').hide();
		if (data.success) {
			var html = '';		
			for( i=0; i<data.result.length; i++ ) {
				var result = data.result[i];
				html += '<tr><td width="92" class="text-center" valign="middle">'+result.orderNo+'</td>';
				html += '<td width="110" class="text-center" valign="middle">'+moment(result.canceledDate).utcOffset(0).format('DD-MM-YYYY HH:mm')+'</td>';
				html += '<td valign="middle">'+result.firstname+' '+result.lastname+'</td>';
				html += '<td valign="middle">'+result.shopName+'</td>';
				html += '<td valign="middle">'+result.remark+'</td>';
				html += '<td width="100" class="text-center" valign="middle">'+result.officer+'</td>';
				html += '</tr>';
			}
			$('#tb-result tbody').html( html );
			$('#dv-no_data').hide();
			$('.wait').show();
			if (data.result.length == 0)
			{
				$('#dv-no_data').show();
				$('#tb-result').hide(); 
			}
		}else{
			$('#dv-no_data').show();
			$('#tb-result').hide(); 
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}