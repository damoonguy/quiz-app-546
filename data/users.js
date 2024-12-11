import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import validation from '../validation.js';
import bcrypt from 'bcryptjs';

let userDataFunctions = {
    // get all the users in the users collection
    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        return userList;
    },

    // get user based on their user id
    async getUserById(id) {
        id = validation.checkId(id);
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: new ObjectId(id) });
        if (!user) throw 'Error: User not found'; // if there is no user with that id, then that user does not exist
        return user;
    },

    // create a new user 
    async signUpUser(
        firstName,
        lastName,
        userId,
        email,
        userName,
        password,
        quizzes
    ) {
        // error checking for firstName
        firstName = validation.checkString(firstName, 'First name');
        for (let x of firstName) {  // check whether it has numbers (throw an error if yes)
            if (Number.isInteger(x)) {
                throw 'Error: First name cannot contain numbers.'
            }
        }

        // error checking for lastName
        lastName = validation.checkString(lastName, 'Last name');
        for (let x of lastName) {  // check whether it has numbers (throw an error if yes)
            if (Number.isInteger(x)) {
                throw 'Error: Last name cannot contain numbers.'
            }
        }

        // error checking for email
        email = validation.checkString(email, 'Email');
        // html input type will check that it's a valid email, should we do checking here too? 
        const userCollection = await users();
        const someUser = await userCollection.findOne(
            {"email": email}
        );

        if(someUser !== null) throw 'Error: Email is already in use.'; // check if another user already used that email

        // error checking for userName (like a user nickname)
        userName = validation.checkString(userName, 'User name');

        // error checking for password
        password = validation.checkString(password, 'Password');
        for (let x of password) {  // check whether it has spaces (throw an error if yes)
            if (x === ' ') {
                throw 'Error: Password cannot have empty spaces.'
            }
        }
        if (password.length < 8) { // check is the length is invalid (throw an error if yes)
            throw 'Error: Password must be at least 8 characters long.';
        }

        /*******************error checking end******************/

        // hash password using bcrypt
        const saltRounds = 16;
        const hash = await bcrypt.hash(password, saltRounds);

        // insert new user into the database
        let newUser = {
            firstName: firstName,
            lastName: lastName,
            userId: new ObjectId(),
            email: email,
            userName: userName,
            quizzes: []
        };

        let res = { registrationCompleted: false }; // this object will tell use if the registration was successful or not
        userCollection = await users();
        const insertInfo = await userCollection.insertOne(newUser); // insert new user info into the collection
        if (!insertInfo.acknowledged || !insertInfo.insertedId) { // check if the insertInfo is acknowledged, and if the insertedId exists
            throw 'Could not add user'; // if either condition is met, then the user cannot be added
        }
        else{
            res.registrationCompleted = true; // otherwise, return that it's successful
        }

        
        // we need to choose whether we return a status report or the new user itself    
        // const newUserId = insertInfo.insertedId.toString(); // turn the new user's id into a string

        // const user = await this.getUserById(newUserId); // find the user that was just added

        return res; // return whether the registration is successful or not
    },

    async signInUser(email, password) {
        // error checking for email
        email = validation.checkString(email, 'Email');
        // html input type will check that it's a valid email, should we do checking here too? 

        // error checking for password
        password = validation.checkString(password, 'Password');
        for (let x of password) {  // check whether it has spaces (throw an error if yes)
            if (x === ' ') {
                throw 'Error: Password cannot have empty spaces.'
            }
        }
        if (password.length < 8) { // check is the length is invalid (throw an error if yes)
            throw 'Error: Password must be at least 8 characters long.';
        }

        /*******************error checking end******************/

        // find user by their email
        const userCollection = await users();
        const user = await userCollection.findOne(
            {"email": email}
        );
        if (user === null) throw 'User with that email not found';

        // error checking for password
        // if email supplied is found in the DB, use bcrypt to compare the hashed password in the database w/ password input parameter
        let compareToMatch = await bcrypt.compare(password, user.hash);
        if (!compareToMatch) {
            throw 'Either the email or password is invalid';
        }

        return user; // return the user
    }
};

export default userDataFunctions;