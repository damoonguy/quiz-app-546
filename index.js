// index.js
import express from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { buildRoutes } from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session setup
app.use(
    session({
        name: 'QuizAppSession',
        secret: 'some secret string!',
        resave: false,
        saveUninitialized: false
    })
);

// Handlebars setup
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Build routes
buildRoutes(app);

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});