var isPaid = true;
var isUnpaid = true;

$(function() {
	if (isPaid) $('#isPaid').iCheck('check');
	else $('#isPaid').iCheck('uncheck');
	if (isUnpaid) $('#isUnpaid').iCheck('check');
	else $('#isUnpaid').iCheck('uncheck');

	loadData();

	$('#isPaid').on('ifChecked', function(event){
		isPaid = true;
		FilterData();
	});
	$('#isPaid').on('ifUnchecked', function(event){
		isPaid = false;
		FilterData();
	});

	$('#isUnpaid').on('ifChecked', function(event){
		isUnpaid = true;
		FilterData();
	});
	$('#isUnpaid').on('ifUnchecked', function(event){
		isUnpaid = false;
		FilterData();
	});

});


function loadData() {
	$.post($('#apiUrl').val()+'/shop/customer/list', {
		authKey: $('#authKey').val(),
	}, function(data){
			if (data.success && data.correct) {
				var html = '';
				for( i=0; i<data.result.length; i++ ) {
					var result = data.result[i];
					html += '<tr class="hidden" data-id="'+result.id+'" data-member="'+((result.member != null) ? result.member : '')+'">';
					html += '<td class="text-center padding-bottom-0"><input class="margin-top-2" type="checkbox"></td>';
					html += '<td><a href="/customer/info/'+result.id+'/'+((result.member != null) ? result.member : '')+'">'+result.name+'</a>';
					html += (result.email != null) ? ' <a href="mailto:'+result.email+'" title="'+result.email+'"><i class="fa fa-envelope-o"></i></a>' : '';
					if (result.mobile != null && result.mobile.length == 10) var mobile = result.mobile.substr(0, 3)+'-'+result.mobile.substr(3, 4)+'-'+result.mobile.substr(7, 3);
					//html += '<td class="mobile td-hide hidden '+color+'" data-name="mobile">'+((result.mobile == null) ? '' : ((result.mobile.length == 10) ? '<a class="visible-xs" href="tel:'+mobile+'">'+mobile+'</a><span class="hidden-xs">'+mobile+'</span>' : result.mobile))+'</td>';
					html += (result.mobile != null) ? ' <a href="tel:'+result.mobile+'" title="'+((mobile != null) ? mobile : result.mobile)+'"><i class="fa fa-phone-square"></i></a>' : '';
					html += '</td><td>'+((result.shopName != null && result.shopName != "") ? result.shopName+((result.contactName != null) ? ' (' + result.contactName + ')' : '') : '')+'</td>';
					html += '<td class="text-center">'+((result.orderCount > 0) ? result.orderCount : '-')+'</td>';
					html += '<td class="text-right text-success font-bold totalPrice" data-val="'+result.totalPrice+'">'+((result.totalPrice > 0) ? numberWithCommas(result.totalPrice.toFixed(0)) : '-')+'</td>';
					html += '<td class="text-right text-red font-bold creditPrice" data-val="'+result.creditPrice+'">'+((result.creditPrice > 0) ? numberWithCommas(result.creditPrice.toFixed(0)) : '-')+'</td>';
					html += '<td class="text-center">'+((result.credit > 0) ? result.credit : '-')+'</td>';
					var sp = result.addDate.split(' ');
					var date = sp[0].split('-');
					html += '<td class="text-center">'+date[2]+'-'+date[1]+'-'+(parseInt(date[0])+543)+' '+sp[1]+'</td>';
					html += '</tr>';
				}
				$('#tb-result tbody').html( html );

				FilterData();

			}
			else {
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function FilterData(){
	$('#tb-result tbody tr').removeClass('shown').hide();
	$('#tb-result tbody tr').each(function(){
		if(isPaid && $(this).find('.totalPrice').attr('data-val') != "0" )
			$(this).removeClass('hidden').show().addClass('shown');
		if(isUnpaid && $(this).find('.creditPrice').attr('data-val') != "0" )
			$(this).removeClass('hidden').show().addClass('shown');
		if(!isUnpaid && $(this).find('.creditPrice').attr('data-val') == "0" && !isPaid && $(this).find('.totalPrice').attr('data-val') == "0" )
			$(this).removeClass('hidden').show().addClass('shown');
	});
}