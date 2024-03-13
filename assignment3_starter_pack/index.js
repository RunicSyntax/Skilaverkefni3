//Sample for Assignment 3
const express = require("express");

//Import a body parser module to be able to access the request body as json
const bodyParser = require("body-parser");

//Use cors to avoid issues with testing on localhost
const cors = require("cors");

const app = express();
const apiPath = "/api/";
const version = "v1";
const port = 3000;

//Tell express to use the body parser module
app.use(bodyParser.json());

//Tell express to use cors -- enables CORS for this backend
app.use(cors());

//Set Cors-related headers to prevent blocking of local requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const genres = [
  { id: 1, name: "Fiction" },
  { id: 2, name: "Non-Fiction" },
  { id: 3, name: "Science Fiction" },
  { id: 4, name: "Fantasy" },
];

let nextGenreId = 5;

const books = [
  { id: 1, title: "Pride and Prejudice",
    author: "Jane Austin", 
    genreId: 1 
  },
  {
    id: 2,
    title: "Independent People",
    author: "Halldór Laxnes",
    genreId: 1,
  },
  {
    id: 3,
    title: "Brief Answers to the Big Questions",
    author: "Stephen Hawking",
    genreId: 2,
  },
];

let nextBookId = 4;

/* YOUR CODE STARTS HERE */

//GET request for all books
app.get(apiPath + version + "/books", (req, res) => {
  //Check if there is a query
  const queryKeys = Object.keys(req.query)
  
  //If no query return full json list
  if(queryKeys.length === 0){
    res.status(200).json(books);
  }

  //Check if the correct query is being used
  if(queryKeys[0] === 'filter' && queryKeys.length === 1){
    const filter = req.query.filter;

    const filterGenre = genres.find(genre => genre.name.toLowerCase() === filter.toLowerCase());

    //If no books are found, return an empty array
    if(!filterGenre){
          res.status(200).json([]);
      }

    let filteredBooks = books.filter(book => book.genreId === filterGenre.id);
    res.status(200).json(filteredBooks);
  } else {
    res.status(400).json({
      message: "Invalid filter applied"
    })
  }
});

//GET request to return a specific book by its ID in a specific genre
app.get(apiPath + version + "/genres/:genreId/books/:id", (req, res) => {
  const inpBookId = +req.params.id;
  const inpGenreId = +req.params.genreId;

  const book = books.find(book => book.id === inpBookId && book.genreId === inpGenreId);
  //If no book is found, return 404 status
  if (!book){
      res.status(404).json({
      message: "There was no book found with the given ID in the specified genre."
    });
  }
  res.status(200).json(book)
});

//POST request to create a new book within a specific genre
app.post(apiPath + version + "/genres/:genreId/books", (req, res) => {
  const {title,author} = req.body

  //Check if necessary information is available
  if (!title || !author)
    res.status(400).send({
    message: "Required fields missing."
  })
  const genreId = +req.params.genreId;

  const genre = genres.find(genre => genre.id === genreId);

  //Check if the provided genre exists
  if (!genre)
      res.status(400).send({
      message: "The provided genre was not found."
    })
  const newId = nextBookId;
  const book = {
    id: newId,
    title,
    author,
    genreId
  };

  books.push(book)
  nextBookId++;

  res.status(201).json(book);
});

//PATCH request to partially update a book by id
app.patch(apiPath + version + "/genres/:genreId/books/:id", (req, res) => {
  const {title,author,genreId} = req.body;
  const inpBookId = +req.params.id;
  const inpGenreId = +req.params.genreId;

  const book = books.find(book => book.id === inpBookId);

  //Check if there is a book with the provided id, else return status 400 (Not 404 for some reason?)
  if (!book) {
      res.status(400).json({
      message: "There was no book found with the given ID."
    })
  }
  const genre = genres.find(genre => genre.id === inpGenreId);

  //Check if there is a genre with the provided id, else return status 404
  if (!genre)
      res.status(404).json({
      message: "This genre was not found."
    })

  //Check if the given books genre and the given genre match
  if (book.genreId !== inpGenreId){
      res.status(404).json({
      message: "There is a mismatch between the books genre and the supposed genre ID provided."
    })
  }

  if (title) {
    book.title = title;
  }
  if (author) {
    book.author = author;
  }
  if (genreId) {
    book.genreId = genreId;
  }
  res.status(200).json(book);
});

//DELETE request for deleting all books, not allowed
app.delete(apiPath + version + "/books", (req, res) => {
  res.status(405).json({
    message: "Method Not Allowed",
  })
})

//DELETE request to delete a book by id
app.delete(apiPath + version + "/books/:id", (req, res) => {
  const inpId = +req.params.id;

  //Catch any non numerical or negative id's
  if(inpId < 0 || isNaN(inpId)){
    res.status(400).json({
      message: "Id must be a valid id",
    })
  }

  //Find the index of the given book id
  const bookIndex = books.findIndex(book => book.id === inpId);

  //If no book with the given id is found return 404 status
  if(bookIndex == -1){
    res.status(404).json({
      message: "There was no book found with the given ID.",
    });
  }
  const delBook = books.splice(bookIndex, 1);
  res.status(200).json(delBook);
});

//GET request for all genres
app.get(apiPath + version + "/genres", (req, res) => {
  res.status(200).json(genres);
});

//POST request for genres
app.post(apiPath + version + "/genres", (req, res) => {
  //Check if the provided name is of the correct format
  if(!req.body.name || typeof req.body.name !== 'string' || req.body.name.trim().length === 0) {
    return res.status(400).json({
      message: "Genres require a valid name.",
    });
  }
  
  let nameExists = false;

  genres.forEach(element => {

    //Check if the genre does not already exist
    if(req.body.name.toLowerCase() === element.name.toLowerCase()){
      nameExists = true;
    };
  });

  if(nameExists){
    return res.status(400).json({
      message: "This genre name already exists.",
    })
  }
  const newGenre = {
    id: nextGenreId,
    name: req.body.name,
  };
  genres.push(newGenre);
  nextGenreId++;

  res.status(201).json(newGenre);
})

//DELETE request for deleting all genres, not allowed
app.delete(apiPath + version + "/genres", (req, res) => {
  res.status(405).json({
    message: "Method Not Allowed",
  })
})

//DELETE request for deleting a genre by id
app.delete(apiPath + version + "/genres/:id", (req, res) => {
  const inpId = +req.params.id;

  //Catch any non numerical or negative id's
  if(inpId < 0 || isNaN(inpId)){
    res.status(400).json({
      message: "Id must be a valid id",
    })
  }

  //Find the index of the given genre id
  const genreIndex = genres.findIndex(genre => genre.id === inpId);

  //If no genre is found return 404 status
  if(genreIndex == -1){
    res.status(404).json({
      message: "There was no genre found with the given ID.",
    });
  }

  book = books.find(book => book.genreId == inpId);

  //If the genre still has books, forbid its deletion
  if(book !== undefined){
    res.status(400).json({
      message: "Method Not Allowed",
    });
  }

  const delGenre = genres.splice(genreIndex, 1);
  res.status(200).json(delGenre);
})

/* YOUR CODE ENDS HERE */

/* DO NOT REMOVE OR CHANGE THE FOLLOWING (IT HAS TO BE AT THE END OF THE FILE) */
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app; // Export the app