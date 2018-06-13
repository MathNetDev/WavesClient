define([], function () {
	var SelectionBox = function(size, paperScope, em, Config, color) {
		var paper = paperScope,
            Point = paper.Point,
            Group = paper.Group,
            Size = paper.Size,
            Path = paper.Path,
			POINTS = Config.POINTS,
			selectionBox,
			layer,
			dragging,
			bg,
			x = 0,
			boxWidth = size.width / POINTS;

		function drawBox() {
			
			layer = new paper.Layer();

			selectionBox = new Group([
				Path.Rectangle({
					strokeColor: color,
					strokeWidth: 3,
					point: new Point(x * boxWidth, 0),
					size: new Size(boxWidth, size.height)
				}),
				Path.Rectangle({
					fillColor: 'white',
					opacity: 0,
					strokeWidth: 3,
					point: new Point(x * boxWidth, 0),
					size: new Size(boxWidth, size.height)
				})
			]);
			selectionBox.onMouseDown = function (event) {
				dragging = true;
			};
			selectionBox.onMouseDrag = function (event) {
				if(dragging){
					var iPos = Math.round((selectionBox.position.x / boxWidth) - (1 / 2));
					selectionBox.position.x += event.delta.x;
					var fPos = Math.round((selectionBox.position.x / boxWidth) - (1 / 2))

					if(iPos !== fPos) {
						em.publish({type: "selectionupdate"});
					}
				}
				if(!selectionBox.contains(event.point)){
					dragging = false;
					x = selectionBox.position.x % boxWidth;
					selectionBox.position.x -= (x - boxWidth / 2);
					em.publish({type: "selectionupdate"});
				}
			};
			selectionBox.onMouseUp = function (event) {
				dragging = false;
				x = selectionBox.position.x % boxWidth;
				selectionBox.position.x -= (x - boxWidth / 2);
				em.publish({type: "selectionupdate"});
			};
		}

		drawBox();

		return {
			getIndex: function() {
				return Math.round((selectionBox.position.x / boxWidth) - (1 / 2));
			},

			setIndex: function(x) {
				layer.position.x = boxWidth * x + layer.bounds.width / 2;
			},

			moveLeftCenterTo: function (point) {
				layer.position.x = point.x + layer.bounds.width / 2;
				layer.position.y = point.y;
			}
		};
	};
	return SelectionBox;
});