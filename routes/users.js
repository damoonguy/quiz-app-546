// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!

import {Router} from 'express'
import {fileURLToPath} from 'url'
import path from "path"
import axios from 'axios';
import xss from 'xss';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser } from '../public/js/index.js';


const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
      expiresIn: '1d'
  })
}


const router = Router();

router.route('/')
  .get(async (req, res) => {
    try {
      res.render('home.handlebars')
    } catch (e) {
      res.status(500).json({error: e})
    }
}).post(async (req, res) => {
  try {
    if (req.body.username) {
      const newUser = await registerUser(req.body);
      res.render('home.handlebars', {user: newUser})
    } else {
      const returningUser = await loginUser(req.body);
      res.render('home.handlebars', {user: returningUser})
    }
    
  } catch (e) {
    console.error(e.message);
    res.status(500).json({error: e})
  }
});

router.route('/login').get(async (req, res) => {
  try {
    res.render('login.handlebars', {layout: false}) 
  } catch (e) {
    res.status(500).json({error: e});
  }
})

router.route('/register').get(async (req, res) => {
  try {
    res.render('register.handlebars', {layout: false})
  } catch (e) {
    res.status(500).json({error: e});
  }
})




export default router;