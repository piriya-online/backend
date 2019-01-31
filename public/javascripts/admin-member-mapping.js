$(function() {
    $('#btn-search').click(function() {
        searchMember();
        return false;
    });

    $("#tb-result").on('click', 'tr', function() {
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
                html += '<tr value="' + result.id + '" name="' + result.name + '(' + result.username + ')' + '" member-type="' + result.memberType + '">';
                html += '<td width="100" class="text-center" valign="middle">' + result.id + '</td>';
                html += '<td width="200" class="text-center txt-name" valign="middle">' + result.name + '</td>';
                html += '<td width="200" class="text-center" valign="middle">' + result.username + '</td>';
                html += '<td width="200" class="text-center" valign="middle">' + result.memberType + '</td>';
                html += '<td width="200" class="text-center" valign="middle">' + result.sellPrice + '</td>';
                html += '<td width="200" class="text-center" valign="middle">' + result.email + '</td>';
                html += '<td width="200" class="text-center" valign="middle">' + result.mobile + '</td>';
                html += '<td width="200" class="text-center" valign="middle">' + moment(result.addDate).utcOffset(0).format('DD/MM/YYYY HH:mm') + '</td>';
                html += '</tr>';
            }

            $('#tb-result tbody').html(html);
            if (data.result.length == 0) {
                $('#dv-no_data').show();
                $('#tb-result').hide();
            }
            //$("#tb-result").DataTable();
            $('.wait').show();
            $('#dv-adjust').show();
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
