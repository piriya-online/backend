$(function() {
	loadData();
	loadDataYoutube();
    $(document).on('click', '.updateImage', function() {		
		$.post('https://api.remaxthailand.co.th/product/updateImage', {
			apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
			sku: $(this).attr('data-value')
		}, function(data) {
			/*if (data.success) {
				loadData();
			}*/
            loadData();
		});
    });
    $(document).on('click', '.updateYoutube', function() {		
		$.post('https://api.remaxthailand.co.th/product/updateYoutube', {
			apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
            id: $(this).attr('data-value'),
            youtube: $('input','#'+$(this).attr('data-value')).val()
		}, function(data) {
            loadDataYoutube();
        });
    });
});

function loadData(){
	$('#dv-loading').show();
	$('#dv-no_data, #tb-result').hide();
	
	$.post('https://api.remaxthailand.co.th/product/imageIsNull', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: 'POWERDDH-8888-8888-B620-48D3B6489999'
	}, function(data){
		if (data.success) {
			var values = data.result;
            if(values.length > 0){
                var html1 = '';
                for( i=0; i<values.length; i++ ) {
                    var result = values[i];
                    html1 += '<tr>';
                    html1 += '<td class="text-center" valign="middle">'+result.sku+'</td>';
                    html1 += '<td valign="middle"><label class="updateImage label label-primary pointer" data-value="'+result.sku+'">Done ?</label> '+result.productName+'</td>';
                    html1 += '<td valign="middle">'+result.categoryName+'</td>';
                    html1 += '<td valign="middle">'+result.brandName+'</td>';
                    html1 += '</tr>';
                }
			}
			$('#dv-loading').hide();
			$('#tb-result tbody').html( html1 );
            $('#tb-result').show();
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};

function loadDataYoutube(){
	$('#dv-loading2').show();
	$('#dv-no_data2, #tb-result2').hide();
	
	$.post('https://api.remaxthailand.co.th/product/youtubeIsNull', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: 'POWERDDH-8888-8888-B620-48D3B6489999'
	}, function(data){
		if (data.success) {
			var values = data.result;
            if(values.length > 0){
                var html2 = '';
                for( i=0; i<values.length; i++ ) {
                    var result = values[i];
                    html2 += '<tr id="' + result.id + '">'; 
                    html2 += '<td class="text-center" valign="middle">'+result.sku+'</td>';
                    html2 += '<td valign="middle">'+result.productName+'</td>';
                    html2 += '<td valign="middle">'+result.categoryName+'</td>';
                    html2 += '<td valign="middle">'+result.brandName+'</td>';
                    html2 += '<td valign="middle"><input id="'+result.id+'" class="form-control input-sm txt-input" type="text"> </input><label class="updateYoutube label label-primary pointer" data-value="'+result.id+'">Update</label></td>';
                    html2 += '</tr>';
                } 
			}
			$('#dv-loading2').hide();
			$('#tb-result2 tbody').html( html2 ); 
            $('#tb-result2').show(); 
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