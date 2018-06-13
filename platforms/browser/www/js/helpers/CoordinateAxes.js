define([], function () {
	var CoordinateAxes = function(size, paperScope, em, Config) {
		var paper = paperScope,
	        Point = paper.Point,
	        Size = paper.Size,
	        Path = paper.Path,
	        Group = paper.Group,
	        PointText = paper.PointText,
		    extra = 10,
			POINTS = Config.POINTS,
			boxWidth = size.width / POINTS,
			box;

		var layer = new paper.Layer();
		
		var y_axis = new Path.Rectangle({
			fillColor: 'black',
			strokeColor: 'black',
			strokeWidth: 2,
			size: new Size(2, size.height)
		});
		var x_axis = new Path.Rectangle({
			fillColor: 'black',
			strokeColor: 'black',
			strokeWidth: 2,
			size: new Size(size.width, 2)
		});

		function align() {
			x_axis.position.x = y_axis.position.x + x_axis.bounds.width/2;
			x_axis.position.y = y_axis.bounds.center.y + x_axis.bounds.height/2;
		}
		align();
		var axes = new Group(x_axis, y_axis);

		return {
			alignOriginTo: function(point){
				axes.bounds.leftCenter.x = point.x;
				axes.bounds.leftCenter.y = point.y;
			},

			notify: function(event) {
				if (event.type == 'axesshow') {
					layer.visible = event.visible;
				}
			}
		};
	};
	return CoordinateAxes;
});