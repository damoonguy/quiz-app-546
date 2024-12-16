//Here you will require route files and export them as used in previous labs.

import userRoutes from "./users.js"
import adminRoutes from "./admin.js"
import quizRoutes from "./quizzes.js"
import authRoutes from "./auth.js"

const buildRoutes = (app) => {
    app.use('/auth', authRoutes) // Login + Register + Logout
    app.use('/admin', adminRoutes) // Admin-related activity
    app.use('/users', userRoutes) // User-related activity
    app.use('/quiz', quizRoutes) // Quiz-related activity
    app.get('/', (req, res) => { // Initial load
        if (req.session.user === undefined) {
            res.render('home', {
                title: 'Home'
            });
        } else {
            if (req.session.user.role === 'admin') {
                res.redirect('/admin')
            } else {
                res.redirect('/users')
            }
        }
        
    });
    
    app.use('*', (req, res) => {
        return res.status(404).json({error: 'Not Found'})
    });
};

export default buildRoutes;
