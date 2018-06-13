/*global define */
define([], function () {
    'use strict';
    var VerticalRuler = function (size, paperScope, orientation) {
        var paper = paperScope,
            Point = paper.Point,
            Size = paper.Size,
            Path = paper.Path,
            Group = paper.Group,
            PointText = paper.PointText,
            rulerLayer = new paper.Layer(),
            quarterUnitWidth = size.height / 42,
            wood = new Path.Rectangle({
                fillColor: '#d2b48c',
                strokeColor: 'black',
                strokeWidth: 2,
                size: new Size(size.width, size.height)
            }),
            text,
            rulerGroup = new Group(wood),
            endpoint,
            i;

        for (i = 0; i < 41; i = i + 1) {
            if (i % 2 === 0) {
                if (i % 4 === 0) {
                    endpoint = wood.bounds.leftCenter.x + size.width / 2;
                    text = rulerGroup.addChild(new PointText({
                        x: endpoint + size.width / 4,
                        y: size.width / 7 + (i + 1) * quarterUnitWidth + wood.bounds.topLeft.y
                    }));
                    text.content = i / 4;
                    text.style = {
                        fontSize: 5 * size.width / 13,
                        fillColor: 'black',
                        justification: 'center'
                    };
                } else {
                    endpoint = wood.bounds.leftCenter.x + size.width / 5;
                }
            } else {
                endpoint = wood.bounds.leftCenter.x + size.width / 3;
            }
            rulerGroup.addChild(new Path.Line({
                from: new Point({
                    x: wood.bounds.bottomLeft.x,
                    y: (i + 1) * quarterUnitWidth + wood.bounds.topLeft.y
                }),
                to: new Point({
                    x: endpoint,
                    y: (i + 1) * quarterUnitWidth + wood.bounds.topLeft.y
                }),
                strokeWidth: 2,
                strokeColor: 'black'
            }));
        }

        return {
            moveTopLeftTo: function (point) {
                rulerLayer.position.x = point.x + rulerLayer.bounds.width / 2;
                rulerLayer.position.y = point.y + rulerLayer.bounds.height / 2;
            },

            moveLeftCenterTo: function (point) {
                rulerLayer.position.x = point.x + rulerLayer.bounds.width / 2;
                rulerLayer.position.y = point.y;
            }
        };
    };
    return VerticalRuler;
});