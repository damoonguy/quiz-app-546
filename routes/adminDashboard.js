// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!

import { Router } from 'express';
import { quizzes, users } from '../config/mongoCollections.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const quizCollection = await quizzes();
        const userCollection = await users();
        
        const totalQuizzes = await quizCollection.countDocuments();
        const totalUsers = await userCollection.countDocuments();
        
        res.render('adminDashboard', {
            layout: 'dashboard',
            title: 'Admin Dashboard',
            totalQuizzes: totalQuizzes || 0,
            totalUsers: totalUsers || 0,
            activeUsers: Math.floor(totalUsers * 0.7), // test number | {Michael}: I'll try to find a way with express.session
            recentActivity: [] // test
        });
    } catch (e) {
        res.status(500).render('error', {
            title: 'Error',
            error: e.message
        });
    }
});

export default router;
