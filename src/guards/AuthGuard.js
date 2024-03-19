class AuthGuard {

    checkUserLogged(req, res, next) {
        const baseUrl = req?.baseUrl;
        const user = req?.session?.user;

        if (baseUrl.includes("auth")) {
            if (user) {
                res.redirect('/products');
            } else {
                return next();
            }
        } else {
            if (user) {
                return next();
            } else {
                res.redirect('/auth/login');
            }
        }
    }
}

module.exports = new AuthGuard();