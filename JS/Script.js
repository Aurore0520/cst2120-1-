//function to start game
function startGame() {
    
    window.location.href = "GAME/game.html";
} 

//calls the function when start button is clicked
document.getElementById("startButton").onclick = startGame;

//Finds the start game button
const startButton = document.getElementById("startButton");

//calls the function when the button is clicked
if (startButton) {
    startButton.onclick = startGame;
}

//Finds the how to play button
const howToPlayButton = document.getElementById("howToPlayButton");

//Opens the instructions page
function howToPlay() {
    window.location.href = "howToPlay.html";
}

//Calls the function when the button is clicked
if (howToPlayButton) {
    howToPlayButton.onclick = howToPlay;
}

//Return to homepage button
const homeButton = document.getElementById("homeButton");

//Add an action when button is clicked
if (homeButton) {
    homeButton.addEventListener("click", function() {
    //Redirect the player to the homepage
    window.location.href = "index.html";
})}


//Play game theme music
const ambience = new Audio("assets/thememusic.wav");

ambience.loop = true; //music will play continuously

ambience.volume = 0.5; //softer volume 

//Tracks whether the player has muted the music
let isMuted = false;

//find the music toggle button
const soundToggle = document.getElementById("soundToggle");

//updates the button text
function updateSoundButton() {
    soundToggle.textContent = isMuted ? "Music: OFF" : "Music: ON";

}

//Starts the music after the player's first interaction
function startMusic() {

    //Does not start music if the player has muted it
    if (!isMuted && ambience.paused) {
        ambience.play().catch(() => {

        });
    }
}
//Starts the music when the player clicks anywhere
document.addEventListener("click", startMusic);

//Allows the player to mute/unmute the music
soundToggle.addEventListener("click", () => {

    //Changes the mute setting
    isMuted = !isMuted;

    if (isMuted) {
        ambience.pause();
    } else {
        startMusic();
    }

    //Updates the button text
    updateSoundButton();
});

//Displays the initial button text
updateSoundButton();




