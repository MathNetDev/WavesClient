define([], function () {
	var HorizontalRuler = function(size, paperScope, em, Config) {
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
		var wood = new Path.Rectangle({
			fillColor: '#d2b48c',
			strokeColor: 'black',
			strokeWidth: 2,
			size: new Size(2 * extra + (POINTS - 1) * boxWidth, 50)
		});
		
		var ruler = new Group(wood);
		var endpoint;
		function drawNumbers() {
			for (i=0; i<4*(POINTS-1)+ 1; i++){
				if (i%2 == 0){
					if (i%4 == 0) {
						endpoint = wood.bounds.leftCenter.y;
						var text = ruler.addChild(new PointText({
							x: extra + i * boxWidth/4 + wood.bounds.topLeft.x,
							y: endpoint + 12
						}));
						text.content = i/4;
						text.style = {
							fontSize: 12,
							fillColor: 'black',
							justification: 'center'
						};
					} else {
						endpoint = wood.bounds.leftCenter.y - 10;
					}
				} else {
					endpoint = wood.bounds.leftCenter.y - 15;
				}
				ruler.addChild(new Path.Line({
					from: new Point({
						x: extra + i * boxWidth/4 + wood.bounds.topLeft.x,
						y: wood.bounds.topLeft.y
					}),
					to: new Point({
						x: extra + i * boxWidth/4 + wood.bounds.topLeft.x,
						y: endpoint
					}),
					strokeWidth: 2,
					strokeColor: 'black'
				}));
			}
		}
		drawNumbers();

		return {
			alignTopCenterTo: function(point){
				ruler.position.x = point.x;
				ruler.position.y = point.y + ruler.bounds.height / 2;
			},

			highlight: function(x1, x2) {
				var size = new Size(boxWidth * Math.abs(x1 - x2), 10);
                if(box) {
                    box.remove();
                }
                box = Path.Rectangle({
                    fillColor: '#bc9055',
                    opacity: .7,
                    from: {
                        x: boxWidth * x1 + boxWidth / 2, 
                        y: wood.bounds.leftCenter.y + 2
                    },
                    to: {
                        x: boxWidth * x2 + boxWidth / 2,
                        y: wood.bounds.leftCenter.y + 15
                    }    
                });
			},

			notify: function(event) {
				if (event.type == 'rulershow') {
					layer.visible = event.visible;
				}
			}
		};
	};
	return HorizontalRuler;
});