/* =====================================
   GOLDIES
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

        const csv = await this.loadCSV();

        const dbData = await this.loadFirestore();

        console.log("CSV:", csv);
        console.log("Firestore:", dbData);

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

    }

};
