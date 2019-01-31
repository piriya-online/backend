$(function() {

	loadCategory();
	//loadData('adapter');
	$(document).on('change', '#cbb-category', function(){
		Cookies.set('category', $(this).val());
		loadData( Cookies.get('category') );
	});

});

function loadCategory(){
	$('#dv-loading').show();
	$('#dv-no_data, #tb-result').hide();
	$.post($('#apiUrl').val()+'/product/category/info', {
		authKey: $('#authKey').val(),
		shop: 99
	}, function(data){
		if (data.success) {
			if ( Cookies.get('category') == undefined )
				Cookies.set('category', data.result[0].url );
			loadData( Cookies.get('category') );
			for( i=0; i<data.result.length; i++ ) {
				var result = data.result[i];
				$('#cbb-category').append('<option value="'+result.url+'"'+(Cookies.get('category') == result.url ? ' selected' : '')+'>'+result.name+'</option>');
			}
			$('#cbb-category')
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadData(category){
	$('#dv-loading').show();
	$('#dv-no_data, #tb-result').hide();
	$.post($('#apiUrl').val()+'/product/info/price', {
		authKey: $('#authKey').val(),
		category: category,
	}, function(data){
		$('#dv-loading').hide();
		if (data.success) {

			if ( data.percent[0] == undefined )
			{
				data.percent[0] = {};
				data.percent[0].price = data.percent[0].price1 = data.percent[0].price2 = data.percent[0].price3 = data.percent[0].price4 = data.percent[0].price5 = data.percent[0].price6 = data.percent[0].price7 = 0;
			}

			$('#tb-result thead .price').html( data.percent[0].price+'%' );
			$('#tb-result thead .price1').html( data.percent[0].price1+'%' );
			$('#tb-result thead .price2').html( data.percent[0].price2+'%' );
			$('#tb-result thead .price3').html( data.percent[0].price3+'%' );
			$('#tb-result thead .price4').html( data.percent[0].price4+'%' );
			$('#tb-result thead .price5').html( data.percent[0].price5+'%' );
			$('#tb-result thead .priceChain').html( data.percent[0].price6+'%' );
			$('#tb-result thead .priceChainSrp').html( '&nbsp;' );
			

			var html = '';

			for( i=0; i<data.result.length; i++ ) {
				var result = data.result[i];
				
				var price = {};
				price[5] = result.cost*(100+data.percent[0].price5)/100;
				price[4] = price[5]*(100+data.percent[0].price4)/100;
				price[6] = price[4]*(100+data.percent[0].price6)/100;
				price[7] = (price[4]+price[5])/2
				price[3] = price[4]*(100+data.percent[0].price3)/100;
				price[2] = price[3]*(100+data.percent[0].price2)/100;
				price[1] = price[2]*(100+data.percent[0].price1)/100;
				price[0] = price[1]*(100+data.percent[0].price)/100;

				html += '<tr id="'+result.id+'"><td width="50"><img src="https://img.remaxthailand.co.th/50x50/product/'+result.sku+'/1.jpg" width="50"></td>';
				html += '<td><small>'+result.sku+'</small><span class="update pull-right badge bg-'+(result.isStockUpdate ? 'red' : 'gray')+' ">UPDATE</span><br>'+result.name+'</td>';
				html += '<td class="text-right font-bigger">'+result.stock+'<br>';
                html += '<i class="fa fa-lg i-visible '+(result.visible ? 'text-success fa-eye' : 'text-danger fa-eye-slash')+' "></i></td>';
				html += '<td class="text-right"><input data-index = "0" class="form-control input-sm price-input font-biggest hidden" type="text" />';
				html += '<b class="current font-biggest '+((result.price < price[0]) ? 'text-red' : ((result.price > price[0]) ? 'text-green' : ''))+'" data-value="'+result.price+'">'+result.price+'</b><br>';
				html += '<small class="suggest price">'+price[0].toFixed(2)+'</small></td>';
				html += '<td class="text-right"><input data-index = "1" class="form-control input-sm price-input font-biggest hidden" type="text" />';
				html += '<b class="current font-biggest '+((result.price1 < price[1]) ? 'text-red' : ((result.price1 > price[1]) ? 'text-green' : ''))+'" data-value="'+result.price1+'">'+result.price1+'</b>';
				html += '<br><small class="suggest price1">'+price[1].toFixed(2)+'</small></td>';
				html += '<td class="text-right"><input data-index = "2" class="form-control input-sm price-input font-biggest hidden" type="text" />';
				html += '<b class="current font-biggest '+((result.price2 < price[2]) ? 'text-red' : ((result.price2 > price[2]) ? 'text-green' : ''))+'" data-value="'+result.price2+'">'+result.price2+'</b>';
				html += '<br><small class="suggest price2">'+price[2].toFixed(2)+'</small></td>';
				html += '<td class="text-right"><input data-index = "3" class="form-control input-sm price-input font-biggest hidden" type="text" />';
				html += '<b class="current font-biggest '+((result.price3 < price[3]) ? 'text-red' : ((result.price3 > price[3]) ? 'text-green' : ''))+'" data-value="'+result.price3+'">'+result.price3+'</b>';
				html += '<br><small class="suggest price3">'+price[3].toFixed(2)+'</small></td>';
				html += '<td class="text-right"><input data-index = "6" class="form-control input-sm price-input font-biggest hidden" type="text" />';
				html += '<b class="current font-biggest '+((result.price6 < price[6]) ? 'text-red' : ((result.price6 > price[6]) ? 'text-green' : ''))+'" data-value="'+result.price6+'">'+result.price6+'</b>';
				html += '<br><small class="suggest price6">'+price[6].toFixed(2)+'</small></td>';
				html += '<td class="text-right"><input data-index = "4" class="form-control input-sm price-input font-biggest hidden" type="text" />';
				html += '<b class="current font-biggest '+((result.price4 < price[4]) ? 'text-red' : ((result.price4 > price[4]) ? 'text-green' : ''))+'" data-value="'+result.price4+'">'+result.price4+'</b>';
				html += '<br><small class="suggest price4">'+price[4].toFixed(2)+'</small></td>';
				html += '<td class="text-right"><input data-index = "7" class="form-control input-sm price-input font-biggest hidden" type="text" />';
				html += '<b class="current font-biggest '+((result.price7 < price[7]) ? 'text-red' : ((result.price7 > price[7]) ? 'text-green' : ''))+'" data-value="'+result.price7+'">'+result.price7+'</b>';
				html += '<br><small class="suggest price7">'+price[7].toFixed(2)+'</small></td>';
				html += '<td class="text-right"><input data-index = "5" class="form-control input-sm price-input font-biggest hidden" type="text" />';
				html += '<b class="current font-biggest '+((result.price5 < price[5]) ? 'text-red' : ((result.price5 > price[5]) ? 'text-green' : ''))+'" data-value="'+result.price5+'">'+result.price5+'</b>';
				html += '<br><small class="suggest price5">'+price[5].toFixed(2)+'</small></td>';
				html += '<td class="text-right"><b class="current font-biggest text-blue">'+result.cost.toFixed(2)+'</b><br>';
				html += '<span class="btn-cancel btn btn-warning btn-xs margin-right-5 hidden"><i class="fa fa-rotate-left"></i></span><span class="btn-save btn btn-success btn-xs hidden"><i class="fa fa-save"></i></span></td>';
				html += '</tr>';
			}

			$('#tb-result tbody').html( html );
			
			$('.show-tooltip').tooltip();
			$('i.text-muted').css('opacity', 0.3);
			$('.wait').show();
			$('.hidden').removeClass('hidden').hide();
			if (data.result.length == 0)
			{
				$('#dv-no_data').show();
				//$('#tb-result').hide();
			}
			else {
				$('#dv-no_data').hide();
			}

			$('.price-input').ForceNumericOnly();

		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}