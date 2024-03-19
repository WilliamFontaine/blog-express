const User = require('../models/User');
class AuthController {

    showLogin(req, res) {
        res.render('auth/login', {
            error: null
        });
    }

    async handleLogin(req, res) {
        const user = await User.findOne({email: req.body.email});
        if (user) {
            return user.comparePassword(req.body.password, (err, isMatch) => {
                if (!isMatch) {
                    res.render('auth/login', {
                        error: 'Email or password is incorrect.'
                    });
                }
                else {
                    req.session.user = user;
                    res.redirect('/products');
                }
            });
        } else {
            res.render('auth/login', {
                error: 'Email or password is incorrect.'
            });
        }
    }

    showRegister(req, res) {
        res.render('auth/register', {
            error: null
        });
    }

    async handleRegister(req, res) {
        if (req.body.password !== req.body.password_confirmation) {
            return res.render('auth/register', {
                error: 'Password and password confirmation must be the same.'
            });
        }

        if(req.body.password.length < 8) {
            return res.render('auth/register', {
                error: 'Password must be at least 8 characters long.'
            });
        }

        if(await User.findOne({email: req.body.email})) {
            return res.render('auth/register', {
                error: 'An account with this email already exists.'
            });
        }

        const user = new User(req.body);
        await user.save();
        req.session.user = user;
        res.redirect('/products');
    }

    async handleLogout(req, res) {
        req.session.destroy();
        res.redirect('/products');
    }
}

module.exports = new AuthController();