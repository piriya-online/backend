var monthEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var monthEnFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var monthlyCategoryData = {}
var monthlyCategorySelected = '';
var monthlyProductCategoryData = {}
var monthlyProductData = {}


$(function() {
	$('.sidebar-toggle').click();
	google.charts.load('current', {'packages':['bar','corechart']});

	loadMonth();
	
	$(window).scroll(function(){
		var a = $('#scroll-top').find('a');
		if ($(this).scrollTop() > 250) {		
			a.fadeIn(200);
		} else {
			a.fadeOut(200);
		}
    });
	
	$('#scroll-top').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 1000);
        return false;
    });
	
	$(document).on('change', '#selectMonth', function(){
		loadMonthlySaleByProductData();
	});
	
	$(document).on('change', '#selectCategory', function(){
		monthlyCategorySelected = $('#selectCategory').val();
		renderMonthlySaleByProductChart();
	});

});

function loadMonth(){
	$.post('https://api.remaxthailand.co.th/sale/dataMonthInSell', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C'
	}, function(data){
		if (data.success) {			
			for( i=0; i<data.result.length; i++ ) {
				var result = data.result[i];
				$('#selectMonth').append('<option value='+result.yearNo+' data-month="'+result.monthNo+'">'+monthEnFull[result.monthNo-1]+' '+result.yearNo+'</option>');
			}
			loadMonthlySaleByProductData();
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadMonthlySaleByProductData() {
	$.post('https://api.remaxthailand.co.th/sale/monthlySaleByProduct', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		year: $('#selectMonth').val(),
		month: $('#selectMonth option:selected').data('month'),
	}, function(data) {
		if (data.success) {
			$('#selectCategory option').remove();
			if (monthlyCategorySelected == '') monthlyCategorySelected = data.result[0][0].id;
			for(i=0; i<data.result[0].length; i++){
				var result = data.result[0][i];
				$('#selectCategory').append('<option value='+result.id+((result.id == monthlyCategorySelected) ? ' selected' : '')+'>'+result.name+'</option>');
				monthlyProductData[result.id] = {};
				monthlyCategoryData[''+result.id] = result.name;
			}
			monthlyCategorySelected = $('#selectCategory').val();
			for(i=0; i<data.result[1].length; i++){
				var result = data.result[1][i];
				monthlyProductData[result.category][result.id] = {};
				monthlyProductData[result.category][result.id].name = result.name;
				monthlyProductData[result.category][result.id].qty = result.qty;
				monthlyProductData[result.category][result.id].profit = result.profit;
				monthlyProductData[result.category][result.id].price = result.price;
			}
			renderMonthlySaleByProductChart();
		}
	}, 'json');
}


function renderMonthlySaleByProductChart() {
	var chartData = new Array();
	chartData.push(new Array(' ', 'Total Sales', 'Total Quantity', 'Name', 'Average Profit'));
	monthlyProductCategoryData = {};
	$.each(monthlyProductData[$('#selectCategory').val()], function(i, val) {
		chartData.push(new Array('', val.price, val.qty, val.name, parseFloat((val.profit/val.qty).toFixed(2)) ));
		monthlyProductCategoryData[val.name] = i;
	});
	google.charts.setOnLoadCallback(function () {
		var data = google.visualization.arrayToDataTable(chartData);
		var options = {
			title: 'Correlation between Sales, Quantity and Profit of '+$('#selectCategory option:selected').text() + ' ('+$('#selectMonth option:selected').text()+')',
			vAxis: {
				viewWindow: {
					min:0
				}
			},
			hAxis: {title: 'Total Sales'},
			vAxis: {title: 'Total Quantity'},
			legend: {position: 'none'},
		};
		var chart = new google.visualization.BubbleChart(document.getElementById('div-monthlySaleByProductChart'));
		google.visualization.events.addListener(chart, 'select', function(){
			var selectedItem = chart.getSelection()[0];
			if (selectedItem) {
				loadProductHistoryData( monthlyProductCategoryData[data.getValue(selectedItem.row, 3)], data.getValue(selectedItem.row, 3) );
			}
		});
		chart.draw(data, options);
	});
}

function loadProductHistoryData( product, name ) {
	$.post('https://api.remaxthailand.co.th/sale/monthlySaleByProductHistory', {
		apiKey: 'F85FA9B2-1473-4CEA-82A9-AB3966C9AD0C',
		product: product,
	}, function(data) {
		if (data.success) {
			var chartData = new Array();
			chartData.push(new Array('Month', 'Cost', 'Profit', 'Quantity'));
			for(i=0; i<data.result.length; i++){
				var result = data.result[i];
				chartData.push(new Array( monthEn[result.monthNo-1]+' '+result.yearNo, result.price-result.profit, result.profit, result.qty ));
			}

			google.charts.setOnLoadCallback(function () {
				var data = google.visualization.arrayToDataTable(chartData);
				var options = {
					title: 'Total Sales Detail of '+name+' Chart',
					bars: 'vertical',
					vAxis: {format: 'decimal'},
					bar: { groupWidth: "50%" },
					series:[
						{targetAxisIndex:0},
						{targetAxisIndex:0},
						{targetAxisIndex:1, type: 'line'},
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
				var chart = new google.visualization.ComboChart(document.getElementById('div-monthlySaleByProductHistoryChart'));	
				chart.draw(data, options);
			});
		}
	}, 'json');
}
