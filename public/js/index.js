// Client-side JS for uploading, taking, saving quizzes + other functionality

import jwt from "jsonwebtoken" 
import bcrypt from "bcryptjs"
import xss from "xss"
import { users } from "../../config/mongoCollections.js"

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}

export const registerUser = async (body) => {
    try {
        const {username, email, password} = body;
        if (!username || !email || !password) {
            throw "All parameters must be supplied."
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt)
        delete body.password;
        

        const col = await users();
        const userExists = await col.findOne({email})
        if (userExists) {
            throw "Email already in use. Maybe try logging in?"
        }
        const user = {
            username: username,
            email: email,
            password: hashedPass
        }
        const newUser = await col.insertOne(user);
        if (!newUser.acknowledged) {
            throw "Error saving registration data."
        }
        const token = generateToken(newUser._id);
        user.token = token;
        user._id = newUser.insertedId;
        delete userExists.password
        return user;
    } catch (e) {
        console.error(e.message);
        throw e;
    }
}

export const loginUser = async (body) => {
    try {
        const {email, password} = body;
        if (!email || !password) {
            throw "All parameters must be supplied."
        }
        
        const col = await users();
        const userExists = await col.findOne({email})
        if (!userExists) {
            throw "User not found!"
        }
        
        const validPass = await bcrypt.compare(password, userExists.password);
        if (!validPass) {
            throw "Incorrect password."
        }
        delete userExists.password
        return userExists;

    } catch (e) {
        console.error(e.message);
        throw e;
    }
    

}