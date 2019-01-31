$(function() {
	
	loadData();
	
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

	
	$('#btn-export').click(function(){
        catalogConfirm();
        return false;
    });
	
	
	$(document).on('click', '.btn-delete', function(){	
		try{
			$.post('https://api.remaxthailand.co.th/catalog/deleteList', {
				apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
				memberKey: $('#authKey').val(),
				product: $(this).attr('value')
			}, function(data){
					if (data.success) {
						if(data.result[0].success){
							loadData();
						}
						else{
							console.log(data.result[0].success);
						}
					}
				}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
		}
		catch(err) {
		}
	});
	
	document.getElementById("btn-export").disabled = true;
	$('#txt-customer').on('input', function() {
		if ($('#txt-customer').val().length > 0){
			document.getElementById("btn-export").disabled = false;
			$('#trCustomerName').show(); 
			$('#customerName').html($('#txt-customer').val());
		}else{
			document.getElementById("btn-export").disabled = true;
			//$('#trCustomerName').hide(); 
		}
	});
	
});


function loadData(){
	$('#dv-loading').show();
	
	$.post('https://api.remaxthailand.co.th/catalog/detail', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val(),
	}, function(data){
		$('#dv-loading').hide();
		if (data.success) {
			
			var html = '';
			
			for( i=0; i<data.result.length; i++ ) {
				var result = data.result[i];
				
				var no = i+1;
				html += '<tr id="'+result.product+'">';
				html += '<td width="10" class="text-center" valign="middle">'+no+'';
				html += '<br><a class="btn-delete noExl text-danger" value='+ result.product +' href="javascript:void(0)"><i class="fa fa-trash-o fa-lg" ></i></a>'
				html += '</td>';
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

function catalogConfirm(){
	$.post('https://api.remaxthailand.co.th/catalog/confirm', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val(),
		customer: $('#txt-customer').val()
	}, function(data){
		if (data.success) {
			if(data.result[0].success){
				$(".table2excel").table2excel({
					exclude: ".noExl",
					name: "Excel Document Name",
					filename: "PriceListRemaxthailand "+$('#customerName').html(),
					fileext: ".xls",
					exclude_img: true,
					exclude_links: true,
					exclude_inputs: true
				});
				
				$('.dv-alert').hide();
				$('.wait').hide();
				$('#dv-head').show();			
				$('#dv-done').show();
			}
			else{
				console.log(data.result[0].success);
			}

		}
	
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}