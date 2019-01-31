$(function() {

	moment.locale('th');
	
	loadData();

	$('#by_product .plan').on('ifChecked', function(event){	
		$('#tb-result .isPlan').show();
		$('#tb-result .inStock').hide();
		if($('#by_product .in_stock').parents('.icheckbox_minimal').hasClass("checked")){
			$('#tb-result .inStock').show()
		}
	});

	$('#by_product .plan').on('ifUnchecked', function(event){	
		$('#tb-result .isPlan, #tb-result .inStock').hide();
		if($('#by_product .in_stock').parents('.icheckbox_minimal').hasClass("checked")){
			$('#tb-result .inStock').show()
		}
	});

	$('#by_product .in_stock').on('ifChecked', function(event){
		$('#tb-result .inStock').show();
		$('#tb-result .isPlan').hide();
		if($('#by_product .plan').parents('.icheckbox_minimal').hasClass("checked")){
			$('#tb-result .isPlan').show()
		}
	});

	$('#by_product .in_stock').on('ifUnchecked', function(event){	
		$('#tb-result .isPlan, #tb-result .inStock').hide();
		if($('#by_product .plan').parents('.icheckbox_minimal').hasClass("checked")){
			$('#tb-result .isPlan').show()
		}
	});

	$(document).on('click', '#tb-customer .items, #tb-customer .pieces', function(){
		$('#tb-customer .detail-open').removeClass('detail-open').hide();
		$('#tb-customer .bg-light-blue').removeClass('bg-light-blue');
		$(this).parents('tr').addClass('bg-light-blue');
		$('#detail-'+$(this).parents('tr').attr('id')).addClass('detail-open').slideDown();
	});

	$(document).on('click', '#tb-result .badge', function(){
		$('#tb-result .detail-open').removeClass('detail-open').hide();
		$('#tb-result .bg-gray').removeClass('bg-gray');
		$(this).parents('tr').addClass('bg-gray');
		$('#detail-'+$(this).parents('tr').attr('id')).addClass('detail-open').slideDown();
	});	

	$(document).on('click', '.btn-remove_booking', function(){
		$('.remove_booking').removeClass('remove_booking');
		$(this).parents('tr.detail').addClass('remove_booking');
	});

	$(document).on('click', '.btn-lock_booking', function(){
		var obj = $(this).parents('tr.detail');
		var obj = $('.detail[data-product='+obj.data('product')+'][data-member='+obj.data('member')+']');
		$.post($('#apiUrl').val()+'/order/booking/lock', {
			authKey: $('#authKey').val(),
			productCode: obj.data('product'),
			member: obj.data('member'),
			locked: 1,
		}, function(data){
				if (data.success) {
					obj.find('i.locked').show();
					obj.find('.btn-unlock_booking').show();
					obj.find('.btn-lock_booking').hide();
				}
		}, 'json');
	});

	$(document).on('click', '.btn-unlock_booking', function(){
		var obj = $(this).parents('tr.detail');
		var obj = $('.detail[data-product='+obj.data('product')+'][data-member='+obj.data('member')+']');
		$.post($('#apiUrl').val()+'/order/booking/lock', {
			authKey: $('#authKey').val(),
			productCode: obj.data('product'),
			member: obj.data('member'),
			locked: 0,
		}, function(data){
				if (data.success) {
					obj.find('i.locked').hide();
					obj.find('.btn-lock_booking').show();
					obj.find('.btn-unlock_booking').hide();
				}
		}, 'json');
	});

	$(document).on('click', '#btnConfirm', function(){
		var member = $('tr.remove_booking').data('member');
		var product = $('tr.remove_booking').data('product');

		
		$.post($('#apiUrl').val()+'/order/booking/memberCancel', {
			authKey: $('#authKey').val(),
			productCode: product,
			member: member,
		}, function(data){
				if (data.success) {
					var qty = parseInt($('#'+product+' .badge').html().replace(',',''))-parseInt($('tr.remove_booking .qty').html().replace(',',''));
					$('#'+product+' .badge').html( qty );

					qty = parseInt($('#'+member+' .pieces').html().replace(',',''))-parseInt($('tr.remove_booking .qty').html().replace(',',''));
					try { $('#'+member+' .pieces').html( qty ); } catch(ex) {}
					try { $('#'+member+' .items').html( parseInt($('#'+member+' .items').html().replace(',',''))-1 ); } catch(ex) {}

					if ( $('#'+product+' .badge').html() == '0' ) {
						$('#'+product).remove();
						$('#detail-'+product).remove();
					}
					try {
						if ( $('#'+member+' .pieces').html() == '0' ) {
							$('#'+member).remove();
							$('#detail-'+member).remove();
						}
					} catch(ex) {}
					$('.detail[data-product='+product+'][data-member='+member+']').remove();		
					$('tr.remove_booking').remove();
					$('#modal-alert').modal('hide');
					
					setColor(member);
				}
		}, 'json');
	});

});

function loadData(){
	$('#dv-loading').show();
	$('#dv-no_data, #tb-result').hide();
	$.post($('#apiUrl').val()+'/order/booking/list', {
		authKey: $('#authKey').val(),
	}, function(data){
		$('#dv-loading').hide();
		if (data.success) {

			//PRODUCT
			var html = '';
			for( i=0; i<data.result.length; i++ ) {
				var result = data.result[i];
				html += '<tr id="'+result.id+'" class="hidden '+((result.qtyPlan > 0) ? 'isPlan' : '')+' '+
					((result.stock > 0) ? 'inStock' : '')+
					'"><td width="50"><img src="https://img.remaxthailand.co.th/50x50/product/'+result.sku+'/1.jpg" width="50"></td>';
				html += '<td><small>'+result.sku+'</small><br><b class="name text-'+((result.stock >= result.booking) ? 'green' : 'red')+'">'+result.name+'</b></td>';
				html += '<td class="text-right">'+((result[90] > 0) ? numberWithCommas(result[90]) : '-')+'</td>';
				html += '<td class="text-right">'+((result[60] > 0) ? numberWithCommas(result[60]) : '-')+'</td>';
				html += '<td class="text-right">'+((result[30] > 0) ? numberWithCommas(result[30]) : '-')+'</td>';
				html += '<td class="text-right">'+((result[15] > 0) ? numberWithCommas(result[15]) : '-')+'</td>';
				html += '<td class="text-right">'+((result[0] > 0) ? numberWithCommas(result[0]) : '-')+'</td>';
				html += '<td class="text-right stock '+((result.stock < 0) ? 'text-red' : '')+'">'+((result.stock != 0) ? numberWithCommas(result.stock) : '-')+'</td>';
				html += '<td class="text-right qtyPlan">'+((result.qtyPlan > 0) ? numberWithCommas(result.qtyPlan) : '-')+'</td>';
				html += '<td class="text-right font-bold"><label class="pointer badge bg-'+((result.stock >= result.booking) ? 'green' : 'red')+'">'+numberWithCommas(result.booking)+'</label></td>';
				html += '</tr>';
				html += '<tr id="detail-'+result.id+'" class="hidden"><td colspan=10 class="padding-0">'+
					'<table class="table table-condensed text-'+((result.stock >= result.booking) ? 'green' : 'red')+'"><tbody></tbody></table>'
					+'</td></tr>';
			}

			$('#tb-result tbody').html( html );
			$('.show-tooltip').tooltip();
			$('.hidden').removeClass('hidden').hide();

			if($('#by_product .plan').parents('.icheckbox_minimal').hasClass("checked")){
				$('#tb-result .isPlan').show()
			}
			if($('#by_product .in_stock').parents('.icheckbox_minimal').hasClass("checked")){
				$('#tb-result .inStock').show()
			}
			
			if (data.result.length == 0)
			{
				$('#dv-no_data').show();
				$('#tb-result').hide();
			}
			else {
				$('#dv-no_data').hide();
				$('#tb-result').show();
			}

			//CUSTOMER
			html = '';
			for( i=0; i<data.customer.length; i++ ) {
				var result = data.customer[i];
				html += '<tr id="'+result.id+'"><td class="text-center items pointer">0</td>';
				html += '<td class="text-center"><label class="pieces badge pointer">0</label></td>';
				html += '<td class="name">'+result.firstname+' '+result.lastname+'</td>';
				html += '<td class="contactName">'+result.contactName+'</td>';
				html += '<td>'+result.shopName+'</td>';
				html += '<td>'+((result.mobile != null) ? result.mobile.substr(0,3)+'-'+result.mobile.substr(3,4)+'-'+result.mobile.substr(7) : '-')+'</td>';
				html += '<td>'+result.province+'</td>';
				html += '</tr><tr id="detail-'+result.id+'" class="hidden"><td colspan=7>'+
					'<table class="table table-striped table-condensed table-hover"><thead>'+
					'<tr><th>ชื่อสินค้า</th><th width="50" class="text-right">Stock</th><th width="50" class="text-right">Plan</th><th width="50" class="text-right">จอง</th><th width="60"></th></tr></thead><tbody></tbody></table>'
					+'</td>';
			}
			$('#tb-customer tbody').html( html );
			$('.show-tooltip').tooltip();
			$('.hidden').removeClass('hidden').hide();
			
			if (data.customer.length == 0)
			{
				$('#dv-no_customer').show();
				$('#tb-customer').hide();
			}
			else {
				$('#dv-no_customer').hide();
				$('#tb-customer').show();
			}		

			//BOOKING
			for( i=0; i<data.booking.length; i++ ) {
				var result = data.booking[i];
				var stock = 0;
					if ($('#'+result.product+' .stock').html() != undefined)
						stock = parseInt($('#'+result.product+' .stock').html().replace(',',''));
					else {
						console.log( result.product );
					}
				var plan = 0;
					if ($('#'+result.product+' .qtyPlan').html() != undefined)
						plan = parseInt($('#'+result.product+' .qtyPlan').html().replace(',',''));
				$('#detail-'+result.member+' tbody').append('<tr data-product="'+result.product+'" data-member="'+result.member+'" class="detail">'+
					'<td><span class="text-'+((stock >= result.qty) ? 'green' : 'red')+'"><i class="fa fa-lock locked'+((!result.locked) ? ' hidden' : '')+'"></i> '+
					$('#'+result.product+' .name').html()+'</span><small class="text-muted"> : จองเมื่อ '+moment(result.bookingDate).fromNow()+
					' ('+moment(result.expiryDate).fromNow()+' จะยกเลิกรายการ)</small>'
					+'</td><td class="text-right'+((stock < 0) ? ' text-red' : '')+'">'+
					$('#'+result.product+' .stock').html()+'</td><td class="text-right">'+
					$('#'+result.product+' .qtyPlan').html()+'</td><td class="text-right"><label class="qty badge bg-'+((stock >= result.qty) ? 'green' : 'red')+' pointer">'+
					result.qty+'</label></td><td nowrap="nowrap">'+
					'<button class="btn-remove_booking btn btn-xs btn-danger" data-target="#modal-alert" data-toggle="modal" title="' + $('#msg-cancel').val() + '"><i class="fa fa-trash"></i></button>'+
					'<button class="btn-lock_booking btn btn-xs btn-danger margin-left-5'+((result.locked) ? ' hidden' : '')+'" title="ล็อคสินค้า"><i class="fa fa-lock"></i></button>'+
					'<button class="btn-unlock_booking btn btn-xs btn-primary margin-left-5'+((!result.locked) ? ' hidden' : '')+'" title="ยกเลิกการล็อคสินค้า"><i class="fa fa-unlock-alt"></i></button>'+
					'</td></tr>');
				$('#'+result.member+' .pieces').html( parseInt($('#'+result.member+' .pieces').html())+result.qty );
				$('#'+result.member+' .items').html( parseInt($('#'+result.member+' .items').html())+1 );

				$('#detail-'+result.product+' tbody').append('<tr data-product="'+result.product+'" data-member="'+result.member+'" class="detail">'+
					'<td style="border-bottom:1px solid white !important"></td><td class="text-right" width="300" nowrap="nowrap"><i class="fa fa-lock locked'+((!result.locked) ? ' hidden' : '')+'"></i> '+
					$('#'+result.member+' .name').html()+
					(($('#'+result.member+' .contactName').html() != '') ? ' ('+$('#'+result.member+' .contactName').html()+')' : '') +
					//(($('#detail-'+result.product+' table').hasClass('text-red')) ? '</td><td width="60" class="text-right"><button class="btn-product-' + result.product + ' btn-remove_booking btn btn-xs btn-danger" data-target="#modal-alert" data-toggle="modal">' + $('#msg-cancel').val() + '</button>' : '')+
					'<small class="text-muted"> : จองเมื่อ '+moment(result.bookingDate).fromNow()+' ('+moment(result.expiryDate).fromNow()+' จะยกเลิกรายการ)</small>'+
					'</td><td width="60" class="text-right" nowrap="nowrap"><button class="btn-remove_booking btn btn-xs btn-danger" data-target="#modal-alert" data-toggle="modal" title="' + $('#msg-cancel').val() + '"><i class="fa fa-trash"></i></button>'+
					'<button class="btn-lock_booking btn btn-xs btn-danger margin-left-5'+((result.locked) ? ' hidden' : '')+'" title="ล็อคสินค้า"><i class="fa fa-lock"></i></button>'+
					'<button class="btn-unlock_booking btn btn-xs btn-primary margin-left-5'+((!result.locked) ? ' hidden' : '')+'" title="ยกเลิกการล็อคสินค้า"><i class="fa fa-unlock-alt"></i></button>'+
					'</td><td class="text-right font-bold qty" width="50">'+result.qty+'</td></tr>');
			}

			$('.hidden').removeClass('hidden').hide();
			
			for( i=0; i<data.customer.length; i++ ) {
				setColor(data.customer[i].id);
			}

		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function setColor(id){	
	var hasRed = $('#detail-'+id+' .badge.bg-red').length > 0;
	var hasGreen = $('#detail-'+id+' .badge.bg-green').length > 0;
	$('#'+id+' .pieces').removeClass('bg-green').removeClass('bg-red').removeClass('bg-orange');
	if (hasGreen && !hasRed){
		$('#'+id+' .pieces').addClass('bg-green');
	}
	else if (hasRed && !hasGreen){
		$('#'+id+' .pieces').addClass('bg-red');
	}
	else {
		$('#'+id+' .pieces').addClass('bg-orange');
	}
}