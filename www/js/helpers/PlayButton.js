define([], function () {
	var PlayButton = function (size, paperScope, em) {
		var paper = paperScope,
            Rectangle = paper.Rectangle,
            Point = paper.Point,
            Size = paper.Size,
            Path = paper.Path,
            Raster = paper.Raster,
            Group = paper.Group,
            PointText = paper.PointText,
            layer = new paper.Layer(),
            isPlay = true,
            pauseBtn = new Raster('pause'),
            playBtn = new Raster('play'),
            pausePlayBtn = new Group([playBtn, pauseBtn]);

            pauseBtn.scale(size.width / pauseBtn.bounds.width).set({visible: isPlay});
        	playBtn.scale(size.width / playBtn.bounds.width).set({visible: isPlay});

	        pausePlayBtn.addChild(new Path.Rectangle({
	            point: playBtn.bounds.topLeft,
	            size: new Size(size.width, size.height),
	            fillColor: 'white',
	            opacity: 0
	        }));

	        pausePlayBtn.onMouseDown = function () {
	            var newState = isPlay ? 'pause' : 'play';
	            isPlay = !isPlay;
	            pausePlayBtn.children[0].visible = !isPlay;
	            pausePlayBtn.children[1].visible = isPlay;
	            em.publish({type: 'playpause', state: newState});
	        };
	
	        return {
	            moveTopLeftTo: function (point) {
	                layer.position.x = point.x + layer.bounds.width / 2;
	                layer.position.y = point.y + layer.bounds.height / 2;
	            },

	            moveBottomRightTo: function (point) {
	                layer.position.x = point.x - layer.bounds.width / 2;
	                layer.position.y = point.y - layer.bounds.height / 2;
	            },

	            moveTopCenterTo: function (point) {
	                layer.position.x = point.x;
	                layer.position.y = point.y + layer.bounds.height / 2;
	            },

	            show: function () {
	                layer.visible = true;
	            },

	            hide: function () {
	                layer.visible = false;
	            }
	        };
	};
	return PlayButton;
});