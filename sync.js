/* =====================================
   GOLDIES
   -------------------------------------

   Modul:
   sync.js

   Version:
   2.2.0d

===================================== */

console.log("sync.js Version 2.2.0d geladen");

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

        const csv = await this.loadCSV();
        const dbData = await this.loadFirestore();

        const dateResult = this.compareDates(csv, dbData);
        const playerResult = this.comparePlayers(csv, dbData);

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

        // Lookup erzeugen
        const lookup = this.createLookup(dbData);

        console.log("");
        console.log("Lookup:");
        console.log(lookup);

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

        const csvDates = csv[0].slice(1);
        const dbDates = dbData[0].slice(1);

        return {

            newDates:
                csvDates.filter(date => !dbDates.includes(date)),

            removedDates:
                dbDates.filter(date => !csvDates.includes(date))

        };

    },

    /* =====================================
       SPIELER VERGLEICHEN
    ===================================== */

    comparePlayers(csv, dbData) {

        const csvPlayers =
            csv.slice(2).map(r => r[0]);

        const dbPlayers =
            dbData.slice(2).map(r => r[0]);

        return {

            newPlayers:
                csvPlayers.filter(name => !dbPlayers.includes(name)),

            removedPlayers:
                dbPlayers.filter(name => !csvPlayers.includes(name))

        };

    },

    /* =====================================
       SPIELER SUCHEN
    ===================================== */

    findPlayerRow(table, playerName) {

        for (let r = 2; r < table.length; r++) {

            if (table[r][0] === playerName) {

                return r;

            }

        }

        return -1;

    },

    /* =====================================
       DATUM SUCHEN
    ===================================== */

    findDateColumn(table, date) {

        for (let c = 1; c < table[0].length; c++) {

            if (table[0][c] === date) {

                return c;

            }

        }

        return -1;

    },

    /* =====================================
       LOOKUP ERZEUGEN

       Schlüssel:
       Spieler|Datum

       Beispiel:

       Isa|01.04 -> ja

    ===================================== */

    createLookup(table) {

        const lookup = {};

        // Alle Spieler
        for (let r = 2; r < table.length; r++) {

            const player = table[r][0];

            // Alle Daten
            for (let c = 1; c < table[0].length; c++) {

                const date = table[0][c];
                const value = table[r][c];

                // Nur belegte Felder speichern
                if (value && value !== "") {

                    lookup[player + "|" + date] = value;

                }

            }

        }

        return lookup;

    }

};
