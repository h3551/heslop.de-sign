window.onload = function () {
	'use strict';
	var canvas = document.getElementById('world'),
    context = true,
		make3DPoint = function (x, y, z) {
			var point = {};
			point.x = x;
			point.y = y;
			point.z = z;
			return point;
		},
		object = [
			make3DPoint(-50, -50, -50),
		  make3DPoint(-50, 50, -50),
			make3DPoint(-50, 50, 50),
			make3DPoint(50, 50, 50),
			make3DPoint(50, 50, -50),
			make3DPoint(50, -50, -50),
			make3DPoint(50, -50, 50),
			make3DPoint(-50, -50, 50)
		],
		cubeAxisRotations = make3DPoint(0, 0, 0),
		focalLength = 300;
	
	function drawBackground(color) {
		context.fillStyle = 'transparent';
		context.fillRect(0, 0, canvas.width, canvas.height);
	}
	
	function clearCanvas() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();
	}
	function transform3dTo2DPoints(points, axisRotations) {
		var transformedPointsArray = [],
			sx = Math.sin(axisRotations.x),
			cx = Math.cos(axisRotations.x),
			sy = Math.sin(axisRotations.y),
			cy = Math.cos(axisRotations.y),
			sz = Math.sin(axisRotations.z),
			cz = Math.cos(axisRotations.z),
			x,
			y,
			z,
			xy,
			xz,
			yx,
			yz,
			zx,
			zy,
			scaleFactor,
			i = points.length;
		
		function make2DPoint(x, y, depth, scaleFactor) {
			var point = {};
		
		// Nullpunkt in die Mitte setzen
			point.x = x + (canvas.width / 2);
			point.y = y + (canvas.height / 2);
			point.depth = depth;
			point.scaleFactor = scaleFactor;
			return point;
		}
		while (i--) {
			x = points[i].x;
			y = points[i].y;
			z = points[i].z;

			// Rotation um x
			xy = cx * y - sx * z;
			xz = sx * y + cx * z;
			
			// Rotation um y
			yz = cy * xz - sy * x;
			yx = sy * xz + cy * x;
			
			// Rotation um z
			zx = cz * yx - sz * xy;
			zy = sz * yx + cz * xy;

			scaleFactor = focalLength / (focalLength + yz);
			x = zx * scaleFactor;
			y = zy * scaleFactor;
			z = yz;

			transformedPointsArray[i] = make2DPoint(x, y, -z, scaleFactor);
		}
		
		return transformedPointsArray;
	}
	function drawLine(start, end, color) {
		// color || (color = "#333");
		color = 'dodgerblue';
		
		// Linie
		context.beginPath();
		context.moveTo(start.x, start.y);
		context.lineTo(end.x, end.y);
		
		// Linien zeichnen
		context.strokeStyle = color;
		context.stroke();
	}
	function drawTetra() {
		var points = transform3dTo2DPoints(object, cubeAxisRotations);
		drawLine(points[0], points[7]);
		drawLine(points[1], points[0]);
		drawLine(points[2], points[1]);
		drawLine(points[2], points[7]);
	}
	function drawCube() {
		var points = transform3dTo2DPoints(object, cubeAxisRotations);
		drawLine(points[0], points[1]);
		drawLine(points[0], points[5]);
		drawLine(points[1], points[2]);
		drawLine(points[1], points[4]);
		drawLine(points[2], points[3]);
		drawLine(points[2], points[7]);
		drawLine(points[3], points[4]);
		drawLine(points[3], points[6]);
		drawLine(points[4], points[3]);
		drawLine(points[4], points[1]);
		drawLine(points[5], points[4]);
		drawLine(points[5], points[6]);
		drawLine(points[6], points[7]);
		drawLine(points[0], points[7]);
	}
	function animate() {
		var interval = setInterval(function () {
			cubeAxisRotations.x += 0.01;
			cubeAxisRotations.y -= 0.005;
			clearCanvas();
			drawCube();
			//drawTetra();
		}, 32);
	}
	
	
	
	function init() {
		if (canvas && canvas.getContext) {
			context = canvas.getContext('2d');
			drawBackground();
			animate();
		}
	}
	init();
};