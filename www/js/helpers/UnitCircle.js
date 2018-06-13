/*global define, console */
define([], function () {
    'use strict';
    var UnitCircle = function (size, paperScope, em, Config) {
        var paper = paperScope,
            Point = paper.Point,
            Path = paper.Path,
            Group = paper.Group,
            currentAngle = 0,
            RESOLUTION = Config.RESOLUTION,
            angles = [],
            circlePOINTS = [],
            circleToContainerRatio = 0.9,
            layer = new paper.Layer(),
            highlight,
            popup = new Path.Rectangle({
                fillColor: 'white',
                strokeColor: 'grey',
                strokeWidth: 3,
                point: new Point(),
                size: size
            }),
            unitCircleOutline = new Path.Circle({
                center: popup.bounds.center,
                radius: circleToContainerRatio * size.width / 2,
                strokeColor: 'black',
                fillColor: 'white'
            }),
            newPoint,
            angle,
            i;

        for (i = 0; i < 64; i = i + 1) {
            newPoint = new Point({
                x: unitCircleOutline.bounds.rightCenter.x,
                y: unitCircleOutline.position.y
            }).rotate(5.625 * i, unitCircleOutline.position);
            circlePOINTS.push(newPoint);
            Path.Circle({
                radius: 2,
                center: newPoint,
                fillColor: i % 4 === 0 ? 'black' : 'grey'
            });
        }

        // X and Y axes
        var x_axis = Path.Line({
            from: unitCircleOutline.bounds.topCenter,
            to: unitCircleOutline.bounds.bottomCenter,
            strokeColor: 'black',
            strokeWidth: 2
        });
        var y_axis = Path.Line({
            from: unitCircleOutline.bounds.leftCenter,
            to: unitCircleOutline.bounds.rightCenter,
            strokeColor: 'black',
            strokeWidth: 2
        });

        return {

            getCenter: function() {
                return unitCircleOutline.bounds.center;
            },

            getRadius: function() {
                return circleToContainerRatio * size.width / 2;
            },

            highlight: function(phase1, phase2) {
                if(highlight){
                    highlight.remove();
                }
                if(phase1 !== phase2){
                    var a1 = phase1 * 2 * Math.PI / RESOLUTION;
                    var x1 = 50 * Math.cos(a1);
                    var y1 = 50 * Math.sin(a1);

                    var a2 = phase2 * 2 * Math.PI / RESOLUTION;
                    var x2 = 50 * Math.cos(a2);
                    var y2 = 50 * Math.sin(a2);
                    
                    var dPhi = Math.abs((phase1 - phase2) * 2 * Math.PI / RESOLUTION);
                    var aHalf = a1 + dPhi / 2;
                    var xHalf = 50 * Math.cos(aHalf);
                    var yHalf = 50 * Math.sin(aHalf);

                    var P1 = new Point(unitCircleOutline.bounds.center.x + x1, unitCircleOutline.bounds.center.y - y1);
                    var P2 = new Point(unitCircleOutline.bounds.center.x + x2, unitCircleOutline.bounds.center.y - y2);
                    var pMiddle = new Point(unitCircleOutline.bounds.center.x + xHalf, unitCircleOutline.bounds.center.y - yHalf);

                    highlight = new Path.Arc(P1, pMiddle, P2);
                    highlight.strokeColor = 'grey';
                    highlight.strokeWidth = 10;
                    highlight.opacity = .7;
                }
            },

            hide: function () {
                layer.visible = false;
            },

            show: function () {
                layer.visible = true;
            },

            moveTopLeftTo: function (point) {
                layer.position.x = point.x + layer.bounds.width / 2;
                layer.position.y = point.y + layer.bounds.height / 2;
            },

            moveLeftCenterTo: function (point) {
                layer.position.x = point.x + layer.bounds.width / 2;
                layer.position.y = point.y;
            }
        };
    };
    return UnitCircle;
});