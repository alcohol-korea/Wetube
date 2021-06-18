import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req,res) => res.render("join",{pageTitle: "Join"});
export const postJoin = async(req,res) => {
    const {email, username, password, password2, name, location} = req.body;
    if(password !== password2){
        return res.staus(400).render("join",{
            pageTitle,
            errorMessage: "Password confirmation does not match",
        });
    }
    const exists = await User.exists({$or: [{username},{email}]});//error메시지를 따로 안만드는 이유는 exists가 boolean이기 떄문이다. or operator로 2개다함  username과 email은 unique 하나밖에 존재하지 않음
    if(exists){//username이 true일떄 true === true니깐 성립 false면 성립하지않으므로 따로 error표시 안해도됨
        return res.staus(400).render("join",{
            pageTitle,
            errorMessage: "The is already taken",
        });
    }
    try{await User.create({
        email, 
        username, 
        password, 
        name, 
        location
    });
    return res.redirect("/login");
    }catch(error){
        return res.staus(400).render("join",{
        pageTitle,
        errorMessage: error._message,//그 error를 upload template에 message로 보냄
        });  
    }
};
export const getLogin = (req,res) => res.render("login",{pageTitle: "Log In"});
export const postLogin = async(req,res) => {
    const {username, password} = req.body;//req.body 에서 username password 변수로 가져옴
    const user = await User.findOne({username, socialOnly: false});//username을 User.js에서 가져온것 = user
    if(!user){
        return res.status(400).render("login", {
            pageTitle:"Log In",
            errorMessage: "An account with this username does not exists.",
        });
    }
    const ok = await bcrypt.compare(password, user.password);//(password= req.body즉 입력된정보에서 가져온 password이며 이건 pre save에서 이미 hash 됨)
     if(!ok){
        return res.status(400).render("login", {
            pageTitle:"Log In",
            errorMessage: "Wrong password",
        });
     }//login실패시 if문에서 다걸러짐
     req.session.loggedIn = true;
     req.session.user = user;//login 성공시 loggedIn은 true이고 user값이 있어야함
    return res.redirect("/");
};
export const startGithubLogin = (req,res) => {
    const baseurl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false, //continue with github를 눌렀을떄 github에 인증되지 않은 사용자는 못쓰도록함 
        scope: "read:user user:email"//user로 뭘할건지 설정 scope로만 해야됨
    };
    const params = new URLSearchParams(config).toString();
    //config의 parameters들을 url로 써줌 =>client_id=0082cbdfb3cf31d42c2a&allow_signup=false&scope=read:user%20user:email
    const finalurl = `${baseurl}?${params}`;
    return res.redirect(finalurl);//user을 github에 보냄
};
export const finishGithubLogin = async (req,res) => {
    const baseurl="https://github.com/login/oauth/access_token";
    const config={
        client_id: process.env.GH_CLIENT,
        client_secret:process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalurl = `${baseurl}?${params}`;
    const tokenRequest = await( await fetch(finalurl,{//해당 url에서 가져올 정보의 options들을 정함 그리고 그거에 맞게 가져옴
        method: "POST",//code를 access_token으로 변환하도록 request를 보내는 것을 post로 함
        headers:{
            Accept: "application/json",
        },
    })).json();//{"access_token":"gho_16C7e42F292c6912E7710c838347Ae178B4a", "scope":"repo,gist", "token_type":"bearer"} example처럼 받아옴
    /*res.send(JSON.stringify(json));//frontend에서 볼수있게 함*/
    if("access_token" in tokenRequest){//*access_token은 한번밖에 사용할수 없음
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`,{// api에서 code와 바꾼 승인된 토큰으로 정보 찾음 
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();//api에서 user의 정보를 가져옴
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`,{
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();//user의 정보에서 email은 privacy이므로 fetch로 email정보를 가져옴
        const emailObj = emailData.find(//입력한 정보의 조건에 맞는 email을 email 정보에서 찾음.
            (email) => email.primary === true && email.verified ===true
        );//email정보중에서 login하기위해서 입력한 정보를 골라냄 위 조건이 그것임.
        if(!emailObj){//입력한계정이 없을때 
            //set notification
            return res.rediredct("/login");//입력한email과 password가 기존 계정이 아닐때
        }
        let user = await User.findOne({//입력한계정이 있을때
            email: emailObj.email
        });//user db에서 입력한 email과 같은 email이 있는지 확인한 결과가유저임을 선언
        if(!user){//유저가 아닐때
            //새로운 계정을 만들어줘야함
             user = await User.create({
                avatarUrl: userData.avatar_url,
                name: userData.name,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,/*github로그인으로 생성된 계정이어서 email만 존재하고 비번은 없다
                postLogin에서 socialOnly false이어서 email과 password다입력한사람임을 알기위해*/
                location: userData.location,
            });
        }//게정 만들거나 있으면 이제 login되도록함
            req.session.loggedIn = true;
            req.session.user = user;//email이 같을때 login된 상태로 해주기 임
            return res.redirect("/")
    }else{//아니면 login으로 다시감.
        return res.redirect("/login");
        //sending notification을 위해서 redirect해놓음 
    }
};
export const logout = (req,res) => {
    req.session.destroy();//browser이 요청하는 session을 없앰 
    return res.redirect("/");
};
export const getEdit = (req,res) => {res.render("edit-profile",{pageTitle: "Edit-Profile"});};
export const postEdit = async(req,res) => {
    const {
        session: {
          user: {_id,},
        },
        body: { email,username,name,location},
    } = req;
    const exists = await User.exists({
        $and: [{_id: {$ne: _id} }, {$or: [{username}, {email}] } ],
    });
    if(exists){
        return res.status(400).render("edit-profile",{
            pageTitle: "Edit Profile",
            errorMessage: "You don't have to modify yours."
        });
    }
    const updatedUser = await User.findByIdAndUpdate(_id, {
        name,
        email,
        username,
        location,
    },{
        new: true,
    });
    req.session.user = updatedUser;    

    return res.redirect("/users/edit");
};

export const see = (req,res) => res.send(`See User: ${req.params.id}`);