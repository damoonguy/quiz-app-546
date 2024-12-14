//Here you will require route files and export them as used in previous labs.
//Here you will import route files and export them as used in previous labs

import { Router } from "express";
import adminRoutes from './admin.js';
import userRoutes from './users.js';
import { users } from '../config/mongoCollections.js';
import { validateEmail, validatePassword, validateName, validateUsername, validateRole, hashPassword, comparePasswords } from '../helpers.js';

export const buildRoutes = (app) => {
    app.use('/admin', adminRoutes);
    app.use('/user', userRoutes);
    
    // Home route
    app.get('/', (req, res) => {
        res.render('home', {
            title: 'Quiz App'
        });
    });

    // Login route
    app.route('/login')
        .get((req, res) => {
            if (req.session.user) {
                return res.redirect(req.session.user.role === 'admin' ? '/admin' : '/user');
            }
            res.render('login', { title: 'Login' });
        })
        .post(async (req, res) => {
            try {
                const { email, password } = req.body;

                if (!email || !password) {
                    return res.status(400).render('login', {
                        title: 'Login',
                        error: 'All fields are required'
                    });
                }

                if (!validateEmail(email)) {
                    return res.status(400).render('login', {
                        title: 'Login',
                        error: 'Invalid email format'
                    });
                }

                const userCollection = await users();
                const user = await userCollection.findOne({ email: email.toLowerCase() });

                if (!user || !(await comparePasswords(password, user.password))) {
                    return res.status(401).render('login', {
                        title: 'Login',
                        error: 'Invalid email or password'
                    });
                }

                req.session.user = {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                };

                res.redirect(user.role === 'admin' ? '/admin' : '/user');
            } catch (e) {
                res.status(500).render('login', {
                    title: 'Login',
                    error: 'Internal server error'
                });
            }
        });

    // Register route
    app.route('/register')
        .get((req, res) => {
            if (req.session.user) {
                return res.redirect(req.session.user.role === 'admin' ? '/admin' : '/user');
            }
            res.render('register', { title: 'Register' });
        })
        .post(async (req, res) => {
            try {
                console.log('Registration attempt:', req.body); // Debug log

                const { firstName, lastName, username, email, password, confirmPassword, role } = req.body;

                // Validate all fields are present
                if (!firstName || !lastName || !username || !email || !password || !confirmPassword || !role) {
                    throw new Error('All fields are required');
                }

                // Validate each field
                if (!validateName(firstName)) throw new Error('Invalid first name');
                if (!validateName(lastName)) throw new Error('Invalid last name');
                if (!validateUsername(username)) throw new Error('Invalid username');
                if (!validateEmail(email)) throw new Error('Invalid email format');
                if (!validatePassword(password)) throw new Error('Password must be at least 8 characters');
                if (password !== confirmPassword) throw new Error('Passwords do not match');
                if (!validateRole(role)) throw new Error('Invalid role selected');

                const userCollection = await users();
                console.log('Connected to user collection'); // Debug log

                const existingUser = await userCollection.findOne({
                    $or: [
                        { email: email.toLowerCase() },
                        { username: username.toLowerCase() }
                    ]
                });

                if (existingUser) {
                    throw new Error('Username or email already exists');
                }

                const hashedPassword = await hashPassword(password);
                const newUser = {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    username: username.toLowerCase(),
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    role: role,
                    createdAt: new Date()
                };

                console.log('Attempting to insert user:', { ...newUser, password: '[HIDDEN]' }); // Debug log

                const insertInfo = await userCollection.insertOne(newUser);
                
                if (!insertInfo.acknowledged) {
                    throw new Error('Could not add user');
                }

                // Add the session
                req.session.user = {
                    id: insertInfo.insertedId,
                    username: newUser.username,
                    email: newUser.email,
                    role: newUser.role
                };

                // Redirect based on role
                res.redirect(newUser.role === 'admin' ? '/admin' : '/user');
            } catch (e) {
                console.error('Registration error:', e); // Debug log
                res.status(400).render('register', {
                    title: 'Register',
                    error: e.message,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    email: req.body.email
                });
            }
        });

    // Logout route - make sure it's BEFORE the 404 catch-all
    app.get('/logout', (req, res) => {
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Session destruction error:', err);
                    return res.status(500).render('error', {
                        title: 'Error',
                        error: 'Could not log out'
                    });
                }
                res.clearCookie('QuizAppSession'); // Clear the session cookie
                res.redirect('/');
            });
        } else {
            res.redirect('/');
        }
    });

    // 404 middleware - this should be last
    app.use('*', (req, res) => {
        res.status(404).render('error', {
            title: '404 Not Found',
            error: 'Page not found'
        });
    });

    app.get('/test-db', async (req, res) => {
        try {
            const userCollection = await users();
            const count = await userCollection.countDocuments();
            res.json({ message: 'Database connected', userCount: count });
        } catch (e) {
            console.error('Database test error:', e);
            res.status(500).json({ error: e.message });
        }
    });
};

