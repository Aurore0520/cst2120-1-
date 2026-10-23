//Creates the first scene of the silent house
class SilentHouse extends Phaser.Scene
{
    constructor ()
    {
        super("SilentHouse");
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

