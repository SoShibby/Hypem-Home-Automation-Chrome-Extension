/* 
	Handles communication with all the Hypem players in each tabs
*/

TabManager = (function(){

	//Send message to a tab
	function send(playerId, message){
		var tabId = playerId;
		chrome.tabs.sendMessage(tabId, message, function(response) {
			console.log(response);
		});
	}

	//Incoming message from a tab
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		if(!request.player){
			console.log("Invalid request. Request must contain a player field");
			return;
		}
		
		var player = request.player;
		var tabId = sender.tab.id;
		var playerId = tabId;
		var event = player.event;
		
		if(event === "playerInitialized"){
			PlayerManager.addPlayer(playerId, {
												volume: player.volume,
												duration: player.duration,
												currentTime: player.currentTime,
												artist: player.artist,
												artistUri: player.artistUri,
												track: player.track,
												trackUri: player.trackUri,
												isPlaying: player.isPlaying
											});
		}else if(event === "removed"){
			PlayerManager.removePlayer(playerId);
		}else if(event === "isPlayingChanged"){
			PlayerManager.onIsPlayingChanged(playerId, player.isPlaying);
		}else if(event === "trackChanged"){
			PlayerManager.onTrackChanged(playerId, player.artist, player.artistUri, player.track, player.trackUri);
		}else if(event === "currentTimeChanged"){
			PlayerManager.onCurrentTimeChanged(playerId, player.currentTime);
		}else if(event === "volumeChanged"){
			PlayerManager.onVolumeChanged(playerId, player.volume);
		}else{
			console.log("Invalid event");
		}
	});

	//Tab is closing
	chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
		var playerId = tabId;
		PlayerManager.removePlayer(playerId);
	});

	//Tab is refreshed
	chrome.tabs.onUpdated.addListener(function(tabId, removeInfo, tab){
		if(removeInfo.status !== "loading")
			return;
		
		var playerId = tabId;
		PlayerManager.removePlayer(playerId);
	});
	
	//Return public functions
	return {
		send: send
	}
}());