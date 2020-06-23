<?php
    include './db.php';

    session_start();

    if (isset($_POST['user']) && isset($_POST['password'])) {
        try {
            $pdo = new PDO($dsn, $db_user_name, $db_user_pwd);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $value = [
                ':USER' => $_POST['user'],
                ':PASSWORD' => $_POST['password']
            ];

            $stmt = $pdo->prepare($sql_select_tb_user);
            $stmt->execute($value);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (count($result) > 0 && isset($result[0]['USER'])) {
                $_SESSION['is_login'] = true;
                $_SESSION['user'] = $result[0]['USER'];

                header('Location: ./');

            } else {
                header('Location: ./login.php');
            }

        } catch(Exception $e) {
            header('Location: ./login.php');
        }

    } else {
        header('Location: ./login.php');
    }
?>