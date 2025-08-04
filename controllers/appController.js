const passport = require("passport");

exports.getApp = (req, res) => {
    res.render('app', {
        title: 'Hello world!'
    });
};

exports.loginGet = (req, res) => {
    res.render('login', {
        title: 'Log in'
    });
};

exports.uploadAddGet = (req, res) => {
    res.render('upload', {
        title: 'File Upload'
    });
};

exports.uploadAddPost = (req, res) => {
  res.redirect('/');
};

exports.loginPost = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
});

exports.logoutPost = (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        }
        res.redirect('/');
    });
};