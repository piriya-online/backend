var agingData;
var runrateDate;
var monthlySaleData;
var config;
var loadYearDone = false;
var loadGeoChartDone = false;
var monthEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var monthEn2 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var monthEnFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var selectedDataTypeMonthly = '';
var selectedMemberMonthly = '';
var selectedDataTypeDaily = '';
var selectedMemberDaily = '';
var brandUrl = '';
$(function () {
	if ($('#role').val() == 'owner-wk') {
		brandUrl = 'wk';
	}
	loadBrand();
	$('.sidebar-toggle').click();
	//loadYear();
	google.charts.load('current', { 'packages': ['bar', 'corechart', 'geochart'] });

	$(window).scroll(function () {
		var a = $('#scroll-top').find('a');
		if ($(this).scrollTop() > 250) {
			a.fadeIn(200);
		} else {
			a.fadeOut(200);
		}
	});

	$('#scroll-top').click(function () {
		$("html, body").animate({ scrollTop: 0 }, 1000);
		return false;
	});

	//loadmData();
	$(document).on('change', '#selectPrevious', function () {
		$('#dv-monthlySaleByCategory').slideUp();
		loadmData();
	});
	$(document).on('change', '#selectType', function () {
		$('#dv-monthlySaleByCategory').slideUp();
		loadColumnChart();
	});

	$(document).on('change', '#selectYear', function () {
		loadSummaryData();
	});

	$(document).on('change', '#selectMonth', function () {
		loadDailySaleData();
	});

	$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
		if (e.currentTarget.hash == '#b') {
			if (loadYearDone == false)
				loadYear();
		} else if (e.currentTarget.hash == '#c') {
			if (loadGeoChartDone == false) {
				loadThailandInfo();
				loadCustomerOrderByProvince();
				loadCustomerOrder();
			}
		}
		else if (e.currentTarget.hash == '#d' && $('#selectMonth option').length == 0) {
			loadMonth();
		}
	})
	//---------------------------------------------//
	loadConfig();
	/*loadThailandInfo();
	loadCustomerOrderByProvince();
	loadCustomerOrder();*/


	$('#dv-top-sell select').val(config.provinceMonthSelected);

	$(document).on('click', '#dv-top-sell .show-province', function () {
		if ($(this).hasClass('fa-eye')) {
			$(this).removeClass('fa-eye').removeClass('text-green').addClass('fa-eye-slash').addClass('text-yellow');
			config.provinceExcept += $(this).parent().find('.province').html() + '|';
			config.memberTypeSelect = $('.select-memberType option:selected').attr('data-type');
		}
		else {
			$(this).addClass('fa-eye').removeClass('text-yellow').removeClass('fa-eye-slash').addClass('text-green');
			config.provinceExcept = config.provinceExcept.replace('|' + $(this).parent().find('.province').html() + '|', '|');
			config.memberTypeSelect = $('.select-memberType option:selected').attr('data-type');
		}
		storage.set('ConfigScreenReportCustomerOrder', config);
		renderCustomerOrderByProvince();
	});

	$(document).on('change', '#dv-top-sell .select-month', function () {
		config.provinceMonthSelected = $('#dv-top-sell .select-month option:selected').data('month');
		storage.set('ConfigScreenReportCustomerOrder', config);
		renderCustomerOrderByProvince();
	});

	$(document).on('change', '#dv-top-sell .select-memberType', function () {
		loadCustomerOrderByProvince();
	});

	$(document).on('click', '#dv-top-sell .province', function () {
		renderOrderData($(this).data('key'));
	});


	$(document).on('shown.bs.popover', '.td-image', function () {
		$('img.lazy').lazyload({
			effect: "fadeIn"
		});
	});

	$('#exportExl').click(function () {
		exportExl();
		return false;
	});

	$('#btnReload').click(function() {
		loadSummaryData();
		return false;
	}); 

});

function loadYear() {
	$.post('https://api.remaxthailand.co.th/shop/DataYearInSell', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C'
	}, function (data) {
		if (data.success) {
			loadYearDone = true;
			for (i = 0; i < data.result.length; i++) {
				var result = data.result[i];
				$('#selectYear').append('<option value=' + result.year + '>' + result.year + '</option>');
			}
			$('#selectYear option:eq(0)').attr('selected', 'selected');
			loadSummaryData();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadMonth() {
	$.post('https://api.remaxthailand.co.th/sale/dataMonthInSell', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C'
	}, function (data) {
		if (data.success) {
			for (i = 0; i < data.result.length; i++) {
				var result = data.result[i];
				$('#selectMonth').append('<option value=' + result.yearNo + ' data-month="' + result.monthNo + '">' + monthEnFull[result.monthNo - 1] + ' ' + result.yearNo + '</option>');
			}
			loadDailySaleData();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadSummaryData() {
	$.post('https://api.remaxthailand.co.th/sale/monthlySaleOfYear', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		year: $('#selectYear').val(),
		brand: brandUrl,
		notbrand: $('#excluseWk:checked').val()
	}, function (data) {
		if (data.success) {

			var values = data.result;
			if (values.bill[1].member > 0) {
				storage.set('monthlySaleOfYear', JSON.stringify(values));
			}
			json = storage.get('monthlySaleOfYear');

			var chartDataHQ = generateHqDataWithAvg(json.sales);
			var dataNameHQ = chartDataHQ[0];

			google.charts.setOnLoadCallback(function () {
				var data = google.visualization.arrayToDataTable(chartDataHQ);
				var options = {
					title: 'Total Sales Chart' + ((chartDataHQ.length > 1) ? ' (Average ' + numberWithCommas(chartDataHQ[1][6]) + ' Baht)' : ''),
					bars: 'vertical',
					vAxis: { format: 'decimal' },
					bar: { groupWidth: "50%" },
					series: { 7: { type: 'line' } },
					isStacked: true,
					vAxis: {
						viewWindow: {
							min: 0
						}
					},
					seriesType: 'bars',
				};

				var chart = new google.visualization.ColumnChart(document.getElementById('div-chart2'));

				//google.visualization.events.addListener(chart, 'ready', chartLoaded1);

				google.visualization.events.addListener(chart, 'select', function () {
					var selectedItem = chart.getSelection()[0];
					if (selectedItem) {
						selectedDataTypeMonthly = dataNameHQ[selectedItem.column];
						selectedMemberMonthly = '';
						renderMonthlySaleDetail($('#selectYear').val(), selectedItem.row + 1, selectedDataTypeMonthly);
					}
				});
				chart.draw(data, options);
				if (selectedDataTypeMonthly == '') {
					selectedDataTypeMonthly = 'shop';
					var d = new Date();
					renderMonthlySaleDetail($('#selectYear').val(), d.getMonth() + 1, selectedDataTypeMonthly);
				}

			});

			var chartDataSales = generateHqData(json.sales);
			google.charts.setOnLoadCallback(function () {
				var data = google.visualization.arrayToDataTable(chartDataSales);
				var options = {
					title: 'Total Sales Chart (Percent)',
					bars: 'vertical',
					bar: { groupWidth: "50%" },
					isStacked: 'percent',
					hAxis: {
						minValue: 0,
					}
				};
				var chart = new google.visualization.ColumnChart(document.getElementById('div-chartStackPercent'));
				chart.draw(data, options);
			});

			var chartDataQty = generateHqDataWithAvg(json.qty);
			google.charts.setOnLoadCallback(function () {
				var data = google.visualization.arrayToDataTable(chartDataQty);
				var options = {
					title: 'Total Quantity Chart' + ((chartDataQty.length > 1) ? ' (Average ' + numberWithCommas(chartDataQty[1][6]) + ' Pieces)' : ''),
					bars: 'vertical',
					vAxis: { format: 'decimal' },
					bar: { groupWidth: "50%" },
					series: { 7: { type: 'line' } },
					isStacked: true,
					vAxis: {
						viewWindow: {
							min: 0
						}
					},
					seriesType: 'bars',
				};

				var chart = new google.visualization.ColumnChart(document.getElementById('div-chart2_qty'));
				chart.draw(data, options);
			});

			var chartDataProfit = generateHqDataWithAvg(json.profit);
			google.charts.setOnLoadCallback(function () {
				var data = google.visualization.arrayToDataTable(chartDataProfit);
				var options = {
					title: 'Total Profit Chart' + ((chartDataProfit.length > 1) ? ' (Average ' + numberWithCommas(chartDataProfit[1][6]) + ' Baht)' : ''),
					bars: 'vertical',
					vAxis: { format: 'decimal' },
					bar: { groupWidth: "50%" },
					series: { 7: { type: 'line' } },
					isStacked: true,
					vAxis: {
						viewWindow: {
							min: 0
						}
					},
					seriesType: 'bars',
				};

				var chart = new google.visualization.ColumnChart(document.getElementById('div-chart2_profit'));
				chart.draw(data, options);
			});

			var chartDataPrice = generateHqPriceData(json.price);
			google.charts.setOnLoadCallback(function () {
				var data = google.visualization.arrayToDataTable(chartDataPrice);
				var options = {
					title: 'Percent of Total Price and Bill (Dealer) Chart',
					bars: 'vertical',
					vAxis: { format: 'decimal' },
					bar: { groupWidth: "50%" },
					series: [
						{ targetAxisIndex: 0 },
						{ targetAxisIndex: 0 },
						{ targetAxisIndex: 0 },
						{ targetAxisIndex: 0 },
						{ targetAxisIndex: 0 },
						{ targetAxisIndex: 0 },
						{ targetAxisIndex: 0 },
						{ targetAxisIndex: 1, type: 'line' },
						{ targetAxisIndex: 1, type: 'line' },
						{ targetAxisIndex: 1, type: 'line' },
						{ targetAxisIndex: 1, type: 'line' },
						{ targetAxisIndex: 1, type: 'line' },
						{ targetAxisIndex: 1, type: 'line' },
						{ targetAxisIndex: 1, type: 'line' }
					],
					isStacked: 'percent',
					vAxis: {
						viewWindow: {
							min: 0
						}
					},
					seriesType: 'bars',
					curveType: 'function',
				};
				var chart = new google.visualization.ComboChart(document.getElementById('div-chart2_sellPrice'));
				chart.draw(data, options);
			});

			/*chartData = generateHqSeriesData(data.result.qty, data.result.bill);
			google.charts.setOnLoadCallback(function () {
				var data = google.visualization.arrayToDataTable(chartData);
				var options = {
					title: 'Total Quantity and Bill Chart',
					bars: 'vertical',
					vAxis: {format: 'decimal'},
					bar: { groupWidth: "50%" },
					series:[
						{targetAxisIndex:0},
						{targetAxisIndex:0},
						{targetAxisIndex:0},
						{targetAxisIndex:1, type: 'line'},
						{targetAxisIndex:1, type: 'line'},
						{targetAxisIndex:1, type: 'line'}
					],
					isStacked: true,
					vAxis: {
						viewWindow: {
							min:0
						}
					},
					seriesType: 'bars',
					curveType: 'function',
				};
				var chart = new google.visualization.ComboChart(document.getElementById('div-chart2_qty'));
				chart.draw(data, options);
			});
			*/

		}

		loadTable();
		loadTableProfit();
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadSummaryDataBak() {
	$.post('https://api.remaxthailand.co.th/shop/centerAccumulated', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		year: $('#selectYear').val()
	}, function (data) {
		if (data.success) {
			var values = data.result;
			google.charts.setOnLoadCallback(drawChartSummary);
			function drawChartSummary() {
				var data = google.visualization.arrayToDataTable([
					['Month', 'Total Sales'],
					['Jan', values[0][0].jan],
					['Feb', values[0][0].feb],
					['Mar', values[0][0].mar],
					['Apr', values[0][0].apr],
					['May', values[0][0].may],
					['Jun', values[0][0].jun],
					['Jul', values[0][0].jul],
					['Aug', values[0][0].aug],
					['Sep', values[0][0].sep],
					['Oct', values[0][0].oct],
					['Nov', values[0][0].nov],
					['Dec', values[0][0].dec]
				]);
				var options = {
					/*chart: {
						title: 'Chart Quantity',
						subtitle: 'Total Quantity and Total Bill In Year'
					},*/
					title: 'Total Sales Chart',
					bars: 'vertical',
					vAxis: { format: 'decimal' },
					bar: { groupWidth: "50%" },
					/*series:[
								{targetAxisIndex:0},
								{targetAxisIndex:1}
					],*/
					//colors: ['#1a237e']
				};

				//var chart = new google.visualization.ColumnChart(document.getElementById('div-chart2'));
				//chart.draw(data, options);
			}
			google.charts.setOnLoadCallback(drawChartQTY);
			function drawChartQTY() {
				var data = google.visualization.arrayToDataTable([
					['Month', 'Total Quantity', 'Total Bill'],
					['Jan', values[1][0].jan, values[2][0].jan],
					['Feb', values[1][0].feb, values[2][0].feb],
					['Mar', values[1][0].mar, values[2][0].mar],
					['Apr', values[1][0].apr, values[2][0].apr],
					['May', values[1][0].may, values[2][0].may],
					['Jun', values[1][0].jun, values[2][0].jun],
					['Jul', values[1][0].jul, values[2][0].jul],
					['Aug', values[1][0].aug, values[2][0].aug],
					['Sep', values[1][0].sep, values[2][0].sep],
					['Oct', values[1][0].oct, values[2][0].oct],
					['Nov', values[1][0].nov, values[2][0].nov],
					['Dec', values[1][0].dec, values[2][0].dec]
				]);
				var options = {
					/*chart: {
						title: 'Chart Quantity',
						subtitle: 'Total Quantity and Total Bill In Year'
					},*/
					title: 'Total Quantity Chart',
					bars: 'vertical',
					vAxis: { format: 'decimal' },
					bar: { groupWidth: "50%" },
					series: [
						{ targetAxisIndex: 0 },
						{ targetAxisIndex: 1 }
					]
					//colors: ['#1a237e']
				};

				var chart = new google.visualization.ColumnChart(document.getElementById('div-chart2_qty'));
				google.visualization.events.addListener(chart, 'ready', chartSummaryLoaded);
				chart.draw(data, options);
			}
		}

	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function chartSummaryLoaded() {
	$('#box-chart2').show();
	$('#box-chart2 .overlay').hide();
}

function loadmData() {
	$.post('https://api.remaxthailand.co.th/shop/monthlySaleByCategory', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		shop: '',
		month: $('#selectPrevious').val(),
		brand: brandUrl
	}, function (data) {
		if (data.success) {
			mData = data.result;
		}
		loadColumnChart();
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};

function loadColumnChart() {

	google.charts.setOnLoadCallback(drawChart);
	function drawChart() {
		var lblType = '';
		var monthInt = new Date().getMonth();

		var mth0 = monthEn2[monthInt + 12];
		var mth1 = monthEn2[monthInt - 1 + 12];
		var mth2 = monthEn2[monthInt - 2 + 12];
		var mth3 = monthEn2[monthInt - 3 + 12];
		var mth4 = monthEn2[monthInt - 4 + 12];
		var mth5 = monthEn2[monthInt - 5 + 12];
		var mth6 = monthEn2[monthInt - 6 + 12];
		var mth7 = monthEn2[monthInt - 7 + 12];
		var mth8 = monthEn2[monthInt - 8 + 12];
		var mth9 = monthEn2[monthInt - 9 + 12];
		var mth10 = monthEn2[monthInt - 10 + 12];
		var mth11 = monthEn2[monthInt - 11 + 12];
		var mth12 = monthEn2[monthInt - 12 + 12];

		/*var mth0 = 'Aug';
		var mth1 = 'Jul';
		var mth2 = 'Jun';
		var mth3 = 'May';
		var mth4 = 'Apr';
		var mth5 = 'Mar';
		var mth6 = 'Feb';
		var mth7 = 'Jan';
		var mth8 = 'Dec';
		var mth9 = 'Nov';
		var mth10 = 'Oct';
		var mth11 = 'Sep';
		var mth12 = 'Aug';*/

		var dataTable = new google.visualization.DataTable();
		if ($('#selectType').val() == 'type-sale') {
			lblType = 'Sales';
			if ($('#selectPrevious').val() == 0) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth0],
					['Adapter', mData[0][0].adapter != undefined ? mData[0][0].adapter : 0],
					['Bag', mData[0][0].bag != undefined ? mData[0][0].bag : 0],
					['Cable', mData[0][0].cable != undefined ? mData[0][0].cable : 0],
					['Car Gadget', mData[0][0].car_gadget != undefined ? mData[0][0].car_gadget : 0],
					['Case For Smartphone', mData[0][0].case_for_smartphone != undefined ? mData[0][0].case_for_smartphone : 0],
					['Case For Tablet', mData[0][0].case_for_tablet != undefined ? mData[0][0].case_for_tablet : 0],
					['Clearance', mData[0][0].clearance != undefined ? mData[0][0].clearance : 0],
					['Gadget Creative', mData[0][0].creative != undefined ? mData[0][0].creative : 0],
					['Gaming', mData[0][0].gaming != undefined ? mData[0][0].gaming : 0],
					['Home Gadget', mData[0][0].home_gadget != undefined ? mData[0][0].home_gadget : 0],
					['Lamp', mData[0][0].lamp != undefined ? mData[0][0].lamp : 0],
					['Film', mData[0][0].film != undefined ? mData[0][0].film : 0],
					['Smart life', mData[0][0].gadget != undefined ? mData[0][0].gadget : 0],
					['Power Bank', mData[0][0].power_bank != undefined ? mData[0][0].power_bank : 0],
					['Small Talk Bluetooth', mData[0][0]['small_talk-bluetooth'] != undefined ? mData[0][0]['small_talk-bluetooth'] : 0],
					['Speaker', mData[0][0].speaker != undefined ? mData[0][0].speaker : 0],
					['Storage Memory Card', mData[0][0]['storage-memory_card'] != undefined ? mData[0][0]['storage-memory_card'] : 0],
					['Zhuaimao', mData[0][0].zhuaimao != undefined ? mData[0][0].azhuaimaodapter : 0],
					['ยกเลิกใช้งาน', mData[0][0].cancel != undefined ? mData[0][0].cancel : 0],
					['Other', mData[0][0].other != undefined ? mData[0][0].other : 0]
				]);
			} else if ($('#selectPrevious').val() == 1) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth1, mth0],

					['Adapter', mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][1]['small_talk-bluetooth'], mData[0][0]['small_talk-bluetooth']],

					['Speaker', mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][1]['storage-memory_card'], mData[0][0]['storage-memory_card']],

					['Zhuaimao', mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 2) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth2, mth1, mth0],

					['Adapter', mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][2]['small_talk-bluetooth'], mData[0][1]['small_talk-bluetooth'], mData[0][0]['small_talk-bluetooth']],

					['Speaker', mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][2]['storage-memory_card'], mData[0][1]['storage-memory_card'], mData[0][0]['storage-memory_card']],

					['Zhuaimao', mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 3) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth3, mth2, mth1, mth0],

					['Adapter', mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][3]['small_talk-bluetooth'], mData[0][2]['small_talk-bluetooth'], mData[0][1]['small_talk-bluetooth'], mData[0][0]['small_talk-bluetooth']],

					['Speaker', mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][3]['storage-memory_card'], mData[0][2]['storage-memory_card'], mData[0][1]['storage-memory_card'], mData[0][0]['storage-memory_card']],

					['Zhuaimao', mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][3].cancel, mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 4) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[0][4].adapter, mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][4].bag, mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][4].cable, mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][4].car_gadget, mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][4].case_for_smartphone, mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][4].case_for_tablet, mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][4].clearance, mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][4].creative, mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][4].gaming, mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][4].home_gadget, mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][4].lamp, mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],
					
					['Film', mData[0][4].film, mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][4].gadget, mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][4].power_bank, mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][4]['small_talk-bluetooth'], mData[0][3]['small_talk-bluetooth'], mData[0][2]['small_talk-bluetooth'], mData[0][1]['small_talk-bluetooth'], mData[0][0]['small_talk-bluetooth']],

					['Speaker', mData[0][4].speaker, mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][4]['storage-memory_card'], mData[0][3]['storage-memory_card'], mData[0][2]['storage-memory_card'], mData[0][1]['storage-memory_card'], mData[0][0]['storage-memory_card']],

					['Zhuaimao', mData[0][4].zhuaimao, mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][4].cancel, mData[0][3].cancel, mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][4].other, mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 5) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[0][5].adapter, mData[0][4].adapter, mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][5].bag, mData[0][4].bag, mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][5].cable, mData[0][4].cable, mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][5].car_gadget, mData[0][4].car_gadget, mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][5].case_for_smartphone, mData[0][4].case_for_smartphone, mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][5].case_for_tablet, mData[0][4].case_for_tablet, mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][5].clearance, mData[0][4].clearance, mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][5].creative, mData[0][4].creative, mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][5].gaming, mData[0][4].gaming, mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][5].home_gadget, mData[0][4].home_gadget, mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][5].lamp, mData[0][4].lamp, mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][5].film, mData[0][4].film, mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][5].gadget, mData[0][4].gadget, mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][5].power_bank, mData[0][4].power_bank, mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][5]['small_talk-bluetooth'], mData[0][4]['small_talk-bluetooth'], mData[0][3]['small_talk-bluetooth'], mData[0][2]['small_talk-bluetooth'], mData[0][1]['small_talk-bluetooth'], mData[0][0]['small_talk-bluetooth']],

					['Speaker', mData[0][5].speaker, mData[0][4].speaker, mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][5]['storage-memory_card'], mData[0][4]['storage-memory_card'], mData[0][3]['storage-memory_card'], mData[0][2]['storage-memory_card'], mData[0][1]['storage-memory_card'], mData[0][0]['storage-memory_card']],

					['Zhuaimao', mData[0][5].zhuaimao, mData[0][4].zhuaimao, mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][5].cancel, mData[0][4].cancel, mData[0][3].cancel, mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][5].other, mData[0][4].other, mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 6) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[0][6].adapter, mData[0][5].adapter, mData[0][4].adapter, mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][6].bag, mData[0][5].bag, mData[0][4].bag, mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][6].cable, mData[0][5].cable, mData[0][4].cable, mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][6].car_gadget, mData[0][5].car_gadget, mData[0][4].car_gadget, mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][6].case_for_smartphone, mData[0][5].case_for_smartphone, mData[0][4].case_for_smartphone, mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][6].case_for_tablet, mData[0][5].case_for_tablet, mData[0][4].case_for_tablet, mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][6].clearance, mData[0][5].clearance, mData[0][4].clearance, mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][6].creative, mData[0][5].creative, mData[0][4].creative, mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][6].gaming, mData[0][5].gaming, mData[0][4].gaming, mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][6].home_gadget, mData[0][5].home_gadget, mData[0][4].home_gadget, mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][6].lamp, mData[0][5].lamp, mData[0][4].lamp, mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][6].film, mData[0][5].film, mData[0][4].film, mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][6].gadget, mData[0][5].gadget, mData[0][4].gadget, mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][6].power_bank, mData[0][5].power_bank, mData[0][4].power_bank, mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][6]['small_talk-bluetooth'], mData[0][5]['small_talk-bluetooth'], mData[0][4]['small_talk-bluetooth'], mData[0][3]['small_talk-bluetooth'], mData[0][2]['small_talk-bluetooth'], mData[0][1]['small_talk-bluetooth'], mData[0][0]['small_talk-bluetooth']],

					['Speaker', mData[0][6].speaker, mData[0][5].speaker, mData[0][4].speaker, mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][6]['storage-memory_card'], mData[0][5]['storage-memory_card'], mData[0][4]['storage-memory_card'], mData[0][3]['storage-memory_card'], mData[0][2]['storage-memory_card'], mData[0][1]['storage-memory_card'], mData[0][0]['storage-memory_card']],

					['Zhuaimao', mData[0][6].zhuaimao, mData[0][5].zhuaimao, mData[0][4].zhuaimao, mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][6].cancel, mData[0][5].cancel, mData[0][4].cancel, mData[0][3].cancel, mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][6].other, mData[0][5].other, mData[0][4].other, mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 7) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[0][7].adapter, mData[0][6].adapter, mData[0][5].adapter, mData[0][4].adapter, mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][7].bag, mData[0][6].bag, mData[0][5].bag, mData[0][4].bag, mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][7].cable, mData[0][6].cable, mData[0][5].cable, mData[0][4].cable, mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][7].car_gadget, mData[0][6].car_gadget, mData[0][5].car_gadget, mData[0][4].car_gadget, mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][7].case_for_smartphone, mData[0][6].case_for_smartphone, mData[0][5].case_for_smartphone, mData[0][4].case_for_smartphone, mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][7].case_for_tablet, mData[0][6].case_for_tablet, mData[0][5].case_for_tablet, mData[0][4].case_for_tablet, mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][7].clearance, mData[0][6].clearance, mData[0][5].clearance, mData[0][4].clearance, mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][7].creative, mData[0][6].creative, mData[0][5].creative, mData[0][4].creative, mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][7].gaming, mData[0][6].gaming, mData[0][5].gaming, mData[0][4].gaming, mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][7].home_gadget, mData[0][6].home_gadget, mData[0][5].home_gadget, mData[0][4].home_gadget, mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][7].lamp, mData[0][6].lamp, mData[0][5].lamp, mData[0][4].lamp, mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][7].film, mData[0][6].film, mData[0][5].film, mData[0][4].film, mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][7].gadget, mData[0][6].gadget, mData[0][5].gadget, mData[0][4].gadget, mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][7].power_bank, mData[0][6].power_bank, mData[0][5].power_bank, mData[0][4].power_bank, mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][7]['small_talk-bluetooth'], mData[0][6]['small_talk-bluetooth'], mData[0][5]['small_talk-bluetooth'], mData[0][4]['small_talk-bluetooth'], mData[0][3]['small_talk-bluetooth'], mData[0][2]['small_talk-bluetooth'], mData[0][1]['small_talk-bluetooth'], mData[0][0]['small_talk-bluetooth']],

					['Speaker', mData[0][7].speaker, mData[0][6].speaker, mData[0][5].speaker, mData[0][4].speaker, mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][7]['storage-memory_card'], mData[0][6]['storage-memory_card'], mData[0][5]['storage-memory_card'], mData[0][4]['storage-memory_card'], mData[0][3]['storage-memory_card'], mData[0][2]['storage-memory_card'], mData[0][1]['storage-memory_card'], mData[0][0]['storage-memory_card']],

					['Zhuaimao', mData[0][7].zhuaimao, mData[0][6].zhuaimao, mData[0][5].zhuaimao, mData[0][4].zhuaimao, mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][7].cancel, mData[0][6].cancel, mData[0][5].cancel, mData[0][4].cancel, mData[0][3].cancel, mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][7].other, mData[0][6].other, mData[0][5].other, mData[0][4].other, mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 8) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[0][8].adapter, mData[0][7].adapter, mData[0][6].adapter, mData[0][5].adapter, mData[0][4].adapter, mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][8].bag, mData[0][7].bag, mData[0][6].bag, mData[0][5].bag, mData[0][4].bag, mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][8].cable, mData[0][7].cable, mData[0][6].cable, mData[0][5].cable, mData[0][4].cable, mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][8].car_gadget, mData[0][7].car_gadget, mData[0][6].car_gadget, mData[0][5].car_gadget, mData[0][4].car_gadget, mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][8].case_for_smartphone, mData[0][7].case_for_smartphone, mData[0][6].case_for_smartphone, mData[0][5].case_for_smartphone, mData[0][4].case_for_smartphone, mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][8].case_for_tablet, mData[0][7].case_for_tablet, mData[0][6].case_for_tablet, mData[0][5].case_for_tablet, mData[0][4].case_for_tablet, mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][8].clearance, mData[0][7].clearance, mData[0][6].clearance, mData[0][5].clearance, mData[0][4].clearance, mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][8].creative, mData[0][7].creative, mData[0][6].creative, mData[0][5].creative, mData[0][4].creative, mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][8].gaming, mData[0][7].gaming, mData[0][6].gaming, mData[0][5].gaming, mData[0][4].gaming, mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][8].home_gadget, mData[0][7].home_gadget, mData[0][6].home_gadget, mData[0][5].home_gadget, mData[0][4].home_gadget, mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][8].lamp, mData[0][7].lamp, mData[0][6].lamp, mData[0][5].lamp, mData[0][4].lamp, mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][8].film, mData[0][7].film, mData[0][6].film, mData[0][5].film, mData[0][4].film, mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][8].gadget, mData[0][7].gadget, mData[0][6].gadget, mData[0][5].gadget, mData[0][4].gadget, mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][8].power_bank, mData[0][7].power_bank, mData[0][6].power_bank, mData[0][5].power_bank, mData[0][4].power_bank, mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][8]['small_talk-bluetooth'], mData[0][7]['small_talk-bluetooth'], mData[0][6]['small_talk-bluetooth'], mData[0][5]['small_talk-bluetooth'], mData[0][4]['small_talk-bluetooth'], mData[0][3]['small_talk-bluetooth'], mData[0][2]['small_talk-bluetooth'], mData[0][1]['small_talk-bluetooth'], mData[0][0]['small_talk-bluetooth']],

					['Speaker', mData[0][8].speaker, mData[0][7].speaker, mData[0][6].speaker, mData[0][5].speaker, mData[0][4].speaker, mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][8]['storage-memory_card'], mData[0][7]['storage-memory_card'], mData[0][6]['storage-memory_card'], mData[0][5]['storage-memory_card'], mData[0][4]['storage-memory_card'], mData[0][3]['storage-memory_card'], mData[0][2]['storage-memory_card'], mData[0][1]['storage-memory_card'], mData[0][0]['storage-memory_card']],

					['Zhuaimao', mData[0][8].zhuaimao, mData[0][7].zhuaimao, mData[0][6].zhuaimao, mData[0][5].zhuaimao, mData[0][4].zhuaimao, mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][8].cancel, mData[0][7].cancel, mData[0][6].cancel, mData[0][5].cancel, mData[0][4].cancel, mData[0][3].cancel, mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][8].other, mData[0][7].other, mData[0][6].other, mData[0][5].other, mData[0][4].other, mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 9) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[0][9].adapter, mData[0][8].adapter, mData[0][7].adapter, mData[0][6].adapter, mData[0][5].adapter, mData[0][4].adapter, mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][9].bag, mData[0][8].bag, mData[0][7].bag, mData[0][6].bag, mData[0][5].bag, mData[0][4].bag, mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][9].cable, mData[0][8].cable, mData[0][7].cable, mData[0][6].cable, mData[0][5].cable, mData[0][4].cable, mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][9].car_gadget, mData[0][8].car_gadget, mData[0][7].car_gadget, mData[0][6].car_gadget, mData[0][5].car_gadget, mData[0][4].car_gadget, mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][9].case_for_smartphone, mData[0][8].case_for_smartphone, mData[0][7].case_for_smartphone, mData[0][6].case_for_smartphone, mData[0][5].case_for_smartphone, mData[0][4].case_for_smartphone, mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][9].case_for_tablet, mData[0][8].case_for_tablet, mData[0][7].case_for_tablet, mData[0][6].case_for_tablet, mData[0][5].case_for_tablet, mData[0][4].case_for_tablet, mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][9].clearance, mData[0][8].clearance, mData[0][7].clearance, mData[0][6].clearance, mData[0][5].clearance, mData[0][4].clearance, mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][9].creative, mData[0][8].creative, mData[0][7].creative, mData[0][6].creative, mData[0][5].creative, mData[0][4].creative, mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][9].gaming, mData[0][8].gaming, mData[0][7].gaming, mData[0][6].gaming, mData[0][5].gaming, mData[0][4].gaming, mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][9].home_gadget, mData[0][8].home_gadget, mData[0][7].home_gadget, mData[0][6].home_gadget, mData[0][5].home_gadget, mData[0][4].home_gadget, mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][9].lamp, mData[0][8].lamp, mData[0][7].lamp, mData[0][6].lamp, mData[0][5].lamp, mData[0][4].lamp, mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][9].film, mData[0][8].film, mData[0][7].film, mData[0][6].film, mData[0][5].film, mData[0][4].film, mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][9].gadget, mData[0][8].gadget, mData[0][7].gadget, mData[0][6].gadget, mData[0][5].gadget, mData[0][4].gadget, mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][9].power_bank, mData[0][8].power_bank, mData[0][7].power_bank, mData[0][6].power_bank, mData[0][5].power_bank, mData[0][4].power_bank, mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][9]['small_talk-bluetooth'], mData[0][8]['small_talk-bluetooth'], mData[0][7]['small_talk-bluetooth'], mData[0][6]['small_talk-bluetooth'], mData[0][5]['small_talk-bluetooth'], mData[0][4]['small_talk-bluetooth'], mData[0][3]['small_talk-bluetooth'], mData[0][2]['small_talk-bluetooth'], mData[0][1]['small_talk-bluetooth'], mData[0][0]['small_talk-bluetooth']],

					['Speaker', mData[0][9].speaker, mData[0][8].speaker, mData[0][7].speaker, mData[0][6].speaker, mData[0][5].speaker, mData[0][4].speaker, mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][9]['storage-memory_card'], mData[0][8]['storage-memory_card'], mData[0][7]['storage-memory_card'], mData[0][6]['storage-memory_card'], mData[0][5]['storage-memory_card'], mData[0][4]['storage-memory_card'], mData[0][3]['storage-memory_card'], mData[0][2]['storage-memory_card'], mData[0][1]['storage-memory_card'], mData[0][0]['storage-memory_card']],

					['Zhuaimao', mData[0][9].zhuaimao, mData[0][8].zhuaimao, mData[0][7].zhuaimao, mData[0][6].zhuaimao, mData[0][5].zhuaimao, mData[0][4].zhuaimao, mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][9].cancel, mData[0][8].cancel, mData[0][7].cancel, mData[0][6].cancel, mData[0][5].cancel, mData[0][4].cancel, mData[0][3].cancel, mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][9].other, mData[0][8].other, mData[0][7].other, mData[0][6].other, mData[0][5].other, mData[0][4].other, mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 10) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth10, mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[0][10].adapter, mData[0][9].adapter, mData[0][8].adapter, mData[0][7].adapter, mData[0][6].adapter, mData[0][5].adapter, mData[0][4].adapter, mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][10].bag, mData[0][9].bag, mData[0][8].bag, mData[0][7].bag, mData[0][6].bag, mData[0][5].bag, mData[0][4].bag, mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][10].cable, mData[0][9].cable, mData[0][8].cable, mData[0][7].cable, mData[0][6].cable, mData[0][5].cable, mData[0][4].cable, mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][10].car_gadget, mData[0][9].car_gadget, mData[0][8].car_gadget, mData[0][7].car_gadget, mData[0][6].car_gadget, mData[0][5].car_gadget, mData[0][4].car_gadget, mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][10].case_for_smartphone, mData[0][9].case_for_smartphone, mData[0][8].case_for_smartphone, mData[0][7].case_for_smartphone, mData[0][6].case_for_smartphone, mData[0][5].case_for_smartphone, mData[0][4].case_for_smartphone, mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][10].case_for_tablet, mData[0][9].case_for_tablet, mData[0][8].case_for_tablet, mData[0][7].case_for_tablet, mData[0][6].case_for_tablet, mData[0][5].case_for_tablet, mData[0][4].case_for_tablet, mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][10].clearance, mData[0][9].clearance, mData[0][8].clearance, mData[0][7].clearance, mData[0][6].clearance, mData[0][5].clearance, mData[0][4].clearance, mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][10].creative, mData[0][9].creative, mData[0][8].creative, mData[0][7].creative, mData[0][6].creative, mData[0][5].creative, mData[0][4].creative, mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][10].gaming, mData[0][9].gaming, mData[0][8].gaming, mData[0][7].gaming, mData[0][6].gaming, mData[0][5].gaming, mData[0][4].gaming, mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][10].home_gadget,  mData[0][9].home_gadget, mData[0][8].home_gadget, mData[0][7].home_gadget, mData[0][6].home_gadget, mData[0][5].home_gadget, mData[0][4].home_gadget, mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][10].lamp, mData[0][9].lamp, mData[0][8].lamp, mData[0][7].lamp, mData[0][6].lamp, mData[0][5].lamp, mData[0][4].lamp, mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][10].film, mData[0][9].film, mData[0][8].film, mData[0][7].film, mData[0][6].film, mData[0][5].film, mData[0][4].film, mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][10].gadget, mData[0][9].gadget, mData[0][8].gadget, mData[0][7].gadget, mData[0][6].gadget, mData[0][5].gadget, mData[0][4].gadget, mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][10].power_bank, mData[0][9].power_bank, mData[0][8].power_bank, mData[0][7].power_bank, mData[0][6].power_bank, mData[0][5].power_bank, mData[0][4].power_bank, mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][10]['small_talk-bluetooth'], mData[0][9]['small_talk-bluetooth'], mData[0][8]['small_talk-bluetooth'], mData[0][7]['small_talk-bluetooth'], mData[0][6]['small_talk-bluetooth'], mData[0][5]['small_talk-bluetooth'], mData[0][4]['small_talk-bluetooth'], mData[0][3]['small_talk-bluetooth'], mData[0][2]['small_talk-bluetooth'], mData[0][1]['small_talk-bluetooth'], mData[0][0]['small_talk-bluetooth']],

					['Speaker', mData[0][10].speaker, mData[0][9].speaker, mData[0][8].speaker, mData[0][7].speaker, mData[0][6].speaker, mData[0][5].speaker, mData[0][4].speaker, mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][10]['storage-memory_card'], mData[0][9]['storage-memory_card'], mData[0][8]['storage-memory_card'], mData[0][7]['storage-memory_card'], mData[0][6]['storage-memory_card'], mData[0][5]['storage-memory_card'], mData[0][4]['storage-memory_card'], mData[0][3]['storage-memory_card'], mData[0][2]['storage-memory_card'], mData[0][1]['storage-memory_card'], mData[0][0]['storage-memory_card']],

					['Zhuaimao', mData[0][10].zhuaimao, mData[0][9].zhuaimao, mData[0][8].zhuaimao, mData[0][7].zhuaimao, mData[0][6].zhuaimao, mData[0][5].zhuaimao, mData[0][4].zhuaimao, mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][10].cancel,mData[0][9].cancel,mData[0][8].cancel,mData[0][7].cancel,mData[0][6].cancel,mData[0][5].cancel,mData[0][4].cancel,mData[0][3].cancel,mData[0][2].cancel,mData[0][1].cancel,mData[0][0].cancel],

					['Other', mData[0][10].other, mData[0][9].other, mData[0][8].other, mData[0][7].other, mData[0][6].other, mData[0][5].other, mData[0][4].other, mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 11) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth11, mth10, mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[0][11].adapter, mData[0][10].adapter, mData[0][9].adapter, mData[0][8].adapter, mData[0][7].adapter, mData[0][6].adapter, mData[0][5].adapter, mData[0][4].adapter, mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][11].bag, mData[0][10].bag, mData[0][9].bag, mData[0][8].bag, mData[0][7].bag, mData[0][6].bag, mData[0][5].bag, mData[0][4].bag, mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][11].cable, mData[0][10].cable, mData[0][9].cable, mData[0][8].cable, mData[0][7].cable, mData[0][6].cable, mData[0][5].cable, mData[0][4].cable, mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][11].car_gadget, mData[0][10].car_gadget, mData[0][9].car_gadget, mData[0][8].car_gadget, mData[0][7].car_gadget, mData[0][6].car_gadget, mData[0][5].car_gadget, mData[0][4].car_gadget, mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][11].case_for_smartphone, mData[0][10].case_for_smartphone, mData[0][9].case_for_smartphone, mData[0][8].case_for_smartphone, mData[0][7].case_for_smartphone, mData[0][6].case_for_smartphone, mData[0][5].case_for_smartphone, mData[0][4].case_for_smartphone, mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][11].case_for_tablet, mData[0][10].case_for_tablet, mData[0][9].case_for_tablet, mData[0][8].case_for_tablet, mData[0][7].case_for_tablet, mData[0][6].case_for_tablet, mData[0][5].case_for_tablet, mData[0][4].case_for_tablet, mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][11].clearance, mData[0][10].clearance, mData[0][9].clearance, mData[0][8].clearance, mData[0][7].clearance, mData[0][6].clearance, mData[0][5].clearance, mData[0][4].clearance, mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][11].creative, mData[0][10].creative, mData[0][9].creative, mData[0][8].creative, mData[0][7].creative, mData[0][6].creative, mData[0][5].creative, mData[0][4].creative, mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][11].gaming, mData[0][10].gaming, mData[0][9].gaming, mData[0][8].gaming, mData[0][7].gaming, mData[0][6].gaming, mData[0][5].gaming, mData[0][4].gaming, mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][11].home_gadget, mData[0][10].home_gadget,  mData[0][9].home_gadget, mData[0][8].home_gadget, mData[0][7].home_gadget, mData[0][6].home_gadget, mData[0][5].home_gadget, mData[0][4].home_gadget, mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][11].lamp, mData[0][10].lamp, mData[0][9].lamp, mData[0][8].lamp, mData[0][7].lamp, mData[0][6].lamp, mData[0][5].lamp, mData[0][4].lamp, mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][11].film, mData[0][10].film, mData[0][9].film, mData[0][8].film, mData[0][7].film, mData[0][6].film, mData[0][5].film, mData[0][4].film, mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][11].gadget, mData[0][10].gadget, mData[0][9].gadget, mData[0][8].gadget, mData[0][7].gadget, mData[0][6].gadget, mData[0][5].gadget, mData[0][4].gadget, mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][11].power_bank, mData[0][10].power_bank, mData[0][9].power_bank, mData[0][8].power_bank, mData[0][7].power_bank, mData[0][6].power_bank, mData[0][5].power_bank, mData[0][4].power_bank, mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][11]['small_talk-bluetooth'], mData[0][10]['small_talk-bluetooth'], mData[0][9]['small_talk-bluetooth'], mData[0][8]['small_talk-bluetooth'], mData[0][7]['small_talk-bluetooth'], mData[0][6]['small_talk-bluetooth'], mData[0][5]['small_talk-bluetooth'], mData[0][4]['small_talk-bluetooth'], mData[0][3]['small_talk-bluetooth'], mData[0][2]['small_talk-bluetooth'], mData[0][1]['small_talk-bluetooth'], mData[0][0]['small_talk-bluetooth']],

					['Speaker', mData[0][11].speaker, mData[0][10].speaker, mData[0][9].speaker, mData[0][8].speaker, mData[0][7].speaker, mData[0][6].speaker, mData[0][5].speaker, mData[0][4].speaker, mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][11]['storage-memory_card'], mData[0][10]['storage-memory_card'], mData[0][9]['storage-memory_card'], mData[0][8]['storage-memory_card'], mData[0][7]['storage-memory_card'], mData[0][6]['storage-memory_card'], mData[0][5]['storage-memory_card'], mData[0][4]['storage-memory_card'], mData[0][3]['storage-memory_card'], mData[0][2]['storage-memory_card'], mData[0][1]['storage-memory_card'], mData[0][0]['storage-memory_card']],

					['Zhuaimao', mData[0][11].zhuaimao, mData[0][10].zhuaimao, mData[0][9].zhuaimao, mData[0][8].zhuaimao, mData[0][7].zhuaimao, mData[0][6].zhuaimao, mData[0][5].zhuaimao, mData[0][4].zhuaimao, mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][11].cancel, mData[0][10].cancel, mData[0][9].cancel, mData[0][8].cancel, mData[0][7].cancel, mData[0][6].cancel, mData[0][5].cancel, mData[0][4].cancel, mData[0][3].cancel, mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][11].other, mData[0][10].other, mData[0][9].other, mData[0][8].other, mData[0][7].other, mData[0][6].other, mData[0][5].other, mData[0][4].other, mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			} else if ($('#selectPrevious').val() == 12) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth12, mth11, mth10, mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[0][12].adapter, mData[0][11].adapter, mData[0][10].adapter, mData[0][9].adapter, mData[0][8].adapter, mData[0][7].adapter, mData[0][6].adapter, mData[0][5].adapter, mData[0][4].adapter, mData[0][3].adapter, mData[0][2].adapter, mData[0][1].adapter, mData[0][0].adapter],

					['Bag', mData[0][12].bag, mData[0][11].bag, mData[0][10].bag, mData[0][9].bag, mData[0][8].bag, mData[0][7].bag, mData[0][6].bag, mData[0][5].bag, mData[0][4].bag, mData[0][3].bag, mData[0][2].bag, mData[0][1].bag, mData[0][0].bag],

					['Cable', mData[0][12].cable, mData[0][11].cable, mData[0][10].cable, mData[0][9].cable, mData[0][8].cable, mData[0][7].cable, mData[0][6].cable, mData[0][5].cable, mData[0][4].cable, mData[0][3].cable, mData[0][2].cable, mData[0][1].cable, mData[0][0].cable],

					['Car Gadget', mData[0][12].car_gadget, mData[0][11].car_gadget, mData[0][10].car_gadget, mData[0][9].car_gadget, mData[0][8].car_gadget, mData[0][7].car_gadget, mData[0][6].car_gadget, mData[0][5].car_gadget, mData[0][4].car_gadget, mData[0][3].car_gadget, mData[0][2].car_gadget, mData[0][1].car_gadget, mData[0][0].car_gadget],

					['Case For Smartphone', mData[0][12].case_for_smartphone, mData[0][11].case_for_smartphone, mData[0][10].case_for_smartphone, mData[0][9].case_for_smartphone, mData[0][8].case_for_smartphone, mData[0][7].case_for_smartphone, mData[0][6].case_for_smartphone, mData[0][5].case_for_smartphone, mData[0][4].case_for_smartphone, mData[0][3].case_for_smartphone, mData[0][2].case_for_smartphone, mData[0][1].case_for_smartphone, mData[0][0].case_for_smartphone],

					['Case For Tablet', mData[0][12].case_for_tablet, mData[0][11].case_for_tablet, mData[0][10].case_for_tablet, mData[0][9].case_for_tablet, mData[0][8].case_for_tablet, mData[0][7].case_for_tablet, mData[0][6].case_for_tablet, mData[0][5].case_for_tablet, mData[0][4].case_for_tablet, mData[0][3].case_for_tablet, mData[0][2].case_for_tablet, mData[0][1].case_for_tablet, mData[0][0].case_for_tablet],

					['Clearance', mData[0][12].clearance, mData[0][11].clearance, mData[0][10].clearance, mData[0][9].clearance, mData[0][8].clearance, mData[0][7].clearance, mData[0][6].clearance, mData[0][5].clearance, mData[0][4].clearance, mData[0][3].clearance, mData[0][2].clearance, mData[0][1].clearance, mData[0][0].clearance],

					['Gadget Creative', mData[0][12].creative, mData[0][11].creative, mData[0][10].creative, mData[0][9].creative, mData[0][8].creative, mData[0][7].creative, mData[0][6].creative, mData[0][5].creative, mData[0][4].creative, mData[0][3].creative, mData[0][2].creative, mData[0][1].creative, mData[0][0].creative],

					['Gaming', mData[0][12].gaming, mData[0][11].gaming, mData[0][10].gaming, mData[0][9].gaming, mData[0][8].gaming, mData[0][7].gaming, mData[0][6].gaming, mData[0][5].gaming, mData[0][4].gaming, mData[0][3].gaming, mData[0][2].gaming, mData[0][1].gaming, mData[0][0].gaming],

					['Home Gadget', mData[0][12].home_gadget, mData[0][11].home_gadget, mData[0][10].home_gadget,  mData[0][9].home_gadget, mData[0][8].home_gadget, mData[0][7].home_gadget, mData[0][6].home_gadget, mData[0][5].home_gadget, mData[0][4].home_gadget, mData[0][3].home_gadget, mData[0][2].home_gadget, mData[0][1].home_gadget, mData[0][0].home_gadget],

					['Lamp', mData[0][12].lamp, mData[0][11].lamp, mData[0][10].lamp, mData[0][9].lamp, mData[0][8].lamp, mData[0][7].lamp, mData[0][6].lamp, mData[0][5].lamp, mData[0][4].lamp, mData[0][3].lamp, mData[0][2].lamp, mData[0][1].lamp, mData[0][0].lamp],

					['Film', mData[0][12].film, mData[0][11].film, mData[0][10].film, mData[0][9].film, mData[0][8].film, mData[0][7].film, mData[0][6].film, mData[0][5].film, mData[0][4].film, mData[0][3].film, mData[0][2].film, mData[0][1].film, mData[0][0].film],

					['Smart life', mData[0][12].gadget, mData[0][11].gadget, mData[0][10].gadget, mData[0][9].gadget, mData[0][8].gadget, mData[0][7].gadget, mData[0][6].gadget, mData[0][5].gadget, mData[0][4].gadget, mData[0][3].gadget, mData[0][2].gadget, mData[0][1].gadget, mData[0][0].gadget],

					['Power Bank', mData[0][12].power_bank, mData[0][11].power_bank, mData[0][10].power_bank, mData[0][9].power_bank, mData[0][8].power_bank, mData[0][7].power_bank, mData[0][6].power_bank, mData[0][5].power_bank, mData[0][4].power_bank, mData[0][3].power_bank, mData[0][2].power_bank, mData[0][1].power_bank, mData[0][0].power_bank],

					['Small Talk Bluetooth', mData[0][12]['small_talk-bluetooth'], mData[0][11]['small_talk-bluetooth'], mData[0][10]['small_talk-bluetooth'], mData[0][8]['small_talk-bluetooth'], mData[0][7]['small_talk-bluetooth'], mData[0][6]['small_talk-bluetooth'], mData[0][6]['small_talk-bluetooth'], mData[0][5]['small_talk-bluetooth'], mData[0][4]['small_talk-bluetooth'], mData[0][3]['small_talk-bluetooth'], mData[0][2]['small_talk-bluetooth'], mData[0][1]['small_talk-bluetooth'], mData[0][0]['small_talk-bluetooth']],

					['Speaker', mData[0][12].speaker, mData[0][11].speaker, mData[0][10].speaker, mData[0][9].speaker, mData[0][8].speaker, mData[0][7].speaker, mData[0][6].speaker, mData[0][5].speaker, mData[0][4].speaker, mData[0][3].speaker, mData[0][2].speaker, mData[0][1].speaker, mData[0][0].speaker],

					['Storage Memory Card', mData[0][12]['storage-memory_card'], mData[0][11]['storage-memory_card'], mData[0][10]['storage-memory_card'], mData[0][9]['storage-memory_card'], mData[0][8]['storage-memory_card'], mData[0][7]['storage-memory_card'], mData[0][6]['storage-memory_card'], mData[0][5]['storage-memory_card'], mData[0][4]['storage-memory_card'], mData[0][3]['storage-memory_card'], mData[0][2]['storage-memory_card'], mData[0][1]['storage-memory_card'], mData[0][0]['storage-memory_card']],

					['Zhuaimao', mData[0][12].zhuaimao, mData[0][11].zhuaimao, mData[0][10].zhuaimao, mData[0][9].zhuaimao, mData[0][8].zhuaimao, mData[0][7].zhuaimao, mData[0][6].zhuaimao, mData[0][5].zhuaimao, mData[0][4].zhuaimao, mData[0][3].zhuaimao, mData[0][2].zhuaimao, mData[0][1].zhuaimao, mData[0][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[0][12].cancel, mData[0][11].cancel, mData[0][10].cancel, mData[0][9].cancel, mData[0][8].cancel, mData[0][7].cancel, mData[0][6].cancel, mData[0][5].cancel, mData[0][4].cancel, mData[0][3].cancel, mData[0][2].cancel, mData[0][1].cancel, mData[0][0].cancel],

					['Other', mData[0][12].other, mData[0][11].other, mData[0][10].other, mData[0][9].other, mData[0][8].other, mData[0][7].other, mData[0][6].other, mData[0][5].other, mData[0][4].other, mData[0][3].other, mData[0][2].other, mData[0][1].other, mData[0][0].other]
				]);
			}
		} else if ($('#selectType').val() == 'type-qty') {
			lblType = 'Quantity';
			if ($('#selectPrevious').val() == 0) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth0],
					['Adapter', mData[1][0].adapter],
					['Bag', mData[1][0].bag],
					['Cable', mData[1][0].cable],
					['Car Gadget', mData[1][0].car_gadget],
					['Case For Smartphone', mData[1][0].case_for_smartphone],
					['Case For Tablet', mData[1][0].case_for_tablet],
					['Clearance', mData[1][0].clearance],
					['Gadget Creative', mData[1][0].creative],
					['Gaming', mData[1][0].gaming],
					['Home Gadget',mData[1][0].home_gadget],
					['Lamp', mData[1][0].lamp],
					['Film', mData[1][0].film],
					['Smart life', mData[1][0].gadget],
					['Power Bank', mData[1][0].power_bank],
					['Small Talk Bluetooth', mData[1][0]['small_talk-bluetooth']],
					['Speaker', mData[1][0].speaker],
					['Storage Memory Card', mData[1][0]['storage-memory_card']],
					['Zhuaimao', mData[1][0].zhuaimao],
					['ยกเลิกใช้งาน', mData[1][0].cancel],
					['Other', mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 1) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth1, mth0],

					['Adapter', mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][1]['small_talk-bluetooth'], mData[1][0]['small_talk-bluetooth']],

					['Speaker', mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][1]['storage-memory_card'], mData[1][0]['storage-memory_card']],

					['Zhuaimao', mData[1][1].zhuaimao,mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 2) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth2, mth1, mth0],

					['Adapter', mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][2]['small_talk-bluetooth'], mData[1][1]['small_talk-bluetooth'], mData[1][0]['small_talk-bluetooth']],

					['Speaker', mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][2]['storage-memory_card'], mData[1][1]['storage-memory_card'], mData[1][0]['storage-memory_card']],

					['Zhuaimao', mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 3) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth3, mth2, mth1, mth0],

					['Adapter', mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][3].car_gadget, mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][3]['small_talk-bluetooth'], mData[1][2]['small_talk-bluetooth'], mData[1][1]['small_talk-bluetooth'], mData[1][0]['small_talk-bluetooth']],

					['Speaker', mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][3]['storage-memory_card'], mData[1][2]['storage-memory_card'], mData[1][1]['storage-memory_card'], mData[1][0]['storage-memory_card']],

					['Zhuaimao', mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][3].cancel,mData[1][2].cancel,mData[1][1].cancel,mData[1][0].cancel],

					['Other', mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 4) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[1][4].adapter, mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][4].bag, mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][4].cable, mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][4].car_gadget, mData[1][3].car_gadget, mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][4].case_for_smartphone, mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][4].case_for_tablet, mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][4].clearance, mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][4].creative, mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][4].gaming, mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][4].home_gadget, mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][4].lamp, mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][4].film, mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][4].gadget, mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][4].power_bank, mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][4]['small_talk-bluetooth'], mData[1][3]['small_talk-bluetooth'], mData[1][2]['small_talk-bluetooth'], mData[1][1]['small_talk-bluetooth'], mData[1][0]['small_talk-bluetooth']],

					['Speaker', mData[1][4].speaker, mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][4]['storage-memory_card'], mData[1][3]['storage-memory_card'], mData[1][2]['storage-memory_card'], mData[1][1]['storage-memory_card'], mData[1][0]['storage-memory_card']],

					['Zhuaimao', mData[1][4].zhuaimao, mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][4].cancel, mData[1][3].cancel, mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][4].other, mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 5) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[1][5].adapter, mData[1][4].adapter, mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][5].bag, mData[1][4].bag, mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][5].cable, mData[1][4].cable, mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][5].car_gadget, mData[1][4].car_gadget, mData[1][3].car_gadget, mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][5].case_for_smartphone, mData[1][4].case_for_smartphone, mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][5].case_for_tablet, mData[1][4].case_for_tablet, mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][5].clearance, mData[1][4].clearance, mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][5].creative, mData[1][4].creative, mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][5].gaming, mData[1][4].gaming, mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][5].home_gadget, mData[1][4].home_gadget, mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][5].lamp, mData[1][4].lamp, mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][5].film, mData[1][4].film, mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][5].gadget, mData[1][4].gadget, mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][5].power_bank, mData[1][4].power_bank, mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][5]['small_talk-bluetooth'], mData[1][4]['small_talk-bluetooth'], mData[1][3]['small_talk-bluetooth'], mData[1][2]['small_talk-bluetooth'], mData[1][1]['small_talk-bluetooth'], mData[1][0]['small_talk-bluetooth']],

					['Speaker', mData[1][5].speaker, mData[1][4].speaker, mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][5]['storage-memory_card'], mData[1][4]['storage-memory_card'], mData[1][3]['storage-memory_card'], mData[1][2]['storage-memory_card'], mData[1][1]['storage-memory_card'], mData[1][0]['storage-memory_card']],

					['Zhuaimao', mData[1][5].zhuaimao, mData[1][4].zhuaimao, mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][5].cancel, mData[1][4].cancel, mData[1][3].cancel, mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][5].other, mData[1][4].other, mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 6) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[1][6].adapter, mData[1][5].adapter, mData[1][4].adapter, mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][6].bag, mData[1][5].bag, mData[1][4].bag, mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][6].cable, mData[1][5].cable, mData[1][4].cable, mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][6].car_gadget, mData[1][5].car_gadget, mData[1][4].car_gadget, mData[1][3].car_gadget, mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][6].case_for_smartphone, mData[1][5].case_for_smartphone, mData[1][4].case_for_smartphone, mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][6].case_for_tablet, mData[1][5].case_for_tablet, mData[1][4].case_for_tablet, mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][6].clearance, mData[1][5].clearance, mData[1][4].clearance, mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][6].creative, mData[1][5].creative, mData[1][4].creative, mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][6].gaming, mData[1][5].gaming, mData[1][4].gaming, mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][6].home_gadget, mData[1][5].home_gadget, mData[1][4].home_gadget, mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][6].lamp, mData[1][5].lamp, mData[1][4].lamp, mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][6].film, mData[1][5].film, mData[1][4].film, mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][6].gadget, mData[1][5].gadget, mData[1][4].gadget, mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][6].power_bank, mData[1][5].power_bank, mData[1][4].power_bank, mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][6]['small_talk-bluetooth'], mData[1][5]['small_talk-bluetooth'], mData[1][4]['small_talk-bluetooth'], mData[1][3]['small_talk-bluetooth'], mData[1][2]['small_talk-bluetooth'], mData[1][1]['small_talk-bluetooth'], mData[1][0]['small_talk-bluetooth']],

					['Speaker', mData[1][6].speaker, mData[1][5].speaker, mData[1][4].speaker, mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][6]['storage-memory_card'], mData[1][5]['storage-memory_card'], mData[1][4]['storage-memory_card'], mData[1][3]['storage-memory_card'], mData[1][2]['storage-memory_card'], mData[1][1]['storage-memory_card'], mData[1][0]['storage-memory_card']],

					['Zhuaimao', mData[1][6].zhuaimao, mData[1][5].zhuaimao, mData[1][4].zhuaimao, mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][6].cancel, mData[1][5].cancel, mData[1][4].cancel, mData[1][3].cancel, mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][6].other, mData[1][5].other, mData[1][4].other, mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 7) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[1][7].adapter, mData[1][6].adapter, mData[1][5].adapter, mData[1][4].adapter, mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][7].bag, mData[1][6].bag, mData[1][5].bag, mData[1][4].bag, mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][7].cable, mData[1][6].cable, mData[1][5].cable, mData[1][4].cable, mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][7].car_gadget, mData[1][6].car_gadget, mData[1][5].car_gadget, mData[1][4].car_gadget, mData[1][3].car_gadget, mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][7].case_for_smartphone, mData[1][6].case_for_smartphone, mData[1][5].case_for_smartphone, mData[1][4].case_for_smartphone, mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][7].case_for_tablet, mData[1][6].case_for_tablet, mData[1][5].case_for_tablet, mData[1][4].case_for_tablet, mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][7].clearance, mData[1][6].clearance, mData[1][5].clearance, mData[1][4].clearance, mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][7].creative, mData[1][6].creative, mData[1][5].creative, mData[1][4].creative, mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][7].gaming, mData[1][6].gaming, mData[1][5].gaming, mData[1][4].gaming, mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][7].home_gadget, mData[1][6].home_gadget, mData[1][5].home_gadget, mData[1][4].home_gadget, mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][7].lamp, mData[1][6].lamp, mData[1][5].lamp, mData[1][4].lamp, mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][7].film, mData[1][6].film, mData[1][5].film, mData[1][4].film, mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][7].gadget, mData[1][6].gadget, mData[1][5].gadget, mData[1][4].gadget, mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][7].power_bank, mData[1][6].power_bank, mData[1][5].power_bank, mData[1][4].power_bank, mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][7]['small_talk-bluetooth'], mData[1][6]['small_talk-bluetooth'], mData[1][5]['small_talk-bluetooth'], mData[1][4]['small_talk-bluetooth'], mData[1][3]['small_talk-bluetooth'], mData[1][2]['small_talk-bluetooth'], mData[1][1]['small_talk-bluetooth'], mData[1][0]['small_talk-bluetooth']],

					['Speaker', mData[1][7].speaker, mData[1][6].speaker, mData[1][5].speaker, mData[1][4].speaker, mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][7]['storage-memory_card'], mData[1][6]['storage-memory_card'], mData[1][5]['storage-memory_card'], mData[1][4]['storage-memory_card'], mData[1][3]['storage-memory_card'], mData[1][2]['storage-memory_card'], mData[1][1]['storage-memory_card'], mData[1][0]['storage-memory_card']],

					['Zhuaimao', mData[1][7].zhuaimao, mData[1][6].zhuaimao, mData[1][5].zhuaimao, mData[1][4].zhuaimao, mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][7].cancel, mData[1][6].cancel, mData[1][5].cancel, mData[1][4].cancel, mData[1][3].cancel, mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][7].other, mData[1][6].other, mData[1][5].other, mData[1][4].other, mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 8) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[1][8].adapter, mData[1][7].adapter, mData[1][6].adapter, mData[1][5].adapter, mData[1][4].adapter, mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][8].bag, mData[1][7].bag, mData[1][6].bag, mData[1][5].bag, mData[1][4].bag, mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][8].cable, mData[1][7].cable, mData[1][6].cable, mData[1][5].cable, mData[1][4].cable, mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][8].car_gadget,mData[1][7].car_gadget,mData[1][6].car_gadget,mData[1][5].car_gadget,mData[1][4].car_gadget,mData[1][3].car_gadget,mData[1][2].car_gadget,mData[1][1].car_gadget,mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][8].case_for_smartphone, mData[1][7].case_for_smartphone, mData[1][6].case_for_smartphone, mData[1][5].case_for_smartphone, mData[1][4].case_for_smartphone, mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][8].case_for_tablet, mData[1][7].case_for_tablet, mData[1][6].case_for_tablet, mData[1][5].case_for_tablet, mData[1][4].case_for_tablet, mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][8].clearance, mData[1][7].clearance, mData[1][6].clearance, mData[1][5].clearance, mData[1][4].clearance, mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][8].creative, mData[1][7].creative, mData[1][6].creative, mData[1][5].creative, mData[1][4].creative, mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][8].gaming, mData[1][7].gaming, mData[1][6].gaming, mData[1][5].gaming, mData[1][4].gaming, mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][8].home_gadget, mData[1][7].home_gadget, mData[1][6].home_gadget, mData[1][5].home_gadget, mData[1][4].home_gadget, mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][8].lamp, mData[1][7].lamp, mData[1][6].lamp, mData[1][5].lamp, mData[1][4].lamp, mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][8].film, mData[1][7].film, mData[1][6].film, mData[1][5].film, mData[1][4].film, mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][8].gadget, mData[1][7].gadget, mData[1][6].gadget, mData[1][5].gadget, mData[1][4].gadget, mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][8].power_bank, mData[1][7].power_bank, mData[1][6].power_bank, mData[1][5].power_bank, mData[1][4].power_bank, mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][8]['small_talk-bluetooth'], mData[1][7]['small_talk-bluetooth'], mData[1][6]['small_talk-bluetooth'], mData[1][5]['small_talk-bluetooth'], mData[1][4]['small_talk-bluetooth'], mData[1][3]['small_talk-bluetooth'], mData[1][2]['small_talk-bluetooth'], mData[1][1]['small_talk-bluetooth'], mData[1][0]['small_talk-bluetooth']],

					['Speaker', mData[1][8].speaker, mData[1][7].speaker, mData[1][6].speaker, mData[1][5].speaker, mData[1][4].speaker, mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][8]['storage-memory_card'], mData[1][7]['storage-memory_card'], mData[1][6]['storage-memory_card'], mData[1][5]['storage-memory_card'], mData[1][4]['storage-memory_card'], mData[1][3]['storage-memory_card'], mData[1][2]['storage-memory_card'], mData[1][1]['storage-memory_card'], mData[1][0]['storage-memory_card']],

					['Zhuaimao', mData[1][8].zhuaimao, mData[1][7].zhuaimao, mData[1][6].zhuaimao, mData[1][5].zhuaimao, mData[1][4].zhuaimao, mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][8].cancel, mData[1][7].cancel, mData[1][6].cancel, mData[1][5].cancel, mData[1][4].cancel, mData[1][3].cancel, mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][8].other, mData[1][7].other, mData[1][6].other, mData[1][5].other, mData[1][4].other, mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 9) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[1][9].adapter, mData[1][8].adapter, mData[1][7].adapter, mData[1][6].adapter, mData[1][5].adapter, mData[1][4].adapter, mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][9].bag, mData[1][8].bag, mData[1][7].bag, mData[1][6].bag, mData[1][5].bag, mData[1][4].bag, mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][9].cable, mData[1][8].cable, mData[1][7].cable, mData[1][6].cable, mData[1][5].cable, mData[1][4].cable, mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][9].car_gadget, mData[1][8].car_gadget, mData[1][7].car_gadget, mData[1][6].car_gadget, mData[1][5].car_gadget, mData[1][4].car_gadget, mData[1][3].car_gadget, mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][9].case_for_smartphone, mData[1][8].case_for_smartphone, mData[1][7].case_for_smartphone, mData[1][6].case_for_smartphone, mData[1][5].case_for_smartphone, mData[1][4].case_for_smartphone, mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][9].case_for_tablet, mData[1][8].case_for_tablet, mData[1][7].case_for_tablet, mData[1][6].case_for_tablet, mData[1][5].case_for_tablet, mData[1][4].case_for_tablet, mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][9].clearance, mData[1][8].clearance, mData[1][7].clearance, mData[1][6].clearance, mData[1][5].clearance, mData[1][4].clearance, mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][9].creative, mData[1][8].creative, mData[1][7].creative, mData[1][6].creative, mData[1][5].creative, mData[1][4].creative, mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][9].gaming, mData[1][8].gaming, mData[1][7].gaming, mData[1][6].gaming, mData[1][5].gaming, mData[1][4].gaming, mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][9].home_gadget, mData[1][8].home_gadget, mData[1][7].home_gadget, mData[1][6].home_gadget, mData[1][5].home_gadget, mData[1][4].home_gadget, mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][9].lamp, mData[1][8].lamp, mData[1][7].lamp, mData[1][6].lamp, mData[1][5].lamp, mData[1][4].lamp, mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][9].film, mData[1][8].film, mData[1][7].film, mData[1][6].film, mData[1][5].film, mData[1][4].film, mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][9].gadget, mData[1][8].gadget, mData[1][7].gadget, mData[1][6].gadget, mData[1][5].gadget, mData[1][4].gadget, mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][9].power_bank, mData[1][8].power_bank, mData[1][7].power_bank, mData[1][6].power_bank, mData[1][5].power_bank, mData[1][4].power_bank, mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][9]['small_talk-bluetooth'], mData[1][8]['small_talk-bluetooth'], mData[1][7]['small_talk-bluetooth'], mData[1][6]['small_talk-bluetooth'], mData[1][5]['small_talk-bluetooth'], mData[1][4]['small_talk-bluetooth'], mData[1][3]['small_talk-bluetooth'], mData[1][2]['small_talk-bluetooth'], mData[1][1]['small_talk-bluetooth'], mData[1][0]['small_talk-bluetooth']],

					['Speaker', mData[1][9].speaker, mData[1][8].speaker, mData[1][7].speaker, mData[1][6].speaker, mData[1][5].speaker, mData[1][4].speaker, mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][9]['storage-memory_card'], mData[1][8]['storage-memory_card'], mData[1][7]['storage-memory_card'], mData[1][6]['storage-memory_card'], mData[1][5]['storage-memory_card'], mData[1][4]['storage-memory_card'], mData[1][3]['storage-memory_card'], mData[1][2]['storage-memory_card'], mData[1][1]['storage-memory_card'], mData[1][0]['storage-memory_card']],

					['Zhuaimao', mData[1][9].zhuaimao, mData[1][8].zhuaimao, mData[1][7].zhuaimao, mData[1][6].zhuaimao, mData[1][5].zhuaimao, mData[1][4].zhuaimao, mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][9].cancel, mData[1][8].cancel, mData[1][7].cancel, mData[1][6].cancel, mData[1][5].cancel, mData[1][4].cancel, mData[1][3].cancel, mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][9].other, mData[1][8].other, mData[1][7].other, mData[1][6].other, mData[1][5].other, mData[1][4].other, mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 10) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth10, mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[1][10].adapter, mData[1][9].adapter, mData[1][8].adapter, mData[1][7].adapter, mData[1][6].adapter, mData[1][5].adapter, mData[1][4].adapter, mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][10].bag, mData[1][9].bag, mData[1][8].bag, mData[1][7].bag, mData[1][6].bag, mData[1][5].bag, mData[1][4].bag, mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][10].cable, mData[1][9].cable, mData[1][8].cable, mData[1][7].cable, mData[1][6].cable, mData[1][5].cable, mData[1][4].cable, mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][10].car_gadget, mData[1][9].car_gadget, mData[1][8].car_gadget, mData[1][7].car_gadget, mData[1][6].car_gadget, mData[1][5].car_gadget, mData[1][4].car_gadget, mData[1][3].car_gadget, mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][10].case_for_smartphone, mData[1][9].case_for_smartphone, mData[1][8].case_for_smartphone, mData[1][7].case_for_smartphone, mData[1][6].case_for_smartphone, mData[1][5].case_for_smartphone, mData[1][4].case_for_smartphone, mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][10].case_for_tablet, mData[1][9].case_for_tablet, mData[1][8].case_for_tablet, mData[1][7].case_for_tablet, mData[1][6].case_for_tablet, mData[1][5].case_for_tablet, mData[1][4].case_for_tablet, mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][10].clearance, mData[1][9].clearance, mData[1][8].clearance, mData[1][7].clearance, mData[1][6].clearance, mData[1][5].clearance, mData[1][4].clearance, mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][10].creative, mData[1][9].creative, mData[1][8].creative, mData[1][7].creative, mData[1][6].creative, mData[1][5].creative, mData[1][4].creative, mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][10].gaming, mData[1][9].gaming, mData[1][8].gaming, mData[1][7].gaming, mData[1][6].gaming, mData[1][5].gaming, mData[1][4].gaming, mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][10].home_gadget, mData[1][9].home_gadget, mData[1][8].home_gadget, mData[1][7].home_gadget, mData[1][6].home_gadget, mData[1][5].home_gadget, mData[1][4].home_gadget, mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][10].lamp, mData[1][9].lamp, mData[1][8].lamp, mData[1][7].lamp, mData[1][6].lamp, mData[1][5].lamp, mData[1][4].lamp, mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][10].film, mData[1][9].film, mData[1][8].film, mData[1][7].film, mData[1][6].film, mData[1][5].film, mData[1][4].film, mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][10].gadget, mData[1][9].gadget, mData[1][8].gadget, mData[1][7].gadget, mData[1][6].gadget, mData[1][5].gadget, mData[1][4].gadget, mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][10].power_bank, mData[1][9].power_bank, mData[1][8].power_bank, mData[1][7].power_bank, mData[1][6].power_bank, mData[1][5].power_bank, mData[1][4].power_bank, mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][10]['small_talk-bluetooth'], mData[1][9]['small_talk-bluetooth'], mData[1][8]['small_talk-bluetooth'], mData[1][7]['small_talk-bluetooth'], mData[1][6]['small_talk-bluetooth'], mData[1][5]['small_talk-bluetooth'], mData[1][4]['small_talk-bluetooth'], mData[1][3]['small_talk-bluetooth'], mData[1][2]['small_talk-bluetooth'], mData[1][1]['small_talk-bluetooth'], mData[1][0]['small_talk-bluetooth']],

					['Speaker', mData[1][10].speaker, mData[1][9].speaker, mData[1][8].speaker, mData[1][7].speaker, mData[1][6].speaker, mData[1][5].speaker, mData[1][4].speaker, mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][10]['storage-memory_card'], mData[1][9]['storage-memory_card'], mData[1][8]['storage-memory_card'], mData[1][7]['storage-memory_card'], mData[1][6]['storage-memory_card'], mData[1][5]['storage-memory_card'], mData[1][4]['storage-memory_card'], mData[1][3]['storage-memory_card'], mData[1][2]['storage-memory_card'], mData[1][1]['storage-memory_card'], mData[1][0]['storage-memory_card']],

					['Zhuaimao', mData[1][10].zhuaimao, mData[1][9].zhuaimao, mData[1][8].zhuaimao, mData[1][7].zhuaimao, mData[1][6].zhuaimao, mData[1][5].zhuaimao, mData[1][4].zhuaimao, mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][10].cancel, mData[1][9].cancel, mData[1][8].cancel, mData[1][7].cancel, mData[1][6].cancel, mData[1][5].cancel, mData[1][4].cancel, mData[1][3].cancel, mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][10].other, mData[1][9].other, mData[1][8].other, mData[1][7].other, mData[1][6].other, mData[1][5].other, mData[1][4].other, mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 11) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth11, mth10, mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[1][11].adapter, mData[1][10].adapter, mData[1][9].adapter, mData[1][8].adapter, mData[1][7].adapter, mData[1][6].adapter, mData[1][5].adapter, mData[1][4].adapter, mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][11].bag, mData[1][10].bag, mData[1][9].bag, mData[1][8].bag, mData[1][7].bag, mData[1][6].bag, mData[1][5].bag, mData[1][4].bag, mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][11].cable, mData[1][10].cable, mData[1][9].cable, mData[1][8].cable, mData[1][7].cable, mData[1][6].cable, mData[1][5].cable, mData[1][4].cable, mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][11].car_gadget, mData[1][10].car_gadget, mData[1][9].car_gadget, mData[1][8].car_gadget, mData[1][7].car_gadget, mData[1][6].car_gadget, mData[1][5].car_gadget, mData[1][4].car_gadget, mData[1][3].car_gadget, mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][11].case_for_smartphone, mData[1][10].case_for_smartphone, mData[1][9].case_for_smartphone, mData[1][8].case_for_smartphone, mData[1][7].case_for_smartphone, mData[1][6].case_for_smartphone, mData[1][5].case_for_smartphone, mData[1][4].case_for_smartphone, mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][11].case_for_tablet, mData[1][10].case_for_tablet, mData[1][9].case_for_tablet, mData[1][8].case_for_tablet, mData[1][7].case_for_tablet, mData[1][6].case_for_tablet, mData[1][5].case_for_tablet, mData[1][4].case_for_tablet, mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][11].clearance, mData[1][10].clearance, mData[1][9].clearance, mData[1][8].clearance, mData[1][7].clearance, mData[1][6].clearance, mData[1][5].clearance, mData[1][4].clearance, mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][11].creative, mData[1][10].creative, mData[1][9].creative, mData[1][8].creative, mData[1][7].creative, mData[1][6].creative, mData[1][5].creative, mData[1][4].creative, mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][11].gaming, mData[1][10].gaming, mData[1][9].gaming, mData[1][8].gaming, mData[1][7].gaming, mData[1][6].gaming, mData[1][5].gaming, mData[1][4].gaming, mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][11].home_gadget, mData[1][10].home_gadget, mData[1][9].home_gadget, mData[1][8].home_gadget, mData[1][7].home_gadget, mData[1][6].home_gadget, mData[1][5].home_gadget, mData[1][4].home_gadget, mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][11].lamp, mData[1][10].lamp, mData[1][9].lamp, mData[1][8].lamp, mData[1][7].lamp, mData[1][6].lamp, mData[1][5].lamp, mData[1][4].lamp, mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][11].film, mData[1][10].film, mData[1][9].film, mData[1][8].film, mData[1][7].film, mData[1][6].film, mData[1][5].film, mData[1][4].film, mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][11].gadget, mData[1][10].gadget, mData[1][9].gadget, mData[1][8].gadget, mData[1][7].gadget, mData[1][6].gadget, mData[1][5].gadget, mData[1][4].gadget, mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][11].power_bank, mData[1][10].power_bank, mData[1][9].power_bank, mData[1][8].power_bank, mData[1][7].power_bank, mData[1][6].power_bank, mData[1][5].power_bank, mData[1][4].power_bank, mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][11]['small_talk-bluetooth'], mData[1][10]['small_talk-bluetooth'], mData[1][9]['small_talk-bluetooth'], mData[1][8]['small_talk-bluetooth'], mData[1][7]['small_talk-bluetooth'], mData[1][6]['small_talk-bluetooth'], mData[1][5]['small_talk-bluetooth'], mData[1][4]['small_talk-bluetooth'], mData[1][3]['small_talk-bluetooth'], mData[1][2]['small_talk-bluetooth'], mData[1][1]['small_talk-bluetooth'], mData[1][0]['small_talk-bluetooth']],

					['Speaker', mData[1][11].speaker, mData[1][10].speaker, mData[1][9].speaker, mData[1][8].speaker, mData[1][7].speaker, mData[1][6].speaker, mData[1][5].speaker, mData[1][4].speaker, mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][11]['storage-memory_card'], mData[1][10]['storage-memory_card'], mData[1][9]['storage-memory_card'], mData[1][8]['storage-memory_card'], mData[1][7]['storage-memory_card'], mData[1][6]['storage-memory_card'], mData[1][5]['storage-memory_card'], mData[1][4]['storage-memory_card'], mData[1][3]['storage-memory_card'], mData[1][2]['storage-memory_card'], mData[1][1]['storage-memory_card'], mData[1][0]['storage-memory_card']],

					['Zhuaimao', mData[1][11].zhuaimao, mData[1][10].zhuaimao, mData[1][9].zhuaimao, mData[1][8].zhuaimao, mData[1][7].zhuaimao, mData[1][6].zhuaimao, mData[1][5].zhuaimao, mData[1][4].zhuaimao, mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][11].cancel, mData[1][10].cancel, mData[1][9].cancel, mData[1][8].cancel, mData[1][7].cancel, mData[1][6].cancel, mData[1][5].cancel, mData[1][4].cancel, mData[1][3].cancel, mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][11].other, mData[1][10].other, mData[1][9].other, mData[1][8].other, mData[1][7].other, mData[1][6].other, mData[1][5].other, mData[1][4].other, mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			} else if ($('#selectPrevious').val() == 12) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth12, mth11, mth10, mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[1][12].adapter, mData[1][11].adapter, mData[1][10].adapter, mData[1][9].adapter, mData[1][8].adapter, mData[1][7].adapter, mData[1][6].adapter, mData[1][5].adapter, mData[1][4].adapter, mData[1][3].adapter, mData[1][2].adapter, mData[1][1].adapter, mData[1][0].adapter],

					['Bag', mData[1][12].bag, mData[1][11].bag, mData[1][10].bag, mData[1][9].bag, mData[1][8].bag, mData[1][7].bag, mData[1][6].bag, mData[1][5].bag, mData[1][4].bag, mData[1][3].bag, mData[1][2].bag, mData[1][1].bag, mData[1][0].bag],

					['Cable', mData[1][12].cable, mData[1][11].cable, mData[1][10].cable, mData[1][9].cable, mData[1][8].cable, mData[1][7].cable, mData[1][6].cable, mData[1][5].cable, mData[1][4].cable, mData[1][3].cable, mData[1][2].cable, mData[1][1].cable, mData[1][0].cable],

					['Car Gadget', mData[1][12].car_gadget, mData[1][11].car_gadget, mData[1][10].car_gadget, mData[1][9].car_gadget, mData[1][8].car_gadget, mData[1][7].car_gadget, mData[1][6].car_gadget, mData[1][5].car_gadget, mData[1][4].car_gadget, mData[1][3].car_gadget, mData[1][2].car_gadget, mData[1][1].car_gadget, mData[1][0].car_gadget],

					['Case For Smartphone', mData[1][12].case_for_smartphone, mData[1][11].case_for_smartphone, mData[1][10].case_for_smartphone, mData[1][9].case_for_smartphone, mData[1][8].case_for_smartphone, mData[1][7].case_for_smartphone, mData[1][6].case_for_smartphone, mData[1][5].case_for_smartphone, mData[1][4].case_for_smartphone, mData[1][3].case_for_smartphone, mData[1][2].case_for_smartphone, mData[1][1].case_for_smartphone, mData[1][0].case_for_smartphone],

					['Case For Tablet', mData[1][12].case_for_tablet, mData[1][11].case_for_tablet, mData[1][10].case_for_tablet, mData[1][9].case_for_tablet, mData[1][8].case_for_tablet, mData[1][7].case_for_tablet, mData[1][6].case_for_tablet, mData[1][5].case_for_tablet, mData[1][4].case_for_tablet, mData[1][3].case_for_tablet, mData[1][2].case_for_tablet, mData[1][1].case_for_tablet, mData[1][0].case_for_tablet],

					['Clearance', mData[1][12].clearance, mData[1][11].clearance, mData[1][10].clearance, mData[1][9].clearance, mData[1][8].clearance, mData[1][7].clearance, mData[1][6].clearance, mData[1][5].clearance, mData[1][4].clearance, mData[1][3].clearance, mData[1][2].clearance, mData[1][1].clearance, mData[1][0].clearance],

					['Gadget Creative', mData[1][12].creative, mData[1][11].creative, mData[1][10].creative, mData[1][9].creative, mData[1][8].creative, mData[1][7].creative, mData[1][6].creative, mData[1][5].creative, mData[1][4].creative, mData[1][3].creative, mData[1][2].creative, mData[1][1].creative, mData[1][0].creative],

					['Gaming', mData[1][12].gaming, mData[1][11].gaming, mData[1][10].gaming, mData[1][9].gaming, mData[1][8].gaming, mData[1][7].gaming, mData[1][6].gaming, mData[1][5].gaming, mData[1][4].gaming, mData[1][3].gaming, mData[1][2].gaming, mData[1][1].gaming, mData[1][0].gaming],

					['Home Gadget', mData[1][12].home_gadget, mData[1][11].home_gadget, mData[1][10].home_gadget, mData[1][9].home_gadget, mData[1][8].home_gadget, mData[1][7].home_gadget, mData[1][6].home_gadget, mData[1][5].home_gadget, mData[1][4].home_gadget, mData[1][3].home_gadget, mData[1][2].home_gadget, mData[1][1].home_gadget, mData[1][0].home_gadget],

					['Lamp', mData[1][12].lamp, mData[1][11].lamp, mData[1][10].lamp, mData[1][9].lamp, mData[1][8].lamp, mData[1][7].lamp, mData[1][6].lamp, mData[1][5].lamp, mData[1][4].lamp, mData[1][3].lamp, mData[1][2].lamp, mData[1][1].lamp, mData[1][0].lamp],

					['Film', mData[1][12].film, mData[1][11].film, mData[1][10].film, mData[1][9].film, mData[1][8].film, mData[1][7].film, mData[1][6].film, mData[1][5].film, mData[1][4].film, mData[1][3].film, mData[1][2].film, mData[1][1].film, mData[1][0].film],

					['Smart life', mData[1][12].gadget, mData[1][11].gadget, mData[1][10].gadget, mData[1][9].gadget, mData[1][8].gadget, mData[1][7].gadget, mData[1][6].gadget, mData[1][5].gadget, mData[1][4].gadget, mData[1][3].gadget, mData[1][2].gadget, mData[1][1].gadget, mData[1][0].gadget],

					['Power Bank', mData[1][12].power_bank, mData[1][11].power_bank, mData[1][10].power_bank, mData[1][9].power_bank, mData[1][8].power_bank, mData[1][7].power_bank, mData[1][6].power_bank, mData[1][5].power_bank, mData[1][4].power_bank, mData[1][3].power_bank, mData[1][2].power_bank, mData[1][1].power_bank, mData[1][0].power_bank],

					['Small Talk Bluetooth', mData[1][12]['small_talk-bluetooth'], mData[1][11]['small_talk-bluetooth'], mData[1][10]['small_talk-bluetooth'], mData[1][8]['small_talk-bluetooth'], mData[1][7]['small_talk-bluetooth'], mData[1][6]['small_talk-bluetooth'], mData[1][6]['small_talk-bluetooth'], mData[1][5]['small_talk-bluetooth'], mData[1][4]['small_talk-bluetooth'], mData[1][3]['small_talk-bluetooth'], mData[1][2]['small_talk-bluetooth'], mData[1][1]['small_talk-bluetooth'], mData[1][0]['small_talk-bluetooth']],

					['Speaker', mData[1][12].speaker, mData[1][11].speaker, mData[1][10].speaker, mData[1][9].speaker, mData[1][8].speaker, mData[1][7].speaker, mData[1][6].speaker, mData[1][5].speaker, mData[1][4].speaker, mData[1][3].speaker, mData[1][2].speaker, mData[1][1].speaker, mData[1][0].speaker],

					['Storage Memory Card', mData[1][12]['storage-memory_card'], mData[1][11]['storage-memory_card'], mData[1][10]['storage-memory_card'], mData[1][9]['storage-memory_card'], mData[1][8]['storage-memory_card'], mData[1][7]['storage-memory_card'], mData[1][6]['storage-memory_card'], mData[1][5]['storage-memory_card'], mData[1][4]['storage-memory_card'], mData[1][3]['storage-memory_card'], mData[1][2]['storage-memory_card'], mData[1][1]['storage-memory_card'], mData[1][0]['storage-memory_card']],

					['Zhuaimao', mData[1][12].zhuaimao, mData[1][11].zhuaimao, mData[1][10].zhuaimao, mData[1][9].zhuaimao, mData[1][8].zhuaimao, mData[1][7].zhuaimao, mData[1][6].zhuaimao, mData[1][5].zhuaimao, mData[1][4].zhuaimao, mData[1][3].zhuaimao, mData[1][2].zhuaimao, mData[1][1].zhuaimao, mData[1][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[1][12].cancel, mData[1][11].cancel, mData[1][10].cancel, mData[1][9].cancel, mData[1][8].cancel, mData[1][7].cancel, mData[1][6].cancel, mData[1][5].cancel, mData[1][4].cancel, mData[1][3].cancel, mData[1][2].cancel, mData[1][1].cancel, mData[1][0].cancel],

					['Other', mData[1][12].other, mData[1][11].other, mData[1][10].other, mData[1][9].other, mData[1][8].other, mData[1][7].other, mData[1][6].other, mData[1][5].other, mData[1][4].other, mData[1][3].other, mData[1][2].other, mData[1][1].other, mData[1][0].other]
				]);
			}

		} else if ($('#selectType').val() == 'type-profit') {
			lblType = 'Profit and Loss';
			if ($('#selectPrevious').val() == 0) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth0],
					['Adapter', mData[2][0].adapter],
					['Bag', mData[2][0].bag],
					['Cable', mData[2][0].cable],
					['Car Gadget', mData[2][0].car_gadget],
					['Case For Smartphone', mData[2][0].case_for_smartphone],
					['Case For Tablet', mData[2][0].case_for_tablet],
					['Clearance', mData[2][0].clearance],
					['Gadget Creative', mData[2][0].creative],
					['Gaming', mData[2][0].gaming],
					['Home Gadget',mData[2][0].home_gadget],
					['Lamp', mData[2][0].lamp],
					['Film', mData[2][0].film],
					['Smart life', mData[2][0].gadget],
					['Power Bank', mData[2][0].power_bank],
					['Small Talk Bluetooth', mData[2][0]['small_talk-bluetooth']],
					['Speaker', mData[2][0].speaker],
					['Storage Memory Card', mData[2][0]['storage-memory_card']],
					['Zhuaimao', mData[2][0].zhuaimao],
					['ยกเลิกใช้งาน', mData[2][0].cancel],
					['Other', mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 1) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth1, mth0],

					['Adapter', mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][1]['small_talk-bluetooth'], mData[2][0]['small_talk-bluetooth']],

					['Speaker', mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][1]['storage-memory_card'], mData[2][0]['storage-memory_card']],

					['Zhuaimao', mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 2) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth2, mth1, mth0],

					['Adapter', mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][2]['small_talk-bluetooth'], mData[2][1]['small_talk-bluetooth'], mData[2][0]['small_talk-bluetooth']],

					['Speaker', mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][2]['storage-memory_card'], mData[2][1]['storage-memory_card'], mData[2][0]['storage-memory_card']],

					['Zhuaimao', mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 3) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth3, mth2, mth1, mth0],

					['Adapter', mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][3]['small_talk-bluetooth'], mData[2][2]['small_talk-bluetooth'], mData[2][1]['small_talk-bluetooth'], mData[2][0]['small_talk-bluetooth']],

					['Speaker', mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][3]['storage-memory_card'], mData[2][2]['storage-memory_card'], mData[2][1]['storage-memory_card'], mData[2][0]['storage-memory_card']],

					['Zhuaimao', mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 4) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[2][4].adapter, mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][4].bag, mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][4].cable, mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][4].car_gadget, mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][4].case_for_smartphone, mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][4].case_for_tablet, mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][4].clearance, mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][4].creative, mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][4].gaming, mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][4].home_gadget, mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][4].lamp, mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][4].film, mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][4].gadget, mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][4].power_bank, mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][4]['small_talk-bluetooth'], mData[2][3]['small_talk-bluetooth'], mData[2][2]['small_talk-bluetooth'], mData[2][1]['small_talk-bluetooth'], mData[2][0]['small_talk-bluetooth']],

					['Speaker', mData[2][4].speaker, mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][4]['storage-memory_card'], mData[2][3]['storage-memory_card'], mData[2][2]['storage-memory_card'], mData[2][1]['storage-memory_card'], mData[2][0]['storage-memory_card']],

					['Zhuaimao', mData[2][4].zhuaimao, mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][4].cancel, mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][4].other, mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 5) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[2][5].adapter, mData[2][4].adapter, mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][5].bag, mData[2][4].bag, mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][5].cable, mData[2][4].cable, mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][5].car_gadget, mData[2][4].car_gadget, mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][5].case_for_smartphone, mData[2][4].case_for_smartphone, mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][5].case_for_tablet, mData[2][4].case_for_tablet, mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][5].clearance, mData[2][4].clearance, mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][5].creative, mData[2][4].creative, mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][5].gaming, mData[2][4].gaming, mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][5].home_gadget, mData[2][4].home_gadget, mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][5].lamp, mData[2][4].lamp, mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][5].film, mData[2][4].film, mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][5].gadget, mData[2][4].gadget, mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][5].power_bank, mData[2][4].power_bank, mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][5]['small_talk-bluetooth'], mData[2][4]['small_talk-bluetooth'], mData[2][3]['small_talk-bluetooth'], mData[2][2]['small_talk-bluetooth'], mData[2][1]['small_talk-bluetooth'], mData[2][0]['small_talk-bluetooth']],

					['Speaker', mData[2][5].speaker, mData[2][4].speaker, mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][5]['storage-memory_card'], mData[2][4]['storage-memory_card'], mData[2][3]['storage-memory_card'], mData[2][2]['storage-memory_card'], mData[2][1]['storage-memory_card'], mData[2][0]['storage-memory_card']],

					['Zhuaimao', mData[2][5].zhuaimao, mData[2][4].zhuaimao, mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][5].cancel, mData[2][4].cancel, mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][5].other, mData[2][4].other, mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 6) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[2][6].adapter, mData[2][5].adapter, mData[2][4].adapter, mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][6].bag, mData[2][5].bag, mData[2][4].bag, mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][6].cable, mData[2][5].cable, mData[2][4].cable, mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][6].car_gadget, mData[2][5].car_gadget, mData[2][4].car_gadget, mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][6].case_for_smartphone, mData[2][5].case_for_smartphone, mData[2][4].case_for_smartphone, mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][6].case_for_tablet, mData[2][5].case_for_tablet, mData[2][4].case_for_tablet, mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][6].clearance, mData[2][5].clearance, mData[2][4].clearance, mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][6].creative, mData[2][5].creative, mData[2][4].creative, mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][6].gaming, mData[2][5].gaming, mData[2][4].gaming, mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][6].home_gadget, mData[2][5].home_gadget, mData[2][4].home_gadget, mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][6].lamp, mData[2][5].lamp, mData[2][4].lamp, mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][6].film, mData[2][5].film, mData[2][4].film, mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][6].gadget, mData[2][5].gadget, mData[2][4].gadget, mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][6].power_bank, mData[2][5].power_bank, mData[2][4].power_bank, mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][6]['small_talk-bluetooth'], mData[2][5]['small_talk-bluetooth'], mData[2][4]['small_talk-bluetooth'], mData[2][3]['small_talk-bluetooth'], mData[2][2]['small_talk-bluetooth'], mData[2][1]['small_talk-bluetooth'], mData[2][0]['small_talk-bluetooth']],

					['Speaker', mData[2][6].speaker, mData[2][5].speaker, mData[2][4].speaker, mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][6]['storage-memory_card'], mData[2][5]['storage-memory_card'], mData[2][4]['storage-memory_card'], mData[2][3]['storage-memory_card'], mData[2][2]['storage-memory_card'], mData[2][1]['storage-memory_card'], mData[2][0]['storage-memory_card']],

					['Zhuaimao', mData[2][6].zhuaimao, mData[2][5].zhuaimao, mData[2][4].zhuaimao, mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][6].cancel, mData[2][5].cancel, mData[2][4].cancel, mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][6].other, mData[2][5].other, mData[2][4].other, mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 7) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[2][7].adapter, mData[2][6].adapter, mData[2][5].adapter, mData[2][4].adapter, mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][7].bag, mData[2][6].bag, mData[2][5].bag, mData[2][4].bag, mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][7].cable, mData[2][6].cable, mData[2][5].cable, mData[2][4].cable, mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][7].car_gadget, mData[2][6].car_gadget, mData[2][5].car_gadget, mData[2][4].car_gadget, mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][7].case_for_smartphone, mData[2][6].case_for_smartphone, mData[2][5].case_for_smartphone, mData[2][4].case_for_smartphone, mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][7].case_for_tablet, mData[2][6].case_for_tablet, mData[2][5].case_for_tablet, mData[2][4].case_for_tablet, mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][7].clearance, mData[2][6].clearance, mData[2][5].clearance, mData[2][4].clearance, mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][7].creative, mData[2][6].creative, mData[2][5].creative, mData[2][4].creative, mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][7].gaming, mData[2][6].gaming, mData[2][5].gaming, mData[2][4].gaming, mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][7].home_gadget, mData[2][6].home_gadget, mData[2][5].home_gadget, mData[2][4].home_gadget, mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][7].lamp, mData[2][6].lamp, mData[2][5].lamp, mData[2][4].lamp, mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][7].film, mData[2][6].film, mData[2][5].film, mData[2][4].film, mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][7].gadget, mData[2][6].gadget, mData[2][5].gadget, mData[2][4].gadget, mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][7].power_bank, mData[2][6].power_bank, mData[2][5].power_bank, mData[2][4].power_bank, mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][7]['small_talk-bluetooth'], mData[2][6]['small_talk-bluetooth'], mData[2][5]['small_talk-bluetooth'], mData[2][4]['small_talk-bluetooth'], mData[2][3]['small_talk-bluetooth'], mData[2][2]['small_talk-bluetooth'], mData[2][1]['small_talk-bluetooth'], mData[2][0]['small_talk-bluetooth']],

					['Speaker', mData[2][7].speaker, mData[2][6].speaker, mData[2][5].speaker, mData[2][4].speaker, mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][7]['storage-memory_card'], mData[2][6]['storage-memory_card'], mData[2][5]['storage-memory_card'], mData[2][4]['storage-memory_card'], mData[2][3]['storage-memory_card'], mData[2][2]['storage-memory_card'], mData[2][1]['storage-memory_card'], mData[2][0]['storage-memory_card']],

					['Zhuaimao', mData[2][7].zhuaimao, mData[2][6].zhuaimao, mData[2][5].zhuaimao, mData[2][4].zhuaimao, mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][7].cancel, mData[2][6].cancel, mData[2][5].cancel, mData[2][4].cancel, mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][7].other, mData[2][6].other, mData[2][5].other, mData[2][4].other, mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 8) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[2][8].adapter, mData[2][7].adapter, mData[2][6].adapter, mData[2][5].adapter, mData[2][4].adapter, mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][8].bag, mData[2][7].bag, mData[2][6].bag, mData[2][5].bag, mData[2][4].bag, mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][8].cable, mData[2][7].cable, mData[2][6].cable, mData[2][5].cable, mData[2][4].cable, mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][8].car_gadget, mData[2][7].car_gadget, mData[2][6].car_gadget, mData[2][5].car_gadget, mData[2][4].car_gadget, mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][8].case_for_smartphone, mData[2][7].case_for_smartphone, mData[2][6].case_for_smartphone, mData[2][5].case_for_smartphone, mData[2][4].case_for_smartphone, mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][8].case_for_tablet, mData[2][7].case_for_tablet, mData[2][6].case_for_tablet, mData[2][5].case_for_tablet, mData[2][4].case_for_tablet, mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][8].clearance, mData[2][7].clearance, mData[2][6].clearance, mData[2][5].clearance, mData[2][4].clearance, mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][8].creative, mData[2][7].creative, mData[2][6].creative, mData[2][5].creative, mData[2][4].creative, mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][8].gaming, mData[2][7].gaming, mData[2][6].gaming, mData[2][5].gaming, mData[2][4].gaming, mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][8].home_gadget, mData[2][7].home_gadget, mData[2][6].home_gadget, mData[2][5].home_gadget, mData[2][4].home_gadget, mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][8].lamp, mData[2][7].lamp, mData[2][6].lamp, mData[2][5].lamp, mData[2][4].lamp, mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][8].film, mData[2][7].film, mData[2][6].film, mData[2][5].film, mData[2][4].film, mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][8].gadget, mData[2][7].gadget, mData[2][6].gadget, mData[2][5].gadget, mData[2][4].gadget, mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][8].power_bank, mData[2][7].power_bank, mData[2][6].power_bank, mData[2][5].power_bank, mData[2][4].power_bank, mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][8]['small_talk-bluetooth'], mData[2][7]['small_talk-bluetooth'], mData[2][6]['small_talk-bluetooth'], mData[2][5]['small_talk-bluetooth'], mData[2][4]['small_talk-bluetooth'], mData[2][3]['small_talk-bluetooth'], mData[2][2]['small_talk-bluetooth'], mData[2][1]['small_talk-bluetooth'], mData[2][0]['small_talk-bluetooth']],

					['Speaker', mData[2][8].speaker, mData[2][7].speaker, mData[2][6].speaker, mData[2][5].speaker, mData[2][4].speaker, mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][8]['storage-memory_card'], mData[2][7]['storage-memory_card'], mData[2][6]['storage-memory_card'], mData[2][5]['storage-memory_card'], mData[2][4]['storage-memory_card'], mData[2][3]['storage-memory_card'], mData[2][2]['storage-memory_card'], mData[2][1]['storage-memory_card'], mData[2][0]['storage-memory_card']],

					['Zhuaimao', mData[2][8].zhuaimao, mData[2][7].zhuaimao, mData[2][6].zhuaimao, mData[2][5].zhuaimao, mData[2][4].zhuaimao, mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][8].cancel, mData[2][7].cancel, mData[2][6].cancel, mData[2][5].cancel, mData[2][4].cancel, mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][8].other, mData[2][7].other, mData[2][6].other, mData[2][5].other, mData[2][4].other, mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 9) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[2][9].adapter, mData[2][8].adapter, mData[2][7].adapter, mData[2][6].adapter, mData[2][5].adapter, mData[2][4].adapter, mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][9].bag, mData[2][8].bag, mData[2][7].bag, mData[2][6].bag, mData[2][5].bag, mData[2][4].bag, mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][9].cable, mData[2][8].cable, mData[2][7].cable, mData[2][6].cable, mData[2][5].cable, mData[2][4].cable, mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][9].car_gadget, mData[2][8].car_gadget, mData[2][7].car_gadget, mData[2][6].car_gadget, mData[2][5].car_gadget, mData[2][4].car_gadget, mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][9].case_for_smartphone, mData[2][8].case_for_smartphone, mData[2][7].case_for_smartphone, mData[2][6].case_for_smartphone, mData[2][5].case_for_smartphone, mData[2][4].case_for_smartphone, mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][9].case_for_tablet, mData[2][8].case_for_tablet, mData[2][7].case_for_tablet, mData[2][6].case_for_tablet, mData[2][5].case_for_tablet, mData[2][4].case_for_tablet, mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][9].clearance, mData[2][8].clearance, mData[2][7].clearance, mData[2][6].clearance, mData[2][5].clearance, mData[2][4].clearance, mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][9].creative, mData[2][8].creative, mData[2][7].creative, mData[2][6].creative, mData[2][5].creative, mData[2][4].creative, mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][9].gaming, mData[2][8].gaming, mData[2][7].gaming, mData[2][6].gaming, mData[2][5].gaming, mData[2][4].gaming, mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][9].home_gadget, mData[2][8].home_gadget, mData[2][7].home_gadget, mData[2][6].home_gadget, mData[2][5].home_gadget, mData[2][4].home_gadget, mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][9].lamp, mData[2][8].lamp, mData[2][7].lamp, mData[2][6].lamp, mData[2][5].lamp, mData[2][4].lamp, mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][9].film, mData[2][8].film, mData[2][7].film, mData[2][6].film, mData[2][5].film, mData[2][4].film, mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][9].gadget, mData[2][8].gadget, mData[2][7].gadget, mData[2][6].gadget, mData[2][5].gadget, mData[2][4].gadget, mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][9].power_bank, mData[2][8].power_bank, mData[2][7].power_bank, mData[2][6].power_bank, mData[2][5].power_bank, mData[2][4].power_bank, mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][9]['small_talk-bluetooth'], mData[2][8]['small_talk-bluetooth'], mData[2][7]['small_talk-bluetooth'], mData[2][6]['small_talk-bluetooth'], mData[2][5]['small_talk-bluetooth'], mData[2][4]['small_talk-bluetooth'], mData[2][3]['small_talk-bluetooth'], mData[2][2]['small_talk-bluetooth'], mData[2][1]['small_talk-bluetooth'], mData[2][0]['small_talk-bluetooth']],

					['Speaker', mData[2][9].speaker, mData[2][8].speaker, mData[2][7].speaker, mData[2][6].speaker, mData[2][5].speaker, mData[2][4].speaker, mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][9]['storage-memory_card'], mData[2][8]['storage-memory_card'], mData[2][7]['storage-memory_card'], mData[2][6]['storage-memory_card'], mData[2][5]['storage-memory_card'], mData[2][4]['storage-memory_card'], mData[2][3]['storage-memory_card'], mData[2][2]['storage-memory_card'], mData[2][1]['storage-memory_card'], mData[2][0]['storage-memory_card']],

					['Zhuaimao', mData[2][9].zhuaimao, mData[2][8].zhuaimao, mData[2][7].zhuaimao, mData[2][6].zhuaimao, mData[2][5].zhuaimao, mData[2][4].zhuaimao, mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][9].cancel, mData[2][8].cancel, mData[2][7].cancel, mData[2][6].cancel, mData[2][5].cancel, mData[2][4].cancel, mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][9].other, mData[2][8].other, mData[2][7].other, mData[2][6].other, mData[2][5].other, mData[2][4].other, mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 10) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth10, mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[2][10].adapter, mData[2][9].adapter, mData[2][8].adapter, mData[2][7].adapter, mData[2][6].adapter, mData[2][5].adapter, mData[2][4].adapter, mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][10].bag, mData[2][9].bag, mData[2][8].bag, mData[2][7].bag, mData[2][6].bag, mData[2][5].bag, mData[2][4].bag, mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][10].cable, mData[2][9].cable, mData[2][8].cable, mData[2][7].cable, mData[2][6].cable, mData[2][5].cable, mData[2][4].cable, mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][10].car_gadget, mData[2][9].car_gadget, mData[2][8].car_gadget, mData[2][7].car_gadget, mData[2][6].car_gadget, mData[2][5].car_gadget, mData[2][4].car_gadget, mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][10].case_for_smartphone, mData[2][9].case_for_smartphone, mData[2][8].case_for_smartphone, mData[2][7].case_for_smartphone, mData[2][6].case_for_smartphone, mData[2][5].case_for_smartphone, mData[2][4].case_for_smartphone, mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][10].case_for_tablet, mData[2][9].case_for_tablet, mData[2][8].case_for_tablet, mData[2][7].case_for_tablet, mData[2][6].case_for_tablet, mData[2][5].case_for_tablet, mData[2][4].case_for_tablet, mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][10].clearance, mData[2][9].clearance, mData[2][8].clearance, mData[2][7].clearance, mData[2][6].clearance, mData[2][5].clearance, mData[2][4].clearance, mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][10].creative, mData[2][9].creative, mData[2][8].creative, mData[2][7].creative, mData[2][6].creative, mData[2][5].creative, mData[2][4].creative, mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][10].gaming, mData[2][9].gaming, mData[2][8].gaming, mData[2][7].gaming, mData[2][6].gaming, mData[2][5].gaming, mData[2][4].gaming, mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][10].home_gadget, mData[2][9].home_gadget, mData[2][8].home_gadget, mData[2][7].home_gadget, mData[2][6].home_gadget, mData[2][5].home_gadget, mData[2][4].home_gadget, mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][10].lamp, mData[2][9].lamp, mData[2][8].lamp, mData[2][7].lamp, mData[2][6].lamp, mData[2][5].lamp, mData[2][4].lamp, mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][10].film, mData[2][9].film, mData[2][8].film, mData[2][7].film, mData[2][6].film, mData[2][5].film, mData[2][4].film, mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][10].gadget, mData[2][9].gadget, mData[2][8].gadget, mData[2][7].gadget, mData[2][6].gadget, mData[2][5].gadget, mData[2][4].gadget, mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][10].power_bank, mData[2][9].power_bank, mData[2][8].power_bank, mData[2][7].power_bank, mData[2][6].power_bank, mData[2][5].power_bank, mData[2][4].power_bank, mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][10]['small_talk-bluetooth'], mData[2][9]['small_talk-bluetooth'], mData[2][8]['small_talk-bluetooth'], mData[2][7]['small_talk-bluetooth'], mData[2][6]['small_talk-bluetooth'], mData[2][5]['small_talk-bluetooth'], mData[2][4]['small_talk-bluetooth'], mData[2][3]['small_talk-bluetooth'], mData[2][2]['small_talk-bluetooth'], mData[2][1]['small_talk-bluetooth'], mData[2][0]['small_talk-bluetooth']],

					['Speaker', mData[2][10].speaker, mData[2][9].speaker, mData[2][8].speaker, mData[2][7].speaker, mData[2][6].speaker, mData[2][5].speaker, mData[2][4].speaker, mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][10]['storage-memory_card'], mData[2][9]['storage-memory_card'], mData[2][8]['storage-memory_card'], mData[2][7]['storage-memory_card'], mData[2][6]['storage-memory_card'], mData[2][5]['storage-memory_card'], mData[2][4]['storage-memory_card'], mData[2][3]['storage-memory_card'], mData[2][2]['storage-memory_card'], mData[2][1]['storage-memory_card'], mData[2][0]['storage-memory_card']],

					['Zhuaimao', mData[2][10].zhuaimao, mData[2][9].zhuaimao, mData[2][8].zhuaimao, mData[2][7].zhuaimao, mData[2][6].zhuaimao, mData[2][5].zhuaimao, mData[2][4].zhuaimao, mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][10].cancel, mData[2][9].cancel, mData[2][8].cancel, mData[2][7].cancel, mData[2][6].cancel, mData[2][5].cancel, mData[2][4].cancel, mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][10].other, mData[2][9].other, mData[2][8].other, mData[2][7].other, mData[2][6].other, mData[2][5].other, mData[2][4].other, mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 11) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth11, mth10, mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[2][11].adapter, mData[2][10].adapter, mData[2][9].adapter, mData[2][8].adapter, mData[2][7].adapter, mData[2][6].adapter, mData[2][5].adapter, mData[2][4].adapter, mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][11].bag, mData[2][10].bag, mData[2][9].bag, mData[2][8].bag, mData[2][7].bag, mData[2][6].bag, mData[2][5].bag, mData[2][4].bag, mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][11].cable, mData[2][10].cable, mData[2][9].cable, mData[2][8].cable, mData[2][7].cable, mData[2][6].cable, mData[2][5].cable, mData[2][4].cable, mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][11].car_gadget, mData[2][10].car_gadget, mData[2][9].car_gadget, mData[2][8].car_gadget, mData[2][7].car_gadget, mData[2][6].car_gadget, mData[2][5].car_gadget, mData[2][4].car_gadget, mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][11].case_for_smartphone, mData[2][10].case_for_smartphone, mData[2][9].case_for_smartphone, mData[2][8].case_for_smartphone, mData[2][7].case_for_smartphone, mData[2][6].case_for_smartphone, mData[2][5].case_for_smartphone, mData[2][4].case_for_smartphone, mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][11].case_for_tablet, mData[2][10].case_for_tablet, mData[2][9].case_for_tablet, mData[2][8].case_for_tablet, mData[2][7].case_for_tablet, mData[2][6].case_for_tablet, mData[2][5].case_for_tablet, mData[2][4].case_for_tablet, mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][11].clearance, mData[2][10].clearance, mData[2][9].clearance, mData[2][8].clearance, mData[2][7].clearance, mData[2][6].clearance, mData[2][5].clearance, mData[2][4].clearance, mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][11].creative, mData[2][10].creative, mData[2][9].creative, mData[2][8].creative, mData[2][7].creative, mData[2][6].creative, mData[2][5].creative, mData[2][4].creative, mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][11].gaming, mData[2][10].gaming, mData[2][9].gaming, mData[2][8].gaming, mData[2][7].gaming, mData[2][6].gaming, mData[2][5].gaming, mData[2][4].gaming, mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][11].home_gadget, mData[2][10].home_gadget, mData[2][9].home_gadget, mData[2][8].home_gadget, mData[2][7].home_gadget, mData[2][6].home_gadget, mData[2][5].home_gadget, mData[2][4].home_gadget, mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][11].lamp, mData[2][10].lamp, mData[2][9].lamp, mData[2][8].lamp, mData[2][7].lamp, mData[2][6].lamp, mData[2][5].lamp, mData[2][4].lamp, mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][11].film, mData[2][10].film, mData[2][9].film, mData[2][8].film, mData[2][7].film, mData[2][6].film, mData[2][5].film, mData[2][4].film, mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][11].gadget, mData[2][10].gadget, mData[2][9].gadget, mData[2][8].gadget, mData[2][7].gadget, mData[2][6].gadget, mData[2][5].gadget, mData[2][4].gadget, mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][11].power_bank, mData[2][10].power_bank, mData[2][9].power_bank, mData[2][8].power_bank, mData[2][7].power_bank, mData[2][6].power_bank, mData[2][5].power_bank, mData[2][4].power_bank, mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][11]['small_talk-bluetooth'], mData[2][10]['small_talk-bluetooth'], mData[2][9]['small_talk-bluetooth'], mData[2][8]['small_talk-bluetooth'], mData[2][7]['small_talk-bluetooth'], mData[2][6]['small_talk-bluetooth'], mData[2][5]['small_talk-bluetooth'], mData[2][4]['small_talk-bluetooth'], mData[2][3]['small_talk-bluetooth'], mData[2][2]['small_talk-bluetooth'], mData[2][1]['small_talk-bluetooth'], mData[2][0]['small_talk-bluetooth']],

					['Speaker', mData[2][11].speaker, mData[2][10].speaker, mData[2][9].speaker, mData[2][8].speaker, mData[2][7].speaker, mData[2][6].speaker, mData[2][5].speaker, mData[2][4].speaker, mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][11]['storage-memory_card'], mData[2][10]['storage-memory_card'], mData[2][9]['storage-memory_card'], mData[2][8]['storage-memory_card'], mData[2][7]['storage-memory_card'], mData[2][6]['storage-memory_card'], mData[2][5]['storage-memory_card'], mData[2][4]['storage-memory_card'], mData[2][3]['storage-memory_card'], mData[2][2]['storage-memory_card'], mData[2][1]['storage-memory_card'], mData[2][0]['storage-memory_card']],

					['Zhuaimao', mData[2][11].zhuaimao, mData[2][10].zhuaimao, mData[2][9].zhuaimao, mData[2][8].zhuaimao, mData[2][7].zhuaimao, mData[2][6].zhuaimao, mData[2][5].zhuaimao, mData[2][4].zhuaimao, mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][11].cancel, mData[2][10].cancel, mData[2][9].cancel, mData[2][8].cancel, mData[2][7].cancel, mData[2][6].cancel, mData[2][5].cancel, mData[2][4].cancel, mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][11].other, mData[2][10].other, mData[2][9].other, mData[2][8].other, mData[2][7].other, mData[2][6].other, mData[2][5].other, mData[2][4].other, mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			} else if ($('#selectPrevious').val() == 12) {
				var data = google.visualization.arrayToDataTable([
					['Category', mth12, mth11, mth10, mth9, mth8, mth7, mth6, mth5, mth4, mth3, mth2, mth1, mth0],

					['Adapter', mData[2][12].adapter, mData[2][11].adapter, mData[2][10].adapter, mData[2][9].adapter, mData[2][8].adapter, mData[2][7].adapter, mData[2][6].adapter, mData[2][5].adapter, mData[2][4].adapter, mData[2][3].adapter, mData[2][2].adapter, mData[2][1].adapter, mData[2][0].adapter],

					['Bag', mData[2][12].bag, mData[2][11].bag, mData[2][10].bag, mData[2][9].bag, mData[2][8].bag, mData[2][7].bag, mData[2][6].bag, mData[2][5].bag, mData[2][4].bag, mData[2][3].bag, mData[2][2].bag, mData[2][1].bag, mData[2][0].bag],

					['Cable', mData[2][12].cable, mData[2][11].cable, mData[2][10].cable, mData[2][9].cable, mData[2][8].cable, mData[2][7].cable, mData[2][6].cable, mData[2][5].cable, mData[2][4].cable, mData[2][3].cable, mData[2][2].cable, mData[2][1].cable, mData[2][0].cable],

					['Car Gadget', mData[2][12].car_gadget, mData[2][11].car_gadget, mData[2][10].car_gadget, mData[2][9].car_gadget, mData[2][8].car_gadget, mData[2][7].car_gadget, mData[2][6].car_gadget, mData[2][5].car_gadget, mData[2][4].car_gadget, mData[2][3].car_gadget, mData[2][2].car_gadget, mData[2][1].car_gadget, mData[2][0].car_gadget],

					['Case For Smartphone', mData[2][12].case_for_smartphone, mData[2][11].case_for_smartphone, mData[2][10].case_for_smartphone, mData[2][9].case_for_smartphone, mData[2][8].case_for_smartphone, mData[2][7].case_for_smartphone, mData[2][6].case_for_smartphone, mData[2][5].case_for_smartphone, mData[2][4].case_for_smartphone, mData[2][3].case_for_smartphone, mData[2][2].case_for_smartphone, mData[2][1].case_for_smartphone, mData[2][0].case_for_smartphone],

					['Case For Tablet', mData[2][12].case_for_tablet, mData[2][11].case_for_tablet, mData[2][10].case_for_tablet, mData[2][9].case_for_tablet, mData[2][8].case_for_tablet, mData[2][7].case_for_tablet, mData[2][6].case_for_tablet, mData[2][5].case_for_tablet, mData[2][4].case_for_tablet, mData[2][3].case_for_tablet, mData[2][2].case_for_tablet, mData[2][1].case_for_tablet, mData[2][0].case_for_tablet],

					['Clearance', mData[2][12].clearance, mData[2][11].clearance, mData[2][10].clearance, mData[2][9].clearance, mData[2][8].clearance, mData[2][7].clearance, mData[2][6].clearance, mData[2][5].clearance, mData[2][4].clearance, mData[2][3].clearance, mData[2][2].clearance, mData[2][1].clearance, mData[2][0].clearance],

					['Gadget Creative', mData[2][12].creative, mData[2][11].creative, mData[2][10].creative, mData[2][9].creative, mData[2][8].creative, mData[2][7].creative, mData[2][6].creative, mData[2][5].creative, mData[2][4].creative, mData[2][3].creative, mData[2][2].creative, mData[2][1].creative, mData[2][0].creative],

					['Gaming', mData[2][12].gaming, mData[2][11].gaming, mData[2][10].gaming, mData[2][9].gaming, mData[2][8].gaming, mData[2][7].gaming, mData[2][6].gaming, mData[2][5].gaming, mData[2][4].gaming, mData[2][3].gaming, mData[2][2].gaming, mData[2][1].gaming, mData[2][0].gaming],

					['Home Gadget', mData[2][12].home_gadget, mData[2][11].home_gadget, mData[2][10].home_gadget, mData[2][9].home_gadget, mData[2][8].home_gadget, mData[2][7].home_gadget, mData[2][6].home_gadget, mData[2][5].home_gadget, mData[2][4].home_gadget, mData[2][3].home_gadget, mData[2][2].home_gadget, mData[2][1].home_gadget, mData[2][0].home_gadget],

					['Lamp', mData[2][12].lamp, mData[2][11].lamp, mData[2][10].lamp, mData[2][9].lamp, mData[2][8].lamp, mData[2][7].lamp, mData[2][6].lamp, mData[2][5].lamp, mData[2][4].lamp, mData[2][3].lamp, mData[2][2].lamp, mData[2][1].lamp, mData[2][0].lamp],

					['Film', mData[2][12].film, mData[2][11].film, mData[2][10].film, mData[2][9].film, mData[2][8].film, mData[2][7].film, mData[2][6].film, mData[2][5].film, mData[2][4].film, mData[2][3].film, mData[2][2].film, mData[2][1].film, mData[2][0].film],

					['Smart life', mData[2][12].gadget, mData[2][11].gadget, mData[2][10].gadget, mData[2][9].gadget, mData[2][8].gadget, mData[2][7].gadget, mData[2][6].gadget, mData[2][5].gadget, mData[2][4].gadget, mData[2][3].gadget, mData[2][2].gadget, mData[2][1].gadget, mData[2][0].gadget],

					['Power Bank', mData[2][12].power_bank, mData[2][11].power_bank, mData[2][10].power_bank, mData[2][9].power_bank, mData[2][8].power_bank, mData[2][7].power_bank, mData[2][6].power_bank, mData[2][5].power_bank, mData[2][4].power_bank, mData[2][3].power_bank, mData[2][2].power_bank, mData[2][1].power_bank, mData[2][0].power_bank],

					['Small Talk Bluetooth', mData[2][12]['small_talk-bluetooth'], mData[2][11]['small_talk-bluetooth'], mData[2][10]['small_talk-bluetooth'], mData[2][8]['small_talk-bluetooth'], mData[2][7]['small_talk-bluetooth'], mData[2][6]['small_talk-bluetooth'], mData[2][6]['small_talk-bluetooth'], mData[2][5]['small_talk-bluetooth'], mData[2][4]['small_talk-bluetooth'], mData[2][3]['small_talk-bluetooth'], mData[2][2]['small_talk-bluetooth'], mData[2][1]['small_talk-bluetooth'], mData[2][0]['small_talk-bluetooth']],

					['Speaker', mData[2][12].speaker, mData[2][11].speaker, mData[2][10].speaker, mData[2][9].speaker, mData[2][8].speaker, mData[2][7].speaker, mData[2][6].speaker, mData[2][5].speaker, mData[2][4].speaker, mData[2][3].speaker, mData[2][2].speaker, mData[2][1].speaker, mData[2][0].speaker],

					['Storage Memory Card', mData[2][12]['storage-memory_card'], mData[2][11]['storage-memory_card'], mData[2][10]['storage-memory_card'], mData[2][9]['storage-memory_card'], mData[2][8]['storage-memory_card'], mData[2][7]['storage-memory_card'], mData[2][6]['storage-memory_card'], mData[2][5]['storage-memory_card'], mData[2][4]['storage-memory_card'], mData[2][3]['storage-memory_card'], mData[2][2]['storage-memory_card'], mData[2][1]['storage-memory_card'], mData[2][0]['storage-memory_card']],

					['Zhuaimao', mData[2][12].zhuaimao, mData[2][11].zhuaimao, mData[2][10].zhuaimao, mData[2][9].zhuaimao, mData[2][8].zhuaimao, mData[2][7].zhuaimao, mData[2][6].zhuaimao, mData[2][5].zhuaimao, mData[2][4].zhuaimao, mData[2][3].zhuaimao, mData[2][2].zhuaimao, mData[2][1].zhuaimao, mData[2][0].zhuaimao],

					['ยกเลิกใช้งาน', mData[2][12].cancel, mData[2][11].cancel, mData[2][10].cancel, mData[2][9].cancel, mData[2][8].cancel, mData[2][7].cancel, mData[2][6].cancel, mData[2][5].cancel, mData[2][4].cancel, mData[2][3].cancel, mData[2][2].cancel, mData[2][1].cancel, mData[2][0].cancel],

					['Other', mData[2][12].other, mData[2][11].other, mData[2][10].other, mData[2][9].other, mData[2][8].other, mData[2][7].other, mData[2][6].other, mData[2][5].other, mData[2][4].other, mData[2][3].other, mData[2][2].other, mData[2][1].other, mData[2][0].other]
				]);
			}
		}



		var options = {
			title: lblType + ' Summary Chart',
			bars: 'vertical',
			vAxis: { format: 'decimal' },
			//hAxis: {direction:-1, slantedText:true, slantedTextAngle:90 },
			height: 500
		};

		var chart = new google.visualization.ColumnChart(document.getElementById('div-chart1'));
		google.visualization.events.addListener(chart, 'ready', chartLoaded1);

		google.visualization.events.addListener(chart, 'select', function () {
			var selectedItem = chart.getSelection()[0];

			var categoryId = [2, 11, 1, 13, 5, 10, 16, 15, 30, 29, 38, 6, 9, 3, 4, 8, 21, 22, 19, 20];
			if (selectedItem) {
				var convertIndex = parseInt($('#selectPrevious').val()) + 2 - selectedItem.column;
				renderProductQuantity(categoryId[selectedItem.row], convertIndex);
			}
		});

		chart.draw(data, options);

		/*var chart = new google.charts.Bar(document.getElementById('div-chart1'));
		google.visualization.events.addListener(chart, 'ready', chartLoaded);
		chart.draw(data, google.charts.Bar.convertOptions(options));*/

	}


}

function chartLoaded1() {
	$('#box-chart1').show();
	$('#box-chart1 .overlay').hide();
}

function sortJSON(data, key, way) {
	return data.sort(function (a, b) {
		var x = a[key]; var y = b[key];
		if (way === 'desc') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
		else { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
	});
};



function loadConfig() {
	config = storage.get('ConfigScreenReportCustomerOrder');
	if (config == undefined) {
		config = {};
		config.provinceExcept = '|กรุงเทพมหานคร|';
		config.provinceMonthSelected = '0';
		storage.set('ConfigScreenReportCustomerOrder', config);
	}
}

function loadCustomerOrderByProvince() {
	$.post('https://api.remaxthailand.co.th/order/history/province', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val(),
		memberTypeSelect: $('.select-memberType option:selected').attr('data-type')
	}, function (data) {
		if (data.success) {
			loadGeoChartDone = true;
			storage.set('DataScreenReportCustomerOrder-HistoryByProvince', JSON.stringify(data.result));
			google.charts.setOnLoadCallback(renderCustomerOrderByProvince);
			//renderCustomerOrderByProvince();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadCustomerOrder() {
	$.post('https://api.remaxthailand.co.th/order/history/customer', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val()
	}, function (data) {
		if (data.success) {
			storage.set('DataScreenReportCustomerOrder-HistoryByCustomer', JSON.stringify(data.result));
			//orderByProvinceData = data.result;
			//google.charts.setOnLoadCallback(renderCustomerOrderByProvince);
			//renderCustomerOrderByProvince();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadThailandInfo() {
	if (storage.get('ThailandRegion') == undefined) {
		$.post('https://api.remaxthailand.co.th/province/thailandInfo', { apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C' }, function (data) {
			if (data.success) {
				storage.set('ThailandRegion', JSON.stringify(data.result[0]));
				//storage.set('ThailandDistrict', JSON.stringify(data.result[2]));

				var json = {}
				for (i = 0; i < data.result[1].length; i++) {
					json[data.result[1][i].id] = {};
					json[data.result[1][i].id].nameTh = data.result[1][i].nameTh;
					json[data.result[1][i].id].nameEn = data.result[1][i].nameEn;
					json[data.result[1][i].id].region = '|' + data.result[1][i].region + '|' +
						(data.result[1][i].region1 == null ? '' : data.result[1][i].region1 + '|') +
						(data.result[1][i].region2 == null ? '' : data.result[1][i].region2 + '|');
				}
				storage.set('ThailandProvince', JSON.stringify(json));

				json = {}
				for (i = 0; i < data.result[1].length; i++) {
					json[data.result[1][i].nameTh] = data.result[1][i].id;
					json[data.result[1][i].nameEn] = data.result[1][i].id;
				}
				storage.set('ThailandProvinceKey', JSON.stringify(json));

				json = {}
				for (i = 0; i < data.result[2].length; i++) {
					var id = data.result[2][i].id + '-' + data.result[2][i].province;
					json[id] = {};
					json[id].nameTh = data.result[2][i].nameTh;
					json[id].nameEn = data.result[2][i].nameEn;
					json[id].zipcode = data.result[2][i].zipcode;
				}
				storage.set('ThailandDistrict', JSON.stringify(json));

			}
		}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
	}
}

function renderCustomerOrderByProvince() {
	$('#dv-province-chart .overlay, #dv-top-sell .overlay').show();
	$('#dv-customer_history').slideUp();

	var data = storage.get('DataScreenReportCustomerOrder-HistoryByProvince');
	data.sort(sort_by('month' + config.provinceMonthSelected, true, parseInt));
	$('#dv-top-sell tbody').html('');

	var province = storage.get('ThailandProvince');
	var provinceKey = storage.get('ThailandProvinceKey');
	var nameKey = $('#lang').val() == 'en' ? 'nameEn' : 'nameTh';

	var dataTable = new google.visualization.DataTable();
	dataTable.addColumn('string', 'City');
	dataTable.addColumn('number', $('#dv-customer_history th.th-total').html());
	dataTable.addColumn('number', $('#dv-customer_history th.th-bill').html());

	var sum = 0;

	for (i = 0; i < data.length; i++) {
		if (data[i]['month' + config.provinceMonthSelected] > 0 && config.provinceExcept.indexOf('|' + data[i].province + '|') == -1 && province[provinceKey[data[i].province]] != undefined) {
			dataTable.addRow([province[provinceKey[data[i].province]][nameKey], data[i]['month' + config.provinceMonthSelected], data[i]['bill' + config.provinceMonthSelected]]);
			sum += data[i]['month' + config.provinceMonthSelected];
		}
		if (i < 10) {
			if (data[i]['bill' + config.provinceMonthSelected] > 0 && province[provinceKey[data[i].province]] != undefined)
				$('#dv-top-sell tbody').append('<tr><td class="text-center">' + (i + 1) + '</td>' +
					'<td><i class="show-province pointer fa ' + ((config.provinceExcept.indexOf('|' + data[i].province + '|') == -1) ? 'fa-eye text-green' : 'fa-eye-slash text-yellow') + ' padding-right-5"></i> ' +
					'<span class="province pointer" data-key="' + provinceKey[data[i].province] + '">' + province[provinceKey[data[i].province]][nameKey] + '</span></td>' +
					'<td class="text-right">' + numberWithCommas(data[i]['month' + config.provinceMonthSelected].toFixed(0)) + '</td></tr>');
		}
	}

	$('#dv-top-sell tbody').append('<tr><td colspan="2" class="text-right font-bold">' + $('#msg-total').val() + '</td><td class="text-right font-bold">' + numberWithCommas(sum.toFixed(0)) + '</td></tr>');

	var options = {
		region: 'TH',
		displayMode: 'markers',
		//backgroundColor: '#f9f9f9',
		colorAxis: { colors: ['#dd4b39', '#f39c12', '#00a65a', '#3c8dbc'] }
	};

	var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
	google.visualization.events.addListener(chart, 'ready', chartLoaded2);
	google.visualization.events.addListener(chart, 'select', function () {
		var selectedItem = chart.getSelection()[0];
		if (selectedItem) {
			var json = storage.get('ThailandProvinceKey');
			renderOrderData(json[dataTable.getValue(selectedItem.row, 0)]);
		}
	});
	chart.draw(dataTable, options);
}

function chartLoaded2() {
	$('#dv-province-chart .overlay, #dv-top-sell .overlay').hide();
	$('#dv-top-sell').show();

}

function renderOrderData(province) {
	var data = storage.get('DataScreenReportCustomerOrder-HistoryByCustomer');
	data.sort(sort_by('month' + config.provinceMonthSelected, true, parseInt));

	var district = storage.get('ThailandDistrict');
	var nameKey = $('#lang').val() == 'en' ? 'nameEn' : 'nameTh';

	$('#dv-customer_history tbody').html('');

	var html = '';
	var idx = 1;
	for (i = 0; i < data.length; i++) {
		if ($('.select-memberType option:selected').attr('data-type').length > 0) {
			if (data[i].province == province && data[i]['bill' + config.provinceMonthSelected] > 0 && data[i].memberType == $('.select-memberType option:selected').attr('data-type')) {
				var districtName = district[data[i].district + '-' + province][nameKey];
				html += '<tr><td>' + (idx++) + '</td><td>' + data[i].member + '</td><td>' + data[i].name + '</td><td>' + data[i].shop + '</td><td>' + data[i].mobile + '</td><td>' +
					(districtName == null ? district[data[i].district + '-' + province].nameTh : districtName)
					+ '</td><td class="text-center">' + data[i].sellPrice + '</td>' +
					'<td class="text-center">' + data[i]['bill' + config.provinceMonthSelected] + '</td><td class="text-right">' + numberWithCommas(data[i]['month' + config.provinceMonthSelected].toFixed(0)) + '</td></tr>';
			}
		} else {
			if (data[i].province == province && data[i]['bill' + config.provinceMonthSelected] > 0) {
				var districtName = district[data[i].district + '-' + province][nameKey];
				html += '<tr><td>' + (idx++) + '</td><td>' + data[i].member + '</td><td>' + data[i].name + '</td><td>' + data[i].shop + '</td><td>' + data[i].mobile + '</td><td>' +
					(districtName == null ? district[data[i].district + '-' + province].nameTh : districtName)
					+ '</td><td class="text-center">' + data[i].sellPrice + '</td>' +
					'<td class="text-center">' + data[i]['bill' + config.provinceMonthSelected] + '</td><td class="text-right">' + numberWithCommas(data[i]['month' + config.provinceMonthSelected].toFixed(0)) + '</td></tr>';
			}
		}

	}
	$('#dv-customer_history tbody').html(html)
	$('#dv-customer_history').slideDown();
}

function renderProductQuantity(category, month) {
	$.post('https://api.remaxthailand.co.th/sale/monthly/category', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val(),
		category: category,
		month: month,
		brand: brandUrl
	}, function (data) {
		if (data.success) {
			var type = $('#selectType').val().replace('type-', '');
			data.result.sort(sort_by(type + 'Rank', false, parseInt));
			html = '';
			for (i = 0; i < data.result.length; i++) {
				var result = data.result[i];
				html += '<tr><td class="text-' + ((result[type + 'Rank'] < result[type + 'RankPrev'] || result[type + 'RankPrev'] == 0) ? 'green' : ((result[type + 'Rank'] > result[type + 'RankPrev']) ? 'red' : 'primary')) + '">' +
					'<i class="fa fa-' + ((result[type + 'Rank'] < result[type + 'RankPrev'] || result[type + 'RankPrev'] == 0) ? 'chevron-circle-up' : ((result[type + 'Rank'] > result[type + 'RankPrev']) ? 'chevron-circle-down' : 'circle')) + '"></i> ' +
					result[type + 'Rank'] + ((result[type + 'RankPrev'] != 0 && result[type + 'Rank'] != result[type + 'RankPrev']) ? ' <small class="text-gray">(' + result[type + 'RankPrev'] + ')</small>' : '') + '</td>';
				html += '<td><i class="pointer text-muted fa fa-photo td-image" data-container="body" data-toggle="popover" data-placement="top" data-content="<img class=\'lazy\' data-original=\'//img.remaxthailand.co.th/100x100/product/' + result.sku + '/1.jpg\' src=\'//src.remaxthailand.co.th/img/Remax/web/gif/loading.gif\' width=\'100\'>"></i> ' + result.sku + '</td>';
				html += '<td>' + result.name + '</td>';
				html += '<td class="text-right data-qty">' + numberWithCommas(result.qty.toFixed(0)) + '</td>';
				html += '<td class="text-right data-cost">' + numberWithCommas(result.cost.toFixed(0)) + '</td>';
				html += '<td class="text-right data-sale">' + numberWithCommas(result.sale.toFixed(0)) + '</td>';
				html += '<td class="text-right data-profit">' + numberWithCommas(result.profit.toFixed(0)) + '</td></tr>';
			}

			$('#dv-monthlySaleByCategory tbody').html(html);
			$('#dv-monthlySaleByCategory .text-selected.text-green').removeClass('text-selected').removeClass('text-green');
			$('#dv-monthlySaleByCategory .font-bold').removeClass('font-bold');
			$('#dv-monthlySaleByCategory .data-' + type)
				.addClass('text-selected').addClass('text-green').addClass('font-bold');

			$('.td-image').popover({
				html: true,
				trigger: 'hover',
			});

			$('#dv-monthlySaleByCategory').slideDown();
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function renderMonthlySaleDetail(year, month, type) {
	$.post('https://api.remaxthailand.co.th/sale/monthlySaleDetail', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		year: year,
		month: month,
		type: type.toLowerCase(),
		brand: brandUrl
	}, function (data) {
		if (data.success) {

			//if(type == 'Shop' || type == 'Chain') {
			var chartData = new Array();
			chartData.push(new Array('Name', 'Price'));
			var member = new Array();
			var html = '';
			for (i = 0; i < data.result.length; i++) {
				chartData.push(new Array(data.result[i].name, data.result[i].price));
				member.push(data.result[i].member);
				if (type.toLowerCase() == 'shop') {
					html += '<tr><td>' + data.result[i].name + '</td><td class="text-right">' + numberWithCommas(data.result[i].price) + '</td></tr>';
				}
			}

			if (type.toLowerCase() == 'shop') {
				$('#div-tableMonthlySaleDetail').show();
				$('#div-tableMonthlySaleDetail table tbody').html(html);
			}
			else {
				$('#div-tableMonthlySaleDetail').hide();
				$('#div-tableMonthlySaleDetail table tbody').html('');
			}


			var name = data.result[0].name;
			google.charts.setOnLoadCallback(function () {
				var data = google.visualization.arrayToDataTable(chartData);
				var options = {
					title: 'Total Sales Detail (' + type + ') of ' + monthEnFull[month - 1] + ' ' + year,
					pieHole: 0.3,
				};
				var chart = new google.visualization.PieChart(document.getElementById('div-chartMonthlySaleDetail'));

				google.visualization.events.addListener(chart, 'select', function () {
					var selectedItem = chart.getSelection()[0];
					if (selectedItem) {
						selectedMemberMonthly = member[selectedItem.row];
						renderMonthlySaleHistory(selectedMemberMonthly, type, chartData[selectedItem.row + 1][0], 'div-chartMonthlySaleHistory');
					}
				});
				chart.draw(data, options);

				if (selectedMemberMonthly == '') {
					selectedMemberMonthly = member[0];
					//var d = new Date();
					//renderMonthlySaleDetail( $('#selectYear').val(), d.getMonth()+1, selectedMemberMonthly);
					renderMonthlySaleHistory(selectedMemberMonthly, selectedDataTypeMonthly, name, 'div-chartMonthlySaleHistory');
				}
				//$('#div-chartMonthlySaleDetail').slideDown();
			});
			//}
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function renderDailySaleDetail(year, month, day, type) {
	$.post('https://api.remaxthailand.co.th/sale/dailySaleDetail', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		year: year,
		month: month,
		day: day,
		type: type.toLowerCase(),
		brand: brandUrl
	}, function (data) {
		if (data.success) {

			//if(type == 'Shop' || type == 'Chain') {
			var chartData = new Array();
			chartData.push(new Array('Name', 'Price'));
			var member = new Array();
			for (i = 0; i < data.result.length; i++) {
				chartData.push(new Array(data.result[i].name, data.result[i].price));
				member.push(data.result[i].member);
			}
			var name = data.result[0].name;
			google.charts.setOnLoadCallback(function () {
				var data = google.visualization.arrayToDataTable(chartData);
				var options = {
					title: 'Total Sales Detail (' + type + ') of ' + day + ' ' + monthEnFull[month - 1] + ' ' + year,
					pieHole: 0.3,
				};
				var chart = new google.visualization.PieChart(document.getElementById('div-chartDailySaleDetail'));

				google.visualization.events.addListener(chart, 'select', function () {
					var selectedItem = chart.getSelection()[0];
					if (selectedItem) {
						selectedMemberDaily = member[selectedItem.row];
						renderMonthlySaleHistory(selectedMemberDaily, type, chartData[selectedItem.row + 1][0], 'div-chartDailySaleHistory');
					}
				});
				chart.draw(data, options);

				if (selectedMemberDaily == '') {
					selectedMemberDaily = member[0];
					renderMonthlySaleHistory(selectedMemberDaily, selectedDataTypeDaily, name, 'div-chartDailySaleHistory');
				}
				//$('#div-chartMonthlySaleDetail').slideDown();
			});
			//}
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function renderMonthlySaleHistory(member, type, name, object) {
	$.post('https://api.remaxthailand.co.th/sale/monthlySaleHistory', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		member: member,
		type: type.toLowerCase(),
		brand: brandUrl
	}, function (data) {
		if (data.success) {
			//if(type == 'Shop' || type == 'Chain') {
			var chartData = new Array();
			chartData.push(new Array('Month', 'Price'));
			for (i = 0; i < data.result.length; i++) {
				chartData.push(new Array(monthEn[data.result[i].monthNo - 1] + '-' + data.result[i].yearNo, data.result[i].price));
			}
			google.charts.setOnLoadCallback(function () {
				var data = google.visualization.arrayToDataTable(chartData);
				var options = {
					title: 'Total Sales History of ' + name,
					vAxis: {
						viewWindow: {
							min: 0
						}
					},
					curveType: 'function',
					legend: { position: 'none' },
					hAxis: { textPosition: 'none' },
				};
				var chart = new google.visualization.LineChart(document.getElementById(object));
				chart.draw(data, options);
				$('#div-chartMonthlySaleHistory').slideDown();
			});
			//}
		}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadDailySaleData() {
	$.post('https://api.remaxthailand.co.th/sale/dailySaleOfMonth', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		year: $('#selectMonth').val(),
		month: $('#selectMonth option:selected').data('month'),
		brand: brandUrl 
	}, function (data) {
		if (data.success) {
			var chartDataDS = generateHqDailyDataWithAvg(data.result.sales);
			var dataNameDS = chartDataDS[0];

			google.charts.setOnLoadCallback(function () {
				var data = google.visualization.arrayToDataTable(chartDataDS);
				var options = {
					title: 'Total Sales Chart' + ((chartDataDS.length > 1) ? ' (Average ' + numberWithCommas(chartDataDS[1][6]) + ' Baht)' : ''),
					bars: 'vertical',
					vAxis: { format: 'decimal' },
					bar: { groupWidth: "50%" },
					series: { 7: { type: 'line' } },
					isStacked: true,
					vAxis: {
						viewWindow: {
							min: 0
						}
					},
					seriesType: 'bars',
				};

				var chart = new google.visualization.ColumnChart(document.getElementById('div-chartDailySale'));
				google.visualization.events.addListener(chart, 'select', function () {
					var selectedItem = chart.getSelection()[0];
					if (selectedItem && selectedItem.column <= 7) {
						selectedDataTypeDaily = dataNameDS[selectedItem.column];
						selectedMemberDaily = '';
						renderDailySaleDetail($('#selectMonth').val(), $('#selectMonth option:selected').data('month'), selectedItem.row + 1, selectedDataTypeDaily);
					}
				});
				chart.draw(data, options);
				if (selectedDataTypeDaily == '') {
					selectedDataTypeDaily = 'Shop';
					var d = new Date();
					renderDailySaleDetail($('#selectMonth').val(), $('#selectMonth option:selected').data('month'), d.getDate(), selectedDataTypeDaily);
				}
			});

			var chartData = generateHqDailyData(data.result.sales);
			google.charts.setOnLoadCallback(function () {
				var data = google.visualization.arrayToDataTable(chartData);
				var options = {
					title: 'Total Sales Chart (Percent)',
					bars: 'vertical',
					bar: { groupWidth: "50%" },
					isStacked: 'percent',
					hAxis: {
						minValue: 0,
					}
				};
				var chart = new google.visualization.ColumnChart(document.getElementById('div-chartDailyStackPercent'));
				chart.draw(data, options);
			});

			chartData = generateHqDailyDataWithAvg(data.result.qty);
			google.charts.setOnLoadCallback(function () {
				var data = google.visualization.arrayToDataTable(chartData);
				var options = {
					title: 'Total Quantity Chart' + ((chartData.length > 1) ? ' (Average ' + numberWithCommas(chartData[1][6]) + ' Pieces)' : ''),
					bars: 'vertical',
					vAxis: { format: 'decimal' },
					bar: { groupWidth: "50%" },
					series: { 7: { type: 'line' } },
					isStacked: true,
					vAxis: {
						viewWindow: {
							min: 0
						}
					},
					seriesType: 'bars',
				};

				var chart = new google.visualization.ColumnChart(document.getElementById('div-chartDailyQty'));
				chart.draw(data, options);
			});

		}
	}, 'json');
}

var sort_by = function (field, reverse, primer) {
	var key = primer ?
		function (x) { return primer(x[field]) } :
		function (x) { return x[field] };

	reverse = !reverse ? 1 : -1;

	return function (a, b) {
		return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
	}
}


function generateHqData(values) {
	var chartData = new Array();
	chartData.push(new Array('Month', 'Dealer', 'Shop', 'Chain', 'Premium', 'Event','Consign','Event Shop'));
	for (i = 1; i <= 12; i++) {
		chartData.push(new Array(monthEn[i - 1], values['' + i]['member'], values['' + i]['shop'], values['' + i]['chain'], values['' + i]['premium'], values['' + i]['event'], values['' + i]['consign'], values['' + i]['eventShop']));
	}
	return chartData;
}


function generateHqDataWithAvg(values) {
	var chartData = new Array();
	chartData.push(new Array('Month', 'Dealer', 'Shop', 'Chain', 'Premium', 'Event', 'Consign','Event Shop', 'Average'));
	var avg = 0;
	var count = 0;
	for (i = 1; i <= 12; i++) {
		if (values['' + i]['member'] != 0 || values['' + i]['shop'] != 0 || values['' + i]['chain'] != 0 || values['' + i]['premium'] != 0 || values['' + i]['event'] != 0 || values['' + i]['consign'] != 0 || values['' + i]['eventShop'] != 0) {
			avg += values['' + i]['member'] + values['' + i]['shop'] + values['' + i]['chain'] + values['' + i]['premium'] + values['' + i]['event'] + values['' + i]['consign'] + values['' + i]['eventShop'];
			count++;
		}
	}
	avg = parseInt((avg / count).toFixed(0));
	for (i = 1; i <= 12; i++) {
		chartData.push(new Array(monthEn[i - 1], values['' + i]['member'], values['' + i]['shop'], values['' + i]['chain'], values['' + i]['premium'], values['' + i]['event'], values['' + i]['consign'], values['' + i]['eventShop'], avg));
	}
	return chartData;
}


function generateHqDailyData(values) {
	var chartData = new Array();
	chartData.push(new Array('Day', 'Dealer', 'Shop', 'Chain', 'Premium', 'Event', 'Consign', 'Event Shop'));
	$.each(values, function (i, val) {
		chartData.push(new Array(i, val['member'], val['shop'], val['chain'], val['premium'], val['event'], val['consign'], val['eventShop']));
	});
	return chartData;
}


function generateHqDailyDataWithAvg(values) {
	var chartData = new Array();
	chartData.push(new Array('Day', 'Dealer', 'Shop', 'Chain', 'Premium', 'Event', 'Consign', 'Event Shop', 'Average'));
	var avg = 0;
	var count = 0;
	$.each(values, function (i, val) {
		if (val['member'] != 0 || val['shop'] != 0 || val['chain'] != 0  || val['premium'] != 0 || val['event'] != 0 || val['consign'] != 0 || val['eventShop'] != 0) {
			avg += val['member'] + val['shop'] + val['chain'] + val['premium'] + val['event'] + val['consign'] + val['eventShop'];
			count++;
		}
	});
	avg = parseInt((avg / count).toFixed(0));
	$.each(values, function (i, val) {
		chartData.push(new Array(i, val['member'], val['shop'], val['chain'], val['premium'], val['event'], val['consign'], val['eventShop'], avg));
	});
	return chartData;
}

function generateHqPriceData(values) {
	var chartData = new Array();
	chartData.push(new Array('Month', 'Price1', 'Price2', 'Price3', 'Price4', 'Price5', 'P1/Bill', 'P2/Bill', 'P3/Bill', 'P4/Bill', 'P5/Bill'));
	for (i = 1; i <= 12; i++) {
		chartData.push(new Array(monthEn[i - 1], values['1']['' + i]['price'], values['2']['' + i]['price'], values['3']['' + i]['price'], values['4']['' + i]['price'], values['5']['' + i]['price'],
			(values['1']['' + i]['bill'] == 0) ? 0 : values['1']['' + i]['price'] / values['1']['' + i]['bill'],
			(values['2']['' + i]['bill'] == 0) ? 0 : values['2']['' + i]['price'] / values['2']['' + i]['bill'],
			(values['3']['' + i]['bill'] == 0) ? 0 : values['3']['' + i]['price'] / values['3']['' + i]['bill'],
			(values['4']['' + i]['bill'] == 0) ? 0 : values['4']['' + i]['price'] / values['4']['' + i]['bill'],
			(values['5']['' + i]['bill'] == 0) ? 0 : values['5']['' + i]['price'] / values['5']['' + i]['bill']
		));
	}
	return chartData;
}

function generateHqSeriesData(values1, values2) {
	var chartData = new Array();
	chartData.push(new Array('Month', 'Dealer', 'Shop', 'Chain','Premium', 'Event', 'Consign','Event Shop', 'Dealer (Bill)', 'Shop (Bill)', 'Chain (Bill)', 'Event (Bill)', 'Consign (Bill)','Event Shop (Bill)'));
	for (i = 1; i <= 12; i++) {
		chartData.push(new Array(monthEn[i - 1], values1['' + i]['member'], values1['' + i]['shop'], values1['' + i]['chain'], values1['' + i]['premium'], values1['' + i]['event'], values1['' + i]['consign'], values1['' + i]['eventShop'], values2['' + i]['member'], values2['' + i]['shop'], values2['' + i]['chain'], values2['' + i]['premium'], values2['' + i]['event'], values2['' + i]['consign'], values2['' + i]['eventShop']));
	}
	return chartData;
}

function exportExl() {
	$(".table2excel").table2excel({
		exclude: ".noExl",
		name: "Excel Document Name",
		filename: "Ranking Monthly",
		fileext: ".xls",
		exclude_img: true,
		exclude_links: true,
		exclude_inputs: true
	});
	console.log('print')
}

function loadBrand() {
	//$('#dv-loading').show();
	//$('#dv-no_data, #tb-result').hide();
	$.post('https://api.remaxthailand.co.th/brand/member', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		memberKey: $('#authKey').val()
	}, function (data) {
		if (data.success) {
			if (data.result[0].url == 'wk') {
				brandUrl = data.result[0].url;
			} else if ($('#role').val() == 'owner-wk') {
				brandUrl = 'wk';
			} else {
				brandUrl = '';
			}
		}
		loadmData();
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}


function loadTable() {
	$('#tb-result').hide();
	$.post('https://api.remaxthailand.co.th/sale/monthlySaleOfYear_table', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		year: $('#selectYear').val(),
		brand: brandUrl,
		notbrand: $('#excluseWk:checked').val()
	}, function (data) {
		//if (data.success) {
		if (typeof data.result != 'undefined') {
			var values = data.result;
			if (values.length > 0) {
				storage.set('monthlySaleOfYear_table', JSON.stringify(values));
			}
		}

		json = storage.get('monthlySaleOfYear_table');
		var sumJan = 0;
		var sumFeb = 0;
		var sumMar = 0;
		var sumApr = 0;
		var sumMay = 0;
		var sumJun = 0;
		var sumJul = 0;
		var sumAug = 0;
		var sumSep = 0;
		var sumOct = 0;
		var sumNov = 0;
		var sumDec = 0;
		$('#tb-result tbody').html('');
		for (i = 0; i < json.length; i++) {
			var result = json[i];
			var html = '<tr><td class="text-right" valign="middle" >' + result.memberType + '</td>';
			html += '<td width="100" class="sumJan text-right" valign="middle" data-val= ' + result.jan + '>' + ((result.jan == 0) ? '-' : numberWithCommas(result.jan)) + '</td>';
			html += '<td width="100" class="sumFeb text-right" valign="middle" data-val= ' + result.feb + '>' + ((result.feb == 0) ? '-' : numberWithCommas(result.feb)) + '</td>';
			html += '<td width="100" class="sumMar text-right" valign="middle" data-val= ' + result.mar + '>' + ((result.mar == 0) ? '-' : numberWithCommas(result.mar)) + '</td>';
			html += '<td width="100" class="sumApr text-right" valign="middle" data-val= ' + result.apr + '>' + ((result.apr == 0) ? '-' : numberWithCommas(result.apr)) + '</td>';
			html += '<td width="100" class="sumMay text-right" valign="middle" data-val= ' + result.may + '>' + ((result.may == 0) ? '-' : numberWithCommas(result.may)) + '</td>';
			html += '<td width="100" class="sumJun text-right" valign="middle" data-val= ' + result.jun + '>' + ((result.jun == 0) ? '-' : numberWithCommas(result.jun)) + '</td>';
			html += '<td width="100" class="sumJul text-right" valign="middle" data-val= ' + result.jul + '>' + ((result.jul == 0) ? '-' : numberWithCommas(result.jul)) + '</td>';
			html += '<td width="100" class="sumAug text-right" valign="middle" data-val= ' + result.aug + '>' + ((result.aug == 0) ? '-' : numberWithCommas(result.aug)) + '</td>';
			html += '<td width="100" class="sumSep text-right" valign="middle" data-val= ' + result.sep + '>' + ((result.sep == 0) ? '-' : numberWithCommas(result.sep)) + '</td>';
			html += '<td width="100" class="sumOct text-right" valign="middle" data-val= ' + result.oct + '>' + ((result.oct == 0) ? '-' : numberWithCommas(result.oct)) + '</td>';
			html += '<td width="100" class="sumNov text-right" valign="middle" data-val= ' + result.nov + '>' + ((result.nov == 0) ? '-' : numberWithCommas(result.nov)) + '</td>';
			html += '<td width="100" class="sumDec text-right" valign="middle" data-val= ' + result.dec + '>' + ((result.dec == 0) ? '-' : numberWithCommas(result.dec)) + '</td>';
			html += '</tr>';

			sumJan += result.jan;
			sumFeb += result.feb;
			sumMar += result.mar;
			sumApr += result.apr;
			sumMay += result.may;
			sumJun += result.jun;
			sumJul += result.jul;
			sumAug += result.aug;
			sumSep += result.sep;
			sumOct += result.oct;
			sumNov += result.nov;
			sumDec += result.dec;

			$('#tb-result tbody').append(html);

		}

		$('#sumJan').html(((sumJan == 0) ? '-' : numberWithCommas(sumJan)));
		$('#sumFeb').html(((sumFeb == 0) ? '-' : numberWithCommas(sumFeb)));
		$('#sumMar').html(((sumMar == 0) ? '-' : numberWithCommas(sumMar)));
		$('#sumApr').html(((sumApr == 0) ? '-' : numberWithCommas(sumApr)));
		$('#sumMay').html(((sumMay == 0) ? '-' : numberWithCommas(sumMay)));
		$('#sumJun').html(((sumJun == 0) ? '-' : numberWithCommas(sumJun)));
		$('#sumJul').html(((sumJul == 0) ? '-' : numberWithCommas(sumJul)));
		$('#sumAug').html(((sumAug == 0) ? '-' : numberWithCommas(sumAug)));
		$('#sumSep').html(((sumSep == 0) ? '-' : numberWithCommas(sumSep)));
		$('#sumOct').html(((sumOct == 0) ? '-' : numberWithCommas(sumOct)));
		$('#sumNov').html(((sumNov == 0) ? '-' : numberWithCommas(sumNov)));
		$('#sumDec').html(((sumDec == 0) ? '-' : numberWithCommas(sumDec)));

		$('#tb-result').show();
		//}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadTableProfit() { 
	$('#tb-result_profit').hide();
	$.post('https://api.remaxthailand.co.th/sale/monthlyProfitOfYear_table', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		year: $('#selectYear').val(),
		brand: brandUrl,
		notbrand: $('#excluseWk:checked').val()
	}, function (data) {
		//if (data.success) {
		if (typeof data.result != 'undefined') {
			var values = data.result;
			if (values.length > 0) {
				storage.set('monthlyProfitOfYear_table', JSON.stringify(values));
			}
		}

		json = storage.get('monthlyProfitOfYear_table');
		var sumJan = 0;
		var sumFeb = 0;
		var sumMar = 0;
		var sumApr = 0;
		var sumMay = 0;
		var sumJun = 0;
		var sumJul = 0;
		var sumAug = 0;
		var sumSep = 0;
		var sumOct = 0;
		var sumNov = 0;
		var sumDec = 0;
		$('#tb-result_profit tbody').html('');
		for (i = 0; i < json.length; i++) {
			var result = json[i];
			var html = '<tr><td class="text-right" valign="middle" >' + result.memberType + '</td>';
			html += '<td width="100" class="sumJan_profit text-right" valign="middle" data-val= ' + result.jan + '>' + ((result.jan == 0) ? '-' : numberWithCommas(result.jan)) + '</td>';
			html += '<td width="100" class="sumFeb_profit text-right" valign="middle" data-val= ' + result.feb + '>' + ((result.feb == 0) ? '-' : numberWithCommas(result.feb)) + '</td>';
			html += '<td width="100" class="sumMar_profit text-right" valign="middle" data-val= ' + result.mar + '>' + ((result.mar == 0) ? '-' : numberWithCommas(result.mar)) + '</td>';
			html += '<td width="100" class="sumApr_profit text-right" valign="middle" data-val= ' + result.apr + '>' + ((result.apr == 0) ? '-' : numberWithCommas(result.apr)) + '</td>';
			html += '<td width="100" class="sumMay_profit text-right" valign="middle" data-val= ' + result.may + '>' + ((result.may == 0) ? '-' : numberWithCommas(result.may)) + '</td>';
			html += '<td width="100" class="sumJun_profit text-right" valign="middle" data-val= ' + result.jun + '>' + ((result.jun == 0) ? '-' : numberWithCommas(result.jun)) + '</td>';
			html += '<td width="100" class="sumJul_profit text-right" valign="middle" data-val= ' + result.jul + '>' + ((result.jul == 0) ? '-' : numberWithCommas(result.jul)) + '</td>';
			html += '<td width="100" class="sumAug_profit text-right" valign="middle" data-val= ' + result.aug + '>' + ((result.aug == 0) ? '-' : numberWithCommas(result.aug)) + '</td>';
			html += '<td width="100" class="sumSep_profit text-right" valign="middle" data-val= ' + result.sep + '>' + ((result.sep == 0) ? '-' : numberWithCommas(result.sep)) + '</td>';
			html += '<td width="100" class="sumOct_profit text-right" valign="middle" data-val= ' + result.oct + '>' + ((result.oct == 0) ? '-' : numberWithCommas(result.oct)) + '</td>';
			html += '<td width="100" class="sumNov_profit text-right" valign="middle" data-val= ' + result.nov + '>' + ((result.nov == 0) ? '-' : numberWithCommas(result.nov)) + '</td>';
			html += '<td width="100" class="sumDec_profit text-right" valign="middle" data-val= ' + result.dec + '>' + ((result.dec == 0) ? '-' : numberWithCommas(result.dec)) + '</td>';
			html += '</tr>';

			sumJan += result.jan;
			sumFeb += result.feb;
			sumMar += result.mar;
			sumApr += result.apr;
			sumMay += result.may;
			sumJun += result.jun;
			sumJul += result.jul;
			sumAug += result.aug;
			sumSep += result.sep;
			sumOct += result.oct;
			sumNov += result.nov;
			sumDec += result.dec;

			$('#tb-result_profit tbody').append(html);

		}

		$('#sumJan_profit').html(((sumJan == 0) ? '-' : numberWithCommas(sumJan)));
		$('#sumFeb_profit').html(((sumFeb == 0) ? '-' : numberWithCommas(sumFeb)));
		$('#sumMar_profit').html(((sumMar == 0) ? '-' : numberWithCommas(sumMar)));
		$('#sumApr_profit').html(((sumApr == 0) ? '-' : numberWithCommas(sumApr)));
		$('#sumMay_profit').html(((sumMay == 0) ? '-' : numberWithCommas(sumMay)));
		$('#sumJun_profit').html(((sumJun == 0) ? '-' : numberWithCommas(sumJun)));
		$('#sumJul_profit').html(((sumJul == 0) ? '-' : numberWithCommas(sumJul)));
		$('#sumAug_profit').html(((sumAug == 0) ? '-' : numberWithCommas(sumAug)));
		$('#sumSep_profit').html(((sumSep == 0) ? '-' : numberWithCommas(sumSep)));
		$('#sumOct_profit').html(((sumOct == 0) ? '-' : numberWithCommas(sumOct)));
		$('#sumNov_profit').html(((sumNov == 0) ? '-' : numberWithCommas(sumNov)));
		$('#sumDec_profit').html(((sumDec == 0) ? '-' : numberWithCommas(sumDec)));

		$('#tb-result_profit').show();
		//}
	}, 'json').fail(function (xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}