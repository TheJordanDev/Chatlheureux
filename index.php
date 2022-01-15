<html>

<head>
    <title>CHATLEUREUX</title>
    <link rel="stylesheet" href="./css/global.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <meta name="viewport" content="width=device-width, height=device-height">
    <meta charset="UTF-8">
    <script src="./js/global.js"></script>
    <link rel="icon" href="favicon.ico" />
    <script src="https://kit.fontawesome.com/ffce3785b3.js" crossorigin="anonymous"></script>
</head>

<body style="background-image: url(./assets/profile_bg.jpg);">
    <script src="https://www.gstatic.com/firebasejs/8.4.2/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.4.2/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.4.2/firebase-firestore.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.4.2/firebase-analytics.js"></script>
    <script>
        var firebaseConfig = {
            apiKey: "AIzaSyC9uNV_8ufEmmhFPzrlGXrmE35bsSbwKIc",
            authDomain: "catweight-1e385.firebaseapp.com",
            databaseURL: "https://catweight-1e385.firebaseio.com",
            projectId: "catweight-1e385",
            storageBucket: "catweight-1e385.appspot.com",
            messagingSenderId: "589022253744",
            appId: "1:589022253744:web:7b5b5919fe2860154ee175",
            measurementId: "G-KC2K7TVDDR"
        };
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
        var auth = firebase.auth();
        auth.onAuthStateChanged(function(user) {
            if (user) {
                if (window.localStorage.getItem("wantedCat") === null) {
                    $.post("./pageLoader.php", {
                        page: "profile.html"
                    }).then((data) => {
                        loadPage("#content", data);
                    });
                } else {
                    $.post("./pageLoader.php", {
                        page: "catProfile.html"
                    }).then(data => {
                        loadPage("#content", data);
                    });
                }
            } else {
                $.post("./pageLoader.php", {
                    page: "register.html"
                }).then((data) => {
                    loadPage("#content", data);
                });
                localStorage.removeItem("wantedCat");
            }
        });
    </script>
    <div class="entete">
        <img class="enteteElement" src="./assets/logo_boule HD.png" alt="LOGO" style="max-width: 75px; margin-top: 5px; margin-bottom: 5px; ">
        <b>
            <h1 id="currentPage">CHATLEUREUX</h1>
        </b>
        <br>
    </div>
    <br>
    <div id="content" class="content">
        <br><br><br><br>
        <h1>CHARGEMENT...</h1>
    </div>
    <script src="./js/account.js"></script>
    <script src="./js/profile.js"></script>
    <script src="./js/cat.js"></script>
    <script>
        /*var viewport = document.querySelector("meta[name=viewport]");
        viewport.setAttribute("content", viewport.content + ", height=" + window.innerHeight + ", width=" + window.innerWidth);*/
    </script>
</body>

</html>