/*
	Controls the last active Hypem player that was in use
*/

HypemPlayer = (function(){
	var mCurrentPlayerId;		//The last Hypem player that was/is in use
	var mEventListeners = [];
	var mVolume;
	var mCurrentTime;
	var mDuration;
	var mArtist;
	var mTrack;
	
	init();
	
	//Initialize the Hypem player
	function init(){
		PlayerManager.addEventListener('playerAdded', onPlayerAdded);
		PlayerManager.addEventListener('isPlayingChanged', onPlayerIsPlayingChanged);
		PlayerManager.addEventListener('volumeChanged', onPlayerVolumeChanged);
		PlayerManager.addEventListener('durationChanged', onPlayerDurationChanged);
		PlayerManager.addEventListener('currentTimeChanged', onPlayerCurrentTimeChanged);
		PlayerManager.addEventListener('trackChanged', onPlayerTrackChanged);
	}
	
	//Check if the playerId parameter is the id of the current player
	function isCurrentPlayer(playerId){
		return (mCurrentPlayerId && mCurrentPlayerId === playerId);
	}
	
	//Set a new player as the primary player
	function setCurrentPlayer(playerId){
		mCurrentPlayerId = playerId;
		
		//Check if the volume of the new player differs from the old player, in that case cast an event telling that the volume has changed
		if(mVolume !== PlayerManager.getVolume(playerId)){
			mVolume = PlayerManager.getVolume(playerId);
			castEvent('volumeChanged', mVolume);
		}
		
		//Check if the current time of the new player differs from the old player, in that case cast an event telling that the current time has changed
		if(mCurrentTime !== PlayerManager.getCurrentTime(playerId)){
			mCurrentTime = PlayerManager.getCurrentTime(playerId);
			castEvent('currentTimeChanged', mCurrentTime);
		}
		
		//Check if the duration (track length) of the new player differs from the old player, in that case cast an event telling that the duration has changed
		if(mDuration !== PlayerManager.getDuration(playerId)){
			mDuration = PlayerManager.getDuration(playerId);
			castEvent('durationChanged', mDuration);
		}
		
		//Check if the track of the new player differs from the old player, in that case cast an event telling that the track has changed
		if(mArtist !== PlayerManager.getArtist(playerId) && mTrack !== PlayerManager.getTrack(playerId)){
			mArtist = PlayerManager.getArtist(playerId);
			mTrack = PlayerManager.getTrack(playerId);
			castEvent('trackChanged', { artist: mArtist, artistUri: PlayerManager.getArtistUri(playerId), track: mTrack, trackUri: PlayerManager.getTrackUri(playerId) });
		}
		
	}

	//Event triggered when a new player has been added to the player manager
	function onPlayerAdded(event){
		//If no player exists yet then set this new player as the current player
		if(mCurrentPlayerId === undefined){
			setCurrentPlayer(event.playerId);
		}
	}
	
	//Event triggered when the player changes from paused to playing or from playing to paused
	function onPlayerIsPlayingChanged(event){
		var playerId = event.playerId;
		var isPlaying = event.isPlaying;
		
		console.log("onPlayerIsPlayingChanged - " + playerId + " - " + isPlaying);

		//If this player is playing a video then set this player as the new "primary" player
		if(!isCurrentPlayer(playerId) && isPlaying){		
			setCurrentPlayer(playerId);
		}
		
		if(isCurrentPlayer(playerId)){
			castEvent('isPlayingChanged', isPlaying);
		}
	}
	
	//Event triggered when the volume changes
	function onPlayerVolumeChanged(event){
		var playerId = event.playerId;
		
		if(isCurrentPlayer(playerId)){
			castEvent('volumeChanged', event.volume);
		}
	}
	
	//Event triggered when the track length changes (this occurs when a new track is playing)
	function onPlayerDurationChanged(event){
		var playerId = event.playerId;
		
		if(isCurrentPlayer(playerId)){
			castEvent('durationChanged', event.duration);
		}
	}
	
	//Event triggered when the current time (seek position) changes
	function onPlayerCurrentTimeChanged(event){
		var playerId = event.playerId;
		
		if(isCurrentPlayer(playerId)){
			castEvent('currentTimeChanged', event.currentTime);
		}
	}
	
	//Event triggered when the current song changes
	function onPlayerTrackChanged(event){
		var playerId = event.playerId;
		
		if(isCurrentPlayer(playerId)){
			castEvent('trackChanged', { artist: event.artist, artistUri: event.artistUri, track: event.track, trackUri: event.trackUri });
		}
	}
	
	//Send command to Hypem to play the current track
	function play(){
		if(mCurrentPlayerId === undefined){
			console.log('Unable to play, no hypem player exists');
			return;
		}
	
		PlayerManager.play(mCurrentPlayerId);
	}
	
	//Send command to Hypem to pause the current track
	function pause(){
		if(mCurrentPlayerId === undefined){
			console.log('Unable to pause, no hypem player exists');
			return;
		}
	
		PlayerManager.pause(mCurrentPlayerId);
	}
	
	//Send command to Hypem to move to the next track
	function nextTrack(){
		if(mCurrentPlayerId === undefined){
			console.log('Unable to execute next track, no hypem player exists');
			return;
		}
	
		PlayerManager.nextTrack(mCurrentPlayerId);
	}
	
	//Send command to Hypem to move to the previous track
	function previousTrack(){
		if(mCurrentPlayerId === undefined){
			console.log('Unable to execute previous track, no hypem player exists');
			return;
		}
	
		PlayerManager.previousTrack(mCurrentPlayerId);
	}
	
	function addEventListener(eventName, listener){
		if(mEventListeners[eventName] === undefined)
			mEventListeners[eventName] = [];
			
		mEventListeners[eventName].push(listener);
	}
	
	function castEvent(eventName, eventValue){
		if(mEventListeners[eventName] === undefined){
			return;
		}
			
		for(var i = 0; i < mEventListeners[eventName].length; i++){
			mEventListeners[eventName][i](eventValue);
		}
	}
	
	//Return public functions
	return {
		addEventListener: addEventListener,
		play: play,
		pause: pause,
		nextTrack: nextTrack,
		previousTrack: previousTrack
	}
}());