var memberSelected;
$(function() {
	moment.locale('th');
    $('#lbl-message').html('ข้อความ ถึง'+ $('.select-message_type option:selected').html());
	$(document).on('change', '.select-message_type', function(){
		if($('.select-message_type option:selected').val() == 'type'){
			$('.form-member_type').show();
			$('.form-member_id').hide();
            $('#lbl-message').html('ข้อความ ถึง'+ $('.select-message_type option:selected').html() +' : '+$('.select-member_type option:selected').html());
		}else if($('.select-message_type option:selected').val() == 'member'){
			$('.form-member_type').hide();
			$('.form-member_id').show();
            $('#lbl-message').html('ข้อความ ถึง'+ $('.select-message_type option:selected').html());
		}else{
			$('.form-member_type').hide();
			$('.form-member_id').hide();
            $('#lbl-message').html('ข้อความ ถึง'+ $('.select-message_type option:selected').html());
		}
	});

    $(document).on('change', '.select-member_type', function(){
        $('#lbl-message').html('ข้อความ ถึง'+ $('.select-message_type option:selected').html() +' : '+$('.select-member_type option:selected').html());
	});
	/*$(document).on('keyup', '.select-member_id', function(){
		//searchMember();
	});*/

	$(document).on('click', '#btn-add-member_id', function() {
		if($('#add-member_id').val().length > 0){
			selectMember();
		}
		//return false;
    });
    
    $(document).on('click', '#btn-search-memberid', function() {
		loadNewsByMemberId();
    });
    
    $(document).on('click', '#btn-search-message', function() {
		loadNewsByMessage();
  	});

    $(document).on('click', '#btn-refresh', function() {
		loadNews();
  	});
	$(document).keypress(function(e) {
		if(e.which == 13) {
			if($('#add-member_id').val().length > 0){
				selectMember();
			}			
		}
	});

    /*$(document).on('click', '#tb-result_member check-select_member', function() {
		//$('#check-'+$(this).attr('value')).iCheck('toggle');
		if(document.getElementById('check-'+$(this).attr('value')).checked){
			$(this).addClass('text-danger');
			//$(this).css("font-weight","bold");
            if(memberSelected.indexOf($(this).attr('value')) == -1){
                memberSelected.push($(this).attr('value'))
            }        
		}else{
			$(this).removeClass('text-danger');
			//$(this).css("font-weight","");
            memberSelected.splice( $.inArray($(this).attr('value'), memberSelected) ,1);
		}
        //console.log(memberSelected);
        $('#lbl-message').html('ข้อความ ถึง'+ $('.select-message_type option:selected').html()+' : '+memberSelected);	
  	});*/
    
    loadNews();

    $(document).on('click', '.i-visible', function(){
		var $obj = $(this).parents('tr');
		if ( $(this).hasClass('text-success') ){
			$(this).removeClass('text-success').removeClass('fa-eye')
				.addClass('text-danger').addClass('fa-eye-slash');
				$.post('https://api.remaxthailand.co.th/news/updateVisible', {
					apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
                    id: $obj.attr('id'),
                    visible: 0,
					memberKey: $('#authKey').val()
				}, function(data){}, 'json');
		}
		else {
			$(this).removeClass('text-danger').removeClass('fa-eye-slash')
				.addClass('text-success').addClass('fa-eye');
				$.post('https://api.remaxthailand.co.th/news/updateVisible', {
					apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
                    id: $obj.attr('id'),
                    visible: 1,
					memberKey: $('#authKey').val()
				}, function(data){}, 'json');
		}
    });
    
    $(document).on('click', '#tb-result tbody p.current', function(){
        var $obj = $(this).parent();
        $(this).hide();
        $obj.find('.txt-input').val( $(this).html() ).show().focus();
        $obj = $obj.parent();       
		$obj.find('.btn-cancel').show();
		$obj.find('.btn-save').show();
    });
    
    $(document).on('click', '.btn-cancel', function(){
		var $obj = $(this).parents('tr');
		$obj.find('.txt-input, .btn-cancel, .btn-save').hide();
		$obj.find('p.current').show();
    });
    
    $(document).on('click', '.btn-save', function(){
		var $obj = $(this).parents('tr');
		$obj.find('.txt-input').each(function(){
			if ( $(this).css('display') == 'block' ){
                $.post('https://api.remaxthailand.co.th/news/updateMessage', {
					apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
                    id: $obj.attr('id'),
                    message: $obj.find('.txt-input').val(),
					memberKey: $('#authKey').val()
				}, function(data){
                    if (data.success) {
                        loadNews();
					}
				}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
			}
		});
	});
      
    $(document).on('click', '#btn-submit', function(){
        $.post('https://api.remaxthailand.co.th/news/add', {
            apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C', 
            memberType: ($('.select-message_type option:selected').val() == 'all' ? 'all' : ($('.select-message_type option:selected').val() == 'type' ? $('.select-member_type option:selected').val() : '')) ,
            member: memberSelected,
            message: $('#txt-message').val(),
            memberKey: $('#authKey').val()
        }, function(data){
            if (data.success) {
                loadNews();
            }
        }, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
    });
    
    $(document).submit(function(e){ // Disable Enter Key //
		return false;
	});
});

/*function searchMember() {
	$('#dv-loading_data_member').show();
    $('.wait_member').hide();
    $('.form-member_resultr').hide();
    $('#dv-no_data_member').hide();
    $.post('https://api.remaxthailand.co.th/member/search', {
        apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
        search: $.trim($('#select-member_id').val())
    }, function(data) {
        $('#dv-loading_data_member').hide();
        if (data.success) {
            var html = '';
            for (i = 0; i < data.result.length; i++) {
                var result = data.result[i];

                var no = i + 1;
                html += '<tr value="' + result.id + '" username="' + result.username + '" name="' + result.name + '(' + result.username + ')' + '" member-type="' + result.memberType + '"' + ((result.active) ? '' : ' class="text-muted"') + '>';

                html += '<td width="100" class="text-center" valign="middle"><input id="check-'+result.id+'" class="check-select_member" type="checkbox">' + ((result.active) ? '' : '<strike>') + result.id + ((result.active) ? '' : '</strike>') + '</td>';

                html += '<td width="200" class="text-center txt-name" valign="middle">' + result.name + '</td>';
                html += '<td width="200" class="text-center" valign="middle">' + result.shopName + '</td>';
                html += '<td width="100" class="text-center" valign="middle">' + ((result.active) ? '' : '<strike>') + result.username + ((result.active) ? '' : '</strike>') + '</td>';              
                html += '<td width="200" class="text-center" valign="middle">' + result.memberType + '</td>';
                html += '<td width="200" class="text-center" valign="middle">' + result.sellPrice + '</td>';
                html += '<td width="200" class="text-center" valign="middle">' + result.email + '</td>';
                html += '<td width="200" class="text-center" valign="middle">' + result.mobile + '</td>';
                html += '<td width="200" class="text-center" valign="middle">' + moment(result.addDate).utcOffset(0).format('DD/MM/YYYY HH:mm') + '</td>';
                html += '<td width="200" class="text-center" valign="middle">' + result.orderQty + '</td>';
                html += '<td width="200" class="text-center" valign="middle">' + numberWithCommas(result.orderTotal) + '</td>';
                html += '</tr>';
            }

            $('#tb-result_member tbody').html(html);
            if (data.result.length == 0) {
                $('#dv-no_data_member').show();
                $('#tb-result_member').hide();
            }
            //$("#tb-result").DataTable();
            $('.wait_member').show();
            $('.form-member_result').show();
            //$('#dv-adjust').show();
            $('.hidden').removeClass('hidden').hide();

        } else {
            $('#dv-no_data_member').show();
            $('#tb-result_member').hide();
            $('.form-member_result').show();
            //$('.form-member_result').hide();
        }
    }, 'json').fail(function(xhr, textStatus, errorThrown) {
        console.log(xhr.statusText);
    });*/

function selectMember() {
    $.post('https://api.remaxthailand.co.th/member/search', {
        apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
        search: $.trim($('#add-member_id').val())
    }, function(data) {
        if (data.success) {
            $('#lbl-message').html('ข้อความ ถึง'+ $('.select-message_type option:selected').html()+' : <h3>'+data.result[0].id+' '+ data.result[0].name+' ('+data.result[0].username+')</h3>');
            memberSelected = data.result[0].id;
        }else{
            $('#lbl-message').html('ข้อความ ถึง'+ $('.select-message_type option:selected').html()+' : ไม่พบข้อมูล!');
        }
    }, 'json').fail(function(xhr, textStatus, errorThrown) {
        console.log(xhr.statusText);
    });
}


function loadNews() {
    $('#dv-loading_data').show();
    $('.wait').hide();
    $('.form-member').hide();
    $('#dv-no_data').hide();
    $.post('https://api.remaxthailand.co.th/news/info', {
        apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
        memberKey: $('#authKey').val()
    }, function(data) {
        $('#dv-loading_data').hide();
        if (data.success) {
            var html = '';
            for (i = 0; i < data.result.length; i++) {
                var result = data.result[i];

                var no = i + 1;
                html += '<tr id="' + result.id + '">';
                html += '<td width="10" class="text-center" valign="middle">' + moment(result.addDate).utcOffset(0).format('DD/MM/YYYY HH:mm') + '</td>';
                html += '<td width="10" class="text-center" valign="middle">' + (result.member == 'undefined' ? '' : result.member) + '<br>'+ result.receiver +'</br></td>';
                html += '<td width="200" class="text-left" valign="middle"><input class="form-control input-sm txt-input hidden" type="text" />';
                html += '<p class="current" data-value="'+ result.message +'">' + result.message + '</td>';
                html += '<td width="10" class="text-center" valign="middle"><i class="fa fa-lg i-visible '+(result.visible ? 'text-success fa-eye' : 'text-danger fa-eye-slash')+' pointer"></i></td>';
                html += '<td width="10" class="text-center" valign="middle">' + result.addBy + '</td>';
                html += '<td width="10" class="text-center" valign="middle">' + result.updateBy + '</td>';
                html += '<td width="10" class="text-center" valign="middle">' + moment(result.updateDate).utcOffset(0).format('DD/MM/YYYY HH:mm');
                html += '<span class="btn-cancel btn btn-warning btn-xs margin-right-5 hidden"><i class="fa fa-rotate-left"></i></span><span class="btn-save btn btn-success btn-xs hidden"><i class="fa fa-save"></i></span></td>';
                html += '</tr>';
            }

            $('#tb-result tbody').html(html);
            if (data.result.length == 0) {
                $('#dv-no_data').show();
                $('#tb-result').hide();
            }
            $('.wait').show();
            $('#tb-result').show();
            $('.hidden').removeClass('hidden').hide();

        } else {
            $('#dv-no_data').show();
            $('#tb-result').hide();
        }
    }, 'json').fail(function(xhr, textStatus, errorThrown) {
        console.log(xhr.statusText);
    });
}

function loadNewsByMemberId() {
    $('#dv-loading_data').show();
    $('.wait').hide();
    $('.form-member').hide();
    $('#dv-no_data').hide();
    $.post('https://api.remaxthailand.co.th/news/searchByMemberId', {
        apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
        memberId: $('#search-memberid').val()
    }, function(data) {
        $('#dv-loading_data').hide();
        if (data.success) {
            var html = '';
            for (i = 0; i < data.result.length; i++) {
                var result = data.result[i];

                var no = i + 1;
                html += '<tr id="' + result.id + '">';
                html += '<td width="10" class="text-center" valign="middle">' + moment(result.addDate).utcOffset(0).format('DD/MM/YYYY HH:mm') + '</td>';
                html += '<td width="10" class="text-center" valign="middle">' + (result.member == 'undefined' ? '' : result.member) + '<br>'+ result.receiver +'</br></td>';
                html += '<td width="200" class="text-left" valign="middle"><input class="form-control input-sm txt-input hidden" type="text" />';
                html += '<p class="current" data-value="'+ result.message +'">' + result.message + '</td>';
                html += '<td width="10" class="text-center" valign="middle"><i class="fa fa-lg i-visible '+(result.visible ? 'text-success fa-eye' : 'text-danger fa-eye-slash')+' pointer"></i></td>';
                html += '<td width="10" class="text-center" valign="middle">' + result.addBy + '</td>';
                html += '<td width="10" class="text-center" valign="middle">' + result.updateBy + '</td>';
                html += '<td width="10" class="text-center" valign="middle">' + moment(result.updateDate).utcOffset(0).format('DD/MM/YYYY HH:mm');
                html += '<span class="btn-cancel btn btn-warning btn-xs margin-right-5 hidden"><i class="fa fa-rotate-left"></i></span><span class="btn-save btn btn-success btn-xs hidden"><i class="fa fa-save"></i></span></td>';
                html += '</tr>';
            }

            $('#tb-result tbody').html(html);
            if (data.result.length == 0) {
                $('#dv-no_data').show();
                $('#tb-result').hide();
            }
            $('.wait').show();
            $('#tb-result').show();
            $('.hidden').removeClass('hidden').hide();

        } else {
            $('#dv-no_data').show();
            $('#tb-result').hide();
        }
    }, 'json').fail(function(xhr, textStatus, errorThrown) {
        console.log(xhr.statusText);
    });
}

function loadNewsByMessage() {
    $('#dv-loading_data').show();
    $('.wait').hide();
    $('.form-member').hide();
    $('#dv-no_data').hide();
    $.post('https://api.remaxthailand.co.th/news/searchByMemberMessage', {
        apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
        message: $('#search-message').val()
    }, function(data) {
        $('#dv-loading_data').hide();
        if (data.success) {
            var html = '';
            for (i = 0; i < data.result.length; i++) {
                var result = data.result[i];

                var no = i + 1;
                html += '<tr id="' + result.id + '">';
                html += '<td width="10" class="text-center" valign="middle">' + moment(result.addDate).utcOffset(0).format('DD/MM/YYYY HH:mm') + '</td>';
                html += '<td width="10" class="text-center" valign="middle">' + (result.member == 'undefined' ? '' : result.member) + '<br>'+ result.receiver +'</br></td>';
                html += '<td width="200" class="text-left" valign="middle"><input class="form-control input-sm txt-input hidden" type="text" />';
                html += '<p class="current" data-value="'+ result.message +'">' + result.message + '</td>';
                html += '<td width="10" class="text-center" valign="middle"><i class="fa fa-lg i-visible '+(result.visible ? 'text-success fa-eye' : 'text-danger fa-eye-slash')+' pointer"></i></td>';
                html += '<td width="10" class="text-center" valign="middle">' + result.addBy + '</td>';
                html += '<td width="10" class="text-center" valign="middle">' + result.updateBy + '</td>';
                html += '<td width="10" class="text-center" valign="middle">' + moment(result.updateDate).utcOffset(0).format('DD/MM/YYYY HH:mm');
                html += '<span class="btn-cancel btn btn-warning btn-xs margin-right-5 hidden"><i class="fa fa-rotate-left"></i></span><span class="btn-save btn btn-success btn-xs hidden"><i class="fa fa-save"></i></span></td>';
                html += '</tr>';
            }

            $('#tb-result tbody').html(html);
            if (data.result.length == 0) {
                $('#dv-no_data').show();
                $('#tb-result').hide();
            }
            $('.wait').show();
            $('#tb-result').show();
            $('.hidden').removeClass('hidden').hide();

        } else {
            $('#dv-no_data').show();
            $('#tb-result').hide();
        }
    }, 'json').fail(function(xhr, textStatus, errorThrown) {
        console.log(xhr.statusText);
    });
}