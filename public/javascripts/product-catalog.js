$(function() {
	
	loadCategory();
	
	$(document).on('click', '#btn-submit', function(){
		loadData();
	});
	$(document).on('change', '#cbb-category', function(){
		Cookies.set('category', $(this).val());
	});

	$('#dv-catalog').scrollToFixed({ marginTop: 10 });
	
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
	
	$(document).on('click', '.btn-add', function(){
		$.post('https://api.remaxthailand.co.th/catalog/add', {
			apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
			memberKey: $('#authKey').val(),
			product: $(this).attr('value'),
			sellPrice: $('#selectPrice :selected').attr('value'),
			priceSRP: $('#priceSRP :selected').attr('value')
		}, function(data){
				if (data.success) {
					if (data.result[0].exist){
						console.log('Exist')
						
					}else{
						if (data.result[0].qty > 0){
							$('#items-qty').html( numberWithCommas(data.result[0].qty) );
							$('.sp-no_item').hide();
							$('.sp-has_item').show();
						}
					}	
				
				}

				$('#dv-catalog').css('background', '#ffcc99');
				setTimeout(function(){
					$('#dv-catalog').stop().css('background', 'white');
				}, 1000);

		}, 'json');
	});
});

function loadCategory(){
	$('#dv-loading').show();
	$('#dv-no_data, #tb-result').hide();
	$.post('https://api.remaxthailand.co.th/category/info', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: 'POWERDDH-8888-8888-B620-48D3B6489999'
	}, function(data){
		if (data.success) {
			if ( Cookies.get('category') == undefined )
				Cookies.set('category', data.result[0].url );
			for( i=0; i<data.result.length; i++ ) {
				var result = data.result[i];
				$('#cbb-category').append('<option value="'+result.url+'"'+(Cookies.get('category') == result.url ? ' selected' : '')+'>'+result.name+'</option>');
			}
			$('#dv-loading').hide();
			$('#form-select').show();
			loadSummary();
			
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadData(){
	$('#dv-loading_data').show();
	$('.wait').hide();
	$.post('https://api.remaxthailand.co.th/catalog/product', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		category: $('#cbb-category :selected').attr('value'),
		price: $('#selectPrice :selected').attr('value'), 
		priceSRP: $('#priceSRP :selected').attr('value')
	}, function(data){
		$('#dv-loading_data').hide();
		if (data.success) {
			
			var html = '';

			for( i=0; i<data.result.length; i++ ) {
				var result = data.result[i];
				
				var no = i+1;
				html += '<tr id="'+result.id+'">';
				html += '<td width="10" class="text-center" valign="middle"><button class="btn-product-' + result.id + ' btn-add btn btn-sm btn-warning" data-target="#dv-add" data-toggle="modal" value='+ result.id +'>เพิ่ม</button></td>';
				html += '<td width="10" class="text-center" valign="middle">'+no+'</td>';
				html += '<td width="20" class="text-center" valign="middle">'+result.sku+'</td>';
				html += '<td width="90" class="text-center" valign="middle">'+result.name+'</td>';
				html += '<td width="50" class="text-center"><img src="https://img.remaxthailand.co.th/100x100/product/'+result.sku+'/1.jpg" width="100"></td>';
				html += '<td width="20" class="text-center" valign="middle">'+numberWithCommas(result.selectPrice)+'</td>';
				html += '<td width="20" class="text-center" valign="middle">'+numberWithCommas(result.priceSRP)+'</td>';
				html += '</tr>'; 
			}
		}
		$('#tb-result tbody').html( html );
		if (data.result.length == 0)
		{
			$('#dv-no_data').show();
			$('#tb-result').hide();
		}
		$('.wait').show();
		$('.hidden').removeClass('hidden').hide();
		
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadSummary(){
	$.post('https://api.remaxthailand.co.th/catalog/summary', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val()
	}, function(data){
		if (data.success) {
			if (data.result[0].qty > 0){
				$('#items-qty').html( numberWithCommas(data.result[0].qty) );
				$('.sp-no_item').hide();
				$('.sp-has_item').show();
			}
		}
		$('#dv-catalog').show()
		$('#dv-catalog').css('background', '#ffcc99');
		setTimeout(function(){
			$('#dv-catalog').stop().css('background', 'white');
		}, 1000)
		
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}