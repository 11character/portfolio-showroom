<?php
    include './api-login-check.php';
    include '../db.php';
    include './path.php';
    include './utils.php';

    $data = [
        'code' => 99,
        'message' => 'error'
    ];

    if (!empty($_POST)) {
        try {
            $seq_id = $_POST['seqId'];

            $pdo = new PDO($dsn, $db_user_name, $db_user_pwd);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $value = [
                SEQ_ID => $seq_id
            ];

            $pdo->prepare($sql_delete_tb_product_key)->execute($value);

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