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
  console.log("Server has started 🚀");
});

// les modèles à utiliser
// const Event = mongoose.model("Event", {
//   date: Date,
//   name: String,
//   seats: {
//     orchestre: Number,
//     mezzanine: Number,
//   },
// });

// const Ticket = mongoose.model("Ticket", {
//   mail: String,
//   username: String,
//   date: Date,
//   category: String,
//   seats: Number,
//   event: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Event",
//   },
// });

// CRUD

// // CREATE => POST (créer un évènement)
// app.post("/events", async (req, res) => {
//   try {
//     const eventName = req.body.name;
//     const eventDate = req.body.date;
//     const orchestreSeats = req.body.seats.orchestre;
//     const mezzanineSeats = req.body.seats.mezzanine;

//     const newEvent = new Event({
//       name: eventName,
//       date: eventDate,
//       seats: {
//         orchestre: orchestreSeats,
//         mezzanine: mezzanineSeats,
//       },
//     });

//     await newEvent.save();

//     res.json({ message: "Event successfully created" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // READ => GET (récupérer les évènements pour une date donnée)
// app.get("/events", async (req, res) => {
//   try {
//     const events = await Event.find({ date: req.query.date });

//     res.json({ events });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // READ => GET (récupérer les informations concernant un évènement donné, via son 'id')
// app.get("/events/:id", async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);

//     res.json({ event });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // CREATE => POST (effectuer une réservation)
// app.post("/tickets", async (req, res) => {
//   try {
//     const eventId = req.body.eventId;
//     const reservationMail = req.body.email;
//     const reservationUsername = req.body.username;
//     const reservationCategory = req.body.category;
//     const reservationSeats = req.body.seats;
//     const reservationDate = new Date();

//     const newReservation = new Ticket({
//       mail: reservationMail,
//       username: reservationUsername,
//       date: reservationDate,
//       category: reservationCategory,
//       seats: reservationSeats,
//       event: eventId,
//     });

//     const event = await Event.findById(eventId); // récupération dans la BDD des informations de l'event lié à l'ID

//     // s'il n'y a plus assez de places disponible dans cette catégorie, le serveur répondra un status '400'
//     if (
//       newReservation.category === "orchestre" &&
//       event.seats.orchestre < newReservation.seats
//     ) {
//       return res.status(400).json({
//         message: `Not enough available seats for orchestre category`,
//       });
//     }

//     if (
//       newReservation.category === "mezzanine" &&
//       event.seats.mezzanine < newReservation.seats
//     ) {
//       return res.status(400).json({
//         message: `Not enough available seats for mezzanine category`,
//       });
//     }

//     // si la catégorie ('orchestre' ou 'mezzazine') ou le nombre de places (entre 1 & 4) demandées ne sont pas valides, le serveur répondra un status '400'
//     if (
//       newReservation.category !== "orchestre" &&
//       newReservation.category !== "mezzanine"
//     ) {
//       return res.status(400).json({ message: "Invalid request" });
//     }

//     if (newReservation.seats < 1 || newReservation.seats > 4) {
//       return res.status(400).json({ message: "Invalid request" });
//     }

//     // mise à jour du nombre de siège restant après une réservation
//     if (newReservation.category === "orchestre") {
//       event.seats.orchestre = event.seats.orchestre - newReservation.seats;
//     } else {
//       event.seats.mezzanine = event.seats.mezzanine - newReservation.seats;
//     }

//     await newReservation.save();
//     await event.save();

//     res.json({ message: `${newReservation.seats} seats successfully booked` });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // READ => GET (récupérer toutes les réservations d'un utilisateur donné)
// app.get("/tickets/:mail", async (req, res) => {
//   try {
//     const allReservation = await Ticket.find({
//       mail: req.params.mail,
//     }).populate("event");

//     res.json(allReservation);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// });
