<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="stylesheet" href="./dist/showroom/showroom.css">
    <link rel="stylesheet" href="./css/common.css">

    <title>Showroom</title>
</head>
<body style="overflow: hidden" oncontextmenu="return false" ondragstart="return false" onselectstart="return false">
    <div id="root">
        <router-view></router-view>
    </div>

    <script src="./dist/detect.js"></script>
    <script src="./dist/showroom/showroom.js"></script>
</body>
</html>