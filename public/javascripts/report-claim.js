$(function () {

	$('.datepicker').datepicker('update', new Date());
	$('.datepicker2').datepicker({
		format: "mm/yyyy",
		startView: "months",
		minViewMode: "months"
	});
	$('.datepicker2').datepicker('update', new Date());

	loadDataDaily();
	loadDataMonthly();
	loadCategory();

	$('#btn-submit').click(function () {
		loadDataDaily();
		return false;
	});

	$('#btn-submit2').click(function () {
		loadDataMonthly();
		return false;
	});

	$('#btn-daily').on('click', function () {
		$('#data-daily').show();
		$('#data-monthly').hide(); 
		$('#data-summary').hide();
	});

	$('#btn-monthly').on('click', function () {
		$('#data-monthly').show();
		$('#data-daily').hide();
		$('#data-summary').hide();
	});
	$('#btn-summary').on('click', function () {
		$('#data-summary').show();
		$('#data-daily').hide();
		$('#data-monthly').hide();
	});
});


function loadDataDaily() {
	$('#dv-loading_data-daily').show();
	$('div-result_header').hide();
	$('div-table1').hide();
	$('div-table2').hide();
	$('div-table3').hide();
	var date = $('#date').val().split('/');
	var strDate = date[1] + '/' + date[0] + '/' + date[2];
	$.post('https://api.remaxthailand.co.th/claim/report_daily', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: 'POWERDDH-8888-8888-B620-48D3B6489999',
		date: strDate
	}, function (data) {
		if (data.success) {
			$('#data1').html('วันที่ ' + $('#date').val() + ' ข้อมูลจากเว็บ');
			$('#data2').html('วันที่ ' + $('#date').val() + ' รับเข้าเอง');
			$('#data4').html('วันที่ ' + $('#date').val() + ' ผิดเงื่อนไขการเคลม');
			$('#data5').html('ของเคลมเสร็จ วันที่ ' + $('#date').val()); 
			$('#data6').html('ของเคลม Shop วันที่ ' + $('#date').val());

			$('#totalWC').html(data.result[0][0].totalWC);
			$('#totalAC').html(data.result[0][0].totalAC);
			$('#totalShop').html(data.result[0][0].totalShop);
			$('#totalQty2').html(data.result[0][0].total);
			$('#totalQty').html(data.result[0][0].total);
			$('#addWC').html(data.result[0][0].addWC);
			$('#addAC').html(data.result[0][0].addAC);
			$('#reject').html(data.result[0][0].reject);
			$('#finish').html(data.result[0][0].finish);
			$('#fnShop').html(data.result[0][0].fnShop);
			$('div-result_header').show();
			var html = '';
			for (i = 0; i < data.result[1].length; i++) {
				var result = data.result[1];
				html += '<tr>';
				html += '<td width="100" class="text-center" valign="middle">' + result[i].name + '</td>';
				html += '<td width="100" class="text-center" valign="middle">' + result[i].qty + '</td>';
				html += '</tr>';
			}
			var html2 = '';
			for (i = 0; i < data.result[2].length; i++) {
				var result = data.result[2];
				html2 += '<tr>';
				html2 += '<td width="100" class="text-center" valign="middle">' + result[i].name + '</td>';
				html2 += '<td width="100" class="text-center" valign="middle">' + result[i].qty + '</td>';
				html2 += '</tr>';
			}
			var html3 = '';
			for (i = 0; i < data.result[3].length; i++) {
				var result = data.result[3];
				html3 += '<tr>';
				html3 += '<td width="100" class="text-center" valign="middle">' + result[i].name + '</td>';
				html3 += '<td width="100" class="text-center" valign="middle">' + result[i].qty + '</td>';
				html3 += '</tr>';
			}
			$('#tb-result tbody').html(html);
			$('#tb-result2 tbody').html(html2);
			$('#tb-result3 tbody').html(html3);
			if (data.result[1].length > 0) {
				$('div-table1').show();
			}
			if (data.result[2].length > 0) {
				$('div-table2').show();
			}
			if (data.result[3].length > 0) {
				$('div-table3').show();
			}
			$('#dv-loading_data-daily').hide();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}
function loadDataMonthly() {
	$('#dv-loading_data-monthly').show();
	$('#tb-result-monthly').hide(); 
	$('#dv-result-monthly').hide();
	var date = $('#date2').val().split('/');
	$.post('https://api.remaxthailand.co.th/claim/report_monthly', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		year: date[1],
		month: date[0]
	}, function (data) {
		if (data.success) {

			$('#costPrice').html('<b>มูลค่าคลังเคลมเดือนนี้ทั้งหมด : </b>'+numberWithCommas(data.result[0][0].cost));
			$('#customerPrice').html('<b>มูลค่าเคลมลูกค้าทั่วไปเดือนนี้ทั้งหมด : </b>'+numberWithCommas(data.result[0][0].customerPrice));
			$('#shopPrice').html('<b>มูลค่าเคลมลูกค้าช็อปเดือนนี้ทั้งหมด : </b>'+numberWithCommas(data.result[0][0].shopPrice));

			var html = '';
			for (i = 0; i < data.result[1].length; i++) {
				var result = data.result[1];
				html += '<tr>';
				html += '<td width="100" class="" valign="middle">' + result[i].shopName + '</td>';
				html += '<td width="100" class="text-center" valign="middle">' + result[i].brand + '</td>';
				html += '<td width="100" class="text-center" valign="middle">' + result[i].status + '</td>';
				html += '<td width="100" class="text-center" valign="middle">' + numberWithCommas(result[i].price) + '</td>';
				html += '</tr>';
			}
			$('#tb-result-monthly tbody').html(html);
			$('#tb-result-monthly').show();
			$('#dv-result-monthly').show();
			$('#dv-loading_data-monthly').hide();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadCategory() {
	$('#dv-loading-summary').show();
	$.post('https://api.remaxthailand.co.th/category/info', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: 'POWERDDH-8888-8888-B620-48D3B6489999'
	}, function (data) {
		if (data.success) {
			$('#cbb-category').append('<option value="">ทั้งหมด</option>');
			for (i = 0; i < data.result.length; i++) {
				var result = data.result[i];
				$('#cbb-category').append('<option value=' + result.url + '>' + result.name + '</option>');
			}
			$('#cbb-category option:eq(0)').attr('selected', 'selected');
			$('#dv-loading-summary').hide();
			$('').show();
			//loadAging();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};