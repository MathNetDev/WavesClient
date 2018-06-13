define([], function(){
	
	var MembersList = function (size, paperScope){
		var paper = paperScope,
			Path = paper.Path,
			Point = paper.Point,
			Size = paper.Size,
			Group = paper.Group,
			PointText = paper.PointText,
			members = [],
		    pairs = [],
		    layer = new paper.Layer(),
		    colors = ['red', 'orange', 'green', 'blue', 'purple', 'black', 'gray', 'yellow']; 

		function update() {
			layer.visible = false;
			layer = new paper.Layer();
			var bg = new Path.Rectangle({
				point: new Point(),
				size: size,
				fillColor: 'grey'
			});
			console.log("members: " + members);
			for(var i = 0; i < members.length; i++) {
				var indicator = new PointText({
					x: 100 + 35 * i,
					y: 20
				});
				indicator.content = members[i];
				indicator.style = {
					fontSize: 20,
					fillColor: 'black',
					justification: 'left'
				};

				pairs[i] = new Group([
					indicator,
					new Path.Rectangle({
						point: new Point(100 + 35 * (i - members.length / 2), 23),
						size: new Size(50, 10),
						fillColor: colors[i % colors.length]
					})
				]);
				indicator.position.x = pairs[i].children[1].position.x;
			}
			paper.view.draw();
		}

		return {
			moveTopCenterTo: function(point) {
				layer.position.x = point.x;
			},

		    show: function() {
				layer.visible = true;
			},

		    hide: function() {
			    layer.visible = false;
		    },

		    getMembers: function() {
		    	console.log(members);
		    	return members;
		    },

		    memberJoin: function(event) {
		    	members.push(event.user);
		    	//update();
		    },

		    memberLeave: function(event) {
		    	var index = members.indexOf(event.user);
		    	if (index > -1) {
				    members.splice(index, 1);
				}
				// update();
		    	console.log(members);
		    }
		};
	};
	return MembersList;
});