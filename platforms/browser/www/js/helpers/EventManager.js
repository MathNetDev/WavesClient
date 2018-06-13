/*global define, console */
define([], function () {
    'use strict';
    var EventManager = function () {

        var subscriptions = {};

        return {
            publish: function (event) {
                var i;
                if (subscriptions[event.type]) {
                    for (i = 0; i < subscriptions[event.type].length; i = i + 1) {
                        subscriptions[event.type][i](event);
                    }
                }
            },

            subscribe: function (eventType, subscriber) {
                if (subscriptions.hasOwnProperty(eventType)) {
                    subscriptions[eventType].push(subscriber);
                } else {
                    subscriptions[eventType] = [subscriber];
                }
            },

            unsubscribe: function (eventType, callback) {
                if (subscriptions.hasOwnProperty(eventType)) {
                    var index = subscriptions[eventType].indexOf(callback);
                    if (index > -1) {
                        subscriptions[eventType].splice(index, 1);
                    }
                }
            }
        };
    };
    return EventManager;
});