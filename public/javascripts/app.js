var device = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) ? 'mobile' : 'desktop';
var storage;
$(function() {
	storage=$.localStorage;
	$('.hidden').removeClass('hidden').hide();
	if ( $('#menu-cart').length > 0 ) loadBadge( 'menu-cart', 'bg-red' );
	if ( $('#subMenu-sales-order').length > 0 ) loadBadge( 'subMenu-sales-order', 'bg-red' );
	if ( $('#menu-').length > 0 ) loadBadge( 'menu-', 'bg-red' );

});

function getMessage( id, key ){
	var json = $.parseJSON( $(id).val() );
	return (!json[key]) ? 'Unknown Key' : json[key];
}

function showWidgetError( table, message ){
	var $box = $(table).parents('.box');
	$box.find('.manualMessage').html( ' ' + message ).show();
	$box.find('.error').show();
	$box.find('.loading').hide();
	$box.find('.box-footer').show();
	alertTimeout( $box.find('.box-footer'), 5000 );
}

function showWidgetLoading( table ){
	var $box = $(table).parents('.box');
	$box.find('.error').hide();
	$box.find('.loading').show();
	$box.find('.box-footer').show();
	$box.find('tfoot').html('');
}

function hideWidgetFooter( table ){
	var $box = $(table).parents('.box');
	$box.find('.box-footer').hide();
}

function updateWidgetData( table, tableName, key, value , where ){
	$.post($('#apiUrl').val()+'/utilities/data/update', {
		authKey: $('#authKey').val(),
		updateKey: $('#updateKey').val(),
		table: tableName,
		column: key,
		value: value,
		where: where,
	}, function(data){
		if (data.success) hideWidgetFooter( table );
		else showWidgetError( table, data.error+(data.stack != undefined ? ' <pre>'+data.stack+'</pre>' : '')  );
	}, 'json').fail( function(xhr, textStatus, errorThrown) { showWidgetError( table, 'updateWidgetData : ' + xhr.statusText ); });
}

function alertTimeout(obj, wait){
    setTimeout(function(){
        obj.stop().fadeOut();
    }, wait);
}


function numberWithCommas(x) {
	try
	{
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	catch(err) {
		return x;
	}
}

function updateScreenConfig( config ) {
	var sp = document.location.pathname.split('/');
	$.post($('#apiUrl').val()+'/member/screen/config/update', {
		authKey: $('#authKey').val(),
		system: 'backend',
		screen: sp[1],
		config: config,
	}, function(data){
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log( xhr.statusText ); });
}

function loadScreenConfig( ) {
	var sp = document.location.pathname.split('/');
	$.post($('#apiUrl').val()+'/member/screen/config/data', {
		authKey: $('#authKey').val(),
		system: 'backend',
		screen: sp[1],
	}, function(data){
		if ( data.success ) {
			if ( data.correct ) {
				try {
					renderScreen( JSON.parse(data.result[0].config) );
				}
				catch(err) {
					renderScreen( null );
				}
			}
			renderScreen( null );
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log( xhr.statusText ); });
}

jQuery.fn.ForceNumericOnly = function() {
	return this.each(function() {
		$(this).keydown(function(e) {
			if (/^[0-9]+$/.test($(this).val()) == false) {
				var text = $(this).val();
				$(this).val( text.substr(0, text.length-1) );
			}
			var key = e.charCode || e.keyCode || 0;
			return (
				(
					key == 13 || // Enter
					key == 8 || // Back Space
					(key >= 48 && key <= 57 && e.shiftKey== false) || // 0-9
					(key >= 96 && key <= 105) // 0-9 (Numpad)
				) && ( $(this).val().length == 0 || (/^[0-9]+$/.test($(this).val())) )
			);
		}),
		$(this).keyup(function(e) {
			if (/^[0-9]+$/.test($(this).val()) == false) {
				var text = $(this).val();
				$(this).val( text.substr(0, text.length-1) );
			}
		});
	});
};


function loadBadge( name, color ) {
	$.post($('#apiUrl').val()+'/member/summary/alert', {
		authKey: $('#authKey').val(),
		screen: name,
	}, function(data){
			if (data.success) {
				if (data.correct) {
					if (data.result[0].count > 0){
						$('#'+name+' .badge').addClass(color).html( numberWithCommas(data.result[0].count) ).show();
						if (name.indexOf('subMenu-') != -1) {
							var parent = $('#'+name+' .badge').parents('.treeview').find('.badge:eq(0)');
							parent.addClass(color).html( numberWithCommas(data.result[0].count+parseInt($.trim(parent.html())) ) ).show();
						}

						if (name == 'menu-' && window.location.pathname == '/product'){
							$('#onStock-alert').modal('show');
							$('#onStock-alert .qty').html( numberWithCommas(data.result[0].count) );
						}

					}
				}
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}