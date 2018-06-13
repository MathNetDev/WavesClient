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
            popup = new Path.Rectangle({
                fillColor: 'white',
                strokeColor: 'black',
                point: new Point(),
                size: size
            }),
            unitCircleOutline = new Path.Circle({
                center: popup.bounds.center,
                radius: circleToContainerRatio * size.width / 2,
                strokeColor: 'black',
                fillColor: 'white'
            }),
            arrow,
            newPoint,
            angle,
            i;

        function normalAngleToPaperAngle(normalAngle) {
            if (normalAngle > 180) {
                normalAngle -= 360;
            }
            normalAngle = -normalAngle;

            return normalAngle;
        }

        function paperToNormalAngle(paperAngle) {
            var normalAngle = -paperAngle;
            if (normalAngle < 0) {
                normalAngle += 360;
            }
            return normalAngle;
        }

        function rotateTo(normalAngle) {
            angle = normalAngleToPaperAngle(normalAngle);
            arrow.rotate(angle - currentAngle, unitCircleOutline.bounds.center);
            currentAngle = angle;
        }

        function rotateToPaperAngle(paperAngle) {
            arrow.rotate(paperAngle - currentAngle, unitCircleOutline.bounds.center);
            currentAngle = paperAngle;
        }

        function startEdit() {
            arrow.onMouseDrag = function (event) {
                var phase,
                    normalAngle,
                    vec = new Point({
                        x: event.point.x - unitCircleOutline.position.x,
                        y: event.point.y - unitCircleOutline.position.y
                    });

                rotateToPaperAngle(vec.angle);

                normalAngle = paperToNormalAngle(vec.angle);
                phase = Math.round(RESOLUTION * normalAngle / 360) % RESOLUTION;
                em.publish({type: 'unitcircleedit', phase: phase});
            };
            arrow.onMouseUp = function (event) {
                var vec = new Point({
                    x: event.point.x - unitCircleOutline.position.x,
                    y: event.point.y - unitCircleOutline.position.y
                });
                var normalAngle = paperToNormalAngle(vec.angle);
                var phase = Math.round(RESOLUTION * normalAngle / 360) % RESOLUTION;
                em.publish({type: 'finalucedit', phase: phase});
            } 
        }

        function stopEdit() {
            arrow.onMouseDrag = null;
        }

        for (i = 0; i < RESOLUTION; i = i + 1) {
            angle = 360 * i / RESOLUTION;
            angles[i] = angle;
        }

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
        Path.Line({
            from: unitCircleOutline.bounds.topCenter,
            to: unitCircleOutline.bounds.bottomCenter,
            strokeColor: 'black',
            strokeWidth: 2
        });
        Path.Line({
            from: unitCircleOutline.bounds.leftCenter,
            to: unitCircleOutline.bounds.rightCenter,
            strokeColor: 'black',
            strokeWidth: 2
        });

        arrow = new Group([
            new Path.Circle({
                center: unitCircleOutline.bounds.rightCenter,
                radius: size.width / 12,
                fillColor: 'white',
                opacity: 0
            }),
            new Path.Line({
                from: unitCircleOutline.bounds.center,
                to: unitCircleOutline.bounds.rightCenter,
                strokeColor: 'red',
                strokeWidth: 2
            }),
            new Path.Circle({
                center: unitCircleOutline.bounds.rightCenter,
                radius: size.width / 60,
                fillColor: 'red'
            })
        ]);

        return {
            playPause: function (event) {
                if (event.state === 'pause') {
                    startEdit();
                } else {
                    stopEdit();
                }
            },

            updatePhase: function (phase) {
                if (phase !== null) {
                    rotateTo(angles[phase % RESOLUTION]); // angles[newPhase] is 0 to 360...
                }
            },

            getCenter: function() {
                return unitCircleOutline.bounds.center;
            },

            getRadius: function() {
                return circleToContainerRatio * size.width / 2;
            },

            rotateTo: function(angle) {
                rotateTo(angle);
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