<?php
    include './login-check.php';
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="stylesheet" href="./dist/index.css">

    <title>admin</title>
</head>
<body>
    <div id="root">
        <router-view></router-view>
    </div>

    <script src="./dist/index.js"></script>
</body>
</html>