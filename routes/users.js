// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!

import {Router} from 'express'

const router = Router();

router.route('/')
  .get(async (req, res) => {
    try {
      if (req.session.user) {
        res.render('home.handlebars', {title: 'Home', user: req.session.user})
      } else {
        res.redirect('/');
      }
      
    } catch (e) {
      res.status(500).json({error: e})
    }
})

router.route('/dashboard')
  .get(async (req, res) => {
    try {
      if (req.session.user) {
        res.render('userDashboard', {
          layout: 'dashboard',
          title: 'User Dashboard',
          users: req.session.user
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
  })

export default router;

