define(['network/WSSession'], function (WSSession) {
	var SessionProvider = function () {
		var useWebSocket = true;

		return {
			getSession: function (delegate) {
				if (useWebSocket) {
					var ws = new WSSession(delegate);
					return ws;
				}
			}
		};
	};
	return SessionProvider;
});