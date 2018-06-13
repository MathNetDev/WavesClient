define(['socketio'], function (io) {
	var WSSession = function () {
		
		var disconnect = false,
		    delegate,
		    socket = io.connect('ws://localhost:9000'),
		    //socket = io.connect('ws://10.0.1.5:9000'),
		    username,
		    group;

	    socket.on('data', function(data) {
			delegate.handleNetworkMessage(data);
		});

		socket.on('disconnect', function(data) {
			disconnect = true;
			alert("DISCONNECT");
		});

		return {
			connect: function() {
				if (disconnect) {
					socket.socket.reconnect();
					alert("Reconnecting. Group was: " + group);
				}
			},

			setUsername: function (name) {
				username = name;
			},

			joinGroup: function (newGroup) {
				group = newGroup;
				if (disconnect) {
					socket.socket.reconnect();
				}
				socket.emit('subscribe', {username: username, group: group});
			},

			leaveGroup: function (group) {
				if (disconnect) {
					socket.socket.reconnect();
				}
				socket.emit('unsubscribe', {username: username, group: group});
				group = null;
			},

			sendData: function (message) {
				if (disconnect) {
					socket.socket.reconnect();
					socket.emit('subscribe', {username: username, group: group});
				}
				message.username = username;
				message.group = group;
				socket.emit('data', message);
			},

			end: function(data) {
				disconnect = true;
				socket.emit('end');
			},

			setDelegate: function(newDelegate) {
				delegate = newDelegate;
			}
		};
	};
	return WSSession;
});