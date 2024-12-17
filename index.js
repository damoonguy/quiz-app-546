import express from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { buildRoutes } from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/public', express.static('public'));

app.use(
    session({
        name: 'QuizAppSession',
        secret: 'secrets',
        resave: false,
        saveUninitialized: false
    })
);

app.engine('handlebars', engine({
    helpers: {
        add: function(value, addition) {
            return value + addition;
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/admin', (req, res, next) => {
     if(!req.session.user) { // if a user is not logged in
          return res.redirect('/login'); // redirect them to the GET /signinuser route
     }
     else if ( (req.session.user) && (req.session.user.role !== 'admin') ){ // if the user is logged in, the middleware will "fall through" calling the next() callback  
        return res.redirect('/user');
     }
     next();
});

buildRoutes(app);

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
