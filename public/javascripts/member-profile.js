$(function() {

	if ( $('.loadRoles').length > 0 ) {

		$.post($('#apiUrl').val()+'/member/info/roles', {
			authKey: $('#authKey').val(),
		}, function(data){
			$('.loadRoles').hide();
			if (data.success) {
				var $obj = $('.loadRoles').parents('.box-body');
				$obj.find('.message').show();
				for(i=0; i<data.result.length; i++){
					result = data.result[i];
					var title = $('#role-'+result.roles).val();
					$obj.append( '<span class="btn btn-block btn-'+(($('#memberRole').html() == title) ? 'primary' : 'default')+' btn-roles" data-role="'+result.roles+'">'+title+'</span>' );
				}
			}
			else {
				$('.loadRoles').parent().find('.message').text( data.error ).show();
			}
		}, 'json');
	}

	$(document).on('focus', '.fm-change_data input.form-control', function(){
		$(this).attr('data-tmp', $.trim($(this).val()));
	});

	$(document).on('blur', '.fm-change_data input.form-control', function(){
		$(this).val($.trim($(this).val()));
		if ($(this).val() != $(this).attr('data-tmp') ) {
			updateInfo( $(this).parents('.box'), $(this).data('tab'), $(this).attr('id'), $(this).val() );
		}
	});

	$(document).on('change', '#male, #female', function(){
		console.log( $('#male').is('checked') ? '1' : '0' );
	});
	
	$('#male').on('ifChecked', function(){
		updateInfo( $(this).parents('.box'), $(this).data('tab'), 'gender', 1 );
	});
	
	$('#female').on('ifChecked', function(){
		updateInfo( $(this).parents('.box'), $(this).data('tab'), 'gender', 0 );
	});

	$(document).on('click', '.btn-roles.btn-default', function(){
		changeRole( $(this).data('role') );
	});

	$(document).on('click', '#btn-change_password', function(){
		$('#dv-password span').hide();
		if ( $('#old_password').val() == '' || $('#password').val() == '' || $('#password2').val() == '' ) {
			$('#sp-pleaseFillAll').show().parents('.box-footer').show();
		}
		else if ( $('#password').val() != $('#password2').val() ) {
			$('#sp-passwordDifferent').show().parents('.box-footer').show();
		}
		else {
			$(this).parents('.box-body').slideUp();
			$('#sp-loadingData').show().parents('.box-footer').show();

			$.post($('#apiUrl').val()+'/member/change_password', {
				authKey: $('#authKey').val(),
				username: $('#hd-username').val(),
				currentPassword: $('#old_password').val(),
				newPassword: $('#password').val(),
			}, function(data){
				if (data.success) {
					$('#dv-password span').hide();
					if ( data.result[0].returnCode == 0 ) {
						$('#sp-currentPasswordInvalid').show().parents('.box-footer').show();
						$('#btn-change_password').parents('.box-body').slideDown();
					}
					else if ( data.result[0].returnCode == 1 ) $('#sp-changePasswordSuccess').show().parents('.box-footer').show();
				}
				else {
					console.log( data.error );
				}
			}, 'json');

		}
	});

});

function changeRole( role ){
	if(role != 'neo'){
		var pass = true;
		/*if(role == 'shop' && $('#memberId').html() == '160103303'){
			pass = false;
			var password = prompt('รหัสผ่าน', '');
			if (password == '8899') {
				pass = true;
			}
		}*/ 

		if(pass){
			$.post($('#apiUrl').val()+'/member/info/update', {
				authKey: $('#authKey').val(),
				table: 'Member',
				key: 'selectedMemberType',
				value: role,
			}, function(data){
				if (data.success) {
					window.location = '/initial';
				}
				else {
					console.log( data.error );
				}
			}, 'json');
		}
	}
	/*else if(role != 'neo'){
	}*/
	else {
		$.post($('#apiUrl').val()+'/member/teamwork/signin', {
			authKey: $('#authKey').val(),
			memberId: '151102549',
			memberType: 'manager',
			updateKey: $('#updateKey').val(),
		}, function(data){
			if (data.success) {
				if (data.exist) {
					window.location = './../initial';
				}
				else {
					alert('error')
				}
			}
			else {
				//showWidgetError( table, data.error+(data.stack != undefined ? ' <pre>'+data.stack+'</pre>' : '')  );
			}
		}, 'json').fail( function(xhr, textStatus, errorThrown) { showWidgetError( table, 'loadDataScreen : ' + xhr.statusText ); });
	}
};

function updateInfo( box, table, key, value ){
	box.find('.box-footer .success, .box-footer .error').hide();
	box.find('.box-footer').show().find('.loading').show();

	$.post($('#apiUrl').val()+'/member/info/update', {
		authKey: $('#authKey').val(),
		table: table,
		key: key,
		value: value,
	}, function(data){
		if (data.success) {
			box.find('.box-footer .error, .box-footer .loading').hide();
			box.find('.box-footer').show().find('.success').show();
		}
		else {
			box.find('.box-footer .manualMessage').html(' '+data.error);
			box.find('.box-footer .success, .box-footer .loading').hide();
			box.find('.box-footer').show().find('.error').show();
		}
	}, 'json');
}