import User from "../models/User"
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
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const getLogin = (req, res) => res.render("login", {pageTitle:"Login"});
export const postLogin = async(req, res) => {
    const {username, password} = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({username:username})
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
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See User"); 