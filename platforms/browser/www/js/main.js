/*global define, require*/
require.config({
    paths: {
        'paper' : "lib/paper-full.min",
        'socketio': "http://localhost:9000/socket.io/socket.io"
    },
    shim: {
        'paper' : {
            exports: 'paper'
        }
    }
});

require(['paper', 'Waves', 'network/WavesNetworkInterface', 'network/SessionProvider'], function (paper, Waves, WavesNetworkInterface, SessionProvider) {
    //document.addEventListener("deviceready", run, false);
    //document.addEventListener('touchmove', function(e) { console.log('move'); e.preventDefault(); }, false);
    run();
    function run() {
    	login();
        function login() {
            var newPaper,
                waves,
                session,
                netInterface;

            newPaper = new paper.PaperScope();

            waves = Waves('collab', newPaper, 'collab');

            session = new SessionProvider().getSession();
            session.setUsername(sessionStorage.getItem('username'));
            session.joinGroup(sessionStorage.getItem('class_id')+'x'+sessionStorage.getItem('group_id'));

            netInterface = new WavesNetworkInterface(waves.getEventManager(), session); // interface listens/publishes to event manager / session
            session.setDelegate(netInterface);

        }
    }
});