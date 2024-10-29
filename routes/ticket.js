const express = require("express");
const { isPast, parseISO } = require("date-fns");
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");

const router = express.Router();

// CREATE => POST (effectuer une réservation)
router.post("/tickets", async (req, res) => {
  try {
    const eventId = req.body.eventId;
    const eventDate = parseISO(req.body.date);
    const reservationMail = req.body.email;
    const reservationUsername = req.body.username;
    const reservationCategory = req.body.category;
    const reservationSeats = req.body.seats;
    const reservationDate = new Date();

    // vérification de la date si dans le passée
    if (isPast(eventDate)) {
      return res.status(400).json({
        message: "Can't booked a passed date",
      });
    }

    const newReservation = new Ticket({
      mail: reservationMail,
      username: reservationUsername,
      date: reservationDate,
      category: reservationCategory,
      seats: reservationSeats,
      event: eventId,
    });

    const event = await Event.findById(eventId); // récupération dans la BDD des informations de l'event lié à l'ID

    // s'il n'y a plus assez de places disponible dans cette catégorie, le serveur répondra un status '400'
    if (
      newReservation.category === "orchestre" &&
      event.seats.orchestre < newReservation.seats
    ) {
      return res.status(400).json({
        message: `Not enough available seats for orchestre category`,
      });
    }

    if (
      newReservation.category === "mezzanine" &&
      event.seats.mezzanine < newReservation.seats
    ) {
      return res.status(400).json({
        message: `Not enough available seats for mezzanine category`,
      });
    }

    // si la catégorie ('orchestre' ou 'mezzazine') ou le nombre de places (entre 1 & 4) demandées ne sont pas valides, le serveur répondra un status '400'
    if (
      newReservation.category !== "orchestre" &&
      newReservation.category !== "mezzanine"
    ) {
      return res.status(400).json({ message: "Invalid request" });
    }

    if (newReservation.seats < 1 || newReservation.seats > 4) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // mise à jour du nombre de siège restant après une réservation
    if (newReservation.category === "orchestre") {
      event.seats.orchestre = event.seats.orchestre - newReservation.seats;
    } else {
      event.seats.mezzanine = event.seats.mezzanine - newReservation.seats;
    }

    await newReservation.save();
    await event.save();

    res.json({ message: `${newReservation.seats} seats successfully booked` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//
// READ => GET (récupérer toutes les réservations d'un utilisateur donné)
router.get("/tickets/:mail", async (req, res) => {
  try {
    const allReservation = await Ticket.find({
      mail: req.params.mail,
    }).populate("event");

    res.json(allReservation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// BONUS

// DELETE => DELETE (annuler une réservation)
router.delete("/tickets/:id", async (req, res) => {
  try {
    const ticketId = req.params.id;
    // console.log(ticketId); // 671ff3f3a382505e30efa7d1

    const cancelledTicket = await Ticket.findByIdAndDelete(ticketId);
    // const cancelledTicket = await Ticket.findById(ticketId);

    if (!cancelledTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const event = await Event.findById(cancelledTicket.event);

    if (!event) {
      return res.status(404).json({ message: "Event associated not found" });
    }

    if (cancelledTicket.category === "orchestre") {
      event.seats.orchestre += cancelledTicket.seats;
    } else {
      event.seats.mezzanine += cancelledTicket.seats;
    }

    await event.save();

    res.status(200).json({
      message: "Reservation canceled with success",
      cancelledTicket: cancelledTicket,
      updatedEvent: {
        id: event._id,
        availableSeats: event.availableSeats,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
