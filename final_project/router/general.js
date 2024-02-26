const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "El nombre de usuario y la contraseña son obligatorios." });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "El nombre de usuario ya está en uso." });
  }

 
  users.push({ username, password });

  return res.status(201).json({ message: "Usuario registrado exitosamente. Ahora puedes iniciar sesión." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
          
            resolve();
        }, 6000);
    });

    res.send(JSON.stringify(books, null, 4));
} catch (error) {
   
    console.error("Error:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
}
 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
      const isbn = req.params.isbn;
      const book = await getBookByIsbn(isbn);

      if (book) {
          res.send(book);
      } else {
          res.status(404).send("Libro no encontrado");
      }
  } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Función para obtener un libro por su ISBN de manera asíncrona
async function getBookByIsbn(isbn) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          const book = books[isbn];
          resolve(book);
      }, 2000); // Simulación de operación asíncrona
  });
}

  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
      const authorToFind = req.params.author;
      const booksByAuthor = await getBooksByAuthor(authorToFind);

      if (booksByAuthor.length > 0) {
          res.send(booksByAuthor);
      } else {
          res.status(404).send("Autor no encontrado");
      }
  } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Función para obtener libros por autor de manera asíncrona
async function getBooksByAuthor(authorToFind) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          const booksByAuthor = [];
          for (let isbn of Object.keys(books)) {
              const book = books[isbn];
              if (book.author === authorToFind) {
                  booksByAuthor.push(book);
              }
          }
          resolve(booksByAuthor);
      }, 2000); // Simulación de operación asíncrona
  });
}


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
      const titleToFind = req.params.title;
      const booksByTitle = await getBooksByTitle(titleToFind);

      if (booksByTitle.length > 0) {
          res.send(booksByTitle);
      } else {
          res.status(404).send("Título no encontrado");
      }
  } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Función para obtener libros por título de manera asíncrona
async function getBooksByTitle(titleToFind) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          const booksByTitle = [];
          for (let isbn of Object.keys(books)) {
              const book = books[isbn];
              if (book.title === titleToFind) {
                  booksByTitle.push(book);
              }
          }
          resolve(booksByTitle);
      }, 2000); // Simulación de operación asíncrona
  });
}


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const reviewToFind = req.params.isbn;
  const booksByReviews = [];

  for (let value of Object.keys(books)) {
    const book = books[value];
    if (value === reviewToFind) {
      if (book.reviews) { 
        booksByReviews.push(book);
      }
    }
  }

  if (booksByReviews.length > 0) {
    res.send(booksByReviews); 
  } else {
    res.status(404).send("Reviews not found");
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
