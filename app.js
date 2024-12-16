// Set up express server + Mongo Connection
import express from 'express';
import path, {dirname} from 'path'
import exphbs from "express-handlebars"
import session from "express-session"
import bodyParser from "body-parser"
import dotenv from "dotenv"

dotenv.config()
const app = express();

import buildRoutes from './routes/index.js';

import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(session({
  name: 'QuizAppSession',
  secret: 'secrets',
  resave: false,
  saveUninitialized: false
}))

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    },
    isdefined: (val) => {
        return val != undefined;
    },
    eq: (val1, val2) => {
      return val1 == val2;
    },
    add: (val1, val2) => {
      return val1 + val2
    }
  }
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use('/public', express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

app.use('/', async (req, res, next) => {
  const date = new Date().toUTCString()
     let str = "Non-Authenticated"
     
     if (req.session.user !== undefined) {
          str = "Authenticated"
          if (req.session.user.role === 'admin') {
               str += ' Administrator User'
          } else {
               str += ' User'
          }
     }
     console.log(`[${date}]: ${req.method} ${req.originalUrl} (${str})`)
     next();
})

buildRoutes(app);



app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});