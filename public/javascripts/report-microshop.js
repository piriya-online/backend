var agingData;
var runrateDate;
var config = {};
var result;
var shopID = '';
var currentYear = '';
var firstload = true;
var monthEn2 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec','Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
$(function() {
	loadShop();

	var d = new Date();
	var m = moment(d);
	currentYear = m.format('YYYY');
	$('.datepicker').datepicker('update', new Date());
	
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

	$('#btn-submit').click(function(){
        loadSalesData();
        return false;
    });

	$(document).on('change', '#cbb-microshop', function(){
		Cookies.set('shopSelected', $(this).val());
		$('.select-shop').val($(this).val())
		loadSalesData();
	});


});


function loadShop(){
	$('#dv-loading').show();
	$('#dv-no_data, #tb-result').hide();
	$.post('https://api.remaxthailand.co.th/shop/microShop/shopid', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val()
	}, function(data){
		if (data.success) {
			if (data.result.length > 0) {
                shopID = data.result[0].shop;;
				loadSalesData()
			} else {
				$('#dv-loading').hide();
				$('#dv-no_data, #tb-result').show();
			}
		} else {
			$('#dv-loading').hide();
			$('#dv-no_data, #tb-result').show();
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};

function loadSalesData(){
	$('#dv-no_data').hide();
	$('.wait').hide();
	$('#dv-loading_data').show();
	$('#tb-result').hide();
	var dateFrom = $('#dateFrom').val().split('/');
	var dateTo = $('#dateTo').val().split('/');
	var strDateFrom = dateFrom[1] + '/' + dateFrom[0] + '/' +  dateFrom[2];
	var strDateTo = dateTo[1] + '/' + dateTo[0] + '/' +  dateTo[2];

	$.post('https://api.remaxthailand.co.th/shop/microShop/salesSummarry', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: shopID,
		date_from: strDateFrom,
		date_to: strDateTo
	}, function(data){
		$('#dv-loading_data').hide();
		if (data.success) {
			json = data.result;
			sortJSON(json, 'date', 'desc');
			var html = '';

			for( i=0; i<json.length; i++ ) {
				var result = json[i];

				var no = i+1;
				html += '<tr>';
				html += '<td width="10" class="text-center" valign="middle">'+moment(result.date).utcOffset(0).format('DD/MM/YYYY')+'</td>';
				html += '<td width="50" class="sumBill text-center" valign="middle" data-val= '+result.billQty+'>'+((result.billQty == 0) ? '-' : numberWithCommas(result.billQty))+'</td>';
				html += '<td width="200" class="sumSales text-center active" valign="middle" data-val= '+result.sales+'>'+((result.sales == 0) ? '-' : numberWithCommas(result.sales))+'</td>';
				html += '<td width="200" class="sumDiscountCash text-center active" valign="middle" data-val= '+result.discount+'>'+((result.discount == 0) ? '-' : numberWithCommas(result.discount))+'</td>';
				html += '<td width="200" class="sumTotal text-center text-bold active" valign="middle" data-val= '+result.total+'>'+((result.total == 0) ? '-' : numberWithCommas(result.total))+'</td>';
				html += '<td width="200" class="sumCost text-center text-muted " valign="middle" data-val= '+result.cost+'>'+((result.cost == 0) ? '-' : numberWithCommas(result.cost))+'</td>';
				html += '<td width="200" class="sumProfit text-center text-muted " valign="middle" data-val= '+result.profit+'>'+((result.profit == 0) ? '-' : numberWithCommas(result.profit))+'</td>';
				html += '</tr>';
			}

			$('#tb-result tbody').html( html );
			summary();
			if (data.result.length == 0)
			{
				$('#dv-no_data').show();
				$('#tb-result').hide();
			}
			//$("#tb-result2").DataTable();
			$('.wait').show();
			$('.hidden').removeClass('hidden').hide();

		}else {
			$('#dv-no_data').show();
			$('#tb-result').hide();
		}

	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};
function summary(){
	$('#sumCash').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');
	$('#sumDiscountCash').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');
	$('#sumTotal').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');
	$('#sumCost').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">');
	$('#sumProfit').html('<img class="loading" alt="loading" src="/images/icons/loading.gif">'); 

	var sumBill = 0;
	var sumCash = 0;
	var sumDiscountCash = 0;
	var sumTotal = 0;
	var sumCost = 0;
	var sumProfit = 0;

	$('.sumBill').each(function(index) {
		var value = $(this).attr('data-val');
		if(!isNaN(value) && value.length != 0) {
			sumBill += parseFloat(value);
		}
	});
	$('.sumSales').each(function(index) {
		var value = $(this).attr('data-val');
		if(!isNaN(value) && value.length != 0) {
			sumCash += parseFloat(value);
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
		if(!isNaN(value) && value.length != 0) {
			sumTotal += parseFloat(value);
		}
	});
	$('.sumCost').each(function(index) {
		var value = $(this).attr('data-val');
		if(!isNaN(value) && value.length != 0) {
			sumCost += parseFloat(value);
		}
	});
	$('.sumProfit').each(function(index) {
		var value = $(this).attr('data-val');
		if(!isNaN(value) && value.length != 0) {
			sumProfit += parseFloat(value);
		}
	});
;

	$('#sumBill').html(((sumBill == 0) ? '-' : numberWithCommas(sumBill)));
	$('#sumCash').html(((sumCash == 0) ? '-' : numberWithCommas(sumCash.toFixed(2))));
	$('#sumDiscountCash').html(((sumDiscountCash == 0) ? '-' : numberWithCommas(sumDiscountCash.toFixed(2))));
	$('#sumTotal').html(((sumTotal == 0) ? '-' : numberWithCommas(sumTotal.toFixed(2))));
	$('#sumCost').html(((sumCost == 0) ? '-' : numberWithCommas(sumCost.toFixed(2))));
	$('#sumProfit').html(((sumProfit == 0) ? '-' : numberWithCommas(sumProfit.toFixed(2))));
};
function sortJSON(data, key, way) {
    return data.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        if (way === 'desc') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
		else { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
    });
};
var sort_by = function(field, reverse, primer){
   var key = primer ?
       function(x) {return primer(x[field])} :
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     }
}
