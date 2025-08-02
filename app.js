require('dotenv').config();
const express = require('express');
const path = require('node:path');
const session = require('express-session');
const prisma = require('./storages/prisma');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./storages/queries');
const appRouter = require('./routes/appRouter');

const app = express();
const PORT = process.env.APP_PORT;
const sessionSecret = process.env.SESSION_SECRET;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}));

app.use(session({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000
    },
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
        prisma,
        {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }
    )
}));

// app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const user = await db.getUser(email);
            console.log('Did I get a user...', user);
            if (!user) {
                return done(null, false, { message: 'Incorrect email'});
            }
            console.log('Checking password...', password, user.password);
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: 'Incorrect password'});
            }
            return done(null, user);
        } catch(error) {
            console.error(error);
            return done(error);
        }
    })
);

passport.serializeUser((user, done) => {
    console.log('serializing user...', user, user.id);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.getUserById(id);
        console.log('deserializing user...', id, user);
        done(null, user);
    } catch(error) {
        done(error);
    }
});

app.use('/', appRouter);

app.listen(PORT, console.log(`File storage app listening on ${PORT}`));