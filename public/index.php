<?php
    include './login-check.php';
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="stylesheet" href="./dist/index/index.css">
    <link rel="stylesheet" href="./css/common.css">

    <title>showroom</title>
</head>
<body>
    <div id="root">
        <router-view></router-view>
    </div>

    <script src="./dist/detect.js"></script>
    <script src="./dist/index/index.js"></script>
</body>
</html>