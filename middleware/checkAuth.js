function checkAuth(req, res, next) {
    console.log('did a user log in...', req.user);
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    };
};

module.exports = checkAuth;