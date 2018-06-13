define([], function () {
	var WaveOverlay = function(size, paperScope, em, Config) {
		var paper = paperScope,
            Point = paper.Point,
            Group = paper.Group,
            Size = paper.Size,
            Path = paper.Path,
			POINTS = Config.POINTS,
			layer = new paper.Layer(),
			members = 3,
			colors = ['red', 'orange', 'green', 'blue', 'purple', 'black', 'gray', 'yellow'],
			selectionBox,
			layer,
			dragging,
			bg;

		function drawBoxes() {
			var boxWidth = size.width / POINTS;

			bg = Path.Rectangle({
				fillColor: 'black',
				opacity: 0,
				point: new Point(),
				size: new Size(boxWidth, size.height)
			});

			for (var i = 0; i < POINTS; i++) {
				var point = new Point(boxWidth * i, 0);
				var box = new Path.Rectangle({
					fillColor: 'white',
					opacity: .1,
					strokeColor: 'black',
					point: point,
					size: new Size(boxWidth, size.height)
				});

				var color = colors[i % members];
				// var owner = new Path.Rectangle({
				// 	point: new Point(boxWidth * (i + .1), - size.height * .035),
				// 	size: new Size(boxWidth * .8, size.height / 40),
				// 	fillColor: color
				// });

				box.onMouseMove = function (x) {
					return function(event) {
						if(dragging) {
							selectBox(x);
						}
					}
				}(i);
				box.onMouseDown = function (x) {
					return function(event) {
						if(dragging) {
							selectBox(x);
						}
					}
				}(i);
			}
			var x_axis = new Path.Line({
				from: new Point({x: 0, y: size.height / 2}),
				to: new Point({x: size.width, y: size.height / 2}),
				strokeColor: 'black',
				opacity: .1
			});
		}

		function selectBox(x) {

		}

		drawBoxes();

		return {
			
			moveCenterTo: function (point) {
				layer.position.x = point.x;
				layer.position.y = point.y - ((layer.bounds.height - bg.bounds.height) / 2);
			}
		};
	};
	return WaveOverlay;
});