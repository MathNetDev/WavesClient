
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


var em = new EventManager();

em.subscribe("tick", function (event) {
    console.log("long function started");
    var i;
    for (i = 0; i < 1000000; i = i + 1) {
        if (i == 5000) {
            console.log("5000!");
            em.publish({ type: 'other' });
        }
    }
    console.log("long function finished");
});


em.subscribe("tick", function (event) {
    console.log("short function started");
    var i;
    for (i = 0; i < 10; i = i + 1) {
        if (i == 9) {
            console.log("9!");
        }
    }
    console.log("short function finished");
});

em.subscribe("other", function(event) {
    console.log("other");
});

setInterval(function () {
    em.publish({ type: "tick" });
    return;
}, 3000);

console.log("done setup");