$(function() {

	loadCustomerName();

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

	$('#btn-search').click(function(){
        loadData();
        return false;
    });

	$('#btn-export').click(function(){
        $('.table2excel').table2excel({
			exclude: ".noExl",
			name: "Excel Document Name",
			filename: "PriceListRemaxthailand "+$('#customerName').html(),
			fileext: ".xls",
			exclude_img: true,
			exclude_links: true,
			exclude_inputs: true
		});
        return false;
    });

});

function loadData(){
	$('#dv-loading').show();

	$.post('https://api.remaxthailand.co.th/catalog/info', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val(),
		customerName: $('#cbb-customerName :selected').attr('value')
	}, function(data){
		$('#dv-loading').hide();
		if (data.success) {
			$('#customerName').html($('#cbb-customerName :selected').attr('value'));
			var html = '';

			for( i=0; i<data.result.length; i++ ) {
				var result = data.result[i];

				var no = i+1;
				html += '<tr id="'+result.product+'">';
				html += '<td width="10" class="text-center" valign="middle">'+no+'</td>';
				html += '<td width="20" class="text-center" valign="middle">'+result.sku+'</td>';
				html += '<td width="90" class="text-center" valign="middle">'+result.name+'</td>';
				html += '<td width="50" class="text-center"><img src="https://img.remaxthailand.co.th/100x100/product/'+result.sku+'/1.jpg" width="100"></td>';
				html += '<td width="20" class="text-center" valign="middle">'+numberWithCommas(result.selectPrice)+'</td>';
				html += '<td width="20" class="text-center" valign="middle">'+numberWithCommas(result.priceSRP)+'</td>';
				html += '</tr>';
			}

			$('#tb-result tbody').html( html );
			if (data.result.length == 0)
			{
				$('#dv-no_data').show();
				$('#tb-result').hide();
			}
			//$("#tb-result").DataTable();
			$('.wait').show();
			$('.hidden').removeClass('hidden').hide();
			$('#dv-head').hide();
		}else{
			$('#dv-no_data').show();
		}


	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadCustomerName(){
	$('#dv-loading').show();
	$('#dv-no_data, #tb-result').hide();
	$.post('https://api.remaxthailand.co.th/catalog/customer', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val(),
	}, function(data){
		if (data.success) {
			for( i=0; i<data.result.length; i++ ) {
				var result = data.result[i];
				$('#cbb-customerName').append('<option value='+result.customer+'>'+result.customer+'</option>');
			}
			$('#dv-loading').hide();
			$('#form-select').show();
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}
