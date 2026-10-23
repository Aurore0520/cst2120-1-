//Creates the first scene of the silent house
class SilentHouse extends Phaser.Scene
{
    constructor ()
    {
        super("SilentHouse");
    }


    //Runs when the scene starts
    create ()
    {
        //Sets the background color of the game
        this.cameras.main.setBackgroundColor("#180b0b");

        //Displays the game title
        this.add.text(400, 200, "THE SILENT HOUSE", {
            fontSize:"36px",
            color: "#ff3333",
            fontStyle: "bold"
        }).setOrigin(0.5);

        //Displays a welcome message
        this.add.text(400, 270,
            "You have entered the house..",
            {
                fontSize: "20px",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

        //Displays a message confirming Phaser is working
        this.add.text(400, 350,
            "Your nightmare begins here.",
            {
                fontSize: "18px",
                color: "#aaaaaa"
            }
        ).setOrigin(0.5);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: [SilentHouse]
};

// Creates and starts the phaser game
const game = new Phaser.Game(config);
