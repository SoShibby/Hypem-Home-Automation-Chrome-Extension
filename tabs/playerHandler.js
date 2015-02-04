/*
	Handles the communication with the Hypem website so we can pause, play, set volume and receive events when the current track changes etc.
*/
PlayerHandler = (function(){
	var mPlayer;
	var mEventListeners = [];
	var mPlayButtonSelector = '#playerPlay';
	var mNextTrackButtonSelector = '#playerNext';
	var mPreviousTrackButtonSelector = '#playerPrev';
	var mVolumeSliderSelector = '#player-volume-ctrl';
	var mCurrentTimeSelector = '#player-time-position';
	var mDurationSelector = '#player-time-total';
	var mArtistSelector = '#player-nowplaying > a:first-child';
	var mTrackSelector = '#player-nowplaying > a:nth-child(3)';
	var mNowPlayingSelector = '#player-nowplaying';
	var mIsCurrentlyPlaying;
	var mCurrentTrack;
	var mCurrentArtist;
	var mVolume;
	
	//Initialize the Hypem player
	function initPlayer(){
		$(mCurrentTimeSelector).childChanged(onCurrentTimeChanged);
		$(mPlayButtonSelector).classChanged(onIsPlayingChanged);
		$(mVolumeSliderSelector).styleChanged(onVolumeChanged);
		$(mNowPlayingSelector).childChanged(onTrackChanged);
		
		onPlayerReady();
	}
	
	//Event triggered when the current song changes
	function onTrackChanged(){
		if(mCurrentArtist === getArtist() && mCurrentTrack === getTrack())
			return;
			
		console.log("onTrackChanged - " + getArtist() + " - " + getTrack());
		mCurrentArtist = getArtist();
		mCurrentTrack = getTrack();
		
		castEvent("onTrackChanged", { artist: getArtist(), track: getTrack(), trackUri: getTrackUri(), artistUri: getArtistUri() });
	}
	
	//Event triggered when the current time (seek position) changes
	function onCurrentTimeChanged(){
		console.log("onCurrentTimeChanged - " + getCurrentTime());
		castEvent("onCurrentTimeChanged", { currentTime: getCurrentTime() });
	}
	
	//Event triggered when the Hypem player changes from paused to playing and from playing to paused
	function onIsPlayingChanged() {
		var isPlaying = getStatus();
		
		if(isPlaying === mIsCurrentlyPlaying)
			return;

		console.log("onIsPlayingChanged - " + isPlaying);
			
		mIsCurrentlyPlaying = isPlaying;
		castEvent("onIsPlayingChanged", { isPlaying: isPlaying });
	}
	
	//Event triggered when the volume of the Hypem player changes
	function onVolumeChanged(){
		var volume = getVolume();
		
		if(volume === mVolume)
			return;
			
		console.log("onVolumeChanged - " + volume);
		
		mVolume = volume;
		castEvent("onVolumeChanged", { volume: volume });
	}
	
	//Returns the current volume of the Hypem player
	function getVolume(){
		var parentWidth = $(mVolumeSliderSelector).parent().width();
		var childWidth = $(mVolumeSliderSelector).width();
		return Math.round((childWidth / parentWidth) * 100);	//Round the volume to zero decimal places.
	}
	
	//Returns the current status of the Hypem player
	function getStatus(){
		return $(mPlayButtonSelector).hasClass('pause');
	}
	
	//Returns true if Hypem is currently playing or false if it is paused
	function isPlaying(){
		return getStatus();
	}
	
	//Event triggered when the Hypem player is initialized and ready to receive commands
	function onPlayerReady() {
		console.log("onPlayerReady");
		castEvent("onPlayerReady", null);
	}

	//Sends command to Hypem to play the current track
	function play(playerId){ 
		if(!isPlaying()){
			var playButton = $(mPlayButtonSelector).get(0);
			simulateClick(playButton);
		}
	}
	
	//Sends command to Hypem to pause the current track
	function pause(playerId){
		if(isPlaying()){
			var pauseButton = $(mPlayButtonSelector).get(0);
			simulateClick(pauseButton);
		}
	}
	
	//Sends command to Hypem to move on to the next track
	function nextTrack(){
		var nextTrackButton = $(mNextTrackButtonSelector).get(0);
		simulateClick(nextTrackButton);
	}
	
	//Sends command to Hypem to go back to the previous track
	function previousTrack(){
		var previousTrackButton = $(mPreviousTrackButtonSelector).get(0);
		simulateClick(previousTrackButton);
	}
	
	//Returns the current duration (track length) of the current track
	function getDuration(){
		var timeString = $(mDurationSelector).text();
		return convertTimeStringToSeconds(timeString);
	}
	
	//Returns the title of the current track
	function getTrack(){
		return $(mTrackSelector).text();
	}
	
	//Returns the url of the current track
	function getTrackUri(){
		return "http://www.hypem.com" + $(mTrackSelector).attr('href');
	}
	
	//Return the name of the current artist
	function getArtist(){
		return $(mArtistSelector).text();
	}
	
	//Returns the url of the current artist
	function getArtistUri(){
		return "http://www.hypem.com" + $(mArtistSelector).attr('href');
	}
	
	//Sets the volume of the Hypem player
	function setVolume(playerId, volume){
		
	}
	
	//Returns the current time (seek position) of the track playback
	function getCurrentTime(playerId){
		var timeString = $(mCurrentTimeSelector).text();
		return convertTimeStringToSeconds(timeString);
	}
	
	//Converts time string to integer. Example "01:31" becomes 91
	function convertTimeStringToSeconds(timeString){
		parts = timeString.split(':');
		var minutes = parseInt(parts[0]);
		var seconds = parseInt(parts[1]);
		return minutes * 60 + seconds;
	}
	
	//Simulate a mouse click on the specified DOM element
	function simulateClick(obj) {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		var canceled = !obj.dispatchEvent(evt);      
	}

	function addEventListener(eventName, listener){
		console.log("addEventListener: " + eventName);
		
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
		initPlayer: initPlayer,
		addEventListener: addEventListener,
		play: play,
		pause: pause,
		nextTrack: nextTrack,
		previousTrack: previousTrack,
		getDuration: getDuration,
		getVolume: getVolume,
		setVolume: setVolume,
		getCurrentTime: getCurrentTime,
		isPlaying: getStatus,
		getArtist: getArtist,
		getTrack: getTrack,
		getArtistUri: getArtistUri,
		getTrackUri: getTrackUri
	}
}());