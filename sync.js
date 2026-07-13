/* =====================================
   GOLDIES
   -------------------------------------

   Modul:
   sync.js

   Version:
   2.2.0b

   Beschreibung:
   CSV ↔ Firestore Synchronisation

===================================== */

console.log("sync.js Version 2.2.0b geladen");


const Sync = {

    /* =====================================
       CSV ANALYSE STARTEN
    ===================================== */

    async analyse() {

    console.clear();

    console.log("=================================");
    console.log(" GOLDIES SYNC");
    console.log(" Version " + APP.version);
    console.log("=================================");

    // CSV laden
    const csv = await this.loadCSV();

    // Firestore laden
    const dbData = await this.loadFirestore();

    // Datum vergleichen
    const dateResult =
        this.compareDates(csv, dbData);
       
   // Spieler vergleichen
   const playerResult =
    this.comparePlayers(csv, dbData);

    console.log("");

    console.log("Neue Daten:");
    console.log(dateResult.newDates);

    console.log("");

    console.log("Entfernte Daten:");
    console.log(dateResult.removedDates);

   console.log("");

   console.log("Neue Spieler:");
   console.log(playerResult.newPlayers);

   console.log("");

   console.log("Entfernte Spieler:");
   console.log(playerResult.removedPlayers);

},


    /* =====================================
       CSV LADEN
    ===================================== */

    async loadCSV() {

        return await loadCSV();

    },


    /* =====================================
       FIRESTORE LADEN
    ===================================== */

    async loadFirestore() {

        const doc = await db
            .collection("training")
            .doc("list")
            .get();

        if (!doc.exists)
            return [];

        const d = doc.data();

        if (!d.json)
            return [];

        return JSON.parse(d.json);

    },


    /* =====================================
       DATEN VERGLEICHEN
    ===================================== */

    compareDates(csv, dbData) {

        // Datumszeile CSV
        const csvDates = csv[0].slice(1);

        // Datumszeile Firestore
        const dbDates = dbData[0].slice(1);


        // Neue Daten
        const newDates =
            csvDates.filter(date => !dbDates.includes(date));


        // Entfernte Daten
        const removedDates =
            dbDates.filter(date => !csvDates.includes(date));


        return {

            newDates,

            removedDates

        };

    },


/* =====================================
   SPIELER VERGLEICHEN
===================================== */

comparePlayers(csv, dbData) {

    // Spielernamen CSV
    const csvPlayers =
        csv.slice(2).map(row => row[0]);

    // Spielernamen Firestore
    const dbPlayers =
        dbData.slice(2).map(row => row[0]);


    // Neue Spieler
    const newPlayers =
        csvPlayers.filter(name => !dbPlayers.includes(name));


    // Entfernte Spieler
    const removedPlayers =
        dbPlayers.filter(name => !csvPlayers.includes(name));


    return {

        newPlayers,

        removedPlayers

    };

},

};
