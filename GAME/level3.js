class level3 extends Phaser.Scene {

    constructor() {
        super("level3");
    }

    //Receives the score from level 2
    init(data) {
        this.score = data.score ?? 0;
        this.timeRemaining = 5 * 60;
        this.pin = "";
        this.correctPin = "4826";
        this.gameFinished = false;
        this.timerEvent = null;
    }

    preload() {
        //Loads the bedroom background
        this.load.image("level3background", "../assets/Level3background.png");

         //Loads the theme music
        this.load.audio("bedroomMusic", "../assets/horrortheme1.wav");

        //Loads the clock ticking sound
        this.load.audio("clockTick", "../assets/Slow Office Clock Tick Sfx.wav");

        //Loads the keypad button sound
        this.load.audio("keypad", "../assets/keypadbeep.mp3");

        //Loads the door unlocking sound
        this.load.audio("doorUnlock", "../assets/unlocked.mp3");
    }

    create() {
        //Displays the bedroom
        this.add.image(400, 300, "level3background")
        .setDisplaySize(800, 600)
        .setDepth(-1);

        //Creates the score display
        this.scoreText = this.add.text(
            620, 20, "Score: " + this.score,
            {
                fontSize: "22px",
                color: "#00ff66",
                fontFamily: "Arial"
            }
        ).setDepth(5);

        //Creates the countdown display
        this.timerText = this.add.text(
            20, 20, "Time: 5:00",
            {
                fontSize: "24px",
                color: "#ffffff",
                fontFamily: "Arial"
            }
        ).setDepth(5);

        //Shows the instructions first
        this.showInstructions();
    }

    //Creates a reusable clickable button
    createButton(x, y, label, callback, color= "#42305b") {

        const button = this.add.text(x, y, label, {
            fontSize: "21px",
            color: "#ffffff",
            fontFamily: "Arial",
            backgroundColor: color,
            padding: {x:15, y:10},
            align: "center"
        })
        .setOrigin(0.5)
        .setInteractive({useHandCursor: true});

        button.on("pointerdown", callback);

        return button;

    }

    //Shows the instructions before starting
    showInstructions() {
        const panel = this.add.container(400, 300);

        const background = this.add.rectangle(
            0, 0, 650, 420, 0x000000, 0.93
        );

        const instructions = this.add.text(
            0, -65,
            "LEVEL 3 - THE SECRET CODE\n\n" +
            "You are trapped inside a mysterious bedroom.\n\n" +
            "Investigate the objects to discover four digits.\n" +
            "The clues will reveal the code in order.\n\n" +
            "You have 5 minutes to unlock the door.\n" +
            "If the time runs out, you restart from level 1.\n\n" +
            "THE CLOCK IS TICKING...",
            {
                fontSize: "19px",
                color: "#ffffff",
                fontFamily: "Arial",
                lineSpacing: 7,
                wordWrap: {width: 570},
                align: "center"
            }

        ).setOrigin(0.5);

        panel.add([background, instructions]);
        panel.setDepth(20);

        const startButton = this.createButton(
            400, 400, "START LEVEL", () => {

                panel.destroy();
                startButton.destroy();
                
                //Starts the actual puzzle
                this.startPuzzle();
            }
        );

        startButton.setDepth(21);
    }

    //Starts the bedroom puzzle
    startPuzzle(){

        //Creates the theme music
        this.bedroomMusic = this.sound.add("bedroomMusic", { 
            volume: 0.15,
            loop: true 
        });

        //Creates the ticking clock sound
        this.clockSound = this.sound.add("clockTick", {
            volume: 0.25,
            loop: true 
        });

        //Starts the music
        this.bedroomMusic.play();

        this.clockSound.play();

        //Displays the title
        this.add.text(
            400, 65, "FIND THE FOUR-DIGIT CODE",
            {
                fontSize: "25px",
                color: "#ffffff",
                fontFamily: "Arial",
                backgroundColor: "#000000",
                padding: {x: 12, y: 8}
            }
        ).setOrigin(0.5);

        //Stores clues discovered by the player
        this.foundClues = new Set();

        //Clickable objects in the bedroom
        this.clues = [
            {
                name: "DIARY",
                digit: "4",
                order: 1 ,
                x: 475,
                y: 310,
                message: "A diary entry reads:\nThe fisrt digit is 4."
            },
            {
                name: "WARDROBE",
                digit: "8",
                order: 2 ,
                x: 645,
                y: 200,
                message: "Inside the wardrobe, you find:\nThe second digit is 8."
            },
            {
                name: "MIRROR",
                digit: "2",
                order: 3 ,
                x: 755,
                y: 265,
                message: "A message appear in the mirror:\nThe third digit is 2."
            },
            {
                name: "BED",
                digit: "6",
                order: 4 ,
                x: 180,
                y: 360,
                message: "Under the pillow is a note:\nThe fourth digit is 6."
            }
        ];

        //Creates invisible clickable areas
        this.clues.forEach((clue) => {

            const area = this.add.zone(
                clue.x, clue.y, 130, 130
            );

            area.setInteractive({
                useHandCursor: true
            });
            //reveals the clue when the player clicks on the object
            area.on("pointerdown", () => {
                this.inspectClue(clue);
            });
        });

        //Shows discovered clue count
        this.clueText = this.add.text(
            20, 65, "Clues: 0/4",
            {
                fontSize: "21px",
                color: "#ffffff",
                backgroundColor: "#000000",
                padding: {x:8, y:5},
            }
        );

        //Button for entering the code
        this.pinButton = this.createButton(
            400, 545, "ENTER CODE", () => {
                this.openKeypad();
            }
        );

        //Starts the 15-minute countdown
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    //Inspects an object and reveals its clue
    inspectClue(clue){
        if (this.gameFinished) {
            return;
        }

        this.foundClues.add(clue.name);

        this.clueText.setText(
            "Clues: " + this.foundClues.size + "/4"
        );

        this.showMessage(clue.message);

    }

    //Shows a message without pausing the timer
    showMessage(message) {
        const panel = this.add.container(400, 300);

        const background = this.add.rectangle(
            0, 0, 590, 220, 0x000000, 0.95
        );

        const text = this.add.text(
            0, -35, message,
            {
                fontSize: "23px",
                color: "#ffffff",
                fontFamily: "Arial",
                align: "center",
                wordWrap: { width: 520}

            }
        ).setOrigin(0.5);

        panel.add([background, text]);
        panel.setDepth(30);

        const closeButton = this.createButton(
            400, 365, "CLOSE", () => {
                panel.destroy();
                closeButton.destroy();
            }
        );
        closeButton.setDepth(31);
    }

    //Opens the code keypad
    openKeypad() {
        if (this.gameFinished || this.keypadOpen) {
            return;
        }
        this.keypadOpen = true;
        this.pin = "";

        const keypad = this.add.container(400, 300);

        const background = this.add.rectangle(
            0, 0, 450, 500, 0x000000, 0.96
        );

        const title = this.add.text(
            0, -205, "ENTER THE SECRENT CODE",
            {
                fontSize: "23px",
                color: "#ffffff",
                fontFamily: "Arial"
            }
        ).setOrigin(0.5);

        this.pinDisplay = this.add.text(
            0, -145, "_ _ _ _",
            {
                fontSize: "34px",
                color: "#00ff66",
                fontFamily: "Arial"
            }
        ).setOrigin(0.5);

        keypad.add([
            background,
            title,
            this.pinDisplay
        ]);

        //Creates number buttons
        const numbers = [
            "1", "2", "3",
            "4", "5", "6",  
            "7", "8",  "9",
            "C", "0",  "OK"
        ];

        numbers.forEach((number, index) => {

            const column = index % 3;
            const row = Math.floor(index / 3);

            const x = -105 + column *105;
            const y = -65 + row *75;

            const button = this.add.text(
                x, y, number,
                {
                    fontSize: "26px",
                    color: "#ffffff",
                    backgroundColor: "#42305b",
                    padding: {x: 25, y: 12}
                }
            )
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true});

            button.on("pointerdown", () => {
                this.sound.play("keypad", {
                    volume: 0.25
                });

                if (number == "C") {

                    //Clears the entered code
                    this.pin = "";

                } else if (number == "OK") {
                    //Check the entered code
                    this.checkPin();

                    return;


                } else if (this.pin.length < 4) {

                    //Adds the seleced digit
                    this.pin += number;
                }
                
                this.pinDisplay.setText(
                    this.pin.padEnd(4, "_").split("").join(" ")
                );
            });
            keypad.add(button);
        });

        keypad.setDepth(40);

        const closeButton = this.createButton(
            400, 530, "CLOSE KEYPAD", () => {
                keypad.destroy();
                closeButton.destroy();
                this.keypadOpen = false;
            }
        );

        closeButton.setDepth(41);

        //Stores references for cleanup
        this.keypad = keypad;
        this.keypadCloseButton = closeButton;
    }

    //Checks whether the code is correct
    checkPin() {
        if(this.pin.length !== 4) {

            this.pinDisplay.setText("ENTER 4 DIGITS");
                return;
                
        }

        if (this.pin === this.correctPin) {

            this.keypad.destroy();
            this.keypadCloseButton.destroy();
            this.keypadOpen = false;

            this.completeLevel();
        } else {

            //Incorrect Code 
            this.pin = "";
            this.pinDisplay.setText("WRONG CODE");
        }
    }

    //Updates the countdown
    updateTimer() {

        if (this.gameFinished) {
            return;
        }

        this.timeRemaining--;

        const minutes = Math.floor(
            this.timeRemaining / 60
        );

        const seconds = this.timeRemaining % 60;

        this.timerText.setText(
            "Time: " +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0")
        );

        //Warns the player when the time is running out
        if (this.timeRemaining <= 60) {
            this.timerText.setColor("#ff3333");
        }

        //Ends the game when the time runs out 
        if (this.timeRemaining <=0) {
            this.gameOver();
        }
    }

    //Completes level 3
    completeLevel() {

        this.gameFinished = true;
        this.timerEvent.remove();

        //Stops the bedroom music
        this.bedroomMusic.stop();
        this.clockSound.stop();

        //Plays the door unlocking sound
        this.sound.play("doorUnlock", {
            volume: 0.6
        });

        //Awards 100 pts for completing level 3
        this.score += 100;

        this.scoreText.setText(
            "Score: " + this.score
        );

        this.showEndScreen(
            "LEVEL 3 COMPLETED!\n\n" +
            "You unlocked the bedroom door.\n\n" +
            "final score: " + this.score,
            "CONTINUE TO LEVEL 4",
            () => {

                //Saves leve;4 as the next checkpoint
                saveProgress(4, this.score);
                
                this.scene.start("level4", {
                    score: this.score
                });
            },

            "#245c3b"
        );
    }
    //Ends the game when time runs out
    gameOver() {

        this.gameFinished = true;
        this.timerEvent.remove();

        //Stops the sounds when time runs out
        this.bedroomMusic.stop();
        this.clockSound.stop();

        this.showEndScreen(
            "TIME IS UP!\n\n" +
            "You failed to escape the bedroom.",
            "RESTART GAME",
            () => {
                clearProgrress();
                this.scene.start("SilentHouse");
            },
            "#7a2020"
        );
    }

    //Creates a reusable ending screen
    showEndScreen(message, buttonLabel, action, color) {


        const background = this.add.rectangle(
            400, 300, 700, 500, 0x000000, 0.95
        ).setDepth(90);

        const text = this.add.text(
            400, 260, message,
            {
                fontSize: "27px",
                color: "#ffffff",
                fontFamily: "Arial",
                aligh: "center",
                lineSpacing: 12
            }
        )
        .setOrigin(0.5)
        .setDepth(91);

        const button = this.createButton(
            400, 440, buttonLabel, action, color
        );

        button.setDepth(92);
    }
}