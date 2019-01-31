$(function() {

	loadRegisterInfo();
	loadWeeklyRegister();
	loadMonthlyOrder();

	$('#exportExl').click(function() {
			exportExl();
			return false;
	});
});

function loadMonthlyOrder(){
	$.post($('#apiUrl').val()+'/member/statistic/monthly_order', {
		shop: 1,
	}, function(data){
			if (data.success && data.correct) {
				//var html = '';
				$('#tb-order tbody').html('');
				for( i=0; i<data.result.length; i++ ) {					
					var result = data.result[i];
					var html = '<tr><td class="text-left hidden">'+result.id+'</td>'					
					html += '<td><i class="fa fa-home pointer i-popover" data-toggle="popover" data-placement="right" data-content="'+result.address+'"></i> ';
					html += (result.mobile != null && result.mobile != undefined) ? '<i class="fa fa-phone-square pointer i-popover" data-toggle="popover" data-placement="right" data-content="'+result.mobile.substr(0,3)+'-'+result.mobile.substr(3,4)+'-'+result.mobile.substr(7)+'"></i> ' : '';
					html += result.name;
					html += '<span id="compositebar-'+result.id+'" class="compositebar pull-right">'+result.price3+','+result.price2+','+result.price1+','+result.price0+'</span></td>';
					html += '<td class="hidden">'+result.shopName+'</td>';
					html += '<td class="hidden">'+''+'</td>';
					html += '<td class="hidden">'+result.idType+'</td>';
					html += '<td class="hidden">'+result.region+'</td>';
					html += '<td class="hidden">'+result.province+'</td>';
					html += '<td class="hidden">'+ ((result.mobile != null && result.mobile != undefined) ? result.mobile.substr(0,3)+'-'+result.mobile.substr(3,4)+'-'+result.mobile.substr(7) : '') +'</td>';
					html += '<td class="text-center">'+result.sellPrice+'</td>';
					html += '<td class="text-right">'+((result.price3 == 0) ? '-' : numberWithCommas(result.price3))+'</td>';
					html += '<td class="text-right">'+((result.bill3 == 0) ? '-' : numberWithCommas(result.bill3))+'</td>';
					html += '<td class="text-right">'+((result.price2 == 0) ? '-' : numberWithCommas(result.price2))+'</td>';
					html += '<td class="text-right">'+((result.bill2 == 0) ? '-' : numberWithCommas(result.bill2))+'</td>';
					html += '<td class="text-right font-bold text-info">'+((result.price1 == 0) ? '-' : numberWithCommas(result.price1))+'</td>';
					html += '<td class="text-right">'+((result.bill1 == 0) ? '-' : numberWithCommas(result.bill1))+'</td>';
					html += '<td class="text-right font-bold text-green">'+((result.price0 == 0) ? '-' : numberWithCommas(result.price0))+'</td>';
					html += '<td class="text-right">'+((result.bill0 == 0) ? '-' : numberWithCommas(result.bill0))+'</td>';
					$('#tb-order tbody').append( html );
					$('#compositebar-'+result.id).sparkline('html', {type: 'bar', barColor: '#7f94ff'});
					$('#compositebar-'+result.id).sparkline([result.bill3, result.bill2, result.bill1, result.bill0],{composite: true, fillColor: false, lineColor: '#505050'});
				}
				$('.i-popover').popover({trigger: 'hover'});

			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadRegisterInfo(){
	$.post($('#apiUrl').val()+'/member/dealer/register_info', {
		shop: 1,
	}, function(data){
			if (data.success && data.correct) {
				$('.sp-registerAll').html( numberWithCommas(data.result[0].registerAll) );
				$('.sp-registerThisMonth').html( numberWithCommas(data.result[0].registerThisMonth) );
				$('.sp-activeAll').html( numberWithCommas(data.result[0].activeAll) );
				$('.sp-activeThisMonth').html( numberWithCommas(data.result[0].activeThisMonth) );
				var percent = data.result[0].activeThisMonth/data.result[0].activeAll*100;
				$('#chart-register').val( numberWithCommas((percent)) );
				$('.sp-register_percent').html( numberWithCommas((percent)) );
				generateChart();
				$('#chart-register').parent().parent().show();

				Morris.Donut({
					element: 'province-chart',
					resize: true,
					colors: ["#888888", "#3c8dbc", "#f56954"],
					data: [
						{label: $('#msg-unknown').val(), value: data.result[0].addressUnknow},
						{label: $('#msg-bangkok').val(), value: data.result[0].addressBangkok},
						{label: $('#msg-upcountry').val(), value: data.result[0].registerAll-data.result[0].addressBangkok-data.result[0].addressUnknow}
					],
					hideHover: 'auto',
				});

			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadWeeklyRegister(){
	$.post($('#apiUrl').val()+'/member/statistic/weekly_register', {
		shop: 1,
		memberType: 'dealer',
		week: 22,
	}, function(data){
			if (data.success && data.correct) {

                var line = new Morris.Area({
                    element: 'line-chart',
                    resize: true,
                    data: data.result,
                    xkey: 'index',
                    ykeys: ['register'],
                    labels: [$('#msg-register').val()],
                    lineColors: ['#a0d0e0'],
                    hideHover: 'auto',
					hoverCallback: function(index, options, content, row) {
						return((row.date != '') ? '<b>'+row.date+'</b><br>'+$('#msg-register').val()+' <b>'+row.register+'</b>' : '0');
					},
                });

			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function generateChart(){
	$(".knob").knob({
		draw: function() {
			if (this.$.data('skin') == 'tron') {

				var a = this.angle(this.cv)  // Angle
						, sa = this.startAngle          // Previous start angle
						, sat = this.startAngle         // Start angle
						, ea                            // Previous end angle
						, eat = sat + a                 // End angle
						, r = true;

				this.g.lineWidth = this.lineWidth;

				this.o.cursor
						&& (sat = eat - 0.3)
						&& (eat = eat + 0.3);

				if (this.o.displayPrevious) {
					ea = this.startAngle + this.angle(this.value);
					this.o.cursor
							&& (sa = ea - 0.3)
							&& (ea = ea + 0.3);
					this.g.beginPath();
					this.g.strokeStyle = this.previousColor;
					this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
					this.g.stroke();
				}

				this.g.beginPath();
				this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
				this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
				this.g.stroke();

				this.g.lineWidth = 2;
				this.g.beginPath();
				this.g.strokeStyle = this.o.fgColor;
				this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
				this.g.stroke();

				return false;
			}
		}
	});
}

function exportExl(){
	$(".table2excel").table2excel({
		exclude: ".noExl",
		name: "Excel Document Name",
		filename: "Order Information Monthly",
		fileext: ".xls",
		exclude_img: true,
		exclude_links: true,
		exclude_inputs: true
	});
}
