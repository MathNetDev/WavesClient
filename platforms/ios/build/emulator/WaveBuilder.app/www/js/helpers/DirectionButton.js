define([], function () {
	var DirectionButton = function (size, paperScope, em, Config) {
		var paper = paperScope,
            Point = paper.Point,
            Size = paper.Size;
            Path = paper.Path,
            Group = paper.Group,
            PointText = paper.PointText,
			layer = new paper.Layer();

		layer.visible = true;

		var btn = new Path.Rectangle({
			point: new Point(),
			size: new Size(size.width, size.height),
			fillColor: '#206BA4',
			strokeColor: 'black',
			strokeWidth: 2
		});

		var indicator = new PointText({
			x: btn.bounds.center.x,
			y: btn.bounds.center.y + size.height / 4
		});
		indicator.content = '<--';
		indicator.style = {
			fontSize: size.height,
			fillColor: 'white',
			justification: 'center'
		};
		var dir = Config.DIRECTION;
		var hitbox = new Path.Rectangle({
			point: new Point(),
			size: new Size(size.width, size.height),
			fillColor: 'white',
			opacity: 0
		});

		var group = new Group(btn, indicator, hitbox);

		group.onMouseDown = function(){
			if(dir == 'left') {
				dir = 'right';
				indicator.content = '-->'
			} else {
				dir = 'left';
				indicator.content = '<--'
			}
			em.publish({type: 'directionchange', direction: dir})
		}

		return {
			show: function() {
				layer.visible = true;
			},

			hide: function() {
				layer.visible = false;
			},

			moveTopLeftTo: function(point){
				layer.position.x = point.x + layer.bounds.width / 2;
				layer.position.y = point.y + layer.bounds.height / 2;
			}
		};
	};
	return DirectionButton;
});