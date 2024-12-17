import express from 'express';
import { quizzes, users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const quizCollection = await quizzes();
        const userCollection = await users();
        
        const allUsers = await userCollection.find({}, {
            projection: {
                username: 1,
                email: 1,
                quizzesTaken: 1,
                averageScore: 1
            }
        }).toArray();

        const totalUsers = await userCollection.countDocuments();
        const totalQuizzes = await quizCollection.countDocuments();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const allQuizzes = await quizCollection.find({}).toArray();
        
        const categoryCount = {};
        allQuizzes.forEach(quiz => {
            const category = quiz.category || 'Uncategorized';
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        });

        const popularCategories = Object.entries(categoryCount)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        const newUsers = await userCollection.countDocuments({
            createdAt: { $gte: lastWeek }
        });

        const newQuizzes = await quizCollection.countDocuments({
            createdAt: { $gte: lastWeek }
        });

        const recentBadges = [];
        const usersData = await userCollection.find({}).toArray();
        usersData.forEach(user => {
            if (user.quizzesTaken >= 25) {
                recentBadges.push({
                    username: user.username,
                    badge: 'Master of Learning',
                    date: user.createdAt
                });
            } else if (user.quizzesTaken >= 10) {
                recentBadges.push({
                    username: user.username,
                    badge: 'Study G.O.A.T',
                    date: user.createdAt
                });
            }
        });
        
        const categoryScores = {};
        usersData.forEach(user => {
            if (user.quizResults) {
                user.quizResults.forEach(result => {
                    const quiz = allQuizzes.find(q => q._id.toString() === result.quizId.toString());
                    if (quiz) {
                        const category = quiz.category || 'Uncategorized';
                        if (!categoryScores[category]) {
                            categoryScores[category] = {
                                total: 0,
                                count: 0
                            };
                        }
                        categoryScores[category].total += result.score;
                        categoryScores[category].count++;
                    }
                });
            }
        });

        const averageScoresByCategory = Object.entries(categoryScores).map(([category, data]) => ({
            category,
            averageScore: Math.round(data.total / data.count)
        }));

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            stats: {
                totalUsers,
                totalQuizzes,
                activeToday: await userCollection.countDocuments({ 'lastActive': { $gte: today } }),
                quizzesToday: await quizCollection.countDocuments({ 'createdAt': { $gte: today } })
            },
            analytics: {
                popularCategories,
                userActivity: {
                    newUsers,
                    newQuizzes,
                    recentBadges: recentBadges.slice(0, 5)
                },
                categoryPerformance: averageScoresByCategory
            },
            users: allUsers
        });
    } catch (e) {
        res.status(500).render('error', {
            title: 'Error',
            error: e.message
        });
    }
});

router.get('/api/users/search', async (req, res) => {
    try {
        const userCollection = await users();
        const searchTerm = req.query.term || '';

        let query = {};
        if (searchTerm) {
            query = {
                username: { $regex: searchTerm, $options: 'i' }
            };
        }

        const searchResults = await userCollection.find(query, {
            projection: {
                username: 1,
                email: 1,
                quizzesTaken: 1,
                averageScore: 1
            }
        }).limit(20).toArray();

        res.json(searchResults);
    } catch (e) {
        console.error('Search error:', e);
        res.status(500).json({ error: 'Search failed' });
    }
});

router.post('/api/users/:userId/ban', async (req, res) => {
    try {
        if (!req.session || !req.session.user || req.session.user.role !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized - Admin access required' });
        }

        const userCollection = await users();
        const userId = req.params.userId;
        
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        if (userId === req.session.user.id) {
            return res.status(400).json({ error: 'Cannot ban yourself' });
        }

        const result = await userCollection.deleteOne({ _id: new ObjectId(userId) });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ success: true });
    } catch (e) {
        console.error('Ban user error:', e);
        res.status(500).json({ error: 'Failed to ban user' });
    }
});

export default router;
