import {Router} from 'express'
import { createQuiz, getQuiz } from '../public/js/index.js';
import xss from 'xss';

const router = Router();

router
  .route('/create')
    .get(async (req, res) => {
        try {
            res.render('createQuiz.handlebars', {layout: false})
        } catch (e) {
            res.status(500).json({error: e})
        }
  }).post(async (req, res) => {
        try {
            console.log(req.body)
            const quiz = createQuiz(req.body)

            res.send("Quiz successfully created! <a href='/'>Click here to return to the home page</a>");
        } catch (e) {
            res.status(500).json({error: e})
        }
  })

export default router;