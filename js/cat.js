async function goBackToProfile() {
    localStorage.removeItem("wantedCat");
    $.post("./pageLoader.php", { page: "profile.html" }).then(data => {
        loadPage("#content", data);
    });
}

async function gotoNewCat() {
    $.post("./pageLoader.php", { page: "newCat.html" }).then(data => { loadPage("#content", data); });
}

async function setupNewCatPage() {
    //$("body").css("background-image", "");
    $("#currentPage").html("Nouveau Chat");
    let datalist = document.getElementById("cat_races");
    let injected = "";
    let races = await fetch("./races.json");
    let json = JSON.parse(await races.text());
    for (let race of json) { injected += '<option value="' + race + '">'; }
    datalist.innerHTML = injected;
    //Limiter la date de naissance à aujourd'hui max.
    var today = new Date();
    var dd = today.getDate(); 
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    today = yyyy + "-" + mm + "-" + dd;
    document.getElementById("cat_birth").setAttribute("max", today);
}

async function newCat() {
    let catNameDOM = $("#cat_name"); let catName = catNameDOM.val();
    let catGenderDOM = $("#cat_gender"); let catGender = catGenderDOM.val();
    let catBirthDayDOM = $("#cat_birth"); let catBirthDay = catBirthDayDOM.val();
    let catRaceDOM = $("#cat_race"); let catRace = catRaceDOM.val();
    if (catName === "") return creationError("Veuillez entrer un nom.");
    if (catGender === "-1") return creationError("Veuillez choisir un genre.");
    if (catBirthDay === "") return creationError("Veuillez choisir un date de naissance.");
    if (catRace === "") return creationError("Veuillez choisir une race.");
    return registerCat({name:catName,gender:catGender,birthday:catBirthDay,race:catRace});
}

async function loadCatProfile() {
    let wantedCat = JSON.parse(window.localStorage.getItem("wantedCat"));
    let id = wantedCat.id;
    let currentUser = await getCurrentUser(await firebase.auth());
    let db = await firebase.firestore();
    db.collection("users")
        .where("cats", "array-contains",id)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if (doc.id === currentUser.uid) {
                    let data = wantedCat.data;
                    $("body").css("background-image", "url(./assets/profile_bg.jpg)");
                    $("#currentPage").html(data.name);
                    let deleteBtn = document.createElement("button");
                    deleteBtn.classList.add("actionBtn");
                    deleteBtn.id = "delete";
                    deleteBtn.onclick = () =>{deleteCurrentCat();}
                    let deleteIcon = document.createElement("i");
                    deleteIcon.style = "color: #F22A2A; border: 2px !important; margin: 2px;";
                    deleteIcon.classList.add("fas","fa-trash-alt","fa-3x");
                    deleteBtn.appendChild(deleteIcon);
                    document.getElementById("toolbar").appendChild(deleteBtn);
                    stats();
                    return;
                }
            });
        })
        .catch(error => {
            goBackToProfile();
        });
}

async function registerCat(data) {
    document.getElementById("create").disabled = true;
    if (!data) return;
    let db = await firebase.firestore();
    var auth = await firebase.auth();
    let currentUser = await getCurrentUser(auth);
    let cat = await db.collection("chats").doc();
    await cat.set(data);
    let catID = cat.id;
    let userDoc = await db.collection("users").doc(currentUser["uid"]);
    await userDoc.update("cats",firebase.firestore.FieldValue.arrayUnion(catID));
    $.post("./pageLoader.php", { page: "profile.html" }).then(data => {loadPage("#content", data);});
}

async function stats() {

}

async function creationError(errorMessage) {
    console.log(errorMessage);
    let messageDOM = $("#error");
    if (errorMessage) {
        messageDOM.html(errorMessage);
        messageDOM.removeAttr("hidden");
    } else {
        messageDOM.attr("hidden", true);
    }
}

async function deleteCurrentCat() {
    let wantedCat = JSON.parse(localStorage.getItem("wantedCat"));
    if (confirm("Voulez vous supprimer "+wantedCat.data.name+ " ?")) {
        let currentUser = await getCurrentUser(firebase.auth());
        let id = wantedCat.id;
        let db = await firebase.firestore();
        let userDoc = await db.collection("users").doc(currentUser.uid);
        await userDoc.update("cats",firebase.firestore.FieldValue.arrayRemove(id));
        let catDoc = await db.collection("chats").doc(id);
        await catDoc.delete();
        goBackToProfile();
    }
}