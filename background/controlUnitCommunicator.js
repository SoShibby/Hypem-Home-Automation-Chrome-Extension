/*
	Communicates with the java application over websocket (which in turn communicates with the conductor)
	Receives commands such as play, pause, seek, volume etc. and sends back status of the Hypem player to the control unit.
	Note: We only send back the status of one Hypem player which is the one that was last in use.
*/

ControlUnitCommunicator = (function(){
	var mURL = "ws://127.0.0.1:9002";

	init();
	
	//Initializing
	function init(){
		ClientSocket.addEventListener('onMessage', onMessageReceived);
		ClientSocket.addEventListener('onClose', onClose);
		ClientSocket.connect(mURL);
		
		HypemPlayer.addEventListener('isPlayingChanged', onPlayerIsPlayingChanged);
		HypemPlayer.addEventListener('volumeChanged', onPlayerVolumeChanged);
		HypemPlayer.addEventListener('durationChanged', onPlayerDurationChanged);
		HypemPlayer.addEventListener('currentTimeChanged', onPlayerCurrentTimeChanged);
		HypemPlayer.addEventListener('trackChanged', onPlayerTrackChanged);
	}
	
	//Event triggered when youtube player has changed status
	function onPlayerIsPlayingChanged(isPlaying){
		console.log('onPlayerIsPlayingChanged');
		ClientSocket.sendJSON({ "propertyName": "playing", "propertyValue": isPlaying });
	}
	
	//Event triggered when youtube player volume is changed
	function onPlayerVolumeChanged(volume){
		ClientSocket.sendJSON({ "propertyName": "volume", "propertyValue": volume });
	}
	
	//Event triggered when youtube player track duration has changed
	function onPlayerDurationChanged(duration){
		ClientSocket.sendJSON({ "propertyName": "duration", "propertyValue": duration });
	}
	
	//Event triggered when youtube player current seek position has changed
	function onPlayerCurrentTimeChanged(currentTime){
		ClientSocket.sendJSON({ "propertyName": "currentTime", "propertyValue": currentTime });
	}
	
	//Event triggered when hypem player track has changed
	function onPlayerTrackChanged(event){
		ClientSocket.sendJSON({ "propertyName": "artist", "propertyValue": event.artist });
		ClientSocket.sendJSON({ "propertyName": "artistUri", "propertyValue": event.artistUri });
		ClientSocket.sendJSON({ "propertyName": "track", "propertyValue": event.track });
		ClientSocket.sendJSON({ "propertyName": "trackUri", "propertyValue": event.trackUri });		
	}

	//Event triggered when connection to the server (control unit) disconnects
	function onClose(event){
		//Try to reconnect to server
		setTimeout(function(){
			ClientSocket.connect(mURL);	
		}, 3000);
	}

	//Event triggered when a message is received from the server (control unit)
	function onMessageReceived(event){
		try{
			var message = event.data;
			var json = JSON.parse(message);
			
			if(json.errorMessage){
				console.log("Error message received from server (control unit), error message was: " + json.errorMessage);
			}else if(json.propertyName && json.propertyValue !== undefined){
				setPropertyValue(json.propertyName, json.propertyValue);
			}else if(json.methodName && json.methodParameters){
				callMethod(json.methodName, json.methodParameters);
			}else{
				console.log("Invalid incoming data from server, expected data to contain propertyName and propertyValue");
			}
		}catch(e){
			console.log("onMessageReceived, Exception occured with message: " + e.message);
			console.log(e.stack);
		}
	}

	//Send command to the Hypem player
	function setPropertyValue(propertyName, propertyValue){
		if(propertyName === "playing"){
			Assert.isBoolean(propertyValue, "Invalid propertyValue, expected boolean value for propertyName '" + propertyName + "'");
			var play = propertyValue;
			
			if(play){
				HypemPlayer.play();
			}else{
				HypemPlayer.pause();
			}
		}
	}
	
	//Send command to the Hypem player
	function callMethod(methodName, methodParameters){
		if(methodName === "nextTrack"){
			HypemPlayer.nextTrack();
		}else if(methodName === "previousTrack"){
			HypemPlayer.previousTrack();
		}
	}
}());
