var shopData;
var districtData = '';
var zipcodeData = '';
$(function() {
	
	loadProvince();
	loadShop();

	$(document).on('change', '#cbb-shop', function(){
		Cookies.set('shopSelected', $(this).val());
		$('.select-shop').val($(this).val());	
		loadDetail();
		$('#dv-done').hide();	
	});

	$('#txt-tel').ForceNumericOnly();
	$('#txt-zipcode').ForceNumericOnly();

	$(document).on('change', '#province', function(){
		districtData = '';
		loadDistrict();
	});

	$(document).on('change', '#district', function(){
		loadZipCode();
	});

	$("#btn-submit").click(function(){
		updateDetail();
	});
});

function loadShop(){
	$('#dv-loading').show();
	$('#dv-no_data, #tb-result').hide();
	
	$.post('https://api.remaxthailand.co.th/shop/detail', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: ''
	}, function(data){
		if (data.success) {
			shopData = data.result;
			if ( Cookies.get('shopSelected') == undefined )
				Cookies.set('shopSelected', data.result[0].shopCode );
			for( i=0; i<data.result.length; i++ ) {
				var result = data.result[i];
				$('#cbb-shop').append('<option value="'+result.shopCode+'"'+(Cookies.get('shopSelected') == result.shopCode ? ' selected' : '')+'>'+result.name+'</option>');
				
			}
			$('#dv-loading').hide();
			$('#form-select').show();
			loadDetail();

		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};

function loadProvince(){
	$.post('https://api.remaxthailand.co.th/province/list', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C'
	}, function(data){
			if (data.success) {
				var html = '';
				for( i = 0; i < data.result.length; i++ ) {
					html += '<option value="'+ data.result[i].id +'" '+
						((data.result[i].name == $('#province').attr('data-selected') || ($('#province').attr('data-selected') == '' && data.result[i].id == '1')) ? ' selected' : '')
						+'>'+ data.result[i].name +'</option>';
				}
				$('#province').html( html );
				loadDistrict();
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};
function loadDistrict(){
	$.post('https://api.remaxthailand.co.th/province/district', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		province: $('#province').val(),
	}, function(data){
			if (data.success) {
				var html = '';
				for( i=0; i<data.result.length; i++ ) {
					var result = data.result[i];
					html += '<option value="'+ result.id +'" data-zipcode="'+ result.zipcode +'"'+
						((result.id == $('#district').attr('data-selected') && result.zipcode == $('#district').attr('data-zipcode')) ? ' selected' : '')
						+'>'+ result.name +'</option>';
				}
				$('#district').html( html );
					loadZipCode();
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};
function loadZipCode(){
	$('#txt-zipcode').val( $('#district :selected').attr('data-zipcode') );
	
	if(districtData != ''){
		$('#district').val(districtData);
		$('#txt-zipcode').val($('#district :selected').attr('data-zipcode') );
	}
	
};

function loadDetail(){	
	/*var i = arrayObjectIndexOf(shopData,$('#cbb-shop').val(),'id');
	$('#txt-shop_name').val(shopData[i].name);
	$('#txt-detail').val(shopData[i].detail);
	$('#txt-address').val(shopData[i].address);
	$('#txt-address2').val(shopData[i].address2);
	$('#txt-sub_district').val(shopData[i].subDistrict);
	//$('#district').val(shopData[i].district);
	//$('#province').val(shopData[i].province);
	//$('#txt-zipcode').val(shopData[i].zipcode);
	$('#txt-tel').val(shopData[i].mobile);
	$('#txt-image').val(shopData[i].image);
	$('#txt-iframeGoogleMaps').val(shopData[i].iframeGoogleMaps);
	
	if(shopData[i].province != ''){
		$('#province').val(shopData[i].province);				
		loadDistrictDone = true;
		loadDistrict();
	}*/

$.post('https://api.remaxthailand.co.th/shop/detail', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: $('#cbb-shop').val()
	}, function(data){
		if (data.success) {
			districtData = data.result[0].district;
			zipcodeData = data.result[0].zipcode;
			$('#txt-shop_name').val(data.result[0].name);
			$('#txt-detail').val(data.result[0].detail);
			$('#txt-address').val(data.result[0].address);
			$('#txt-address2').val(data.result[0].address2);
			$('#txt-sub_district').val(data.result[0].subDistrict);
			//$('#district').val(shopData[i].district);
			//$('#province').val(shopData[i].province);
			//$('#txt-zipcode').val(shopData[i].zipcode);
			$('#txt-tel').val(data.result[0].mobile);
			$('#txt-image').val(data.result[0].image);
			$('#txt-iframeGoogleMaps').val(data.result[0].iframeGoogleMaps);
			
			if(data.result[0].province != ''){
				$('#province').val(data.result[0].province);				
				loadDistrict();
			}
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
	
};

function updateDetail(){	
	$.post('https://api.remaxthailand.co.th/shop/detailUpdate', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val(),
		shop: $('#cbb-shop').val(),
		detail: $('#txt-detail').val(),
		address: $('#txt-address').val(),
		address2: $('#txt-address2').val(),
		subDistrict: $('#txt-sub_district').val(),
		district: $('#district').val(),
		province: $('#province').val(),
		zipcode: $('#txt-zipcode').val(),
		mobile: $('#txt-tel').val(),
		image: $('#txt-image').val(),
		iframeGoogleMaps: $('#txt-iframeGoogleMaps').val(),
		line: $('#txt-line').val(),
		facebook: $('#txt-facebook').val()
	}, function(data){
		if (data.success) {
			$('#dv-done').show();
			$('#cbb-shop').empty();
			loadShop();
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
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

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}