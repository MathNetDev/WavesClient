/*global define */
define([], function () {
    'use strict';
    var StopWatch = function (size, paperScope, TICKINTERVAL) {
        var paper = paperScope,
            Point = paper.Point,
            Size = paper.Size,
            Path = paper.Path,
            Raster = paper.Raster,
            Group = paper.Group,
            PointText = paper.PointText,
            time = 0,
            state = 'zero',
            layer = new paper.Layer(),
            raster = new Raster('stopwatch'),
            lightToRasterRatio = 0.85,
            centerOffsetFraction = 0.08,
            hitBox = new Path.Rectangle({
                point: new Point(),
                size: new Size(size.width, size.height),
                fillColor: 'white',
                opacity: 0
            }),
            light = new Path.Circle({
                center: new Point(size.width / 2, size.height / 2 + size.height * centerOffsetFraction),
                radius: lightToRasterRatio * size.width / 2,
                strokeColor: 'red',
                strokeWidth: 5
            }),
            indicator = new PointText({
                x: size.width / 2,
                y: 7 * size.height / 8
            }),
            group = new Group(hitBox, indicator, light);

        function start() {
            state = 'running';
            light.strokeColor = 'green';
            time = 0;
        }

        function stop() {
            state = 'stopped';
            light.strokeColor = 'red';
        }

        function reset() {
            state = 'zero';
            time = 0;
            indicator.content = '0';
        }

        function toggleState() {
            if (state === 'zero') {
                start();
            } else if (state === 'running') {
                stop();
            } else if (state === 'stopped') {
                reset();
            }
        }

        function tick() {
            time = time + TICKINTERVAL;
            indicator.content = (time / 1000).toFixed(2);
        }

        function update() {
            if (state === 'running') {
                tick();
            }
        }

        raster.scale(size.width / raster.bounds.width);
        raster.position = new Point(size.width / 2, size.height / 2);

        indicator.content = '0';
        indicator.style = {
            fontSize: size.width / 5,
            fillColor: 'black',
            justification: 'center'
        };

        group.onMouseDown = function () {
            toggleState();
        };

        return {

            moveTopLeftTo: function (point) {
                layer.position.x = point.x + layer.bounds.width / 2;
                layer.position.y = point.y + layer.bounds.height / 2;
            },

            show: function () {
                layer.visible = true;
            },

            hide: function () {
                layer.visible = false;
            },

            tick: function () {
                update();
            }
        };
    };
    return StopWatch;
});