const express = require("express");

const Event = require("../models/Event");
const Ticket = require("../models/Ticket");

const router = express.Router();

// CREATE => POST (créer un évènement)
router.post("/events", async (req, res) => {
  try {
    const eventName = req.body.name;
    const eventDate = req.body.date;
    const orchestreSeats = req.body.seats.orchestre;
    const mezzanineSeats = req.body.seats.mezzanine;

    const newEvent = new Event({
      name: eventName,
      date: eventDate,
      seats: {
        orchestre: orchestreSeats,
        mezzanine: mezzanineSeats,
      },
    });

    await newEvent.save();

    res.json({ message: "Event successfully created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// READ => GET (récupérer les évènements pour une date donnée)
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find({ date: req.query.date });

    res.json({ events });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// READ => GET (récupérer les informations concernant un évènement donné, via son 'id')
router.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    res.json({ event });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// BONUS

// UPDATE => PUT
router.put("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    event.name = req.body.name;
    event.seats.mezzanine = req.body.seats.mezzanine;
    event.seats.orchestre = req.body.seats.orchestre;

    await event.save();

    res.json({ message: "Event updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE => DELETE (supprimer un évènement et ses tickets associés)
router.delete("/events/:id", async (req, res) => {
  try {
    const eventId = req.params.id;

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const deleteResult = await Ticket.deleteMany({ event: eventId });

    res.json({
      message: "Event and tickets associeted deleted with succes",
      deletedEvent: deletedEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
