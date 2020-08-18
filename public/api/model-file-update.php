<?php
    include './api-login-check.php';
    include '../db.php';
    include './path.php';

    $data = [
        'code' => 99,
        'message' => 'error'
    ];

    if (!empty($_POST)) {
        try {
            // 값 저장.
            $pdo = new PDO($dsn, $db_user_name, $db_user_pwd);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $value = [
                SEQ_ID => $_POST['seqId'],
                EXT => $_POST['ext'],
                NAME => $_POST['name'],
                FULL_NAME => $_POST['fullName'],
                DIR_PATH => $_POST['dirPath'],
                PATH => $_POST['path'],
                DIR_URL => $_POST['dirUrl'],
                URL => $_POST['url'],
                SIZE => $_POST['size'],
                DESCRIPTION => $_POST['description'],
                DATA => $_POST['data']
            ];

            $pdo->prepare($sql_update_tb_model_file)->execute($value);

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