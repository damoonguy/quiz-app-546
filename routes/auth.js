import {Router} from 'express'
import userAuth from "../data/users.js"

const router = Router();

router.route('/login').get(async (req, res) => {
    try {
      res.render('login.handlebars', {layout: false}) 
    } catch (e) {
      res.status(500).json({error: e});
    }
  }).post(async (req, res) => {
    try {
        const {email, password} = req.body
        if (!email || !password) throw "All inputs must be specified";
  
        // Will return user: object
        req.session.user = await userAuth.signInUser(email, password);
        if (!req.session.user) {
            throw "Login failure."
        }
  
        if (req.session.user.role === 'admin') {
          return res.redirect('/admin')
        } else {
          return res.redirect('/users')
        }
    } catch (e) {
        return res.status(500).json({message: "something went terribly wrong.", error: e})
    }
  })
  
router.route('/register').get(async (req, res) => {
    try {
        res.render('register.handlebars', {layout: false})
    } catch (e) {
        res.status(500).json({error: e});
    }
  }).post(async (req, res) => {
    try {
        const {firstName, lastName, email, userName, password, role} = req.body
        if (!firstName || !lastName || !email || !userName || !password || !role) throw "All inputs must be specified";
        // Will return {user: object, registrationCompleted: boolean}
        const authRes = await userAuth.signUpUser(firstName, lastName, email, userName, password, role);
        if (authRes.registrationCompleted !== true) {
            throw "Sign up failure."
        }
        
        req.session.user = authRes.user
  
        if (req.session.user.role === 'admin') {
          return res.redirect('/admin')
        } else {
          return res.redirect('/users')
        }
    } catch (e) {
        return res.status(500).json({message: "something went terribly wrong.", error: e})
    }
  })

router.route('/logout').get(async (req, res) => {
    try {
        req.session.user = undefined;
        res.redirect('/')
    } catch (e) {
        res.status(500).render('error', {title: 'Error', error: e})
    }
})

export default router;