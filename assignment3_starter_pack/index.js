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

/* YOUR CODE STARTS HERE */

// TODO: Implement all logic from the assignment desription

//GET request for all books
app.get(apiPath + version + "/books", (req, res) => {
  res.status(200).json(books);
});

//GET request to return a specific book by its id
app.get(apiPath + version + "/books/:id", (req, res) => {

});

//POST request to create a new book within a specific genre
app.post(apiPath + version + "/genres/:genreId/books", (req, res) => {

});

//PATCH request to partially update a book by id
app.patch(apiPath + version + "/books/:id", (req, res) => {

});

//DELETE request to delete a book by id
app.delete(apiPath + version + "/books/:id", (req, res) => {

});

//GET request for all genres
app.get(apiPath + version + "/genres", (req, res) => {
  res.status(200).json(genres);
});

//POST request for genres
app.post(apiPath + version + "/genres", (req, res) => {
  if(!req.body.name) {
    return res.status(400).json({
      message: "Genres require at least a name.",
    });
  }
  
  let nameExists = false;

  genres.forEach(element => {
    if(req.body.name.toLowerCase() === element.name.toLowerCase()){
      nameExists = true;
    };
  });

  if(nameExists){
    return res.status(400).json({
      message: "This genre name already exists",
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

/* YOUR CODE ENDS HERE */

/* DO NOT REMOVE OR CHANGE THE FOLLOWING (IT HAS TO BE AT THE END OF THE FILE) */
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app; // Export the app
