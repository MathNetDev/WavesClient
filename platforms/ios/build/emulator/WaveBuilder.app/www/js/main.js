/*global define, require*/
require.config({
    paths: {
        'paper' : "lib/paper-full.min",
        'socketio': "http://10.0.1.2:9000/socket.io/socket.io.js"
    },
    shim: {
        'paper' : {
            exports: 'paper'
        }
    }
});

require(['paper', 'Waves', 'network/WavesNetworkInterface', 'network/SessionProvider'], function (paper, Waves, WavesNetworkInterface, SessionProvider) {
    document.addEventListener("deviceready", run, false);
    document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);

    function run() {
        var el = document.getElementById("loginButton");
        el.onclick = function () {
            var inputs = document.querySelectorAll('input');
            for(var i = 0; i < inputs.length; i++) {
               inputs[i].blur();
            }
            window.setTimeout(login, 10);
        };

        function hideOverlay() {
            el = document.getElementById("overlay");
            el.style.visibility = "hidden";
        }
        function showOverlay() {
            el = document.getElementById("overlay");
            el.style.visibility = "visible";
        }

        function login() {
            var newPaper,
                waves,
                session,
                netInterface;

            newPaper = new paper.PaperScope();

            waves = Waves('collab', newPaper, 'collab');

            session = new SessionProvider().getSession();
            session.setUsername(document.getElementById("username").value || "default");
            session.joinGroup(document.getElementById("group").value || "default");

            netInterface = new WavesNetworkInterface(waves.getEventManager(), session); // interface listens/publishes to event manager / session
            session.setDelegate(netInterface);

            hideOverlay();
        }
    }
});