// register form handling
// get elements from the html through their respective IDs
import validation from '../../helpers.js';

let registrationForm = document.getElementById('registration-form');

let firstNameInput = document.getElementById('firstName');
let fNameLabel = document.getElementById('firstNameLabel');

let lastNameInput = document.getElementById('lastName');
let lNameLabel = document.getElementById('lastNameLabel');

let usernameInput = document.getElementById('username');
let uNameLabel = document.getElementById('usernameLabel');

let emailInput = document.getElementById('email');
let eMailLabel = document.getElementById('emailLabel');

let errorDiv = document.getElementById('error');

let passwordInput = document.getElementById('password');
let pwLabel = document.getElementById('passwordLabel');

let roleInput = document.getElementById('role');
let rLabel = document.getElementById('roleLabel');

if (registrationForm) {
    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault(); // stops website from refreshing everytime the form is submitted

        // firstNameInput handling
        if (firstNameInput) {
            firstNameInput = validation.checkString(firstNameInput, 'First name');
            for (let x of firstNameInput) {  // check whether it has numbers (throw an error if yes)
                if (!isNaN(x)) {
                    throw 'Error: First name cannot contain numbers.'
                }
            }
            if ((firstNameInput.length < 2) || (firstNameInput.length > 25)) { // check is the length is invalid (throw an error if yes)
                throw 'Error: First name must be between 2-25 characters long.';
            }
        } else {
            firstNameInput = ''; // if the user submits the form without typing a first name, the website shows an error that they must type some first name
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must enter a first name.';
            fNameLabel.className = 'error';
            firstNameInput.focus();
            firstNameInput.className = 'inputClass';
        }

        // lastNameInput handling
        if (lastNameInput) {
            lastNameInput = validation.checkString(lastNameInput, 'First name');
            for (let x of lastNameInput) {  // check whether it has numbers (throw an error if yes)
                if (isNaN(x)) {
                    throw 'Error: Last name cannot contain numbers.'
                }
            }
            if ((lastNameInput.length < 2) || (lastNameInput.length > 25)) { // check is the length is invalid (throw an error if yes)
                throw 'Error: Last name must be between 2-25 characters long.';
            }
        } else {
            lastNameInput = ''; // if the user submits the form without typing a last name, the website shows an error that they must type some last name
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must enter a last name.';
            lNameLabel.className = 'error';
            lastNameInput.focus();
            lastNameInput.className = 'inputClass';
        }

        // usernameInput handling
        if (usernameInput) {
            usernameInput = validation.checkString(usernameInput, 'Username');
            for (let x of usernameInput) {  // check whether it has numbers (throw an error if yes)
                if (isNaN(x)) {
                    throw 'Error: Last name cannot contain numbers.'
                }
            }
            if ((usernameInput.length < 2) || (usernameInput.length > 25)) { // check is the length is invalid (throw an error if yes)
                throw 'Error: Last name must be between 2-25 characters long.';
            }
        } else {
            usernameInput = ''; // if the user submits the form without typing a last name, the website shows an error that they must type some last name
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must enter a last name.';
            uNameLabel.className = 'error';
            usernameInput.focus();
            usernameInput.className = 'inputClass';
        }

        // emailInput error checking
        // the type is email so it will alert the user that it must be in the form of a valid email
        // nevertheless, we will still do error checking here
        if (emailInput) {
            emailInput = validation.checkString(emailInput, 'Email');
        } else {
            emailInput = ''; // if the user submits the form without typing an email, the website shows an error that they must type some valid email
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must enter a email.';
            eMailLabel.className = 'error';
            emailInput.focus();
            emailInput.className = 'inputClass';
        }

        // passwordInput error checking
        // password constraints: no empty spaces, must be at least 8 characters long, cannot just be numbers
        if (passwordInput) {
            passwordInput.classList.remove('inputClass');
            errorDiv.hidden = true;
            pwLabel.classList.remove('error');

            passwordInput = validation.checkString(passwordInput);
            for (let x of passwordInput) {  // check whether it has spaces (throw an error if yes)
                if (x === ' ') {
                    throw 'Error: Password cannot have empty spaces.'
                }
            }
            if (passwordInput.length < 8) { // check is the length (must be at least 8 characters long) is invalid (throw an error if yes)
                throw 'Error: Password must be at least 8 characters long.';
            }

            let hasNumber = false; // password requires at least one number
            for (let x of passwordInput) {
                if (!isNaN(x)) {
                    hasNumber = true;
                }
            }

            if (hasNumber === false) {
                throw 'Error: Password have at least 1 number.';
            }
        } else {
            passwordInput = ''; // if the user submits the form without typing a password, the website shows an error that they must type some password
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must enter a password';
            pwLabel.className = 'error';
            passwordInput.focus();
            passwordInput.className = 'inputClass';
        }

       // roleInput checking
        if (roleInput) {
            roleInput.classList.remove('inputClass');
            errorDiv.hidden = true;
            rLabel.classList.remove('error');

            roleInput = validation.checkString(roleInput);
            if(roleInput != 'admin' || roleInput !== 'user') {
                throw 'Error: Role is invalid. You must be an admin or user.';
            }
        } else {
            roleInput = ''; // if the user submits the form without choosing a role, the website shows an error that they must choose some role
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must choose a role';
            rLabel.className = 'error';
            roleInput.focus();
            roleInput.className = 'inputClass';
        }



        registrationForm.reset(); // empty the form (remove previous input)
    });
}

// sign in form handling
let signInForm = document.getElementById('login-form');

if (signInForm) {
    signInForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (emailInput) {
            emailInput.classList.remove('inputClass');
            eMailLabel.classList.remove('error');

            // emailInput error checking
            // the type is email so it will alert the user that it must be in the form of a valid email
            // nevertheless, we will still do error checking here
            emailInput = validation.checkString(emailInput, 'Email');


            passwordInput.focus();
        } else {
            emailInput = ''; // if the user submits the form without typing an email, the website shows an error that they must type some valid email
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must enter a email.';
            eMailLabel.className = 'error';
            emailInput.focus();
            emailInput.className = 'inputClass';
        }

        // passwordInput error checking
        // password constraints: no empty spaces, must be at least 8 characters long, cannot just be numbers
        if (passwordInput) {
            passwordInput.classList.remove('inputClass');
            pwLabel.classList.remove('error');

            passwordInput = validation.checkString(passwordInput);
            for (let x of passwordInput) {  // check whether it has spaces (throw an error if yes)
                if (x === ' ') {
                    throw 'Error: Password cannot have empty spaces.'
                }
            }
            if (passwordInput.length < 8) { // check is the length is invalid (throw an error if yes)
                throw 'Error: Password must be at least 8 characters long.';
            }
        } else {
            passwordInput = ''; // if the user submits the form without typing a password, the website shows an error that they must type some password
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must enter a password';
            pwLabel.className = 'error';
            passwordInput.focus();
            passwordInput.className = 'inputClass';
        }
    });
}
