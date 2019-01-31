var agingData;
var runrateDate;
var config = {};
var result;
var currentYear = '';
var firstload = true;
var monthEn2 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
$(function () {
	loadYear();
	loadShop2();
	loadShop3();
	//google.charts.load('current', {'packages':['corechart']});
	//google.charts.load('current', {'packages':['line']});
	google.charts.load('current', { 'packages': ['bar', 'corechart'] });
	$('.datepicker').datepicker('update', new Date());

	var d = new Date();
	var m = moment(d);
	currentYear = m.format('YYYY');

	$(window).scroll(function () {
		var a = $('#scroll-top').find('a');
		if ($(this).scrollTop() > 250) {
			a.fadeIn(200);
		} else {
			a.fadeOut(200);
		}
	});

	$('#scroll-top').click(function () {
		$("html, body").animate({ scrollTop: 0 }, 1000);
		return false;
	});

	$('#btn-submit2').click(function () {
		loadSalesData();
		return false;
	});

	$('#btn-submit2w').click(function () {
		loadHeadSalesData();
		return false;
	});

	$(document).on('change', '#cbb-category3', function () {
		loadAging();
	});

	$(document).on('change', '#cbb-shop3', function () {
		Cookies.set('shopSelected', $(this).val());
		$('.select-shop').val($(this).val())
		loadAllData();
		loadAging();

	});

	$('#btn-agingPdf').click(function () {
		window.open('https://api.remaxthailand.co.th/report/aging/' + $('#cbb-shop3').val(), '_blank');
		return false;
	});

	$(document).on('change', '#cbb-category3r', function () {
		loadRunRate();
	});

	$(document).on('change', '#cbb-shop3r', function () {
		Cookies.set('shopSelected', $(this).val());
		$('.select-shop').val($(this).val())
		loadAllData();
		//loadRunRate();
	});

	$(document).on('change', '#cbb-brand3st', function () {
		loadStockData();
	});

	$(document).on('change', '#cbb-category3st', function () {
		loadStockData();
	});

	$(document).on('change', '#cbb-shop3st', function () {
		Cookies.set('shopSelected', $(this).val());
		$('.select-shop').val($(this).val())
		loadAllData();
		//loadStockData();
	});

	$('#btn-runratePdf').click(function () {
		window.open('https://api.remaxthailand.co.th/report/run_rate/' + $('#cbb-shop3r').val(), '_blank');
		return false;
	});

	$(document).on('change', '#cbb-shop2w', function () {
		Cookies.set('shopSelected', $(this).val());
		$('.select-shop').val($(this).val())
		loadAllData();
		//loadSummaryCustomerData();
	});

	$(document).on('change', '#cbb-year', function () {
		loadAccumulated();
	});

	$(document).on('change', '#cbb-yearc', function () {
		loadSummaryCustomerData();
	});

	$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
		if (e.currentTarget.hash == '#customer') {
			loadSummaryCustomerData();
		}
	})

	$(document).on('change', '#cbb-shop2c', function () {
		Cookies.set('shopSelected', $(this).val());
		$('.select-shop').val($(this).val())
		loadAllData();
		//loadSummaryCustomerData();
	});
	$(document).on('change', '#cbb-shop2credit', function () {
		Cookies.set('shopSelected', $(this).val());
		$('.select-shop').val($(this).val())
		loadAllData();
		//loadSummaryCustomerData();
	});

	$(document).on('change', '#selectPreviousPaid', function () {
		receivablePaid();
	});

	$(document).on('change', '#cbb-shop2', function () {
		Cookies.set('shopSelected', $(this).val());
		$('.select-shop').val($(this).val())
		loadAllData();
	});

	$(document).on('click', '#a-sales', function () {
		if (firstload)
			loadSalesData();
		loadHeadSalesData();
	});

	$(document).on('change', '#cbb-shop4', function () {
		Cookies.set('shopSelected', $(this).val());
		$('.select-shop').val($(this).val())
		loadAllData();
	});
	$(document).on('change', '#selectPrevious', function () {
		$('#dv-monthlySaleByCategory').slideUp();
		loadmData();
	});
	$(document).on('change', '#selectType', function () {
		$('#dv-monthlySaleByCategory').slideUp();
		loadColumnChart();
	});

	$(document).on('click', '.productSummary', function () {
		loadmData();
	});

	$(document).on('change', '#cbb-shop3rc', function () {
		Cookies.set('shopSelected', $(this).val());
		$('.select-shop').val($(this).val())
		loadAllData();
	});

	$('#btn-submit3rc').click(function () {
		loadReceivedData();
		return false;
	});

	$(document).on('change', '#cbb-shop2changePrice', function () {
		Cookies.set('shopSelected', $(this).val());
		$('.select-shop').val($(this).val())
		loadAllData();
	});

	$(document).on('click', '#btn-submit2changePrice', function () {
		loadAllData();
	});

	$(document).on('change', '#cbb-shop2returnProduct', function () {
		Cookies.set('shopSelected', $(this).val());
		$('.select-shop').val($(this).val())
		loadAllData();
	});
	$(document).on('click', '#btn-submit2returnProduct', function () {
		loadAllData();
	});

	$(document).on('change', '#cbb-shop2dailysales', function () {
		Cookies.set('shopSelected', $(this).val());
		$('.select-shop').val($(this).val())
		loadAllData();
	});
	$(document).on('click', '#btn-submit2dailysales', function () {
		loadAllData();
	});

	$(document).on('click', '#tb-result2dailysales .sell-detail', function() {
		$('.wait2selldetail').hide(); 
		$('#tb-result2selldetail').hide();
		$('#dv-loadingselldetail').show();
		$('#modal-sellNo').html('เลขที่บิล : ' + $(this).attr('data-sellDetail'));
		$.post('https://api.remaxthailand.co.th/shop/SellDetail', {
			apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
			shop: $('#cbb-shop2dailysales').val(), 
			sellNo: $(this).attr('data-sellDetail')
		}, function (data) {
			if (data.success) {
				var values = data.result;
				if (values.length > 0) {
					var html1 = '';
					for (i = 0; i < values.length; i++) {
						var result = values[i];
						//var no = i+1;
						html1 += '<tr>';
						html1 += '<td width="20" class="text-center" valign="middle">' + result.sku + '</td>';
						html1 += '<td width="80" class="text-center" valign="middle">' + result.productName + '</td>';
						html1 += '<td width="10" class="text-center" valign="middle">' + numberWithCommas(result.productPrice) + '</td>';
						html1 += '<td width="10" class="text-center'+ ((result.discount > 0) ? ' text-bold text-danger' : '') +'" valign="middle">' + numberWithCommas(result.sellPrice) + ((result.discount > 0) ? '(-' +numberWithCommas(result.discount) + ')' : '') + '</td>';
						html1 += '<td width="10" class="text-center" valign="middle">' + numberWithCommas(result.qty) + '</td>';
						html1 += '<td width="10" class="text-center" valign="middle">' + numberWithCommas(result.totalPrice) + '</td>';
						html1 += '</tr>';
					} 
					$('#tb-result2selldetail tbody').html(html1);
					$('.wait2selldetail').show();
					$('#tb-wait2selldetail').show();
					$('#dv-loadingselldetail').hide();
				} else {
					$('.wait2selldetail').hide();
					$('#tb-result2selldetail').hide();
				}
			} else {
				$('#tb-result2selldetail').hide();
			}
		}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
	});
});
function loadAllData() {
	loadSummaryCustomerData();
	loadStockData();
	//loadRunRate();
	//loadAging();
	loadSalesData();
	loadHeadSalesData();
	loadmData();
	receivablePaid();
	loadReceivedData();
	loadChangPriceData();
	loadReturnProductData();
	loadSellSummaryData();
}

function loadShop2() {
	$('#dv-loading2').show();
	$('#dv-no_data2, #tb-result2').hide();
	$('#dv-loading2c').show();
	$('#dv-no_data2c, #tb-result2c').hide();
	$('#dv-loading2w').show();
	$('#dv-no_data2w, #tb-result2w').hide();
	$('#dv-loading2credit').show();
	$('#dv-no_data2credit').hide();
	$('#dv-loading2changePrice').show();
	$('#dv-no_data2changePrice, #tb-result2changePrice').hide();
	$.post('https://api.remaxthailand.co.th/shop/name', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: ''
	}, function (data) {
		if (data.success) {
			if (Cookies.get('shopSelected') == undefined)
				Cookies.set('shopSelected', data.result[0].id);
				$('#cbb-shop2').append('<optgroup id="event" label="Event"></optgroup>');
				$('#cbb-shop2').append('<optgroup id="shop_event" label="Shop Event"></optgroup>');
				$('#cbb-shop2').append('<optgroup id="shop" label="Shop"></optgroup>');

				$('#cbb-shop2c').append('<optgroup id="event" label="Event"></optgroup>');
				$('#cbb-shop2c').append('<optgroup id="shop_event" label="Shop Event"></optgroup>');
				$('#cbb-shop2c').append('<optgroup id="shop" label="Shop"></optgroup>');

				$('#cbb-shop2w').append('<optgroup id="event" label="Event"></optgroup>');
				$('#cbb-shop2w').append('<optgroup id="shop_event" label="Shop Event"></optgroup>');
				$('#cbb-shop2w').append('<optgroup id="shop" label="Shop"></optgroup>');

				$('#cbb-shop2credit').append('<optgroup id="event" label="Event"></optgroup>');
				$('#cbb-shop2credit').append('<optgroup id="shop_event" label="Shop Event"></optgroup>');
				$('#cbb-shop2credit').append('<optgroup id="shop" label="Shop"></optgroup>');

				$('#cbb-shop2changePrice').append('<optgroup id="event" label="Event"></optgroup>');
				$('#cbb-shop2changePrice').append('<optgroup id="shop_event" label="Shop Event"></optgroup>');
				$('#cbb-shop2changePrice').append('<optgroup id="shop" label="Shop"></optgroup>');

				$('#cbb-shop2dailysales').append('<optgroup id="event" label="Event"></optgroup>');
				$('#cbb-shop2dailysales').append('<optgroup id="shop_event" label="Shop Event"></optgroup>');
				$('#cbb-shop2dailysales').append('<optgroup id="shop" label="Shop"></optgroup>');

				$('#cbb-shop2returnProduct').append('<optgroup id="event" label="Event"></optgroup>');
				$('#cbb-shop2returnProduct').append('<optgroup id="shop_event" label="Shop Event"></optgroup>');
				$('#cbb-shop2returnProduct').append('<optgroup id="shop" label="Shop"></optgroup>');
			for (i = 0; i < data.result.length; i++) {
				var result = data.result[i];
				if (result.type == 'event') {

					$('#cbb-shop2').find('optgroup#event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop2c').find('optgroup#event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop2w').find('optgroup#event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop2credit').find('optgroup#event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop2changePrice').find('optgroup#event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop2dailysales').find('optgroup#event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop2returnProduct').find('optgroup#event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');

				} else if (result.type == 'dealerEvent') {

					$('#cbb-shop2').find('optgroup#shop_event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop2c').find('optgroup#shop_event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop2w').find('optgroup#shop_event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop2credit').find('optgroup#shop_event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop2changePrice').find('optgroup#shop_event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop2dailysales').find('optgroup#shop_event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop2returnProduct').find('optgroup#shop_event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');

				} else {

					$('#cbb-shop2').find('optgroup#shop').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop2c').find('optgroup#shop').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop2w').find('optgroup#shop').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop2credit').find('optgroup#shop').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop2changePrice').find('optgroup#shop').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop2dailysales').find('optgroup#shop').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop2returnProduct').find('optgroup#shop').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');

				}
				
			}
			//$('#cbb-shop2 option:eq(0)').attr('selected', 'selected');
			//$('#cbb-shop2c option:eq(0)').attr('selected', 'selected');

			$('#dv-loading2').hide();
			$('#form-select2').show();
			$('#dv-loading2c').hide();
			$('#form-select2c').show();
			$('#dv-loading2w').hide();
			$('#form-select2w').show();
			$('#dv-loading2credit').hide();
			$('#form-select2credit').show(); 
			$('#dv-loading2changePrice').hide(); 
			$('#form-select2changePrice').show();
			$('#dv-loading2dailysales').hide(); 
			$('#form-select2dailysales').show();
			$('#dv-loading2returnProduct').hide(); 
			$('#form-select2returnProduct').show();
			loadSummaryCustomerData();
			receivablePaid();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};
function loadShop3() {
	$('#dv-loading3').show();
	$('#dv-no_data3, #tb-result3').hide();
	$('#dv-loading3r').show();
	$('#dv-no_data3r, #tb-result3r').hide();
	$('#dv-loading3rc').show();
	$('#dv-no_data3rc, #tb-result3rc').hide();
	$.post('https://api.remaxthailand.co.th/shop/name', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: ''
	}, function (data) {
		if (data.success) {
			if (Cookies.get('shopSelected') == undefined)
				Cookies.set('shopSelected', data.result[0].id);
				$('#cbb-shop3').append('<optgroup id="event" label="Event"></optgroup>');
				$('#cbb-shop3').append('<optgroup id="shop_event" label="Shop Event"></optgroup>');
				$('#cbb-shop3').append('<optgroup id="shop" label="Shop"></optgroup>');

				$('#cbb-shop3r').append('<optgroup id="event" label="Event"></optgroup>');
				$('#cbb-shop3r').append('<optgroup id="shop_event" label="Shop Event"></optgroup>');
				$('#cbb-shop3r').append('<optgroup id="shop" label="Shop"></optgroup>');

				$('#cbb-shop3st').append('<optgroup id="event" label="Event"></optgroup>');
				$('#cbb-shop3st').append('<optgroup id="shop_event" label="Shop Event"></optgroup>');
				$('#cbb-shop3st').append('<optgroup id="shop" label="Shop"></optgroup>');

				$('#cbb-shop3rc').append('<optgroup id="event" label="Event"></optgroup>');
				$('#cbb-shop3rc').append('<optgroup id="shop_event" label="Shop Event"></optgroup>');
				$('#cbb-shop3rc').append('<optgroup id="shop" label="Shop"></optgroup>');

				$('#cbb-shop4').append('<optgroup id="event" label="Event"></optgroup>');
				$('#cbb-shop4').append('<optgroup id="shop_event" label="Shop Event"></optgroup>');
				$('#cbb-shop4').append('<optgroup id="shop" label="Shop"></optgroup>');

			for (i = 0; i < data.result.length; i++) {
				var result = data.result[i];
				if (result.type == 'event') {

					$('#cbb-shop3').find('optgroup#event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop3r').find('optgroup#event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop3st').find('optgroup#event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop3rc').find('optgroup#event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop4').find('optgroup#event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');

				} else if (result.type == 'dealerEvent') {

					$('#cbb-shop3').find('optgroup#shop_event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop3r').find('optgroup#shop_event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop3st').find('optgroup#shop_event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop3rc').find('optgroup#shop_event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop4').find('optgroup#shop_event').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');

				} else {

					$('#cbb-shop3').find('optgroup#shop').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop3r').find('optgroup#shop').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop3st').find('optgroup#shop').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop3rc').find('optgroup#shop').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');
					$('#cbb-shop4').find('optgroup#shop').append('<option data-member ="'+result.member+'" value="' + result.id + '"' + (Cookies.get('shopSelected') == result.id ? ' selected' : '') + '>' + result.name + '</option>');

				}
				
			}

			//$('#cbb-shop3 option:eq(0)').attr('selected', 'selected');
			//$('#cbb-shop3r option:eq(0)').attr('selected', 'selected');
			//$('#cbb-shop3st option:eq(0)').attr('selected', 'selected');

			//$('#dv-loading3').hide();
			//$('#form-select3').show();
			$('#dv-loading3rc').hide();
			$('#form-select3rc').show();
			loadBrand3();
			//loadCategory3();
			loadReceivedData();
			
			
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};
function loadSalesData() {
	$('#dv-no_data2').hide();
	$('.wait2').hide();
	$('#dv-loading_data2').show();
	$('#tb-result2').hide();
	var dateFrom = $('#dateFrom').val().split('/');
	var dateTo = $('#dateTo').val().split('/');
	var strDateFrom = dateFrom[1] + '/' + dateFrom[0] + '/' + dateFrom[2];
	var strDateTo = dateTo[1] + '/' + dateTo[0] + '/' + dateTo[2];

	$.post('https://api.remaxthailand.co.th/shop/salesSummary', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: $('#cbb-shop2').val(),
		date_from: strDateFrom,
		date_to: strDateTo
	}, function (data) {
		$('#dv-loading_data2').hide();
		if (data.success) {
			json = data.result;
			sortJSON(json, 'date', 'desc');
			var html = '';

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
				html += '<td width="200" class="sumCost text-center text-muted " valign="middle" data-val= ' + result.cost + '>' + ((result.cost == 0) ? '-' : numberWithCommas(result.cost)) + '</td>';
				html += '<td width="200" class="sumProfit text-center text-muted " valign="middle" data-val= ' + result.profit + '>' + ((result.profit == 0) ? '-' : numberWithCommas(result.profit)) + '</td>';
				html += '<td width="200" class="sumHeadquarters text-center" valign="middle" data-val= ' + result.headquarters + '>' + ((result.headquarters == 0) ? '-' : numberWithCommas(result.headquarters)) + '</td>';
				html += '<td width="200" class="sumClaim text-center" valign="middle" data-val= ' + result.claim + '>' + ((result.claim == 0) ? '-' : numberWithCommas(result.claim)) + '' + ((result.claimQty == 0) ? '' : '(' + numberWithCommas(result.claimQty) + ')') + '</td>';
				html += '</tr>';
			}

			$('#tb-result2 tbody').html(html);
			loadAccumulated();
			loadReceivable();
			summary();
			if (data.result.length == 0) {
				$('#dv-no_data2').show();
				$('#tb-result2').hide();
			}
			//$("#tb-result2").DataTable();
			$('.wait2').show();
			$('.hidden').removeClass('hidden').hide();

		} else {
			$('#dv-no_data2').show();
			$('#tb-result2').hide();
		}
		firstload = false;

	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};

function loadHeadSalesData() {
	$('#dv-no_data2w').hide();
	$('.wait2w').hide();
	$('#dv-loading_data2w').show();
	$('#tb-result2w').hide();
	$('#tb-result2wd').hide();
	var dateFrom = $('#dateFromw').val().split('/');
	var dateTo = $('#dateTow').val().split('/');
	var strDateFrom = dateFrom[1] + '/' + dateFrom[0] + '/' + dateFrom[2];
	var strDateTo = dateTo[1] + '/' + dateTo[0] + '/' + dateTo[2];

	$.post('https://api.remaxthailand.co.th/shop/headSalesSummary', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		member: $('#cbb-shop2w option:selected').attr('data-member'),
		date_from: strDateFrom,
		date_to: strDateTo,
		isPay: 1
	}, function (data) {
		$('#dv-loading_data2w').hide();
		if (data.success) {
			if (data.result[0].length > 0) {
				json = data.result[0];
				jsonD = data.result[1];
				sortJSON(json, 'date', 'desc');
				sortJSON(jsonD, 'sellDate', 'desc');
				var html = '';
				var htmlD = '';
				for (i = 0; i < json.length; i++) {
					var result = json[i]
					var no = i + 1;
					html += '<tr>';
					html += '<td width="10" class="text-center" valign="middle">' + moment(result.date).utcOffset(0).format('DD/MM/YYYY') + '</td>';

					html += '<td width="200" class="sumTotal_w text-center text-bold active" valign="middle" data-val= ' + result.salePrice + '>' + ((result.total == 0) ? '-' : numberWithCommas(result.salePrice)) + '</td>';
					html += '<td width="200" class="sumCost_w text-center text-muted " valign="middle" data-val= ' + result.costPrice + '>' + ((result.cost == 0) ? '-' : numberWithCommas(result.costPrice)) + '</td>';
					html += '<td width="200" class="sumProfit_w text-center text-muted " valign="middle" data-val= ' + result.profit + '>' + ((result.profit == 0) ? '-' : numberWithCommas(result.profit)) + '</td>';

					html += '</tr>';
				}
				for (i = 0; i < jsonD.length; i++) {
					var result = jsonD[i]
					var no = i + 1;
					htmlD += '<tr>';
					htmlD += '<td width="10" class="text-center" valign="middle">' + moment(result.sellDate).utcOffset(0).format('DD/MM/YYYY') + '</td>';

					htmlD += '<td width="10"  class="text-center" valign="middle">' + result.OrderNo + '</td>';
					htmlD += '<td width="200"  valign="middle">' + result.Name + '</td>';
					htmlD += '<td width="50" class="sumProfit_wd text-center text-bold " valign="middle" data-val= ' + result.TotalPrice + '>' + ((result.TotalPrice == 0) ? '-' : numberWithCommas(result.TotalPrice)) + '</td>';

					htmlD += '</tr>';
				}

				$('#tb-result2w tbody').html(html);
				$('#tb-result2wd tbody').html(htmlD);
				//loadAccumulated();
				summaryW();
				if (data.result[0].length == 0) {
					$('#dv-no_data2w').show();
					$('#tb-result2w').hide();
					$('#tb-result2wd').hide();
				} else {
					$('.wait2w').show();
					$('#tb-result2wd').show();
				}
			} else {
				$('#dv-no_data2w').show();
				$('#tb-result2w').hide();
				$('#tb-result2wd').hide();
			}

			//$("#tb-result2").DataTable();

			$('.hidden').removeClass('hidden').hide();

		} else {
			$('#dv-no_data2w').show();
			$('#tb-result2w').hide();
			$('#tb-result2wd').hide();
		}
		firstload = false;

	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};

function loadAccumulated() {
	$('#dv-loading_data2month').show();
	$('#box-chart1 .overlay').show();
	$('.wait2month').hide();
	$.post('https://api.remaxthailand.co.th/shop/accumulated', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: $('#cbb-shop2').val(),
		year: $('#cbb-year').val()
	}, function (data) {
		if (data.success) {
			/*$('#accSales').html(((data.result[0].sales == 0) ? '-' : numberWithCommas(data.result[0].sales)));
			$('#accCost').html(((data.result[0].cost == 0) ? '-' : numberWithCommas(data.result[0].cost)));
			$('#accReceivable').html(((data.result[0].receivable == 0) ? '-' : numberWithCommas(data.result[0].receivable)));
			$('#accIncome').html(((data.result[0].profit == 0) ? '-' : numberWithCommas(data.result[0].profit)));*/

			/*$('#accSales').html('<img class="loading top-2" alt="loading" src="/images/icons/loading.gif">');
			$('#accReceivable').html('<img class="loading top-2" alt="loading" src="/images/icons/loading.gif">');
			$('#accIncome').html('<img class="loading top-2" alt="loading" src="/images/icons/loading.gif">')*/
			var html = '';
			var values = data.result;
			if (values[0].length > 0) {
				$('#sales-jan').html(((values[0][0].jan == 0) ? '-' : numberWithCommas(values[0][0].jan)));
				$('#sales-feb').html(((values[0][0].feb == 0) ? '-' : numberWithCommas(values[0][0].feb)));
				$('#sales-mar').html(((values[0][0].mar == 0) ? '-' : numberWithCommas(values[0][0].mar)));
				$('#sales-apr').html(((values[0][0].apr == 0) ? '-' : numberWithCommas(values[0][0].apr)));
				$('#sales-may').html(((values[0][0].may == 0) ? '-' : numberWithCommas(values[0][0].may)));
				$('#sales-jun').html(((values[0][0].jun == 0) ? '-' : numberWithCommas(values[0][0].jun)));
				$('#sales-jul').html(((values[0][0].jul == 0) ? '-' : numberWithCommas(values[0][0].jul)));
				$('#sales-aug').html(((values[0][0].aug == 0) ? '-' : numberWithCommas(values[0][0].aug)));
				$('#sales-sep').html(((values[0][0].sep == 0) ? '-' : numberWithCommas(values[0][0].sep)));
				$('#sales-oct').html(((values[0][0].oct == 0) ? '-' : numberWithCommas(values[0][0].oct)));
				$('#sales-nov').html(((values[0][0].nov == 0) ? '-' : numberWithCommas(values[0][0].nov)));
				$('#sales-dec').html(((values[0][0].dec == 0) ? '-' : numberWithCommas(values[0][0].dec)));

				$('#cost-jan').html(((values[1][0].jan == 0) ? '-' : numberWithCommas(values[1][0].jan)));
				$('#cost-feb').html(((values[1][0].feb == 0) ? '-' : numberWithCommas(values[1][0].feb)));
				$('#cost-mar').html(((values[1][0].mar == 0) ? '-' : numberWithCommas(values[1][0].mar)));
				$('#cost-apr').html(((values[1][0].apr == 0) ? '-' : numberWithCommas(values[1][0].apr)));
				$('#cost-may').html(((values[1][0].may == 0) ? '-' : numberWithCommas(values[1][0].may)));
				$('#cost-jun').html(((values[1][0].jun == 0) ? '-' : numberWithCommas(values[1][0].jun)));
				$('#cost-jul').html(((values[1][0].jul == 0) ? '-' : numberWithCommas(values[1][0].jul)));
				$('#cost-aug').html(((values[1][0].aug == 0) ? '-' : numberWithCommas(values[1][0].aug)));
				$('#cost-sep').html(((values[1][0].sep == 0) ? '-' : numberWithCommas(values[1][0].sep)));
				$('#cost-oct').html(((values[1][0].oct == 0) ? '-' : numberWithCommas(values[1][0].oct)));
				$('#cost-nov').html(((values[1][0].nov == 0) ? '-' : numberWithCommas(values[1][0].nov)));
				$('#cost-dec').html(((values[1][0].dec == 0) ? '-' : numberWithCommas(values[1][0].dec)));

				$('#profit-jan').html(((values[2][0].jan == 0) ? '-' : numberWithCommas(values[2][0].jan)));
				$('#profit-feb').html(((values[2][0].feb == 0) ? '-' : numberWithCommas(values[2][0].feb)));
				$('#profit-mar').html(((values[2][0].mar == 0) ? '-' : numberWithCommas(values[2][0].mar)));
				$('#profit-apr').html(((values[2][0].apr == 0) ? '-' : numberWithCommas(values[2][0].apr)));
				$('#profit-may').html(((values[2][0].may == 0) ? '-' : numberWithCommas(values[2][0].may)));
				$('#profit-jun').html(((values[2][0].jun == 0) ? '-' : numberWithCommas(values[2][0].jun)));
				$('#profit-jul').html(((values[2][0].jul == 0) ? '-' : numberWithCommas(values[2][0].jul)));
				$('#profit-aug').html(((values[2][0].aug == 0) ? '-' : numberWithCommas(values[2][0].aug)));
				$('#profit-sep').html(((values[2][0].sep == 0) ? '-' : numberWithCommas(values[2][0].sep)));
				$('#profit-oct').html(((values[2][0].oct == 0) ? '-' : numberWithCommas(values[2][0].oct)));
				$('#profit-nov').html(((values[2][0].nov == 0) ? '-' : numberWithCommas(values[2][0].nov)));
				$('#profit-dec').html(((values[2][0].dec == 0) ? '-' : numberWithCommas(values[2][0].dec)));

				$('#bill-jan').html(((values[3][0].jan == 0) ? '-' : numberWithCommas(values[3][0].jan)));
				$('#bill-feb').html(((values[3][0].feb == 0) ? '-' : numberWithCommas(values[3][0].feb)));
				$('#bill-mar').html(((values[3][0].mar == 0) ? '-' : numberWithCommas(values[3][0].mar)));
				$('#bill-apr').html(((values[3][0].apr == 0) ? '-' : numberWithCommas(values[3][0].apr)));
				$('#bill-may').html(((values[3][0].may == 0) ? '-' : numberWithCommas(values[3][0].may)));
				$('#bill-jun').html(((values[3][0].jun == 0) ? '-' : numberWithCommas(values[3][0].jun)));
				$('#bill-jul').html(((values[3][0].jul == 0) ? '-' : numberWithCommas(values[3][0].jul)));
				$('#bill-aug').html(((values[3][0].aug == 0) ? '-' : numberWithCommas(values[3][0].aug)));
				$('#bill-sep').html(((values[3][0].sep == 0) ? '-' : numberWithCommas(values[3][0].sep)));
				$('#bill-oct').html(((values[3][0].oct == 0) ? '-' : numberWithCommas(values[3][0].oct)));
				$('#bill-nov').html(((values[3][0].nov == 0) ? '-' : numberWithCommas(values[3][0].nov)));
				$('#bill-dec').html(((values[3][0].dec == 0) ? '-' : numberWithCommas(values[3][0].dec)));

				$('#qty-jan').html(((values[4][0].jan == 0) ? '-' : numberWithCommas(values[4][0].jan)));
				$('#qty-feb').html(((values[4][0].feb == 0) ? '-' : numberWithCommas(values[4][0].feb)));
				$('#qty-mar').html(((values[4][0].mar == 0) ? '-' : numberWithCommas(values[4][0].mar)));
				$('#qty-apr').html(((values[4][0].apr == 0) ? '-' : numberWithCommas(values[4][0].apr)));
				$('#qty-may').html(((values[4][0].may == 0) ? '-' : numberWithCommas(values[4][0].may)));
				$('#qty-jun').html(((values[4][0].jun == 0) ? '-' : numberWithCommas(values[4][0].jun)));
				$('#qty-jul').html(((values[4][0].jul == 0) ? '-' : numberWithCommas(values[4][0].jul)));
				$('#qty-aug').html(((values[4][0].aug == 0) ? '-' : numberWithCommas(values[4][0].aug)));
				$('#qty-sep').html(((values[4][0].sep == 0) ? '-' : numberWithCommas(values[4][0].sep)));
				$('#qty-oct').html(((values[4][0].oct == 0) ? '-' : numberWithCommas(values[4][0].oct)));
				$('#qty-nov').html(((values[4][0].nov == 0) ? '-' : numberWithCommas(values[4][0].nov)));
				$('#qty-dec').html(((values[4][0].dec == 0) ? '-' : numberWithCommas(values[4][0].dec)));

				google.charts.setOnLoadCallback(drawChart);
				function drawChart() {
					/*var data = google.visualization.arrayToDataTable([
						['Month', 'Total Sales', 'Total Cost', 'Total Profit', 'Bill'],
						['Jan', values[0][0].jan, values[1][0].jan, values[2][0].jan, values[3][0].jan],
						['Feb', values[0][0].feb, values[1][0].feb, values[2][0].feb, values[3][0].feb],
						['Mar', values[0][0].mar, values[1][0].mar, values[2][0].mar, values[3][0].mar],
						['apr', values[0][0].apr, values[1][0].apr, values[2][0].apr, values[3][0].apr],
						['May', values[0][0].may, values[1][0].may, values[2][0].may, values[3][0].may],
						['Jun', values[0][0].jun, values[1][0].jun, values[2][0].jun, values[3][0].jun],
						['Jul', values[0][0].jul, values[1][0].jul, values[2][0].jul, values[3][0].jul],
						['Aug', values[0][0].aug, values[1][0].aug, values[2][0].aug, values[3][0].aug],
						['Sep', values[0][0].sep, values[1][0].sep, values[2][0].sep, values[3][0].sep],
						['Oct', values[0][0].oct, values[1][0].oct, values[2][0].oct, values[3][0].oct],
						['Nov', values[0][0].nov, values[1][0].nov, values[2][0].nov, values[3][0].nov],
						['Dec', values[0][0].dec, values[1][0].dec, values[2][0].dec, values[3][0].dec]
					]);
					var options = {
					  title : 'Chart Summary',
					  vAxis: {title: ' '},
					  hAxis: {title: 'Month'},
					  seriesType: 'bars',
					  series: {3: {type: 'line'}}
					};*/
					var data = google.visualization.arrayToDataTable([
						['Month', 'Total Sales', 'Total Cost', 'Total Profit'],
						['Jan', values[0][0].jan, values[1][0].jan, values[2][0].jan],
						['Feb', values[0][0].feb, values[1][0].feb, values[2][0].feb],
						['Mar', values[0][0].mar, values[1][0].mar, values[2][0].mar],
						['Apr', values[0][0].apr, values[1][0].apr, values[2][0].apr],
						['May', values[0][0].may, values[1][0].may, values[2][0].may],
						['Jun', values[0][0].jun, values[1][0].jun, values[2][0].jun],
						['Jul', values[0][0].jul, values[1][0].jul, values[2][0].jul],
						['Aug', values[0][0].aug, values[1][0].aug, values[2][0].aug],
						['Sep', values[0][0].sep, values[1][0].sep, values[2][0].sep],
						['Oct', values[0][0].oct, values[1][0].oct, values[2][0].oct],
						['Nov', values[0][0].nov, values[1][0].nov, values[2][0].nov],
						['Dec', values[0][0].dec, values[1][0].dec, values[2][0].dec]
					]);

					var options = {
						/*chart: {
							title: 'Chart Summary',
							subtitle: 'Total Sales, Total Cost and Total Profit In Year'
						},*/
						title: 'Chart Summary',
						bars: 'vertical',
						vAxis: { format: 'decimal' },
						height: 200,
						colors: ['#1a237e', '#ffeb3b', '#ff5252']
					};


					/*var chart = new google.charts.Bar(document.getElementById('div-chart_month'));
					//google.visualization.events.addListener(chart, 'ready', chartLoaded);
					chart.draw(data, google.charts.Bar.convertOptions(options));*/

					var chart = new google.visualization.ColumnChart(document.getElementById('div-chart_month'));
					//google.visualization.events.addListener(chart, 'ready', chartLoaded);
					chart.draw(data, options);
				}
				//$('.wait2month ').show();
				google.charts.setOnLoadCallback(drawChart2);
				function drawChart2() {
					var data = google.visualization.arrayToDataTable([
						['Month', 'Total Quantity', 'Total Bill'],
						['Jan', values[4][0].jan, values[3][0].jan],
						['Feb', values[4][0].feb, values[3][0].feb],
						['Mar', values[4][0].mar, values[3][0].mar],
						['Apr', values[4][0].apr, values[3][0].apr],
						['May', values[4][0].may, values[3][0].may],
						['Jun', values[4][0].jun, values[3][0].jun],
						['Jul', values[4][0].jul, values[3][0].jul],
						['Aug', values[4][0].aug, values[3][0].aug],
						['Sep', values[4][0].sep, values[3][0].sep],
						['Oct', values[4][0].oct, values[3][0].oct],
						['Nov', values[4][0].nov, values[3][0].nov],
						['Dec', values[4][0].dec, values[3][0].dec]
					]);
					var options = {
						/*chart: {
							title: 'Chart Quantity',
							subtitle: 'Total Quantity and Total Bill In Year'
						},*/
						title: 'Chart Quantity',
						bars: 'vertical',
						vAxis: { format: 'decimal' },
						height: 200,
						bar: { groupWidth: "50%" },
						series: [
							{ targetAxisIndex: 0 },
							{ targetAxisIndex: 1 }
						],
						colors: ['#1a237e', '#ff5252']
					};

					/*var chart = new google.charts.Bar(document.getElementById('div-chart_month_line'));
					google.visualization.events.addListener(chart, 'ready', chartLoaded);
					chart.draw(data, google.charts.Bar.convertOptions(options));
					console.log('chart done!')*/

					var chart = new google.visualization.ColumnChart(document.getElementById('div-chart_month_line'));
					google.visualization.events.addListener(chart, 'ready', chartLoaded);
					chart.draw(data, options);

				}

			} else {
				$('#dv-loading_data2month').hide();
				$('.wait2month').hide();
				$('#box-chart1').hide();
			}

		} else {
			$('#dv-loading_data2month').hide();
			$('.wait2month').hide();
			$('#box-chart1').hide();
		}

	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};
function chartLoaded() {
	$('#dv-loading_data2month').hide();
	$('.wait2month').show();
	//$('#div-chart_month').show();
	$('#box-chart1').show();

	$('#box-chart1 .overlay').hide();
}
function summary() {
	$('#sumCash').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');
	$('#sumCredit').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');
	$('#sumDiscountCash').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');
	$('#sumTotal').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');
	$('#sumCost').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');
	$('#sumHeadquarters').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');
	$('#sumClaim').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');
	var sumBill = 0;
	var sumCash = 0;
	var sumCredit = 0;
	var sumDiscountCash = 0;
	var sumTotal = 0;
	var sumCost = 0;
	var sumProfit = 0;
	var sumHeadquarters = 0;
	var sumClaim = 0;
	$('.sumBill').each(function (index) {
		var value = $(this).attr('data-val');
		if (!isNaN(value) && value.length != 0) {
			sumBill += parseFloat(value);
		}
	});
	$('.sumSales').each(function (index) {
		var value = $(this).attr('data-val');
		if (!isNaN(value) && value.length != 0) {
			sumCash += parseFloat(value);
		}
	});
	$('.sumCredit').each(function (index) {
		var value = $(this).attr('data-val');
		if (!isNaN(value) && value.length != 0) {
			sumCredit += parseFloat(value);
		}
	});
	$('.sumDiscountCash').each(function (index) {
		var value = $(this).attr('data-val');
		if (!isNaN(value) && value.length != 0) {
			sumDiscountCash += parseFloat(value);
		}
	});
	$('.sumTotal').each(function (index) {
		var value = $(this).attr('data-val');
		if (!isNaN(value) && value.length != 0) {
			sumTotal += parseFloat(value);
		}
	});
	$('.sumCost').each(function (index) {
		var value = $(this).attr('data-val');
		if (!isNaN(value) && value.length != 0) {
			sumCost += parseFloat(value);
		}
	});
	$('.sumProfit').each(function (index) {
		var value = $(this).attr('data-val');
		if (!isNaN(value) && value.length != 0) {
			sumProfit += parseFloat(value);
		}
	});
	$('.sumHeadquarters').each(function (index) {
		var value = $(this).attr('data-val');
		if (!isNaN(value) && value.length != 0) {
			sumHeadquarters += parseFloat(value);
		}
	});
	$('.sumClaim').each(function (index) {
		var value = $(this).attr('data-val');
		if (!isNaN(value) && value.length != 0) {
			sumClaim += parseFloat(value);
		}
	});

	$('#sumBill').html(((sumBill == 0) ? '-' : numberWithCommas(sumBill)));
	$('#sumCash').html(((sumCash == 0) ? '-' : numberWithCommas(sumCash.toFixed(2))));
	$('#sumCredit').html(((sumCredit == 0) ? '-' : numberWithCommas(sumCredit.toFixed(2))));
	$('#sumDiscountCash').html(((sumDiscountCash == 0) ? '-' : numberWithCommas(sumDiscountCash.toFixed(2))));
	$('#sumTotal').html(((sumTotal == 0) ? '-' : numberWithCommas(sumTotal.toFixed(2))));
	$('#sumCost').html(((sumCost == 0) ? '-' : numberWithCommas(sumCost.toFixed(2))));
	$('#sumProfit').html(((sumProfit == 0) ? '-' : numberWithCommas(sumProfit.toFixed(2))));
	$('#sumHeadquarters').html(((sumHeadquarters == 0) ? '-' : numberWithCommas(sumHeadquarters)));
	$('#sumClaim').html(((sumClaim == 0) ? '-' : numberWithCommas(sumClaim)));
};

function summaryW() {
	$('#sumCash_w').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');
	$('#sumCreditw_w').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');
	$('#sumTotal_w').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');
	var sumTotal = 0;
	var sumCost = 0;
	var sumProfit = 0;

	$('.sumTotal_w').each(function (index) {
		var value = $(this).attr('data-val');
		if (!isNaN(value) && value.length != 0) {
			sumTotal += parseFloat(value);
		}
	});
	$('.sumCost_w').each(function (index) {
		var value = $(this).attr('data-val');
		if (!isNaN(value) && value.length != 0) {
			sumCost += parseFloat(value);
		}
	});
	$('.sumProfit_w').each(function (index) {
		var value = $(this).attr('data-val');
		if (!isNaN(value) && value.length != 0) {
			sumProfit += parseFloat(value);
		}
	});

	$('#sumTotal_w').html(((sumTotal == 0) ? '-' : numberWithCommas(sumTotal)));
	$('#sumCost_w').html(((sumCost == 0) ? '-' : numberWithCommas(sumCost)));
	$('#sumProfit_w').html(((sumProfit == 0) ? '-' : numberWithCommas(sumProfit)));

};

function loadReceivable() {
	$('#dv-credit').hide();
	$('#tb-result_credit').hide();
	$('#tb-sum_credit').hide();
	$('#dv-no_data2credit').hide();
	$('#dv-loading_data2credit').show();

	$.post('https://api.remaxthailand.co.th/shop/receivable', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: $('#cbb-shop2credit').val()
	}, function (data) {
		if (data.success) {
			var values = data.result;
			if (values[0].length > 0) {
				sortJSON(values[0], 'sellDate', 'desc');
				var html1 = '';

				for (i = 0; i < values[0].length; i++) {
					var result = values[0][i];

					//var no = i+1;
					html1 += '<tr class="' + (result.diff > 0 ? "text-bold text-red" : "") + '' + (result.diff == 0 ? "text-bold" : "") + '">';
					html1 += '<td width="100" class="text-center" valign="middle">' + result.name + '</td>';
					html1 += '<td width="100" class="text-center" valign="middle">' + result.sellNo + '</td>';
					html1 += '<td width="100" class="text-center" valign="middle">' + moment(result.sellDate).utcOffset(+7).format('DD/MM/YYYY HH:mm') + '</td>';
					html1 += '<td width="100" class="text-center" valign="middle">' + moment(result.dueDate).utcOffset(+7).format('DD/MM/YYYY HH:mm') + '</td>';
					html1 += '<td width="100" class="sumRtotol text-center" valign="middle" data-val= ' + result.totalPrice + '>' + ((result.totalPrice == 0) ? '-' : numberWithCommas(result.totalPrice)) + '</td>';
					html1 += '<td width="100" class="text-center" valign="middle">' + result.sellBy + '</td>';
					html1 += '</tr>';
				}

				sortJSON(values[1], 'sumTotal', 'desc');
				var html2 = '';
				for (i = 0; i < values[1].length; i++) {
					var result = values[1][i];

					//var no = i+1;
					html2 += '<tr>';
					html2 += '<td width="100" class="text-center" valign="middle">' + result.name + '</td>';
					html2 += '<td width="100" class="sumRtotol text-center" valign="middle" data-val= ' + result.sumTotal + '>' + ((result.sumTotal == 0) ? '-' : numberWithCommas(result.sumTotal)) + '</td>';
					html2 += '</tr>';
				}

				$('#tb-result_credit tbody').html(html1);
				$('#tb-sum_credit tbody').html(html2);
				$('#txt-totalCredit').html(numberWithCommas(values[2][0].totalCredit));
				$('#tb-result_credit').show();
				$('#tb-sum_credit').show();
				$('#dv-credit').show();

				$('#dv-no_data2credit').hide();
				$('#dv-loading_data2credit').hide();
			} else {
				$('#dv-no_data2credit').show();
				$('#dv-loading_data2credit').hide();
				$('#tb-result_credit').hide();
				$('#tb-sum_credit').hide();
			}
		}

	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};
function loadCategory3() {
	$('#dv-loading3').show();
	$('#dv-loading3r').show();
	//$('#dv-no_data3, #tb-result3').hide();
	$.post('https://api.remaxthailand.co.th/category/info', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: 'POWERDDH-8888-8888-B620-48D3B6489999'
	}, function (data) {
		if (data.success) {
			$('#cbb-category3').append('<option value="">ทั้งหมด</option>');
			$('#cbb-category3r').append('<option value="">ทั้งหมด</option>');
			$('#cbb-category3st').append('<option value="">แยกตามหมวดสินค้า</option>');
			$('#cbb-category3st').append('<option value="all">ทั้งหมด</option>');
			for (i = 0; i < data.result.length; i++) {
				var result = data.result[i];
				$('#cbb-category3').append('<option value=' + result.url + '>' + result.name + '</option>');
				$('#cbb-category3r').append('<option value=' + result.url + '>' + result.name + '</option>');
				$('#cbb-category3st').append('<option value=' + result.url + '>' + result.name + '</option>');
			}
			$('#cbb-category3 option:eq(0)').attr('selected', 'selected');
			$('#cbb-category3r option:eq(0)').attr('selected', 'selected');
			$('#cbb-category3st option:eq(0)').attr('selected', 'selected');
			$('#dv-loading3').hide();
			$('#form-select3').show();
			$('#dv-loading3r').hide();
			$('#form-select3r').show();
			$('#dv-loading3st').hide();
			$('#form-select3st').show();
			loadAging();
			loadRunRate();
			loadStockData();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};

function loadBrand3() {
	//$('#dv-loading').show();
	//$('#dv-no_data, #tb-result').hide();
	$.post('https://api.remaxthailand.co.th/brand/member', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val()
	}, function (data) {
		if (data.success) {
			if (data.result.length > 1) {
				$('#cbb-brand3st').append('<option value="">ทั้งหมด</option>');
			}
			for (i = 0; i < data.result.length; i++) {
				var result = data.result[i];
				$('#cbb-brand3st').append('<option value="' + result.url + '">' + result.name + '</option>');
			}
			$('#cbb-brand3st option:eq(0)').attr('selected', 'selected');
			$('wait').show();
			loadCategory3();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};

function loadAging() {
	$('#dv-no_data3').hide();
	$('.wait3').hide();
	$('.wait3_full').hide();
	$('#dv-loading_data3').show();
	$('#tb-result3').hide();
	$('#tb-result3_full').hide();
	$.post('https://api.remaxthailand.co.th/shop/aging', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: $('#cbb-shop3').val(),
		category: $('#cbb-category3').val()
	}, function (data) {
		$('#dv-loading_data3').hide();
		if (data.success) {
			json = data.result;
			//sortJSON(json, 'date', 'groupName');
			var html = '';
			var sum90 = 0;
			var sum60 = 0;
			var sum30 = 0;
			var sum15 = 0;
			var sum0 = 0;
			for (i = 0; i < json.length; i++) {
				var result = json[i];
				var no = i + 1;
				html += '<tr>';
				//html += '<td width="10" class="text-center" valign="middle">' + no + '</td>';
				html += '<td width="80" class="text-center" valign="middle">' + result.sku + '</td>';
				html += '<td width="800" class="text-left" valign="middle">' + result.productName;
				html += '<h6><small class="pull-right text-muted">' + ((result.groupId == "19") ? '(ยกเลิกใช้งาน)' : ' ') + '</small></h6></td>';
				html += '<td width="80" class="sumCostAging text-center" valign="middle" data-val= ' + result.cost + '>' + ((result.cost == 0) ? '-' : result.cost ) + '</td>';
				html += '<td width="80" class="sum90 text-center" valign="middle" data-val= ' + result['90'] + '>' + ((result['90'] == 0) ? '-' : result['90']) + '</td>';
				html += '<td width="80" class="sum60 text-center" valign="middle" data-val= ' + result['60'] + '>' + ((result['60'] == 0) ? '-' : result['60']) + '</td>';
				html += '<td width="80" class="sum30 text-center" valign="middle" data-val= ' + result['30'] + '>' + ((result['30'] == 0) ? '-' : result['30']) + '</td>';
				html += '<td width="80" class="sum15 text-center" valign="middle" data-val= ' + result['15'] + '>' + ((result['15'] == 0) ? '-' : result['15']) + '</td>';
				html += '<td width="80" class="sum0 text-center" valign="middle" data-val= ' + result['0'] + '>' + ((result['0'] == 0) ? '-' : result['0']) + '</td>';
				html += '</tr>';

				sum90 += result.cost * result['90'];
				sum60 += result.cost * result['60'];
				sum30 += result.cost * result['30'];
				sum15 += result.cost * result['15'];
				sum0 += result.cost * result['0'];

			}

			if($('#cbb-category3').val() === ''){
				$('.wait3').hide();
				$('#tb-result3').hide();

				$('#tb-result3_full tbody').html(html);
				$('#tb-result3_full').show();
				$('.wait3_full').show();
				$('#sum90_full').html(((sum90 == 0) ? '-' : numberWithCommas(sum90)));
				$('#sum60_full').html(((sum60 == 0) ? '-' : numberWithCommas(sum60)));
				$('#sum30_full').html(((sum30 == 0) ? '-' : numberWithCommas(sum30)));
				$('#sum15_full').html(((sum15 == 0) ? '-' : numberWithCommas(sum15)));
				$('#sum0_full').html(((sum0 == 0) ? '-' : numberWithCommas(sum0)));

				$('#tb-result3_full').DataTable();
				
			}else{
				$('.wait3_full').hide();
				$('#tb-result3_full').hide();

				$('#tb-result3 tbody').html(html);
				$('#tb-result3').show();
				$('.wait3').show();
				$('#sum90').html(((sum90 == 0) ? '-' : numberWithCommas(sum90)));
				$('#sum60').html(((sum60 == 0) ? '-' : numberWithCommas(sum60)));
				$('#sum30').html(((sum30 == 0) ? '-' : numberWithCommas(sum30)));
				$('#sum15').html(((sum15 == 0) ? '-' : numberWithCommas(sum15)));
				$('#sum0').html(((sum0 == 0) ? '-' : numberWithCommas(sum0)));
			}
			
			
			if (data.result.length == 0) {
				$('#dv-no_data3').show();
				$('#tb-result3').hide();
				$('.wait3').hide();
				$('.wait3_full').hide();
				$('#tb-result3_full').hide();
			}
			
			$('#dv-loading3').hide();		
			$('.hidden').removeClass('hidden').hide();
		} else {
			$('#dv-no_data3').show();
			$('#tb-result3').hide();
			$('#tb-result3_full').hide();
		}
		
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};

function loadRunRate() {
	$('#dv-no_data3r').hide();
	$('.wait3r').hide();
	$('.wait3r_full').hide();
	$('#dv-loading_data3r').show();
	$('#tb-result3r').hide();
	$('#tb-result3r_full').hide();
	$.post('https://api.remaxthailand.co.th/shop/run_rate', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: $('#cbb-shop3r').val(),
		category: $('#cbb-category3r').val()
	}, function (data) {
		$('#dv-loading_data3r').hide();
		if (data.success) {
			json = data.result;
			//sortJSON(json, 'date', 'desc');
			var html = '';
			var sumStock = 0;
			var sumNow = 0;
			var sumD1 = 0;
			var sumD2 = 0;
			var sumD3 = 0;
			var sumD4 = 0;
			var sumD5 = 0;
			var sumVal = 0;
			for (i = 0; i < json.length; i++) {
				var result = json[i];

				var no = i + 1;
				html += '<tr>';
				//html += '<td width="10" class="text-center" valign="middle">' + no + '</td>';
				html += '<td width="80" class="text-center" valign="middle">' + result.sku + '</td>';
				html += '<td width="800" class="text-left" valign="middle">' + result.name;
				html += '<h6><small class="pull-right text-muted">' + ((result.groupId == "19") ? '(ยกเลิกใช้งาน)' : ' ') + '</small></h6></td>';
				html += '<td width="80" class="sumCostRunRate text-center" valign="middle" data-val= ' + result.cost + '>' + ((result.cost == 0) ? '-' : result.cost) + '</td>';
				html += '<td width="80" class="sumStock text-center" valign="middle" data-val= ' + result.stock + '>' + ((result.stock == 0) ? '-' : result.stock) + '</td>';
				html += '<td width="80" class="sumNow text-center" valign="middle" data-val= ' + result['d0'] + '>' + ((result['d0'] == 0) ? '-' : result['d0']) + '</td>';
				html += '<td width="80" class="sumD1 text-center" valign="middle" data-val= ' + result['d1'] + '>' + ((result['d1'] == 0) ? '-' : result['d1']) + '</td>';
				html += '<td width="80" class="sumD2 text-center" valign="middle" data-val= ' + result['d2'] + '>' + ((result['d2'] == 0) ? '-' : result['d2']) + '</td>';
				html += '<td width="80" class="sumD3 text-center" valign="middle" data-val= ' + result['d3'] + '>' + ((result['d3'] == 0) ? '-' : result['d3']) + '</td>';
				html += '<td width="80" class="sumD4 text-center" valign="middle" data-val= ' + result['d4'] + '>' + ((result['d4'] == 0) ? '-' : result['d4']) + '</td>';
				html += '<td width="80" class="sumD5 text-center" valign="middle" data-val= ' + result['d5'] + '>' + ((result['d5'] == 0) ? '-' : result['d5']) + '</td>';
				html += '</tr>';

				sumVal += result.cost * result.stock;
				sumStock += result.stock;
				sumNow += result['d0'];
				sumD1 += result['d1'];
				sumD2 += result['d2'];
				sumD3 += result['d3'];
				sumD4 += result['d4'];
				sumD5 += result['d5'];
			}

			if($('#cbb-category3r').val() === ''){
				$('.wait3r').hide();
				$('#tb-result3r').hide();

				$('#tb-result3r_full tbody').html(html);
				$('#tb-result3r_full').show();
				$('.wait3r_full').show();
				$('#sumCostStock_full').html(((sumVal == 0) ? '-' : numberWithCommas(sumVal)));
				$('#sumStock_full').html(((sumStock == 0) ? '-' : numberWithCommas(sumStock)));
				$('#sumNow_full').html(((sumNow == 0) ? '-' : numberWithCommas(sumNow)));
				$('#sumD1_full').html(((sumD1 == 0) ? '-' : numberWithCommas(sumD1)));
				$('#sumD2_full').html(((sumD2 == 0) ? '-' : numberWithCommas(sumD2)));
				$('#sumD3_full').html(((sumD3 == 0) ? '-' : numberWithCommas(sumD3)));
				$('#sumD4_full').html(((sumD4 == 0) ? '-' : numberWithCommas(sumD4)));
				$('#sumD5_full').html(((sumD5 == 0) ? '-' : numberWithCommas(sumD5)));
				
				$('#tb-result3r_full').DataTable();
			}else{
				$('.wait3r_full').hide();
				$('#tb-result3r_full').hide();

				$('#tb-result3r tbody').html(html);
				$('#tb-result3r').show();
				$('.wait3r').show();
				$('#sumCostStock').html(((sumVal == 0) ? '-' : numberWithCommas(sumVal)));
				$('#sumStock').html(((sumStock == 0) ? '-' : numberWithCommas(sumStock)));
				$('#sumNow').html(((sumNow == 0) ? '-' : numberWithCommas(sumNow)));
				$('#sumD1').html(((sumD1 == 0) ? '-' : numberWithCommas(sumD1)));
				$('#sumD2').html(((sumD2 == 0) ? '-' : numberWithCommas(sumD2)));
				$('#sumD3').html(((sumD3 == 0) ? '-' : numberWithCommas(sumD3)));
				$('#sumD4').html(((sumD4 == 0) ? '-' : numberWithCommas(sumD4)));
				$('#sumD5').html(((sumD5 == 0) ? '-' : numberWithCommas(sumD5)));
			}
					
			if (data.result.length == 0) {
				$('#dv-no_data3r').show();
				$('#tb-result3r').hide();
				$('.wait3r').hide();
				$('.wait3r_full').hide();
				$('#tb-result3r_full').hide();
			}
			$('#dv-loading3r').hide();
			$('.hidden').removeClass('hidden').hide();

		} else {
			$('#dv-no_data3r').show();
			$('#tb-result3r').hide();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};

function loadStockData() {
	$('#dv-no_data3st').hide();
	$('.wait3st').hide();
	$('#dv-loading_data3st').show();
	$('#tb-result3st').hide();
	$('#stock_all').hide();
	$('#tb-result3st_product').hide();
	$('#tb-result3st_product_full').hide();
	$('#stock_product').hide();
	$.post('https://api.remaxthailand.co.th/shop/shopStock', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: $('#cbb-shop3st').val(),
		brand: $('#cbb-brand3st').val(),
		category: $('#cbb-category3st').val()
	}, function (data) {
		$('#dv-loading_data3st').hide();
		if (data.success) {
			json = data.result;
			//sortJSON(json, 'date', 'desc');
			var html = '';
			var sumStockCat = 0;
			var sumValueCat = 0;
			var sumStockProd = 0;
			var sumValueProd = 0;

			if ($('#cbb-category3st').val().length == 0) {
				for (i = 0; i < json.length; i++) {
					var result = json[i];
					html += '<tr>';
					html += '<td width="100" class="" valign="middle">' + result.categoryName + '</td>';
					html += '<td width="50" class="sumStockCat text-center" valign="middle" data-val= ' + result.stock + '>' + ((result.stock == 0) ? '-' : numberWithCommas(result.stock)) + '</td>';
					html += '<td width="50" class="sumValueCat text-center" valign="middle" data-val= ' + result.value + '>' + ((result.value == 0) ? '-' : numberWithCommas(result.value)) + '</td>';
					html += '</tr>';

					sumStockCat += result.stock;
					sumValueCat += result.value;
				}

				$('#tb-result3st tbody').html(html);
				$('#sumStockCat').html(((sumStockCat == 0) ? '-' : numberWithCommas(sumStockCat)));
				$('#sumValueCat').html(((sumValueCat == 0) ? '-' : numberWithCommas(sumValueCat)));

				$('#tb-result3st').show();
				$('#stock_all').show();
				$('#stock_product').hide();
				$('#tb-result3st_product').hide();
				$('#tb-result3st_product_full').hide();
				$('#stock_product_full').hide();
			} else {
				for (i = 0; i < json.length; i++) {
					var result = json[i];
					html += '<tr>';
					html += '<td width="50" class="text-center" valign="middle">' + result.sku + '</td>';
					html += '<td width="100" class="" valign="middle">' + result.productName + '</td>';
					html += '<td width="50" class="sumStockCat text-center" valign="middle" data-val= ' + result.stock + '>' + ((result.stock == 0) ? '-' : result.stock) + '</td>';
					html += '<td width="50" class="sumValueCat text-center" valign="middle" data-val= ' + result.value + '>' + ((result.value == 0) ? '-' : result.value) + '</td>';
					html += '</tr>';

					sumStockProd += result.stock;
					sumValueProd += result.value;
				}

				if($('#cbb-category3st').val() === 'all'){
					$('#tb-result3st_product_full tbody').html(html);
					$('#tb-result3st_product_full').DataTable();
					$('#sumStockProd').html(((sumStockProd == 0) ? '-' : numberWithCommas(sumStockProd)));
					$('#sumValueProd').html(((sumValueProd == 0) ? '-' : numberWithCommas(sumValueProd)));

					$('#stock_all').hide();
					$('#tb-result3st').hide();
					$('#stock_product').hide();
					$('#tb-result3st_product').hide();
					$('#stock_product_full').show();
					$('#tb-result3st_product_full').show();
					

				}else{
					$('#tb-result3st_product tbody').html(html);
					$('#sumStockProd').html(((sumStockProd == 0) ? '-' : numberWithCommas(sumStockProd)));
					$('#sumValueProd').html(((sumValueProd == 0) ? '-' : numberWithCommas(sumValueProd)));

					$('#stock_all').hide();
					$('#tb-result3st').hide();
					$('#stock_product_full').hide();
					$('#tb-result3st_product_full').hide();
					$('#stock_product').show();
					$('#tb-result3st_product').show();
				}
				
			}

			if (data.result.length == 0) {
				$('#dv-no_data3st').show();
				$('#tb-result3st').hide();
				$('#tb-result3st_product').hide();
				$('#tb-result3st_product_full').hide();
			}
			//$("#tb-result3").DataTable();
			$('#dv-loading3st').hide();

			$('.wait3st').show();
			$('.hidden').removeClass('hidden').hide();

		} else {
			$('#dv-no_data3st').show();
			$('#tb-result3st').hide();
			$('#tb-result3st_product').hide();
			$('#tb-result3st_product_full').hide();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadSummaryCustomerData() {
	$('#dv-no_data2c').hide();
	$('.wait2c').hide();
	$('#dv-loading_data2c').show();
	$('#tb-result2c').hide();

	$.post('https://api.remaxthailand.co.th/shop/summaryCustomerShop', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: $('#cbb-shop2c').val(),
		year: $('#cbb-yearc').val()
	}, function (data) {
		$('#dv-loading_data2c').hide();
		if (data.success) {
			json = data.result;
			//sortJSON(json, 'date', 'desc');
			//var html = '';
			var sumJan = 0;
			var sumFeb = 0;
			var sumMar = 0;
			var sumApr = 0;
			var sumMay = 0;
			var sumJun = 0;
			var sumJul = 0;
			var sumAug = 0;
			var sumSep = 0;
			var sumOct = 0;
			var sumNov = 0;
			var sumDec = 0;
			$('#tb-result2c tbody').html('');
			for (i = 0; i < json.length; i++) {
				var result = json[i];
				var html = '<tr><td>' + ((result.address != "  ต. อ. จ. ") ? '<i class="fa fa-home pointer i-popover" data-toggle="popover" data-placement="right" data-content="' + result.address + '"></i> ' : ' ');
				html += (result.mobile != null) ? '<i class="fa fa-phone-square pointer i-popover" data-toggle="popover" data-placement="right" data-content="' + result.mobile.substr(0, 3) + '-' + result.mobile.substr(3, 4) + '-' + result.mobile.substr(7) + '"></i> ' : ' ';
				html += result.name + '</td>';
				//html += '<td width="200" class="text-center" valign="middle">';
				//html += '<span id="compositebar-'+result.customer+'" class="compositebar pull-right">'+result.jan+','+result.feb+','+result.mar+','+result.apr+','+result.may+','+result.jun+','+result.jul+','+result.aug+','+result.sep+','+result.oct+','+result.nov+','+result.dec+',</span></td>';
				html += '<td width="100" class="sumJan text-center" valign="middle" data-val= ' + result.jan + '>' + ((result.jan == 0) ? '-' : numberWithCommas(result.jan)) + '</td>';
				html += '<td width="100" class="sumFeb text-center" valign="middle" data-val= ' + result.feb + '>' + ((result.feb == 0) ? '-' : numberWithCommas(result.feb)) + '</td>';
				html += '<td width="100" class="sumMar text-center" valign="middle" data-val= ' + result.mar + '>' + ((result.mar == 0) ? '-' : numberWithCommas(result.mar)) + '</td>';
				html += '<td width="100" class="sumApr text-center" valign="middle" data-val= ' + result.apr + '>' + ((result.apr == 0) ? '-' : numberWithCommas(result.apr)) + '</td>';
				html += '<td width="100" class="sumMay text-center" valign="middle" data-val= ' + result.may + '>' + ((result.may == 0) ? '-' : numberWithCommas(result.may)) + '</td>';
				html += '<td width="100" class="sumJun text-center" valign="middle" data-val= ' + result.jun + '>' + ((result.jun == 0) ? '-' : numberWithCommas(result.jun)) + '</td>';
				html += '<td width="100" class="sumJul text-center" valign="middle" data-val= ' + result.jul + '>' + ((result.jul == 0) ? '-' : numberWithCommas(result.jul)) + '</td>';
				html += '<td width="100" class="sumAug text-center" valign="middle" data-val= ' + result.aug + '>' + ((result.aug == 0) ? '-' : numberWithCommas(result.aug)) + '</td>';
				html += '<td width="100" class="sumSep text-center" valign="middle" data-val= ' + result.sep + '>' + ((result.sep == 0) ? '-' : numberWithCommas(result.sep)) + '</td>';
				html += '<td width="100" class="sumOct text-center" valign="middle" data-val= ' + result.oct + '>' + ((result.oct == 0) ? '-' : numberWithCommas(result.oct)) + '</td>';
				html += '<td width="100" class="sumNov text-center" valign="middle" data-val= ' + result.nov + '>' + ((result.nov == 0) ? '-' : numberWithCommas(result.nov)) + '</td>';
				html += '<td width="100" class="sumDec text-center" valign="middle" data-val= ' + result.dec + '>' + ((result.dec == 0) ? '-' : numberWithCommas(result.dec)) + '</td>';
				html += '</tr>';

				sumJan += result.jan;
				sumFeb += result.feb;
				sumMar += result.mar;
				sumApr += result.apr;
				sumMay += result.may;
				sumJun += result.jun;
				sumJul += result.jul;
				sumAug += result.aug;
				sumSep += result.sep;
				sumOct += result.oct;
				sumNov += result.nov;
				sumDec += result.dec;

				$('#tb-result2c tbody').append(html);

				//$("#compositebar-"+result.customer).sparkline('html', {type: 'bar', barColor: '#7f94ff'});
				//$('#compositebar-'+result.customer).sparkline([3,2,5,9]);
				//$('#compositebar-'+result.customer).sparkline([result.jan.toFixed(0),result.feb.toFixed(0),result.mar.toFixed(0),result.apr.toFixed(0),result.may.toFixed(0),result.jun.toFixed(0),result.jul.toFixed(0),result.aug.toFixed(0),result.sep.toFixed(0),result.oct.toFixed(0),result.nov.toFixed(0),result.dec.toFixed(0)],{composite: true, fillColor: false, lineColor: '#505050'});
			}
			$('.i-popover').popover({ trigger: 'hover' });

			//$('#tb-result2c tbody').html( html );
			$('#sumJan').html(((sumJan == 0) ? '-' : numberWithCommas(sumJan)));
			$('#sumFeb').html(((sumFeb == 0) ? '-' : numberWithCommas(sumFeb)));
			$('#sumMar').html(((sumMar == 0) ? '-' : numberWithCommas(sumMar)));
			$('#sumApr').html(((sumApr == 0) ? '-' : numberWithCommas(sumApr)));
			$('#sumMay').html(((sumMay == 0) ? '-' : numberWithCommas(sumMay)));
			$('#sumJun').html(((sumJun == 0) ? '-' : numberWithCommas(sumJun)));
			$('#sumJul').html(((sumJul == 0) ? '-' : numberWithCommas(sumJul)));
			$('#sumAug').html(((sumAug == 0) ? '-' : numberWithCommas(sumAug)));
			$('#sumSep').html(((sumSep == 0) ? '-' : numberWithCommas(sumSep)));
			$('#sumOct').html(((sumOct == 0) ? '-' : numberWithCommas(sumOct)));
			$('#sumNov').html(((sumNov == 0) ? '-' : numberWithCommas(sumNov)));
			$('#sumDec').html(((sumDec == 0) ? '-' : numberWithCommas(sumDec)));
			if (data.result.length == 0) {
				$('#dv-no_data2c').show();
				$('#tb-result2c').hide();
			}
			//$("#tb-result2").DataTable();
			$('.wait2c').show();
			$('.hidden').removeClass('hidden').hide();

		} else {
			$('#dv-no_data2c').show();
			$('#tb-result2c').hide();
		}


	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};
function loadmData() {
	$.post('https://api.remaxthailand.co.th/shop/monthlySaleByCategory/shop', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: $('#cbb-shop4').val(),
		month: $('#selectPrevious').val()
	}, function (data) {
		if (data.success) {
			mData = data.result;
		}
		loadColumnChart();
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};

function loadColumnChart() {

	google.charts.setOnLoadCallback(drawChart);
	function drawChart() {
		var lblType = '';
		var monthInt = new Date().getMonth();

		var mth0 = monthEn2[monthInt + 12];
		var mth1 = monthEn2[monthInt - 1 + 12];
		var mth2 = monthEn2[monthInt - 2 + 12];
		var mth3 = monthEn2[monthInt - 3 + 12];
		var mth4 = monthEn2[monthInt - 4 + 12];
		var mth5 = monthEn2[monthInt - 5 + 12];
		var mth6 = monthEn2[monthInt - 6 + 12];
		var mth7 = monthEn2[monthInt - 7 + 12];
		var mth8 = monthEn2[monthInt - 8 + 12];
		var mth9 = monthEn2[monthInt - 9 + 12];
		var mth10 = monthEn2[monthInt - 10 + 12];
		var mth11 = monthEn2[monthInt - 11 + 12];
		var mth12 = monthEn2[monthInt - 12 + 12];

		/*var mth0 = 'Aug';
		var mth1 = 'Jul';
		var mth2 = 'Jun';
		var mth3 = 'May';
		var mth4 = 'Apr';
		var mth5 = 'Mar';
		var mth6 = 'Feb';
		var mth7 = 'Jan';
		var mth8 = 'Dec';
		var mth9 = 'Nov';
		var mth10 = 'Oct';
		var mth11 = 'Sep';
		var mth12 = 'Aug';*/

		var dataTable = new google.visualization.DataTable();
		if ($('#selectType').val() == 'type-sale') {
			lblType = 'Sales';
			if ($('#selectPrevious').val() == 0) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth0],
					['Adapter', mData[0][0].adapter != undefined ? mData[0][0].adapter : 0],
					['Bag', mData[0][0].bag != undefined ? mData[0][0].bag : 0],
					['Cable', mData[0][0].cable != undefined ? mData[0][0].cable : 0],
					['Car Gadget', mData[0][0].car_gadget != undefined ? mData[0][0].car_gadget : 0],
					['Case For Smartphone', mData[0][0].case_for_smartphone != undefined ? mData[0][0].case_for_smartphone : 0],
					['Case For Tablet', mData[0][0].case_for_tablet != undefined ? mData[0][0].case_for_tablet : 0],
					['Clearance', mData[0][0].clearance != undefined ? mData[0][0].clearance : 0],
					['Gadget Creative', mData[0][0].creative != undefined ? mData[0][0].creative : 0],
					['Gaming', mData[0][0].gaming != undefined ? mData[0][0].gaming : 0],
					['Home Gadget', mData[0][0].home_gadget != undefined ? mData[0][0].home_gadget : 0],
					['Lamp', mData[0][0].lamp != undefined ? mData[0][0].lamp : 0],
					['Film', mData[0][0].film != undefined ? mData[0][0].film : 0],
					['Smart life', mData[0][0].gadget != undefined ? mData[0][0].gadget : 0],
					['Power Bank', mData[0][0].power_bank != undefined ? mData[0][0].power_bank : 0],
					['Small Talk Bluetooth', mData[0][0]['small_talk_bluetooth'] != undefined ? mData[0][0]['small_talk_bluetooth'] : 0],
					['Speaker', mData[0][0].speaker != undefined ? mData[0][0].speaker : 0],
					['Storage Memory Card', mData[0][0]['storage_memory_card'] != undefined ? mData[0][0]['storage_memory_card'] : 0],
					['Zhuaimao', mData[0][0].zhuaimao != undefined ? mData[0][0].azhuaimaodapter : 0],
					['ยกเลิกใช้งาน', mData[0][0].cancel != undefined ? mData[0][0].cancel : 0],
					['Other', mData[0][0].other != undefined ? mData[0][0].other : 0]
				]);
			} else if ($('#selectPrevious').val() == 1) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth1, mth0],

					['Adapter', mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][1]['small_talk_bluetooth'], mData[0][0]['small_talk_bluetooth']],

					['Speaker', mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][1]['storage_memory_card'], mData[0][0]['storage_memory_card']],

					['Zhuaimao', mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 2) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth2, mth1, mth0],

					['Adapter', mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][2]['small_talk_bluetooth'], mData[0][1]['small_talk_bluetooth'], mData[0][0]['small_talk_bluetooth']],

					['Speaker', mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][2]['storage_memory_card'], mData[0][1]['storage_memory_card'], mData[0][0]['storage_memory_card']],

					['Zhuaimao', mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 3) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth3, mth2, mth1, mth0],

					['Adapter', mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][3]['small_talk_bluetooth'], mData[0][2]['small_talk_bluetooth'], mData[0][1]['small_talk_bluetooth'], mData[0][0]['small_talk_bluetooth']],

					['Speaker', mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][3]['storage_memory_card'], mData[0][2]['storage_memory_card'], mData[0][1]['storage_memory_card'], mData[0][0]['storage_memory_card']],

					['Zhuaimao', mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][3].cancel, mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 4) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[0][4].adapter, mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][4].bag, mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][4].cable, mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][4].car_gadget, mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][4].case_for_smartphone, mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][4].case_for_tablet, mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][4].clearance, mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][4].creative, mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][4].gaming, mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][4].home_gadget, mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][4].lamp, mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],
					
					['Film', mData[0][4].film, mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][4].gadget, mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][4].power_bank, mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][4]['small_talk_bluetooth'], mData[0][3]['small_talk_bluetooth'], mData[0][2]['small_talk_bluetooth'], mData[0][1]['small_talk_bluetooth'], mData[0][0]['small_talk_bluetooth']],

					['Speaker', mData[0][4].speaker, mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][4]['storage_memory_card'], mData[0][3]['storage_memory_card'], mData[0][2]['storage_memory_card'], mData[0][1]['storage_memory_card'], mData[0][0]['storage_memory_card']],

					['Zhuaimao', mData[0][4].zhuaimao, mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][4].cancel, mData[0][3].cancel, mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][4].other, mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 5) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[0][5].adapter, mData[0][4].adapter, mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][5].bag, mData[0][4].bag, mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][5].cable, mData[0][4].cable, mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][5].car_gadget, mData[0][4].car_gadget, mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][5].case_for_smartphone, mData[0][4].case_for_smartphone, mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][5].case_for_tablet, mData[0][4].case_for_tablet, mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][5].clearance, mData[0][4].clearance, mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][5].creative, mData[0][4].creative, mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][5].gaming, mData[0][4].gaming, mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][5].home_gadget, mData[0][4].home_gadget, mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][5].lamp, mData[0][4].lamp, mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][5].film, mData[0][4].film, mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][5].gadget, mData[0][4].gadget, mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][5].power_bank, mData[0][4].power_bank, mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][5]['small_talk_bluetooth'], mData[0][4]['small_talk_bluetooth'], mData[0][3]['small_talk_bluetooth'], mData[0][2]['small_talk_bluetooth'], mData[0][1]['small_talk_bluetooth'], mData[0][0]['small_talk_bluetooth']],

					['Speaker', mData[0][5].speaker, mData[0][4].speaker, mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][5]['storage_memory_card'], mData[0][4]['storage_memory_card'], mData[0][3]['storage_memory_card'], mData[0][2]['storage_memory_card'], mData[0][1]['storage_memory_card'], mData[0][0]['storage_memory_card']],

					['Zhuaimao', mData[0][5].zhuaimao, mData[0][4].zhuaimao, mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][5].cancel, mData[0][4].cancel, mData[0][3].cancel, mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][5].other, mData[0][4].other, mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 6) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[0][6].adapter, mData[0][5].adapter, mData[0][4].adapter, mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][6].bag, mData[0][5].bag, mData[0][4].bag, mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][6].cable, mData[0][5].cable, mData[0][4].cable, mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][6].car_gadget, mData[0][5].car_gadget, mData[0][4].car_gadget, mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][6].case_for_smartphone, mData[0][5].case_for_smartphone, mData[0][4].case_for_smartphone, mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][6].case_for_tablet, mData[0][5].case_for_tablet, mData[0][4].case_for_tablet, mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][6].clearance, mData[0][5].clearance, mData[0][4].clearance, mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][6].creative, mData[0][5].creative, mData[0][4].creative, mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][6].gaming, mData[0][5].gaming, mData[0][4].gaming, mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][6].home_gadget, mData[0][5].home_gadget, mData[0][4].home_gadget, mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][6].lamp, mData[0][5].lamp, mData[0][4].lamp, mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][6].film, mData[0][5].film, mData[0][4].film, mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][6].gadget, mData[0][5].gadget, mData[0][4].gadget, mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][6].power_bank, mData[0][5].power_bank, mData[0][4].power_bank, mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][6]['small_talk_bluetooth'], mData[0][5]['small_talk_bluetooth'], mData[0][4]['small_talk_bluetooth'], mData[0][3]['small_talk_bluetooth'], mData[0][2]['small_talk_bluetooth'], mData[0][1]['small_talk_bluetooth'], mData[0][0]['small_talk_bluetooth']],

					['Speaker', mData[0][6].speaker, mData[0][5].speaker, mData[0][4].speaker, mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][6]['storage_memory_card'], mData[0][5]['storage_memory_card'], mData[0][4]['storage_memory_card'], mData[0][3]['storage_memory_card'], mData[0][2]['storage_memory_card'], mData[0][1]['storage_memory_card'], mData[0][0]['storage_memory_card']],

					['Zhuaimao', mData[0][6].zhuaimao, mData[0][5].zhuaimao, mData[0][4].zhuaimao, mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][6].cancel, mData[0][5].cancel, mData[0][4].cancel, mData[0][3].cancel, mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][6].other, mData[0][5].other, mData[0][4].other, mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 7) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[0][7].adapter, mData[0][6].adapter, mData[0][5].adapter, mData[0][4].adapter, mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][7].bag, mData[0][6].bag, mData[0][5].bag, mData[0][4].bag, mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][7].cable, mData[0][6].cable, mData[0][5].cable, mData[0][4].cable, mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][7].car_gadget, mData[0][6].car_gadget, mData[0][5].car_gadget, mData[0][4].car_gadget, mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][7].case_for_smartphone, mData[0][6].case_for_smartphone, mData[0][5].case_for_smartphone, mData[0][4].case_for_smartphone, mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][7].case_for_tablet, mData[0][6].case_for_tablet, mData[0][5].case_for_tablet, mData[0][4].case_for_tablet, mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][7].clearance, mData[0][6].clearance, mData[0][5].clearance, mData[0][4].clearance, mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][7].creative, mData[0][6].creative, mData[0][5].creative, mData[0][4].creative, mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][7].gaming, mData[0][6].gaming, mData[0][5].gaming, mData[0][4].gaming, mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][7].home_gadget, mData[0][6].home_gadget, mData[0][5].home_gadget, mData[0][4].home_gadget, mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][7].lamp, mData[0][6].lamp, mData[0][5].lamp, mData[0][4].lamp, mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][7].film, mData[0][6].film, mData[0][5].film, mData[0][4].film, mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][7].gadget, mData[0][6].gadget, mData[0][5].gadget, mData[0][4].gadget, mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][7].power_bank, mData[0][6].power_bank, mData[0][5].power_bank, mData[0][4].power_bank, mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][7]['small_talk_bluetooth'], mData[0][6]['small_talk_bluetooth'], mData[0][5]['small_talk_bluetooth'], mData[0][4]['small_talk_bluetooth'], mData[0][3]['small_talk_bluetooth'], mData[0][2]['small_talk_bluetooth'], mData[0][1]['small_talk_bluetooth'], mData[0][0]['small_talk_bluetooth']],

					['Speaker', mData[0][7].speaker, mData[0][6].speaker, mData[0][5].speaker, mData[0][4].speaker, mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][7]['storage_memory_card'], mData[0][6]['storage_memory_card'], mData[0][5]['storage_memory_card'], mData[0][4]['storage_memory_card'], mData[0][3]['storage_memory_card'], mData[0][2]['storage_memory_card'], mData[0][1]['storage_memory_card'], mData[0][0]['storage_memory_card']],

					['Zhuaimao', mData[0][7].zhuaimao, mData[0][6].zhuaimao, mData[0][5].zhuaimao, mData[0][4].zhuaimao, mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][7].cancel, mData[0][6].cancel, mData[0][5].cancel, mData[0][4].cancel, mData[0][3].cancel, mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][7].other, mData[0][6].other, mData[0][5].other, mData[0][4].other, mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 8) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[0][8].adapter, mData[0][7].adapter, mData[0][6].adapter, mData[0][5].adapter, mData[0][4].adapter, mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][8].bag, mData[0][7].bag, mData[0][6].bag, mData[0][5].bag, mData[0][4].bag, mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][8].cable, mData[0][7].cable, mData[0][6].cable, mData[0][5].cable, mData[0][4].cable, mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][8].car_gadget, mData[0][7].car_gadget, mData[0][6].car_gadget, mData[0][5].car_gadget, mData[0][4].car_gadget, mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][8].case_for_smartphone, mData[0][7].case_for_smartphone, mData[0][6].case_for_smartphone, mData[0][5].case_for_smartphone, mData[0][4].case_for_smartphone, mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][8].case_for_tablet, mData[0][7].case_for_tablet, mData[0][6].case_for_tablet, mData[0][5].case_for_tablet, mData[0][4].case_for_tablet, mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][8].clearance, mData[0][7].clearance, mData[0][6].clearance, mData[0][5].clearance, mData[0][4].clearance, mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][8].creative, mData[0][7].creative, mData[0][6].creative, mData[0][5].creative, mData[0][4].creative, mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][8].gaming, mData[0][7].gaming, mData[0][6].gaming, mData[0][5].gaming, mData[0][4].gaming, mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][8].home_gadget, mData[0][7].home_gadget, mData[0][6].home_gadget, mData[0][5].home_gadget, mData[0][4].home_gadget, mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][8].lamp, mData[0][7].lamp, mData[0][6].lamp, mData[0][5].lamp, mData[0][4].lamp, mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][8].film, mData[0][7].film, mData[0][6].film, mData[0][5].film, mData[0][4].film, mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][8].gadget, mData[0][7].gadget, mData[0][6].gadget, mData[0][5].gadget, mData[0][4].gadget, mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][8].power_bank, mData[0][7].power_bank, mData[0][6].power_bank, mData[0][5].power_bank, mData[0][4].power_bank, mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][8]['small_talk_bluetooth'], mData[0][7]['small_talk_bluetooth'], mData[0][6]['small_talk_bluetooth'], mData[0][5]['small_talk_bluetooth'], mData[0][4]['small_talk_bluetooth'], mData[0][3]['small_talk_bluetooth'], mData[0][2]['small_talk_bluetooth'], mData[0][1]['small_talk_bluetooth'], mData[0][0]['small_talk_bluetooth']],

					['Speaker', mData[0][8].speaker, mData[0][7].speaker, mData[0][6].speaker, mData[0][5].speaker, mData[0][4].speaker, mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][8]['storage_memory_card'], mData[0][7]['storage_memory_card'], mData[0][6]['storage_memory_card'], mData[0][5]['storage_memory_card'], mData[0][4]['storage_memory_card'], mData[0][3]['storage_memory_card'], mData[0][2]['storage_memory_card'], mData[0][1]['storage_memory_card'], mData[0][0]['storage_memory_card']],

					['Zhuaimao', mData[0][8].zhuaimao, mData[0][7].zhuaimao, mData[0][6].zhuaimao, mData[0][5].zhuaimao, mData[0][4].zhuaimao, mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][8].cancel, mData[0][7].cancel, mData[0][6].cancel, mData[0][5].cancel, mData[0][4].cancel, mData[0][3].cancel, mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][8].other, mData[0][7].other, mData[0][6].other, mData[0][5].other, mData[0][4].other, mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 9) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[0][9].adapter, mData[0][8].adapter, mData[0][7].adapter, mData[0][6].adapter, mData[0][5].adapter, mData[0][4].adapter, mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][9].bag, mData[0][8].bag, mData[0][7].bag, mData[0][6].bag, mData[0][5].bag, mData[0][4].bag, mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][9].cable, mData[0][8].cable, mData[0][7].cable, mData[0][6].cable, mData[0][5].cable, mData[0][4].cable, mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][9].car_gadget, mData[0][8].car_gadget, mData[0][7].car_gadget, mData[0][6].car_gadget, mData[0][5].car_gadget, mData[0][4].car_gadget, mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][9].case_for_smartphone, mData[0][8].case_for_smartphone, mData[0][7].case_for_smartphone, mData[0][6].case_for_smartphone, mData[0][5].case_for_smartphone, mData[0][4].case_for_smartphone, mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][9].case_for_tablet, mData[0][8].case_for_tablet, mData[0][7].case_for_tablet, mData[0][6].case_for_tablet, mData[0][5].case_for_tablet, mData[0][4].case_for_tablet, mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][9].clearance, mData[0][8].clearance, mData[0][7].clearance, mData[0][6].clearance, mData[0][5].clearance, mData[0][4].clearance, mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][9].creative, mData[0][8].creative, mData[0][7].creative, mData[0][6].creative, mData[0][5].creative, mData[0][4].creative, mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][9].gaming, mData[0][8].gaming, mData[0][7].gaming, mData[0][6].gaming, mData[0][5].gaming, mData[0][4].gaming, mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][9].home_gadget, mData[0][8].home_gadget, mData[0][7].home_gadget, mData[0][6].home_gadget, mData[0][5].home_gadget, mData[0][4].home_gadget, mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][9].lamp, mData[0][8].lamp, mData[0][7].lamp, mData[0][6].lamp, mData[0][5].lamp, mData[0][4].lamp, mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][9].film, mData[0][8].film, mData[0][7].film, mData[0][6].film, mData[0][5].film, mData[0][4].film, mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][9].gadget, mData[0][8].gadget, mData[0][7].gadget, mData[0][6].gadget, mData[0][5].gadget, mData[0][4].gadget, mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][9].power_bank, mData[0][8].power_bank, mData[0][7].power_bank, mData[0][6].power_bank, mData[0][5].power_bank, mData[0][4].power_bank, mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][9]['small_talk_bluetooth'], mData[0][8]['small_talk_bluetooth'], mData[0][7]['small_talk_bluetooth'], mData[0][6]['small_talk_bluetooth'], mData[0][5]['small_talk_bluetooth'], mData[0][4]['small_talk_bluetooth'], mData[0][3]['small_talk_bluetooth'], mData[0][2]['small_talk_bluetooth'], mData[0][1]['small_talk_bluetooth'], mData[0][0]['small_talk_bluetooth']],

					['Speaker', mData[0][9].speaker, mData[0][8].speaker, mData[0][7].speaker, mData[0][6].speaker, mData[0][5].speaker, mData[0][4].speaker, mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][9]['storage_memory_card'], mData[0][8]['storage_memory_card'], mData[0][7]['storage_memory_card'], mData[0][6]['storage_memory_card'], mData[0][5]['storage_memory_card'], mData[0][4]['storage_memory_card'], mData[0][3]['storage_memory_card'], mData[0][2]['storage_memory_card'], mData[0][1]['storage_memory_card'], mData[0][0]['storage_memory_card']],

					['Zhuaimao', mData[0][9].zhuaimao, mData[0][8].zhuaimao, mData[0][7].zhuaimao, mData[0][6].zhuaimao, mData[0][5].zhuaimao, mData[0][4].zhuaimao, mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][9].cancel, mData[0][8].cancel, mData[0][7].cancel, mData[0][6].cancel, mData[0][5].cancel, mData[0][4].cancel, mData[0][3].cancel, mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][9].other, mData[0][8].other, mData[0][7].other, mData[0][6].other, mData[0][5].other, mData[0][4].other, mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 10) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth10, mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[0][10].adapter, mData[0][9].adapter, mData[0][8].adapter, mData[0][7].adapter, mData[0][6].adapter, mData[0][5].adapter, mData[0][4].adapter, mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][10].bag, mData[0][9].bag, mData[0][8].bag, mData[0][7].bag, mData[0][6].bag, mData[0][5].bag, mData[0][4].bag, mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][10].cable, mData[0][9].cable, mData[0][8].cable, mData[0][7].cable, mData[0][6].cable, mData[0][5].cable, mData[0][4].cable, mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][10].car_gadget, mData[0][9].car_gadget, mData[0][8].car_gadget, mData[0][7].car_gadget, mData[0][6].car_gadget, mData[0][5].car_gadget, mData[0][4].car_gadget, mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][10].case_for_smartphone, mData[0][9].case_for_smartphone, mData[0][8].case_for_smartphone, mData[0][7].case_for_smartphone, mData[0][6].case_for_smartphone, mData[0][5].case_for_smartphone, mData[0][4].case_for_smartphone, mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][10].case_for_tablet, mData[0][9].case_for_tablet, mData[0][8].case_for_tablet, mData[0][7].case_for_tablet, mData[0][6].case_for_tablet, mData[0][5].case_for_tablet, mData[0][4].case_for_tablet, mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][10].clearance, mData[0][9].clearance, mData[0][8].clearance, mData[0][7].clearance, mData[0][6].clearance, mData[0][5].clearance, mData[0][4].clearance, mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][10].creative, mData[0][9].creative, mData[0][8].creative, mData[0][7].creative, mData[0][6].creative, mData[0][5].creative, mData[0][4].creative, mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][10].gaming, mData[0][9].gaming, mData[0][8].gaming, mData[0][7].gaming, mData[0][6].gaming, mData[0][5].gaming, mData[0][4].gaming, mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][10].home_gadget,  mData[0][9].home_gadget, mData[0][8].home_gadget, mData[0][7].home_gadget, mData[0][6].home_gadget, mData[0][5].home_gadget, mData[0][4].home_gadget, mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][10].lamp, mData[0][9].lamp, mData[0][8].lamp, mData[0][7].lamp, mData[0][6].lamp, mData[0][5].lamp, mData[0][4].lamp, mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][10].film, mData[0][9].film, mData[0][8].film, mData[0][7].film, mData[0][6].film, mData[0][5].film, mData[0][4].film, mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][10].gadget, mData[0][9].gadget, mData[0][8].gadget, mData[0][7].gadget, mData[0][6].gadget, mData[0][5].gadget, mData[0][4].gadget, mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][10].power_bank, mData[0][9].power_bank, mData[0][8].power_bank, mData[0][7].power_bank, mData[0][6].power_bank, mData[0][5].power_bank, mData[0][4].power_bank, mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][10]['small_talk_bluetooth'], mData[0][9]['small_talk_bluetooth'], mData[0][8]['small_talk_bluetooth'], mData[0][7]['small_talk_bluetooth'], mData[0][6]['small_talk_bluetooth'], mData[0][5]['small_talk_bluetooth'], mData[0][4]['small_talk_bluetooth'], mData[0][3]['small_talk_bluetooth'], mData[0][2]['small_talk_bluetooth'], mData[0][1]['small_talk_bluetooth'], mData[0][0]['small_talk_bluetooth']],

					['Speaker', mData[0][10].speaker, mData[0][9].speaker, mData[0][8].speaker, mData[0][7].speaker, mData[0][6].speaker, mData[0][5].speaker, mData[0][4].speaker, mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][10]['storage_memory_card'], mData[0][9]['storage_memory_card'], mData[0][8]['storage_memory_card'], mData[0][7]['storage_memory_card'], mData[0][6]['storage_memory_card'], mData[0][5]['storage_memory_card'], mData[0][4]['storage_memory_card'], mData[0][3]['storage_memory_card'], mData[0][2]['storage_memory_card'], mData[0][1]['storage_memory_card'], mData[0][0]['storage_memory_card']],

					['Zhuaimao', mData[0][10].zhuaimao, mData[0][9].zhuaimao, mData[0][8].zhuaimao, mData[0][7].zhuaimao, mData[0][6].zhuaimao, mData[0][5].zhuaimao, mData[0][4].zhuaimao, mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][10].cancel,mData[0][9].cancel,mData[0][8].cancel,mData[0][7].cancel,mData[0][6].cancel,mData[0][5].cancel,mData[0][4].cancel,mData[0][3].cancel,mData[0][2].cancel,mData[0][1].cancel,mData[0][0].cancel],

					['Other', mData[0][10].other, mData[0][9].other, mData[0][8].other, mData[0][7].other, mData[0][6].other, mData[0][5].other, mData[0][4].other, mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 11) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth11, mth10, mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[0][11].adapter, mData[0][10].adapter, mData[0][9].adapter, mData[0][8].adapter, mData[0][7].adapter, mData[0][6].adapter, mData[0][5].adapter, mData[0][4].adapter, mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][11].bag, mData[0][10].bag, mData[0][9].bag, mData[0][8].bag, mData[0][7].bag, mData[0][6].bag, mData[0][5].bag, mData[0][4].bag, mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][11].cable, mData[0][10].cable, mData[0][9].cable, mData[0][8].cable, mData[0][7].cable, mData[0][6].cable, mData[0][5].cable, mData[0][4].cable, mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][11].car_gadget, mData[0][10].car_gadget, mData[0][9].car_gadget, mData[0][8].car_gadget, mData[0][7].car_gadget, mData[0][6].car_gadget, mData[0][5].car_gadget, mData[0][4].car_gadget, mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][11].case_for_smartphone, mData[0][10].case_for_smartphone, mData[0][9].case_for_smartphone, mData[0][8].case_for_smartphone, mData[0][7].case_for_smartphone, mData[0][6].case_for_smartphone, mData[0][5].case_for_smartphone, mData[0][4].case_for_smartphone, mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][11].case_for_tablet, mData[0][10].case_for_tablet, mData[0][9].case_for_tablet, mData[0][8].case_for_tablet, mData[0][7].case_for_tablet, mData[0][6].case_for_tablet, mData[0][5].case_for_tablet, mData[0][4].case_for_tablet, mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][11].clearance, mData[0][10].clearance, mData[0][9].clearance, mData[0][8].clearance, mData[0][7].clearance, mData[0][6].clearance, mData[0][5].clearance, mData[0][4].clearance, mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][11].creative, mData[0][10].creative, mData[0][9].creative, mData[0][8].creative, mData[0][7].creative, mData[0][6].creative, mData[0][5].creative, mData[0][4].creative, mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][11].gaming, mData[0][10].gaming, mData[0][9].gaming, mData[0][8].gaming, mData[0][7].gaming, mData[0][6].gaming, mData[0][5].gaming, mData[0][4].gaming, mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][11].home_gadget, mData[0][10].home_gadget,  mData[0][9].home_gadget, mData[0][8].home_gadget, mData[0][7].home_gadget, mData[0][6].home_gadget, mData[0][5].home_gadget, mData[0][4].home_gadget, mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][11].lamp, mData[0][10].lamp, mData[0][9].lamp, mData[0][8].lamp, mData[0][7].lamp, mData[0][6].lamp, mData[0][5].lamp, mData[0][4].lamp, mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][11].film, mData[0][10].film, mData[0][9].film, mData[0][8].film, mData[0][7].film, mData[0][6].film, mData[0][5].film, mData[0][4].film, mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][11].gadget, mData[0][10].gadget, mData[0][9].gadget, mData[0][8].gadget, mData[0][7].gadget, mData[0][6].gadget, mData[0][5].gadget, mData[0][4].gadget, mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][11].power_bank, mData[0][10].power_bank, mData[0][9].power_bank, mData[0][8].power_bank, mData[0][7].power_bank, mData[0][6].power_bank, mData[0][5].power_bank, mData[0][4].power_bank, mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][11]['small_talk_bluetooth'], mData[0][10]['small_talk_bluetooth'], mData[0][9]['small_talk_bluetooth'], mData[0][8]['small_talk_bluetooth'], mData[0][7]['small_talk_bluetooth'], mData[0][6]['small_talk_bluetooth'], mData[0][5]['small_talk_bluetooth'], mData[0][4]['small_talk_bluetooth'], mData[0][3]['small_talk_bluetooth'], mData[0][2]['small_talk_bluetooth'], mData[0][1]['small_talk_bluetooth'], mData[0][0]['small_talk_bluetooth']],

					['Speaker', mData[0][11].speaker, mData[0][10].speaker, mData[0][9].speaker, mData[0][8].speaker, mData[0][7].speaker, mData[0][6].speaker, mData[0][5].speaker, mData[0][4].speaker, mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][11]['storage_memory_card'], mData[0][10]['storage_memory_card'], mData[0][9]['storage_memory_card'], mData[0][8]['storage_memory_card'], mData[0][7]['storage_memory_card'], mData[0][6]['storage_memory_card'], mData[0][5]['storage_memory_card'], mData[0][4]['storage_memory_card'], mData[0][3]['storage_memory_card'], mData[0][2]['storage_memory_card'], mData[0][1]['storage_memory_card'], mData[0][0]['storage_memory_card']],

					['Zhuaimao', mData[0][11].zhuaimao, mData[0][10].zhuaimao, mData[0][9].zhuaimao, mData[0][8].zhuaimao, mData[0][7].zhuaimao, mData[0][6].zhuaimao, mData[0][5].zhuaimao, mData[0][4].zhuaimao, mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][11].cancel, mData[0][10].cancel, mData[0][9].cancel, mData[0][8].cancel, mData[0][7].cancel, mData[0][6].cancel, mData[0][5].cancel, mData[0][4].cancel, mData[0][3].cancel, mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][11].other, mData[0][10].other, mData[0][9].other, mData[0][8].other, mData[0][7].other, mData[0][6].other, mData[0][5].other, mData[0][4].other, mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 12) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth12, mth11, mth10, mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[0][12].adapter, mData[0][11].adapter, mData[0][10].adapter, mData[0][9].adapter, mData[0][8].adapter, mData[0][7].adapter, mData[0][6].adapter, mData[0][5].adapter, mData[0][4].adapter, mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][12].bag, mData[0][11].bag, mData[0][10].bag, mData[0][9].bag, mData[0][8].bag, mData[0][7].bag, mData[0][6].bag, mData[0][5].bag, mData[0][4].bag, mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][12].cable, mData[0][11].cable, mData[0][10].cable, mData[0][9].cable, mData[0][8].cable, mData[0][7].cable, mData[0][6].cable, mData[0][5].cable, mData[0][4].cable, mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][12].car_gadget, mData[0][11].car_gadget, mData[0][10].car_gadget, mData[0][9].car_gadget, mData[0][8].car_gadget, mData[0][7].car_gadget, mData[0][6].car_gadget, mData[0][5].car_gadget, mData[0][4].car_gadget, mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][12].case_for_smartphone, mData[0][11].case_for_smartphone, mData[0][10].case_for_smartphone, mData[0][9].case_for_smartphone, mData[0][8].case_for_smartphone, mData[0][7].case_for_smartphone, mData[0][6].case_for_smartphone, mData[0][5].case_for_smartphone, mData[0][4].case_for_smartphone, mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][12].case_for_tablet, mData[0][11].case_for_tablet, mData[0][10].case_for_tablet, mData[0][9].case_for_tablet, mData[0][8].case_for_tablet, mData[0][7].case_for_tablet, mData[0][6].case_for_tablet, mData[0][5].case_for_tablet, mData[0][4].case_for_tablet, mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][12].clearance, mData[0][11].clearance, mData[0][10].clearance, mData[0][9].clearance, mData[0][8].clearance, mData[0][7].clearance, mData[0][6].clearance, mData[0][5].clearance, mData[0][4].clearance, mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][12].creative, mData[0][11].creative, mData[0][10].creative, mData[0][9].creative, mData[0][8].creative, mData[0][7].creative, mData[0][6].creative, mData[0][5].creative, mData[0][4].creative, mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][12].gaming, mData[0][11].gaming, mData[0][10].gaming, mData[0][9].gaming, mData[0][8].gaming, mData[0][7].gaming, mData[0][6].gaming, mData[0][5].gaming, mData[0][4].gaming, mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][12].home_gadget, mData[0][11].home_gadget, mData[0][10].home_gadget,  mData[0][9].home_gadget, mData[0][8].home_gadget, mData[0][7].home_gadget, mData[0][6].home_gadget, mData[0][5].home_gadget, mData[0][4].home_gadget, mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][12].lamp, mData[0][11].lamp, mData[0][10].lamp, mData[0][9].lamp, mData[0][8].lamp, mData[0][7].lamp, mData[0][6].lamp, mData[0][5].lamp, mData[0][4].lamp, mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][12].film, mData[0][11].film, mData[0][10].film, mData[0][9].film, mData[0][8].film, mData[0][7].film, mData[0][6].film, mData[0][5].film, mData[0][4].film, mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][12].gadget, mData[0][11].gadget, mData[0][10].gadget, mData[0][9].gadget, mData[0][8].gadget, mData[0][7].gadget, mData[0][6].gadget, mData[0][5].gadget, mData[0][4].gadget, mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][12].power_bank, mData[0][11].power_bank, mData[0][10].power_bank, mData[0][9].power_bank, mData[0][8].power_bank, mData[0][7].power_bank, mData[0][6].power_bank, mData[0][5].power_bank, mData[0][4].power_bank, mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][12]['small_talk_bluetooth'], mData[0][11]['small_talk_bluetooth'], mData[0][10]['small_talk_bluetooth'], mData[0][8]['small_talk_bluetooth'], mData[0][7]['small_talk_bluetooth'], mData[0][6]['small_talk_bluetooth'], mData[0][6]['small_talk_bluetooth'], mData[0][5]['small_talk_bluetooth'], mData[0][4]['small_talk_bluetooth'], mData[0][3]['small_talk_bluetooth'], mData[0][2]['small_talk_bluetooth'], mData[0][1]['small_talk_bluetooth'], mData[0][0]['small_talk_bluetooth']],

					['Speaker', mData[0][12].speaker, mData[0][11].speaker, mData[0][10].speaker, mData[0][9].speaker, mData[0][8].speaker, mData[0][7].speaker, mData[0][6].speaker, mData[0][5].speaker, mData[0][4].speaker, mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][12]['storage_memory_card'], mData[0][11]['storage_memory_card'], mData[0][10]['storage_memory_card'], mData[0][9]['storage_memory_card'], mData[0][8]['storage_memory_card'], mData[0][7]['storage_memory_card'], mData[0][6]['storage_memory_card'], mData[0][5]['storage_memory_card'], mData[0][4]['storage_memory_card'], mData[0][3]['storage_memory_card'], mData[0][2]['storage_memory_card'], mData[0][1]['storage_memory_card'], mData[0][0]['storage_memory_card']],

					['Zhuaimao', mData[0][12].zhuaimao, mData[0][11].zhuaimao, mData[0][10].zhuaimao, mData[0][9].zhuaimao, mData[0][8].zhuaimao, mData[0][7].zhuaimao, mData[0][6].zhuaimao, mData[0][5].zhuaimao, mData[0][4].zhuaimao, mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][12].cancel, mData[0][11].cancel, mData[0][10].cancel, mData[0][9].cancel, mData[0][8].cancel, mData[0][7].cancel, mData[0][6].cancel, mData[0][5].cancel, mData[0][4].cancel, mData[0][3].cancel, mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][12].other, mData[0][11].other, mData[0][10].other, mData[0][9].other, mData[0][8].other, mData[0][7].other, mData[0][6].other, mData[0][5].other, mData[0][4].other, mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			}
		} else if ($('#selectType').val() == 'type-qty') {
			lblType = 'Quantity';
			if ($('#selectPrevious').val() == 0) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth0],
					['Adapter', mData[1][0].adapter],
					['Bag', mData[1][0].bag],
					['Cable', mData[1][0].cable],
					['Car Gadget', mData[1][0].car_gadget],
					['Case For Smartphone', mData[1][0].case_for_smartphone],
					['Case For Tablet', mData[1][0].case_for_tablet],
					['Clearance', mData[1][0].clearance],
					['Gadget Creative', mData[1][0].creative],
					['Gaming', mData[1][0].gaming],
					['Home Gadget',mData[1][0].home_gadget],
					['Lamp', mData[1][0].lamp],
					['Film', mData[1][0].film],
					['Smart life', mData[1][0].gadget],
					['Power Bank', mData[1][0].power_bank],
					['Small Talk Bluetooth', mData[1][0]['small_talk_bluetooth']],
					['Speaker', mData[1][0].speaker],
					['Storage Memory Card', mData[1][0]['storage_memory_card']],
					['Zhuaimao', mData[1][0].zhuaimao],
					['ยกเลิกใช้งาน', mData[1][0].cancel],
					['Other', mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 1) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth1, mth0],

					['Adapter', mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][1]['small_talk_bluetooth'], mData[1][0]['small_talk_bluetooth']],

					['Speaker', mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][1]['storage_memory_card'], mData[1][0]['storage_memory_card']],

					['Zhuaimao', mData[1][1].zhuaimao,mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 2) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth2, mth1, mth0],

					['Adapter', mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][2]['small_talk_bluetooth'], mData[1][1]['small_talk_bluetooth'], mData[1][0]['small_talk_bluetooth']],

					['Speaker', mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][2]['storage_memory_card'], mData[1][1]['storage_memory_card'], mData[1][0]['storage_memory_card']],

					['Zhuaimao', mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 3) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth3, mth2, mth1, mth0],

					['Adapter', mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][3].car_gadget, mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][3]['small_talk_bluetooth'], mData[1][2]['small_talk_bluetooth'], mData[1][1]['small_talk_bluetooth'], mData[1][0]['small_talk_bluetooth']],

					['Speaker', mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][3]['storage_memory_card'], mData[1][2]['storage_memory_card'], mData[1][1]['storage_memory_card'], mData[1][0]['storage_memory_card']],

					['Zhuaimao', mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][3].cancel,mData[1][2].cancel,mData[1][1].cancel,mData[1][0].cancel],

					['Other', mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 4) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[1][4].adapter, mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][4].bag, mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][4].cable, mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][4].car_gadget, mData[1][3].car_gadget, mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][4].case_for_smartphone, mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][4].case_for_tablet, mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][4].clearance, mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][4].creative, mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][4].gaming, mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][4].home_gadget, mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][4].lamp, mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][4].film, mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][4].gadget, mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][4].power_bank, mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][4]['small_talk_bluetooth'], mData[1][3]['small_talk_bluetooth'], mData[1][2]['small_talk_bluetooth'], mData[1][1]['small_talk_bluetooth'], mData[1][0]['small_talk_bluetooth']],

					['Speaker', mData[1][4].speaker, mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][4]['storage_memory_card'], mData[1][3]['storage_memory_card'], mData[1][2]['storage_memory_card'], mData[1][1]['storage_memory_card'], mData[1][0]['storage_memory_card']],

					['Zhuaimao', mData[1][4].zhuaimao, mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][4].cancel, mData[1][3].cancel, mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][4].other, mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 5) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[1][5].adapter, mData[1][4].adapter, mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][5].bag, mData[1][4].bag, mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][5].cable, mData[1][4].cable, mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][5].car_gadget, mData[1][4].car_gadget, mData[1][3].car_gadget, mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][5].case_for_smartphone, mData[1][4].case_for_smartphone, mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][5].case_for_tablet, mData[1][4].case_for_tablet, mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][5].clearance, mData[1][4].clearance, mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][5].creative, mData[1][4].creative, mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][5].gaming, mData[1][4].gaming, mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][5].home_gadget, mData[1][4].home_gadget, mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][5].lamp, mData[1][4].lamp, mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][5].film, mData[1][4].film, mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][5].gadget, mData[1][4].gadget, mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][5].power_bank, mData[1][4].power_bank, mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][5]['small_talk_bluetooth'], mData[1][4]['small_talk_bluetooth'], mData[1][3]['small_talk_bluetooth'], mData[1][2]['small_talk_bluetooth'], mData[1][1]['small_talk_bluetooth'], mData[1][0]['small_talk_bluetooth']],

					['Speaker', mData[1][5].speaker, mData[1][4].speaker, mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][5]['storage_memory_card'], mData[1][4]['storage_memory_card'], mData[1][3]['storage_memory_card'], mData[1][2]['storage_memory_card'], mData[1][1]['storage_memory_card'], mData[1][0]['storage_memory_card']],

					['Zhuaimao', mData[1][5].zhuaimao, mData[1][4].zhuaimao, mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][5].cancel, mData[1][4].cancel, mData[1][3].cancel, mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][5].other, mData[1][4].other, mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 6) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[1][6].adapter, mData[1][5].adapter, mData[1][4].adapter, mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][6].bag, mData[1][5].bag, mData[1][4].bag, mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][6].cable, mData[1][5].cable, mData[1][4].cable, mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][6].car_gadget, mData[1][5].car_gadget, mData[1][4].car_gadget, mData[1][3].car_gadget, mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][6].case_for_smartphone, mData[1][5].case_for_smartphone, mData[1][4].case_for_smartphone, mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][6].case_for_tablet, mData[1][5].case_for_tablet, mData[1][4].case_for_tablet, mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][6].clearance, mData[1][5].clearance, mData[1][4].clearance, mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][6].creative, mData[1][5].creative, mData[1][4].creative, mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][6].gaming, mData[1][5].gaming, mData[1][4].gaming, mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][6].home_gadget, mData[1][5].home_gadget, mData[1][4].home_gadget, mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][6].lamp, mData[1][5].lamp, mData[1][4].lamp, mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][6].film, mData[1][5].film, mData[1][4].film, mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][6].gadget, mData[1][5].gadget, mData[1][4].gadget, mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][6].power_bank, mData[1][5].power_bank, mData[1][4].power_bank, mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][6]['small_talk_bluetooth'], mData[1][5]['small_talk_bluetooth'], mData[1][4]['small_talk_bluetooth'], mData[1][3]['small_talk_bluetooth'], mData[1][2]['small_talk_bluetooth'], mData[1][1]['small_talk_bluetooth'], mData[1][0]['small_talk_bluetooth']],

					['Speaker', mData[1][6].speaker, mData[1][5].speaker, mData[1][4].speaker, mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][6]['storage_memory_card'], mData[1][5]['storage_memory_card'], mData[1][4]['storage_memory_card'], mData[1][3]['storage_memory_card'], mData[1][2]['storage_memory_card'], mData[1][1]['storage_memory_card'], mData[1][0]['storage_memory_card']],

					['Zhuaimao', mData[1][6].zhuaimao, mData[1][5].zhuaimao, mData[1][4].zhuaimao, mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][6].cancel, mData[1][5].cancel, mData[1][4].cancel, mData[1][3].cancel, mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][6].other, mData[1][5].other, mData[1][4].other, mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 7) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[1][7].adapter, mData[1][6].adapter, mData[1][5].adapter, mData[1][4].adapter, mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][7].bag, mData[1][6].bag, mData[1][5].bag, mData[1][4].bag, mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][7].cable, mData[1][6].cable, mData[1][5].cable, mData[1][4].cable, mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][7].car_gadget, mData[1][6].car_gadget, mData[1][5].car_gadget, mData[1][4].car_gadget, mData[1][3].car_gadget, mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][7].case_for_smartphone, mData[1][6].case_for_smartphone, mData[1][5].case_for_smartphone, mData[1][4].case_for_smartphone, mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][7].case_for_tablet, mData[1][6].case_for_tablet, mData[1][5].case_for_tablet, mData[1][4].case_for_tablet, mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][7].clearance, mData[1][6].clearance, mData[1][5].clearance, mData[1][4].clearance, mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][7].creative, mData[1][6].creative, mData[1][5].creative, mData[1][4].creative, mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][7].gaming, mData[1][6].gaming, mData[1][5].gaming, mData[1][4].gaming, mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][7].home_gadget, mData[1][6].home_gadget, mData[1][5].home_gadget, mData[1][4].home_gadget, mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][7].lamp, mData[1][6].lamp, mData[1][5].lamp, mData[1][4].lamp, mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][7].film, mData[1][6].film, mData[1][5].film, mData[1][4].film, mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][7].gadget, mData[1][6].gadget, mData[1][5].gadget, mData[1][4].gadget, mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][7].power_bank, mData[1][6].power_bank, mData[1][5].power_bank, mData[1][4].power_bank, mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][7]['small_talk_bluetooth'], mData[1][6]['small_talk_bluetooth'], mData[1][5]['small_talk_bluetooth'], mData[1][4]['small_talk_bluetooth'], mData[1][3]['small_talk_bluetooth'], mData[1][2]['small_talk_bluetooth'], mData[1][1]['small_talk_bluetooth'], mData[1][0]['small_talk_bluetooth']],

					['Speaker', mData[1][7].speaker, mData[1][6].speaker, mData[1][5].speaker, mData[1][4].speaker, mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][7]['storage_memory_card'], mData[1][6]['storage_memory_card'], mData[1][5]['storage_memory_card'], mData[1][4]['storage_memory_card'], mData[1][3]['storage_memory_card'], mData[1][2]['storage_memory_card'], mData[1][1]['storage_memory_card'], mData[1][0]['storage_memory_card']],

					['Zhuaimao', mData[1][7].zhuaimao, mData[1][6].zhuaimao, mData[1][5].zhuaimao, mData[1][4].zhuaimao, mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][7].cancel, mData[1][6].cancel, mData[1][5].cancel, mData[1][4].cancel, mData[1][3].cancel, mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][7].other, mData[1][6].other, mData[1][5].other, mData[1][4].other, mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 8) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[1][8].adapter, mData[1][7].adapter, mData[1][6].adapter, mData[1][5].adapter, mData[1][4].adapter, mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][8].bag, mData[1][7].bag, mData[1][6].bag, mData[1][5].bag, mData[1][4].bag, mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][8].cable, mData[1][7].cable, mData[1][6].cable, mData[1][5].cable, mData[1][4].cable, mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][8].car_gadget,mData[1][7].car_gadget,mData[1][6].car_gadget,mData[1][5].car_gadget,mData[1][4].car_gadget,mData[1][3].car_gadget,mData[1][2].car_gadget,mData[1][1].car_gadget,mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][8].case_for_smartphone, mData[1][7].case_for_smartphone, mData[1][6].case_for_smartphone, mData[1][5].case_for_smartphone, mData[1][4].case_for_smartphone, mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][8].case_for_tablet, mData[1][7].case_for_tablet, mData[1][6].case_for_tablet, mData[1][5].case_for_tablet, mData[1][4].case_for_tablet, mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][8].clearance, mData[1][7].clearance, mData[1][6].clearance, mData[1][5].clearance, mData[1][4].clearance, mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][8].creative, mData[1][7].creative, mData[1][6].creative, mData[1][5].creative, mData[1][4].creative, mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][8].gaming, mData[1][7].gaming, mData[1][6].gaming, mData[1][5].gaming, mData[1][4].gaming, mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][8].home_gadget, mData[1][7].home_gadget, mData[1][6].home_gadget, mData[1][5].home_gadget, mData[1][4].home_gadget, mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][8].lamp, mData[1][7].lamp, mData[1][6].lamp, mData[1][5].lamp, mData[1][4].lamp, mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][8].film, mData[1][7].film, mData[1][6].film, mData[1][5].film, mData[1][4].film, mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][8].gadget, mData[1][7].gadget, mData[1][6].gadget, mData[1][5].gadget, mData[1][4].gadget, mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][8].power_bank, mData[1][7].power_bank, mData[1][6].power_bank, mData[1][5].power_bank, mData[1][4].power_bank, mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][8]['small_talk_bluetooth'], mData[1][7]['small_talk_bluetooth'], mData[1][6]['small_talk_bluetooth'], mData[1][5]['small_talk_bluetooth'], mData[1][4]['small_talk_bluetooth'], mData[1][3]['small_talk_bluetooth'], mData[1][2]['small_talk_bluetooth'], mData[1][1]['small_talk_bluetooth'], mData[1][0]['small_talk_bluetooth']],

					['Speaker', mData[1][8].speaker, mData[1][7].speaker, mData[1][6].speaker, mData[1][5].speaker, mData[1][4].speaker, mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][8]['storage_memory_card'], mData[1][7]['storage_memory_card'], mData[1][6]['storage_memory_card'], mData[1][5]['storage_memory_card'], mData[1][4]['storage_memory_card'], mData[1][3]['storage_memory_card'], mData[1][2]['storage_memory_card'], mData[1][1]['storage_memory_card'], mData[1][0]['storage_memory_card']],

					['Zhuaimao', mData[1][8].zhuaimao, mData[1][7].zhuaimao, mData[1][6].zhuaimao, mData[1][5].zhuaimao, mData[1][4].zhuaimao, mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][8].cancel, mData[1][7].cancel, mData[1][6].cancel, mData[1][5].cancel, mData[1][4].cancel, mData[1][3].cancel, mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][8].other, mData[1][7].other, mData[1][6].other, mData[1][5].other, mData[1][4].other, mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 9) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[1][9].adapter, mData[1][8].adapter, mData[1][7].adapter, mData[1][6].adapter, mData[1][5].adapter, mData[1][4].adapter, mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][9].bag, mData[1][8].bag, mData[1][7].bag, mData[1][6].bag, mData[1][5].bag, mData[1][4].bag, mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][9].cable, mData[1][8].cable, mData[1][7].cable, mData[1][6].cable, mData[1][5].cable, mData[1][4].cable, mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][9].car_gadget, mData[1][8].car_gadget, mData[1][7].car_gadget, mData[1][6].car_gadget, mData[1][5].car_gadget, mData[1][4].car_gadget, mData[1][3].car_gadget, mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][9].case_for_smartphone, mData[1][8].case_for_smartphone, mData[1][7].case_for_smartphone, mData[1][6].case_for_smartphone, mData[1][5].case_for_smartphone, mData[1][4].case_for_smartphone, mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][9].case_for_tablet, mData[1][8].case_for_tablet, mData[1][7].case_for_tablet, mData[1][6].case_for_tablet, mData[1][5].case_for_tablet, mData[1][4].case_for_tablet, mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][9].clearance, mData[1][8].clearance, mData[1][7].clearance, mData[1][6].clearance, mData[1][5].clearance, mData[1][4].clearance, mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][9].creative, mData[1][8].creative, mData[1][7].creative, mData[1][6].creative, mData[1][5].creative, mData[1][4].creative, mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][9].gaming, mData[1][8].gaming, mData[1][7].gaming, mData[1][6].gaming, mData[1][5].gaming, mData[1][4].gaming, mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][9].home_gadget, mData[1][8].home_gadget, mData[1][7].home_gadget, mData[1][6].home_gadget, mData[1][5].home_gadget, mData[1][4].home_gadget, mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][9].lamp, mData[1][8].lamp, mData[1][7].lamp, mData[1][6].lamp, mData[1][5].lamp, mData[1][4].lamp, mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][9].film, mData[1][8].film, mData[1][7].film, mData[1][6].film, mData[1][5].film, mData[1][4].film, mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][9].gadget, mData[1][8].gadget, mData[1][7].gadget, mData[1][6].gadget, mData[1][5].gadget, mData[1][4].gadget, mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][9].power_bank, mData[1][8].power_bank, mData[1][7].power_bank, mData[1][6].power_bank, mData[1][5].power_bank, mData[1][4].power_bank, mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][9]['small_talk_bluetooth'], mData[1][8]['small_talk_bluetooth'], mData[1][7]['small_talk_bluetooth'], mData[1][6]['small_talk_bluetooth'], mData[1][5]['small_talk_bluetooth'], mData[1][4]['small_talk_bluetooth'], mData[1][3]['small_talk_bluetooth'], mData[1][2]['small_talk_bluetooth'], mData[1][1]['small_talk_bluetooth'], mData[1][0]['small_talk_bluetooth']],

					['Speaker', mData[1][9].speaker, mData[1][8].speaker, mData[1][7].speaker, mData[1][6].speaker, mData[1][5].speaker, mData[1][4].speaker, mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][9]['storage_memory_card'], mData[1][8]['storage_memory_card'], mData[1][7]['storage_memory_card'], mData[1][6]['storage_memory_card'], mData[1][5]['storage_memory_card'], mData[1][4]['storage_memory_card'], mData[1][3]['storage_memory_card'], mData[1][2]['storage_memory_card'], mData[1][1]['storage_memory_card'], mData[1][0]['storage_memory_card']],

					['Zhuaimao', mData[1][9].zhuaimao, mData[1][8].zhuaimao, mData[1][7].zhuaimao, mData[1][6].zhuaimao, mData[1][5].zhuaimao, mData[1][4].zhuaimao, mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][9].cancel, mData[1][8].cancel, mData[1][7].cancel, mData[1][6].cancel, mData[1][5].cancel, mData[1][4].cancel, mData[1][3].cancel, mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][9].other, mData[1][8].other, mData[1][7].other, mData[1][6].other, mData[1][5].other, mData[1][4].other, mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 10) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth10, mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[1][10].adapter, mData[1][9].adapter, mData[1][8].adapter, mData[1][7].adapter, mData[1][6].adapter, mData[1][5].adapter, mData[1][4].adapter, mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][10].bag, mData[1][9].bag, mData[1][8].bag, mData[1][7].bag, mData[1][6].bag, mData[1][5].bag, mData[1][4].bag, mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][10].cable, mData[1][9].cable, mData[1][8].cable, mData[1][7].cable, mData[1][6].cable, mData[1][5].cable, mData[1][4].cable, mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][10].car_gadget, mData[1][9].car_gadget, mData[1][8].car_gadget, mData[1][7].car_gadget, mData[1][6].car_gadget, mData[1][5].car_gadget, mData[1][4].car_gadget, mData[1][3].car_gadget, mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][10].case_for_smartphone, mData[1][9].case_for_smartphone, mData[1][8].case_for_smartphone, mData[1][7].case_for_smartphone, mData[1][6].case_for_smartphone, mData[1][5].case_for_smartphone, mData[1][4].case_for_smartphone, mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][10].case_for_tablet, mData[1][9].case_for_tablet, mData[1][8].case_for_tablet, mData[1][7].case_for_tablet, mData[1][6].case_for_tablet, mData[1][5].case_for_tablet, mData[1][4].case_for_tablet, mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][10].clearance, mData[1][9].clearance, mData[1][8].clearance, mData[1][7].clearance, mData[1][6].clearance, mData[1][5].clearance, mData[1][4].clearance, mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][10].creative, mData[1][9].creative, mData[1][8].creative, mData[1][7].creative, mData[1][6].creative, mData[1][5].creative, mData[1][4].creative, mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][10].gaming, mData[1][9].gaming, mData[1][8].gaming, mData[1][7].gaming, mData[1][6].gaming, mData[1][5].gaming, mData[1][4].gaming, mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][10].home_gadget, mData[1][9].home_gadget, mData[1][8].home_gadget, mData[1][7].home_gadget, mData[1][6].home_gadget, mData[1][5].home_gadget, mData[1][4].home_gadget, mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][10].lamp, mData[1][9].lamp, mData[1][8].lamp, mData[1][7].lamp, mData[1][6].lamp, mData[1][5].lamp, mData[1][4].lamp, mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][10].film, mData[1][9].film, mData[1][8].film, mData[1][7].film, mData[1][6].film, mData[1][5].film, mData[1][4].film, mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][10].gadget, mData[1][9].gadget, mData[1][8].gadget, mData[1][7].gadget, mData[1][6].gadget, mData[1][5].gadget, mData[1][4].gadget, mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][10].power_bank, mData[1][9].power_bank, mData[1][8].power_bank, mData[1][7].power_bank, mData[1][6].power_bank, mData[1][5].power_bank, mData[1][4].power_bank, mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][10]['small_talk_bluetooth'], mData[1][9]['small_talk_bluetooth'], mData[1][8]['small_talk_bluetooth'], mData[1][7]['small_talk_bluetooth'], mData[1][6]['small_talk_bluetooth'], mData[1][5]['small_talk_bluetooth'], mData[1][4]['small_talk_bluetooth'], mData[1][3]['small_talk_bluetooth'], mData[1][2]['small_talk_bluetooth'], mData[1][1]['small_talk_bluetooth'], mData[1][0]['small_talk_bluetooth']],

					['Speaker', mData[1][10].speaker, mData[1][9].speaker, mData[1][8].speaker, mData[1][7].speaker, mData[1][6].speaker, mData[1][5].speaker, mData[1][4].speaker, mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][10]['storage_memory_card'], mData[1][9]['storage_memory_card'], mData[1][8]['storage_memory_card'], mData[1][7]['storage_memory_card'], mData[1][6]['storage_memory_card'], mData[1][5]['storage_memory_card'], mData[1][4]['storage_memory_card'], mData[1][3]['storage_memory_card'], mData[1][2]['storage_memory_card'], mData[1][1]['storage_memory_card'], mData[1][0]['storage_memory_card']],

					['Zhuaimao', mData[1][10].zhuaimao, mData[1][9].zhuaimao, mData[1][8].zhuaimao, mData[1][7].zhuaimao, mData[1][6].zhuaimao, mData[1][5].zhuaimao, mData[1][4].zhuaimao, mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][10].cancel, mData[1][9].cancel, mData[1][8].cancel, mData[1][7].cancel, mData[1][6].cancel, mData[1][5].cancel, mData[1][4].cancel, mData[1][3].cancel, mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][10].other, mData[1][9].other, mData[1][8].other, mData[1][7].other, mData[1][6].other, mData[1][5].other, mData[1][4].other, mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 11) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth11, mth10, mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[1][11].adapter, mData[1][10].adapter, mData[1][9].adapter, mData[1][8].adapter, mData[1][7].adapter, mData[1][6].adapter, mData[1][5].adapter, mData[1][4].adapter, mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][11].bag, mData[1][10].bag, mData[1][9].bag, mData[1][8].bag, mData[1][7].bag, mData[1][6].bag, mData[1][5].bag, mData[1][4].bag, mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][11].cable, mData[1][10].cable, mData[1][9].cable, mData[1][8].cable, mData[1][7].cable, mData[1][6].cable, mData[1][5].cable, mData[1][4].cable, mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][11].car_gadget, mData[1][10].car_gadget, mData[1][9].car_gadget, mData[1][8].car_gadget, mData[1][7].car_gadget, mData[1][6].car_gadget, mData[1][5].car_gadget, mData[1][4].car_gadget, mData[1][3].car_gadget, mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][11].case_for_smartphone, mData[1][10].case_for_smartphone, mData[1][9].case_for_smartphone, mData[1][8].case_for_smartphone, mData[1][7].case_for_smartphone, mData[1][6].case_for_smartphone, mData[1][5].case_for_smartphone, mData[1][4].case_for_smartphone, mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][11].case_for_tablet, mData[1][10].case_for_tablet, mData[1][9].case_for_tablet, mData[1][8].case_for_tablet, mData[1][7].case_for_tablet, mData[1][6].case_for_tablet, mData[1][5].case_for_tablet, mData[1][4].case_for_tablet, mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][11].clearance, mData[1][10].clearance, mData[1][9].clearance, mData[1][8].clearance, mData[1][7].clearance, mData[1][6].clearance, mData[1][5].clearance, mData[1][4].clearance, mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][11].creative, mData[1][10].creative, mData[1][9].creative, mData[1][8].creative, mData[1][7].creative, mData[1][6].creative, mData[1][5].creative, mData[1][4].creative, mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][11].gaming, mData[1][10].gaming, mData[1][9].gaming, mData[1][8].gaming, mData[1][7].gaming, mData[1][6].gaming, mData[1][5].gaming, mData[1][4].gaming, mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][11].home_gadget, mData[1][10].home_gadget, mData[1][9].home_gadget, mData[1][8].home_gadget, mData[1][7].home_gadget, mData[1][6].home_gadget, mData[1][5].home_gadget, mData[1][4].home_gadget, mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][11].lamp, mData[1][10].lamp, mData[1][9].lamp, mData[1][8].lamp, mData[1][7].lamp, mData[1][6].lamp, mData[1][5].lamp, mData[1][4].lamp, mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][11].film, mData[1][10].film, mData[1][9].film, mData[1][8].film, mData[1][7].film, mData[1][6].film, mData[1][5].film, mData[1][4].film, mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][11].gadget, mData[1][10].gadget, mData[1][9].gadget, mData[1][8].gadget, mData[1][7].gadget, mData[1][6].gadget, mData[1][5].gadget, mData[1][4].gadget, mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][11].power_bank, mData[1][10].power_bank, mData[1][9].power_bank, mData[1][8].power_bank, mData[1][7].power_bank, mData[1][6].power_bank, mData[1][5].power_bank, mData[1][4].power_bank, mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][11]['small_talk_bluetooth'], mData[1][10]['small_talk_bluetooth'], mData[1][9]['small_talk_bluetooth'], mData[1][8]['small_talk_bluetooth'], mData[1][7]['small_talk_bluetooth'], mData[1][6]['small_talk_bluetooth'], mData[1][5]['small_talk_bluetooth'], mData[1][4]['small_talk_bluetooth'], mData[1][3]['small_talk_bluetooth'], mData[1][2]['small_talk_bluetooth'], mData[1][1]['small_talk_bluetooth'], mData[1][0]['small_talk_bluetooth']],

					['Speaker', mData[1][11].speaker, mData[1][10].speaker, mData[1][9].speaker, mData[1][8].speaker, mData[1][7].speaker, mData[1][6].speaker, mData[1][5].speaker, mData[1][4].speaker, mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][11]['storage_memory_card'], mData[1][10]['storage_memory_card'], mData[1][9]['storage_memory_card'], mData[1][8]['storage_memory_card'], mData[1][7]['storage_memory_card'], mData[1][6]['storage_memory_card'], mData[1][5]['storage_memory_card'], mData[1][4]['storage_memory_card'], mData[1][3]['storage_memory_card'], mData[1][2]['storage_memory_card'], mData[1][1]['storage_memory_card'], mData[1][0]['storage_memory_card']],

					['Zhuaimao', mData[1][11].zhuaimao, mData[1][10].zhuaimao, mData[1][9].zhuaimao, mData[1][8].zhuaimao, mData[1][7].zhuaimao, mData[1][6].zhuaimao, mData[1][5].zhuaimao, mData[1][4].zhuaimao, mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][11].cancel, mData[1][10].cancel, mData[1][9].cancel, mData[1][8].cancel, mData[1][7].cancel, mData[1][6].cancel, mData[1][5].cancel, mData[1][4].cancel, mData[1][3].cancel, mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][11].other, mData[1][10].other, mData[1][9].other, mData[1][8].other, mData[1][7].other, mData[1][6].other, mData[1][5].other, mData[1][4].other, mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 12) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth12, mth11, mth10, mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[1][12].adapter, mData[1][11].adapter, mData[1][10].adapter, mData[1][9].adapter, mData[1][8].adapter, mData[1][7].adapter, mData[1][6].adapter, mData[1][5].adapter, mData[1][4].adapter, mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][12].bag, mData[1][11].bag, mData[1][10].bag, mData[1][9].bag, mData[1][8].bag, mData[1][7].bag, mData[1][6].bag, mData[1][5].bag, mData[1][4].bag, mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][12].cable, mData[1][11].cable, mData[1][10].cable, mData[1][9].cable, mData[1][8].cable, mData[1][7].cable, mData[1][6].cable, mData[1][5].cable, mData[1][4].cable, mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][12].car_gadget, mData[1][11].car_gadget, mData[1][10].car_gadget, mData[1][9].car_gadget, mData[1][8].car_gadget, mData[1][7].car_gadget, mData[1][6].car_gadget, mData[1][5].car_gadget, mData[1][4].car_gadget, mData[1][3].car_gadget, mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][12].case_for_smartphone, mData[1][11].case_for_smartphone, mData[1][10].case_for_smartphone, mData[1][9].case_for_smartphone, mData[1][8].case_for_smartphone, mData[1][7].case_for_smartphone, mData[1][6].case_for_smartphone, mData[1][5].case_for_smartphone, mData[1][4].case_for_smartphone, mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][12].case_for_tablet, mData[1][11].case_for_tablet, mData[1][10].case_for_tablet, mData[1][9].case_for_tablet, mData[1][8].case_for_tablet, mData[1][7].case_for_tablet, mData[1][6].case_for_tablet, mData[1][5].case_for_tablet, mData[1][4].case_for_tablet, mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][12].clearance, mData[1][11].clearance, mData[1][10].clearance, mData[1][9].clearance, mData[1][8].clearance, mData[1][7].clearance, mData[1][6].clearance, mData[1][5].clearance, mData[1][4].clearance, mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][12].creative, mData[1][11].creative, mData[1][10].creative, mData[1][9].creative, mData[1][8].creative, mData[1][7].creative, mData[1][6].creative, mData[1][5].creative, mData[1][4].creative, mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][12].gaming, mData[1][11].gaming, mData[1][10].gaming, mData[1][9].gaming, mData[1][8].gaming, mData[1][7].gaming, mData[1][6].gaming, mData[1][5].gaming, mData[1][4].gaming, mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][12].home_gadget, mData[1][11].home_gadget, mData[1][10].home_gadget, mData[1][9].home_gadget, mData[1][8].home_gadget, mData[1][7].home_gadget, mData[1][6].home_gadget, mData[1][5].home_gadget, mData[1][4].home_gadget, mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][12].lamp, mData[1][11].lamp, mData[1][10].lamp, mData[1][9].lamp, mData[1][8].lamp, mData[1][7].lamp, mData[1][6].lamp, mData[1][5].lamp, mData[1][4].lamp, mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][12].film, mData[1][11].film, mData[1][10].film, mData[1][9].film, mData[1][8].film, mData[1][7].film, mData[1][6].film, mData[1][5].film, mData[1][4].film, mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][12].gadget, mData[1][11].gadget, mData[1][10].gadget, mData[1][9].gadget, mData[1][8].gadget, mData[1][7].gadget, mData[1][6].gadget, mData[1][5].gadget, mData[1][4].gadget, mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][12].power_bank, mData[1][11].power_bank, mData[1][10].power_bank, mData[1][9].power_bank, mData[1][8].power_bank, mData[1][7].power_bank, mData[1][6].power_bank, mData[1][5].power_bank, mData[1][4].power_bank, mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][12]['small_talk_bluetooth'], mData[1][11]['small_talk_bluetooth'], mData[1][10]['small_talk_bluetooth'], mData[1][8]['small_talk_bluetooth'], mData[1][7]['small_talk_bluetooth'], mData[1][6]['small_talk_bluetooth'], mData[1][6]['small_talk_bluetooth'], mData[1][5]['small_talk_bluetooth'], mData[1][4]['small_talk_bluetooth'], mData[1][3]['small_talk_bluetooth'], mData[1][2]['small_talk_bluetooth'], mData[1][1]['small_talk_bluetooth'], mData[1][0]['small_talk_bluetooth']],

					['Speaker', mData[1][12].speaker, mData[1][11].speaker, mData[1][10].speaker, mData[1][9].speaker, mData[1][8].speaker, mData[1][7].speaker, mData[1][6].speaker, mData[1][5].speaker, mData[1][4].speaker, mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][12]['storage_memory_card'], mData[1][11]['storage_memory_card'], mData[1][10]['storage_memory_card'], mData[1][9]['storage_memory_card'], mData[1][8]['storage_memory_card'], mData[1][7]['storage_memory_card'], mData[1][6]['storage_memory_card'], mData[1][5]['storage_memory_card'], mData[1][4]['storage_memory_card'], mData[1][3]['storage_memory_card'], mData[1][2]['storage_memory_card'], mData[1][1]['storage_memory_card'], mData[1][0]['storage_memory_card']],

					['Zhuaimao', mData[1][12].zhuaimao, mData[1][11].zhuaimao, mData[1][10].zhuaimao, mData[1][9].zhuaimao, mData[1][8].zhuaimao, mData[1][7].zhuaimao, mData[1][6].zhuaimao, mData[1][5].zhuaimao, mData[1][4].zhuaimao, mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][12].cancel, mData[1][11].cancel, mData[1][10].cancel, mData[1][9].cancel, mData[1][8].cancel, mData[1][7].cancel, mData[1][6].cancel, mData[1][5].cancel, mData[1][4].cancel, mData[1][3].cancel, mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][12].other, mData[1][11].other, mData[1][10].other, mData[1][9].other, mData[1][8].other, mData[1][7].other, mData[1][6].other, mData[1][5].other, mData[1][4].other, mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			}

		} else if ($('#selectType').val() == 'type-profit') {
			lblType = 'Profit and Loss';
			if ($('#selectPrevious').val() == 0) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth0],
					['Adapter', mData[2][0].adapter],
					['Bag', mData[2][0].bag],
					['Cable', mData[2][0].cable],
					['Car Gadget', mData[2][0].car_gadget],
					['Case For Smartphone', mData[2][0].case_for_smartphone],
					['Case For Tablet', mData[2][0].case_for_tablet],
					['Clearance', mData[2][0].clearance],
					['Gadget Creative', mData[2][0].creative],
					['Gaming', mData[2][0].gaming],
					['Home Gadget',mData[2][0].home_gadget],
					['Lamp', mData[2][0].lamp],
					['Film', mData[2][0].film],
					['Smart life', mData[2][0].gadget],
					['Power Bank', mData[2][0].power_bank],
					['Small Talk Bluetooth', mData[2][0]['small_talk_bluetooth']],
					['Speaker', mData[2][0].speaker],
					['Storage Memory Card', mData[2][0]['storage_memory_card']],
					['Zhuaimao', mData[2][0].zhuaimao],
					['ยกเลิกใช้งาน', mData[2][0].cancel],
					['Other', mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 1) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth1, mth0],

					['Adapter', mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][1]['small_talk_bluetooth'], mData[2][0]['small_talk_bluetooth']],

					['Speaker', mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][1]['storage_memory_card'], mData[2][0]['storage_memory_card']],

					['Zhuaimao', mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 2) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth2, mth1, mth0],

					['Adapter', mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][2]['small_talk_bluetooth'], mData[2][1]['small_talk_bluetooth'], mData[2][0]['small_talk_bluetooth']],

					['Speaker', mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][2]['storage_memory_card'], mData[2][1]['storage_memory_card'], mData[2][0]['storage_memory_card']],

					['Zhuaimao', mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 3) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth3, mth2, mth1, mth0],

					['Adapter', mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][3]['small_talk_bluetooth'], mData[2][2]['small_talk_bluetooth'], mData[2][1]['small_talk_bluetooth'], mData[2][0]['small_talk_bluetooth']],

					['Speaker', mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][3]['storage_memory_card'], mData[2][2]['storage_memory_card'], mData[2][1]['storage_memory_card'], mData[2][0]['storage_memory_card']],

					['Zhuaimao', mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 4) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[2][4].adapter, mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][4].bag, mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][4].cable, mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][4].car_gadget, mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][4].case_for_smartphone, mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][4].case_for_tablet, mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][4].clearance, mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][4].creative, mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][4].gaming, mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][4].home_gadget, mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][4].lamp, mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][4].film, mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][4].gadget, mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][4].power_bank, mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][4]['small_talk_bluetooth'], mData[2][3]['small_talk_bluetooth'], mData[2][2]['small_talk_bluetooth'], mData[2][1]['small_talk_bluetooth'], mData[2][0]['small_talk_bluetooth']],

					['Speaker', mData[2][4].speaker, mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][4]['storage_memory_card'], mData[2][3]['storage_memory_card'], mData[2][2]['storage_memory_card'], mData[2][1]['storage_memory_card'], mData[2][0]['storage_memory_card']],

					['Zhuaimao', mData[2][4].zhuaimao, mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][4].cancel, mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][4].other, mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 5) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[2][5].adapter, mData[2][4].adapter, mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][5].bag, mData[2][4].bag, mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][5].cable, mData[2][4].cable, mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][5].car_gadget, mData[2][4].car_gadget, mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][5].case_for_smartphone, mData[2][4].case_for_smartphone, mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][5].case_for_tablet, mData[2][4].case_for_tablet, mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][5].clearance, mData[2][4].clearance, mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][5].creative, mData[2][4].creative, mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][5].gaming, mData[2][4].gaming, mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][5].home_gadget, mData[2][4].home_gadget, mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][5].lamp, mData[2][4].lamp, mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][5].film, mData[2][4].film, mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][5].gadget, mData[2][4].gadget, mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][5].power_bank, mData[2][4].power_bank, mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][5]['small_talk_bluetooth'], mData[2][4]['small_talk_bluetooth'], mData[2][3]['small_talk_bluetooth'], mData[2][2]['small_talk_bluetooth'], mData[2][1]['small_talk_bluetooth'], mData[2][0]['small_talk_bluetooth']],

					['Speaker', mData[2][5].speaker, mData[2][4].speaker, mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][5]['storage_memory_card'], mData[2][4]['storage_memory_card'], mData[2][3]['storage_memory_card'], mData[2][2]['storage_memory_card'], mData[2][1]['storage_memory_card'], mData[2][0]['storage_memory_card']],

					['Zhuaimao', mData[2][5].zhuaimao, mData[2][4].zhuaimao, mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][5].cancel, mData[2][4].cancel, mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][5].other, mData[2][4].other, mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 6) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[2][6].adapter, mData[2][5].adapter, mData[2][4].adapter, mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][6].bag, mData[2][5].bag, mData[2][4].bag, mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][6].cable, mData[2][5].cable, mData[2][4].cable, mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][6].car_gadget, mData[2][5].car_gadget, mData[2][4].car_gadget, mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][6].case_for_smartphone, mData[2][5].case_for_smartphone, mData[2][4].case_for_smartphone, mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][6].case_for_tablet, mData[2][5].case_for_tablet, mData[2][4].case_for_tablet, mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][6].clearance, mData[2][5].clearance, mData[2][4].clearance, mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][6].creative, mData[2][5].creative, mData[2][4].creative, mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][6].gaming, mData[2][5].gaming, mData[2][4].gaming, mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][6].home_gadget, mData[2][5].home_gadget, mData[2][4].home_gadget, mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][6].lamp, mData[2][5].lamp, mData[2][4].lamp, mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][6].film, mData[2][5].film, mData[2][4].film, mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][6].gadget, mData[2][5].gadget, mData[2][4].gadget, mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][6].power_bank, mData[2][5].power_bank, mData[2][4].power_bank, mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][6]['small_talk_bluetooth'], mData[2][5]['small_talk_bluetooth'], mData[2][4]['small_talk_bluetooth'], mData[2][3]['small_talk_bluetooth'], mData[2][2]['small_talk_bluetooth'], mData[2][1]['small_talk_bluetooth'], mData[2][0]['small_talk_bluetooth']],

					['Speaker', mData[2][6].speaker, mData[2][5].speaker, mData[2][4].speaker, mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][6]['storage_memory_card'], mData[2][5]['storage_memory_card'], mData[2][4]['storage_memory_card'], mData[2][3]['storage_memory_card'], mData[2][2]['storage_memory_card'], mData[2][1]['storage_memory_card'], mData[2][0]['storage_memory_card']],

					['Zhuaimao', mData[2][6].zhuaimao, mData[2][5].zhuaimao, mData[2][4].zhuaimao, mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][6].cancel, mData[2][5].cancel, mData[2][4].cancel, mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][6].other, mData[2][5].other, mData[2][4].other, mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 7) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[2][7].adapter, mData[2][6].adapter, mData[2][5].adapter, mData[2][4].adapter, mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][7].bag, mData[2][6].bag, mData[2][5].bag, mData[2][4].bag, mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][7].cable, mData[2][6].cable, mData[2][5].cable, mData[2][4].cable, mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][7].car_gadget, mData[2][6].car_gadget, mData[2][5].car_gadget, mData[2][4].car_gadget, mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][7].case_for_smartphone, mData[2][6].case_for_smartphone, mData[2][5].case_for_smartphone, mData[2][4].case_for_smartphone, mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][7].case_for_tablet, mData[2][6].case_for_tablet, mData[2][5].case_for_tablet, mData[2][4].case_for_tablet, mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][7].clearance, mData[2][6].clearance, mData[2][5].clearance, mData[2][4].clearance, mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][7].creative, mData[2][6].creative, mData[2][5].creative, mData[2][4].creative, mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][7].gaming, mData[2][6].gaming, mData[2][5].gaming, mData[2][4].gaming, mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][7].home_gadget, mData[2][6].home_gadget, mData[2][5].home_gadget, mData[2][4].home_gadget, mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][7].lamp, mData[2][6].lamp, mData[2][5].lamp, mData[2][4].lamp, mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][7].film, mData[2][6].film, mData[2][5].film, mData[2][4].film, mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][7].gadget, mData[2][6].gadget, mData[2][5].gadget, mData[2][4].gadget, mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][7].power_bank, mData[2][6].power_bank, mData[2][5].power_bank, mData[2][4].power_bank, mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][7]['small_talk_bluetooth'], mData[2][6]['small_talk_bluetooth'], mData[2][5]['small_talk_bluetooth'], mData[2][4]['small_talk_bluetooth'], mData[2][3]['small_talk_bluetooth'], mData[2][2]['small_talk_bluetooth'], mData[2][1]['small_talk_bluetooth'], mData[2][0]['small_talk_bluetooth']],

					['Speaker', mData[2][7].speaker, mData[2][6].speaker, mData[2][5].speaker, mData[2][4].speaker, mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][7]['storage_memory_card'], mData[2][6]['storage_memory_card'], mData[2][5]['storage_memory_card'], mData[2][4]['storage_memory_card'], mData[2][3]['storage_memory_card'], mData[2][2]['storage_memory_card'], mData[2][1]['storage_memory_card'], mData[2][0]['storage_memory_card']],

					['Zhuaimao', mData[2][7].zhuaimao, mData[2][6].zhuaimao, mData[2][5].zhuaimao, mData[2][4].zhuaimao, mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][7].cancel, mData[2][6].cancel, mData[2][5].cancel, mData[2][4].cancel, mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][7].other, mData[2][6].other, mData[2][5].other, mData[2][4].other, mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 8) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[2][8].adapter, mData[2][7].adapter, mData[2][6].adapter, mData[2][5].adapter, mData[2][4].adapter, mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][8].bag, mData[2][7].bag, mData[2][6].bag, mData[2][5].bag, mData[2][4].bag, mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][8].cable, mData[2][7].cable, mData[2][6].cable, mData[2][5].cable, mData[2][4].cable, mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][8].car_gadget, mData[2][7].car_gadget, mData[2][6].car_gadget, mData[2][5].car_gadget, mData[2][4].car_gadget, mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][8].case_for_smartphone, mData[2][7].case_for_smartphone, mData[2][6].case_for_smartphone, mData[2][5].case_for_smartphone, mData[2][4].case_for_smartphone, mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][8].case_for_tablet, mData[2][7].case_for_tablet, mData[2][6].case_for_tablet, mData[2][5].case_for_tablet, mData[2][4].case_for_tablet, mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][8].clearance, mData[2][7].clearance, mData[2][6].clearance, mData[2][5].clearance, mData[2][4].clearance, mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][8].creative, mData[2][7].creative, mData[2][6].creative, mData[2][5].creative, mData[2][4].creative, mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][8].gaming, mData[2][7].gaming, mData[2][6].gaming, mData[2][5].gaming, mData[2][4].gaming, mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][8].home_gadget, mData[2][7].home_gadget, mData[2][6].home_gadget, mData[2][5].home_gadget, mData[2][4].home_gadget, mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][8].lamp, mData[2][7].lamp, mData[2][6].lamp, mData[2][5].lamp, mData[2][4].lamp, mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][8].film, mData[2][7].film, mData[2][6].film, mData[2][5].film, mData[2][4].film, mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][8].gadget, mData[2][7].gadget, mData[2][6].gadget, mData[2][5].gadget, mData[2][4].gadget, mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][8].power_bank, mData[2][7].power_bank, mData[2][6].power_bank, mData[2][5].power_bank, mData[2][4].power_bank, mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][8]['small_talk_bluetooth'], mData[2][7]['small_talk_bluetooth'], mData[2][6]['small_talk_bluetooth'], mData[2][5]['small_talk_bluetooth'], mData[2][4]['small_talk_bluetooth'], mData[2][3]['small_talk_bluetooth'], mData[2][2]['small_talk_bluetooth'], mData[2][1]['small_talk_bluetooth'], mData[2][0]['small_talk_bluetooth']],

					['Speaker', mData[2][8].speaker, mData[2][7].speaker, mData[2][6].speaker, mData[2][5].speaker, mData[2][4].speaker, mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][8]['storage_memory_card'], mData[2][7]['storage_memory_card'], mData[2][6]['storage_memory_card'], mData[2][5]['storage_memory_card'], mData[2][4]['storage_memory_card'], mData[2][3]['storage_memory_card'], mData[2][2]['storage_memory_card'], mData[2][1]['storage_memory_card'], mData[2][0]['storage_memory_card']],

					['Zhuaimao', mData[2][8].zhuaimao, mData[2][7].zhuaimao, mData[2][6].zhuaimao, mData[2][5].zhuaimao, mData[2][4].zhuaimao, mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][8].cancel, mData[2][7].cancel, mData[2][6].cancel, mData[2][5].cancel, mData[2][4].cancel, mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][8].other, mData[2][7].other, mData[2][6].other, mData[2][5].other, mData[2][4].other, mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 9) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[2][9].adapter, mData[2][8].adapter, mData[2][7].adapter, mData[2][6].adapter, mData[2][5].adapter, mData[2][4].adapter, mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][9].bag, mData[2][8].bag, mData[2][7].bag, mData[2][6].bag, mData[2][5].bag, mData[2][4].bag, mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][9].cable, mData[2][8].cable, mData[2][7].cable, mData[2][6].cable, mData[2][5].cable, mData[2][4].cable, mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][9].car_gadget, mData[2][8].car_gadget, mData[2][7].car_gadget, mData[2][6].car_gadget, mData[2][5].car_gadget, mData[2][4].car_gadget, mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][9].case_for_smartphone, mData[2][8].case_for_smartphone, mData[2][7].case_for_smartphone, mData[2][6].case_for_smartphone, mData[2][5].case_for_smartphone, mData[2][4].case_for_smartphone, mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][9].case_for_tablet, mData[2][8].case_for_tablet, mData[2][7].case_for_tablet, mData[2][6].case_for_tablet, mData[2][5].case_for_tablet, mData[2][4].case_for_tablet, mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][9].clearance, mData[2][8].clearance, mData[2][7].clearance, mData[2][6].clearance, mData[2][5].clearance, mData[2][4].clearance, mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][9].creative, mData[2][8].creative, mData[2][7].creative, mData[2][6].creative, mData[2][5].creative, mData[2][4].creative, mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][9].gaming, mData[2][8].gaming, mData[2][7].gaming, mData[2][6].gaming, mData[2][5].gaming, mData[2][4].gaming, mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][9].home_gadget, mData[2][8].home_gadget, mData[2][7].home_gadget, mData[2][6].home_gadget, mData[2][5].home_gadget, mData[2][4].home_gadget, mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][9].lamp, mData[2][8].lamp, mData[2][7].lamp, mData[2][6].lamp, mData[2][5].lamp, mData[2][4].lamp, mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][9].film, mData[2][8].film, mData[2][7].film, mData[2][6].film, mData[2][5].film, mData[2][4].film, mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][9].gadget, mData[2][8].gadget, mData[2][7].gadget, mData[2][6].gadget, mData[2][5].gadget, mData[2][4].gadget, mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][9].power_bank, mData[2][8].power_bank, mData[2][7].power_bank, mData[2][6].power_bank, mData[2][5].power_bank, mData[2][4].power_bank, mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][9]['small_talk_bluetooth'], mData[2][8]['small_talk_bluetooth'], mData[2][7]['small_talk_bluetooth'], mData[2][6]['small_talk_bluetooth'], mData[2][5]['small_talk_bluetooth'], mData[2][4]['small_talk_bluetooth'], mData[2][3]['small_talk_bluetooth'], mData[2][2]['small_talk_bluetooth'], mData[2][1]['small_talk_bluetooth'], mData[2][0]['small_talk_bluetooth']],

					['Speaker', mData[2][9].speaker, mData[2][8].speaker, mData[2][7].speaker, mData[2][6].speaker, mData[2][5].speaker, mData[2][4].speaker, mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][9]['storage_memory_card'], mData[2][8]['storage_memory_card'], mData[2][7]['storage_memory_card'], mData[2][6]['storage_memory_card'], mData[2][5]['storage_memory_card'], mData[2][4]['storage_memory_card'], mData[2][3]['storage_memory_card'], mData[2][2]['storage_memory_card'], mData[2][1]['storage_memory_card'], mData[2][0]['storage_memory_card']],

					['Zhuaimao', mData[2][9].zhuaimao, mData[2][8].zhuaimao, mData[2][7].zhuaimao, mData[2][6].zhuaimao, mData[2][5].zhuaimao, mData[2][4].zhuaimao, mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][9].cancel, mData[2][8].cancel, mData[2][7].cancel, mData[2][6].cancel, mData[2][5].cancel, mData[2][4].cancel, mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][9].other, mData[2][8].other, mData[2][7].other, mData[2][6].other, mData[2][5].other, mData[2][4].other, mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 10) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth10, mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[2][10].adapter, mData[2][9].adapter, mData[2][8].adapter, mData[2][7].adapter, mData[2][6].adapter, mData[2][5].adapter, mData[2][4].adapter, mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][10].bag, mData[2][9].bag, mData[2][8].bag, mData[2][7].bag, mData[2][6].bag, mData[2][5].bag, mData[2][4].bag, mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][10].cable, mData[2][9].cable, mData[2][8].cable, mData[2][7].cable, mData[2][6].cable, mData[2][5].cable, mData[2][4].cable, mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][10].car_gadget, mData[2][9].car_gadget, mData[2][8].car_gadget, mData[2][7].car_gadget, mData[2][6].car_gadget, mData[2][5].car_gadget, mData[2][4].car_gadget, mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][10].case_for_smartphone, mData[2][9].case_for_smartphone, mData[2][8].case_for_smartphone, mData[2][7].case_for_smartphone, mData[2][6].case_for_smartphone, mData[2][5].case_for_smartphone, mData[2][4].case_for_smartphone, mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][10].case_for_tablet, mData[2][9].case_for_tablet, mData[2][8].case_for_tablet, mData[2][7].case_for_tablet, mData[2][6].case_for_tablet, mData[2][5].case_for_tablet, mData[2][4].case_for_tablet, mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][10].clearance, mData[2][9].clearance, mData[2][8].clearance, mData[2][7].clearance, mData[2][6].clearance, mData[2][5].clearance, mData[2][4].clearance, mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][10].creative, mData[2][9].creative, mData[2][8].creative, mData[2][7].creative, mData[2][6].creative, mData[2][5].creative, mData[2][4].creative, mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][10].gaming, mData[2][9].gaming, mData[2][8].gaming, mData[2][7].gaming, mData[2][6].gaming, mData[2][5].gaming, mData[2][4].gaming, mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][10].home_gadget, mData[2][9].home_gadget, mData[2][8].home_gadget, mData[2][7].home_gadget, mData[2][6].home_gadget, mData[2][5].home_gadget, mData[2][4].home_gadget, mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][10].lamp, mData[2][9].lamp, mData[2][8].lamp, mData[2][7].lamp, mData[2][6].lamp, mData[2][5].lamp, mData[2][4].lamp, mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][10].film, mData[2][9].film, mData[2][8].film, mData[2][7].film, mData[2][6].film, mData[2][5].film, mData[2][4].film, mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][10].gadget, mData[2][9].gadget, mData[2][8].gadget, mData[2][7].gadget, mData[2][6].gadget, mData[2][5].gadget, mData[2][4].gadget, mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][10].power_bank, mData[2][9].power_bank, mData[2][8].power_bank, mData[2][7].power_bank, mData[2][6].power_bank, mData[2][5].power_bank, mData[2][4].power_bank, mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][10]['small_talk_bluetooth'], mData[2][9]['small_talk_bluetooth'], mData[2][8]['small_talk_bluetooth'], mData[2][7]['small_talk_bluetooth'], mData[2][6]['small_talk_bluetooth'], mData[2][5]['small_talk_bluetooth'], mData[2][4]['small_talk_bluetooth'], mData[2][3]['small_talk_bluetooth'], mData[2][2]['small_talk_bluetooth'], mData[2][1]['small_talk_bluetooth'], mData[2][0]['small_talk_bluetooth']],

					['Speaker', mData[2][10].speaker, mData[2][9].speaker, mData[2][8].speaker, mData[2][7].speaker, mData[2][6].speaker, mData[2][5].speaker, mData[2][4].speaker, mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][10]['storage_memory_card'], mData[2][9]['storage_memory_card'], mData[2][8]['storage_memory_card'], mData[2][7]['storage_memory_card'], mData[2][6]['storage_memory_card'], mData[2][5]['storage_memory_card'], mData[2][4]['storage_memory_card'], mData[2][3]['storage_memory_card'], mData[2][2]['storage_memory_card'], mData[2][1]['storage_memory_card'], mData[2][0]['storage_memory_card']],

					['Zhuaimao', mData[2][10].zhuaimao, mData[2][9].zhuaimao, mData[2][8].zhuaimao, mData[2][7].zhuaimao, mData[2][6].zhuaimao, mData[2][5].zhuaimao, mData[2][4].zhuaimao, mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][10].cancel, mData[2][9].cancel, mData[2][8].cancel, mData[2][7].cancel, mData[2][6].cancel, mData[2][5].cancel, mData[2][4].cancel, mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][10].other, mData[2][9].other, mData[2][8].other, mData[2][7].other, mData[2][6].other, mData[2][5].other, mData[2][4].other, mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 11) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth11, mth10, mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[2][11].adapter, mData[2][10].adapter, mData[2][9].adapter, mData[2][8].adapter, mData[2][7].adapter, mData[2][6].adapter, mData[2][5].adapter, mData[2][4].adapter, mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][11].bag, mData[2][10].bag, mData[2][9].bag, mData[2][8].bag, mData[2][7].bag, mData[2][6].bag, mData[2][5].bag, mData[2][4].bag, mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][11].cable, mData[2][10].cable, mData[2][9].cable, mData[2][8].cable, mData[2][7].cable, mData[2][6].cable, mData[2][5].cable, mData[2][4].cable, mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][11].car_gadget, mData[2][10].car_gadget, mData[2][9].car_gadget, mData[2][8].car_gadget, mData[2][7].car_gadget, mData[2][6].car_gadget, mData[2][5].car_gadget, mData[2][4].car_gadget, mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][11].case_for_smartphone, mData[2][10].case_for_smartphone, mData[2][9].case_for_smartphone, mData[2][8].case_for_smartphone, mData[2][7].case_for_smartphone, mData[2][6].case_for_smartphone, mData[2][5].case_for_smartphone, mData[2][4].case_for_smartphone, mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][11].case_for_tablet, mData[2][10].case_for_tablet, mData[2][9].case_for_tablet, mData[2][8].case_for_tablet, mData[2][7].case_for_tablet, mData[2][6].case_for_tablet, mData[2][5].case_for_tablet, mData[2][4].case_for_tablet, mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][11].clearance, mData[2][10].clearance, mData[2][9].clearance, mData[2][8].clearance, mData[2][7].clearance, mData[2][6].clearance, mData[2][5].clearance, mData[2][4].clearance, mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][11].creative, mData[2][10].creative, mData[2][9].creative, mData[2][8].creative, mData[2][7].creative, mData[2][6].creative, mData[2][5].creative, mData[2][4].creative, mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][11].gaming, mData[2][10].gaming, mData[2][9].gaming, mData[2][8].gaming, mData[2][7].gaming, mData[2][6].gaming, mData[2][5].gaming, mData[2][4].gaming, mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][11].home_gadget, mData[2][10].home_gadget, mData[2][9].home_gadget, mData[2][8].home_gadget, mData[2][7].home_gadget, mData[2][6].home_gadget, mData[2][5].home_gadget, mData[2][4].home_gadget, mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][11].lamp, mData[2][10].lamp, mData[2][9].lamp, mData[2][8].lamp, mData[2][7].lamp, mData[2][6].lamp, mData[2][5].lamp, mData[2][4].lamp, mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][11].film, mData[2][10].film, mData[2][9].film, mData[2][8].film, mData[2][7].film, mData[2][6].film, mData[2][5].film, mData[2][4].film, mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][11].gadget, mData[2][10].gadget, mData[2][9].gadget, mData[2][8].gadget, mData[2][7].gadget, mData[2][6].gadget, mData[2][5].gadget, mData[2][4].gadget, mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][11].power_bank, mData[2][10].power_bank, mData[2][9].power_bank, mData[2][8].power_bank, mData[2][7].power_bank, mData[2][6].power_bank, mData[2][5].power_bank, mData[2][4].power_bank, mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][11]['small_talk_bluetooth'], mData[2][10]['small_talk_bluetooth'], mData[2][9]['small_talk_bluetooth'], mData[2][8]['small_talk_bluetooth'], mData[2][7]['small_talk_bluetooth'], mData[2][6]['small_talk_bluetooth'], mData[2][5]['small_talk_bluetooth'], mData[2][4]['small_talk_bluetooth'], mData[2][3]['small_talk_bluetooth'], mData[2][2]['small_talk_bluetooth'], mData[2][1]['small_talk_bluetooth'], mData[2][0]['small_talk_bluetooth']],

					['Speaker', mData[2][11].speaker, mData[2][10].speaker, mData[2][9].speaker, mData[2][8].speaker, mData[2][7].speaker, mData[2][6].speaker, mData[2][5].speaker, mData[2][4].speaker, mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][11]['storage_memory_card'], mData[2][10]['storage_memory_card'], mData[2][9]['storage_memory_card'], mData[2][8]['storage_memory_card'], mData[2][7]['storage_memory_card'], mData[2][6]['storage_memory_card'], mData[2][5]['storage_memory_card'], mData[2][4]['storage_memory_card'], mData[2][3]['storage_memory_card'], mData[2][2]['storage_memory_card'], mData[2][1]['storage_memory_card'], mData[2][0]['storage_memory_card']],

					['Zhuaimao', mData[2][11].zhuaimao, mData[2][10].zhuaimao, mData[2][9].zhuaimao, mData[2][8].zhuaimao, mData[2][7].zhuaimao, mData[2][6].zhuaimao, mData[2][5].zhuaimao, mData[2][4].zhuaimao, mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][11].cancel, mData[2][10].cancel, mData[2][9].cancel, mData[2][8].cancel, mData[2][7].cancel, mData[2][6].cancel, mData[2][5].cancel, mData[2][4].cancel, mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][11].other, mData[2][10].other, mData[2][9].other, mData[2][8].other, mData[2][7].other, mData[2][6].other, mData[2][5].other, mData[2][4].other, mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 12) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth12, mth11, mth10, mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[2][12].adapter, mData[2][11].adapter, mData[2][10].adapter, mData[2][9].adapter, mData[2][8].adapter, mData[2][7].adapter, mData[2][6].adapter, mData[2][5].adapter, mData[2][4].adapter, mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][12].bag, mData[2][11].bag, mData[2][10].bag, mData[2][9].bag, mData[2][8].bag, mData[2][7].bag, mData[2][6].bag, mData[2][5].bag, mData[2][4].bag, mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][12].cable, mData[2][11].cable, mData[2][10].cable, mData[2][9].cable, mData[2][8].cable, mData[2][7].cable, mData[2][6].cable, mData[2][5].cable, mData[2][4].cable, mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][12].car_gadget, mData[2][11].car_gadget, mData[2][10].car_gadget, mData[2][9].car_gadget, mData[2][8].car_gadget, mData[2][7].car_gadget, mData[2][6].car_gadget, mData[2][5].car_gadget, mData[2][4].car_gadget, mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][12].case_for_smartphone, mData[2][11].case_for_smartphone, mData[2][10].case_for_smartphone, mData[2][9].case_for_smartphone, mData[2][8].case_for_smartphone, mData[2][7].case_for_smartphone, mData[2][6].case_for_smartphone, mData[2][5].case_for_smartphone, mData[2][4].case_for_smartphone, mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][12].case_for_tablet, mData[2][11].case_for_tablet, mData[2][10].case_for_tablet, mData[2][9].case_for_tablet, mData[2][8].case_for_tablet, mData[2][7].case_for_tablet, mData[2][6].case_for_tablet, mData[2][5].case_for_tablet, mData[2][4].case_for_tablet, mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][12].clearance, mData[2][11].clearance, mData[2][10].clearance, mData[2][9].clearance, mData[2][8].clearance, mData[2][7].clearance, mData[2][6].clearance, mData[2][5].clearance, mData[2][4].clearance, mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][12].creative, mData[2][11].creative, mData[2][10].creative, mData[2][9].creative, mData[2][8].creative, mData[2][7].creative, mData[2][6].creative, mData[2][5].creative, mData[2][4].creative, mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][12].gaming, mData[2][11].gaming, mData[2][10].gaming, mData[2][9].gaming, mData[2][8].gaming, mData[2][7].gaming, mData[2][6].gaming, mData[2][5].gaming, mData[2][4].gaming, mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][12].home_gadget, mData[2][11].home_gadget, mData[2][10].home_gadget, mData[2][9].home_gadget, mData[2][8].home_gadget, mData[2][7].home_gadget, mData[2][6].home_gadget, mData[2][5].home_gadget, mData[2][4].home_gadget, mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][12].lamp, mData[2][11].lamp, mData[2][10].lamp, mData[2][9].lamp, mData[2][8].lamp, mData[2][7].lamp, mData[2][6].lamp, mData[2][5].lamp, mData[2][4].lamp, mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][12].film, mData[2][11].film, mData[2][10].film, mData[2][9].film, mData[2][8].film, mData[2][7].film, mData[2][6].film, mData[2][5].film, mData[2][4].film, mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][12].gadget, mData[2][11].gadget, mData[2][10].gadget, mData[2][9].gadget, mData[2][8].gadget, mData[2][7].gadget, mData[2][6].gadget, mData[2][5].gadget, mData[2][4].gadget, mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][12].power_bank, mData[2][11].power_bank, mData[2][10].power_bank, mData[2][9].power_bank, mData[2][8].power_bank, mData[2][7].power_bank, mData[2][6].power_bank, mData[2][5].power_bank, mData[2][4].power_bank, mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][12]['small_talk_bluetooth'], mData[2][11]['small_talk_bluetooth'], mData[2][10]['small_talk_bluetooth'], mData[2][8]['small_talk_bluetooth'], mData[2][7]['small_talk_bluetooth'], mData[2][6]['small_talk_bluetooth'], mData[2][6]['small_talk_bluetooth'], mData[2][5]['small_talk_bluetooth'], mData[2][4]['small_talk_bluetooth'], mData[2][3]['small_talk_bluetooth'], mData[2][2]['small_talk_bluetooth'], mData[2][1]['small_talk_bluetooth'], mData[2][0]['small_talk_bluetooth']],

					['Speaker', mData[2][12].speaker, mData[2][11].speaker, mData[2][10].speaker, mData[2][9].speaker, mData[2][8].speaker, mData[2][7].speaker, mData[2][6].speaker, mData[2][5].speaker, mData[2][4].speaker, mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][12]['storage_memory_card'], mData[2][11]['storage_memory_card'], mData[2][10]['storage_memory_card'], mData[2][9]['storage_memory_card'], mData[2][8]['storage_memory_card'], mData[2][7]['storage_memory_card'], mData[2][6]['storage_memory_card'], mData[2][5]['storage_memory_card'], mData[2][4]['storage_memory_card'], mData[2][3]['storage_memory_card'], mData[2][2]['storage_memory_card'], mData[2][1]['storage_memory_card'], mData[2][0]['storage_memory_card']],

					['Zhuaimao', mData[2][12].zhuaimao, mData[2][11].zhuaimao, mData[2][10].zhuaimao, mData[2][9].zhuaimao, mData[2][8].zhuaimao, mData[2][7].zhuaimao, mData[2][6].zhuaimao, mData[2][5].zhuaimao, mData[2][4].zhuaimao, mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][12].cancel, mData[2][11].cancel, mData[2][10].cancel, mData[2][9].cancel, mData[2][8].cancel, mData[2][7].cancel, mData[2][6].cancel, mData[2][5].cancel, mData[2][4].cancel, mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][12].other, mData[2][11].other, mData[2][10].other, mData[2][9].other, mData[2][8].other, mData[2][7].other, mData[2][6].other, mData[2][5].other, mData[2][4].other, mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			}
		}



		var options = {
			title: lblType + ' Summary Chart',
			bars: 'vertical',
			vAxis: { format: 'decimal' },
			//hAxis: {direction:-1, slantedText:true, slantedTextAngle:90 },
			height: 500
		};

		var chart = new google.visualization.ColumnChart(document.getElementById('div-chart_product'));
		google.visualization.events.addListener(chart, 'ready', chartLoadedProduct);

		google.visualization.events.addListener(chart, 'select', function () {
			var selectedItem = chart.getSelection()[0];

			var categoryId = [2, 11, 1, 13, 5, 10, 16, 15, 30, 29, 38, 6, 9, 3, 4, 8, 21, 22, 19, 20];
			if (selectedItem) {
				var convertIndex = parseInt($('#selectPrevious').val()) + 2 - selectedItem.column;
				renderProductQuantity(categoryId[selectedItem.row], convertIndex);
			}
		});

		chart.draw(data, options);

		/*var chart = new google.charts.Bar(document.getElementById('div-chart1'));
		google.visualization.events.addListener(chart, 'ready', chartLoaded);
		chart.draw(data, google.charts.Bar.convertOptions(options));*/

	}
}

function chartLoadedProduct() {
	$('#box-chart_product').show();
	$('#box-chart_product .overlay').hide();
}

function renderProductQuantity(category, month) {
	$.post('https://api.remaxthailand.co.th/sale/shop/monthly/category', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: $('#cbb-shop4').val(),
		category: category,
		month: month,
	}, function (data) {
		if (data.success) {
			var type = $('#selectType').val().replace('type-', '');
			data.result.sort(sort_by(type + 'Rank', false, parseInt));
			html = '';
			for (i = 0; i < data.result.length; i++) {
				var result = data.result[i];
				html += '<tr><td class="text-' + ((result[type + 'Rank'] < result[type + 'RankPrev'] || result[type + 'RankPrev'] == 0) ? 'green' : ((result[type + 'Rank'] > result[type + 'RankPrev']) ? 'red' : 'primary')) + '">' +
					'<i class="fa fa-' + ((result[type + 'Rank'] < result[type + 'RankPrev'] || result[type + 'RankPrev'] == 0) ? 'chevron-circle-up' : ((result[type + 'Rank'] > result[type + 'RankPrev']) ? 'chevron-circle-down' : 'circle')) + '"></i> ' +
					result[type + 'Rank'] + ((result[type + 'RankPrev'] != 0 && result[type + 'Rank'] != result[type + 'RankPrev']) ? ' <small class="text-gray">(' + result[type + 'RankPrev'] + ')</small>' : '') + '</td>';
				html += '<td><i class="pointer text-muted fa fa-photo td-image" data-container="body" data-toggle="popover" data-placement="top" data-content="<img class=\'lazy\' data-original=\'//img.remaxthailand.co.th/100x100/product/' + result.sku + '/1.jpg\' src=\'//src.remaxthailand.co.th/img/Remax/web/gif/loading.gif\' width=\'100\'>"></i> ' + result.sku + '</td>';
				html += '<td>' + result.name + '</td>';
				html += '<td class="text-right data-qty">' + numberWithCommas(result.qty.toFixed(0)) + '</td>';
				html += '<td class="text-right data-cost">' + numberWithCommas(result.cost.toFixed(0)) + '</td>';
				html += '<td class="text-right data-sale">' + numberWithCommas(result.sale.toFixed(0)) + '</td>';
				html += '<td class="text-right data-profit">' + numberWithCommas(result.profit.toFixed(0)) + '</td></tr>';
			}

			$('#dv-monthlySaleByCategory tbody').html(html);
			$('#dv-monthlySaleByCategory .text-selected.text-green').removeClass('text-selected').removeClass('text-green');
			$('#dv-monthlySaleByCategory .font-bold').removeClass('font-bold');
			$('#dv-monthlySaleByCategory .data-' + type)
				.addClass('text-selected').addClass('text-green').addClass('font-bold');

			$('.td-image').popover({
				html: true,
				trigger: 'hover',
			});

			$('#dv-monthlySaleByCategory').slideDown();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function receivablePaid() {
	$('#dv-loading_data2creditp').show();
	$('.waitPaid').hide();
	$('#dv-no_data2creditp').hide();
	$.post('https://api.remaxthailand.co.th/account/receivable/paid', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: $('#cbb-shop2credit').val(),
		month: $('#selectPreviousPaid').val()
	}, function (data) {
		if (data.success) {
			var values = data.result;
			if (values.length > 0) {
				sortJSON(values, 'paidDate', 'desc');
				var html = '';

				for (i = 0; i < values.length; i++) {
					var result = values[i];
					//var no = i+1;
					html += '<tr>';
					html += '<td width="100" class="text-center" valign="middle">' + result.sellNo + '</td>';
					html += '<td width="100" class="text-center" valign="middle">' + result.name + '</td>';
					html += '<td width="100" class="text-center" valign="middle">' + moment(result.sellDate).utcOffset(+7).format('DD/MM/YYYY HH:mm') + '</td>';
					html += '<td width="100" class="text-center" valign="middle">' + moment(result.dueDate).utcOffset(+7).format('DD/MM/YYYY HH:mm') + '</td>';
					html += '<td width="100" class="sumTotalAmount text-center" valign="middle" data-val= ' + result.totalPrice + '>' + ((result.totalPrice == 0) ? '-' : numberWithCommas(result.totalPrice)) + '</td>';
					html += '<td width="100" class="text-center" valign="middle">' + result.sellBy + '</td>';
					html += '<td width="100" class="text-center" valign="middle">' + moment(result.paidDate).utcOffset((result.paidById.length >= 9) ? 0 : +7).format('DD/MM/YYYY HH:mm') + '</td>';
					html += '<td width="100" class="sumTotalPaidPrice text-center" valign="middle" data-val= ' + result.paidPrice + '>' + ((result.paidPrice == 0) ? '-' : numberWithCommas(result.paidPrice)) + '</td>';
					html += '<td width="100" class="text-center" valign="middle">' + result.paidBy + '</td>';
					html += '<td width="100" class="text-center" valign="middle">' + result.remark + '</td>';
					html += '</tr>';
				}
				$('#tb-result_paid tbody').html(html);
				$('#dv-loading_data2creditp').hide();
				$('#dv-no_data2creditp').hide();
				$('.waitPaid').show();

				$('#sumTotalAmount').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');
				$('#sumTotalPaidPrice').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');
				var sumTotalAmount = 0;
				var sumTotalPaidPrice = 0;
				$('.sumTotalAmount').each(function (index) {
					var value = $(this).attr('data-val');
					if (!isNaN(value) && value.length != 0) {
						sumTotalAmount += parseFloat(value);
					}
				});
				$('.sumTotalPaidPrice').each(function (index) {
					var value = $(this).attr('data-val');
					if (!isNaN(value) && value.length != 0) {
						sumTotalPaidPrice += parseFloat(value);
					}
				});

				$('#sumTotalAmount').html(((sumTotalAmount == 0) ? '-' : numberWithCommas(sumTotalAmount)));
				$('#sumTotalPaidPrice').html(((sumTotalPaidPrice == 0) ? '-' : numberWithCommas(sumTotalPaidPrice)));
			} else {
				$('#dv-loading_data2creditp').hide();
				$('#dv-no_data2creditp').show();
			}
		} else {
			$('#dv-loading_data2creditp').hide();
			$('#dv-no_data2creditp').show();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadReceivedData() {
	$('#dv-no_data3rc').hide();
	$('.wait3rc').hide();
	$('#dv-loading_data3rc').show();
	$('#tb-result3rc').hide();
	$('#tb-result3rc1').hide();
	$('#tb-result3rc2').hide();
	var date = $('#date_stock').val().split('/');
	var strDate = date[1] + '/' + date[0] + '/' + date[2];
	$.post('https://api.remaxthailand.co.th/shop/shopReceived', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: $('#cbb-shop3rc').val(),
		date: strDate
	}, function (data) {
		$('#dv-loading_data3rc').hide();
		if (data.success) {
			var valuesOrder = data.result[0];
			var valuesReceived = data.result[1];
			if (valuesOrder.length > 0) {
				//sortJSON(json, 'date', 'desc');
				var html1 = '';
				var html2 = '';
				var sumOrder = 0;
				var sumReceived = 0;

				for (i = 0; i < valuesOrder.length; i++) {
					var result = valuesOrder[i];
					//var no = i+1;
					html1 += '<tr>';
					html1 += '<td width="100" class="text-center" valign="middle">' + result.BillNumber + '</td>';
					html1 += '<td width="100" class="text-center" valign="middle">' + result.category + '</td>';
					html1 += '<td width="100" class="text-center" valign="middle">' + ((result.qty == 0) ? '-' : numberWithCommas(result.qty)) + '</td>';
					html1 += '</tr>';
					sumOrder += result.qty;
				}

				for (i = 0; i < valuesReceived.length; i++) {
					var result2 = valuesReceived[i];
					//var no = i+1;
					html2 += '<tr>';
					html2 += '<td width="100" class="text-center" valign="middle">' + result2.BillNumber + '</td>';
					html2 += '<td width="100" class="text-center" valign="middle">' + result2.category + '</td>';
					html2 += '<td width="100" class="text-center" valign="middle">' + ((result2.receiveQty == 0) ? '-' : numberWithCommas(result2.receiveQty)) + '</td>';
					html2 += '</tr>';
					sumReceived += result2.receiveQty;
				}
				$('#tb-result3rc1 tbody').html(html1);
				$('#sumOrder').html(numberWithCommas(sumOrder));
				$('#tb-result3rc2 tbody').html(html2);
				$('#sumReceived').html(numberWithCommas(sumReceived));

				$('#dv-loading_data3rc').hide();
				$('#dv-no_data3rc').hide();
				$('.wait3rc').show();
				$('#tb-result3rc1').show();
				$('#tb-result3rc2').show();
			} else {
				$('#dv-no_data3rc').show();
				$('#dv-loading_data3rc').hide();
				$('#tb-result3rc1').hide();
				$('#tb-result3rc2').hide();
			}

		} else {
			$('#dv-no_data3rc').show();
			$('#tb-result3rc').hide();
			$('#tb-result3rc1').hide();
			$('#tb-result3rc2').hide();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function sortJSON(data, key, way) {
	return data.sort(function (a, b) {
		var x = a[key]; var y = b[key];
		if (way === 'desc') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
		else { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
	});
};
var sort_by = function (field, reverse, primer) {
	var key = primer ?
		function (x) { return primer(x[field]) } :
		function (x) { return x[field] };

	reverse = !reverse ? 1 : -1;

	return function (a, b) {
		return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
	}
}

function loadYear() {
	$.post('https://api.remaxthailand.co.th/shop/DataYearInSell', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C'
	}, function (data) {
		if (data.success) {
			for (i = 0; i < data.result.length; i++) {
				var result = data.result[i];
				$('#cbb-year').append('<option value=' + result.year + '>' + result.year + '</option>');
				$('#cbb-yearc').append('<option value=' + result.year + '>' + result.year + '</option>');
			}
			$('#cbb-year option:eq(0)').attr('selected', 'selected');
			$('#cbb-yearc option:eq(0)').attr('selected', 'selected');
		}
		loadAllData()
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadChangPriceData() {
	$('#dv-no_data2changePrice').hide();
	$('.wait2changePrice').hide();
	$('#dv-loading_data2changePrice').show();
	$('#tb-result2changePrice').hide();
	$('#tb-result2changePrice').hide();
	var date = $('#changePrice #date').val().split('/');
	var strDate = date[1] + '/' + date[0] + '/' + date[2];
	$.post('https://api.remaxthailand.co.th/shop/changePriceDaily', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: $('#cbb-shop2changePrice').val(),
		date: strDate
	}, function (data) {
		$('#dv-loading_data2changePrice').hide();
		if (data.success) {
			var values = data.result;
			if (values.length > 0) {
				//sortJSON(json, 'date', 'desc');
				var sumQty = 0;
				var sumPrice = 0;
				var sumPriceDiscount = 0;
				var sumPricePerUnit = 0;

				var html1 = '';
				for (i = 0; i < values.length; i++) {
					var result = values[i];
					//var no = i+1;
					html1 += '<tr>';
					html1 += '<td width="100" class="" valign="middle">' + result.name + '</td>';
					html1 += '<td width="20" class="text-center" valign="middle">' + numberWithCommas(result.qty) + '</td>';
					html1 += '<td width="20" class="text-center" valign="middle">' + numberWithCommas(result.price) + '</td>';
					html1 += '<td width="20" class="text-center" valign="middle">' + numberWithCommas(result.priceDiscount) + '</td>';
					html1 += '<td width="20" class="text-center" valign="middle">' + numberWithCommas(result.pricePerUnit) + '</td>';
					html1 += '</tr>';

					sumQty += result.qty;
					sumPrice += result.price;
					sumPriceDiscount += result.priceDiscount;
					sumPricePerUnit += result.pricePerUnit;
				}
				$('#tb-result2changePrice tbody').html(html1);
				$('#sumQty').html(numberWithCommas(sumQty));
				$('#sumPrice').html(numberWithCommas(sumPrice));
				$('#sumPriceDiscount').html(numberWithCommas(sumPriceDiscount));
				$('#sumPricePerUnit').html(numberWithCommas(sumPricePerUnit));
				$('#dv-loading_data2changePrice').hide();
				$('#dv-no_data2changePrice').hide();
				$('.wait2changePrice').show();
				$('#tb-result2changePrice').show();
			} else {
				$('#dv-no_data2changePrice').show();
				$('#dv-loading_data2changePrice').hide();
				$('#tb-result2changePrice').hide();
			}
		} else {
			$('#dv-no_data2changePrice').show();
			$('#tb-result2changePrice').hide();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadReturnProductData() {
	$('#dv-no_data2returnProduct').hide();
	$('.wait2returnProduct').hide();
	$('#dv-loading_data2returnProduct').show();
	$('#tb-result2returnProduct').hide();
	var dateF = $('#returnProduct #dateFrom').val().split('/');
	var dateT = $('#returnProduct #dateTo').val().split('/');
	var strDateF = dateF[1] + '/' + dateF[0] + '/' + dateF[2];
	var strDateT = dateT[1] + '/' + dateT[0] + '/' + dateT[2];
	$.post('https://api.remaxthailand.co.th/shop/returnProduct', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: $('#cbb-shop2returnProduct').val(),
		dateF: strDateF,
		dateT: strDateT
	}, function (data) {
		$('#dv-loading_data2returnProduct').hide();
		if (data.success) {
			var values = data.result;
			if (values.length > 0) {
				var html1 = '';
				for (i = 0; i < values.length; i++) {
					var result = values[i];
					//var no = i+1;
					html1 += '<tr>';
					html1 += '<td width="20" class="text-center" valign="middle">' + moment(result.returnDate).utcOffset(+7).format('DD/MM/YYYY HH:mm') + '</td>';
					html1 += '<td width="10" class="text-center" valign="middle">' + result.sellNo + '</td>';
					html1 += '<td width="20" class="text-center" valign="middle">' + moment(result.sellDate).utcOffset(+7).format('DD/MM/YYYY HH:mm') + '</td>';
					html1 += '<td width="30" class="text-center" valign="middle">' + result.name + '</td>';
					html1 += '<td width="80" class="text-left" valign="middle">' + result.productName + '</td>';
					html1 += '<td width="40" class="text-center" valign="middle">' + result.barcode + '</td>';
					html1 += '<td width="20" class="text-center" valign="middle">' + numberWithCommas(result.sellPrice) + '</td>';
					html1 += '<td width="30" class="text-center" valign="middle">' + result.empName + '</td>';
					html1 += '</tr>';
				}
				$('#tb-result2returnProduct tbody').html(html1);
				$('#dv-loading_data2returnProduct').hide();
				$('#dv-no_data2returnProduct').hide();
				$('.wait2returnProduct').show();
				$('#tb-result2returnProduct').show();
			} else {
				$('#dv-no_data2returnProduct').show();
				$('#dv-loading_data2returnProduct').hide();
				$('#tb-result2returnProduct').hide();
			}
		} else {
			$('#dv-no_data2returnProduct').show();
			$('#tb-result2returnProduct').hide();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadSellSummaryData() {
	$('#dv-no_data2dailysales').hide();
	$('.wait2dailysales').hide();
	$('#dv-loading_data2dailysales').show();
	$('#tb-result2dailysales').hide();
	$('#tb-result2dailysales').hide();
	var date = $('#dailysales #date').val().split('/');
	var strDate = date[1] + '/' + date[0] + '/' + date[2];
	$.post('https://api.remaxthailand.co.th/shop/SellSummary', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: $('#cbb-shop2dailysales').val(),
		date: strDate
	}, function (data) {
		$('#dv-loading_data2dailysales').hide();
		if (data.success) {
			var values = data.result;
			if (values.length > 0) {
				var html1 = '';
				for (i = 0; i < values.length; i++) {
					var result = values[i];
					//var no = i+1;
					html1 += '<tr>';
					html1 += '<td width="10" class="text-center" valign="middle">' + moment(result.sellDate).utcOffset(+7).format('DD/MM/YYYY HH:mm') + '</td>';
					html1 += '<td width="20" class="text-center text-bold pointer sell-detail" valign="middle" data-placement="top" data-toggle="modal" data-target="#dv-selldetail" data-sellDetail="'+result.sellNo+'">' + result.sellNo + '</td>';
					html1 += '<td width="80" class="text-center" valign="middle">' + result.name + '</td>';
					html1 += '<td width="20" class="text-center" valign="middle">' + numberWithCommas(result.sellPrice) + '</td>';
					html1 += '<td width="20" class="text-center" valign="middle">' + numberWithCommas(result.discountCash)+ '</td>';
					html1 += '<td width="20" class="text-center" valign="middle">' + numberWithCommas(result.totalPrice) + '</td>';
					html1 += '<td width="40" class="text-center' + ((result.payType == 0) ? ' text-danger' : '') +'" valign="middle">' + ((result.payType == 0) ? 'ยังไม่ชำระเงิน' : 'ชำระเงินแล้ว') + '</td>';
					html1 += '<td width="60" class="text-center" valign="middle">' + result.empName + '</td>';
					html1 += '</tr>';
				} 
				$('#tb-result2dailysales tbody').html(html1);
				$('#dv-loading_data2dailysales').hide();
				$('#dv-no_data2dailysales').hide();
				$('.wait2dailysales').show();
				$('#tb-result2dailysales').show();
			} else {
				$('#dv-no_data2dailysales').show();
				$('#dv-loading_data2dailysales').hide();
				$('#tb-result2dailysales').hide();
			}
		} else {
			$('#dv-no_data2dailysales').show();
			$('#tb-result2dailysales').hide();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}