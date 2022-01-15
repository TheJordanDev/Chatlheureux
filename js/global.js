function loadPage(content,html) {
    $(content).html(html);
}

function togglePasssword(id) {
    var x = document.getElementById(id);
    if (x.type === "password") x.type = "text";
    else x.type = "password";
}

function getCurrentUser(auth) {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        }, reject);
    });
}