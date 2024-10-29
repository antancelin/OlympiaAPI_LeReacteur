const express = require("express"); // import du package 'express'
const mongoose = require("mongoose"); // import du package 'mongoose'

const app = express(); // création du serveur
const port = 3000; // port utilisé pour faire tourner le serveur

app.use(express.json()); // permet de lire les 'body' dans les requêtes

mongoose.connect("mongodb://localhost:27017/olympia"); // connexion/création de la BDD

const eventRouter = require("./routes/event");
const ticketRouter = require("./routes/ticket");

app.use(eventRouter);
app.use(ticketRouter);

// gestion des mauvaises routes requêtées
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// lancement du serveur sur le port indiqué en amont
app.listen(port, () => {
  console.log("Server has started 🎙️");
});
