//Here you will require route files and export them as used in previous labs.
//Here you will import route files and export them as used in previous labs



const buildRoutes = (app) => {
    app.use('/admin')
    app.use('/user')
    app.use('*', (req, res) => {
        return res.status(404).json({error: 'Not Found'})
    });
};

export default buildRoutes;