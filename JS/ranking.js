/*Stores the player's current score*/
let score = Number(localStorage.getItem("silentHouseCurrentScore")) || 0;

/*Adds points when the player completes a challenge*/
function addScore(points) {
    score= score + points;

    /*Saves the updated score in the browser*/
    localStorage.setItem("silentHouseCurrentScore", score);

}

/*Resets the score when a new game starts*/
function resetScore() {
    score = 0;

    /*saves the reset score*/
    localStorage.setItem("silentHouseCurrentScore", score);

}

/*Saves the final score when the player finishes the game*/
function saveFinalScore() {
    /*Gets the player's username*/
    let username = localStorage.getItem("username") || "Player";

    /*Gets the existing leaderboard*/
    let leaderboard = JSON.parse(
        localStorage.getItem("silentHouseLeaderboard")
    ) || [];

    /*Adds the current player's result*/
    leaderboard.push({
        name: username,
        score: score
    });

    /*saves the leaderboard*/
    localStorage.setItem(
        "silentHouseLeaderboard",
        JSON.stringify(leaderboard)
    );
}

/*Sorts scores from highest to lowest*/
leaderboard.srot(function(a,b) {
    return b.score - a.score;
});

/*Fins the table body*/
let rankingTable = document.getElementById("rankingTable");

/*Displays each player in the leaderboard*/
leaderboard.forEach(function(player, index) {

    /*Creates a new table row*/
    let row = document.createElement("tr");

    /*Adds the rank, player name and score*/
    row.innerHTML =
    "<td>" + (index + 1) + "</td>" +
    "<td></td>" +
    "<td>" + player.score + "</td>";

    /*Adds the player name as text*/
    row.cells[1].textContent = player.name;

    /*Adds the row to the table*/
    rankingTable.appendChild(row);
});