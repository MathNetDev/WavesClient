define([], function () {
	var WavesNetworkInterface = function (eventManager, session) {

		eventManager.subscribe('localphaseeditdone', function (event) {
			session.sendData(event);
		});

		eventManager.subscribe('syncresponse', function (event) {
			session.sendData(event);
		});

		return {
			handleNetworkMessage: function (data) {
				console.log("server event received: " + JSON.stringify(data));
				if(data.type == 'localphaseeditdone') {
					data.type = 'remotephaseedit';
					eventManager.publish(data);
				} 
				else if (data.type == 'syncresponse') {
					data.type = 'syncreceived';
					eventManager.publish(data);
				} 
				else  {
					eventManager.publish(data);
				}
			}
		}
	};
	return WavesNetworkInterface;
});