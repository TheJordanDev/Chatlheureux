const emailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var registering = true;
var inputsSaved = [];

async function register() {
    let nameDOM = $("#name");
    let emailDOM = $("#mail");
    let passwordDOM = $("#password");
    let name = nameDOM.val();
    let email = emailDOM.val().split(" ").join("");
    let password = passwordDOM.val();
    if (name === "") return loginError("Veuillez entrer un nom.");
    if (email === "" || email.match(emailregex) === null) return loginError("L'E-Mail que vous avez entrer est incorect");
    if (password === "") return loginError("Veuillez entrer un mot de passe.");
    let auth = firebase.auth();
    auth.createUserWithEmailAndPassword(email, password)
        .then(async userData => {
            var currentUser = userData.user;
            await currentUser.updateProfile({ displayName: firstname.value });
        })
        .catch(error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            loginError(errorCode + ": " + errorMessage);
        });
}

async function login() {
    let emailDOM = $("#mail");
    let passwordDOM = $("#password");
    let email = emailDOM.val().split(" ").join("");
    let password = passwordDOM.val();
    if (email === "" || email.match(emailregex) === null) return loginError("L'E-Mail que vous avez entrer est incorect");
    if (password === "") return loginError("Veuillez entrer un mot de passe.");
    let auth = firebase.auth();
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {})
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            loginError(errorCode + ": " + errorMessage);
        });
}

function loginError(error) {
    let errorMessage = $("#error");
    if (error) {
        errorMessage.html(error);
        errorMessage.removeAttr("hidden");
    } else {
        errorMessage.attr("hidden", true);
    }
}

function logout() {
    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
        firebase.auth().signOut();
        registering = true;
    }
}

async function setupAccountPage() {
    //$("body").css("background-image", ""/*url(./assets/profile_bg.jpg)*/);
    $("#mail").keyup(()=>{
        let emailMatch = $("#mail").val().match(emailregex);
        if (emailMatch === null) $("#mail").addClass("badInput");
        else $("#mail").removeClass("badInput");
    });
    $("#currentPage").html((registering) ? "INSCRIPTION" : "CONNEXION")
}

function switchLogin() {
    saveInput("#mail");
    saveInput("#password");
    saveInput("#passwordToggle");
    if (registering) $.post("./pageLoader.php", { page: "login.html" }).then((data) => { loadPage("#content", data); loadInputs(); });
    else $.post("./pageLoader.php", { page: "register.html" }).then((data) => { loadPage("#content", data); loadInputs(); });
    registering = !registering;
}

function saveInput(id) {
    inputsSaved.push({
        "id":id,
        "classes":$(id).attr("class"),
        "value":$(id).val()
    })
}

function loadInputs() {
    for (let input of inputsSaved) {
        loadInput(input);
    }
}

function loadInput(input) {
    $(input["id"]).val(input["value"]);
    $(input["id"]).attr("class", input["classes"]);
}