class User {
    constructor(cats) {
        this.cats = cats;
    }
}

var userConverter = {
    toFirestore: function (user) {
        return {
            cats: user.cats
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new User(data.cats);
    }
};

async function setupProfile() {
    $("body").css("background-image", "url(./assets/profile_bg.jpg)");
    $("#currentPage").html("VOUS");
    setupProfilePage();
}

async function setupProfilePage() {
    let content = document.getElementById("catList");
    let currentUser = await getCurrentUser(firebase.auth());
    if (!currentUser) return console.log("No user");
    content.innerHTML = "<h2>CHARGEMENT DES CHATS ...</h2>";
    let db = firebase.firestore();
    let usersData = db.collection("users").doc(currentUser["uid"]);
    let cats = db.collection("chats");
    let loadedCats = []
    usersData
        .withConverter(userConverter)
        .get()
        .then(async doc => {
            if (!doc.exists) {
                console.log("NO DOC")
                await db
                    .collection("users")
                    .doc(currentUser["uid"])
                    .set({ cats: [] });
                setupProfilePage();
            } else {
                let user = doc.data();
                if (user.cats.length === 0) {
                    content.innerHTML = "<h2>Vous n'avez pas de chat.<br>😥</h2>";
                } else {
                    
                    content.innerHTML = "";
                    let element_number = 1;
                    let total_shown = 0;
                    let currentRow = document.createElement("div");
                    currentRow.classList.add("cat-row");
                    for (const catId of user.cats) {
                        let chat = await cats.doc(catId).get();
                        let catB = document.createElement("div");
                        catB.classList.add("catInfo", "cat-cell","catBox"+element_number);
                        let catImage = document.createElement("img");
                        catImage.classList.add("catProfilePicture");
                        catImage.src = "./assets/no-icon.png";
                        catImage.alt = catId;
                        catImage.onclick = ()=>{ goToCatProfile(catId, chat.data()); }
                        catImage.setAttribute("width", "200px");
                        catB.appendChild(catImage);
                        let catName = document.createElement("div");
                        catName.classList.add("catName");
                        catName.innerHTML = chat.data().name;
                        catB.appendChild(catName);
                        currentRow.appendChild(catB);
                        element_number += 1;
                        if (element_number > 3) {
                            content.appendChild(currentRow);
                            content.appendChild(document.createElement("br"));
                            content.appendChild(document.createElement("br"));
                            currentRow = document.createElement("div");
                            currentRow.classList.add("cat-row");
                            element_number = 1;
                        }
                        total_shown += 1;
                    }
                    if (total_shown % 3 !== 0) {
                        content.appendChild(currentRow);
                    }
                }
            }
        });
        /*$("body").click( async (e)=>{
            if ($(e.target).is(".catProfilePicture")) {
                goToCatProfile($(e.target).attr("alt"));
            }
        });*/
}

async function goToCatProfile(catId,catData) {
    window.localStorage.setItem("wantedCat", JSON.stringify({id:catId,data:catData}));
    $.post("./pageLoader.php", { page: "catProfile.html" }).then(data => { loadPage("#content", data); });
}