var shopID = '';
$(function () {
	moment.locale('th');
	loadShop();
	//$('#modal-news').modal();
	if ($('#numberOrderHistory').length > 0) loadCount('member-order_history', $('#numberOrderHistory'));
	if ($('#numberBooking').length > 0) loadCount('member-booking', $('#numberBooking'));

	if (window.location.hash == '#booking') loadBooking();
	if (window.location.hash == '#history') loadOrderHistory();
	if (window.location.hash == '#news') loadNews();

	newsCount();
	$(document).on('click', 'a.order_booking', function () {
		if ($('#numberBooking').html() != '0') {
			loadBooking();
		}
	});

	$(document).on('click', 'a.order_history', function () {
		if ($('#numberOrderHistory').html() != '0') {
			loadOrderHistory();
		}
	});

	$(document).on('click', 'a.news', function () {
		$.post('https://api.remaxthailand.co.th/news/read', {
			apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
			memberKey: $('#authKey').val()
		}, function (data) { }, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
		loadNews();
		newsCount();
	});

	$(document).on('click', 'a.todayssales', function () {
		if ($('#todayssales').html() != '0') {
			loadSellSummaryData();
		}
	}); 

	$(document).on('click', 'a.salesthismonth', function () {
		if ($('#salesthismonth').html() != '0') {
			loadSalesData();
		}
	}); 

	$(document).on('click', 'a.productsreturn', function () {
		if ($('#productsreturn').html() != '0') {
			loadReturnProductData();
		}
	}); 

	$(document).on('click', 'a.debtor', function () {
		if ($('#debtor').html() != '0') {
			loadReceivable();
		}
	});

	$(document).on('click', '.fa-truck', function () {
		$('.btn-tracking').hide();
		if ($(this).attr('data-shippingType') == '') {
			$('#dv-input_shipping').modal('hide');
		}
		else {
			$('#shipping_method').val($(this).attr('data-shippingType'));
			$('#shippingMethod').html($('#shipping_method :selected').text());
			$('#dv-input_shipping .modal-footer').show();
			if ($(this).attr('data-shippingCode') == null || $(this).attr('data-shippingCode') == '') {
				$('#trackingNo').parent().hide();
			}
			else {
				$('#trackingNo').html(($(this).attr('data-shippingType') == 'KE') ? '<a href="https://th.kerryexpress.com/th/track/?track=' + $(this).attr('data-shippingCode') + '" target="_blank">' + $(this).attr('data-shippingCode') + '</a>' :
					(($(this).attr('data-shippingType') == 'SCG') ? '<a href="https://www.scgexpress.co.th/tracking/detail/' + $(this).attr('data-shippingCode') + '" target="_blank">' + $(this).attr('data-shippingCode') + '</a>' :
						$(this).attr('data-shippingCode').parent().show()
					));
			}
			if ($(this).attr('data-shippingType') == 'CC' || $(this).attr('data-shippingType') == 'SS') {
				$('#dv-input_shipping .modal-footer').hide();
			}
			else {
				$('#dv-input_shipping .modal-footer').show();
				$('.input-' + $('#shipping_method').val()).show();
			}
		}
	});

	$(document).on('click', '.btn-remove_cart', function () {
		$('tr.remove_cart').removeClass('remove_cart');
		$(this).parents('tr').addClass('remove_cart');
	});

	$(document).on('click', '#btnConfirm', function () {
		$.post($('#apiUrl').val() + '/order/booking/cancel', {
			authKey: $('#authKey').val(),
			productCode: $('tr.remove_cart').data('id'),
		}, function (data) {
			if (data.success) {
				$('#numberBooking').html(parseInt($('#numberBooking').html()) - 1);
				$('tr.remove_cart').hide();
				$('#modal-alert').modal('hide');
			}
		}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
	});

	$(document).on('click', '.btn-add_cart', function () {
		$('tr.add_cart').removeClass('add_cart');
		$(this).parents('tr').addClass('add_cart');
		$.post($('#apiUrl').val() + '/order/cart/update', {
			authKey: $('#authKey').val(),
			productCode: $('tr.add_cart').data('id'),
			qty: parseInt($('tr.add_cart .qty').html()),
		}, function (data) {
			if (data.success) {
				if (data.correct) {

					if (data.result[0].items > 0) {
						$('#menu-cart .badge').addClass('bg-red').html(numberWithCommas(data.result[0].items)).show();
						$('#numberBooking').html(parseInt($('#numberBooking').html()) - 1);
						$('#menu- .badge').html(parseInt($('#menu- .badge').html()) - 1);
						$('tr.add_cart').hide();

						$.post($('#apiUrl').val() + '/order/booking/addCart', {
							authKey: $('#authKey').val(),
							productCode: $('tr.add_cart').data('id'),
						}, function (data) {
						}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });

					}

					if ($('#numberBooking').html() == '0') {
						$('#dv-no_data').show();
						$('.box.order_booking table').hide();
						$('#menu- .badge').hide();
					}

				}
			}

		}, 'json');

	});

});


function loadCount(screen, obj) {
	$.post($('#apiUrl').val() + '/member/summary/alert', {
		authKey: $('#authKey').val(),
		screen: screen,
	}, function (data) {
		if (data.success) {
			if (data.correct) {
				if (data.result[0].count > 0) {
					obj.html(data.result[0].count);
				}

				if ($('#numberBooking').html() == '0') {
					$('#dv-no_data').show();
					$('.box.order_booking table').hide();
				}
				else {
					$('#dv-no_data').hide();
					$('.box.order_booking table').show();
				}

			}
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}



function loadOrderHistory() {
	$.post($('#apiUrl').val() + '/member/order/header', {
		authKey: $('#authKey').val(),
		screen: 'member-order_history',
	}, function (data) {
		if (data.success) {
			if (data.correct) {
				$('.box.news').slideUp();
				$('.box.order_booking').slideUp();
				$('.box.order_history').slideDown();
				var tbody = $('.box.order_history').find('table tbody');
				tbody.html('');
				var html = '';
				//var sumPrice = 0;
				for (i = 0; i < data.result.length; i++) {
					var result = data.result[i];
					html += '<tr><td' + ((!result.active) ? ' class="msg_erase"' : '') + '><a href="https://24fin-api.remaxthailand.co.th/report/order4customer/1/' + result.orderNo + '">' + result.orderNo + '</a></td>';
					html += '<td class="text-center' + ((!result.active) ? ' msg_erase' : '') + '">' + result.orderDate + '</td>';
					html += '<td>';
					if (!result.active) html += '<span class="label label-default">' + $('#msg-cancel').val() + '</span>';
					else {
						html += '<i class="fa fa-lg pointer fa-bitcoin show-tooltip ' + ((result.isPay) ? 'text-success' : 'text-muted') + '" data-toggle="tooltip" data-placement="top" title="' + ((result.isPay) ? $('#msg-paid').val() : $('#msg-unpaid').val()) + '"></i>';
						html += ' <i class="fa fa-lg pointer fa-cube show-tooltip ' + ((result.isPack) ? 'text-success' : 'text-muted') + '" data-toggle="tooltip" data-placement="top" title="' + ((result.isPack) ? $('#msg-pack').val() : $('#msg-unpack').val()) + '"></i>';
						html += ' <i class="fa fa-lg pointer fa-truck show-tooltip ' + ((result.isShip) ? 'text-success"  data-target="#dv-input_shipping" data-toggle="modal"' : 'text-muted') + ' data-toggle="tooltip" data-placement="top" title="' + ((result.isShip) ? $('#msg-shipped').val() : $('#msg-awaiting_shipment').val()) + '" data-orderNo="' + result.orderNo + '" data-shippingType="' + (result.shippingType == null ? '' : result.shippingType) + '" data-shippingCode="' + (result.shippingCode == null ? '' : result.shippingCode) + '"></i>';
						if (!result.isPay) {
							html += ' <span class="label label-info">' + $('#msg-awaiting_payment').val() + '</span>';
						}
						else if (result.isPay && !result.isPack) {
							html += ' <span class="label label-info">' + $('#msg-awaiting_stock').val() + '</span>';
						}
						//sumPrice += result.totalPrice;
					}
					//console.log(result.orderNo+'-'+result.totalPrice);
					html += '</td>';
					html += '<td class="text-center">' + result.cnt + '</td>';
					html += '<td class="text-center qty">' + result.qty + '</td>';
					html += '<td class="text-right">' + numberWithCommas(result.totalPrice.toFixed(0)) + '</td>';
					html += '<td class="text-right">' + numberWithCommas(result.shippingPrice.toFixed(0)) + '</td>';
					html += '<td class="text-right ' + ((result.isPay) ? 'text-primary font-bold' : 'text-muted') + ((!result.active) ? ' msg_erase' : '') + '">' + numberWithCommas((result.totalPrice + result.shippingPrice).toFixed(0)) + '</td>';
				}
				//html += '<tr><td colspan="5" class="text-right">'+$('#msg-total').val()+'</td><td class="text-right text-primary font-bold">'+numberWithCommas(sumPrice.toFixed(0))+'</td></tr>';
				tbody.html(html);
				$('.show-tooltip').tooltip();
				$('i.text-muted').css('opacity', 0.3);
			}
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}


function loadBooking() {
	$.post($('#apiUrl').val() + '/member/order/booking', {
		authKey: $('#authKey').val(),
	}, function (data) {
		if (data.success) {
			if (data.correct) {
				$('.box.news').slideUp();
				$('.box.order_history').slideUp();
				$('.box.order_booking').slideDown();
				var tbody = $('.box.order_booking').find('table tbody');
				tbody.html('');
				var html = '';
				//var sumPrice = 0;
				for (i = 0; i < data.result.length; i++) {
					var result = data.result[i];
					html += '<tr data-id="' + result.product + '" class="' + ((result.hasStock == 'S') ? 'text-green' : (result.hasStock == '@') ? 'text-muted' : 'text-red') + '"><td class="text-center">' + result.bookingDate + '</td>';
					html += '<td class=""><i class="fa fa-' + ((result.hasStock == 'S') ? 'check-circle' : ((result.hasStock == '@') ? 'plane' : 'exclamation-circle')) +
						'"></i>&nbsp;' + result.name +
						((result.hasStock == 'S') ? '<label class="label pull-right bg-green booking">มีสินค้าครบ</label>' :
							((parseInt(result.hasStock) > 0) ? '<label class="label pull-right label-danger booking">มีสินค้าจำนวน ' + result.hasStock + ' ชิ้น</label>' :
								((result.hasStock == '@') ? '<label class="label pull-right label-primary booking">สินค้าจะเข้าคลังสินค้าเร็วๆ นี้</label>' : '<label class="label pull-right label-warning booking">สินค้าหมดชั่วคราว</label>')
							)
						) +
						'<br>' +
						'<small class="text-muted">&nbsp;' + moment(result.expiryDate).fromNow() + ' จะยกเลิกรายการ</small>' +
						((parseInt(result.hasStock) <= 0 && result.isPo == '1') ? '<small class="text-primary"> (สินค้าจะเข้าคลังสินค้าเร็วๆ นี้)</small>' : '') +
						'</td>';
					html += '<td class="text-right font-bold qty">' + result.qty + '</td>';
					html += '<td class="">';
					if ($('#role').val() == 'dealer' || $('#role').val() == 'member' || $('#role').val() == 'shop') {
						if (parseInt(result.hasStock) > 0 || result.hasStock == 'S') {
							html += '<button class="btn-product-' + result.product + ' btn-add_cart btn btn-xs btn-warning">' + $('#msg-orderNow').val() + '</button>';
						}
						else {
							html += '<button class="btn-product-' + result.product + ' btn-remove_cart btn btn-xs btn-danger" data-target="#modal-alert" data-toggle="modal">' + $('#msg-cancel').val() + '</button>';
						}
					}
					html += '</td><tr>';
				}
				tbody.html(html);
				$('.show-tooltip').tooltip();
				$('i.text-muted').css('opacity', 0.3);
			}
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadNews() {
	$('#dv-loading_data').show();
	$('.wait').hide();
	$('.form-member').hide();
	$('#dv-no_data').hide();
	$.post('https://api.remaxthailand.co.th/news/info', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val()
	}, function (data) {
		$('#dv-loading_data').hide();
		if (data.success) {
			$('.box.order_history').slideUp();
			$('.box.order_booking').slideUp();
			$('.box.news').slideDown();
			var tbody = $('.box.news').find('table tbody');
			tbody.html('');
			var html = '';
			for (i = 0; i < data.result.length; i++) {
				var result = data.result[i];
				var no = i + 1;
				html += '<tr id="' + result.id + '">';
				html += '<td width="10" class="text-center" valign="middle">' + moment(result.addDate).utcOffset(0).format('DD/MM/YYYY HH:mm') + '</td>';
				html += '<td width="100" class="text-left" valign="middle">' + result.message + '</td>';
				html += '</tr>';
			}

			tbody.html(html);

		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) {
		console.log(xhr.statusText);
	});
}

function newsCount() {
	$.post('https://api.remaxthailand.co.th/news/count', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val()
	}, function (data) {
		if (data.success) {
			$('#numberNews').html(data.result[0].newsUnread)
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadShop() {
	$.post('https://api.remaxthailand.co.th/shop/shopid', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val()
	}, function (data) {
		if (data.success) {
			if (data.result.length > 0) {
				shopID = data.result[0].shop;
				if ($('#role').val() == 'shop') shopSummary();
			}
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) {
		console.log(xhr.statusText);
	});
}

function shopSummary() {
	$.post('https://api.remaxthailand.co.th/shop/shopSummary', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: shopID
	}, function (data) {
		if (data.success) {
			$('.box-shop').slideDown();
			$('#todayssales').html(numberWithCommas(data.result[0].todaySales));
			$('#salesthismonth').html(numberWithCommas(data.result[0].monthSales));
			$('#productsreturn').html(numberWithCommas(data.result[0].returnProduct));
			$('#debtor').html(numberWithCommas(data.result[0].debtor));
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadSellSummaryData() {
	$.post('https://api.remaxthailand.co.th/shop/SellSummary', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: shopID,
		date: moment().format('MM/DD/YYYY')
	}, function (data) {
		if (data.success) {
			$('.box.order_history').slideUp();
			$('.box.order_booking').slideUp();
			$('.box.news').slideUp();
			$('.box.salesthismonth').slideUp();
			$('.box.todayssales').slideDown();
			var tbody = $('.box.todayssales').find('table tbody');
			tbody.html('');
			var html1 = ''
			var values = data.result;
			if (values.length > 0) {
				for (i = 0; i < values.length; i++) {
					var result = values[i];
					//var no = i+1;
					html1 += '<tr>';
					html1 += '<td width="10" class="text-center" valign="middle">' + moment(result.sellDate).utcOffset(+7).format('DD/MM/YYYY HH:mm') + '</td>';
					html1 += '<td width="20" class="text-center text-bold sell-detail" valign="middle" data-placement="top" data-toggle="modal" data-target="#dv-selldetail" data-sellDetail="' + result.sellNo + '">' + result.sellNo + '</td>';
					html1 += '<td width="80" class="text-center" valign="middle">' + result.name + '</td>';
					html1 += '<td width="20" class="text-center" valign="middle">' + numberWithCommas(result.sellPrice) + '</td>';
					html1 += '<td width="20" class="text-center" valign="middle">' + numberWithCommas(result.discountCash) + '</td>';
					html1 += '<td width="20" class="text-center" valign="middle">' + numberWithCommas(result.totalPrice) + '</td>';
					html1 += '<td width="40" class="text-center' + ((result.payType == 0) ? ' text-danger' : '') + '" valign="middle">' + ((result.payType == 0) ? 'ยังไม่ชำระเงิน' : 'ชำระเงินแล้ว') + '</td>';
					html1 += '<td width="60" class="text-center" valign="middle">' + result.empName + '</td>';
					html1 += '</tr>';
				}
				tbody.html(html1);
			}
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadSalesData() {
	$.post('https://api.remaxthailand.co.th/shop/salesSummary', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: shopID,
		date_from: moment().startOf('month').format('MM/DD/YYYY'),
		date_to: moment().format('MM/DD/YYYY')
	}, function (data) {
		if (data.success) {
			json = data.result;
			sortJSON(json, 'date', 'desc');
			$('.box.order_history').slideUp();
			$('.box.order_booking').slideUp();
			$('.box.news').slideUp();
			$('.box.todayssales').slideUp();
			$('.box.productsreturn').slideUp();
			$('.box.salesthismonth').slideDown();
			var tbody = $('.box.salesthismonth').find('table tbody');
			tbody.html('');
			var html = ''
			for (i = 0; i < json.length; i++) {
				var result = json[i];
				var no = i + 1;
				html += '<tr>';
				html += '<td width="10" class="text-center" valign="middle">' + moment(result.date).utcOffset(0).format('DD/MM/YYYY') + '</td>';
				html += '<td width="50" class="sumBill text-center" valign="middle" data-val= ' + result.billQty + '>' + ((result.billQty == 0) ? '-' : numberWithCommas(result.billQty)) + '</td>';
				html += '<td width="200" class="sumSales text-center active" valign="middle" data-val= ' + result.sales + '>' + ((result.sales == 0) ? '-' : numberWithCommas(result.sales)) + '</td>';
				html += '<td width="200" class="sumCredit text-center active" valign="middle" data-val= ' + result.credit + '>' + ((result.credit == 0) ? '-' : numberWithCommas(result.credit)) + '</td>';
				html += '<td width="200" class="sumDiscountCash text-center active" valign="middle" data-val= ' + result.discountCash + '>' + ((result.discountCash == 0) ? '-' : numberWithCommas(result.discountCash)) + '</td>';
				html += '<td width="200" class="sumTotal text-center text-bold active" valign="middle" data-val= ' + result.total + '>' + ((result.total == 0) ? '-' : numberWithCommas(result.total)) + '</td>';
				html += '<td width="200" class="sumClaim text-center" valign="middle" data-val= ' + result.claim + '>' + ((result.claim == 0) ? '-' : numberWithCommas(result.claim)) + '' + ((result.claimQty == 0) ? '' : '(' + numberWithCommas(result.claimQty) + ')') + '</td>';
				html += '</tr>';
			}
			tbody.html(html);

			var sumBill = 0;
			var sumCash = 0;
			var sumCredit = 0;
			var sumDiscountCash = 0;
			var sumTotal = 0;
			var sumCost = 0;
			var sumProfit = 0;
			var sumClaim = 0;
			$('.sumBill').each(function(index) {
				var value = $(this).attr('data-val');
				if (!isNaN(value) && value.length != 0) {
					sumBill += parseFloat(value);
				}
			});
			$('.sumSales').each(function(index) {
				var value = $(this).attr('data-val');
				if (!isNaN(value) && value.length != 0) {
					sumCash += parseFloat(value);
				}
			});
			$('.sumCredit').each(function(index) {
				var value = $(this).attr('data-val');
				if (!isNaN(value) && value.length != 0) {
					sumCredit += parseFloat(value);
				}
			});
			$('.sumDiscountCash').each(function(index) {
				var value = $(this).attr('data-val');
				if(!isNaN(value) && value.length != 0) {
					sumDiscountCash += parseFloat(value);
				}
			});
			$('.sumTotal').each(function(index) {
				var value = $(this).attr('data-val');
				if (!isNaN(value) && value.length != 0) {
					sumTotal += parseFloat(value);
				}
			});
			$('.sumClaim').each(function(index) {
				var value = $(this).attr('data-val');
				if (!isNaN(value) && value.length != 0) {
					sumClaim += parseFloat(value);
				}
			});
			$('#sumBill').html(((sumBill == 0) ? '-' : numberWithCommas(sumBill)));
			$('#sumCash').html(((sumCash == 0) ? '-' : numberWithCommas(sumCash)));
			$('#sumCredit').html(((sumCredit == 0) ? '-' : numberWithCommas(sumCredit)));
			$('#sumDiscountCash').html(((sumDiscountCash == 0) ? '-' : numberWithCommas(sumDiscountCash)));
			$('#sumTotal').html(((sumTotal == 0) ? '-' : numberWithCommas(sumTotal.toFixed(2))));
			$('#sumClaim').html(((sumClaim == 0) ? '-' : numberWithCommas(sumClaim)));
		} 
	}, 'json').fail(function (xhr, textStatus, errorThrown) {
		console.log(xhr.statusText);
	});
};

function loadReturnProductData() {
	$.post('https://api.remaxthailand.co.th/shop/returnProduct', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: shopID,
		dateF: moment().startOf('month').format('MM/DD/YYYY'),
		dateT: moment().format('MM/DD/YYYY')
	}, function (data) {
		if (data.success) {
			var values = data.result;
			$('.box.order_history').slideUp();
			$('.box.order_booking').slideUp();
			$('.box.news').slideUp();
			$('.box.todayssales').slideUp();
			$('.box.salesthismonth').slideUp();
			$('.box.debtor').slideUp();
			$('.box.productsreturn').slideDown();
			var tbody = $('.box.productsreturn').find('table tbody');
			tbody.html('');
			var html1 = '';
			if (values.length > 0) {
				for (i = 0; i < values.length; i++) {
					var result = values[i];
					//var no = i+1;
					html1 += '<tr>';
					html1 += '<td width="20" class="text-center" valign="middle">' + moment(result.returnDate).utcOffset(+7).format('DD/MM/YYYY HH:mm') + '</td>';
					html1 += '<td width="20" class="text-center" valign="middle">' + result.sellNo + '</td>';
					html1 += '<td width="20" class="text-center" valign="middle">' + moment(result.sellDate).utcOffset(+7).format('DD/MM/YYYY HH:mm') + '</td>';
					html1 += '<td width="60" class="text-center" valign="middle">' + result.name + '</td>';
					html1 += '<td width="100" class="text-left" valign="middle">' + result.productName + '</td>';
					html1 += '<td width="60" class="text-center" valign="middle">' + result.barcode + '</td>';
					html1 += '<td width="20" class="text-center" valign="middle">' + numberWithCommas(result.sellPrice) + '</td>';
					html1 += '<td width="60" class="text-center" valign="middle">' + result.empName + '</td>';
					html1 += '</tr>';
				}
				tbody.html(html1);
			} 
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};

function loadReceivable() {
    $.post('https://api.remaxthailand.co.th/shop/receivable', {
        apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
        shop: shopID
    }, function(data) {
        if (data.success) {
            var values = data.result;
            if (values[0].length > 0) {
				sortJSON(values[0], 'sellDate', 'desc');
				$('.box.order_history').slideUp();
				$('.box.order_booking').slideUp();
				$('.box.news').slideUp();
				$('.box.todayssales').slideUp();
				$('.box.salesthismonth').slideUp();
				$('.box.productsreturn').slideUp();
				$('.box.debtor').slideDown();
				var tbody = $('.box.debtor').find('table tbody');
				tbody.html('');
                var html1 = '';
                for (i = 0; i < values[0].length; i++) {
                    var result = values[0][i];

                    //var no = i+1;
                    html1 += '<tr class="' +(result.diff > 0 ? "text-bold text-red" : "")+ '' +(result.diff == 0 ? "text-bold" : "")+ '">';
					html1 += '<td width="100" class="text-center" valign="middle">'+result.name+'</td>';
					html1 += '<td width="100" class="text-center" valign="middle">'+result.sellNo+'</td>';
					html1 += '<td width="100" class="text-center" valign="middle">'+moment(result.sellDate).utcOffset(+7).format('DD/MM/YYYY HH:mm')+'</td>';
					html1 += '<td width="100" class="text-center" valign="middle">'+moment(result.dueDate).utcOffset(+7).format('DD/MM/YYYY HH:mm')+'</td>';
					html1 += '<td width="100" class="sumRtotol text-center" valign="middle" data-val= '+result.totalPrice+'>'+((result.totalPrice == 0) ? '-' : numberWithCommas(result.totalPrice))+'</td>';
					html1 += '<td width="100" class="text-center" valign="middle">'+result.sellBy+'</td>';
					html1 += '</tr>';
				}
				tbody.html(html1);
            }
        }

    }, 'json').fail(function(xhr, textStatus, errorThrown) {
        console.log(xhr.statusText);
    });
};

function sortJSON(data, key, way) {
    return data.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        if (way === 'desc') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        } else {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
    });
};