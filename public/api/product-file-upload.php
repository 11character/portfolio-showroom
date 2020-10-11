<?php
    include './api-login-check.php';
    include '../db.php';
    include './path.php';

    $data = [
        'code' => 99,
        'message' => 'error'
    ];

    if (!empty($_FILES) && !empty($_FILES['file'])) {
        try {
            $file = $_FILES['file'];

            $dir_name = time() . '_' . rand();
            $dir_path = $PRODUCT_FILE_DIR_PATH . '/' . $dir_name;
            $file_name = $file['name'];
            $file_path = $dir_path . '/' . $file_name;

            // 디렉토리를 만든다.
            if (!is_dir($dir_path)) {
                mkdir($dir_path, 0777, true);
            }

            if (move_uploaded_file($file['tmp_name'], $file_path)) {
                $pdo = new PDO($dsn, $db_user_name, $db_user_pwd);
                $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
                $value = [
                    EXT => strtolower(strtolower(pathinfo($file_name)['extension'])),
                    NAME => $_POST['name'],
                    FULL_NAME => $file_name,
                    DIR_PATH => $dir_path,
                    PATH => $file_path,
                    SIZE => $file['size'],
                    DESCRIPTION => isset($_POST['description']) ? $_POST['description'] : ''
                ];
    
                $pdo->prepare($sql_insert_tb_product_file)->execute($value);

                $data['code'] = 0;
                $data['message'] = 'success';
            };
        } catch(Exception $e) {
            $data['code'] = 99;

            $data['message'] = $e->getMessage();
            if ($return_db_error) {
            }
        }
    }

    echo json_encode($data);
?>