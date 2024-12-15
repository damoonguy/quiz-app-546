// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!

import { Router } from 'express';
import { fileURLToPath } from 'url';
import path from "path";
import axios from 'axios';
import xss from 'xss';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser } from '../public/js/index.js';
import { userData } from '../data/index.js';
import validation from '../validation.js';

const router = Router();

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '1d'
//   })
// }

router
  .route('/')
  .get(async (req, res) => {
    try {
      res.render('home.handlebars');
    } catch (e) {
      res.sendStatus(500).json({ error: e });
    }
  });

router
  .route('/login')
  .get(async (req, res) => {
    try {
      res.render('login.handlebars', { layout: false })
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

router
  .route('/register')
  .get(async (req, res) => {
    try {
      res.render('register');
    } catch (e) {
      res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {
    let userInfo = req.body;

    if (!userInfo || Object.keys(userInfo).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' });
    }

    // error checking for firstName
    try {
      userInfo.firstName = validation.checkString(
        userInfo.firstName,
        'First name'
      );
      for (let x of userInfo.firstName) {  // check whether it has numbers (throw an error if yes)
        if (!isNaN(x)) {
          throw 'Error: First name cannot contain numbers.'
        }
      }
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    // error checking for lastName
    try {
      userInfo.lastName = validation.checkString(
        userInfo.lastName,
        'Last name'
      );
      for (let x of userInfo.lastName) {  // check whether it has numbers (throw an error if yes)
        if (!isNaN(x)) {
          throw 'Error: Last name cannot contain numbers.'
        }
      }
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    // error checking for username
    try {
      userInfo.username = validation.checkString(
        userInfo.username,
        'Username'
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    // error checking for email
    try {
      userInfo.email = validation.checkString(
        userInfo.email,
        'Email'
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    // error checking for password
    try {
      userInfo.password = validation.checkString(
        userInfo.password,
        'Password'
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const newUser = await userData.registerUser(
        userInfo.firstName,
        userInfo.lastName,
        userInfo.username,
        userInfo.email,
        userInfo.password
      );

      return res.redirect('/login');
    } catch (e) {
      res.sendStatus(500).json({error: 'Internal Server Error'});
      return res.render('register');
    }
  });

export default router;