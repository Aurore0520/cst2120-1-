//function to start game
function startGame() {
    document.getElementById("message").innerHTML =
    "Welcome to The Silent House, your adventure shall begin soon!";
} 

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
    window.location.href = "Index.html";
})

}