/*global define, alert */
define([], function () {
    'use strict';
    var MediaControls = function (size, paperScope, em) {
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
            rectangle = new Rectangle(new Point(0, 0), new Point(size.width, size.height)),
            cornerSize = new Size(size.width / 8, size.width / 8),
            mc_bg = new Path.RoundRectangle(rectangle, cornerSize),
            pauseBtn = new Raster('pause'),
            playBtn = new Raster('play'),
            btnRSize = 5 / 12,
            pausePlayBtn = new Group([playBtn, pauseBtn]),
            helpBtn;

        mc_bg.fillColor = '#cdcdcd';
        mc_bg.strokeColor = 'black';

        pauseBtn.scale(btnRSize * size.width / pauseBtn.bounds.width).set({visible: isPlay});
        playBtn.scale(btnRSize * size.width / playBtn.bounds.width).set({visible: isPlay});

        helpBtn = new Group([
            new Path.Circle({
                radius: playBtn.bounds.width / 2,
                fillColor: 'red',
                opacity: 1,
                strokeColor: 'black',
                strokeWidth: 2
            }),
            new PointText({
                content: '?',
                style: {
                    fontSize: 5 * playBtn.bounds.width / 6,
                    fillColor: 'white',
                    justification: 'center'
                }
            }).set({position: new Point(0, 5)})
        ]);

        helpBtn.position = new Point(3 * rectangle.width / 4, rectangle.height / 2);
        pausePlayBtn.position = new Point(rectangle.width / 4, rectangle.height / 2);
        pausePlayBtn.addChild(new Path.Rectangle({
            point: rectangle.topLeft,
            size: new Size(rectangle.width / 2, rectangle.height),
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

        helpBtn.onMouseDown = function () {
            alert("Things you can do: Use the sliders to change the amplitude and period of oscillation.  Use the unit circle to adjust the phase of the oscillator.  Drag and release the mass to start the mass oscillating from rest.");
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
    return MediaControls;
});