console.log("My js is working");
//Creates the first scene of the silent house
class SilentHouse extends Phaser.Scene
{
    constructor ()
    {
        super("SilentHouse");
    }

    enableCupSelection() {

        //Stores all three cups
        const cups = [this.cup1, this.cup2, this.cup3];

        //Makes each cup clickable
        cups.forEach((cup) => {

            //Removes the previous click listener
            cup.removeAllListeners("pointerdown");

            //Enables mouse interaction
            cup.setInteractive({useHandCursor: true});


            //Detects when the player clicks the cup
            cup.on("pointerdown", () => {
                
               //Prevents the player from selecting another cup
                cups.forEach((othercup)=> {
                    othercup.disableInteractive();
                });

                //Moves the selected cup upwards
                this.tweens.add({
                    targets: cup,
                    y: 290,
                    duration: 500,
                    ease: "Power2",

                    //Reveals the apple fter the cup moves
                    onComplete: () => {

                       //Reveals the selected apple
                        cup.apple.setVisible(true);

                        //Check the selected apple
                        this.checkApple(cup);
                    }
                });

            });
        });
    }

    //checking whether the selected apple is good or not
    checkApple(cup) {

        //Increases the attempt counter
        this.attempts++;

        //Checks whether the player selected the rotten apple
        if (cup.apple.texture.key == "rottenApple") {

            //Calculate how many lives are remaining
            const remaininglives = 2 - this.attempts;

            //Updates the lives displayes on the screen
            this.livestext.setText("❤️".repeat(remaininglives) + "Lives: " + remaininglives);

            //Changes the message color to red
            this.messageText.setColor("#ff3333");

            //checking if the player has another chance
            if(this.attempts < 2) {

                this.messageText.setText("Rotten apple! One chance remaining.");

                //Gives the player another attempt
                this.retryAttempt(cup);

            } else{

                this.messageText.setText("Game over! Restart level 1.");

                //Waits 3 secs before restarting the level
                this.time.delayedCall(3000, () => {

                    //Restarts level 1
                    this.scene.restart();
                });
            }
        } else {

            //Awards point for choosing good apple
            this.score = 100;

            //Updates the score displayes on the screen
            this.scoreText.setText("Score: " + this.score);

            //Vhanges the message color to green
            this.messageText.setColor("#00ff66");

            this.messageText.setText("Good apple! You earned 100 points");
        }
    }

    //Allowing a second chance to the player after selecting the rotten apple
    retryAttempt(cup) {

        //Waits 2 secs before restarting the shuffle
        this.time.delayedCall(2000, () => {

            //Hides the message 
            this.messageText.setText("");

            //Moves the selected cup back over its apple
            this.tweens.add({
                targets: cup,
                y: 370,
                duration: 500,
                ease: "Power2",

                //Runs when the cup finishes moving
                onComplete: () => {

                    //Hides the revealed apple
                    cup.apple.setVisible(false);

                    //Shuffles the cups again
                    this.startShuffling();
                }
            });
        });
    }


    //Loads the image before the scene starts
    preload() {
    //loads the background image for level 1
    this.load.image("level1Background", "../assets/level1.png");

    //Loads the good apple image
    this.load.image("goodApple", "../assets/Apple.png");
    this.load.image("goodApple1", "../assets/Apple.png");

    //loads the rotten apple image
    this.load.image("rottenApple", "../assets/apple1.png");

    //Loads the cup image
    this.load.image("cup1", "../assets/cup.png");
    this.load.image("cup2", "../assets/cup.png");
    this.load.image("cup3", "../assets/cup.png");
    }

    //Runs when the scene starts
    create ()
    {

        //keeping track of the player's attempt
        this.attempts = 0;

        //stores the player's score
        this.score = 0;

        //Displays the player's remaining lives
        this.livestext = this.add.text(30 , 20, "Lives: ❤️❤️", {
            fontSize: "22px",
            fontFamily: "Arial",
            color: "#ffffff"
        });

        //Displays the score
        this.scoreText = this.add.text(600, 20, "Score: 0", {
            fontSize: "22px",
            fontFamily: "Arial",
            color: "#ffffff"
        });

        //keeps the lives and score in the background
        this.livestext.setDepth(10);
        this.scoreText.setDepth(10);

        //Creates a messagefor the player
        this.messageText = this.add.text(400, 100, "", {
            fontSize: "24px",
            color: "#ffffff",
            fontFamily: "Arial",
            backgroundColor: "#000000",
            padding: {x:15, y:10},
            align: "center"
        });

        //Centers the message horizontally
        this.messageText.setOrigin(0.5);

        //Keeps the message above the game objects
        this.messageText.setDepth(10);

        //Sets the background color of the game
        this.cameras.main.setBackgroundColor("#180b0b");

        //Displays the level 1 background 
        const background = this.add.image(
            400, 
            300,
            "level1Background"
        );

        //resize the background to fit the game screen
        background.setDisplaySize(800,600);

        //Displays the first good apple
        this.apple1 = this.add.image(250,370, "goodApple")
        .setDisplaySize(65, 65);

        //Displays the rotten apple
        this.apple2 = this.add.image(400, 370, "rottenApple")
        .setDisplaySize(65, 65);

        //Displays the second good apple
        this.apple3 = this.add.image(550,370, "goodApple1")
        .setDisplaySize(65, 65);

        //displays the 3 cups
        this.cup1 = this.add.image(250, 320, "cup1")
        .setDisplaySize(85, 85);
        this.cup2 = this.add.image(400, 320, "cup2")
        .setDisplaySize(85, 85);
        this.cup3 = this.add.image(550, 320, "cup3")
        .setDisplaySize(85, 85);

        //associates each cup with the apple hidden underneath
        this.cup1.apple = this.apple1;
        this.cup2.apple = this.apple2;
        this.cup3.apple = this.apple3;

        //waits 3 seconds before covering the apples
        this.time.delayedCall(3000, () => {

            //Moves all three cups down over the apples
            this.tweens.add({
                targets: [this.cup1, this.cup2, this.cup3],
                y: 370,
                duration: 1000,
                ease: "Power2",

                //Runs when the cups finish covering the apples
                onComplete: () => {
                    //Hides the apples pnce he cups cover them
                    this.apple1.setVisible(false);
                    this.apple2.setVisible(false);
                    this.apple3.setVisible(false);

                    //Starts the shuffle
                    this.startShuffling();
                }
            });

        });

    }


    //function to shuffle two cups
    shuffleCups(cupA, cupB, onComplete) {

     //Stores the original horizontal positions
     const positionA = cupA.x;
     const positionB = cupB.x;
 
     //Moves the first cup to the second cup's position
     this.tweens.add({
        targets: [cupA, cupA.apple],
        x: positionB,
        duration: 700,
        ease: "Power2",

        //Runs when the shuffle finishes
        onComplete: onComplete
     });

     //Moves the second cup to the first cup's position
     this.tweens.add({
        targets: [cupB,cupB.apple],
        x: positionA,
        duration: 700,
        ease: "Power2"
     });
    }

    //Shuffles the cups three times
    startShuffling() {
        //Stores all three cups
        const cups = [this.cup1, this.cup2, this.cup3];

        //Keeps track of how many shuffles have happened
        let shuffleCount = 0;

        //keeps track of how many shuffles have happened 
        let shuffleOnce = () => {

            //Stops after three shuffles
            if (shuffleCount >= 3) {

                //Allows the player to choose a cup
                this.enableCupSelection();

                return;
            }

            //Chooses the first random cup
            const firstIndex = Phaser.Math.Between(0,2);

            //chooses a different second cup
            let secondIndex = Phaser.Math.Between(0,2);

            while (secondIndex == firstIndex) {
                secondIndex = Phaser.Math.Between(0, 2);

            }

            //Swaps the two selected cups
            this.shuffleCups(
                cups[firstIndex],
                cups[secondIndex],
                () => {
                    //Increases the shuffle count
                    shuffleCount++;

                    //Starts the next shuffle
                    shuffleOnce();
                }
            );
        };

        //Starts the first shuffle
        shuffleOnce();
    }

}

 //Configuration of the Phaser game
 const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',

    //Scales the game to fit the available space
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: [SilentHouse]
 };

 // Creates and starts the phaser game
 const game = new Phaser.Game(config);

