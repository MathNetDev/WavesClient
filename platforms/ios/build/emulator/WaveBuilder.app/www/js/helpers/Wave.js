/*global define */
define([], function () {
	var Wave = function (size, paperScope, em, Config) {
		var paper = paperScope,
            Path = paper.Path,
            Point = paper.Point,
            Size = paper.Size,
            view = paper.view,
            Group = paper.Group,
		    Messager = em;
		var POINTS = Config.POINTS,
			direction = Config.DIRECTION,
			wavelength = Config.WAVELENGTH,
			frequency = Config.FREQUENCY,
			RESOLUTION = Config.RESOLUTION,
			layer,
			wavePath,
			waveSize = size,
			phases = [],
			initialPhases = [],
			markers = [],
			angles = [], // 0 to 360
            y_values = [];

		function initializePath() {
			var i, 
				angle,
				boxWidth = waveSize.width / POINTS;

	        for(i = 0; i < RESOLUTION; i = i + 1){
	            angle = 360 * i / RESOLUTION;
	            angles[i] = angle;
	            y_values[i] = - (waveSize.height / 2) * Math.sin(2 * Math.PI * angle / 360);
	        }
			
			wavePath = new Path();
			wavePath.fillColor = Config.COLOR;
			wavePath.segments = [];

			wavePath.add(new Point({
				x: 0,
				y: waveSize.height / 2
			}));

			wavePath.add(new Point({
				x: - boxWidth/2,
				y: 0
			}));
			
			for(var i = 0; i < POINTS; i++) {
				var point = new Point((boxWidth * i) + (boxWidth/2), 0);
				wavePath.add(point);
			}

			wavePath.add(new Point({
				x: waveSize.width + boxWidth/2,
				y: 0
			}));

			wavePath.add(new Point({
				x: waveSize.width + boxWidth/2,
				y: waveSize.height / 2
			}));	
		}

		function setSine() {
			var newPhase;
			for (var i = 0; i < POINTS + 2; i++) {
				if(direction == 'left') {
					newPhase = Math.round(RESOLUTION * (i % wavelength) / wavelength) % RESOLUTION;
				} else {
					newPhase = Math.round(RESOLUTION * (1 -  (i % wavelength) / wavelength) ) % RESOLUTION;
				}

				phases[i] = newPhase;
				initialPhases[i] = newPhase;
				wavePath.segments[i+1].point.y = y_values[newPhase];
			}
			updateMarkers();
			em.publish({type: 'waveupdate'});
		}

		function setFlat() {
			for (var i = 0; i < POINTS + 2; i++) {
				phases[i] = 0;
				initialPhases[i] = 0;
				wavePath.segments[i+1].point.y = y_values[0];
			}
			updateMarkers();
			em.publish({type: 'waveupdate'});			
		}

		function setPhases(newPhases) {
			for (var i = 0; i < POINTS + 2; i++) {
				phases[i] = newPhases[i]; 
				wavePath.segments[i+1].point.y = y_values[newPhases[i]];
			}
			updateMarkers();
			em.publish({type: 'waveupdate'});
		}

		function makeMarkers() {
			for (var i = 0; i < POINTS; i++) {
				var marker = new Group([
					Path.Circle({
						center: wavePath.segments[i+2].point,
						radius: 10,
						fillColor: 'black'
					}),
					Path.Circle({
						center: wavePath.segments[i+2].point,
						radius: 8,
						fillColor: 'black'
					}),
					Path.Circle({
						center: wavePath.segments[i+2].point,
						radius: 12,
						fillColor: 'black',
						visible: false,
						strokeColor: 'black',
						strokeWidth: 3
					})
				]);
				markers.push(marker);
			}
		}

		function updateMarkers() {
			if(markers.length > 0){
				for (var i = 0; i < POINTS; i++) {
					markers[i].position = wavePath.segments[i+2].point;
				}
			}
		}

		function increment() {
			for (var i = 0; i < POINTS + 2; i++) {
				phases[i] = (phases[i] + frequency) % RESOLUTION;
				wavePath.segments[i+1].point.y = y_values[phases[i]];
				if (i > 0 && i < POINTS + 1) {
					if(markers.length > 0){
						markers[i-1].position.y = y_values[phases[i]];
						if(Math.abs(phases[i] - RESOLUTION / 4) < 3){
							markers[i-1].children[2].visible = true;
						} else {
							markers[i-1].children[2].visible = false;
						}
					}
				}
			}
			//updateMarkers();
			em.publish({type: 'waveupdate'});
		}

		function editPhaseAtPoint(point, phase) {
			initialPhases[point+1] = phase;
			
			phases[point + 1] = phase;
			var y = y_values[phase];
			wavePath.segments[point + 2].point.y = y;
			markers[point].position.y = y;
			em.publish({type: 'waveupdate'});
		}

		layer = new paper.Layer();

        initializePath();
        if (Config.mode === "build" || Config.mode === "collab") {
        	setFlat();
        } else {
        	setSine();
        }
        makeMarkers();

		return {
			tick: function (event) {			
				increment();
			},

			setFrequency: function (event) {
				frequency = event.frequency;
			},

			setWavelength: function (event) {
				wavelength = event.wavelength;
				setSine();
			},

			setDirection: function (event) {
				direction = event.direction;
				setSine();
			},

			playPause: function (event) {
				if (Config.mode === "build" || Config.mode === "collab") {
					setPhases(initialPhases);
				}
			},

			editPhaseAtPoint: function (event) {
				editPhaseAtPoint(event.point, event.phase);
			},

			getPhaseAtPoint: function(i) {
				return phases[i+1];
			},

			setInitialPhases: function (newPhases) {
				var i;
				for (i = 0; i < newPhases.length; i = i + 1) {
					initialPhases[i] = newPhases[i];
				}
			},

			getInitialPhases: function() {
				return initialPhases;
			},

			setMarkerColor: function(i, color) {
				markers[i].children[1].fillColor = color;
				markers[i].children[2].fillColor = color;
			},

			getZeroX: function () {
				return wavePath.segments[0].point.x;
			},

			moveCenterTo: function (point) {
				layer.position.x = point.x;
				layer.position.y = point.y;

				var i, angle;
	        	for(i = 0; i < RESOLUTION; i = i + 1){
	            	angle = 360 * i / RESOLUTION;
	            	angles[i] = angle;
	            	y_values[i] = point.y - (waveSize.height / 2) * Math.sin(2 * Math.PI * angle / 360);
	        	}

	        	wavePath.segments[0].point.y = point.y + waveSize.height / 2;
	        	wavePath.segments[POINTS + 3].point.y = point.y + waveSize.height / 2;
			}
		};
	};
	return Wave;
});