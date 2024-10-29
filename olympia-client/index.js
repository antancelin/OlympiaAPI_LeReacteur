const axios = require("axios");
const { format, parseISO } = require("date-fns"); // gestion des dates
const readlineSync = require("readline-sync"); // intéragir avec le terminal

const BASE_URL = "http://localhost:3000"; // Adaptez l'URL selon votre configuration

async function makeReservation() {
  try {
    const eventId = readlineSync.question("ID de l'événement : ");
    const date = readlineSync.question("Date de l'événement (YYYY-MM-DD) : ");
    const email = readlineSync.question("Votre email : ");
    const username = readlineSync.question("Votre nom d'utilisateur : ");
    const category = readlineSync.question(
      "Catégorie (orchestre/mezzanine) : "
    );
    const seats = parseInt(readlineSync.question("Nombre de places (1-4) : "));

    const response = await axios.post(`${BASE_URL}/tickets`, {
      eventId,
      date,
      email,
      username,
      category,
      seats,
    });

    console.log("Réservation réussie :", response.data.message);
  } catch (error) {
    console.error(
      "Erreur lors de la réservation :",
      error.response ? error.response.data.message : error.message
    );
  }
}

async function main() {
  console.log("Bienvenue dans le système de réservation Olympia");

  while (true) {
    const choice = readlineSync.question(
      "Voulez-vous faire une réservation ? (o/n) : "
    );
    if (choice.toLowerCase() !== "o") break;
    await makeReservation();
  }

  console.log(
    "Merci d'avoir utilisé notre système de réservation. Au revoir !"
  );
}

main();
