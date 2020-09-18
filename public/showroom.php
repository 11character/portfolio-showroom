<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="stylesheet" href="./dist/showroom/showroom.css">

    <style>
        @font-face {
            font-family: NeueMachinaLight;
            src: url('./font/neue-machina-light/NeueMachina-Light.woff2') format("woff2"),
                url('./font/neue-machina-light/NeueMachina-Light.woff') format("woff")
        }

        @font-face {
            font-family: NeueMachina;
            src: url('./font/neue-machina-regular/NeueMachina-Regular.woff2') format("woff2"),
                url('./font/neue-machina-regular/NeueMachina-Regular.woff') format("woff")
        }

        @font-face {
            font-family: NeueMachinaUltrabold;
            src: url('./font/neue-machina-ultrabold/NeueMachina-Ultrabold.woff2') format("woff2"),
                url('./font/neue-machina-ultrabold/NeueMachina-Ultrabold.woff') format("woff")
        }

        .font-neuemachina-light {
            font-family: NeueMachina !important;
        }

        .font-neuemachina {
            font-family: NeueMachina !important;
        }

        .font-neuemachina-ultrabold {
            font-family: NeueMachinaUltrabold !important;
        }
    </style>

    <title>showroom</title>
</head>
<body style="overflow: hidden">
    <div id="root">
        <router-view></router-view>
    </div>

    <script src="./dist/showroom/showroom.js"></script>
</body>
</html>