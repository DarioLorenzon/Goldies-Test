/* =====================================
   GOLDIES ADMIN
   Version 2.1.0
===================================== */

const APP = {

  name: "Goldies",

  version: "2.2.0b",

  admin: {

    pin: "1234"

  }

};


/* =====================================
   ADMIN BUTTON
===================================== */

const adminButton = document.createElement("div");

adminButton.innerHTML = "⚙️";

adminButton.style.position = "fixed";
adminButton.style.bottom = "15px";
adminButton.style.right = "15px";
adminButton.style.width = "50px";
adminButton.style.height = "50px";
adminButton.style.borderRadius = "50%";
adminButton.style.background = "#1976d2";
adminButton.style.color = "white";
adminButton.style.fontSize = "28px";
adminButton.style.display = "flex";
adminButton.style.alignItems = "center";
adminButton.style.justifyContent = "center";
adminButton.style.cursor = "pointer";
adminButton.style.boxShadow = "0 2px 8px rgba(0,0,0,.3)";
adminButton.style.zIndex = "9999";

document.body.appendChild(adminButton);



/* =====================================
   ADMIN WINDOW
===================================== */

const adminWindow = document.createElement("div");

adminWindow.style.position = "fixed";
adminWindow.style.top = "50%";
adminWindow.style.left = "50%";
adminWindow.style.transform = "translate(-50%,-50%)";
adminWindow.style.background = "white";
adminWindow.style.border = "1px solid #999";
adminWindow.style.borderRadius = "10px";
adminWindow.style.padding = "20px";
adminWindow.style.minWidth = "320px";
adminWindow.style.boxShadow = "0 5px 20px rgba(0,0,0,.3)";
adminWindow.style.display = "none";
adminWindow.style.zIndex = "10000";

adminWindow.innerHTML = `

<h2 style="margin-top:0">
⚙️ Goldies Admin
</h2>

<button id="btnSync" class="adminBtn">
🔄 CSV synchronisieren
</button><br><br>

<button class="adminBtn">💾 Backup erstellen</button><br><br>

<button class="adminBtn">📂 Backup wiederherstellen</button><br><br>

<button class="adminBtn">📊 Statistik</button><br><br>

<button class="adminBtn">📤 Excel Export</button><br><br>

<button class="adminBtn">⚙️ Einstellungen</button><br><br>

<hr>

<div style="font-size:12px;color:#666">

${APP.name}<br>

Version ${APP.version}

</div>

<br>

<button id="closeAdmin">

Schliessen

</button>

`;

document.body.appendChild(adminWindow);



/* =====================================
   BUTTON STYLE
===================================== */

document.querySelectorAll(".adminBtn").forEach(btn => {

  btn.style.width = "100%";
  btn.style.padding = "8px";
  btn.style.cursor = "pointer";

});


/* =====================================
   BUTTON EVENTS
===================================== */

// CSV Synchronisieren
document
    .getElementById("btnSync")
    .onclick = async () => {

        if (!confirm(
            "CSV mit Firestore synchronisieren?"
        )) return;

        await synchronizeCSV();

    };

/* =====================================
   OPEN
===================================== */

adminButton.onclick = () => {

  const pin = prompt("Admin PIN eingeben");

  if (pin === null) return;

  if (pin !== APP.admin.pin) {

    alert("Falscher PIN");

    return;

  }

  adminWindow.style.display = "block";

};



/* =====================================
   CLOSE
===================================== */

document
.getElementById("closeAdmin")
.onclick = () => {

  adminWindow.style.display = "none";

};


