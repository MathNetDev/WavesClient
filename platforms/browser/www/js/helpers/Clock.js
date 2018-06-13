define(['helpers/StateMachine'], function (StateMachine) {
	var Clock = function (TICKINTERVAL, em) {
        var state = new StateMachine(),
            timer;

        state.add("play",
            function () {
                timer = window.setInterval(function () {
                    em.publish({type: 'tick'});
                }, TICKINTERVAL);
            },
            function () {
                window.clearInterval(timer);
            });

        state.add("pause",
            function () {
                return;
            },
            function () {
                return;
            });

        state.enter("pause");

        return {
            getState: function () {
                return state.current();
            },

            playPause: function (event) {
                state.enter(event.state);
            }
        };
    }
    return Clock;    
});