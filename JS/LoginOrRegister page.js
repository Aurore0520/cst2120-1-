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
    const existingUser = users.find(user => user.username === username);

    //Displays a message if the username is already taken
    if(existingUser) {
      registerMessage.textContent = "This username is already taken. Please choose a diferent one.";
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

        //Clears the registration form
        registerForm.reset();
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

        //Clears the login form
        loginForm.reset();
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
