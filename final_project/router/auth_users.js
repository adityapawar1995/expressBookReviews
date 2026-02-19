const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
pp.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
     if(req.session.authorization){
         token = req.session.authorization['accessToken'];
         jwt.verify(token, "access", (err,user)=>{
             if(!err){
                req.user = user;
                next();
                }else{
                 return res.status(403).json({message: "User not authenticated"})
             }
         })
     }else{
         return res.status(403).json({message: "User not authenticated"})
     }
});
app.post("/customer/login", function login(req,res){
      username = req.body.username;
      password = req.body.password;
    if(!username || !password){
        return res.status(400).json({message: "Username and password are required"});
    }
    if(username === "admin" && password === "password"){
        const token = jwt.sign({username}, "access", {expiresIn: "1h"});
        req.session.authorization = {accessToken: token};
        return res.status(200).json({message: "Login successful"});
    }else{
        return res.status(401).json({message: "Invalid username or password"});
    }
});
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    // Find user
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }
    // Generate token
    const token = jwt.sign({ username }, "access", { expiresIn: "1h" });
    req.session.authorization = { accessToken: token };
    return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session?.authorization?.username;
    if (!username) {
        return res.status(401).json({message: "User not authenticated"});
    }
    if (!review) {
        return res.status(400).json({message: "Review is required as a query parameter"});
    }
    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }
    // Add or update review
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: "Review posted/updated successfully", reviews: books[isbn].reviews});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
