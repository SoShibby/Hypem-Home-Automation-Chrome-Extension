/*
	Handles communication with the background script.
	Sends back status (volume, current seek time, duration, is playing, current track) of this Hypem player to the background script
	and receives commands such as play, pause from the background script.
*/
Communicator = (function() {

	init();
	
	function init(){
		PlayerHandler.addEventListener("onPlayerReady", onPlayerReady);
		PlayerHandler.addEventListener("onIsPlayingChanged", onIsPlayingChanged);
		PlayerHandler.addEventListener("onTrackChanged", onTrackChanged);
		PlayerHandler.addEventListener("onVolumeChanged", onVolumeChanged);
		PlayerHandler.addEventListener("onCurrentTimeChanged", onCurrentTimeChanged);
	}

	//Event triggered when player has been initialized and is ready
	function onPlayerReady(event) {
		console.log("onPlayerReady");
		chrome.extension.sendRequest({ player: { 
													event: "playerInitialized", 
													volume: PlayerHandler.getVolume(), 
													duration: PlayerHandler.getDuration(), 
													currentTime: PlayerHandler.getCurrentTime(),
													isPlaying: PlayerHandler.isPlaying(), 
													artist: PlayerHandler.getArtist(),
													track: PlayerHandler.getTrack(),
													artistUri: PlayerHandler.getArtistUri(),
													trackUri: PlayerHandler.getTrackUri()
												} 
									});	
	}
	
	//Event triggered when player has changed track (song)
	function onTrackChanged(event){
		console.log("onTrackChanged");
		chrome.extension.sendRequest({ player: { 
													event: "trackChanged", 
													artist: event.artist, 
													track: event.track, 
													artistUri: event.artistUri, 
													trackUri: event.trackUri 
												} 
									});
	}

	//Event triggered when player has been paused or resumed playback
	function onIsPlayingChanged(event) {
		console.log("onIsPlayingChanged");
		chrome.extension.sendRequest({ player: { 
													event: "isPlayingChanged", 
													isPlaying: event.isPlaying 
												} 
									});	
	}
	
	//Event triggered when the volume of the player has changed
	function onVolumeChanged(event) {
		console.log("onVolumeChanged");
		chrome.extension.sendRequest({ player: { 
													event: "volumeChanged", 
													volume: event.volume 
												} 
									});	
	}
	
	//Event triggered when the volume of the player has changed
	function onCurrentTimeChanged(event) {
		console.log("onCurrentTimeChanged");
		chrome.extension.sendRequest({ player: { 
													event: "currentTimeChanged", 
													currentTime: event.currentTime 
												} 
									});	
	}
	
	//Listening for commands from the background script
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		console.log("Received request from background script");
		console.log(request);
		
		var setStatus = request.setStatus;
		
		if(request.player.play){
				PlayerHandler.play();
		}else if(request.player.pause){
				PlayerHandler.pause();		
		}else if(request.player.nextTrack){
			PlayerHandler.nextTrack();
		}else if(request.player.previousTrack){
			PlayerHandler.previousTrack();
		}else{
			console.log("Data missing, you must supply setStatus");
		}
	});
	
}());

