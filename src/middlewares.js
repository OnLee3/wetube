export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    res.locals.siteName="Wetube";
    next();
}

export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn){
        next()
    } else {
        return res.redirect("/")
    }
}

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn){
        return next();
    } else {
        return res.redirect("/");
    }
}