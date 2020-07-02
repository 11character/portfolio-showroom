<?php
    include './api-login-check.php';

    $url = $_GET['url'];

    $content = file_get_contents($url);

    if ($content === false) {
        $content = abort(404);
    }

    echo $content;
?>