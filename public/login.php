<?php
    session_start();

    if (isset($_SESSION['is_login'])) {
        header('Location: ./');
    }
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="stylesheet" href="./dist/login/login.css">

    <title>admin</title>
</head>
<body>
    <div id="container" class="container-fluid my-3 my-lg-5">
        <div class="row">
            <div class="card offset-1 offset-lg-3 col-10 col-lg-6 px-0">
                <div class="card-header">
                    <div class="col-12 h4">
                        Login
                    </div>
                </div>
                <div class="card-body">
                    <form action="./login-action.php" method="post">
                        <div class="form-group">
                            <label for="user">User</label>
                            <input type="text" id="user" class="form-control" name="user" maxlength="64" autocomplete="off" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" class="form-control" name="password" maxlength="64" autocomplete="off" required>
                        </div>

                        <button type="submit" class="offset-lg-9 col-lg-3 btn btn-secondary">Login</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="./dist/login/login.js"></script>
</body>
</html>