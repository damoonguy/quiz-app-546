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

        if (!user.savedQuizzes) {
            await userCollection.updateOne(
                { _id: new ObjectId(req.session.user.id) },
                { $set: { savedQuizzes: [] } }
            );
            user = await userCollection.findOne({ _id: new ObjectId(req.session.user.id) });
        }

        const availableQuizzes = await quizCollection
            .find({ active: true })
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();

        let formattedQuizzes = [];
        for (let quiz of availableQuizzes) {
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
        for (let result of user.quizResults) {
            if (result.dateTaken >= today) {
                todayCount++;
            }
        }

        let recentResults = [];
        if (user.quizResults && user.quizResults.length > 0) {
            const sortedResults = [...user.quizResults].sort((a, b) => 
                new Date(b.dateTaken) - new Date(a.dateTaken)
            );
            
            recentResults = sortedResults.slice(0, 5).map(result => ({
                quizTitle: result.quizTitle,
                score: result.score,
                date: (result.dateTaken.getMonth() + 1) + '/' + result.dateTaken.getDate() + '/' + result.dateTaken.getFullYear(),
                _id: result.quizId
            }));
        }

        let savedQuizzes = [];
        if (user.savedQuizzes && user.savedQuizzes.length > 0) {
            const savedQuizIds = user.savedQuizzes.map(id => new ObjectId(id));
            const savedQuizzesData = await quizCollection.find({ 
                _id: { $in: savedQuizIds },
                active: true 
            }).toArray();
            
            savedQuizzes = savedQuizzesData.map(quiz => ({
                _id: quiz._id,
                title: quiz.title,
                description: quiz.description,
                questionCount: quiz.questions.length,
                category: quiz.category || 'General'
            }));
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
            recentResults: recentResults,
            savedQuizzes: savedQuizzes
        });
    } catch (e) {
        res.status(500).render('error', {
            title: 'Error',
            error: e.message
        });
    }
});

export default router;