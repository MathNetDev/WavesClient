/*global define */
define([], function () {
    'use strict';
    var MassSpring = function (size, paperScope, em, Config) {
        var paper = paperScope,
            Point = paper.Point,
            Size = paper.Size,
            Path = paper.Path,
            numPoints = 10,
            frequency = Config.FREQUENCY,
            RESOLUTION = Config.RESOLUTION,
            phase = RESOLUTION / 2,
            OFFSET = paper.view.bounds.center.y,
            MAX_AMPLITUDE = size.height / 2,
            AMPLITUDE = size.height / 3,
            springHalfWidth = size.width / 10,
            topSpringPoints = [],
            bottomSpringPoints = [],
            spring = [],
            spring2 = [],
            y_values = [],
            path1,
            path2,
            i,
            angle,
            layer = new paper.Layer(),
            mass = new Path.Rectangle({
                position: new Point(0, 0),
                fillColor: 'black',
                strokeColor: 'black',
                strokeWidth: 2,
                size: new Size(size.width, size.width)
            });

        function setAmplitude(a) {
            AMPLITUDE = a;
            phase = RESOLUTION / 4;
            for (i = 0; i < RESOLUTION; i = i + 1) {
                angle = 2 * Math.PI * i / RESOLUTION;
                y_values[i] = OFFSET - AMPLITUDE * Math.sin(angle);
            }
        }

        function updateSpringPoints(y) {
            var stretch = (OFFSET - y) / numPoints;
            for (i = 0; i < numPoints; i = i + 1) {
                topSpringPoints[i].y = OFFSET - i * stretch;
                bottomSpringPoints[i].y = OFFSET - i * stretch;

                if (i < numPoints - 2) {
                    spring[i].segments[0].point = topSpringPoints[i];
                    spring[i].segments[1].point = bottomSpringPoints[i + 1];
                    spring2[i].segments[0].point = bottomSpringPoints[i];
                    spring2[i].segments[1].point = topSpringPoints[i + 1];
                }
            }
        }

        function update() {
            var newY = y_values[phase];
            mass.position.y = newY;
            updateSpringPoints(newY);
            em.publish({type: 'phasechange', phase: phase});
        }

        function setPhase(p) {
            phase = p;
            update();
        }

        function increment() {
            phase = (phase + frequency) % RESOLUTION;
            update();
        }

        function startDrag() {
            mass.onMouseDrag = function (event) {
                mass.position.y += event.delta.y;
                if (mass.position.y > OFFSET + MAX_AMPLITUDE) {
                    mass.position.y = OFFSET + MAX_AMPLITUDE;
                } else if (mass.position.y < OFFSET - MAX_AMPLITUDE) {
                    mass.position.y = OFFSET - MAX_AMPLITUDE;
                }

                updateSpringPoints(mass.position.y);
                var amp = (mass.position.y - OFFSET);

                if (amp < 0) {
                    setAmplitude(-amp);
                    phase = RESOLUTION / 4;
                } else {
                    setAmplitude(amp);
                    phase = 3 * RESOLUTION / 4;
                }
                em.publish({type: 'phasechange', phase: phase});
            };
        }

        function stopDrag() {
            mass.onMouseDrag = null;
        }

        for (i = 0; i < RESOLUTION; i = i + 1) {
            angle = 2 * Math.PI * i / RESOLUTION;
            y_values[i] = OFFSET - AMPLITUDE * Math.sin(angle);
        }

        for (i = 0; i < numPoints; i = i + 1) {
            topSpringPoints.push(new Point(mass.position.x + springHalfWidth, MAX_AMPLITUDE));
            bottomSpringPoints.push(new Point(mass.position.x - springHalfWidth, MAX_AMPLITUDE));

            path1 = new Path({
                strokeColor: 'black',
                strokeWidth: 3
            });
            path1.add(new Point(0, MAX_AMPLITUDE), new Point(0, MAX_AMPLITUDE));

            path2 = new Path({
                strokeColor: 'black',
                strokeWidth: 3
            });
            path2.add(new Point(0, MAX_AMPLITUDE), new Point(0, MAX_AMPLITUDE));

            spring.push(path1);
            spring2.push(path2);
        }

        return {
            moveTopLeftTo: function (point) {
                layer.position.x = point.x + layer.bounds.width / 2;
                layer.position.y = point.y + layer.bounds.height / 2;

                for (i = 0; i < numPoints; i = i + 1) {
                    topSpringPoints[i].x = point.x + springHalfWidth + layer.bounds.width / 2;
                    bottomSpringPoints[i].x = point.x - springHalfWidth + layer.bounds.width / 2;
                }
            },

            notify: function (event) {
                if (event.type === 'phaseedit') {
                    setPhase(event.phase);
                } else if (event.type === 'frequencychange') {
                    frequency = event.frequency;
                } else if (event.type === 'tick') {
                    increment();
                } else if (event.type === 'amplitudechange') {
                    setAmplitude(event.amplitude);
                } else if (event.type === 'playpause') {
                    if (event.state === 'play') {
                        stopDrag();
                    } else {
                        startDrag();
                    }
                }
            }
        };
    };
    return MassSpring;
});