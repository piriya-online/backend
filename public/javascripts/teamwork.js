$(function() {

	loadTeamwork('#tb-headSale', '/member/teamwork');

	$(document).on('click', '.btn-expand', function(){
		$('.col4hide').hide();
		$('.col-'+$(this).data('col')).show().removeClass('col-md-4').removeClass('col-md-6').removeClass('col-md-8').addClass('col-md-12');
		$(this).hide().parent().find('.btn-compress').show();
		$(this).parents('.box').find('table .td-hide').show();

	});

	$(document).on('click', '.btn-compress', function(){
		$('.col4hide').show();
		$('.col-'+$(this).data('col')).show().removeClass('col-md-12').addClass('col-md-'+$(this).data('block'));
		$(this).hide().parent().find('.btn-expand').show();
		$(this).parents('.box').find('table .td-hide').hide();
	});


	$(document).on('click', '.btn-reload', function(){
		var $obj = $('#'+$(this).parents('.box').find('table:eq(0)').attr('id'));
		loadTeamwork( '#'+$obj.attr('id'), '/member/teamwork');
	});

	$(document).on('click', '.btn-add', function(){
		$('#dv-add .sp-title').html( $(this).parents('.box-header').find('.box-title').html() ).attr('data-type', $(this).parents('.box').find('table:eq(0)').data('type') ) ;
	});

	$(document).on('click', '#btn-add_secret_code', function(){
		$('#dv-add').modal('hide');
		var type = $('#dv-add .sp-title').attr('data-type');
		var table = '#tb-'+type;
		$.post($('#apiUrl').val()+'/member/teamwork/mapping', {
			authKey: $('#authKey').val(),
			insertKey: $('#insertKey').val(),
			secretCode: $('#txt-secret_code').val(),
			memberType: type,
		}, function(data){
			if (data.success) {
				if (data.correct) {
					//if ( type == 'headSale' ) {
						$(table+' tbody').append( renderTeamwork(data.result[0], 'text-red warning', $('#role').val()) );
						$(table+' .td-hide').removeClass('hidden').hide();
						if ( $(table).parents('.box').find('.btn-compress').css('display') != 'none' ) {
							$(table+' .td-hide').show();
						}
					//}
					$('#txt-secret_code').val('');
				}
				else {
					showWidgetError( table, $('#msg-invalidSecretCode').val()  );
				}
			}
			else {
				showWidgetError( table, data.error+(data.stack != undefined ? ' <pre>'+data.stack+'</pre>' : '')  );
			}
		}, 'json').fail( function(xhr, textStatus, errorThrown) { showWidgetError( table, 'loadDataScreen : ' + xhr.statusText ); });
	});

	$(document).on('click', '.btn-login', function(){
		var $obj = $(this).parents('tr');
		var table = '#'+$obj.parents('table').attr('id');
		$.post($('#apiUrl').val()+'/member/teamwork/signin', {
			authKey: $('#authKey').val(),
			//secretCode: $obj.find('.secretCode').text(),
			memberId: $obj.attr('id').replace($(table).data('type')+'-', ''),
			memberType: $(table).data('type'),
			updateKey: $('#updateKey').val(),
		}, function(data){
			if (data.success) {
				if (data.exist) {
					window.location = './initial';
				}
				else {
					alert('error')
				}
			}
			else {
				showWidgetError( table, data.error+(data.stack != undefined ? ' <pre>'+data.stack+'</pre>' : '')  );
			}
		}, 'json').fail( function(xhr, textStatus, errorThrown) { showWidgetError( table, 'loadDataScreen : ' + xhr.statusText ); });
	});

	$(document).on('click', '.btn-sell_price, .btn-sell_discount', function(){
		$('tr.selected').removeClass('selected');
		var $obj = $(this).parents('tr')
			$obj.addClass('selected');
		$('#price').val( $obj.find('.btn-sell_price').attr('data-value')+''+$obj.find('.btn-sell_discount').attr('data-value') );
	});

	$(document).on('click', '#btn-edit_sell_price', function(){
		var $obj = $('tr.selected');
		if ( $obj.find('.btn-sell_price').attr('data-value') != $('#price :selected').data('price') || $obj.find('.btn-sell_discount').attr('data-value') != $('#price :selected').data('discount') ) {
			var table = '#'+$obj.parents('table').attr('id');
			$.post($('#apiUrl').val()+'/member/sale_price/update', {
				authKey: $('#authKey').val(),
				memberId: $obj.attr('id').replace('dealer-', ''),
				salePrice: $('#price :selected').data('price'),
				discount: $('#price :selected').data('discount'),
			}, function(data){
				if (data.success) {					
					$obj.find('.btn-sell_price').attr('data-value', $('#price :selected').data('price')).html( $('#price :selected').data('price') );
					$obj.find('.btn-sell_discount').attr('data-value', $('#price :selected').data('discount')).html( $('#price :selected').data('discount') );
				}
				else {
					showWidgetError( table, data.error+(data.stack != undefined ? ' <pre>'+data.stack+'</pre>' : '')  );
				}
			}, 'json').fail( function(xhr, textStatus, errorThrown) { showWidgetError( table, 'loadDataScreen : ' + xhr.statusText ); });

		}
		$('#dv-sell_price').modal('hide');
	});

	$(document).on('click', '#tb-headSale tbody tr', function(){
		$('tr.active').removeClass('active');
		$(this).addClass('active');
		$('#tb-sale tbody tr, #tb-dealer tbody tr').hide();
		$('.hs-'+$(this).attr('id').replace('headSale-', '')).show();
		var i = 0;
		$('#tb-dealer tr').each(function(){
			if($(this).css('display') != 'none') {
				$(this).find('td:eq(0)').html( i );
				i++;
			}
		});
		i = 0;
		$('#tb-sale tr').each(function(){
			if($(this).css('display') != 'none') {
				$(this).find('td:eq(0)').html( i );
				i++;
			}
		});
	});

	$(document).on('click', '#tb-sale tbody tr', function(){
		$('tr.active').removeClass('active');
		$(this).addClass('active');
		$('#tb-dealer tbody tr').hide();
		$('.s-'+$(this).attr('id').replace('sale-', '')).show();
	});

	$(document).on('click', '#ul-headSale li a', function(){
		if ( $(this).data('team') == 'all' ) {
			$('#tb-sale tbody tr').show();
		}
		else {
			$('#tb-sale tbody tr').hide();
			$('#tb-sale tbody tr.hs-'+$(this).data('team')).show();
		}
	});

	$(document).on('click', '#ul-sale li a', function(){
		if ( $(this).data('team') == 'all' ) {
			$('#tb-dealer tbody tr').show();
		}
		else {
			$('#tb-dealer tbody tr').hide();
			$('#tb-dealer tbody tr.s-'+$(this).data('team')).show();
		}
	});
	

});


function loadTeamwork(table, path) {
	showWidgetLoading( table );

	$.post($('#apiUrl').val()+path, {
		authKey: $('#authKey').val(),
	}, function(data){
		if (data.success) {
			htmlHeadSale = '';
			htmlSale = '';
			htmlDealer = '';
			var idxHs = idxS = idxD = 1;

			if (data.correct) {
				for( i=0; i<data.result.length; i++ ) {
					var result = data.result[i];
					if ( result.memberType == 'headSale') {
						htmlHeadSale += renderTeamwork(idxHs++, result, '', $('#role').val());
					}
					else if ( result.memberType == 'sale') {
						htmlSale += renderTeamwork(idxS++, result, '', $('#role').val());
					}
					else if ( result.memberType == 'dealer') {
						htmlDealer += renderTeamwork(idxD++, result, '', $('#role').val());
					}
				}
			}

			renderData('#tb-headSale', htmlHeadSale);
			renderData('#tb-sale', htmlSale);
			renderData('#tb-dealer', htmlDealer);

			$('#tb-dealer tbody tr').each(function(){
				if ( $(this).data('sale') != null && $('#ul-sale .li-'+$(this).data('sale')).length == 0) {
					$('#ul-sale').append( '<li role="presentation" class="li-'+$(this).data('sale')+'"><a data-team="'+$(this).data('sale')+'" href="javascript:void(0)" tabindex="-1" role="menuitem">'+ $('#sale-'+$(this).data('sale')+' .firstname').html() +'</a>' );
				}
			});

			$('#tb-sale tbody tr').each(function(){
				if ( $(this).data('headsale') != null && $('#ul-headSale .li-'+$(this).data('headsale')).length == 0) {
					$('#ul-headSale').append( '<li role="presentation" class="li-'+$(this).data('headsale')+'"><a data-team="'+$(this).data('headsale')+'" href="javascript:void(0)" tabindex="-1" role="menuitem">'+ $('#headSale-'+$(this).data('headsale')+' .firstname').html() +'</a>' );
				}
			});

		}
		else {
			showWidgetError( table, data.error+(data.stack != undefined ? ' <pre>'+data.stack+'</pre>' : '')  );
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { showWidgetError( table, 'loadDataScreen : ' + xhr.statusText ); });


}

function renderData(table, tbody) {	
	if ( $(table).length == 1 ) {
		$(table+' tbody').html( tbody ).parents('.box-body').show();
	}
	if ( tbody == '') {
		$(table).hide().parent().find('.no_data').show();
	}
	$(table).parents('.box').find('.btn-add').show();
	$(table).parents('.box').find('.btn-delete').show();
	$(table+' .td-hide').removeClass('hidden').hide();
	if ( $(table).parents('.box').find('.btn-compress').css('display') != 'none' ) {
		$(table+' .td-hide').show();
	}

	hideWidgetFooter( table );
}

function renderTeamwork(index, result, color, role) {
	var html = '';
	html += '<tr id="'+result.memberType+'-'+result.member+'" data-sale="'+result.sale+'" data-headSale="'+result.headSale+'" class="hs-all hs-'+result.headSale+' s-all s-'+result.sale+'">';
	html += '<td class="no text-right">'+index+'</td><td class="td-hide hidden username '+color+'" data-name="username">'+result.username+'</td>';
	html += '<td class="firstname '+color+'" data-name="firstname">'+((result.firstname != null) ? result.firstname : '')+'</td>';
	html += '<td class="lastname '+color+'" data-name="lastname">'+((result.lastname != null) ? result.lastname : '')+'</td>';
	if ( result.memberType == 'headSale' ) {
		html += '<td class="teamCount '+color+'" data-name="teamCount">'+result.teamCount+'</td>'
	}
	html += '<td class="nickname td-hide hidden '+color+'" data-name="nickname">'+((result.nickname != null) ? result.nickname : '')+'</td>';
	html += '<td class="email td-hide hidden '+color+'" data-name="email">'+((result.email == null) ? '' : '<a href="mailto:'+result.email+'" class="email">'+result.email+'</a>')+'</td>';
	if (result.mobile != null && result.mobile.length == 10) var mobile = result.mobile.substr(0, 3)+'-'+result.mobile.substr(3, 4)+'-'+result.mobile.substr(7, 3);
	html += '<td class="mobile td-hide hidden '+color+'" data-name="mobile">'+((result.mobile == null) ? '' : ((result.mobile.length == 10) ? '<a class="visible-xs" href="tel:'+mobile+'">'+mobile+'</a><span class="hidden-xs">'+mobile+'</span>' : result.mobile))+'</td>';
	html += '<td class="td-hide hidden '+color+'">'+((result.mapDate != '' && result.mapDate != undefined) ? result.mapDate : ((result.managerMapping != ''  && result.managerMapping != undefined) ? result.managerMapping : ((result.headSaleMapping != '' && result.headSaleMapping != undefined) ? result.headSaleMapping : ((result.saleMapping != '' && result.saleMapping != undefined) ? result.saleMapping : ''))))+'</td>';
	html += '<td class="secretCode td-hide hidden '+color+'">'+((result.loginDate != '' && result.loginDate != undefined) ? result.loginDate : '')+'</td>';
	html += '<td class="td-hide hidden '+color+' text-center">'+(($('#updateKey').length > 0) ? '<span class="btn btn-login btn-default btn-xs" style="width:50px">'+result.loginCount+' &nbsp;<i class="fa fa-sign-in"></i></span>' : result.loginCount)+'</td>';
	if ( result.memberType == 'dealer' ) {
		html += '<td class="text-center '+color+'"><span class="btn btn-sell_price btn-default btn-xs" data-toggle="modal" data-target="#dv-sell_price" data-value="'+result.sellPrice+'">'+result.sellPrice+'</span></td>';
		html += '<td class="text-center '+color+'"><span class="btn btn-sell_discount btn-default btn-xs" data-toggle="modal" data-target="#dv-sell_price" data-value="'+result.sellDiscount+'">'+result.sellDiscount+'</span> %</td>';
	}
	html += '</tr>';
	return html;
}