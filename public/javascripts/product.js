var loadedCategory = false;
var loadedBrand = false;
var firstLoad = true;
var product;
var category = "3";
var productCode = '';
var onlyUpdate = false;
var cart = {};

function renderScreen( config ) {
	if (firstLoad) {
		if (config == null) {
			$('#btn-box-view').addClass('btn-primary active').removeClass('btn-default');
			$('#cb-show_image').addClass('btn-primary active').removeClass('btn-default');
		}
		else {
			if ( config.showPicture)
				$('#cb-show_image').addClass('btn-primary active').removeClass('btn-default');
			if ( config.view == 'box' )
				$('#btn-box-view').addClass('btn-primary active').removeClass('btn-default');
			else
				$('#btn-list-view').addClass('btn-primary active').removeClass('btn-default');
			category = config.category;
		}
		
		loadBrand();
		loadCategory();
		firstLoad = false;

		if (device == 'desktop') {
			//$('#dv-category').scrollToFixed({ marginTop: 10 });
		}
		$('#dv-cart').scrollToFixed({ marginTop: 10 });

	}
}

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
		
	$('.txt-qty').ForceNumericOnly();
	loadScreenConfig();
	loadCartSummary();
	
	$(document).on('click', '#ul-category li.category', function(){
		var $obj = $(this);
		category = $obj.data('id');

		$('#tab').show();

		$('.brand').hide();
		$('.cat-'+category).show();
		$('.category i.fa-check-circle').removeClass('fa-check-circle').addClass('fa-chevron-circle-right');
		$('.category').removeClass('font-bold active');
		$('.category a').removeClass('text-light-blue');
		$('li.brand a').removeClass('text-red font-bold');
		$obj.addClass('font-bold').addClass('active')
			.find('i').removeClass('fa-chevron-circle-right').addClass('fa-check-circle');
		$obj.find('a').addClass('text-light-blue');

		$('#tab li').hide();
		$('#ul-category li.brand.cat-' + category).each( function(){
			$('#tab li.brand-'+$(this).data('id')).show();
		});

		var brand = $('li.brand.cat-'+category+'.brand-1 a').length == 0 ? 6 : 1;

		$('#tab li.active').removeClass('active font-bold');
		$('#tab li.brand-'+brand).addClass('active font-bold').show();

		$('#ul-category li.brand a').removeClass('text-red font-bold');
		$('li.brand.cat-'+category+'.brand-'+brand+' a').addClass('text-red font-bold');

		$('#dv-header').html( $obj.find('span').text()+' <span><small></small></span><span><small> : <b class="countItem">0</b> ' + $('#msg-items').val() + '</small></span>' );
		$('#dv-header small:eq(0)').html( '<i class="fa fa-angle-right"></i> ' + $('li.brand.cat-'+category+'.brand-'+brand+' a').text() );

		showProduct();
		updateMemberConfig();
	});

	$(document).on('click', '#ul-category li.brand', function(){
		$('#ul-category li.brand a').removeClass('text-red font-bold');
		$(this).find('a').addClass('text-red font-bold');
		
		$('#tab li.active').removeClass('active font-bold');
		$('#tab li.brand-'+$(this).data('id')).addClass('active font-bold');

		$('#dv-header small:eq(0)').html( '<i class="fa fa-angle-right"></i> ' + $(this).find('span').text() );

		showProduct();
	});

	$(document).on('click', '#tab li', function(){		
		$('#ul-category li.brand a').removeClass('text-red font-bold');
		$('#ul-category li.brand-' + $(this).data('id') + ' a').addClass('text-red font-bold');

		$('#tab li.active').removeClass('active font-bold');
		$('#tab li.brand-'+$(this).data('id')).addClass('active font-bold');

		if ($(this).hasClass('brand-')) {
			$('#dv-header small:eq(0)').html('');
		}
		else {
			$('#dv-header small:eq(0)').html( '<i class="fa fa-angle-right"></i> ' + $(this).find('a').text() );
		}

		showProduct();
		updateMemberConfig();

	});

	$(document).on('mouseover', '.tr-brand', function(){
		$(this).find('.btn-add_cart').show();
	});

	$(document).on('mouseout', '.tr-brand', function(){
		$(this).find('.btn-add_cart').hide();
	});

	$(document).on('mouseover', '.dv-thumb', function(){
		$(this).find('.btn-add_cart_box').show();
	});

	$(document).on('mouseout', '.dv-thumb', function(){
		$(this).find('.btn-add_cart_box').hide();
	});

	$(document).on('click', '#cb-show_image', function(){
		if ($(this).hasClass('active')) {
			$(this).removeClass('active btn-primary').addClass('btn-default');
			$('.td-thumb, .dv-thumb').hide();
		}
		else {
			$(this).addClass('active btn-primary').removeClass('btn-default');
			$('.td-thumb, .dv-thumb').show();
		}
		updateMemberConfig();
	});

	$(document).on('click', '#cb-only_update', function(){
		if ($(this).hasClass('active')) {
			$(this).removeClass('active btn-primary').addClass('btn-default');
			onlyUpdate = false;
			//$('.hasStockUpdate').show();
			//$('.notStockUpdate').show();
		}
		else {
			$(this).addClass('active btn-primary').removeClass('btn-default');
			onlyUpdate = true;
			//$('.hasStockUpdate').show();
			//$('.notStockUpdate').hide();
		}
		showProduct();
	});

	$(document).on('click', '#btn-list-view', function(){
		if ($(this).hasClass('active')) {
			$(this).removeClass('active btn-primary').addClass('btn-default');
			$('#btn-box-view').addClass('active btn-primary').removeClass('btn-default');
			$('#dv-box').show();
			$('.table-responsive').hide();
		}
		else {
			$(this).addClass('active btn-primary').removeClass('btn-default');
			$('#btn-box-view').removeClass('active btn-primary').addClass('btn-default');
			$('.table-responsive').show();
			$('#dv-box').hide();
		}
		updateMemberConfig();
	});

	$(document).on('click', '#btn-box-view', function(){
		if ($(this).hasClass('active')) {
			$(this).removeClass('active btn-primary').addClass('btn-default');
			$('#btn-list-view').addClass('active btn-primary').removeClass('btn-default');
			$('.table-responsive').show();
			$('#dv-box').hide();
		}
		else {
			$(this).addClass('active btn-primary').removeClass('btn-default');
			$('#btn-list-view').removeClass('active btn-primary').addClass('btn-default');
			$('#dv-box').show();
			$('.table-responsive').hide();
		}
		updateMemberConfig();
	});

	$(document).on('keyup', '#txt-search', function(){
		searchProduct();
	});

	$(document).on('click', '.btn-add_cart, .btn-add_cart_box, .btn-booking_box', function(){
		productCode = $(this).parents('.product-row').data('id');
		if(cart[productCode] != undefined) $('#inCart').show().find('.qty').html( numberWithCommas( cart[productCode] ) );
		else $('#inCart').hide();
	});

	$(document).on('click', '.img-product', function(){
		productCode = $(this).data('id');
	});

	$(document).on('click', '.zoom', function(){
		var $obj = $(this).parents('.product-row');
		if ( $('#sku-'+$obj.find('.sku').text()).attr('data-image') == '' && $(this).attr('src').indexOf('Logo') == -1) {
			loadProductImage(1, $obj.find('.sku').text());
		}
		else {
			showProductImage($obj.find('.sku').text());
		}
		//productCode = $(this).parents('.product-row').data('id');
	});

	$(document).on('click', '#dv-add_cart .btn-save, #carousel-add_cart .btn-save', function(){
		var qty = 0;
		try {
			qty = parseInt( $(this).parents('.input-group').find('.txt-qty').val() )
		}
		catch(err) {
		}
		if (qty > 0) {
			$.post($('#apiUrl').val()+'/order/cart/update', {
				authKey: $('#authKey').val(),
				productCode: productCode,
				qty: qty,
			}, function(data){
					if (data.success) {
						if (data.correct) {
							
							if (data.result[0].items > 0){
								$('#items').html( numberWithCommas(data.result[0].items) );
								$('#pieces').html( numberWithCommas(data.result[0].qty) );
								$('#totalPrice').html( numberWithCommas(data.result[0].price) );
								$('.sp-no_item').hide();
								$('.sp-has_item').show();
								$('#menu-cart .badge').addClass('bg-red').html( numberWithCommas(data.result[0].items) ).show();
								loadCartDetail();
							}

							if (data.result[0].remain == 0) {
								$('.btn-product-'+data.result[0].product).remove();
								$('.no-stock-'+data.result[0].product).show();
								cart = {};
							}

						}
					}

					$('#dv-cart').css('background', '#ffcc99');
					setTimeout(function(){
						$('#dv-cart').stop().css('background', 'white');
					}, 1000);

			}, 'json');
		}
		$('#dv-add_cart').modal('hide');
		$('#dv-view_image').modal('hide');
	});

	$(document).on('click', '#dv-booking .btn-save', function(){
		var qty = 0;
		try {
			qty = parseInt( $(this).parents('.input-group').find('.txt-qty').val() )
		}
		catch(err) {
		}
		if (qty > 0) {
			$.post($('#apiUrl').val()+'/order/booking/update', {
				authKey: $('#authKey').val(),
				productCode: productCode,
				qty: qty,
			}, function(data){
					if (data.success) {
						if (data.correct) {
						}
					}
			}, 'json');
		}
		$('#dv-booking').modal('hide');
		$('#dv-view_image').modal('hide');
	});

	$('#dv-view_image').on('hidden.bs.modal', function (e) {
		$('#dv-view_image .carousel-indicators, #dv-view_image .carousel-inner').html('');
		$('#carousel-product').removeClass('carousel').removeClass('slide');
	});

	$(document).on('click', '#btn-search', function(){
		if( $('#txt-search').val().trim().length > 1 ){
			$('.category i.fa-check-circle').removeClass('fa-check-circle').addClass('fa-chevron-circle-right');
			$('.category').removeClass('font-bold active');
			$('.category a').removeClass('text-light-blue');
			$('li.brand a').removeClass('text-red font-bold');
			$('li.brand').hide();
			searchAllProduct();
			//console.log($('#txt-search').val().trim());
		}
	});

});



function loadCategory(){
	
	$.post($('#apiUrl').val()+'/product/category_and_brand', {
		shop: 1,
		authKey: $('#authKey').val(),
	}, function(data){
			if (data.success) {
				if (data.correct) {
					for( i=0; i<data.result.length; i++ ) {
						var result = data.result[i];
						var htmlBrand = '';
						if (result.brand != undefined)
						{
							for( j=0; j<result.brand.length; j++ ) {
								var brand = result.brand[j];
								htmlBrand += '<li class="brand hidden cat-' + result.id + ' brand-' + brand.id + '" data-id="' + brand.id + '"><a href="javascript:void(0)" class="padding-left-30"><i class="fa fa-caret-right"></i> <span>' + brand.name + '</span></a></li>';
							}
						}
						$('#ul-category').append('<li class="category" data-id="' + result.id + '"><a href="javascript:void(0)"><i class="fa fa-chevron-circle-right"></i> <span>' + result.name + '</span></a>' + ((htmlBrand != '') ? htmlBrand : '') + '</li>');
					}
					$('.hidden').removeClass('hidden').hide();
					loadedCategory = true;
					if (loadedCategory && loadedBrand) loadProduct();
				}
				else {
					loadedCategory = true;
					if (loadedCategory && loadedBrand) loadProduct();
				}
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}



function loadBrand(){
	$.post($('#apiUrl').val()+'/product/brand', {
		shop: 1,
	}, function(data){
			if (data.success) {
				if (data.correct) {
					for( i=0; i<data.result.length; i++ ) {
						var result = data.result[i];
						$('#tab').append('<li class="brand-' + result.id + ' hidden" data-id="' + result.id + '"><a href="javascript:void(0)">' + result.name + '</a></li>')
					}
					$('.hidden').removeClass('hidden').hide();
					loadedBrand = true;
					if (loadedCategory && loadedBrand) loadProduct();
				}
				else {
					loadedBrand = true;
					if (loadedCategory && loadedBrand) loadProduct();
				}
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}



function loadProduct(){
	$.post($('#apiUrl').val()+'/product/all', {
		authKey: $('#authKey').val(),
	}, function(data){
			if (data.success) {
				if (data.correct) {
					product = data.result;
					renderProduct();
				}
				else {
					$('#dv-no_data').show();
					$('#dv-loading').hide();
				}
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });


	if (Cookies.get('token') == undefined) {
		Cookies.set('token', '');
	}

	/*var token = Cookies.get('token');
	var socket = io('https://io.remaxthailand.co.th');

	if (token == '') {
		socket.emit('access', { token: token } );
	}

	socket.on('access', function(data){
		token = data.token;
		Cookies.set('token', token);
		/*console.log('access');
		console.log(data);
		console.log('token='+token);* /
	});

	socket.on('online', function(data){
		console.log('online='+data.count);
	});

	socket.on('error', function(data){
		console.log('error');
		console.log(data);
	});
	*/


	/*$.post('//io.remaxthailand.co.th/product/all', {
		authKey: $('#authKey').val(),
	}, function(data){
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });*/

}




function loadCartSummary(){
	$.post($('#apiUrl').val()+'/order/cart/summary', {
		authKey: $('#authKey').val(),
	}, function(data){
			if (data.success) {
				if (data.correct) {
					if (data.result[0].items > 0){
						$('#items').html( numberWithCommas(data.result[0].items) );
						$('#pieces').html( numberWithCommas(data.result[0].qty) );
						$('#totalPrice').html( numberWithCommas(data.result[0].price) );
						$('.sp-no_item').hide();
						$('.sp-has_item').show();
						loadCartDetail();
					}
				}
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}


function renderProduct(){
	var html = '';
	var html2 = '';
	for(i=0; i<product.length; i++) {
		result = product[i];
		html += '<tr data-id="' + result.id + '" id="sku-' + result.sku + '" data-image="" class="product-row tr-cat-' + result.category + (result.isClearance ? ' tr-cat-CL ' : '') + ' tr-brand-'+result.brand+' tr-brand hidden font-normal '+(result.isStockUpdate ? 'hasStockUpdate' : 'notStockUpdate')+' '+(result.isNew ? 'hasNew' : 'notHasNew')+ '">';
		html += '<td class="td-thumb padding-left-0"><img data-id="' + result.id + '" class="img-product img-thumbnail lazy'+((result.image != null) ? ' zoom" data-target="#dv-view_image" data-toggle="modal"' : '"')+' data-original="' + ((result.image != null) ? result.image : 'https://src.remaxthailand.co.th/img/Remax/product/default.jpg') + '" src="https://src.remaxthailand.co.th/img/Remax/product/default.jpg" width="100"></td>';
		html += '<td><span class="text-'+((result.isNew == 1) ? 'red' : 'light-blue')+' font-bold name">' + result.name + '</span>';
		html += (result.isNew == 1) ? ' <img src="/images/icons/new.gif">' : '';
		html += result.isStockUpdate ? ' <img src="https://src.remaxthailand.co.th/img/Remax/web/gif/update.gif">' : '';
		html += '<br>';
		html += (result.sku != null) ? 'SKU : <b class="sku">' + result.sku + '</b>' : '';
		html += (result.warranty != 0) ? ' &nbsp; ' + $('#msg-warranty').val() + ' : <b>' + ((result.warranty >= 365) ? (result.warranty/365)+' '+$('#msg-year').val() : ((result.warranty >= 30) ? (result.warranty/30)+ ' ' + $('#msg-month').val() : result.warranty + ' ' +$('#msg-day').val())) + '</b>' : '';
		html += '<br>';
		if (($('#role').val() == 'dealer' || $('#role').val() == 'member'|| $('#role').val() == 'sale-officer') && result.hasStock == 1) {
			html += '<button class="btn-product-' + result.id + ' btn-add_cart btn btn-sm btn-warning' + ((device == 'desktop') ? ' hidden' : '') + '" data-target="#dv-add_cart" data-toggle="modal">' + $('#msg-orderNow').val() + '</button>';
		}
		html += '<span class="no-stock-' + result.id + ' font-sm text-no_stock text-red font-bold' + ((result.hasStock == 1) ? ' hidden' : '') + '">'+ ((result.category != 27) ? '<i class="fa fa-warning"></i> ':'') + ((result.category != 27) ? $('#msg-outOfStock').val() :' ') + '</span>';
		if (($('#role').val() == 'dealer' || $('#role').val() == 'member'|| $('#role').val() == 'sale-officer') && result.isPo == 1 && result.hasStock == 0) {
			html +=  '<br/><button class="btn-product-' + result.id + ' btn-booking_box btn btn-danger btn-sm" data-toggle="modal" data-target="#dv-booking">' + $('#msg-bookingNow').val() + '</button>';
		}

		if ( result.onCart != undefined ) {
			if ( result.onCart > 0 || result.onOrder > 0 ) {
				html += '<br><span class="font-sm text-muted"><span' + ((result.onCart != 0) ? ' class="text-red"' : '') + '>' + $('#msg-itemOnCart').val() + ' : <b>' + result.onCart + '</b></span> / <span' + ((result.onOrder != 0) ? ' class="text-red"' : '') + '>' + $('#msg-onOrder').val() + ' : <b' + ((result.onOrder != 0) ? ' class="font-bigger text-red"' : '') + '>' + result.onOrder + '</b></span></span>';
			}
		}

		html += '</td>';
		if ( result.stock != undefined && $('#role').val() == 'manager' ) {
			$('#tb-result thead .stock').show();
			html += '<td class="text-right font-bigger text-yellow">' + ((result.stock > 0) ? numberWithCommas(result.stock) : '-' )+ '</td>';
		}

		html += '<td class="text-right font-bigger font-bold text-green">' + numberWithCommas(result.retailPrice) + '</td>';

		if ( result.wholesalePrice != undefined ) {
			$('#tb-result thead .wholesalePrice').show();
			html += '<td class="text-right font-bigger font-bold text-red">' + numberWithCommas(result.wholesalePrice) + '</td>';
		}
		if ( result.wholesalePrice1 != undefined ) {
			$('#tb-result thead .wholesalePrice1').show();
			html += '<td class="text-right"><span class="font-bigger font-bold text-red">' + numberWithCommas(result.wholesalePrice1) + 
				'</span> <i class="fa fa-comment-o show-tooltip" data-toggle="tooltip" title="' + result.qty1 + ' ' + $('#msg-orMoreItems').val() + ' ' + $('#msg-ofThe'+((result.isSameCategory == 1) ? 'Same' : 'Differnce')+'Category').val() + '"></i></td>';
		}
		if ( result.wholesalePrice2 != undefined ) {
			$('#tb-result thead .wholesalePrice2').show();
			html += '<td class="text-right"><span class="font-bigger font-bold text-red">' + numberWithCommas(result.wholesalePrice2) + 
				'</span> <i class="fa fa-comment-o show-tooltip" data-toggle="tooltip" title="' + result.qty2 + ' ' + $('#msg-orMoreItems').val() + ' ' + $('#msg-ofThe'+((result.isSameCategory == 1) ? 'Same' : 'Differnce')+'Category').val() + '"></i></td>';
		}

		if ( result.price1 != undefined ) {
			$('#tb-result thead .price1').show();
			html += '<td class="text-right font-bigger">' + numberWithCommas(result.price1) + '</td>';
		}
		if ( result.price2 != undefined ) {
			$('#tb-result thead .price2').show();
			html += '<td class="text-right font-bigger">' + numberWithCommas(result.price2) + '</td>';
		}
		if ( result.price3 != undefined ) {
			$('#tb-result thead .price3').show();
			html += '<td class="text-right font-bigger' + (($('#role').val() == 'sale') ? ' text-red font-bold' : '') + '">' + numberWithCommas(result.price3) + '</td>';
		}
		if ( result.price4 != undefined ) {
			$('#tb-result thead .price4').show();
			html += '<td class="text-right font-bigger' + (($('#role').val() == 'headSale') ? ' text-red font-bold' : '') + '">' + numberWithCommas(result.price4) + '</td>';
		}
		if ( result.price5 != undefined ) {
			$('#tb-result thead .price5').show();
			html += '<td class="text-right font-bigger' + (($('#role').val() == 'manager') ? ' text-red font-bold' : '') + '">' + numberWithCommas(result.price5) + '</td>';
		}
		html += '</tr>';

		html2 += '<div data-id="' + result.id + '" class="product-row col-xs-12 col-sm-6 col-md-4 col-lg-4 margin-bottom-15 dv-cat-' + result.category + (result.isClearance ? ' dv-cat-CL ' : '') + ' dv-brand-'+result.brand+' dv-brand hidden '+(result.isStockUpdate ? 'hasStockUpdate' : 'notStockUpdate')+' '+(result.isNew ? 'hasNew' : 'notHasNew')+ '">';
		html2 += '<div class="dv-box well well_thin well_white">';
		html2 += '<div class="dv-thumb margin-bottom-5 padding-top-5">';
		html2 += ((result.isNew == 1) ? '<img class="img-up img-new" src="/images/icons/new.gif">' : '');
		html2 += ((result.rank != null && result.rank <= 20) ? '<img class="img-up img-top" src="/images/icons/top.png">' : '');
		html2 += ((result.rank != null && result.rank > 20 && result.rank <= 50) ? '<img class="img-up img-top" src="/images/icons/best.png">' : '');
		html2 += '<img data-id="' + result.id + '" style="position:inherit" class="'+(result.isNew == 1 ? 'isNew ' : '')+'img-product lazy img-responsive img-rounded'+((result.imageMedium != null) ? ' zoom" data-target="#dv-view_image" data-toggle="modal"' : '"')+' data-original="' + ((result.imageMedium != null) ? result.imageMedium : 'https://src.remaxthailand.co.th/img/Remax/product/default.jpg') + '" src="https://src.remaxthailand.co.th/img/Remax/product/default.jpg">';
		
		if (($('#role').val() == 'dealer' || $('#role').val() == 'member'|| $('#role').val() == 'sale-officer') && result.hasStock == 1) {
			html2 += '<button class="btn-product-' + result.id + ' btn-add_cart_box btn btn-warning btn-sm btn-center hidden" data-toggle="modal" data-target="#dv-add_cart">' + $('#msg-orderNow').val() + '</button>';
		}
		
		html2 += '<span class="no-stock-' + result.id + ' btn-center text-no_stock text-red font-bold' + ((result.hasStock == 1) ? ' hidden' : '') + '" style="text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;margin-left:'+((result.category != 27) ? -65 : 0) +'px">'+ ((result.category != 27) ? '<i class="fa fa-warning"></i> ' : '') + ((result.category != 27) ? $('#msg-outOfStock').val() : '');
		
		if (($('#role').val() == 'dealer' || $('#role').val() == 'member'|| $('#role').val() == 'sale-officer') && result.isPo == 1) {
			html2 +=  '<br/><button class="btn-product-' + result.id + ' btn-booking_box btn btn-danger btn-sm btn-center" style="margin-top:20px" data-toggle="modal" data-target="#dv-booking">' + $('#msg-bookingNow').val() + '</button>';
		}
		html2 +=  '</span>';

		if ( $('#role').val() == 'dealer' || $('#role').val() == 'member' || $('#role').val() == 'sale-officer') {
		}
		html2 += '</div>';
		html2 += '<div><small class="pull-left text-muted">SKU : <b class="sku">'+result.sku+'</b>';
		html2 += (result.isStockUpdate ? ' <img class="img-up" src="https://src.remaxthailand.co.th/img/Remax/web/gif/update.gif">' : '') + '</small>';
		//html2 += ((result.isNew == 1) ? ' <img class="img-up img-new" src="/images/icons/new.gif">' : '') + '</small>';
		html2 += (result.warranty != 0) ? '<small class="pull-right text-muted">' + $('#msg-warranty').val() + ' <b>' + ((result.warranty >= 365) ? (result.warranty/365)+' '+$('#msg-year').val() : ((result.warranty >= 30) ? (result.warranty/30)+ ' ' + $('#msg-month').val() : result.warranty + ' ' +$('#msg-day').val())) + '</b></small>' : '';
		html2 += '<div class="clearfix"></div><div class="text-'+((result.isNew == 1) ? 'red' : 'light-blue')+' font-bold name" style="min-height:48px">' + result.name;
		html2 += '</div><div class="line"></div>';
		
		if ( result.wholesalePrice1 == undefined ) {
			html2 += '<div class="pull-left font-sm">' + $('#msg-retailPrice').val() + ' : <b class="font-bigger font-bold text-green">' + numberWithCommas(result.retailPrice) + '</b></div>';
		}

		if ( result.wholesalePrice != undefined ) {
			html2 += '<div class="pull-right font-sm">' + $('#msg-wholesalePrice').val() + ' : <b class="font-bigger font-bold text-red">' + numberWithCommas(result.wholesalePrice) + '</b></div>';
		}

		if ( result.wholesalePrice1 != undefined ) {
			html2 += '<div class="pull-left font-sm">' + $('#msg-price').val() + ' : <b class="font-bigger font-bold text-green">' + numberWithCommas(result.retailPrice) + '</b></div>';
			html2 += '<div class="pull-right font-sm"><b class="font-bigger font-bold text-red">' + numberWithCommas(result.wholesalePrice1) + '</b> <i class="img-up fa fa-comment-o show-tooltip" data-toggle="tooltip" title="' + result.qty1 + ' ' + $('#msg-orMoreItems').val() + ' ' + $('#msg-ofThe'+((result.isSameCategory == 1) ? 'Same' : 'Differnce')+'Category').val() + '"></i> / <b class="font-bigger font-bold text-red">' + numberWithCommas(result.wholesalePrice2) + '</b> <i class="img-up fa fa-comment-o show-tooltip" data-toggle="tooltip" title="' + result.qty2 + ' ' + $('#msg-orMoreItems').val() + ' ' + $('#msg-ofThe'+((result.isSameCategory == 1) ? 'Same' : 'Differnce')+'Category').val() + '"></i></div>';
		}

		if ( result.price1 != undefined ) {
			if ( result.stock != undefined ) {
				html2 += '<div class="pull-right font-sm">' + $('#msg-remain').val() + ' : <b class="font-bigger text-yellow">' + numberWithCommas(result.stock) + '</b></div>';
			}
			html2 += '<div class="pull-right font-sm"></div>';
			html2 += '<div class="clearfix"></div><div class="font-sm">' + $('#msg-wholesalePrice').val() + ' : <span class="font-bigger">' + numberWithCommas(result.price1) + '</span>';
		}
		if ( result.price2 != undefined ) {
			html2 += ' / <span class="font-bigger">' + numberWithCommas(result.price2) + '</span>';
		}
		if ( result.price3 != undefined ) {
			html2 += ' / <span class="font-bigger' + (($('#role').val() == 'sale') ? ' text-red font-bold' : '') + '">' + numberWithCommas(result.price3) + '</span>' + (($('#role').val() == 'sale') ? '</div>' : '') + '';
		}
		if ( result.price4 != undefined ) {
			html2 += ' / <span class="font-bigger' + (($('#role').val() == 'headSale') ? ' text-red font-bold' : '') + '">' + numberWithCommas(result.price4) + '</span>' + (($('#role').val() == 'headSale') ? '</div>' : '') + '';
		}
		if ( result.price5 != undefined ) {
			html2 += ' / <span class="font-bigger' + (($('#role').val() == 'manager') ? ' text-red font-bold' : '') + '">' + numberWithCommas(result.price5) + '</span>' + (($('#role').val() == 'manager') ? '</div>' : '') + '';
		}

		if ( result.onCart != undefined ) {
			if ( result.onCart > 0 || result.onOrder > 0 ) {
				html2 += '<div class="font-sm text-muted"><span' + ((result.onCart != 0) ? ' class="text-red"' : '') + '>' + $('#msg-itemOnCart').val() + ' : <b>' + result.onCart + '</b></span> / <span' + ((result.onOrder != 0) ? ' class="text-red"' : '') + '>' + $('#msg-onOrder').val() + ' : <b' + ((result.onOrder != 0) ? ' class="font-bigger text-red"' : '') + '>' + result.onOrder + '</b></span></div>';
			}
		}
		
		html2 += '<div class="clearfix"></div>';
		html2 += '</div></div></div>';

	}
	$('#tb-result tbody').html(html);
	$('#dv-box').html(html2);
	$('.hidden').removeClass('hidden').hide();
	$('.wait').show();
	$('#dv-loading').hide();

	/*$('.img-product.isNew').each(function() {
		let position = $(this).position();
		console.log(position.top, ' : ', position.left);
		$('#dv-box').append('<img class="img-up img-new" src="/images/icons/new.gif" style="top:'+position.top+'px; left:'+position.left+'px">');
	})*/
	
	$('img.lazy').lazyload({
		effect : "fadeIn",
		event: "scrollstop"
	});
	
	if ($('#cb-show_image').hasClass('active')) {
		$('.td-thumb, .dv-thumb').show();
	}
	else {
		$('.td-thumb, .dv-thumb').hide();
	}
	
	$('#ul-category li.category[data-id='+category+']').click();

	//showProduct();
}

function showProduct() {

	$('#txt-search').val('');
	$('.tr-brand').hide();
	$('.dv-brand').hide();
	category = $('#ul-category .category.active').data('id');
	var $obj;
	
	if ( $('#tab .active').hasClass('brand-') ) {
		$obj = $('.tr-cat-'+category+'.tr-brand'+(onlyUpdate ? '.hasStockUpdate' : ''));
		$('.tr-cat-'+category+'.tr-brand'+(onlyUpdate ? '.hasStockUpdate' : '')).show().find('.show-tooltip').tooltip({container: 'body'});
		$('.dv-cat-'+category+'.dv-brand'+(onlyUpdate ? '.hasStockUpdate' : '')).show().find('.show-tooltip').tooltip({container: 'body'});
	}
	else {
		$obj = $('.tr-cat-'+category+'.tr-brand-'+$('#tab .active').data('id')+(onlyUpdate ? '.hasStockUpdate' : ''))
		$('.tr-cat-'+category+'.tr-brand').hide();
		$('.tr-cat-'+category+'.tr-brand-'+$('#tab .active').data('id')+(onlyUpdate ? '.hasStockUpdate' : '')).show();
		$('.dv-cat-'+category+'.dv-brand').hide();
		$('.dv-cat-'+category+'.dv-brand-'+$('#tab .active').data('id')+(onlyUpdate ? '.hasStockUpdate' : '')).show();
	}
	$('.countItem').html( $obj.length );

	if ( $('#btn-list-view').hasClass('active') ) {
		$('#dv-box').hide();
		$('.table-responsive').show();
	}
	else {
		$('#dv-box').show();
		$('.table-responsive').hide();
	}

}

function updateMemberConfig() {
	updateScreenConfig('{' +
		'"category": "' + category + '"' +
		', "showPicture": '+($('#cb-show_image').hasClass('active') ? 'true' : 'false')+
		', "view": "' + ($('#btn-box-view').hasClass('active') ? 'box' : 'list') + '"' +
		'}');
}

function searchProduct() {
	var key = $.trim($('#txt-search').val()).toLowerCase();
	if ( key.length > 0 ) {
		var $tr;
		var $div;
		if ( $('#tab .active').hasClass('brand-') ) {
			$tr = $('.tr-cat-'+category+'.tr-brand');
			$div = $('.dv-cat-'+category+'.dv-brand');
		}
		else {
			$tr = $('.tr-cat-'+category+'.tr-brand-'+$('#tab .active').data('id'));
			$div = $('.dv-cat-'+category+'.dv-brand-'+$('#tab .active').data('id'));
		}

		$('.tr-show').removeClass('tr-show');
		$tr.each(function(){
			var $obj = $(this);
			if ( $obj.find('.name').html().toLowerCase().indexOf(key) >= 0 || $obj.find('.sku').html().toLowerCase().indexOf(key) >= 0 )
				$obj.addClass('tr-show').show();
			else
				$obj.hide();
		});
		$('.countItem').html( $('.tr-show').length );

		$div.each(function(){
			var $obj = $(this);
			if ( $obj.find('.name').html().toLowerCase().indexOf(key) >= 0 || $obj.find('.sku').html().toLowerCase().indexOf(key) >= 0 )
				$obj.show();
			else
				$obj.hide();
		});

	}
	else {
		if ( $('#tab .active').hasClass('brand-') ) {
			$obj = $('.tr-cat-'+category+'.tr-brand');
			$('.tr-cat-'+category+'.tr-brand').show();
			$('.dv-cat-'+category+'.dv-brand').show();
		}
		else {
			$obj = $('.tr-cat-'+category+'.tr-brand-'+$('#tab .active').data('id'))
			$('.tr-cat-'+category+'.tr-brand').hide();
			$('.tr-cat-'+category+'.tr-brand-'+$('#tab .active').data('id')).show();
			$('.dv-cat-'+category+'.dv-brand').hide();
			$('.dv-cat-'+category+'.dv-brand-'+$('#tab .active').data('id')).show();
		}
		$('.countItem').html( $obj.length );
	}
}

function searchAllProduct() {
	$('#tab').hide();
	var key = $.trim($('#txt-search').val()).toLowerCase();
	if ( key.length > 1 ) {
		var $tr = $('.tr-brand');
		var $div = $('.dv-brand');

		$('.tr-show').removeClass('tr-show');
		$tr.each(function(){
			var $obj = $(this);
			if ( $obj.find('.name').html().toLowerCase().indexOf(key) >= 0 || $obj.find('.sku').html().toLowerCase().indexOf(key) >= 0 )
				$obj.addClass('tr-show').show();
			else
				$obj.hide();
		});

		$('#dv-header').html( 'สินค้าทั้งหมด <span><small></small></span><span><small> : <b class="countItem">0</b> รายการ</small></span>' );
		$('.countItem').html( $('.tr-show').length );		

		$div.each(function(){
			var $obj = $(this);
			if ( $obj.find('.name').html().toLowerCase().indexOf(key) >= 0 || $obj.find('.sku').html().toLowerCase().indexOf(key) >= 0 )
				$obj.show();
			else
				$obj.hide();
		});

	}
}

function loadCartDetail(){	
	$.post($('#apiUrl').val()+'/order/cart/detail', {
		authKey: $('#authKey').val(),
	}, function(data){
			if (data.success) {
				cart = {};
				if( data.result != undefined && data.result.length > 0 ) {
					data.result.forEach(info => {
						cart[info.id] = info.qty;
					});
				}
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}


function loadProductImage(shop, sku){
	$.post($('#apiUrl').val()+'/product/image/list', {
		shop: shop,
		sku: sku,
	}, function(data){
			if (data.success) {
				$('#sku-'+sku).attr('data-image', data.result.join());
				$('#sku-'+sku).attr('data-image_location', data.location);
				showProductImage(sku);
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function showProductImage(sku){
	var sp = $('#sku-'+sku).attr('data-image').split(',');

	$('#dv-view_image .carousel-indicators, #dv-view_image .carousel-inner').html('');
	for(i=0, idx=0; i<sp.length; i++) {
		//if ( sp[i].indexOf('_l.') != -1 ){
			$('#dv-view_image .carousel-indicators').append( '<li data-target="#carousel-product" data-slide-to="'+idx+'" class="'+((idx==0) ? 'active' : '')+'"></li>' );
			$('#dv-view_image .carousel-inner').append('<div class="item'+((idx==0) ? ' active' : '')+'"><img src="' + $('#sku-'+sku).attr('data-image_location')+sp[i].trim() + '" alt="..."><div class="carousel-caption"><h3>'+$('#sku-'+sku).find('span.name').html()+'</h3></div></div>' );
			idx++;
		//}
	}
	if ( $('#dv-view_image .carousel-indicators li').length > 1) {
		$('#dv-view_image .carousel-control, #dv-view_image .carousel-indicators').show();
	}
	else {
		$('#dv-view_image .carousel-control, #dv-view_image .carousel-indicators').hide();
	}
	if ( !$('#carousel-product').hasClass('carousel') ) {
		$('#carousel-product').addClass('carousel').addClass('slide').attr('data-ride', 'carousel');
	}

	if ( $('#sku-'+sku).find('.btn-add_cart').length > 0 )
		$('#dv-view_image .modal-footer .input-group').show();
	else
		$('#dv-view_image .modal-footer .input-group').hide();


	$('.carousel').carousel();
}
