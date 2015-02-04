//Check if the url of this tab is hypem.com
function isHypemWebsite(){
	return document.URL.indexOf('hypem.com') != -1;
}

//Event triggered when DOM is ready
$(document).ready(function(){
	if(isHypemWebsite()){
		PlayerHandler.initPlayer();
	}
});

//Event triggered when tab or iframe is closing
$( window ).unload(function() {
	if(isHypemWebsite()){
		console.log("Bye now!");
		chrome.extension.sendRequest({ player: { event: "removed" } });	
	}
});