define([], function () {
	var MediaControls =  function MediaControls(size, paperScope, em) {
		var paper = paperScope,
	        Point = paper.Point,
	        Size = paper.Size,
	        Path = paper.Path,
	        Group = paper.Group,
	        Rectangle = paper.Rectangle,
	        Raster = paper.Raster,
	        PointText = paper.PointText,
		    layer = new paper.Layer();
	    var disabled = false;
	    var isPlay = true;
		var rectangle = new Rectangle(size);
		var cornerSize = new Size(20, 20);
		var bg = new Path.RoundRectangle(rectangle, cornerSize);

		bg.fillColor = '#cdcdcd';
		bg.strokeColor = 'black';

		var pausePlayBtn = new Group([
			new Raster('play').scale(.50).set({visible: !isPlay}),
			new Raster('pause').scale(.5).set({visible: isPlay})
		]);

		var randomBtn = new Group([
			new Path.Circle({
				radius: 30,
				fillColor: 'red',
				opacity: 1,
				strokeColor: 'black',
				strokeWidth: 2
			}),
			new PointText({
				content: '?',
				style: {
					fontSize: 50,
					fillColor: 'white',
					justification: 'center'
				}
			}).set({position: new Point(0, 5)})
		]);

		var resetBtn = new Group([
			new Raster('reset').scale(.5)
		]);

		pausePlayBtn.position = new Point(rectangle.width/6, rectangle.height/2);
		pausePlayBtn.addChild(new Path.Rectangle({
			point: rectangle.topLeft,
			size: new Size(rectangle.width/3, rectangle.height),
			fillColor: 'white',
			opacity: 0
		}));
		randomBtn.position = new Point(rectangle.width/2, rectangle.height/2);
		resetBtn.position = new Point(5*rectangle.width/6, rectangle.height/2);
		resetBtn.addChild(new Path.Rectangle({
			point: new Point(2*rectangle.width/3, 0),
			size: new Size(rectangle.width/3, rectangle.height),
			fillColor: 'white',
			opacity: 0
		}));

		pausePlayBtn.onMouseDown = function() {
			var newState = isPlay ? 'pause' : 'play';
			isPlay = !isPlay;
			pausePlayBtn.children[0].visible = !isPlay;
			pausePlayBtn.children[1].visible = isPlay;

			em.publish({type: 'playpause', state: newState});
		};

		randomBtn.onMouseDown = function() {
			em.publish({type: 'help'});
		}

		resetBtn.onMouseDown = function() {
			em.publish({type: 'reset'});
		}

		return {
			moveTopLeftTo: function(point){
				layer.position.x = point.x + layer.bounds.width/2;
				layer.position.y = point.y + layer.bounds.height/2;
			},

			moveBottomRightTo: function(point){
				layer.position.x = point.x - layer.bounds.width/2;
				layer.position.y = point.y - layer.bounds.height/2;
			},

			moveTopCenterTo: function(point){
				layer.position.x = point.x;
				layer.position.y = point.y + layer.bounds.height/2;
			},

			show: function() {
				layer.visible = true;
			},

			hide: function() {
				layer.visible = false;
			}
		};
	};
	return MediaControls;
});