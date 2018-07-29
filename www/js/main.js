/*global define, require*/
require.config({
    paths: {
        'paper' : "lib/paper-full.min",
        'socketio': "http://mathnetclient:8885/socket.io/socket.io"
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

	    var newPaper,
	        waves,
	        session,
	        netInterface;

	    newPaper = new paper.PaperScope();

	    waves = Waves('collab', newPaper, 'collab');

	    session = new SessionProvider().getSession();
	    session.setUsername(sessionStorage.getItem('username'));
	    session.joinGroup(sessionStorage.getItem('class_id')+'x'+sessionStorage.getItem('group_id'));

	    //Call to Leave Group on Clicking Leave Group Button and Clear the Waves App Paperjs Canvas
	    document.getElementById('leave_group').onclick = function() {
	        	session.leaveGroup(sessionStorage.getItem('class_id')+'x'+sessionStorage.getItem('group_id'));
	        		
	        	//Clearing the PaperJS drawn elements
	        	newPaper.project.clear();

	        	//Removing and Adding the Canvas to HTML again
	       		var element = document.getElementById('collab');
				element.parentNode.removeChild(element);

				var new_canvas = document.createElement('canvas');
				new_canvas.setAttribute('id','collab');
				document.getElementById('waves_canvas_container').appendChild(new_canvas);
			};

	    netInterface = new WavesNetworkInterface(waves.getEventManager(), session); // interface listens/publishes to event manager / session
	    session.setDelegate(netInterface);
    }
});

//Called when a client joins some group again after leaving a group
function init_waves()
{
	require(['paper', 'Waves', 'network/WavesNetworkInterface', 'network/SessionProvider'], function (paper, Waves, WavesNetworkInterface, SessionProvider) {
	    run();
	    function run() {
	    	
	        var newPaper,
	            waves,
	            session,
	            netInterface;

	        newPaper = new paper.PaperScope();

	        waves = Waves('collab', newPaper, 'collab');

	        session = new SessionProvider().getSession();
	        session.setUsername(sessionStorage.getItem('username'));
	        session.joinGroup(sessionStorage.getItem('class_id')+'x'+sessionStorage.getItem('group_id'));

	        //Call to Leave Group on Clicking Leave Group Button and Clear the Waves App Paperjs Canvas
	        document.getElementById('leave_group').onclick = function() {
	            session.leaveGroup(sessionStorage.getItem('class_id')+'x'+sessionStorage.getItem('group_id'));

	            newPaper.project.clear();

	           	var element = document.getElementById('collab');
	   			element.parentNode.removeChild(element);

				var new_canvas = document.createElement('canvas');
	   			new_canvas.setAttribute('id','collab');
	   			document.getElementById('waves_canvas_container').appendChild(new_canvas);

	 		};

	        netInterface = new WavesNetworkInterface(waves.getEventManager(), session); // interface listens/publishes to event manager / session
	        session.setDelegate(netInterface);

	    }
	});
};
