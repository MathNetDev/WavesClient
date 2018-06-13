/*global define */
define([], function () {
    'use strict';
    var FrequencySlider = function (size, paperScope, em, Config) {
        var paper = paperScope,
            Point = paper.Point,
            Path = paper.Path,
            Group = paper.Group,
            PointText = paper.PointText,
            range = (20 - 1),
            FREQUENCY = Config.FREQUENCY,
            f = (FREQUENCY - 1) / range,
            layer = new paper.Layer(),
            start = new Point(0, 0),
            finish = new Point(0, -size.height),
            line = new Path.Line({
                from: start,
                to: finish,
                strokeWidth: 3,
                strokeColor: 'black'
            }),
            dot = new Path.Circle({
                center: new Point(0, 0),
                radius: size.width / 4,
                fillColor: 'black'
            }),
            hitbox = new Path.Circle({
                center: new Point(0, 0),
                radius: size.width,
                fillColor: 'white',
                opacity: 0
            }),
            indicator = new PointText({
                x: dot.position.x + size.width,
                y: dot.position.y
            }),
            group = new Group(dot, hitbox, indicator);

        indicator.content = (Config.TICKINTERVAL * Config.RESOLUTION / (FREQUENCY * 1000)).toFixed(2);
        indicator.style = {
            fontSize: size.width / 2,
            fillColor: 'black',
            justification: 'center'
        };
        indicator.position.y = dot.position.y;

        group.position.y = line.segments[0].point.y + (f * (line.segments[1].point.y - line.segments[0].point.y));

        group.onMouseDrag = function (event) {
            var fraction,
                val;

            group.position.y = event.point.y;
            if (event.point.y < line.segments[1].point.y) {
                group.position.y = line.segments[1].point.y;
            }
            if (event.point.y > line.segments[0].point.y) {
                group.position.y = line.segments[0].point.y;
            }

            fraction = (line.segments[1].point.y - group.position.y) / (line.segments[1].point.y - line.segments[0].point.y);
            val = 1 + Math.round(fraction * range);
            indicator.content = (Config.TICKINTERVAL * Config.RESOLUTION / (val * 1000)).toFixed(2);
            indicator.position.y = dot.position.y;
            em.publish({type: 'frequencychange', frequency: val});
        };

        return {
            hide: function () {
                layer.visible = false;
            },

            show: function () {
                layer.visible = true;
            },

            moveTopLeftTo: function (point) {
                layer.position.x = point.x + layer.bounds.width / 2;
                layer.position.y = point.y + layer.bounds.height / 2;
            }
        };
    };
    return FrequencySlider;
});