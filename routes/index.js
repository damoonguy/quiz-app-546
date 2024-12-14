//Here you will require route files and export them as used in previous labs.

import userRoutes from "./users.js"
import adminRoutes from "./admin.js"
import quizRoutes from "./quizzes.js"

const buildRoutes = (app) => {
    app.use('/admin', adminRoutes)
    app.use('/users', userRoutes)
    app.use('/quiz', quizRoutes)
    app.get('/', (req, res) => {
        res.render('home', {
            title: 'Home'
        });
    });
    
    app.use('*', (req, res) => {
        return res.status(404).json({error: 'Not Found'})
    });
};

export default buildRoutes;
