/*Stores the player's current score*/
let score = Number(localStorage.getItem("silentHouseCurrentScore")) || 0;

//Displays the current player's score
const currentScore = document.getElementById("currentScore");
currentScore.textContent = "Your score: " + score;

/*Gets the existing leaderboard*/
let leaderboard = JSON.parse(
    localStorage.getItem("silentHouseLeaderboard")
) || [];

/*Sorts scores from highest to lowest*/
leaderboard.sort(function(a,b) {
    return b.score - a.score;
});

//Finds the leaderbord table
const rankingTable = document.getElementById("rankingTable");

//Displays the ranking table
leaderboard.forEach(function(player, index) {

    /*Creates a new table row*/
    let row = document.createElement("tr");

    /*Adds the rank, player name and score*/
    row.innerHTML =
        "<td>" + (index + 1) + "</td>" +
        "<td></td>" +
        "<td>" + player.score + "</td>";

        //Displays the username safely as text
        row.cells[1].textContent = player.name;

        /*Adds the row to the table*/
        rankingTable.appendChild(row);
});