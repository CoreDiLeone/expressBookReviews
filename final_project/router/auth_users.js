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
      return res.status(400).json({ message: "El nombre de usuario y la contraseña son obligatorios." });
  }

  
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas. Verifique su nombre de usuario y contraseña." });
  }

  // Generar un token JWT
  const token = jwt.sign({ username: user.username }, 'secreto');

  // Devolver el token JWT como respuesta
  return res.status(200).json({ token });
 
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const newReview = req.body.review; 

  if (!books[isbn]) {
      return res.status(404).json({ message: `No se encontró ningún libro con el ISBN ${isbn}.` });
  }

  books[isbn].review = newReview;

  return res.status(200).json({ message: `Reseña del libro con el ISBN ${isbn} actualizada correctamente.` });
});
//Delete method
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Update the code here
  const isbn = req.params.isbn;
  if (isbn){
      delete books[isbn]
  }
  res.send(`Review with the ${isbn} deleted.`);
  res.send("Yet to be implemented")//This line is to be replaced with actual return value
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;