<?php
    include './api-login-check.php';
    include '../db.php';

    $data = [
        'code' => 99,
        'message' => 'error'
    ];

    if (!empty($_POST)) {
        try {
            $pdo = new PDO($dsn, $db_user_name, $db_user_pwd);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $value = [
                SEQ_ID => $_POST['seqId'],
                NAME => $_POST['name'],
                DESCRIPTION => $_POST['description'],
                IMG_URL => $_POST['imgUrl'],
                BGM_URL => $_POST['bgmUrl'],
                CONTENT_KO => $_POST['contentKo'],
                CONTENT_EN => $_POST['contentEn'],
                DATA => $_POST['data']
            ];

            $pdo->prepare($sql_update_tb_showroom)->execute($value);

            $data['code'] = 0;
            $data['message'] = 'success';

        } catch(Exception $e) {
            if ($return_db_error) {
                $data['message'] = $e->getMessage();
            }
        }
    }

    echo json_encode($data);
?>