const passport = require("passport");
const multer = require('multer');
const upload = multer({ dest: '../public/' })

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

exports.uploadAddPost = (upload.single('file'), (req, res) => {
  // req.file is the name of your file in the form above, here 'uploaded_file'
  // req.body will hold the text fields, if there were any
  console.log(req.file, req.body)
  res.redirect('/');
});

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