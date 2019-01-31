$(function() {

    loadTeamworkName();

    $(document).on('change', '#select-type', function() {
        renderData();
    });

    $(document).on('click', '#ul-month li', function() {
        $('#ul-month li.active').removeClass('active');
        $(this).addClass('active');
        renderData();
    });

    $(document).on('click', '#tb-result .orderNo', function() {
        $('tr.selected').removeClass('selected');
        $(this).parents('tr').addClass('selected');
        $('.sp-title').html($(this).html());
        loadDetail($(this).html());
    });

    $(document).on('click', '#tb-result .orderApprove', function() {
        $('tr.selected').removeClass('selected');
        $(this).parents('tr').addClass('selected');
        $('.sp-title').html($(this).parents('tr').find('.orderNo').html());
    });

    $(document).on('click', '#btn-approve', function() {
		
		$.post($('#apiUrl').val() + '/order/approve', {
			authKey: $('#authKey').val(),
			orderNo: $('tr.selected .orderNo').html(),
		}, function(data) {
			if (data.success) {
				$('#dv-approve').modal('hide'); 
				$('tr.selected .orderApprove').remove();
				$('tr.selected i.fa-check-circle').removeClass('text-muted').addClass('text-success').css('opacity', 1);
				$('tr.selected').removeClass('selected');
			}
		});

    });

    $(document).on('click', '#tb-result .orderCredit', function() {
        $('#btn-credit').prop( "disabled", true );
        $('.text-taxNo').val('')

        $('tr.selected').removeClass('selected');
        $(this).parents('tr').addClass('selected');
        $('.sp-title').html($(this).parents('tr').find('.orderNo').html());
        //$('.bill-price').html(numberWithCommas($(this).parents('tr').find('.orderCredit').attr('data-values')));
        $('input[value=0]').iCheck('check'); 

        $.post('https://api.remaxthailand.co.th/account/neolution/invoicePrice', {
			apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
			orderNo: $('tr.selected .orderNo').html(),
			vat: $('input[name=vatselected]:checked').val()
		}, function(data){
			if (data.success) {
				$('.bill-price').html(numberWithCommas(data.result[0].totalPriceAV.toFixed(2)));
                $('#btn-credit').prop( "disabled", false );
			}
		}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });

    });

    $(document).on('click', '#btn-credit', function() {		
        $.post('https://api.remaxthailand.co.th/account/neolution/credit-add', {
			apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
			memberKey: $('#authKey').val(),
			orderNo: $('tr.selected .orderNo').html(),
            vatType: $('input[name=vatselected]:checked').val(),
            totalPrice: $('.bill-price').html(),
			creditDay: $('.text-credit_day').val(),
            taxNo: $('.text-taxNo').val(),
			remark: ''
		}, function(data){
			if (data.success) {
				$('#dv-credit').modal('hide'); 
				$('tr.selected .orderCredit').remove();
			}
		}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
    });

    $(document).on('click', '#btn-customer_credit', function() {
        $('#dv-result').hide();
        $('#dv-category').hide(); 
        $('#btn-customer_credit').hide(); 
        loadNeoCredit();
        $('#dv-neo_credit').show();
        $('#btn-order').show();
    });

    $(document).on('click', '#btn-order', function() {
        $('#dv-result').show();
        $('#dv-category').show(); 
        $('#btn-customer_credit').show(); 
        
        $('#dv-neo_credit').hide();
        $('#btn-order').hide();
    });

    $(document).on('click', '#tb-result_unpaid .orderPaid', function() {
        $('tr.selected').removeClass('selected');
        $(this).parents('tr').addClass('selected');
        $('.sp-title').html($(this).parents('tr').find('.orderNo').html());
        $('.bill-price').html(numberWithCommas($(this).parents('tr').find('.orderPaid').attr('data-values')));
    });

    $(document).on('click', '#btn-paid', function() {		
        $.post('https://api.remaxthailand.co.th/account/neolution/credit-update', {
			apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
			memberKey: $('#authKey').val(),
			orderNo: $('tr.selected .orderNo').html(),
			paidPrice: $('.bill-price').html(),
			remark: ''
		}, function(data){
			if (data.success) {
                $('#dv-dialog').modal('hide'); 
				loadNeoCredit();
			}
		}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
    });

    $(document).on('change', '#selectPrevious', function() {
		loadNeoCreditPaid();
	});

    $('input').on('ifChecked', function(event){ 
        $('.bill-price').html('<i class="fa fa-circle-o-notch fa-spin fa-fw"></i>');
        $.post('https://api.remaxthailand.co.th/account/neolution/invoicePrice', {
			apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
			orderNo: $('tr.selected .orderNo').html(),
			vat: $('input[name=vatselected]:checked').val()
		}, function(data){
			if (data.success) {
				$('.bill-price').html(numberWithCommas(data.result[0].totalPriceAV.toFixed(2)));
			}
		}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
    });

});


function loadTeamworkName() {
    $.post($('#apiUrl').val() + '/member/teamwork/data', {
        authKey: $('#authKey').val(),
    }, function(data) {
        if (data.success) {
            if (data.correct) {
                for (i = 0; i < data.result.length; i++) {
                    var result = data.result[i];
                    if (result.memberType == 'headSale') {
                        $('#og-headSale').append('<option data-type="headSale" value="' + result.id + '">' + result.name + '</option>');
                    } else if (result.memberType == 'sale') {
                        $('#og-sale').append('<option data-type="sale" value="' + result.id + '">' + result.name + '</option>');
                    } else if (result.memberType == 'dealer') {
                        $('#og-dealer').append('<option data-type="dealer" value="' + result.id + '">' + result.name + '</option>');
                    }
                }
                if ($('#og-headSale option').length == 0) $('#og-headSale').remove();
                if ($('#og-sale option').length == 0) $('#og-sale').remove();
                if ($('#og-dealer option').length == 0) $('#og-dealer').remove();
                loadData();
            }
        }
    }, 'json').fail(function(xhr, textStatus, errorThrown) {
        console.log(xhr.statusText);
    });
}


function loadData() {
    $.post($('#apiUrl').val() + '/member/commission/summary', {
        authKey: $('#authKey').val(),
    }, function(data) {
        if (data.success && typeof data.error == 'undefined') {
            if (data.correct) {
                var html = '';
                for (i = 0; i < data.result.length; i++) {
                    var result = data.result[i];
                    html += '<tr class="' + ((result.month == 0) ? 'selected' : 'hidden') + ' month-' + result.month + '">';
                    html += '<td><span class="' + ((!result.active) ? ' msg_erase' : '') + ' orderNo text-info pointer" data-toggle="modal" data-target="#dv-detail">' + result.orderNo + '</span></td>';
                    html += '<td class="status">';
                    if (!result.active) {
                        html += '<span  class="label label-default">' + $('#msg-cancel').val() + '</span></td>';
                        html += '<td  width="20"></td>';
                        html += '<td  width="20"></td>';
                        html += '<td  width="20"></td>';
                    }
                    else {
						if (result.isApprove != undefined) {
							html += '<i class="fa pointer fa-check-circle show-tooltip ' + ((result.isApprove) ? 'text-success' : 'text-muted') + '" data-toggle="tooltip" data-placement="top" title="' + ((result.isApprove) ? $('#msg-approved').val() : $('#msg-awaitingApprove').val()) + '"></i>';
						}
                        html += ' <i class="fa pointer fa-credit-card show-tooltip ' + ((result.isPay) ? 'text-success' : 'text-muted') + '" data-toggle="tooltip" data-placement="top" title="' + ((result.isPay) ? $('#msg-paid').val() : $('#msg-unpaid').val()) + '"></i>';
                        html += ' <i class="fa pointer fa-cube show-tooltip ' + ((result.isPack) ? 'text-success' : 'text-muted') + '" data-toggle="tooltip" data-placement="top" title="' + ((result.isPack) ? $('#msg-pack').val() : $('#msg-unpack').val()) + '"></i>';
                        html += '</td>';
                        
                        html += '<td class="action" width="20"><a href="https://api.remaxthailand.co.th/report/neoinvoice/0/'+result.orderNo+'"  target="_blank"><i class="fa pointer fa-cloud-download show-tooltip" data-toggle="tooltip" data-placement="top" title="Non VAT"></i></a>';
                        //html += '<td></td>';
                        //html += '<td></td>';
                        html += '<td class="action" width="20"><a href="https://api.remaxthailand.co.th/report/neoinvoice/1/'+result.orderNo+'"  target="_blank"><i class="fa pointer fa-cloud-download text-warning show-tooltip" data-toggle="tooltip" data-placement="top" title="Exclude VAT"></i></a>';
                        html += '<td class="action" width="20"><a href="https://api.remaxthailand.co.th/report/neoinvoice/2/'+result.orderNo+'"  target="_blank"><i class="fa pointer fa-cloud-download text-danger show-tooltip" data-toggle="tooltip" data-placement="top" title="Include VAT"></i></a>';
                    }
                    html += '<td class="dealer dealer-' + result.dealerCode + '" data-id="' + result.dealerCode + '">' + 
						((result.active && result.isApprove != undefined && result.isApprove == 0) ? '<label class="orderApprove label label-primary pointer" data-toggle="modal" data-target="#dv-approve">Approve ?</label> ' : '') + ((result.isPack && !result.isPay) ? ((result.active && result.isCredit != undefined && result.isCredit == 0) ? '<label class="orderCredit label label-danger pointer" data-toggle="modal" data-target="#dv-credit" data-values="'+((result.billPrice != undefined) ? result.billPrice : '' )+'">Credit ?</label> ' : '') :'') + result.dealer.replace(' ()','') + '</td>'; 
                    if (result.headSaleCode != undefined) {
                        html += '<td class="hidden headSale headSale-' + result.headSaleCode + '" data-id="' + result.headSaleCode + '">' + result.headSale + '</td>';
                    }
                    /*if (result.saleCode != undefined) {
                        $('#tb-result thead .sale').show();
                        html += '<td class="sale sale-' + result.saleCode + '" data-id="' + result.saleCode + '">' + result.sale + '</td>';
                    } else {
                        $('#tb-result thead .sale').show();
                        html += '<td class="sale sale-" data-id="">-</td>';
                    }*/
                    html += '<td class="price text-right">' + numberWithCommas(result.price) + '</td>';
                    html += '<td class="text-right">' + result.discount + '%</td>';
                    html += '<td class="totalPrice text-right">' + numberWithCommas(result.totalPrice) + '</td>';
                    html += '<td class="' + ((!result.active) ? ' msg_erase' : '') + ' income text-right ' + ((result.isPay) ? 'text-red font-bold' : 'text-muted') + '" data-income="' + result.income + '">' + ((result.income > 0) ? numberWithCommas(result.income) : '-') + '</td>';
                    html += '</tr>';
                }

                $('#tb-result tbody').html(html);
                $('.show-tooltip').tooltip();
                $('i.text-muted').css('opacity', 0.3);
                $('.hidden').removeClass('hidden').hide();
                $('.wait').show();
                $('#dv-loading').hide();

				if($('#tb-result tbody .headSale').length > 0){
					$('#tb-result thead .headSale').show();
					$('#tb-result tbody .headSale').show();
				}
				else {
					$('#tb-result thead .headSale').hide();
					$('#tb-result tbody .headSale').hide();
				}

                calculateIncome();

                /*if (result.special != undefined) {
                    $('#tb-result thead .sale, #tb-result td.sale').hide();
                    $('#tb-result thead .headSale, #tb-result td.headSale').hide();
                }*/

            } else {
                $('#dv-loading').hide();
                $('#dv-no_data').show();
            }
            
            loadNeoCredit();
            if($('#role').val()=='manager'){ $('#btn-customer_credit').show();
            }else{$('#btn-customer_credit').hide();}

        } else if (data.error.substring(0,7) == 'Timeout'){
           // console.log(data.error)
           loadData();
        }
        
    }, 'json').fail(function(xhr, textStatus, errorThrown) {
        console.log(xhr.statusText);
    });
}

function calculateIncome() {
    var sum = 0;
    $('#tb-result tbody tr.selected .text-red').each(function() {
        sum += parseInt($(this).data('income'));
    });
    $('.sp-Income').html(numberWithCommas(sum.toFixed(2)));
}

function renderData() {
    $('#tb-result tbody tr').hide();
    $('#tb-result tbody tr.selected').removeClass('selected');

    if ($('#select-type :selected').data('type') == 'all') {
        $('#tb-result tbody tr.month-' + $('#ul-month .active').data('month')).addClass('selected').show();
    } else {
        $('.' + $('#select-type :selected').data('type') + '-' + $('#select-type :selected').val()).parents('tr.month-' + $('#ul-month .active').data('month')).addClass('selected').show();
    }

    calculateIncome();
}


function loadDetail(orderNo) {
    $.post($('#apiUrl').val() + '/member/commission/detail', {
        authKey: $('#authKey').val(),
        orderNo: orderNo,
    }, function(data) {
        if (data.success) {
            if (data.correct) {
                var html = '';
                var sumQty = 0;
                var sumManager = 0;
                var sumHeadSale = 0;
                var sumSale = 0;
                for (i = 0; i < data.result.length; i++) {
                    var result = data.result[i];
                    sumQty += result.qty;
                    html += '<tr>';
                    html += '<td>' + result.name + '</td>';
                    html += '<td class="text-right">' + numberWithCommas(result.qty) + '</td>';
                    html += '<td class="text-right">' + numberWithCommas(result.price) + '</td>';
                    html += '<td class="text-right">' + numberWithCommas(result.discount) + '%</td>';
                    html += '<td class="text-right font-bold text-green">' + numberWithCommas(result.totalPrice.toFixed(2)) + '</td>';
                    if (result.managerCost != undefined) {
                        sumManager += result.managerIncome * result.qty;
                        $('#tb-result_detail thead .role-manager').show();
                        html += '<td class="text-right">' + numberWithCommas(result.managerCost) + '</td>';
                        html += '<td class="text-right font-bold">' + ((result.managerIncome > 0) ? numberWithCommas(result.managerIncome.toFixed(0)) : '-') + '</td>';
                        html += '<td class="text-right font-bold text-red">' + ((result.managerIncome > 0) ? numberWithCommas((result.managerIncome * result.qty).toFixed(0)) : '-') + '</td>';
                    }
                    if (result.headSaleCost != undefined) {
                        sumHeadSale += result.headSaleIncome * result.qty;
                        $('#tb-result_detail thead .role-headSale').show();
                        html += '<td class="text-right">' + numberWithCommas(result.headSaleCost) + '</td>';
                        html += '<td class="text-right font-bold">' + ((result.headSaleIncome > 0) ? numberWithCommas(result.headSaleIncome.toFixed(0)) : '-') + '</td>';
                        html += '<td class="text-right font-bold text-red">' + ((result.headSaleIncome > 0) ? numberWithCommas((result.headSaleIncome * result.qty).toFixed(0)) : '-') + '</td>';
                    }
                    /*if ( result.saleCost != undefined ) {
                    	sumSale += result.saleIncome*result.qty;
                    	$('#tb-result_detail thead .role-sale').show();
                    	html += '<td class="text-right">'+numberWithCommas(result.saleCost)+'</td>';
                    	html += '<td class="text-right font-bold">'+((result.saleIncome > 0) ? numberWithCommas(result.saleIncome.toFixed(0)) : '-')+'</td>';
                    	html += '<td class="text-right font-bold text-red">'+((result.saleIncome > 0) ? numberWithCommas((result.saleIncome*result.qty).toFixed(0)) : '-')+'</td>';
                    }*/
                    html += '</tr>';
                }
                $('#tb-result_detail tbody').html(html);
                html = '<tr>';
                html += '<td class="text-right">' + $('#msg-total').val() + '</td><td class="text-right">' + numberWithCommas(sumQty) + '</td>';
                html += '<td colspan="3"></td>';
                if ($('#tb-result_detail thead .role-manager').css('display') != 'none') html += '<td colspan="3" class="text-right font-bold text-red">' + ((sumManager > 0) ? numberWithCommas(sumManager.toFixed(2)) : '-') + '</td>';
                if ($('#tb-result_detail thead .role-headSale').css('display') != 'none') html += '<td colspan="3" class="text-right font-bold text-red">' + ((sumHeadSale > 0) ? numberWithCommas(sumHeadSale.toFixed(2)) : '-') + '</td>';
                if ($('#tb-result_detail thead .role-sale').css('display') != 'none') html += '<td colspan="3" class="text-right font-bold text-red">' + ((sumSale > 0) ? numberWithCommas(sumSale.toFixed(2)) : '-') + '</td>';
                html += '</tr>';
                $('#tb-result_detail tbody').append(html);
            } else {
                $('#tb-result_detail tbody').html('');
                //$('#dv-loading').hide();
                //$('#dv-no_data').show();
            }
        }
    }, 'json').fail(function(xhr, textStatus, errorThrown) {
        console.log(xhr.statusText);
    });

    
}

function loadNeoCredit() {
    
    $('.wait2').hide();
    $('#dv-no_data2').hide();
    $('#dv-loading_data2').show();
    $('#tb-result_unpaid').hide();
    $('#tb-result_unpaid_summarry').hide();
    $.post('https://api.remaxthailand.co.th/account/neolution/credit-info', {
        apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
        memberKey: $('#authKey').val(),
        orderNo: '',
        paid: 0,
        month: ''
    }, function(data){
        if (data.success) {
            var values = data.result;
            if(values[0].length > 0){
                var html1 = '';
                for( i=0; i<values[0].length; i++ ) {
                    var result = values[0][i];
                    //var no = i+1;
                    html1 += '<tr>';
                    html1 += '<td class="unpaid-order orderNo" valign="middle">'+result.orderNo+'</td>';
                    html1 += '<td valign="middle"><label class="orderPaid label label-danger pointer" data-toggle="modal" data-target="#dv-dialog" data-values='+result.totalPrice+'>Paid ?</label> '+result.dealer+'</td>';
                    html1 += '<td class="text-right" valign="middle" >'+((result.totalPrice == 0) ? '-' : numberWithCommas(result.totalPrice))+'</td>';
                    html1 += '<td valign="middle">'+result.headSale+'</td>';
                    html1 += '<td valign="middle">'+moment(result.dueDate).utcOffset(0).format('DD/MM/YYYY')+'</td>';
                    html1 += '</tr>';
                }

                var html2 = '';
                for( i=0; i<values[1].length; i++ ) {
                    var result = values[1][i];
                    //var no = i+1;
                    html2 += '<tr>';
                    html2 += '<td valign="middle">'+result.dealer+'</td>';
                    html2 += '<td class="sumTotal text-right" valign="middle" data-val= '+result.totalPrice+'>'+((result.totalPrice == 0) ? '-' : numberWithCommas(result.totalPrice))+'</td>';
                    html2 += '</tr>';
                }

                $('#tb-result_unpaid tbody').html( html1 );
                $('#tb-result_unpaid').show();

                $('#tb-result_unpaid_summarry tbody').html( html2 );
                $('#tb-result_unpaid_summarry').show();

                $('.wait2').show();
                $('#dv-loading_data2').hide();
            } else {
                $('#dv-loading_data2').hide();
                $('#dv-no_data2').show();
            }
        } else {
            $('#dv-loading_data2').hide();
            $('#dv-no_data2').show();
        }
        loadNeoCreditPaid();
    }, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadNeoCreditPaid() {
    $('.wait3').hide();
    $('#dv-no_data3').hide();
    $('#dv-loading_data3').show();
    $('#tb-result_paid').hide();

    $.post('https://api.remaxthailand.co.th/account/neolution/credit-info', {
        apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
        memberKey: $('#authKey').val(),
        orderNo: '',
        paid: 1,
        month: $('#selectPrevious').val()
    }, function(data){
        if (data.success) {
            var values = data.result;
            if(values[0].length > 0){
                var html1 = '';
                for( i=0; i<values[0].length; i++ ) {
                    var result = values[0][i];
                    //var no = i+1;
                    html1 += '<tr>';
                    html1 += '<td class="unpaid-order orderNo" valign="middle">'+result.orderNo+'</td>';
                    html1 += '<td valign="middle">'+result.dealer+'</td>';
                    html1 += '<td class="text-right" valign="middle" >'+((result.totalPrice == 0) ? '-' : numberWithCommas(result.totalPrice))+'</td>';
                    html1 += '<td valign="middle">'+result.headSale+'</td>';
                    html1 += '<td valign="middle">'+moment(result.paidDate).utcOffset(0).format('DD/MM/YYYY HH:mm')+'</td>';
                    html1 += '</tr>';
                }

                $('#tb-result_paid tbody').html( html1 );
                $('#tb-result_paid').show();


                $('.wait3').show();
                $('#dv-loading_data3').hide();
            } else {
                $('#dv-loading_data3').hide();
                $('#dv-no_data3').show();
            }
        } else {
            $('#dv-loading_data3').hide();
            $('#dv-no_data3').show();
        }
    }, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}