// function AmplitudeSlider() {
        //     var AMPLITUDE = view.bounds.height / 3,
        //         MAX_AMPLITUDE = view.bounds.height / 2,
        //         range = MAX_AMPLITUDE,
        //         fraction = AMPLITUDE / range,
        //         layer = new paper.Layer(),
        //         start = new Point(view.bounds.rightCenter.x - 180, view.bounds.bottomCenter.y - 360),
        //         finish = new Point(view.bounds.rightCenter.x - 180, view.bounds.bottomCenter.y - 600),
        //         line = new Path.Line({
        //             from: start,
        //             to: finish,
        //             strokeWidth: 3,
        //             strokeColor: 'black'
        //         }),
        //         dot = new Path.Circle({
        //             center: new Point(view.bounds.rightCenter.x - 180, view.bounds.bottomCenter.y - 360),
        //             radius: 8,
        //             fillColor: 'black'
        //         }),
        //         hitbox = new Path.Circle({
        //             center: new Point(view.bounds.rightCenter.x - 180, view.bounds.bottomCenter.y - 360),
        //             radius: 20,
        //             fillColor: 'white',
        //             opacity: 0
        //         }),
        //         indicator = new PointText({
        //             x: dot.position.x + 25,
        //             y: dot.position.y
        //         }),
        //         group = new Group(dot, hitbox, indicator);

        //     function setAmplitude(a) {
        //         AMPLITUDE = a;
        //         fraction = AMPLITUDE / range;
        //         indicator.content = (AMPLITUDE / (view.bounds.height / 12)).toFixed(1);
        //         group.position.y = line.segments[0].point.y + (fraction * (line.segments[1].point.y - line.segments[0].point.y));
        //     }

        //     // Oscillator.app.getController('EventManager').subscribe('massdrag', this);

        //     indicator.content = (AMPLITUDE / (view.bounds.height / 12)).toFixed(1);
        //     indicator.style = {
        //         fontSize: 20,
        //         fillColor: 'black',
        //         justification: 'center'
        //     };

        //     group.position.y = line.segments[0].point.y + (fraction * (line.segments[1].point.y - line.segments[0].point.y));
        //     group.onMouseDrag = function (event) {
        //         var frac,
        //             val;

        //         group.position.y = event.point.y;
        //         if (event.point.y < line.segments[1].point.y) {
        //             group.position.y = line.segments[1].point.y;
        //         }
        //         if (event.point.y > line.segments[0].point.y) {
        //             group.position.y = line.segments[0].point.y;
        //         }

        //         frac = (group.position.y - line.segments[0].point.y) / (line.segments[1].point.y - line.segments[0].point.y);
        //         val = 1 + Math.round(frac * range);
        //         AMPLITUDE = val;
        //         indicator.content = (AMPLITUDE / (view.bounds.height / 12)).toFixed(1);
        //         indicator.position.y = dot.position.y;
        //         // Oscillator.app.getController('EventManager').publish({type: 'amplitudechange', amplitude: value});
        //     };

        //     return {
        //         notify: function (event) {
        //             if (event.type === 'massdrag') {
        //                 this.setAmplitude(event.amplitude);
        //             }
        //         },

        //         hide: function () {
        //             layer.visible = false;
        //         },

        //         show: function () {
        //             layer.visible = true;
        //         }
        //     };
        // }