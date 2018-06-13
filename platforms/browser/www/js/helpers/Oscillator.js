define([], function () {
	var Oscillator = function (size, paperScope, em, Config, color) {
		var paper = paperScope,
			Rectangle = paper.Rectangle,
            Path = paper.Path,
            Point = paper.Point,
            Size = paper.Size,
            view = paper.view,
		    angle,
			marker,
			blinker,
			center,
			phase,
		    angles = [],
		    y_values = [],
		    RESOLUTION = Config.RESOLUTION;

		var layer = new paper.Layer();

        for(i = 0; i < RESOLUTION; i = i + 1){
            angle = 360 * i / RESOLUTION;
            angles[i] = angle;
            y_values[i] = - (.9 * size.height / 2) * Math.sin(2 * Math.PI * angle / 360);
        }

        var bg = new Path.Rectangle({
        	fillColor: "white",
        	strokeColor: "grey",
        	strokeWidth: 3,
        	size: size
        });

		var x_axis = new Path.Line({
				from: bg.bounds.leftCenter,
				to: bg.bounds.rightCenter,
				strokeColor: 'black',
				opacity: .2
			});

		marker = new Path.Circle({
			center: new Point(bg.position.x, bg.position.y),
			radius: 9,
			fillColor: color,
			strokeColor: 'black',
			strokeWidth: 2
		});

		blinker = new Path.Circle({
			center: new Point(bg.position.x, bg.position.y + y_values[RESOLUTION / 4]),
			radius: 15,
			fillColor: color,
			strokeColor: 'black',
			strokeWidth: 3
		});
		
		return {
			updatePhase: function (phase) {
				marker.position.y = center.y + y_values[phase];
				if (Math.abs(phase - RESOLUTION / 4) <= 2) {
					blinker.visible = true;
				} else {
					blinker.visible = false;
				}
			},

			setColor: function(color) {
				marker.fillColor = color;
				blinker.fillColor = color;
			},

			moveCenterTo: function (point) {
				center = point;
				layer.position.x = point.x;
				layer.position.y = point.y;
			}
		};
	};
	return Oscillator;
});