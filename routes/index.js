//Here you will require route files and export them as used in previous labs.
//Here you will import route files and export them as used in previous labs

import { Router } from "express";

const buildRoutes = (app) => {
    app.use('/admin')
    app.use('/user')
    app.use('*', (req, res) => {
        return res.status(404).json({error: 'Not Found'})
    });
};

const router = Router();

router.route('/login').get(async (req, res) => {
    res.render('login.handlebars')
})

router.route('/register').get(async (req, res) => {
    res.render('register.handlebars')
})

export default buildRoutes;