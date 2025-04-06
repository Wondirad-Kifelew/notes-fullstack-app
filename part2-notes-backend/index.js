require("dotenv").config(); //the .env file is in the same dir. if not specify
const express = require("express");
const Note = require("./models/note");
// const mongoose = require("mongoose");

const app = express();
app.use(express.json()); //mid ware to parse the req.body

//mid ware to print request
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(requestLogger);

//
app.use(express.static("dist")); //serve static files

//handle get request to the whole note res
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
    console.log(JSON.stringify(notes)); //print the result
  });
});
//handle get request to a specific note
app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const note = JSON.stringify(Note.find({})).find((note) => note.id === id);
  //  const note  = Note.find({id:request.params.id})
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});
//handle delete request to a specific note
app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  notes = notes.filter((note) => note.id != id);
  response.status(204).end();
});
//handle post request to add notes to the server
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return String(maxId + 1);
};
app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  console.log(note, "and the request header", request.headers);
  response.json(note);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);
const PORT = process.env.PORT; //||3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
