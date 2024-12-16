// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!

import {Router} from 'express'
import { quizzes, users } from '../config/mongoCollections.js';

const router = Router();

router.route('/')
  .get(async (req, res) => {
    try {
      res.render('home.handlebars', {user: req.session.user, title: 'Admin Home'})
    } catch (e) {
      res.status(500).render('error', {message: 'Something went wrong in /admin', title: 'Error', error: e})
    }
  })

router.route('/dashboard')
  .get(async (req, res) => {
    try {
      if (req.session.user !== undefined) {
        const quizCollection = await quizzes();
        const userCollection = await users();
        
        const totalQuizzes = await quizCollection.countDocuments();
        const totalUsers = await userCollection.countDocuments();
        
        res.render('adminDashboard', {
            user: req.session.user,
            layout: 'dashboard',
            title: 'Admin Dashboard',
            totalQuizzes: totalQuizzes || 0,
            totalUsers: totalUsers || 0,
            activeUsers: Math.floor(totalUsers * 0.7), // test number | {Michael}: I'll try to find a way with express.session
            recentActivity: [] // test
        });
      } else {
        res.redirect('/')
      }
    } catch (e) {
        res.status(500).render('error', {
            title: 'Error',
            error: e.message
        });
    }
});

export default router;