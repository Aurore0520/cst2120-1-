//Creates level 2 of the silent house
class level2 extends Phaser.Scene
{
    constructor ()
    {
        super("level2");
    }

    //init will receive information from level 1
    init(data) {

        //Stores the score received from level 1
        this.score = data.score ?? 0;

        //String the points available in level 2
        this.levelPoints = 100;

        //Counting how many questions were answered correctly
        this.correctAnswers = 0;

        //Counts the number of incorrect answers
        this.wrongAnswers = 0;

        //Number of correct answers needed to complete level 2
        this.requiredAnswers = 5;
    }

    //Loads images and sounds for level 2
    preload() {

        //loads the background image for level 1
        this.load.image("level2Background", "../assets/classroom.png");
        
        //loads sound
        this.load.audio("correct", "../assets/winning2.mp3");
        this.load.audio("wrong", "../assets/wrong2.mp3");

    }

    //Displays the maths question
    showQuestion(){

        //removing the previous question
        if (this.questionBackground) {
            this.questionBackground.destroy();
            this.questionText.destroy();
            this.questionNumberText.destroy();

            this.answerButtons.forEach((button) => {
                button.destroy();
            });
        }

        //Gets the current question from the array
        const current = this.questions[this.currentQuestion];

        //dark panel behind the question
        this.questionBackground = this.add.rectangle(
            400, 300, 650, 400, 0x000000, 0.85
        );

        //Displays progress
        this.questionNumberText = this.add.text(
            400, 155,
            "CORRECT ANSWERS: " + this.correctAnswers +  "/5",
            {
                fontSize: "20px",
                color: "#d4a5ff",
                fontFamily: "arial"
            }
        ).setOrigin(0.5);

        //Displays the question
        this.questionText = this.add.text(
            400, 200,
            current.question,
            {
                fontSize: "28px",
                fontFamily: "Arial",
                color: "#ffffff",
                align: "center",
                wordWrap: {width: 580}
            }
        ).setOrigin(0.5);

        //Stores the answer tex objects
        this.answerButtons =[];

        //Displays all 4 possible answers
        current.answers.forEach((answer, index) => {

            //Positions the answers vertically
            const xPosition = 275 + (index % 2) * 250;
            const yPosition = 340 + Math.floor (index / 2) * 90;

            //Creates an answer option
            const answerButton = this.add.text(
                xPosition,
                yPosition,
                answer,
                {
                    fontSize: "26px",
                    color: "#ffffff",
                    backgroundColor: "#42305b",
                    padding: {x: 55, y: 15}
                }
            )
            .setOrigin(0.5)
            .setDepth(5)
            .setInteractive({useHandCursor: true});

            //Checks the selected answer
            answerButton.on("pointerdown", () => {
                this.checkAnswer(answer);
            });

            //Storing the answer option for later
            this.answerButtons.push(answerButton);
        });
    }

    create() {

        //Setting the background color
        this.cameras.main.setBackgroundColor("#180b0b");

        //Displays the classroom background
        const background = this.add.image(
            400, 300,"level2Background"
        );

        //Makes the image fit the screen
        background.setDisplaySize(800, 600);

        background.setDepth(-1);

        //Dark background for instructions
        const instructionBackground = this.add.rectangle(
            400, 300, 650, 420, 0x000000, 0.9
        ).setDepth(20);

        //Displays the instructions for level 2
        const instructions = this.add.text(
            400, 250,
            "LEVEL 2 - THE ABANDONNED CLASSROOM\n\n" +
            "Welcome to the abandonned classroom!\n\n" +
            "Answer 5 maths questions correctly to escape.\n" +
            "30 points will be deducted for every wrong answer\n" +
            "You will need at least 100 points to unlock level 3.\n\n" +
            "YOUR KNOWLEDGE IS YOUR ONLY ESCAPE!", 
            { 
                fontSize: "19px",
                color: "#ffffff",
                fontFamily: "Arial",
                align: "center",
                lineSpacing: 8,
                wordWrap: {width: 580}
            }
        ).setOrigin(0.5).setDepth(21);

        //start level button
        const startButton = this.add.text(
            400, 440, "START LEVEL",
            {
                fontSize: "26px",
                color: "#ffffff",
                fontFamily: "Arial",
                backgroundColor: "#42305b",
                padding: {x: 20, y: 12}
            }
        )
        .setOrigin(0.5)
        .setDepth(21)
        .setInteractive({useHandCursor: true});

        //runs when the player click the button
        startButton.on("pointerdown", () => {

            //Removes instructions screen
            instructionBackground.destroy();
            instructions.destroy();
            startButton.destroy();

            //Displays the first maths question
            this.showQuestion();

        });

        //Storing maths questions 
        this.questions = [

            //question 1 - easy
            {
                question: "What's 10 + 3?",
                answers: ["9", "13", "16", "18"],
                correctAnswer: "13"
            },

            //question 2 - easy
            {
              question: "What's 10 - 3?",
              answers: ["4", "6", "13", "7"],
              correctAnswer: "7"
            },

            //Question 3 - medium
            {
              question: "What's 8 * 9?",
              answers: ["62", "56", "64", "72"],
              correctAnswer: "72"
            },

            //Question 4 - medium
            {
              question: "Solve for x: 3x + 5 = 20",
              answers: ["10", "5", "20", "25"],
              correctAnswer: "5"
            },

            //Question 5 - medium
            {
              question: "What's 84/6?",
              answers: ["8", "14", "16", "24"],
              correctAnswer: "14"
              
            },

            //Question 6 - Hard
            {
              question: "Solve for x: 4x - 7 = 21",
              answers: ["5", "6", "7", "8"],
              correctAnswer: "7"
            },

            //Question 7 - Hard
            {
              question: "What's (12 + 8) * 3?",
              answers: ["36", "48", "60", "72"],
              correctAnswer: "60"
            },

            //Question 8 - Hard
            {
              question: "What's 15% of 200?",
              answers: ["8", "15", "20", "30"],
              correctAnswer: "30"
            }
        ];

        //Keeping track of which question the player is answering
        this.currentQuestion = 0;

        //Displays the current total score
        this.scoreText = this.add.text(
            650, 30,
            "Score: " + (this.score + this.levelPoints),
            {
                fontSize: "26px",
                color: "#00ff66",
                fontFamily: "Arial"
            }
        ).setOrigin(0.5);
    }

    //Checking if the player can unlock level 3
    finishLevel() {

        //Calculates the player's final score
        const finalScore = this.score + this.levelPoints;

        //Removes the final question
        this.questionBackground.destroy();
        this.questionText.destroy();
        this.questionNumberText.destroy();

        this.answerButtons.forEach((button) => {
            button.destroy();
        });

        //Dark panel for the result screen
        this.add.rectangle(
            400, 300, 650, 420, 0x000000, 0.9
        );

        //calculating final score
        if (finalScore >= 100 &&
             this.correctAnswers >= this.requiredAnswers) {


            this.add.text( //displays victory message
                400, 240,
                "LEVEL 2 COMPLETED!\n\n" +
                "You survived the abandonned classroom!\n\n" +
                "Final score: " + finalScore,
                {
                    fontSize: "25px",
                    color: "#00ff66",
                    fontFamily: "Arial",
                    align: "center"
                }
            ).setOrigin(0.5);

            //Creates the continue button
            const continueButton = this.add.text(
                400, 440,
                "CONTINUE TO LEVEL 3",
                {
                    fontSize: "24px",
                    color: "#ffffff",
                    fontFamily: "Arial",
                    backgroundColor: "#245c3b",
                    padding: {x: 20, y: 12}

                }
            )
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true});

            //Start level 3
            continueButton.on("pointerdown", () => {

                //Transfers the final score to level 3
                this.scene.start("level3", {
                    score: finalScore 
                });
            });

        } else {

            this.add.text(
                400, 240,
                "GAME OVER!\n\n" + 
                "You failed to escape the classroom\n\n" +
                "Final score: " + finalScore,
                { 
                        fontSize: "25px",
                        color: "#ff3333",
                        fontFamily: "Arial",
                        align: "center"
                }
            ).setOrigin(0.5);

            //Restart button
            const restartButton = this.add.text(
                400, 440,
                "RESTART GAME",
                {
                    fontSize: "24px",
                    color: "#ffffff",
                    fontFamily: "Arial",
                    backgroundColor: "#7a2020",
                    padding: {x: 20, y: 12}

                }
            )
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true});

            //Restarts game from level 1
            restartButton.on("pointerdown", () => {

                //starts level one with fresh score
                this.scene.start("SilentHouse");
            });
        }

    }
    

    checkAnswer(selectedAnswer) {

        const current = this.questions[this.currentQuestion];

        //Prevents the same question from being answered twice
        this.answerButtons.forEach((button) => {
            button.disableInteractive();
        });


        //Checks the selected answer
        if (selectedAnswer === current.correctAnswer) {

            //Increase the number of correct answer
            this.correctAnswers++;

            //Show green when answer is correct
            this.questionText.setColor("#00ff66");

            //play soft sound
            this.sound.play("correct", {volume:0.2});


        } else {

            //Counts the incorrect answer
            this.wrongAnswers++;

            //Show red color when answer is incorrect
            this.questionText.setColor("#ff3333");

            //plays incorrect sound
            this.sound.play("wrong", {volume: 0.3});

            //Deducts 30 points
            this.levelPoints -= 30;
        }

        //updates the score after either answer
        this.scoreText.setText(
            "Score: " + (this.score + this.levelPoints)
        );

        //waits before displaying the next question
        this.time.delayedCall(800, () => {

            //Checks whether the player has answered 5 correctly
            if (this.correctAnswers >= this.requiredAnswers) {

               this.finishLevel();

            } else{

               //Moves to the next question
               this.currentQuestion++;

               //checks whether there are questions remaining
               if (this.currentQuestion >= this.questions.length) {
                    //ends the level
                    this.finishLevel();

                } else {

                   //Displays the next question
                   this.showQuestion();

                }
            }
        });
    }
}



