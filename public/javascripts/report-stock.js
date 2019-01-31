$(function() {

	loadBrand();
	$('.datepicker').datepicker('update', new Date());
	loadSummaryStock();

	$(document).on('change', '#cbb-brand', function() {
		$('#btn-aging').html('Stock Aging Report '+$('#cbb-brand option:selected').html());
		$('#btn-run_rate').html('Stock Run Rate Report '+$('#cbb-brand option:selected').html());
	});

	$('#btn-aging').click(function() {
		window.open('https://api.remaxthailand.co.th/report/aging-brand/1/' + $('#cbb-brand').val(), '_blank');
		return false;
	});

	$('#btn-run_rate').click(function() {
		window.open('https://api.remaxthailand.co.th/report/run_rate-brand/1/' + $('#cbb-brand').val(), '_blank');
		return false;
	});

	$('#btn-search').click(function() {
		loadSummaryStock();
	});
 	
});


function loadBrand(){
	//$('#dv-loading').show();
	//$('#dv-no_data, #tb-result').hide();
	$.post('https://api.remaxthailand.co.th/brand/member', {
		apiKey:	'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val()
	}, function(data){
		if (data.success) {
			if(data.result.length > 1){
				$('#cbb-brand').append('<option value="">ทั้งหมด</option>');
			}
			for( i=0; i<data.result.length; i++ ) {
				var result = data.result[i];
				$('#cbb-brand').append('<option value="'+result.url+'">'+result.name+'</option>');
			}
			$('#cbb-brand option:eq(0)').attr('selected', 'selected');
			$('wait').show();
			$('#btn-aging').html('Stock Aging Report '+$('#cbb-brand option:selected').html());
			$('#btn-run_rate').html('Stock Run Rate Report '+$('#cbb-brand option:selected').html());
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadSummaryStock(){
	$('#dv-loading_data').show();
	$('#dv-no_data').hide();
	$('.wait').hide();

	var date = $('#date').val().split('/');
	var strDate = date[1] + '/' + date[0] + '/' +  date[2];
	$.post('https://api.remaxthailand.co.th/product/summaryStock', {
		apiKey:	'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		date: strDate,
		brand: ''
	}, function(data){
		if (data.success) {
			if(data.result.length > 0){

				var html = '';
				for( i=0; i<data.result.length; i++ ) {
					var result = data.result[i];

					html += '<tr>';
					html += '<td class="" valign="middle">'+result.categoryName+'</td>';
					html += '<td class="text-right sumremaxQty" valign="middle" data-val='+ result.remaxQty +'>'+(result.remaxQty != 0 ? numberWithCommas(result.remaxQty) : '-')+'</td>';
					html += '<td class="text-right sumremaxPrice" valign="middle" data-val='+ result.remaxPrice +'>'+(result.remaxPrice != 0 ? numberWithCommas(result.remaxPrice) : '-')+'</td>';
					
					html += '<td class="text-right sumwkQty" valign="middle" data-val='+ result.wkQty +'>'+(result.wkQty != 0 ? numberWithCommas(result.wkQty) : '-')+'</td>';
					html += '<td class="text-right sumwkPrice" valign="middle" data-val='+ result.wkPrice +'>'+(result.wkPrice != 0 ? numberWithCommas(result.wkPrice) : '-')+'</td>';

					html += '<td class="text-right sumpisenQty" valign="middle" data-val='+ result.pisenQty +'>'+(result.pisenQty != 0 ? numberWithCommas(result.pisenQty) : '-')+'</td>';
					html += '<td class="text-right sumpisenPrice" valign="middle" data-val='+ result.pisenPrice +'>'+(result.pisenPrice != 0 ? numberWithCommas(result.pisenPrice) : '-')+'</td>';

					html += '<td class="text-right sumpngQty" valign="middle" data-val='+ result.pngQty +'>'+(result.pngQty != 0 ? numberWithCommas(result.pngQty) : '-')+'</td>';
					html += '<td class="text-right sumpngPrice" valign="middle" data-val='+ result.pngPrice +'>'+(result.pngPrice != 0 ? numberWithCommas(result.pngPrice) : '-')+'</td>';

					html += '</tr>';		
					
				}

				$('#tb-result tbody').html( html );

					var sumremaxQty = 0;
					var sumremaxPrice = 0;
					var sumwkQty = 0;
					var sumwkPrice = 0;
					var sumpisenQty = 0;
					var sumpisenPrice = 0;
					var sumpngQty = 0;
					var sumpngPrice = 0;
					$('.sumremaxQty').each(function(index) {
						var value = $(this).attr('data-val');
						if(!isNaN(value) && value.length != 0) {
							sumremaxQty += parseFloat(value);
						}
					});
					$('.sumremaxPrice').each(function(index) {
						var value = $(this).attr('data-val');
						if(!isNaN(value) && value.length != 0) {
							sumremaxPrice += parseFloat(value);
						}
					});
					$('.sumwkQty').each(function(index) {
						var value = $(this).attr('data-val');
						if(!isNaN(value) && value.length != 0) {
							sumwkQty += parseFloat(value);
						}
					});
					$('.sumwkPrice').each(function(index) {
						var value = $(this).attr('data-val');
						if(!isNaN(value) && value.length != 0) {
							sumwkPrice += parseFloat(value);
						}
					});
					$('.sumpisenQty').each(function(index) {
						var value = $(this).attr('data-val');
						if(!isNaN(value) && value.length != 0) {
							sumpisenQty += parseFloat(value);
						}
					});
					$('.sumpisenPrice').each(function(index) {
						var value = $(this).attr('data-val');
						if(!isNaN(value) && value.length != 0) {
							sumpisenPrice += parseFloat(value);
						}
					});
					$('.sumpngQty').each(function(index) {
						var value = $(this).attr('data-val');
						if(!isNaN(value) && value.length != 0) {
							sumpngQty += parseFloat(value);
						}
					});
					$('.sumpngPrice').each(function(index) {
						var value = $(this).attr('data-val');
						if(!isNaN(value) && value.length != 0) {
							sumpngPrice += parseFloat(value);
						}
					});

					$('#sumremaxQty').html(((sumremaxQty == 0) ? '-' : numberWithCommas(sumremaxQty)));
					$('#sumremaxPrice').html(((sumremaxPrice == 0) ? '-' : numberWithCommas(sumremaxPrice)));
					$('#sumwkQty').html(((sumwkQty == 0) ? '-' : numberWithCommas(sumwkQty)));
					$('#sumwkPrice').html(((sumwkPrice == 0) ? '-' : numberWithCommas(sumwkPrice)));
					$('#sumpisenQty').html(((sumpisenQty == 0) ? '-' : numberWithCommas(sumpisenQty)));
					$('#sumpisenPrice').html(((sumpisenPrice == 0) ? '-' : numberWithCommas(sumpisenPrice)));
					$('#sumpngQty').html(((sumpngQty == 0) ? '-' : numberWithCommas(sumpngQty)));
					$('#sumpngPrice').html(((sumpngPrice == 0) ? '-' : numberWithCommas(sumpngPrice)));

				$('.wait').show();
				$('#dv-loading_data').hide();
			}else{
				$('#dv-loading_data').hide();
				$('#dv-no_data').show();				
			}		
		}else{
			$('#dv-loading_data').hide();
			$('#dv-no_data').show();
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}
