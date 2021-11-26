var count = 0;
var run=[];

function changeQty(rel,status){
	value = $('input#'+rel).val();
		if(status == 'plus'){
			var num = +$('input#'+rel).val() + 1;
			$('input#'+rel).val(num);
		} else {
			if(value > 1){
				var num = +$('input#'+rel).val() - 1;
				$('input#'+rel).val(value-1);
			}
		}
};

function draw(type){
	var el = document.getElementById('graph');
	var options = {
	    percent:  el.getAttribute('data-percent') || 25,
	    size: el.getAttribute('data-size') || 240,
	    lineWidth: el.getAttribute('data-line') || 1,
	    rotate: el.getAttribute('data-rotate') || 0,
	    color: el.getAttribute('data-color') || '#fff'
	}
	var canvas = document.createElement('canvas');
	var span = document.createElement('span');
	//span.textContent = options.percent + '%';
	if (typeof(G_vmlCanvasManager) !== 'undefined') {
	    G_vmlCanvasManager.initElement(canvas);
	}

	var ctx = canvas.getContext('2d');
	canvas.width = canvas.height = options.size;

	el.appendChild(span);
	el.appendChild(canvas);

	ctx.translate(options.size / 2, options.size / 2);
	ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); 

	var radius = (options.size - options.lineWidth) / 2;

	var drawCircle = function(color, lineWidth, percent) {
			percent = Math.min(Math.max(0, percent || 1), 1);
			ctx.beginPath();
			ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
			ctx.strokeStyle = color;
	        ctx.lineCap = 'round'; // butt, round or square
			ctx.lineWidth = lineWidth
			ctx.stroke();
	};

	
	if(type === 0) {
		drawCircle('#fff', options.lineWidth, 100 / 100);
	}
	if(type === 1) {
		drawCircle(options.color, options.lineWidth, 100 / 100);
		drawCircle('#fff', options.lineWidth, options.percent / 100);
	}
	if(type === 2) {
		drawCircle(options.color, options.lineWidth, 100 / 100);
		drawCircle('#fff', options.lineWidth, 0 / 100);
	}
}

$('#start').click(function(){
	var intervals=$('#intervals').val();
	var workout=$('#workout').val();
	var rest=$('#rest').val();
	for (i = 0; i < intervals; i++) { 
	  run.push(rest);
	  run.push(workout);
	}
	count = 0;
	draw(0);
	timer(run[0]);
	$('#set').hide();
	console.log(run);
	return false;
});

function timer(seconds) {
	var total = run.length;
  	var remaningTime = seconds;
  	var theSecs = run[count];

	start = setTimeout(function() {
		$('#run').removeClass('go');
		$('#run').removeClass('rest');
		if(seconds > 0)
			document.getElementById("timer").innerHTML=remaningTime;
		else
			document.getElementById("timer").innerHTML='';
		var test = (remaningTime/theSecs)*100;
		if (remaningTime > 0) {
			$('#graph').attr('data-percent',test);
			$('#graph').empty();
			draw(1);
			timer(remaningTime - 1); 
		}
		if (remaningTime <= 0) {
			$('#graph').attr('data-percent',100);
			$('#graph').empty();
			draw(0);
			count = count+1;
			timer(run[count]); 
		}
	}, 1000);
	if (count >= total) {
		document.getElementById("title").innerHTML="Finished";
		document.getElementById("timer").innerHTML= '';
		clearInterval(start);
		$('#graph').empty();
		$('#stop').trigger('click');
	} else if(count % 2 == 0){
		document.getElementById("title").innerHTML="Rest";
		$('#graph').attr('data-color','#512DA8');
		$('#run').addClass('rest');
	} else {
	  	document.getElementById("title").innerHTML="Go";
	  	$('#run').addClass('go');
	  	$('#graph').attr('data-color','#00C853');
	}
  
}

$('#stop').click(function(){
	clearInterval(start);
	run.length = 0;
	$('#set').show();
	document.getElementById("title").innerHTML="";
	$('#timer').empty();
	$('#graph').attr('data-percent',100);
	$('#graph').empty();
	draw(2);
	return false;
});