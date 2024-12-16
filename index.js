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

buildRoutes(app);

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});