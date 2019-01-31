var json;
//var apiKey = '9752AB80-25DC-4CBF-AEA0-6D28D11276CE'; 
//var apiUrl = 'https://api.remaxthailand.co.th';

var apiKey = 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C';
var apiUrl = 'https://api.remaxthailand.co.th';

$(function() {

	loadData();

	$(document).on('click', '.show_info', function(){
		var id = parseInt($(this).parents('tr').data('id'));
		var modal = $('#dv-info');
		modal.find('.modal-title').html( $(this).html() );
		modal.find('.mobile').html( json[id].mobile.substr(0,3)+'-'+json[id].mobile.substr(3,4)+'-'+json[id].mobile.substr(7) );
		modal.find('.time').html( json[id].time );
		modal.find('.address').html( json[id].address );
		
		var file = convertDataToArray('|', json[id].images);
		
		if (typeof file != 'undefined') {
			for(i=0; i<=3; i++) {
				modal.find('.img'+i+' img').attr('src', 'https://src.remaxthailand.co.th/img/Remax/product/default.jpg');
				modal.find('.img'+i+' a').attr('href', '#');
				if (typeof file != 'undefined' && file != '') {
					modal.find('.img'+i).show().find('img').attr('src', file[i]);
					modal.find('.img'+i).show().find('a').attr('href', file[i]);
				}
				else {
					modal.find('.img'+i).hide();
				}
			}
		}
		else {
			for(i=0; i<=3; i++) modal.find('.img'+i).hide();
		}
	});

});

function loadData(){
	
	$('#dv-loading').show();
	$('#dv-no_data, #tb-result').hide();
	$.post(apiUrl+'/register/shop/info', {
		apiKey: apiKey,
		firstname: '',
		lastname: '',
		mobile: ''
	}, function(data){
		$('#dv-loading').hide();
		
		//moment.locale('Th');

		if (data.success) {
			json = data.result;
			sortJSON(json, 'registerDate', 'desc');

			var html = '';
			for( c=0; c < json.length; c++ ) {
				var result = json[c];
				html += '<tr data-id="'+c+'">';
				html += '<td><a href= "https://api.remaxthailand.co.th/report/shop/'+result.firstname+'/'+result.lastname+'.pdf"><i class="fa fa-file-pdf-o pointer"></i></a> <a class="show_info" href="#" data-target="#dv-info" data-toggle="modal"> คุณ'+result.firstname+((result.lastname != null) ? ' ' + result.lastname : '')+((result.nickname != null && result.nickname != "") ? ' (' + result.nickname + ')' : '')+'</a>';
				var file = convertDataToArray('|', result.images);		
				if (typeof file != 'undefined' && file != '' && file != null) {
					for(j=0; j<=3; j++) {
						if (typeof file[j] != 'undefined' && file[j] != '' && file[j] != null) {
							html += ' <i class="fa fa-photo td-image text-muted margin-left-5" data-container="body" data-toggle="popover" data-placement="top" data-content="<img src=\''+file[j]+'\' width=\'100\'>"></i>';
						}
					}
				}
				html += '</td><td>'+moment(result.registerDate).utcOffset(0).format('DD/MM/YYYY HH:mm')+'</td>';
				html += '<td>'+result.time+'</td>';
				html += '<td>'+result.mobile.substr(0,3)+'-'+result.mobile.substr(3,4)+'-'+result.mobile.substr(7)+'</td>';
				html += '<td>'+result.address+'</td>';				
				html += '</tr>';
				
			}
			$('#tb-result tbody').html( html );
			$('.td-image').popover({
				html: true,
				trigger: 'hover',
			});
			$('.wait').show();
			if (data.result.length == 0)
			{
				$('#dv-no_data').show();
				$('#tb-result').hide();
			}
			
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function sortJSON(data, key, way) {
    return data.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        if (way === 'desc') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
		else { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
    });
};

function convertDataToArray(sign, data) {
	if (data == null || data == "" || typeof data == 'undefined') {
		var arr = [];
		return arr;
	}
	else if ( data.indexOf(sign) != -1) {
		var sp = data.split(sign);
		for(i=0; i<sp.length; i++) sp[i] = sp[i].trim();
		return sp;
	}
	else {
		var arr = [data];
		return arr;
	}
};