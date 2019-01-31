$(function() {
    $('#btn-search').click(function() {
        searchMember();
        return false;
    });

    /*$("#tb-result").on('click', 'tr', function() {
        $('#txt-memberID').html($(this).attr('value'));
        $('#txt-name').html($(this).attr('name'));
        $('#txt-memberType').html($(this).attr('member-type'));
        $('#dv-done').hide();
    });

    $('#btn-submit').click(function() {
        if ($('#txt-memberID').html() != '???')
            if ($('#txt-sellPrice').val() <= 4)
                submit(); 
        return false;
    });*/

    $(document).on('click', '.resetPassword', function() {
        $('#user-id').html($(this).parents('tr').find('.resetPassword').attr('data-id'));
        $('#user-username').html($(this).parents('tr').find('.resetPassword').attr('data-username'));
    });
    $(document).on('click', '#btn-submit', function() {
        if($('#user-id').html().length == 9){
            encr($('#user-id').html(),$('#user-username').html().toLowerCase());
        }   
    });

});

function searchMember() {
    $('#dv-loading_data').show();
    $('.wait').hide();
    $('#dv-adjust').hide();
    $('#dv-no_data').hide();
    $.post('https://api.remaxthailand.co.th/member/search', {
        apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
        search: $.trim($('#txt-search').val())
    }, function(data) {
        $('#dv-loading_data').hide();
        if (data.success) {
            var html = '';
            for (i = 0; i < data.result.length; i++) {
                var result = data.result[i];

                var no = i + 1;
                html += '<tr value="' + result.id + '" username="' + result.username + '" name="' + result.name + '(' + result.username + ')' + '" member-type="' + result.memberType + '"' + ((result.active) ? '' : ' class="text-muted"') + '>';
                html += '<td width="100" class="text-center" valign="middle">' + ((result.active) ? '' : '<strike>') + result.id + ((result.active) ? '' : '</strike>') + '<br><label class="resetPassword label label-danger pointer" data-toggle="modal" data-target="#dv-resetPassword" data-username="'+result.username+'" data-id="'+result.id+'">reset password</label</br></td>';
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

            $('#tb-result tbody').html(html);
            if (data.result.length == 0) {
                $('#dv-no_data').show();
                $('#tb-result').hide();
            }
            //$("#tb-result").DataTable();
            $('.wait').show();
            //$('#dv-adjust').show();
            $('.hidden').removeClass('hidden').hide();

        } else {
            $('#dv-no_data').show();
            $('#tb-result').hide();
        }


    }, 'json').fail(function(xhr, textStatus, errorThrown) {
        console.log(xhr.statusText);
    });
}

function submit() {
    $.post('https://api.remaxthailand.co.th/member/memberToDealer', {
        apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
        member: $('#txt-memberID').html(),
        sellPrice: $('#txt-sellPrice').val(),
        memberType: $('#txt-memberType').html()
    }, function(data) {
        if (data.success) {
            $('#dv-done').show();
        }
    }, 'json').fail(function(xhr, textStatus, errorThrown) {
        console.log(xhr.statusText);
    });
}

function encr(member,key) {
    $.post('https://api.remaxthailand.co.th/security/encrypt', {
        apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
        message: '1234',
        key: key
    }, function(data) {
        if (data.success) {
            //console.log(data.result);
            memberUpdate(member, data.result)
        }
    }, 'json').fail(function(xhr, textStatus, errorThrown) {
        console.log(xhr.statusText);
    });
}

function memberUpdate(member,value) {
    $.post('https://api.remaxthailand.co.th/member/update/password_update', {
        apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
        memberKey: member,
        password: value
    }, function(data) {
        if (data.success) {
            $('#dv-resetPassword').modal('hide')
        } else {
            $('#user-id').html('กรุณาติดต่อโปรแกรมเมอร์');
            $('#user-username').html('หรือกดยกเลิก แล้วกด reset ใหม่อีกครั้ง');
        }
    }, 'json').fail(function(xhr, textStatus, errorThrown) {
        console.log(xhr.statusText);
    });
}