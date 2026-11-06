class level4 extends Phaser.Scene {

    constructor() {
        super("level4");
    }

    //Receives the score from level 3
    init(data) {

        //Prevents multiple attacks at the same time
        this.isAttacking = false;
        this.score = data.score ?? 0;
        //Health for both fighters 
        this.playerHealth = 100;
        this.monsterHealth = 150;

        //Prevents attacks after the battle ends
        this.battleFinished = false;
        this.battleStarted = false;

        //Default weapon
        this.weapon = "sword";
    }

    preload() {

        //Loads the background and monster 
        this.load.image("level4background", "../assets/level4_background.png");
        this.load.image("Monster", "../assets/level4_boss.png");

        //Loads the final key and axe
        this.load.image("finalkey", "../assets/KEY.png");
        this.load.image("Axe", "../assets/axe.png");

        //Loads the battle sound
        this.load.audio("playerHit", "../assets/playerHit.ogg");
        this.load.audio("monsterHit", "../assets/monsterHit.flac");


    }

    create() {

        //Displays the final room
        this.add.image(400, 300, "level4background")
        .setDisplaySize(800, 600);

        //Displays the player's total score
        this.scoreText = this.add.text(
            620, 20,
            "Score: " + this.score,
            {

                fontSize: "22px",
                color: "#00ff66",
                fontFamily: "Arial"

            }
        );

        //Creates the monster
        this.monster = this.add.sprite(
            400, 300, "Monster"
        ).setDisplaySize(240, 260);


        //Monster health label
        this.monsterHealthText = this.add.text(
            400, 75,
            "MONSTER HP: 150/150",
            {
                fontSize: "22px",
                color: "#ff3333",
                fontFamily: "Arial"

            }
        ).setOrigin(0.5);

        //Player health label
        this.playerHealthText = this.add.text(
            20, 20,
            "YOUR HP: 100/100",
            {
                fontSize: "22px",
                color: "#00ff66",
                fontFamily: "Arial"

            }
        );

        //Displays battle instructions
        this.showInstructions();
        
    }

    //Displays the introduction before the battle
    showInstructions() {

        const panel = this.add.rectangle(
            400, 300, 650, 420, 0x000000, 0.9
        ).setDepth(20);

        const instructions = this.add.text(
            400, 260,
            "LEVEL 4 - THE FINAL BATTLE\n\n" +
            "The monster guards the final exit.\n\n" +
            "Choose your weapon and defeat it!\n" +
            "But beware... it will attack you too.\n\n" +
            "Defeat the monster to claim the final key.",
            {
                fontSize: "23px",
                fontFamily: "Arial",
                color: "#ffffff",
                align: "center",
                lineSpacing: 10,
                wordWrap: {width: 570}
            }
        ).setOrigin(0.5).setDepth(21);

        const startButton = this.add.text(
            400, 450,
            "START BATTLE",
            {
                fontSize: "26px",
                color: "#ffffff",
                backgroundColor: "#42305b",
                padding: { x: 20, y: 12}

            }
        )
        .setOrigin(0.5)
        .setDepth(21)
        .setInteractive({useHandCursor: true});

        startButton.on("pointerdown", () => {
            panel.destroy();
            instructions.destroy();
            startButton.destroy();

            this.startBattle();
        });
    }

    //Starts the fight
    startBattle() {

        this.battleStarted = true;

        //Weapon seletion 
        this.weaponText = this.add.text(
            400, 455,
            "Weapon: SWORD",
            {
                fontSize: "22px",
                color: "#ffffff",
                backgroundColor: "#000000",
                padding: { x: 12, y: 8}
            }
        ).setOrigin(0.5);

        this.swordButton = this.add.text(
            220, 520,
            "SWORD",
            {
                fontSize: "22px",
                color: "#ffffff",
                backgroundColor: "#42305b",
                padding: { x: 18, y: 10}
            }
        )
        .setOrigin(0.5)
        .setInteractive({useHandCursor: true});

        this.axeButton = this.add.text(
            400, 520,
            "AXE",
            {
                fontSize: "22px",
                color: "#ffffff",
                backgroundColor: "#42305b",
                padding: { x: 18, y: 10}
            }
        )
        .setOrigin(0.5)
        .setInteractive({useHandCursor: true});

        this.attackButton = this.add.text(
            500, 520,
            "ATTACK",
            {
                fontSize: "26px",
                color: "#ffffff",
                backgroundColor: "#8b0000",
                padding: { x: 18, y: 10}
            }
        )
        .setOrigin(0.5)
        .setInteractive({useHandCursor: true});

        //Selects the sword 
        this.swordButton.on("pointerdown", () => {
            this.weapon = "sword";
            this.weaponText.setText("Weapon: SWORD");

            //highlights the selected weapon
            this.swordButton.setBackgroundColor("#008844");
            this.axeButton.setBackgroundColor("#42305b");
        });
    
        //Selects the axe
        this.axeButton.on("pointerdown", () => {
            this.weapon = "axe";
            this.weaponText.setText("Weapon: AXE");

            //highlights the selected weapon
            this.axeButton.setBackgroundColor("#008844");
            this.swordButton.setBackgroundColor("#42305b");
        });

        //Attacks the monster
        this.attackButton.on("pointerdown", () => {
            this.attackMonster();
        });

        //Sword is selected by default
        this.swordButton.setBackgroundColor("#008844");

    }

    //Player attacks the monster
    attackMonster() {

        //Prevents attacking during another turn
        if (this.battleFinished || !this.battleStarted || this.isAttacking) {
            return;
        }

        this.isAttacking = true;

        //Damage depends on the selected weapon
        const damage = this.weapon === "axe" ? 30 : 20;

        //Reduces monster health
        this.monsterHealth = Math.max(0, this.monsterHealth - damage);

        //Updates monster health display
        this.monsterHealthText.setText(
            "MONSTER HP: " + this.monsterHealth + "/150"
        );

        //Plays player attack sound and monster hurt animation
        this.sound.play("playerHit", { volume: 0.35 });

        this.monster.setTexture("Monster");
        this.monster.setVisible(true);
        this.monster.setAlpha(1);
        this.monster.setDisplaySize(240, 260);

        this.monster.setTint(0xff3333);

        this.time.delayedCall(300, () => {
            this.monster.clearTint();

            //If the monster is defeated, end the battle
            if (this.monsterHealth <= 0) {
                this.winBattle();
                return;
            }

            //Otherwise the monster takes its turn
            this.monsterAttack();
        });
    }

    //Monster attacks after the player's turn
    monsterAttack() {

        if (this.battleFinished || !this.battleStarted) {

            return;
        }

        //Damage is applied immediately
        this.playerHealth = Math.max(0, this.playerHealth - 15);

        this.playerHealthText.setText(
                "YOUR HP: " + this.playerHealth + "/100"
        );

        //Plays monster attack sound
        this.sound.play("monsterHit", { volume: 0.4 });

        //Red flash to indicate damage
        this.cameras.main.flash(150, 180, 0, 0);

        //Monster remains visible
        this.monster.setTexture("Monster");
        this.monster.setVisible(true);
        this.monster.setDisplaySize(240, 260);

        //wait briefly before allowing another attack
        this.time.delayedCall(500, () => {

            if (this.playerHealth <= 0) {
                this.loseBattle();
                return;
            }
            //Unlock the attack button for the next turn
            this.isAttacking = false;
        });
    }

    //Player defeats the monster
    winBattle(){

        this.battleFinished = true;
        this.battleStarted = false;

        //Removes battle buttons
        this.swordButton.destroy();
        this.axeButton.destroy();
        this.attackButton.destroy();
        this.weaponText.destroy();
        
        //Monster fades away when defeated
        this.tweens.add({
            targets: this.monster,
            alpha: 0,
            y: 350,
            duration: 1200,

            onComplete: () => {

                this.monster.destroy();

                //Displays the final key
                this.showFinalKey();
            }
        });
    }

    //Shows the final key after victory
    showFinalKey() {

        //Award 100pts for completing level 4
        this.score += 100;
        this.scoreText.setText("Score: " + this.score);

        this.add.text(
            400, 170,
            "THE MONSTER HAS BEEN DEFEATED",
            {
                fontSize: "25px",
                color: "#00ff66",
                backgroundColor: "#000000",
                padding: {x: 12, y: 8}
            }
        ).setOrigin(0.5);

        //Displays the key
        const key = this .add.image(
            400, 320, "finalkey"
        )
        .setDisplaySize(90, 65)
        .setInteractive({useHandCursor: true});

        this.add.text(
            400, 405,
            "CLICK THE KEY TO ESCAPE",
            {
                fontSize: "22px",
                color: "#ffffff",
                backgroundColor: "#000000",
                padding: {x: 12, y: 8}
            }
        ).setOrigin(0.5);

        key.on("pointerdown", () => {
            this.finishGame();
        });
    }

    //Final ending of The Silent House
    finishGame() {

        this.children.removeAll(true);

        this.add.image(
            400,300, "level4background"
        ).setDisplaySize(800, 600);

        this.add.rectangle(
            400, 300, 680, 350, 0x000000, 0.9
        );
        
        this.add.text(
            400, 300, "YOU ESCAPE THE SILENT HOUSE!\n\n" +
            "FINAL SCORE: " + this.score,
            {
                fontSize: "30px",
                color: "#00ff66",
                fontFamily: "Arial",
                align: "center"
            }
        ).setOrigin(0.5);

        //Gets the username of the logged-in player
        const username = sessionStorage.getItem("currentPlayer") || "Guest";

        //Saves the final score
        localStorage.setItem("silentHouseCurrentScore", this.score);

        //Saves the completed game for the logges-in player
        const progressKey = "silentHouseProgess_" + username;

        const completedProgress ={
            level: 4,
            score: this.score,
            completed: true
        };

        //Stores the completed progress
        localStorage.setItem(
            progressKey,
            JSON.stringify(completedProgress)
        );
        console.log("Game completed! Progress saved.");

        //Gets the existing leaderboard
        let leaderboard = JSON.parse(
            localStorage.getItem("silentHouseLeaderboard")
        ) || [];

        const existingPlayer = leaderboard.find(
            player => player.name === username 
        );

        if (existingPlayer) {
            //Updates the score only if the new score is higher
            if (this.score > existingPlayer.score) {
                existingPlayer.score = this.score;
            }
        } else {
            //Adds a new player to the leaderboard
            leaderboard.push({
                name: username,
                score: this.score 
            });
        }
        //Saves the updated leaderboard 
        localStorage.setItem(
            "silentHouseLeaderboard",
            JSON.stringify(leaderboard)
        );

        //Creates a return to homepage button
        const  homeButton = this.add.text(

            400, 480, 
            "RETURN TO HOMEPAGE",
            {
               fontSize: "24px",
               color:"#ffffff",
               backgroundColor: "#425c5b",
               padding: {x: 20, y: 12}
            }
        )
        .setOrigin(0.5)
        .setDepth(100)
        .setInteractive({useHandCursor: true});

        //Redirects the player to the homepage
        homeButton.on("pointerdown", () => {
            window.location.href = "../index.html";
        });

        
    }

    //Player loses the battle
    loseBattle() {
        this.battleFinished = true;
        this.battleStarted = false;

        this.children.removeAll(true);

        this.add.image(
            400,300, "level4background"
        ).setDisplaySize(800, 600);

        this.add.rectangle(
            400, 300, 680, 300, 0x000000, 0.9
        );
        
        this.add.text(
            400, 260, "GAME OVER\n\nTHE MONSTER DEFEATED YOU",
            {
                fontSize: "30px",
                color: "#ff3333",
                fontFamily: "Arial",
                align: "center"
            }
        ).setOrigin(0.5);

        //Restart button
        const restartButton = this.add.text(
            400, 420, "RESTART LEVEL 4",
            {
                fontSize: "24px",
                color: "#ffffff",
                backgroundColor: "#42305b",
                padding: {x: 20, y: 12}
            }
        )
        .setOrigin(0.5)
        .setInteractive({useHandCursor: true});

        restartButton.on("pointerdown", () => {
            this.scene.restart({score: this.score });
        });

    }
}
