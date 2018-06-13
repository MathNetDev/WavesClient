/*global define, console */
define([], function () {
    'use strict';
    var PhaseArrow = function (size, paperScope, em, Config, center, radius, color) {
        var paper = paperScope,
            Point = paper.Point,
            Path = paper.Path,
            Group = paper.Group,
            currentAngle = 0,
            RESOLUTION = Config.RESOLUTION,
            tool1 = new paperScope.Tool(),
            layer = new paper.Layer(),
            blinker,
            angles = [],
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
            arrow.rotate(angle - currentAngle, center);
            currentAngle = angle;
        }

        function rotateToPaperAngle(paperAngle) {
            arrow.rotate(paperAngle - currentAngle, center);
            currentAngle = paperAngle;
        }

        function startEdit() {
            arrow.onMouseDrag = function (event) {
                var phase,
                    normalAngle,
                    vec = new Point({
                        x: event.point.x - center.x,
                        y: event.point.y - center.y
                    });

                rotateToPaperAngle(vec.angle);

                normalAngle = paperToNormalAngle(vec.angle);
                phase = Math.round(RESOLUTION * normalAngle / 360) % RESOLUTION;
                em.publish({type: 'phasearrowedit', id: color, phase: phase});
            
                tool1.activate();
                tool1.onMouseUp = function() {
                    var vec = new Point({
                        x: event.point.x - center.x,
                        y: event.point.y - center.y
                    });
                    var normalAngle = paperToNormalAngle(vec.angle);
                    var phase = Math.round(RESOLUTION * normalAngle / 360) % RESOLUTION;
                    em.publish({type: 'finalucedit', id: color, phase: phase});
                    tool1.onMouseUp = null;
                }
            };
        }

        function stopEdit() {
            arrow.onMouseDrag = null;
        }

        for (i = 0; i < RESOLUTION; i = i + 1) {
            angle = 360 * i / RESOLUTION;
            angles[i] = angle;
        }
        
        blinker =  new Path.Circle({
            center: {
                x: center.x + radius,
                y: center.y
            },
            radius: 15,
            fillColor: color,
            strokeColor: 'black',
            strokeWidth: 3
        });

        arrow = new Group([
            new Path.Circle({
                center: {
                    x: center.x + radius,
                    y: center.y
                },
                radius: 30,
                fillColor: 'white',
                opacity: 0
            }),
            new Path.Line({
                from: center,
                to: {
                    x: center.x + radius,
                    y: center.y
                },
                strokeColor: color,
                strokeWidth: 2
            }),
            new Path.Circle({
                center: {
                    x: center.x + radius,
                    y: center.y
                },
                radius: 9,
                fillColor: color,
                strokeColor: 'black',
                strokeWidth: 2
            }),
            blinker
        ]);

        return {
            startEdit: function () {
                startEdit();
            },

            stopEdit: function() {
                stopEdit();
            },

            updatePhase: function (phase) {
                if (phase !== null) {
                    rotateTo(angles[phase % RESOLUTION]); // angles[newPhase] is 0 to 360...
                    if (Math.abs(phase - RESOLUTION / 4) <= 2) {
                        blinker.visible = true;
                    } else {
                        blinker.visible = false;
                    }
                }
            },

            rotateTo: function(angle) {
                rotateTo(angle);
            },

            setCenter: function(newCenter) {
                center = newCenter;
                layer.position.x = center.x + layer.bounds.width / 2;
                layer.position.y = center.y;
            },

            hide: function () {
                layer.visible = false;
            },

            show: function () {
                layer.visible = true;
            },

            setColor: function(color) {
                blinker.fillColor = color;
                arrow.children[1].strokeColor = color;
                arrow.children[2].fillColor = color;
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
    return PhaseArrow;
});