define([], function(){
	
	var Legend = function (size, paperScope, em, colors){
		var members = [],
		    pairs = [],
		    paper = paperScope,
		    layer = new paper.Layer(),
		    Path = paper.Path,
		    Point = paper.Point,
		    PointText = paper.PointText,
		    Group = paper.Group,

		    bg = new Path.Rectangle({
	        	fillColor: "white",
	        	strokeColor: "grey",
	        	strokeWidth: 3,
	        	size: size
	        });

		function update(members) {
			for (var i = 0; i < pairs.length; i++) {
				pairs[i].remove();
			}
			
			for(var i = 0; i < members.length; i++) {				
				var indicator = new PointText();
				indicator.content = members[i];
				indicator.style = {
					fontSize: 20,
					fillColor: 'black',
					justification: 'left'
				};

				pairs[i] = new Group([
					indicator,
					new Path.Circle({
						center: new Point(bg.bounds.leftCenter.x + 30, 30 + bg.bounds.topCenter.y + 30 * i ),
						radius: 9,
						fillColor: colors[i % colors.length],
						strokeColor: 'black',
						strokeWidth: 2
					})
				]);
				indicator.position.x = pairs[i].children[1].position.x + 20 + indicator.bounds.width / 2;
				indicator.position.y = pairs[i].children[1].position.y;

			}
			paper.view.draw();
		}

		return {
		    show: function() {
				layer.visible = true;
			},

		    hide: function() {
			    layer.visible = false;
		    },

		    setMembers: function(members) {
		    	update(members);
		    },

		    moveCenterTo: function(point) {
		    	layer.position = point;
		    }
		};
	};
	return Legend;
});