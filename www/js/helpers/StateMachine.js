/*global define, console */
define([], function () {
    'use strict';
    var StateMachine = function () {
        var currentState = -1,
            stateNames = [],
            stateCallbacks = [];

        return {
            current: function () {
                if (currentState >= 0) {
                    return stateNames[currentState];
                }
            },
            add: function (name, onEnter, onExit) {
                var index = stateNames.indexOf(name);
                if (index !== -1) {
                    throw "State " + name + " already exists!";
                }
                stateCallbacks.push({
                    enterState: onEnter || false,
                    exitState: onExit || false
                });
                stateNames.push(name);
            },
            remove: function (name) {
                var index = stateNames.indexOf(name);
                if (index === -1) {
                    throw "State " + name + " not found!";
                }
                stateNames.splice(index, 1);
                stateCallbacks.splice(index, 1);
            },
            enter: function (name) {
                var index = stateNames.indexOf(name);
                if (index === -1) {
                    console.log("state not found");
                    throw "State " + name + " not found!";
                }
                if (stateCallbacks[currentState] && stateCallbacks[currentState].exitState) {
                    stateCallbacks[currentState].exitState();
                }
                currentState = index;
                if (stateCallbacks[index].enterState) {
                    stateCallbacks[index].enterState();
                }
            },
            exit: function () {
                if (currentState === -1) {
                    throw "Not currently in any state";
                }
                if (stateCallbacks[currentState].exitState) {
                    stateCallbacks[currentState].exitState();
                }
                currentState = -1;
            },
            next: function () {
                this.enter(stateNames[currentState + 1]);
            }
        };
    };
    return StateMachine;
});