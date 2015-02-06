/*
	Manages all the Hypem players on all the separate tabs
*/

PlayerManager = (function(){
	var mPlayers = [];		//Array of Hypem players that exists on every tab
	var mEventListeners = [];
	
	//Adds a new Hypem player to the collection
	function addPlayer(playerId, info){
		console.log("addPlayer - " + playerId);
		
		var status = info.status || "paused"; 
		var isPlaying = info.isPlaying || false;
		var artist = info.artist || "";
		var artistUri = info.artistUri || "";
		var track = info.track || "";
		var trackUri = info.trackUri || "";
		var duration = info.duration || 0;
		var currentTime = info.currentTime || 0;
		var volume = info.volume || 0;
		
		mPlayers[playerId] = { status: status, isPlaying: isPlaying, artist: artist, artistUri: artistUri, track: track, trackUri: trackUri, duration: duration, currentTime: currentTime, volume: volume, playerId: playerId };
		castEvent('playerAdded', { playerId: playerId });
	}

	//Removes a Hypem player from the collection
	function removePlayer(playerId){
		console.log('removePlayer - ' + playerId);
		delete mPlayers[playerId];
		castEvent('playerRemoved', { playerId: playerId });
	}

	//Triggered when one of the Hypem players changes from playing to paused or from paused to playing
	function onIsPlayingChanged(playerId, isPlaying){
		console.log('onIsPlayingChanged (' + playerId + ') ' + ((isPlaying) ? "playing" : "paused"));
		mPlayers[playerId].isPlaying = isPlaying;
		castEvent('isPlayingChanged', { playerId: playerId, isPlaying: isPlaying });
	}

	//Triggered when one of the Hypem players changes volume
	function onVolumeChanged(playerId, volume){
		console.log('onVolumeChanged (' + playerId + ') ' + volume);
		mPlayers[playerId].volume = volume;
		castEvent('volumeChanged', { playerId: playerId, volume: volume });
	}
	
	//Triggered when one of the Hypem players changes song
	function onTrackChanged(playerId, artist, artistUri, track, trackUri){
		mPlayers[playerId].artist = artist;
		mPlayers[playerId].artistUri = artistUri;
		mPlayers[playerId].track = track;
		mPlayers[playerId].trackUri = trackUri;
		castEvent('trackChanged', { playerId: playerId, artist: artist, artistUri: artistUri, track: track, trackUri: trackUri });
	}
	
	//Triggered when one of the Hypem players changes duration (track length)
	function onDurationChanged(playerId, duration){
		mPlayers[playerId].duration = duration;
		castEvent('durationChanged', { playerId: playerId, duration: duration });
	}
	
	//Triggered when one of the Hypem players changes the current time (seek position)
	function onCurrentTimeChanged(playerId, currentTime){
		mPlayers[playerId].currentTime = currentTime;
		castEvent('currentTimeChanged', { playerId: playerId, currentTime: currentTime });
	}
	
	//Returns the volume of the specified Hypem player
	function getVolume(playerId){
		return mPlayers[playerId].volume;
	}

	//Return the duration (track length) of the specified Hypem player
	function getDuration(playerId){
		return mPlayers[playerId].duration;
	}

	//Return the current time (seek position) of the specified Hypem player
	function getCurrentTime(playerId){
		return mPlayers[playerId].currentTime;
	}
	
	//Return the current artist of the specified Hypem player
	function getArtist(playerId){
		return mPlayers[playerId].artist;
	}
	
	//Return the current artist uri of the specified Hypem player
	function getArtistUri(playerId){
		return mPlayers[playerId].artistUri;
	}
	
	//Return the current track title of the specified Hypem player
	function getTrack(playerId){
		return mPlayers[playerId].track;
	}
	
	//Return the current track uri of the specified Hypem player
	function getTrackUri(playerId){
		return mPlayers[playerId].trackUri;
	}
	
	//Send command to the specified Hypem player that it should start playing
	function play(playerId){
		TabManager.send(playerId, { player: { play: true }});
	}
	
	//Send command to the specified Hypem player that it should pause playback
	function pause(playerId){
		TabManager.send(playerId, { player: { pause: true }});
	}
	
	//Send command to the specified Hypem player that it should move on to the next track
	function nextTrack(playerId){
		TabManager.send(playerId, { player: { nextTrack: true }});
	}
	
	//Send command to the specified Hypem player that it should go back to the previous track
	function previousTrack(playerId){
		TabManager.send(playerId, { player: { previousTrack: true }});
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
	return{
		onIsPlayingChanged: onIsPlayingChanged,
		onVolumeChanged: onVolumeChanged,
		onDurationChanged: onDurationChanged,
		onCurrentTimeChanged: onCurrentTimeChanged,
		onTrackChanged: onTrackChanged,
		getVolume: getVolume,
		getDuration: getDuration,
		getCurrentTime: getCurrentTime,
		getArtist: getArtist,
		getArtistUri: getArtistUri,
		getTrack: getTrack,
		getTrackUri: getTrackUri,
		addPlayer: addPlayer,
		removePlayer: removePlayer,
		play: play,
		pause: pause,
		nextTrack: nextTrack,
		previousTrack: previousTrack,
		addEventListener: addEventListener
	}
}());