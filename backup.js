/* =====================================
   GOLDIES
-------------------------------------

Datei:
backup.js

Version:
3.0.0

Beschreibung:
- Tages-Backup
- Wiederherstellen
- CSV synchronisieren

===================================== */


async function createDailyBackup() {

    const today =
        new Date()
            .toISOString()
            .substring(0, 10);

    const backupRef =
        db.collection("backup").doc(today);

    const backupDoc =
        await backupRef.get();

    // Existiert bereits → nichts machen
    if (backupDoc.exists) {

        return;

    }

    // Aktuelle Daten lesen
    const doc = await db
        .collection("training")
        .doc("list")
        .get();

    if (!doc.exists) {

        return;

    }

    // Backup speichern
    await backupRef.set({

        created: firebase.firestore.FieldValue.serverTimestamp(),

        version: "3.0.0",

        json: doc.data().json || "",

        comments: doc.data().comments || {}

    });


}


async function listBackups() {

    try {

        const snapshot = await db
            .collection("backup")
            .get();

        const backups = [];

        snapshot.forEach(doc => {

            backups.push(doc.id);

        });

        // Neueste zuerst
        backups.sort().reverse();

        return backups;

    }

    catch (err) {

        console.error(err);

        return [];

    }

}


async function restoreBackup() {

    // Alle Backups lesen
    const backups = await listBackups();

    if (backups.length === 0) {

        alert("Keine Backups vorhanden.");

        return;

    }

    // Backup auswählen
    const selected = prompt(

        "Welches Backup wiederherstellen?\n\n" +

        backups.join("\n")

    );

    if (!selected)
        return;

    // Backup laden
    const doc = await db
        .collection("backup")
        .doc(selected)
        .get();

    if (!doc.exists) {

        alert("Backup nicht gefunden.");

        return;

    }

    // Sicherheit
    if (!confirm("Backup " + selected + " wirklich wiederherstellen?"))
        return;

    // Training überschreiben
    await db
        .collection("training")
        .doc("list")
        .set({

            json: doc.data().json,

            comments: doc.data().comments || {}

        });

    // Neu laden
    await load();

    alert("Backup erfolgreich wiederhergestellt.");

}

async function synchronizeCSV() {

    try {

        // Tages-Backup erstellen
        await createDailyBackup();

        // CSV einlesen
        const csv = await loadCSV();

        // Firestore lesen
        const doc = await db
            .collection("training")
            .doc("list")
            .get();

        let dbData = [];

        if (doc.exists && doc.data().json) {

            dbData = JSON.parse(doc.data().json);

        }

        // Daten zusammenführen
        const merged = mergeData(csv, dbData);

        // Kommentare beibehalten
        const comments = doc.exists
            ? (doc.data().comments || {})
            : {};

        // Firestore speichern
        await db
            .collection("training")
            .doc("list")
            .set({

                json: JSON.stringify(merged),
                comments: comments

            });

        // Tabelle neu laden
        await load();

        alert("CSV erfolgreich synchronisiert.");

    }

    catch (err) {

        console.error(err);

        alert("Fehler beim Synchronisieren.");

    }

}

