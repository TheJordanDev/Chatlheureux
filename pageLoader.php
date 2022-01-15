<?php
    header('Content-Type: application/json');
    if ($_POST["page"]) {
        echo json_encode(file_get_contents("./pages/".$_POST["page"]));
        return;
    }
    echo json_encode(file_get_contents("_index.html"));
?>