import User from "../models/User"
import fetch from "node-fetch"
import bcrypt from "bcrypt"

export const getJoin = (req, res) => res.render("Join", {pageTitle: "Join"});
export const postJoin = async(req, res) => {
    console.log(req.body);
    const {email, username, password, password2, name, location} = req.body;
    const pageTitle = "Join";
    if(password !== password2){
        return res.status(400).render("Join", {pageTitle, errorMessage:"Password confirmation does not match."})
    }
    const exists = await User.exists({$or: [{username:username},{email:email}]});
    if(exists){
        return res.status(400).render("Join", {pageTitle, errorMessage:"This username/email is already taken."})
    }
    try{
    await User.create({
        name,
        email,
        username,
        password,
        location
    })
    return res.redirect("/Login");
} catch(error){
    return res.status(400).render("join", {
        pageTitle: pageTitle,
        errorMessage: error._message,
    });
}
};
export const getLogin = (req, res) => res.render("login", {pageTitle:"Login"});
export const postLogin = async(req, res) => {
    const {username, password} = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({username:username, socialOnly:false})
    if(!user){
        return res.status(400).render("login",
        {
            pageTitle,
            errorMessage:"An account with this username does not exists. "
        })
    }
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login",
        {
            pageTitle,
            errorMessage:"Wrong password!"
        })
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const startGithubLogin = (req,res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email"
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
    //github에서 users/github/finish로 보내줌
}

export const finishGithubLogin = async(req,res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`
    
    const tokenRequest = await (
        await fetch(finalUrl, {
            method:"POST",
            headers:{
                Accept: "application/json",
            },
        })).json();
        if("access_token" in tokenRequest){
            const {access_token} = tokenRequest;
            const apiUrl = "https://api.github.com";
            const userData = await (await fetch(`${apiUrl}/user`, {
                headers:{
                    Authorization: `token ${access_token}`
                }
            })).json();
            console.log(userData);
            const emailData = await (
                await fetch(`${apiUrl}/user/emails`, {
                    headers:{
                        Authorization: `token ${access_token}`
                    }
                })
                ).json();
                console.log(emailData);
                const emailObj = emailData.find(email => email.primary === true && email.verified ===  true
                    );
                    if(!emailObj){
                        return res.redirect("/login");
                    }
                    let user = await User.findOne({email: emailObj.email});
                    if(!user){
                        user = await User.create({
                            avatarUrl: userData.avatar_url,
                            name: userData.name,
                            username: userData.login,
                            email: emailObj.email,
                            password:"",
                            socialOnly:true,
                            location: userData.location,
                        })
                    } 
                    req.session.loggedIn = true;
                    req.session.user = user;
                    return res.redirect("/");
                } else {
                    return res.redirect("/login");
                }
            }
            
            export const logout = (req, res) => {
                req.session.destroy();
                return res.redirect("/");
            }
            export const getEdit = (req, res) => {
                return res.render("edit-profile", {pageTitle:"Edit Profile"});
            }
            export const postEdit = async(req, res) => {
                const {
                    session: {
                        user : {
                            _id,
                            name : sessionName,
                            email : sessionEmail,
                            username : sessionUserName,
                            location : sessionLocation,
                                },
                            },

                        body : {name, email, username, location}
                    } = req;
            //email validation
            if (email !== sessionEmail){
                const emailExists = await User.exists({email});
                if(emailExists){
                    return res.status(400).render("edit-profile", {pageTitle:"Edit Profile", errorMessage:"This email is already taken."})
                };
                const updatedUser = await User.findByIdAndUpdate(_id, {
                    name:name, 
                    email:email, 
                    username:username, 
                    location:location,
                }, {new: true})
                req.session.user = updatedUser;
                return res.redirect("/users/edit");
            }   
            //username validation.
                else if(username !== sessionUserName){
                const userNameExists = await User.exists({username});
                if(userNameExists){
                    return res.status(400).render("edit-profile", {pageTitle:"Edit Profile", errorMessage:"This username is already taken."})
                }
                const updatedUser = await User.findByIdAndUpdate(_id, {
                    name:name, 
                    email:email, 
                    username:username, 
                    location:location,
                }, {new: true})
                req.session.user = updatedUser;
                return res.redirect("/users/edit");
            }
            //name, location check. 중복되도 상관 없음    
            else if( name !== sessionName ||
                location !== sessionLocation){
                const updatedUser = await User.findByIdAndUpdate(_id, {
                    name:name, 
                    location:location,
                }, {new: true})
                req.session.user = updatedUser;
                return res.redirect("/users/edit");
            } else {
                return res.redirect("/");
            }
        }
            export const see = (req, res) => res.send("See User"); 