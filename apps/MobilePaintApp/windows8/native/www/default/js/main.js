
/* JavaScript content from js/main.js in folder common */
function paintFunction(opt)
{(function() {
	
	var canvas = document.querySelector('#paint');
	var ctx = canvas.getContext('2d');
	
	var sketch = document.querySelector('#sketch');
	var sketch_style = getComputedStyle(sketch);
	canvas.width = parseInt(sketch_style.getPropertyValue('width'));
	canvas.height = parseInt(sketch_style.getPropertyValue('height'));
	
	
	// Creating a tmp canvas
	var tmp_canvas = document.createElement('canvas');
	var tmp_ctx = tmp_canvas.getContext('2d');
	tmp_canvas.id = 'tmp_canvas';
	tmp_canvas.width = canvas.width;
	tmp_canvas.height = canvas.height;
	
	sketch.appendChild(tmp_canvas);

	var mouse = {x: 0, y: 0};
	var start_mouse = {x: 0, y: 0};
	
	
	/* Mouse Capturing Work */
	tmp_canvas.addEventListener('mousemove', function(e) {
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	}, false);
	
	
	/* Drawing on Paint App */
	tmp_ctx.lineWidth = 5;
	tmp_ctx.lineJoin = 'round';
	tmp_ctx.lineCap = 'round';
	tmp_ctx.strokeStyle = 'blue';
	tmp_ctx.fillStyle = 'blue';
	
	tmp_canvas.addEventListener('mousedown', function(e) {
		tmp_canvas.addEventListener('mousemove', onPaint, false);
		
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
		
		start_mouse.x = mouse.x;
		start_mouse.y = mouse.y;
		
		onPaint();
	}, false);
	
	tmp_canvas.addEventListener('mouseup', function() {
		tmp_canvas.removeEventListener('mousemove', onPaint, false);
		
		// Writing down to real canvas now
		ctx.drawImage(tmp_canvas, 0, 0);
		// Clearing tmp canvas
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		
	}, false);
	
	switch(opt)
	{
		case 1:
			var onPaint = function() {
				tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);				
				var x = Math.min(mouse.x, start_mouse.x);
				var y = Math.min(mouse.y, start_mouse.y);
				var width = Math.abs(mouse.x - start_mouse.x);
				var height = Math.abs(mouse.y - start_mouse.y);
				tmp_ctx.strokeRect(x, y, width, height);				
			};
		break;
		
		case 2:
			var onPaint = function() {
				tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);		
				tmp_ctx.beginPath();
				tmp_ctx.moveTo(start_mouse.x, start_mouse.y);
				tmp_ctx.lineTo(mouse.x, mouse.y);
				tmp_ctx.stroke();
				tmp_ctx.closePath();		
			};
		break;
		
		case 3:
			var onPaint = function() {
				tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);		
				var x = (mouse.x + start_mouse.x) / 2;
				var y = (mouse.y + start_mouse.y) / 2;
				
				var radius = Math.max(
					Math.abs(mouse.x - start_mouse.x),
					Math.abs(mouse.y - start_mouse.y)
				) / 2;
				
				tmp_ctx.beginPath();
				tmp_ctx.arc(x, y, radius, 0, Math.PI*2, false);
				tmp_ctx.stroke();
				tmp_ctx.closePath();		
			};
		break;
	}
	
}());
}

function saveFunction(){
window.open(document.getElementById('paint').toDataURL("image/png"));
}