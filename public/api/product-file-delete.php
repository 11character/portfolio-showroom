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

            if ($pdo->prepare($sql_delete_tb_product_file)->execute($value)) {
                // 관련 디렉토리를 제거한다.
                $dir_path = $_POST['dirPath'];
    
                if (is_dir($dir_path)) {
                    utils_delete_dir($dir_path);
                }
    
                $data['code'] = 0;
                $data['message'] = 'success';
            }
        } catch(Exception $e) {
            if ($return_db_error) {
                $data['message'] = $e->getMessage();
            }
        }
    }

    echo json_encode($data);
?>