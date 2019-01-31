$(function() {

	loadDataScreen('#tb-screen', '/system/data/screen');
	loadDataScreenMapping('#tb-screen_mapping', '/system/data/screen_mapping');

	//$('td:contains("(Notes Text)")').click(function() {
	$(document).on('click', 'td.edit', function(){
		var $obj = $(this);
		var tableId = $obj.parents('table').attr('id');
		if ( $obj.find('input').length == 0 ) {
			var width = $obj.width()-10;
			var text = $obj.text();
			if ( tableId == 'tb-screen' ) {
				$obj.parents('tr').find('.id').attr('data-key',  $obj.parents('tr').find('.id').text() );
			}
			else if ( tableId == 'tb-screen_mapping' ) {
				$obj.parents('tr').find('.screen').attr('data-key',  $obj.parents('tr').find('.screen').text() );
				$obj.parents('tr').find('.memberType').attr('data-key',  $obj.parents('tr').find('.memberType').text() );
			}
			$obj.text('');
			$('<input class="form-control input-sm" type="text" style="width: '+width+'px; height: 20px; border-width:0; padding:0" />').appendTo($obj).val(text).select().blur(function() {
				var newText = $.trim($(this).val());
				$(this).parent().text(newText);

				if (text != newText && !$obj.parents('tr').hasClass('tr-add')) {
					if ( tableId == 'tb-screen' ) {
						var where = '{"id":"'+$obj.parents('tr').find('.id').attr('data-key')+'"}';
						updateWidgetData( '#'+tableId, 'Screen', $obj.data('name'), newText , where );
					}
					else if ( tableId == 'tb-screen_mapping' ) {
						var where = '{"screen":"'+$obj.parents('tr').find('.screen').attr('data-key')+'", "memberType":"'+$obj.parents('tr').find('.memberType').attr('data-key')+'"}';
						updateWidgetData( '#'+tableId, 'ScreenMapping', $obj.data('name'), newText , where );
					}
				}


			});
		}
	});
	
	$(document).on('change', 'input.edit', function(){
		var $obj = $(this);
		var tableId = $obj.parents('table').attr('id');
		var where = '{"screen":"'+$obj.parents('tr').find('.screen').attr('data-key')+'", "memberType":"'+$obj.parents('tr').find('.memberType').attr('data-key')+'"}';
		updateWidgetData( '#'+tableId, 'ScreenMapping', $obj.data('name'), $obj.is(':checked') ? '1' : '0' , where );
	});

	$(document).on('click', '.btn-add', function(){
		var $obj = $('#'+$(this).parents('.box').find('table:eq(0)').attr('id'));
		if ( $obj.attr('id') == 'tb-screen' ) {
			addDataScreen( '#'+$obj.attr('id'), ['id', 'link', 'parent', 'icon']);			
		}
		else if ( $obj.attr('id') == 'tb-screen_mapping' ) {
			addDataScreenMapping( '#'+$obj.attr('id'), ['screen', 'memberType', 'level', 'canInsert', 'canUpdate', 'canDelete']);	
		}

	});


	$(document).on('click', '.btn-reload', function(){
		var $obj = $('#'+$(this).parents('.box').find('table:eq(0)').attr('id'));
		if ( $obj.attr('id') == 'tb-screen' ) {
			loadDataScreen( '#'+$obj.attr('id'), '/system/data/screen');
		}
		else if ( $obj.attr('id') == 'tb-screen_mapping' ) {
			loadDataScreenMapping( '#'+$obj.attr('id'), '/system/data/screen_mapping');
		}
	});


	$(document).on('click', '.btn-save', function(){
		var $obj = $(this).parents('table');
		if ( $obj.attr('id') == 'tb-screen' ) {
			saveDataScreen( '#'+$obj.attr('id'), $obj );
		}
		else if ( $obj.attr('id') == 'tb-screen_mapping' ) {
			saveDataScreenMapping( '#'+$obj.attr('id'), $obj );
		}
	});


	$(document).on('click', '.btn-delete', function(){
		var $obj = $('#'+$(this).parents('.box').find('table:eq(0)').attr('id'));
		if ( $obj.attr('id') == 'tb-screen' ) {
			deleteDataScreen( '#'+$obj.attr('id') );
		}
		else if ( $obj.attr('id') == 'tb-screen_mapping' ) {
			deleteDataScreenMapping( '#'+$obj.attr('id') );
		}
	});


	$(document).on('click', '.dropdown-menu li', function(){
		showTableClass( '#'+$(this).parents('.box').find('table:eq(0)').attr('id'), $(this).attr('data-class') );
	});

	

});

function loadDataScreen(table, path) {
	showWidgetLoading( table );

	$.post($('#apiUrl').val()+path, {
	}, function(data){
		if (data.success) {
			hideWidgetFooter( table );
			
			html = '';
			for( i=0; i<data.result.length; i++ ) {
				var result = data.result[i];
				html += '<tr><td>'+((result.canDelete == 1) ? '<input type="checkbox" class="delete">' : '')+'</td>';
				html += '<td class="'+((result.canDelete == 1) ? 'edit' : '')+' id" data-name="id" data-key="'+result.id+'">'+result.id+'</td>';
				html += '<td class="edit link" data-name="link">'+result.link+'</td>';
				html += '<td class="edit parent" data-name="parent">'+((result.parent == null) ? '' : result.parent)+'</td>';
				html += '<td class="edit icon" data-name="icon">'+result.icon+'</td></tr>';
			}
			$(table+' tbody').html( html );

		}
		else {
			showWidgetError( table, data.error+(data.stack != undefined ? ' <pre>'+data.stack+'</pre>' : '')  );
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { showWidgetError( table, 'loadDataScreen : ' + xhr.statusText ); });

}

function loadDataScreenMapping(table, path) {
	showWidgetLoading( table );

	$.post($('#apiUrl').val()+path, {
		system: 'backend',
	}, function(data){
		if (data.success) {
			hideWidgetFooter( table );

			var $optionScreen = $(table).parents('.box').find('.btn-selectScreen').parent().find('.dropdown-menu');
			var $optionMember = $(table).parents('.box').find('.btn-selectMember').parent().find('.dropdown-menu');
			var screen = '|';
			var memberType = '|';
			var html = '';
			var optionScreen = '';
			var optionMember = '';
			for( i=0; i<data.result.length; i++ ) {
				var result = data.result[i];
				html += '<tr class="tr_all screen_'+result.screen+' type_'+result.memberType+'"><td><input type="checkbox" class="delete"></td>';
				html += '<td class="edit screen" data-name="screen" data-key="'+result.screen+'">'+result.screen+'</td>';
				html += '<td class="edit memberType" data-name="memberType" data-key="'+result.memberType+'">'+result.memberType+'</td>';
				html += '<td class="edit text-center level" data-name="level">'+result.level+'</td>';
				html += '<td class="text-center"><input type="checkbox" data-name="canInsert" class="edit canInsert" '+((result.canInsert == '1') ? ' checked' : '')+'></td>';
				html += '<td class="text-center"><input type="checkbox" data-name="canUpdate" class="edit canUpdate" '+((result.canUpdate == '1') ? ' checked' : '')+'></td>';
				html += '<td class="text-center"><input type="checkbox" data-name="canDelete" class="edit canDelete" '+((result.canDelete == '1') ? ' checked' : '')+'></td></tr>';

				if ( screen.indexOf('|'+result.screen+'|') == -1 ) {
					optionScreen += '<li class="li-screen_'+result.screen+'" role="presentation" data-class="screen_'+result.screen+'"><a href="javascript:void(0)" role="menuitem" tabindex="-1">'+result.screen+'</a></li>';
					screen += result.screen+'|';
				}
				if ( memberType.indexOf('|'+result.memberType+'|') == -1 ) {
					optionMember += '<li class="li-type_'+result.memberType+'" role="presentation" data-class="type_'+result.memberType+'"><a href="javascript:void(0)" role="menuitem" tabindex="-1">'+result.memberType+'</a></li>';
					memberType += result.memberType+'|';
				}
			}
			$(table+' tbody').html( html );
			$optionScreen.html(optionScreen).attr('data-type', screen);
			$optionMember.html(optionMember).attr('data-type', memberType);
			showTableClass( table, $optionMember.find('li:eq(0)').attr('data-class') );

		}
		else {
			showWidgetError( table, data.error+(data.stack != undefined ? ' <pre>'+data.stack+'</pre>' : '')  );
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { showWidgetError( table, 'loadDataScreenMapping : ' + xhr.statusText ); });

}

function addDataScreen( table, column ) {
	var count = $(table).find('thead th').length;
	var html = '<tr class="tb-bg-gray tr-add"><td><i class="fa fa-save fa-lg btn-save pointer"></td>';
	for ( i=1; i<count; i++ ) {
		html += '<td class="edit" data-name="'+column[i-1]+'"></td>';
	}
	$(table).find('tfoot').html(html+'</tr>');
	$(table).find('tfoot td:eq(1)').click();
	$(table).find('tfoot td:eq(2)').text('#');
	$(table).find('tfoot td:eq(4)').text('th-large');
}

function addDataScreenMapping( table, column ) {
	var count = $(table).find('thead th').length;
	var html = '<tr class="tb-bg-gray tr-add"><td><i class="fa fa-save fa-lg btn-save pointer"></td>';
	for ( i=1; i<count; i++ ) {
		if (i < 4) {
			html += '<td class="edit" data-name="'+column[i-1]+'"></td>';
		}
		else {
			html += '<td class="text-center"><input type="checkbox" data-name="'+column[i-1]+'"></td>';
		}
	}
	$(table).find('tfoot').html(html+'</tr>');
	$(table).find('tfoot td:eq(1)').click();
	$(table).find('tfoot td:eq(3)').text('0').addClass('text-center');
}

function saveDataScreen( table, obj ) {
	var count = obj.find('thead th').length;
	var json = {};
	for ( i=1; i<count; i++ ) {
		json[obj.find('tfoot td:eq('+i+')').data('name')] = obj.find('tfoot td:eq('+i+')').html();
	}
	$.post($('#apiUrl').val()+'/utilities/data/insert', {
		authKey: $('#authKey').val(),
		insertKey: $('#insertKey').val(),
		table: 'Screen',
		data: JSON.stringify(json),
	}, function(data){
		if (data.success) {
			var html = '<tr><td><input type="checkbox" class="delete"></td>';
			html += '<td class="edit id" data-name="id" data-key="'+json.id+'">'+json.id+'</td>';
			html += '<td class="edit link" data-name="link">'+json.link+'</td>';
			html += '<td class="edit parent" data-name="parent">'+json.parent+'</td>';
			html += '<td class="edit icon" data-name="icon">'+json.icon+'</td></tr>';
			$(table+' tbody').append( html );
			$(table+' tfoot').html( '' );
			hideWidgetFooter( table );
		}
		else showWidgetError( table, data.error+(data.stack != undefined ? ' <pre>'+data.stack+'</pre>' : '')  );
	}, 'json').fail( function(xhr, textStatus, errorThrown) { showWidgetError( table, 'saveDataScreen : ' + xhr.statusText ); });
}

function saveDataScreenMapping( table, obj ) {
	var count = obj.find('thead th').length;
	var json = {};
	for ( i=1; i<count; i++ ) {
		if ( i < 4 ) {
			json[obj.find('tfoot td:eq('+i+')').data('name')] = obj.find('tfoot td:eq('+i+')').html();
		}
		else if ( i >= 4 ) {
			json[obj.find('tfoot td:eq('+i+') input').data('name')] = obj.find('tfoot td:eq('+i+') input').is(':checked') ? '1' : '0';
		}
	}
	$.post($('#apiUrl').val()+'/utilities/data/insert', {
		authKey: $('#authKey').val(),
		insertKey: $('#insertKey').val(),
		table: 'ScreenMapping',
		data: JSON.stringify(json),
	}, function(data){
		if (data.success) {
			var html = '<tr class="tr_all screen_'+json.screen+' type_'+json.memberType+'"><td><input type="checkbox" class="delete"></td>';
			html += '<td class="edit screen" data-name="screen" data-key="'+json.screen+'">'+json.screen+'</td>';
			html += '<td class="edit memberType" data-name="memberType" data-key="'+json.memberType+'">'+json.memberType+'</td>';
			html += '<td class="edit text-center level" data-name="level">'+json.level+'</td>';
			html += '<td class="text-center"><input type="checkbox" data-name="canInsert" class="edit canInsert" '+((json.canInsert == '1') ? ' checked' : '')+'></td>';
			html += '<td class="text-center"><input type="checkbox" data-name="canUpdate" class="edit canUpdate" '+((json.canUpdate == '1') ? ' checked' : '')+'></td>';
			html += '<td class="text-center"><input type="checkbox" data-name="canDelete" class="edit canDelete" '+((json.canDelete == '1') ? ' checked' : '')+'></td></tr>';
			$(table+' tbody').append( html );
			$(table+' tfoot').html( '' );
			hideWidgetFooter( table );
			
			var $optionScreen = $(table).parents('.box').find('.btn-selectScreen').parent().find('.dropdown-menu');
			if ( $optionScreen.attr('data-type').indexOf('|'+json.screen+'|') == -1 ) {
				$optionScreen.append( '<li class="li-screen_'+json.screen+'" role="presentation" data-class="screen_'+json.screen+'"><a href="javascript:void(0)" role="menuitem" tabindex="-1">'+json.screen+'</a></li>')
					.attr('data-type', $optionScreen.attr('data-type')+json.screen+'|');
			}
			showTableClass( table, 'screen_'+json.screen);
		}
		else showWidgetError( table, data.error+(data.stack != undefined ? ' <pre>'+data.stack+'</pre>' : '')  );
	}, 'json').fail( function(xhr, textStatus, errorThrown) { showWidgetError( table, 'saveDataScreenMapping : ' + xhr.statusText ); });
}

function deleteDataScreen( table ) {
	hideWidgetFooter( table );
	$(table+' .delete').each( function() {
		if ( $(this).is(':checked') ) {
			var $obj = $(this);
			$obj.attr('disabled', 'disabled');
			$.post($('#apiUrl').val()+'/utilities/data/delete', {
				authKey: $('#authKey').val(),
				deleteKey: $('#deleteKey').val(),
				table: 'Screen',
				where: '{"id":"'+$obj.parents('tr').find('.id').text()+'"}',
			}, function(data){
				if (data.success) {
					$obj.parents('tr').remove();
					hideWidgetFooter( table );
				}
				else {
					$obj.attr('disabled', '').removeAttr('disabled');
					showWidgetError( table, data.error+(data.stack != undefined ? ' <pre>'+data.stack+'</pre>' : '')  );
				}
			}, 'json').fail( function(xhr, textStatus, errorThrown) { showWidgetError( table, 'deleteDataScreen : ' + xhr.statusText ); });
		}
	});
}

function deleteDataScreenMapping( table ) {
	hideWidgetFooter( table );
	$(table+' .delete').each( function() {
		if ( $(this).is(':checked') ) {
			var $obj = $(this);
			$obj.attr('disabled', 'disabled');
			$.post($('#apiUrl').val()+'/utilities/data/delete', {
				authKey: $('#authKey').val(),
				deleteKey: $('#deleteKey').val(),
				table: 'ScreenMapping',
				where: '{"system":"backend", "screen":"'+$obj.parents('tr').find('.screen').text()+'", "memberType":"'+$obj.parents('tr').find('.memberType').text()+'"}',
			}, function(data){
				if (data.success) {
					$obj.parents('tr').remove();
					hideWidgetFooter( table );
				}
				else {
					$obj.attr('disabled', '').removeAttr('disabled');
					showWidgetError( table, data.error+(data.stack != undefined ? ' <pre>'+data.stack+'</pre>' : '')  );
				}
			}, 'json').fail( function(xhr, textStatus, errorThrown) { showWidgetError( table, 'deleteDataScreenMapping : ' + xhr.statusText ); });
		}
	});
}

function showTableClass(table, option) {
	var $option = $(table).parents('.box');
	$option.find('.dropdown-menu .active').removeClass('active');
	$option.find('.dropdown-menu .li-'+option).addClass('active');
	$(table+' .tr_all').hide();
	$(table+' .'+option).show();
}