<?php
    include './api-login-check.php';
    include '../db.php';
    include './path.php';

    // 디렉토리 제거.
    function delete_dir($path) {
        if (is_dir($path)) {
            if (substr($path, strlen($path) - 1, 1) != '/') {
                $path .= '/';
            }

            $files = glob($path . '*', $GLOB_MARK);

            foreach ($files as $file) {
                if (is_dir($file)) {
                    delete_dir($file);

                } else {
                    unlink($file);
                }
            }

            rmdir($path);
        }
    }

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

            $pdo->prepare($sql_delete_tb_showroom)->execute($value);

            // 관련 디렉토리를 제거한다.
            $dir_path = $SHOWROOM_FILE_DIR_PATH . '/' . $seq_id;

            if (is_dir($dir_path)) {
                delete_dir($dir_path);
            }

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