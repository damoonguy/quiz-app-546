// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!

import { Router } from 'express';
import { quizzes, users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const router = Router();

router.get('/', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const userCollection = await users();
        const quizCollection = await quizzes();
        
        let user = await userCollection.findOne({ _id: new ObjectId(req.session.user.id) });
        if (!user.quizResults) {
            await userCollection.updateOne(
                { _id: new ObjectId(req.session.user.id) },
                { 
                    $set: { 
                        quizResults: [],
                        quizzesTaken: 0,
                        averageScore: 0,
                        todayQuizzes: 0
                    } 
                }
            );
            user = await userCollection.findOne({ _id: new ObjectId(req.session.user.id) });
        }

        const availableQuizzes = await quizCollection
            .find({ active: true })
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();

        let formattedQuizzes = [];
        for(let quiz of availableQuizzes) {
            formattedQuizzes.push({
                _id: quiz._id,
                title: quiz.title,
                description: quiz.description,
                questionCount: quiz.questions.length,
                category: quiz.category || 'General'
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let todayCount = 0;
        for(let result of user.quizResults) {
            if(result.dateTaken >= today) {
                todayCount++;
            }
        }

        let recentResults = [];
        for(let i = 0; i < 5 && i < user.quizResults.length; i++) {
            let result = user.quizResults[i];
            let date = result.dateTaken;
            recentResults.push({
                quizTitle: result.quizTitle,
                score: result.score,
                date: (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
            });
        }

        res.render('users/dashboard', {
            title: 'User Dashboard',
            user: {
                username: user.username,
                quizzesTaken: user.quizzesTaken || 0,
                averageScore: user.averageScore || 0,
                todayQuizzes: todayCount
            },
            availableQuizzes: formattedQuizzes,
            inProgressQuizzes: [],
            recentResults: recentResults
        });
    } catch (e) {
        res.status(500).render('error', {
            title: 'Error',
            error: e.message
        });
    }
});

export default router;