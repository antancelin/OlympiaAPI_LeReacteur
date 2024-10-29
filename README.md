# L'Olympia API - Serveur

En charge de la création du nouveau système de réservation de la salle de spectacles L'Olympia, vous avez la responsabilité de fournir aux différents partenaires (Fnac Spectacles, ticketmaster, ticketac, etc.) une API leur permettant d'effectuer des réservations.

La capacité de la salle est de 1164 places en orchestre et 824 en mezzanine.

- Vous devrez créer une collection 'Event' et une collection 'Ticket'.
- Chaque Ticket devra avoir une référence vers l'Event correspondant.

Vous devrez utiliser 'Router'.

RDV en bas de cette page dans "Aide" pour trouver les modèles utiles à cet exercice.

## Créer un événement

- URL : http://localhost:3000/events
- Méthode : POST
- Paramètres body :
- "name" (nom de l'événement)
- "date" (date de l'événement)
- "seats" (nombre de places disponibles pour l'événement)

#### Exemple

- POST : http://localhost:3000/events

```json
{
  "name": "Concert de Marcus Miller",
  "date": "2022-02-01",
  "seats": {
    "orchestre": 1164,
    "mezzanine": 824
  }
}
```

Le serveur répondra :

```json
{
  "message": "Event successfully created"
}
```

## Récupérer les événements pour une date donnée

- URL : http://localhost:3000/events
- Méthode : GET
- Paramètres query :
  - "date" (exemple: "2022-02-01")

### Exemple

- GET : http://localhost:3000/events?date=2022-02-01

Le serveur répondra et enverra un tableau d'événements pour le 1er février 2022.

```json
[
  {
    "seats": {
      "orchestre": 1164,
      "mezzanine": 824
    },
    "_id": "5e1d81111eab0769958cd3e0",
    "date": "2022-02-01T00:00:00.000Z",
    "name": "Concert de Gaël Faye",
    "__v": 0
  },
  // ... //
  {
    "seats": {
      "orchestre": 1164,
      "mezzanine": 824
    },
    "_id": "5e1d81371eab0769958cd3e1",
    "date": "2022-02-01T00:00:00.000Z",
    "name": "Concert de Marcus Miller",
    "__v": 0
  }
  // ... //
]
```

## Récupérer les informations concernant un événement donné

- URL : http://localhost:3000/events/:id
- Méthode : GET
- Paramètres params :
  - "id" (id de l'event)

### Exemple

- GET : http://localhost:3000/events/5e1d81371eab0769958cd3e1

Le serveur répondra et enverra notamment le nombre de places disponibles pour l'événement en question.

```json
{
  "seats": {
    "orchestre": 1164,
    "mezzanine": 824
  },
  "_id": "5e1d81371eab0769958cd3e1",
  "date": "2022-02-01T00:00:00.000Z",
  "name": "Concert de Marcus Miller",
  "__v": 0
}
```

## Effectuer une réservation

- URL : http://localhost:3000/tickets
- Méthode : POST
- Paramètres body :
  - "eventId" (exemple: "5e1d81371eab0769958cd3e1")
  - "email" (email de l'acheteur)
  - "username" (username de l'acheteur)
  - "category" (orchestre ou mezzanine)
  - "seats" (de 1 à 4)

### Exemple

- POST : http://localhost:3000/tickets

```json
{
  "eventId": "5e1d81371eab0769958cd3e1",
  "email": "han.solo@lereacteur.io",
  "username": "hanSolo",
  "category": "orchestre",
  "seats": 2
}
```

📍 La clef 'date' des tickets doit correspondre à la date à laquelle est faite la réservation, vous êtes libres d'enregistrer cette dernière sous n'importe quel format. Vous aurez besoin d'utiliser 'new Date()'.

Le serveur enregistrera la réservation pour l'événement donné.

```json
{
  "message": "2 seats successfully booked"
}
```

S'il n'y a plus assez de places disponibles, le serveur répondra un status '400' :

```json
{
  "message": "Not enough available seats for this category"
}
```

Si la catégorie ou le nombre de places demandées ne sont pas valides, le serveur répondra un status '400' :

```json
{
  "message": "Invalid request"
}
```

Si on appelle de nouveau 'GET' : http://localhost:3000/events?date=2022-02-01 ou 'GET' : http://localhost:3000/events/5b2b9ef2c6dc7a37c8dadfc6, le nombre de places disponibles aura été mis à jour.

## Récupérer toutes les réservations d'un utilisateur donné

- URL : http://localhost:3000/tickets/:email
- Méthode : GET
- Paramètres params :
  - "email" (email de l'utilisateur)

### Exemple

- GET : http://localhost:3000/tickets/nono@lereacteur.io

Le serveur répondra :

```json
[
  {
    "_id": "5e1dcb129751b96fcdb61ec6",
    "mail": "luke.skywalker@lereacteur.io",
    "username": "lukeJedi",
    "date": "2022-01-12",
    "category": "mezzanine",
    "seats": 2,
    "event": {
      "seats": {
        "orchestre": 1164,
        "mezzanine": 822
      },
      "_id": "5e1dcad39751b96fcdb61ec4",
      "date": "2022-02-15",
      "name": "Concert de Vincent Delerm",
      "__v": 0
    },
    "__v": 0
  },
  {
    "_id": "5e1dcb2a9751b96fcdb61ec7",
    "mail": "luke.skywalker@lereacteur.io",
    "username": "lukeJedi",
    "date": "2022-02-03",
    "category": "orchestre",
    "seats": 2,
    "event": {
      "seats": {
        "orchestre": 1162,
        "mezzanine": 824
      },
      "_id": "5e1dcac69751b96fcdb61ec3",
      "date": "2022-02-08",
      "name": "Concert de Deluxe",
      "__v": 0
    },
    "__v": 0
  }
]
```

Notez ici la nécessité de récupérer également le détail des événements concernés.

## Aide

Pour vous aider, voici les models :

```js
const Event = mongoose.model("Event", {
  date: Date,
  name: String,
  seats: {
    orchestre: Number,
    mezzanine: Number,
  },
});

const Ticket = mongoose.model("Ticket", {
  mail: String,
  username: String,
  date: Date,
  category: String,
  seats: Number,
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
});
```

## Bonus

- Créez les routes pour :
  - modifier un événement
  - supprimer un événement (les tickets correpondants devront également être supprimés)
  - annuler une réservation (les places disponibles pour l'événement devront être mises à jour)
