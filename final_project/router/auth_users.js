const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
  return user.username === username
});
if(userswithsamename.length > 0){
  return true;
} else {
  return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
  return (user.username === username && user.password === password)
});
if(validusers.length > 0){
  return true;
} else {
  return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
  }

  
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
      return res.status(401).json({ message: "Invalid credentials. Verify your username and password." });
  }

  // generate a JWT
  const token = jwt.sign({ username: user.username }, 'secreto');

  // return a token like respose
  return res.status(200).json({ token });
 
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const newReview = req.body.review; 

  if (!books[isbn]) {
      return res.status(404).json({ message: `No book was found with the ISBN ${isbn}.` });
  }

  books[isbn].review = newReview;

  return res.status(200).json({ message: `Book review with ISBN ${isbn} correctly updated.` });
});
//Delete method
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Update the code here
  const isbn = req.params.isbn;
  if (isbn){
      delete books[isbn]
  }
  res.send(`Review with the ${isbn} deleted.`);
  res.send("Yet to be implemented")
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;