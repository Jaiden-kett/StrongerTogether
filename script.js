let sobrietyTimerInterval;
document.addEventListener("DOMContentLoaded", function(){
    navagation("goBackButton", "signup.html");
    navagation("logInButton", "login.html");
    navagation("returnToSignUpButton", "signup.html");
    navagation("signUpButton", "signup.html");
    
    const clearLocalSessionButton = document.getElementById("clearLocalStorage");
    if (clearLocalSessionButton) {
        clearLocalSessionButton.addEventListener("click", function () {
            alert("Local Storage has been cleared");
            localStorage.clear();
        });
    }
    const logInLogInButton = document.getElementById("logInLogInButton");
    if (logInLogInButton){
        logInLogInButton.addEventListener('click', function(){
            handleLogIn();
        });
    }
    const submitButton = document.getElementById("submitButton");
    if (submitButton) {  
        submitButton.addEventListener("click", function(event) {
            event.preventDefault();
            const username = document.getElementById("usernameInput").value.trim();
            if (!checkUsernameAvailability(username)) {
                return;
            }
            if (!repeatPasswordCorrect()){
                return;
            }
            if (validateForm()){
                saveInputValuesToSession();
                if (confirm("all info correect?")){
            
                }
        
                window.location.href = "confirm.html";
            }
        });
    }
    const confirmButton = document.getElementById("confirmButton");
    if (confirmButton) {
        confirmButton.addEventListener("click", function () {
            moveSessionToLocal();
            alert("Information confirmed");
            window.location.href = "home.html";
        });
    }

    const resetTimerButton = document.getElementById("resetTimerButton");
    if (resetTimerButton){
        resetTimerButton.addEventListener("click", function(){
            resetSobrietyTimer();
        });
    }       
    disclaimerText();
    fillConfirmFields();
    fillHomeHeadingText();
    daysSober(); 
    reasonForSoberText();
});
function disclaimerText(){
    const disclaimerText = document.getElementById("disclaimerText");
    disclaimerText.textContent = "For immediate support, call the SAMHSA National Helpline at 1-800-662-HELP (4357) or the Suicide & Crisis Lifeline at 988";
}
function reasonForSoberText() {
    const user = getCurrentUserInfo();
    const neverForget = document.getElementById("neverForget");
    const reasonForSoberText = document.getElementById("reasonForSoberText");

    neverForget.textContent =`Never forget why you started your journey of sobriety from ${user.addiction.toLowerCase()}`;
    if (!reasonForSoberText) {
        alert("Error: reasonForSoberText element not found!");
        return;
    }

    if (!user) {
        alert("Error: No logged-in user found.");
        return;
    }

    if (!user.purpose) {
        alert("Error: No purpose found for the user.");
        return;
    }
    reasonForSoberText.textContent = `"${user.purpose}" -${user.username}`;
}
function resetSobrietyTimer() {

    if(!confirm("are you sure?")){
        return;
    }
    else{
        alert("It's okay to fall down, you just need to get pack up");
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let currentUser = localStorage.getItem("currentUser");
        let userIndex = users.findIndex(user => user.username === currentUser);

        if (userIndex !== -1) {
            users[userIndex].startTime = new Date().toISOString(); // Convert to string before saving
            users[userIndex].lessThanOneDay = "true";

            localStorage.setItem("users", JSON.stringify(users)); // Save updated data
            console.log("New startTime:", users[userIndex].startTime);
        } else {
            alert("User not found!");
            return;
        }

        daysSober(); // Ensure it picks up the new time
    }
}
function daysSober() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUser = localStorage.getItem("currentUser");
    let userIndex = users.findIndex(user => user.username === currentUser);

    const startTimeTimer = new Date(users[userIndex].startTime);
    const sobrietyTimerText = document.getElementById("sobrietyTimerText");
    const secondsBar = document.getElementById("secondsBar");    
    const minutesBar = document.getElementById("minutesBar");
    const hoursBar = document.getElementById("hoursBar");
    const yearsBar = document.getElementById("yearsBar");
    const secondsDisplay = document.getElementById("secondsDisplay");
    
    function updateTimer() {
        const currentTime = new Date();
        let timeDifference = currentTime - startTimeTimer;
        if(users[userIndex].lessThanOneDay === "false"){
            timeDifference = Math.floor(timeDifference-18000000);
        }
        const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));
        const days = Math.floor((timeDifference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        
        //displays appropriet amount of data
        if(minutes == 0){
            sobrietyTimerText.textContent = `You have been sober for ${seconds} seconds. Here's to new beginnings`;
        } else if(hours ==0){
            if(minutes == 1){
                sobrietyTimerText.textContent = `You have been sober for ${minutes} minutes, and ${seconds} seconds. One minute in, many more to go`;
            } else{
                sobrietyTimerText.textContent = `You have been sober for ${minutes} minutes, and ${seconds} seconds.`;
            }
        } else if(days ==0){
            if(hours == 1 && minutes < 15){
                sobrietyTimerText.textContent = `You have been sober for ${hours} hours, ${minutes} minutes, and ${seconds} seconds. Woooo one hour in`;
            } else{
                sobrietyTimerText.textContent = `You have been sober for ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`;
            }
        } else if (years == 0){
            if(days == 1 && hours <  6){
                sobrietyTimerText.textContent = `You have been sober for ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds. Holy smokes you made it one day`;
            }
            sobrietyTimerText.textContent = `You have been sober for ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`;
        } else{
            if(years ==1 && days < 1460){
                sobrietyTimerText.textContent = `You have been sober for ${years} years, ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds. My Goly one year, so proud`;
            }
        sobrietyTimerText.textContent = `You have been sober for ${years} years, ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`;
        }

        secondsBar.style.width = (seconds / 60) * 100 + "%";
        secondsDisplay.textContent = `Progress to the next minute (${seconds} seconds)`;

        minutesBar.style.width = (minutes / 60) * 100 + "%";
        minutesDisplay.textContent = `Progress to the next hour (${minutes} minutes)`;

        hoursBar.style.width = (hours / 24) * 100 + "%";
        hoursDisplay.textContent = `Progress to the next day (${hours} hours)`;

        yearsBar.style.width = (days / 365) * 100 + "%";
        yearsDisplay.textContent = `Progress to the next year (${days} days)`;

        
    }
    clearInterval(sobrietyTimerInterval);
    updateTimer();
    sobrietyTimerInterval = setInterval(updateTimer, 1000);
}
function fillHomeHeadingText(){
    const user = getCurrentUserInfo();
    const homeHeadingText = document.getElementById("homeHeadingText");
    if (!homeHeadingText||!user){
        return;
    }
    homeHeadingText.textContent = `Hello ${user.username}`;
}
function getCurrentUserInfo() {
    const currentUsername = localStorage.getItem("currentUser");

    if (!currentUsername) return null; // No user is logged in

    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.find(user => user.username === currentUsername) || null;
}
function checkUsernameAvailability(username) {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if username already exists
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        alert("Username already taken");
        return false;
    }
    return true;
}
function validateForm() {
    const requiredFields = [
        "firstNameInput",
        "lastNameInput",
        "usernameInput",
        "passwordInput",
        "repeatPasswordInput",
        "addictionInput",
        "purposeInput",
        "startTimeInput"
    ];

    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field || field.value.trim() === "") {
            alert(`Please fill in all fields.`);
            return false; // Stop form submission
        }
    }
    return true; // All fields are filled
}
function repeatPasswordCorrect(){
    password = document.getElementById("passwordInput").value;
    repeatPassword = document.getElementById("repeatPasswordInput").value;
    if(password === repeatPassword){
        return true;
    } else{
        alert("Passwords do not match");
        return false;
    }
}
function formatFieldName(fieldId) {
    return fieldId.replace("Input", "").replace(/([A-Z])/g, " $1").trim();
}
function fillConfirmFields(){
    const confirmFields = {
        firstName: "confirmFirstName",
        lastName: "confirmLastName",
        username: "confirmUsername",
        password: "confirmPassword",
        email: "confirmEmail",
        addiction: "confirmAddiction",
        purpose: "confirmPurpose",
        startTime: "confirmStartDate"
    };
    for (const key in confirmFields) {
        const element = document.getElementById(confirmFields[key]);
        if (element) {
            const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
            element.textContent = `${formattedKey.replace(/([A-Z])/g, " $1").trim()}: ${sessionStorage.getItem(key) || "N/A"}`;
        }
    }
}
function handleLogIn() {
    const logInUsername = document.getElementById("logInUsername").value.trim();
    const logInPassword = document.getElementById("logInPassword").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || []; // Retrieve stored users array

    // Find user in stored users list
    const user = users.find(user => user.username === logInUsername && user.password === logInPassword);

    if (user) {
        localStorage.setItem("currentUser", logInUsername);
        alert(`login successful. Welcome back ${logInUsername}`);
        window.location.href = "home.html"; // Redirect to home page
    } else {
        console.log("login failed: invalid username");
        alert("Invalid username or password. Please try again.");
    }
}
function moveSessionToLocal() {
    let users = JSON.parse(localStorage.getItem("users")) || []; // Get existing users
    let newUser = {};

    Object.keys(sessionStorage).forEach(key => {
        newUser[key] = sessionStorage.getItem(key);
        console.log(newUser[key]);
    });

    users.push(newUser); // Add new user to users array
    localStorage.setItem("users", JSON.stringify(users)); // Save to localStorage

    // Ensure currentUser is set before clearing sessionStorage
    if (newUser.username) {
        localStorage.setItem("currentUser", newUser.username);
    } else {
        console.warn("Username is missing! CurrentUser not set.");
    }
    sessionStorage.clear();
    console.log("User data moved to localStorage:", users);
}
function getInputValues() {
    console.log("getting Input Values");
    const now = new Date();
    const startTimeInputTime =  new Date(document.getElementById("startTimeInput").value);
    const difference = now - startTimeInputTime;
    const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));

    if(days < 2){
        return{
            firstName: getTrimmedValue("firstNameInput"),
            lastName: getTrimmedValue("lastNameInput"),
            username: getTrimmedValue("usernameInput"),
            password: getTrimmedValue("passwordInput"),
            repeatPassword: getTrimmedValue("repeatPasswordInput"),
            email: getTrimmedValue("emailInput"),
            addiction: getTrimmedValue("addictionInput"),
            purpose: getTrimmedValue("purposeInput"),
            startTime: new Date(),
            lessThanOneDay: "true"
        };
        } else{
            return {
            firstName: getTrimmedValue("firstNameInput"),
            lastName: getTrimmedValue("lastNameInput"),
            username: getTrimmedValue("usernameInput"),
            password: getTrimmedValue("passwordInput"),
            repeatPassword: getTrimmedValue("repeatPasswordInput"),
            email: getTrimmedValue("emailInput"),
            addiction: getTrimmedValue("addictionInput"),
            purpose: getTrimmedValue("purposeInput"),
            startTime: new Date(document.getElementById("startTimeInput").value),
            lessThanOneDay: "false"
            };
    }
    function getTrimmedValue(id) {
        const element = document.getElementById(id);
        console.log("trimming...");
        return element ? element.value.trim() :"";
    }
}
function saveInputValuesToSession() {
    const userData = getInputValues();
    for (const key in userData) {
        sessionStorage.setItem(key, userData[key]);
    }
    console.log("Saved to sessionStorage:", sessionStorage);
}
function navagation(id, html){
    const button = document.getElementById(id);
    if (button) {
        button.addEventListener('click', function(){
            window.location.href = html;
        });
    }
}
