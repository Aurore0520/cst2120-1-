//Fetch the login form from the login page.html
const loginForm = document.getElementById("loginForm");

//Fetch the registration form from the login page.html
const registerForm = document.getElementById("registerForm");

//Fetch the paragraph used to display messages
const loginMessage = document.getElementById("loginMessage");

//Fetch the paragraph used to display message 
const registerMessage = document.getElementById("registerMessage");

//Function to register new user 
function registerUser(event) {

    //Prevents the page from refreshing when the form is submitted
    event.preventDefault();
    
    //Gets the password and username entered by the user
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    //Gets the list of registered users from the localstorage
    let users = JSON.parse(localStorage.getItem("silentHouseUsers")) || [];

    //Checks whether the username already exists
    const existingUser = users.find(function(user) {
        return user.username.toLowerCase() === username.toLowerCase();
    });

    //Displays a message if the username is already taken
    if(existingUser) {
      registerMessage.textContent = "This username is already taken. Please choose a diferent one.";
      registerMessage.style.color = "#f44336";
    }

    //Registers the user if the username is available
    else {
      users.push({
         username: username,
         password: password
        });
        
        //Saves the registered users in the browser
        localStorage.setItem("silentHouseUsers", JSON.stringify(users));

        //Displays a success message
        registerMessage.textContent = "Registration successful! You can now login in.";
        registerMessage.style.color = "#4caf50";

        //Clears the registration form
        registerForm.reset();
    }

}

//Checks whether the username is available while typing
function checkUsername() {

    //Gets the username entered by the player
    const username = document.getElementById("registerUsername").value.trim();

    //Gets the registered users from local storage
    let users = JSON.parse(localStorage.getItem("silentHouseUsers")) || [];

    //Checks if the username is already exists
    const existingUser = users.find(function(user) {
        return user.username.toLowerCase() === username.toLowerCase();
    });

    //Checks whether the username field is empty
    if (username === "") {
        registerMessage.textContent = "";
    }

    //Displays a message if the username is taken
    else if (existingUser) {
        registerMessage.textContent = "This username is already taken.";
        registerMessage.style.color = "#f44336";
    }

    //Displays a message if the username is available
    else {
        registerMessage.textContent = "Username is available!";
        registerMessage.style.color = "#4caf50";
    }
}
//Function to log in an existing account
function loginUser(event) {

    //Prevents the page from refreshing when the form is being submitted
    event.preventDefault();

    //Gets the username and password entered by the user
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    //Gets the list of registered users from the browser
    let users = JSON.parse(localStorage.getItem("silentHouseUsers")) || [];

    //Searches for a user with mayching login details
    const foundUser = users.find(function(user){
        return user.username == username && user.password == password;
    });

    //Checks whether the login details are correct
    if (foundUser) {
        loginMessage.textContent = "Login successful! Welcome to The Silent House.";

        //Saves login status in the browser
        localStorage.setItem("silentHouseLoggedIN", "true");

        //Stores the username of the logged-in player
        sessionStorage.setItem("currentPlayer", username);


        //Clears the login form
        loginForm.reset();

        //wait before starting the game
        setTimeout(() => {
            window.location.href = "GAME/game.html";
        }, 1000);
    }

    //Displays an error message if the details are incorrect
    else{
        loginMessage.textContent = "Incorrect username or password. Please try again.";

    }

}

//Calls the registration function when the registration form is submitted
registerForm.addEventListener("submit", registerUser);

//Calls the lofin funcion when the login form is submitted
loginForm.addEventListener("submit", loginUser);

//Checks the username availability whenever the player types
document.getElementById("registerUsername")
.addEventListener("input", checkUsername);
