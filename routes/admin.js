// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!

import {Router} from 'express'
import { quizzes, users } from '../config/mongoCollections.js';

const router = Router();


router.route('/')
  .get(async (req, res) => {
    try {
      if (req.session.user !== undefined) {
        if (req.session.user.role === 'admin') {
          const quizCollection = await quizzes();
          const userCollection = await users();
          
          const quizArr = await quizCollection.find().toArray();
          const userArr = await userCollection.find().toArray();

          const totalQuizzes = quizArr.length
          const totalUsers = userArr.length
          
          res.render('admin/dashboard', {
              user: req.session.user,
              layout: 'dashboard',
              title: 'Admin Dashboard',
              stats: {
                totalQuizzes: totalQuizzes || 0,
                totalUsers: totalUsers || 0,
                activeUsers: Math.floor(totalUsers * 0.7) // test number 
              },
              quizzes: quizArr,
              users: userArr
              
          });
        } else {
          res.redirect('/users')
        }
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