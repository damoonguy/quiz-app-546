import { Router } from 'express';
import { quizzes, users } from '../config/mongoCollections.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const quizCollection = await quizzes();
        const userCollection = await users();
        
        const totalQuizzes = await quizCollection.countDocuments();
        const totalUsers = await userCollection.countDocuments();
        
        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            totalQuizzes: totalQuizzes || 0,
            totalUsers: totalUsers || 0,
            activeUsers: Math.floor(totalUsers * 0.7), // temp
            recentActivity: [] // temp
        });
    } catch (e) {
        res.status(500).render('error', {
            title: 'Error',
            error: e.message
        });
    }
});

export default router;
