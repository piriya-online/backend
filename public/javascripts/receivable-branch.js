$(function() {

	loadBranch();

	$(document).on('change', '#cbb-shop', function() {
			Cookies.set('shopSelected', $(this).val());
			$('.select-shop').val($(this).val())
			loadAllData();
	});

	$(document).on('click', '.fa-money', function() {
		$('.btn-save').addClass('disabled');
		$('#billNumber').html($(this).attr('data-sellNo'));
		$('#totalPrice').html(numberWithCommas($(this).attr('data-totalPrice')));
		$('#totalPrice-val').val($(this).attr('data-totalPrice'));
		$('#txt-money').val('');
		$('#txt-remark').val('');
	});

	$(document).on('change', '#selectPrevious', function() {
		receivablePaid();
	});

	$( "#txt-money" ).keyup(function() {
  	if($('#txt-money').val() == $('#totalPrice-val').val()){
			$('.btn-save').removeClass('disabled');
		}else {
			$('.btn-save').addClass('disabled');
		}
	});

	$(document).on('click', '#dv-input_payment .btn-save', function(){
		$.post('https://api.remaxthailand.co.th/account/receivable/pay', {
			apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
			shop: $('#cbb-shop').val(),
			memberKey: $('#authKey').val(),
			sellNo: $('#billNumber').html(),
			money: $('#txt-money').val(),
			remark: $('#txt-remark').val()
		}, function(data){
			if (data.success) {
				$('#dv-input_payment').modal('hide');
				loadAllData();
			}
		}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
	});

	$('#exportExlunpaid').click(function() {
		$(".table2excel-unpaid").table2excel({
			exclude: ".noExl",
			name: "Excel Document Name",
			filename: "Customer Credit "+$('#cbb-shop :selected').html()+" Unpaid",
			fileext: ".xls",
			exclude_img: true,
			exclude_links: true,
			exclude_inputs: true
		});
			return false;
	});
	$('#exportExlpaid').click(function() {
		$(".table2excel-paid").table2excel({
			exclude: ".noExl",
			name: "Excel Document Name",
			filename: "Customer Credit "+$('#cbb-shop :selected').html()+" Paid",
			fileext: ".xls",
			exclude_img: true,
			exclude_links: true,
			exclude_inputs: true
		});
			return false;
	});

});

function loadAllData(){
	receivableInfo();
	receivablePaid();
}

function loadBranch(){
	$.post('https://api.remaxthailand.co.th/shop/nameBranch', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: ''
	}, function(data){
		if (data.success) {
			if ( Cookies.get('shopSelected') == undefined )
				Cookies.set('shopSelected', data.result[0].id );
			for( i=0; i<data.result.length; i++ ) {
				var result = data.result[i];
				$('#cbb-shop').append('<option value="'+result.id+'"'+(Cookies.get('shopSelected') == result.id ? ' selected' : '')+'>'+result.name+'</option>');
			}
			loadAllData();
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function receivableInfo(){
	$('#dv-loading_data').show();
	$('.wait').hide();
	$('#dv-no_data').hide();
	$.post('https://api.remaxthailand.co.th/account/receivable/info', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: $('#cbb-shop').val()
	}, function(data){
		if (data.success) {
			var values = data.result;
			if(values.length > 0){
				sortJSON(values, 'sellDate', 'desc');
				var html = '';

				for( i=0; i<values.length; i++ ) {
					var result = values[i];
					//var no = i+1;
					html += '<tr class="' +(result.diff > 0 ? "text-bold text-red" : "")+ '' +(result.diff == 0 ? "text-bold" : "")+ '">';
					html += '<td width="100" class="text-center" valign="middle"><i data-totalPrice="'+result.totalPrice+'" data-sellNo="'+result.sellNo+'" class="fa pointer fa-money fa-lg" data-target="#dv-input_payment" data-toggle="modal"></i>   '+result.sellNo+'</td>';
					html += '<td width="100" class="text-center" valign="middle">'+result.name+'</td>';
					html += '<td width="100" class="text-center" valign="middle">'+moment(result.sellDate).utcOffset(+7).format('DD/MM/YYYY HH:mm')+'</td>';
					html += '<td width="100" class="text-center" valign="middle">'+moment(result.dueDate).utcOffset(+7).format('DD/MM/YYYY HH:mm')+'</td>';
					html += '<td width="100" class="sumTotal text-center" valign="middle" data-val= '+result.totalPrice+'>'+((result.totalPrice == 0) ? '-' : numberWithCommas(result.totalPrice))+'</td>';
					html += '<td width="100" class="text-center" valign="middle">'+result.sellBy+'</td>';
					html += '</tr>';
				}
				$('#tb-result_unpaid tbody').html( html );
				$('#dv-loading_data').hide();
				$('#dv-no_data').hide();
				$('.wait').show();
				summary();
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

function receivablePaid(){
	$('#dv-loading_data2').show();
	$('.wait2').hide();
	$('#dv-no_data2').hide();
	$.post('https://api.remaxthailand.co.th/account/receivable/paid', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: $('#cbb-shop').val(),
		month: $('#selectPrevious').val()
	}, function(data){
		if (data.success) {
			var values = data.result;
			if(values.length > 0){
				sortJSON(values, 'paidDate', 'desc');
				var html = '';

				for( i=0; i<values.length; i++ ) {
					var result = values[i];
					//var no = i+1;
					html += '<tr>';
					html += '<td width="100" class="text-center" valign="middle">'+result.sellNo+'</td>';
					html += '<td width="100" class="text-center" valign="middle">'+result.name+'</td>';
					html += '<td width="100" class="text-center" valign="middle">'+moment(result.sellDate).utcOffset(+7).format('DD/MM/YYYY HH:mm')+'</td>';
					html += '<td width="100" class="sumTotalAmount text-center" valign="middle" data-val= '+result.totalPrice+'>'+((result.totalPrice == 0) ? '-' : numberWithCommas(result.totalPrice))+'</td>';
					html += '<td width="100" class="text-center" valign="middle">'+result.sellBy+'</td>';
					html += '<td width="100" class="text-center" valign="middle">'+moment(result.paidDate).utcOffset((result.paidById.length >=9 )? 0:+7).format('DD/MM/YYYY HH:mm')+'</td>'; 
					html += '<td width="100" class="sumTotalPaidPrice text-center" valign="middle" data-val= '+result.paidPrice+'>'+((result.paidPrice == 0) ? '-' : numberWithCommas(result.paidPrice))+'</td>';
					html += '<td width="100" class="text-center" valign="middle">'+result.paidBy+'</td>';
					html += '<td width="100" class="text-center" valign="middle">'+result.remark+'</td>';
					html += '</tr>';
				}
				$('#tb-result_paid tbody').html( html );
				$('#dv-loading_data2').hide();
				$('#dv-no_data2').hide();
				$('.wait2').show();
				summary();
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

function summary(){
	$('#sumTotal').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');
	$('#sumTotalAmount').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');
	$('#sumTotalPaidPrice').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');

	var sumTotal = 0;
	var sumTotalAmount = 0;
	var sumTotalPaidPrice = 0;
	$('.sumTotal').each(function(index) {
		var value = $(this).attr('data-val');
		if(!isNaN(value) && value.length != 0) {
			sumTotal += parseFloat(value);
		}
	});
	$('.sumTotalAmount').each(function(index) {
		var value = $(this).attr('data-val');
		if(!isNaN(value) && value.length != 0) {
			sumTotalAmount += parseFloat(value);
		}
	});
	$('.sumTotalPaidPrice').each(function(index) {
		var value = $(this).attr('data-val');
		if(!isNaN(value) && value.length != 0) {
			sumTotalPaidPrice += parseFloat(value);
		}
	});

	$('#sumTotal').html(((sumTotal == 0) ? '-' : numberWithCommas(sumTotal)));
	$('#sumTotalAmount').html(((sumTotalAmount == 0) ? '-' : numberWithCommas(sumTotalAmount)));
	$('#sumTotalPaidPrice').html(((sumTotalPaidPrice == 0) ? '-' : numberWithCommas(sumTotalPaidPrice)));
}
function sortJSON(data, key, way) {
    return data.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        if (way === 'desc') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
		else { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
    });
};
