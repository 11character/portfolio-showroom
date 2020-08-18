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
            $mimetype = $file['type'];

            $zip_mime = 'application/zip application/octet-stream application/x-zip-compressed multipart/x-zip';

            if (strpos($zip_mime, $mimetype) !== false) {
                $dir_name = time() . '_' . rand();
                $dir_path = $MODEL_FILE_DIR_PATH . '/' . $dir_name;
                $file_name = $file['name'];
                $file_path = $dir_path . '/' . $file_name;
                $temp_path = $file['tmp_name'];

                // 디렉토리를 만든다.
                if (!is_dir($dir_path)) {
                    mkdir($dir_path, 0777, true);
                }

                // 압축파일을 넣는다.
                $data['code'] = move_uploaded_file($temp_path, $file_path) ? 0 : 99;

                if ($data['code'] == 0) {
                    // 압축을 푼다.
                    $zip = new ZipArchive();
                    if ($zip->open($file_path)) {
                        $zip->extractTo($dir_path);
                        $zip->close();
                    }

                    // 압축파일을 제거한다.
                    unlink($file_path);

                    // 정보를 준비한다.
                    $file_list = scandir($dir_path);
                    $has_file = false;
                    $name = $_POST['name'];
                    $ext = '';
                    $full_name = '';

                    // 압축파일 하나에 하나의 파일.
                    // 이미지와 3D파일이 같이 있는 경우 3D파일을 선택한다.
                    foreach ($file_list as $path) {
                        $path_info = pathinfo($path);
                        $file_extension = strtolower($path_info['extension']);

                        if (strpos('jpg jpeg png gif', $file_extension) !== false) {
                            $has_file = true;
                            $ext = $file_extension;
                            $full_name = $path_info['basename'];

                        } else if (strpos('fbx stl obj gltf glb dae', $file_extension) !== false) {
                            $has_file = true;
                            $ext = $file_extension;
                            $full_name = $path_info['basename'];
                            break;
                        }
                    }

                    if ($has_file) {
                        $pdo = new PDO($dsn, $db_user_name, $db_user_pwd);
                        $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
                        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                        $dir_url = $MODEL_FILE_DIR . '/' . $dir_name;

                        $value = [
                            EXT => $ext,
                            NAME => $name,
                            FULL_NAME => $full_name,
                            DIR_PATH => $dir_path,
                            PATH => $dir_path . '/' . $full_name,
                            DIR_URL => $dir_url,
                            URL => $dir_url . '/' . $full_name,
                            SIZE => $file['size'],
                            DESCRIPTION => isset($_POST['description']) ? $_POST['description'] : '',
                            DATA => ''
                        ];

                        $pdo->prepare($sql_insert_tb_model_file)->execute($value);
                        $data['message'] = 'success';

                    } else {
                        $data['code'] = 99;
                    }
                }
            }
        } catch(Exception $e) {
            $data['code'] = 99;

            $data['message'] = $e->getMessage();
            if ($return_db_error) {
            }
        }
    }

    echo json_encode($data);
?>