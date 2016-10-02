
function main() {

  	var canvas = document.getElementById('webgl');
	var gl = getWebGLContext(canvas);
	

	if (!gl){
		console.log('Failed to find context');
	}
	
	var size = prompt("Enter the size ", "");
	var tapCoordinates = [];
	var tapColors = [];
	document.getElementById('clear').addEventListener('click', function() 
	{

	tapCoordinates = [];
	tapColors = [];

	render(gl, a_Position, u_FragColor, tapCoordinates, tapColors,a_PointSize,size);
    }, false);
	canvas.onmousedown = function(ev) {click(ev, gl, canvas, a_Position, u_FragColor, tapCoordinates, tapColors,a_PointSize,size );};
	
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram (program);
	gl.program = program;

	var a_Position = gl.getAttribLocation(program, 'a_Position');
	if (a_Position < 0) { 
		console.log ("Failed to Get Position"); 
		return;	
	}
	var a_PointSize = gl.getAttribLocation(program, 'a_PointSize');
	if (a_PointSize < 0) { 
		console.log ("Failed to Get Size"); 
		return;	
	}


	var u_FragColor = gl.getUniformLocation(program, 'u_FragColor');
	if (u_FragColor < 0) { 
		console.log ("Failed to Get Color"); 
		return;	
	}
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
}

function click(ev, gl, canvas, a_Position, u_FragColor, tapCoordinates, tapColors,a_PointSize,size){
	var x = ev.clientX; // x coordinate of a mouse pointer
	var y = ev.clientY; // y coordinate of a mouse pointer
	var rect = ev.target.getBoundingClientRect();

	x = -(((x - rect.left) - canvas.height/2)/(canvas.height/2));
	y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);
	// Store the coordinates to g_points array
	
	tapCoordinates.push([x, y]);

	//Top Right Quadrant
	if((x >= 0) && (y >= 0))
	{
		console.log("1");
		tapColors.push([0.0, 1.0, 0.0, 1.0]);	
	}
	//Top Left Quadrant
	else if((x < 0) && (y >= 0))
	{
		tapColors.push([0.0, 0.0, 1.0, 1.0]);	
	}
	//Bottom Right Quadrant
	else if((x > 0) && (y < 0))
	{
		tapColors.push([1.0, 1.0, 0.0, 1.0]);	
	}
	//Bottom Left Quadrant
	else if((x < 0) && (y < 0))
	{
		tapColors.push([1.0, 0.0, 0.0, 1.0]);	
	}  
	else
	{
		console.log("Error");
	}
	
	render(gl, a_Position, u_FragColor, tapCoordinates, tapColors,a_PointSize,size);
}

function render (gl, a_Position, u_FragColor, tapCoordinates, tapColors,a_PointSize,size){
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	
	var len = tapCoordinates.length;
	for (var i = 0; i < len; i+=1){
		var loc = tapCoordinates[i];
		var col = tapColors[i];
		gl.vertexAttrib3f(a_Position, loc[0], loc[1], 1.0);
		gl.vertexAttrib1f(a_PointSize,size);
		gl.uniform4f(u_FragColor, col[0], col[1], col[2], col[3]);
		gl.drawArrays(gl.Points, 0, 1);	
	}
	
}
	 
	
