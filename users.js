// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!

import { Router } from 'express';
import { users } from '../config/mongoCollections.js';

const router = Router();

const checkBody = (body) => {
  // Your validation logic here
};

router.route('/')
  .get(async (req, res) => {
    try {
      const userCollection = await users();
      const allUsers = await userCollection.find({}).toArray();
      res.render('users/dashboard', {
        title: 'User Dashboard',
        users: allUsers
      });
    } catch (e) {
      res.status(500).render('error', {
        title: 'Error',
        error: e.message
      });
    }
  })
  .post(async (req, res) => {
    try {
      checkBody(req.body);
      // Handle user creation
    } catch (e) {
      res.status(400).json({error: e.message});
    }
  });

export default router;