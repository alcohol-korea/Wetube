export const localsMiddleware = (req,res,next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);//boolean안에는 true인지 아닌지 모름 res.locals.loggedIn은 loggedIn이 변수임
    res.locals.siteName= "wetube";
    res.locals.loggedInUser = req.session.user ||{};//login 되었을떄  계정 생성되는거임 그러면서 loggout도 생김
    next();
};
export const protectorMiddleware = (req,res,next) => {
    if(req.session.loggedIn){
        return next();
    }else{
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req,res,next) => {
    if (!req.session.loggedIn){
        return next();
    }else{
        return res.redirect("/");
    }
};