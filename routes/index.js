//Here you will require route files and export them as used in previous labs.
//Here you will import route files and export them as used in previous labs

import userRoutes from "./users.js"
import adminRoutes from "./admin.js"


const buildRoutes = (app) => {
    app.use('/admin', adminRoutes)
    app.use('/', userRoutes)
    app.use('*', (req, res) => {
        return res.status(404).json({error: 'Not Found'})
    });
};


export default buildRoutes;