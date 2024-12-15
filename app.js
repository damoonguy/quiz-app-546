// Set up express server + Mongo Connection
import express from 'express'
const app = express();
import session from 'express-session'
import buildRoutes from './routes/index.js';
// import path, {dirname} from 'path'

import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"


// dotenv.config()


import exphbs from "express-handlebars"

// import {fileURLToPath} from 'url'

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const staticDir = express.static('public');

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // // Specify helpers which are only registered on this instance.
  // helpers: {
  //   asJSON: (obj, spacing) => {
  //     if (typeof spacing === 'number')
  //       return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

  //     return new Handlebars.SafeString(JSON.stringify(obj));
  //   },
  //   isdefined: (val) => {
  //       return val != undefined;
  //   }
  // }
});

// const rewriteUnsupportedBrowserMethods = (req, res, next) => {
//   // If the user posts to the server with a property called _method, rewrite the request's method
//   // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
//   // rewritten in this middleware to a PUT route
//   if (req.body && req.body._method) {
//     req.method = req.body._method;
//     delete req.body._method;
//   }

//   // let the next middleware run:
//   next();
// };

// app.use(cors());
// app.use('/public', express.static(__dirname + '/public'));
app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(bodyParser.json())
// app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

app.use(
  session({
       name: 'AuthenticationState',
       secret: "some secret string!",
       resave: false,
       saveUninitialized: false,
  })
);

app.use('/', (req, res, next) => {
  // this is for debugging, can be commented out later
  console.log(new Date().toUTCString()); // print current timestamp
  console.log(req.method); // print request method
  console.log(req.originalUrl); // print request route
  if (req.session.user) { // print if user is authenticated or not
       console.log("Authenticated");
       // print if user is user or admin
       if (req.session.user.role === 'admin') {
            console.log(" Administrator User");
       }
       else {
            console.log(" User");
       }
  }
  else {
       console.log("Non-Authenticated");
  }

  // if the request path is the root, redirect to proper page based on role & authentication status
  if (req.originalUrl === '/') {
       if ((req.session.user) && (req.session.user.role === 'admin')) {
            res.redirect('/administrator');
       }
       else if ((req.session.user) && (req.session.user.role === 'user')) {
            res.redirect('/user');
       }
       else {
            console.log('redirect to sign in user');
            res.redirect('/signinuser'); // why won't redirect work?
       }
  }
  else {
       next(); // if the path is not root, call next
  }
});

app.use('/signupuser', (req, res, next) => {
  if (req.session.user) { // if there is a user logged in
       if (req.session.user.role === 'admin') { // redirect to admin route if they're an administrator
            return res.redirect('/administrator');
       }
       else if (req.session.user.role === 'user') { // redirect to user route if they're a user
            return res.redirect('/user');
       }
  }
  else { // if there isn't a user logged in 
       next(); // go into the signupuser route
  }
});

app.use('/signinuser', (req, res, next) => {
  if (req.session.user) { // if there is a user logged in
       if (req.session.user.role === 'admin') { // redirect to admin route if they're an administrator
            return res.redirect('/administrator');
       }
       else if (req.session.user.role === 'user') { // redirect to user route if they're a user
            return res.redirect('/user');
       }
  }
  else { // if there isn't a user logged in 
       next();  // get in to the signinuser route
  }
});

app.use('/user', (req, res, next) => {
  console.log(req.session.id);
  if (!req.session.user) { // if a user is not logged in
       return res.redirect('/signinuser'); // redirect them to the GET /signinuser route
  }
  else { // if the user is logged in, the middleware will "fall through" calling the next() callback
       next(); // get in to the user route
  }
});

buildRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});